
"use client";

import { useEffect, useState, useRef } from "react";
import AppLayout from "@/components/app-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { useLocalStorage } from "@/hooks/use-local-storage";
import type { HistoryItem } from "@/types";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { Copy, Download, ArrowLeft, History, Trash2, ShieldAlert } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import jsPDF from "jspdf";
import { useRouter } from "next/navigation";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import Image from "next/image";


export default function HistoryPage() {
  const [history, setHistory] = useLocalStorage<HistoryItem[]>("pintarai-history", []);
  const [isMounted, setIsMounted] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleCopy = (item: HistoryItem) => {
    const textToCopy = `Pertanyaan:
${item.questionText}

Jawaban AI:
${item.answer}`;
    navigator.clipboard.writeText(textToCopy);
    toast({
      title: "Tersalin!",
      description: "Riwayat pertanyaan dan jawaban telah disalin ke clipboard.",
    });
  };

  const handleDownloadPdf = (item: HistoryItem) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 15;
    const contentWidth = pageWidth - margin * 2;
    let y = 20;

    // Header
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("PintarAI - Dokumen Jawaban", pageWidth / 2, y, { align: "center" });
    y += 10;
    doc.setLineWidth(0.5);
    doc.line(margin, y, pageWidth - margin, y);
    y += 10;
    
    // Metadata
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(`ID Sesi: ${item.id}`, margin, y);
    doc.text(`Tanggal: ${format(new Date(item.timestamp), "dd MMMM yyyy, HH:mm")}`, pageWidth - margin, y, { align: "right" });
    y += 7;
    doc.text(`Jenjang: ${item.classLevel}`, margin, y);
    doc.text(`Pelajaran: ${item.subject}`, pageWidth - margin, y, { align: "right" });
    y += 10;

    // Question Section
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("Pertanyaan Pengguna:", margin, y);
    y += 6;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    const questionLines = doc.splitTextToSize(item.questionText, contentWidth);
    doc.text(questionLines, margin, y);
    y += questionLines.length * 6 + 10;

    // Attached File Section
    if (item.uploadedFileUri && item.uploadedFileUri.startsWith('data:image')) {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(12);
        doc.text("File Terlampir:", margin, y);
        y += 6;
        try {
            const img = new (window as any).Image();
            img.src = item.uploadedFileUri;
            const imgProps = doc.getImageProperties(item.uploadedFileUri);
            const imgRatio = imgProps.width / imgProps.height;
            let imgWidth = contentWidth / 2;
            let imgHeight = imgWidth / imgRatio;
            
            // check if there is enough space, if not add new page
            if (y + imgHeight > 280) {
                doc.addPage();
                y = 20;
            }

            doc.addImage(item.uploadedFileUri, 'JPEG', margin, y, imgWidth, imgHeight);
            y += imgHeight + 10;
        } catch (e) {
            console.error("Error adding image to PDF:", e);
            doc.setFont("helvetica", "italic");
            doc.setFontSize(10);
            doc.text("Tidak dapat menampilkan gambar pratinjau.", margin, y);
            y+= 10;
        }
    } else if (item.fileName) {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(12);
        doc.text("File Terlampir:", margin, y);
        y += 6;
        doc.setFont("helvetica", "italic");
        doc.setFontSize(10);
        doc.text(item.fileName, margin, y);
        y+= 10;
    }


    // Answer Section
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("Jawaban dari AI:", margin, y);
    y += 6;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    const answerLines = doc.splitTextToSize(item.answer, contentWidth);
    doc.text(answerLines, margin, y);
    y += answerLines.length * 6 + 15;

    // Footer
    const pageCount = doc.internal.pages.length;
    for(let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setLineWidth(0.2);
        doc.line(margin, 280, pageWidth - margin, 280);
        doc.setFontSize(8);
        doc.text(`Dokumen ini dibuat secara otomatis oleh PintarAI | Halaman ${i} dari ${pageCount}`, pageWidth / 2, 285, { align: "center" });
    }

    doc.save(`PintarAI - ${item.summary.slice(0, 20)}.pdf`);
    toast({
        title: "Mengunduh PDF",
        description: "File PDF Anda sedang dibuat.",
    });
  };

  const handleClearHistory = () => {
    setHistory([]);
    toast({
        title: "Riwayat Dihapus",
        description: "Semua riwayat pertanyaan Anda telah dihapus.",
    });
  };
  
  if (!isMounted) {
    return (
      <AppLayout>
        <div className="space-y-4">
          <Skeleton className="h-10 w-1/4" />
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-5/6" />
                <Skeleton className="h-6 w-full" />
              </div>
            </CardContent>
          </Card>
        </div>
      </AppLayout>
    );
  }

  const sortedHistory = [...history].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  return (
    <AppLayout>
        <div className="flex items-start sm:items-center justify-between gap-4 mb-4 flex-col sm:flex-row">
            <div className="flex items-center gap-4">
                <Button variant="outline" size="icon" onClick={() => router.back()} className="shrink-0">
                    <ArrowLeft className="h-4 w-4" />
                    <span className="sr-only">Kembali</span>
                </Button>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Riwayat Pertanyaan</h1>
                    <p className="text-muted-foreground">Lihat semua pertanyaan yang pernah Anda ajukan sebelumnya.</p>
                </div>
            </div>
            {sortedHistory.length > 0 && (
                 <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button variant="destructive" className="w-full sm:w-auto">
                            <Trash2 />
                            Hapus Semua Riwayat
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                        <AlertDialogTitle>Apakah Anda benar-benar yakin?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Tindakan ini tidak dapat dibatalkan. Ini akan menghapus semua riwayat pertanyaan Anda secara permanen dari perangkat ini.
                        </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction onClick={handleClearHistory}>Lanjutkan</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            )}
        </div>
        <p className="text-xs text-muted-foreground mb-4 italic text-center sm:text-left">
            Info: Riwayat pertanyaan Anda disimpan secara aman di penyimpanan internal browser pada perangkat yang Anda gunakan saat ini.
        </p>
      <Card className="border-0 shadow-none bg-transparent">
        <CardContent className="p-0">
          {sortedHistory.length > 0 ? (
            <Accordion type="single" collapsible className="w-full">
              {sortedHistory.map((item) => (
                <AccordionItem value={item.id} key={item.id} className="border-secondary">
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex flex-col items-start text-left">
                      <p className="font-semibold text-base">{item.summary}</p>
                      <p className="text-sm text-muted-foreground">
                        {item.classLevel} &middot; {item.subject} &middot; {format(new Date(item.timestamp), "PPP p")}
                      </p>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-6 p-4 bg-secondary/50 rounded-lg">
                      <div>
                        <h4 className="font-semibold text-base mb-2">Pertanyaan Anda:</h4>
                        <p className="text-sm whitespace-pre-wrap font-sans text-muted-foreground">{item.questionText}</p>
                         {item.uploadedFileUri && item.uploadedFileUri.startsWith('data:image') && (
                            <div className="mt-4 relative w-full max-w-xs h-48 border rounded-md overflow-hidden">
                                <Image src={item.uploadedFileUri} alt="Lampiran file" layout="fill" objectFit="contain" />
                            </div>
                        )}
                        {item.fileName && !item.uploadedFileUri?.startsWith('data:image') && (
                            <p className="text-sm text-muted-foreground mt-2">File terlampir: {item.fileName}</p>
                        )}
                      </div>
                      <div>
                        <h4 className="font-semibold text-base mb-2">Jawaban AI:</h4>
                        <div className="prose prose-sm max-w-none text-sm whitespace-pre-wrap font-sans text-muted-foreground">{item.answer}</div>
                      </div>
                    </div>
                    <div className="mt-4 flex items-center justify-end gap-2">
                       <Button variant="outline" size="sm" onClick={() => handleCopy(item)}>
                        <Copy className="mr-2 h-4 w-4" />
                        Salin
                       </Button>
                       <Button variant="outline" size="sm" onClick={() => handleDownloadPdf(item)}>
                        <Download className="mr-2 h-4 w-4" />
                        Unduh PDF
                       </Button>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          ) : (
            <div className="text-center py-16 text-muted-foreground border-2 border-dashed border-secondary rounded-lg">
              <History className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold">Riwayat Kosong</h3>
              <p className="mt-2 text-sm">Mulai ajukan pertanyaan dan riwayat Anda akan muncul di sini.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </AppLayout>
  );
}

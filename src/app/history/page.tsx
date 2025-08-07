
"use client";

import { useEffect, useState } from "react";
import AppLayout from "@/components/app-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { useLocalStorage } from "@/hooks/use-local-storage";
import type { ChatSession, QAPair } from "@/types";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { Skeleton } from "@/components/ui/skeleton";
import { Copy, Download, ArrowLeft, History, Trash2, BrainCircuit } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import jsPDF from "jspdf";
import { useRouter } from "next/navigation";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import Image from "next/image";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/context/auth-provider";


export default function HistoryPage() {
  const [history, setHistory] = useLocalStorage<ChatSession[]>("pintarai-history", []);
  const [isMounted, setIsMounted] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  const getAvatarFallback = () => {
    if (user?.displayName) {
      return user.displayName.charAt(0).toUpperCase();
    }
    if (user?.email) {
      return user.email.charAt(0).toUpperCase();
    }
    return 'U';
  }

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Tersalin!",
      description: "Teks telah disalin ke clipboard.",
    });
  };

  const handleDownloadPdf = (session: ChatSession) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 15;
    const contentWidth = pageWidth - margin * 2;
    let y = 20;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("PintarAI - Riwayat Percakapan", pageWidth / 2, y, { align: "center" });
    y += 10;
    doc.setLineWidth(0.5);
    doc.line(margin, y, pageWidth - margin, y);
    y += 10;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(`ID Sesi: ${session.id}`, margin, y);
    doc.text(`Tanggal Mulai: ${format(new Date(session.startTime), "dd MMMM yyyy, HH:mm", { locale: id })}`, pageWidth - margin, y, { align: "right" });
    y += 7;
    doc.text(`Jenjang: ${session.classLevel}`, margin, y);
    doc.text(`Pelajaran: ${session.subject}`, pageWidth - margin, y, { align: "right" });
    y += 15;

    session.messages.forEach((item, index) => {
      // Add a page break if content will overflow
      const questionHeight = doc.splitTextToSize(item.questionText, contentWidth).length * 6;
      const answerHeight = doc.splitTextToSize(item.answer, contentWidth).length * 6;
      if (y + questionHeight + answerHeight > 280) {
        doc.addPage();
        y = 20;
      }
      
      // Question
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.text(`Pertanyaan #${index + 1}:`, margin, y);
      y += 6;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);
      const questionLines = doc.splitTextToSize(item.questionText, contentWidth);
      doc.text(questionLines, margin, y);
      y += questionLines.length * 6 + 10;
      
       // Attached File
      if (item.uploadedFileUri && item.uploadedFileUri.startsWith('data:image')) {
          doc.setFont("helvetica", "bold");
          doc.setFontSize(12);
          doc.text("File Terlampir (Pertanyaan):", margin, y);
          y += 6;
          try {
              const imgProps = doc.getImageProperties(item.uploadedFileUri);
              const imgRatio = imgProps.width / imgProps.height;
              let imgWidth = contentWidth / 2.5;
              let imgHeight = imgWidth / imgRatio;
              if (y + imgHeight > 280) { doc.addPage(); y = 20; }
              doc.addImage(item.uploadedFileUri, 'JPEG', margin, y, imgWidth, imgHeight);
              y += imgHeight + 10;
          } catch (e) {
              doc.setFont("helvetica", "italic").setFontSize(10).text("Gagal menampilkan pratinjau gambar.", margin, y);
              y+= 10;
          }
      } else if (item.fileName) {
          doc.setFont("helvetica", "bold").setFontSize(12).text("File Terlampir:", margin, y);
          y += 6;
          doc.setFont("helvetica", "italic").setFontSize(10).text(item.fileName, margin, y);
          y+= 10;
      }

      // Answer
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.text(`Jawaban AI #${index + 1}:`, margin, y);
      y += 6;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);
      const answerLines = doc.splitTextToSize(item.answer, contentWidth);
      doc.text(answerLines, margin, y);
      y += answerLines.length * 6 + 15;
    });

    const pageCount = doc.internal.pages.length;
    for(let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setLineWidth(0.2);
        doc.line(margin, 280, pageWidth - margin, 280);
        doc.setFontSize(8);
        doc.text(`Dokumen ini dibuat oleh PintarAI | Halaman ${i} dari ${pageCount}`, pageWidth / 2, 285, { align: "center" });
    }

    doc.save(`PintarAI - ${session.title.slice(0, 20)}.pdf`);
    toast({
        title: "Mengunduh PDF",
        description: "File PDF percakapan Anda sedang dibuat.",
    });
  };

  const handleClearHistory = () => {
    setHistory([]);
    toast({
        title: "Riwayat Dihapus",
        description: "Semua riwayat percakapan Anda telah dihapus.",
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

  const sortedHistory = [...history]
    .filter(session => session.startTime && !isNaN(new Date(session.startTime).getTime()))
    .sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime());

  return (
    <AppLayout>
        <div className="flex items-start sm:items-center justify-between gap-4 mb-4 flex-col sm:flex-row">
            <div className="flex items-center gap-4">
                <Button variant="outline" size="icon" onClick={() => router.back()} className="shrink-0">
                    <ArrowLeft className="h-4 w-4" />
                    <span className="sr-only">Kembali</span>
                </Button>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Riwayat Percakapan</h1>
                    <p className="text-muted-foreground">Lihat semua sesi percakapan Anda sebelumnya.</p>
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
                            Tindakan ini tidak dapat dibatalkan. Ini akan menghapus semua riwayat percakapan Anda secara permanen.
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
            Info: Riwayat Anda disimpan di penyimpanan internal browser pada perangkat ini.
        </p>
      <Card className="border-0 shadow-none bg-transparent">
        <CardContent className="p-0">
          {sortedHistory.length > 0 ? (
            <Accordion type="single" collapsible className="w-full">
              {sortedHistory.map((session) => (
                <AccordionItem value={session.id} key={session.id} className="border-secondary">
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex flex-col items-start text-left">
                      <p className="font-semibold text-base">{session.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {session.classLevel} &middot; {session.subject} &middot; {format(new Date(session.startTime), "PPP p", { locale: id })}
                      </p>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-6 p-4 bg-secondary/50 rounded-lg">
                        {session.messages.map((item) => (
                            <div key={item.id} className="space-y-6">
                                <div className="flex items-start gap-4 justify-end">
                                     <div className="flex flex-col items-end">
                                        <Card className="bg-primary text-primary-foreground">
                                            <CardContent className="p-3">
                                                <div className="prose prose-sm max-w-none text-sm whitespace-pre-wrap font-sans text-current leading-relaxed">
                                                  {item.questionText}
                                                </div>
                                                 {item.uploadedFileUri && item.uploadedFileUri.startsWith('data:image') && (
                                                    <div className="mt-3 relative w-full max-w-xs h-48 border rounded-md overflow-hidden bg-background">
                                                        <Image src={item.uploadedFileUri} alt="Lampiran file" layout="fill" objectFit="contain" />
                                                    </div>
                                                )}
                                                {item.fileName && !item.uploadedFileUri?.startsWith('data:image') && (
                                                    <p className="text-xs mt-2 opacity-80">File terlampir: {item.fileName}</p>
                                                )}
                                            </CardContent>
                                        </Card>
                                     </div>
                                     <Avatar className="h-9 w-9 border shrink-0">
                                        <AvatarFallback>{getAvatarFallback()}</AvatarFallback>
                                    </Avatar>
                                </div>
                                <div className="flex items-start gap-4">
                                    <Avatar className="h-9 w-9 border border-primary shrink-0">
                                            <AvatarFallback className="bg-primary text-primary-foreground">
                                            <BrainCircuit className="h-5 w-5" />
                                            </AvatarFallback>
                                    </Avatar>
                                     <div className="flex flex-col items-start">
                                        <Card className="bg-background">
                                            <CardContent className="p-3">
                                                <div className="prose prose-sm max-w-none text-sm whitespace-pre-wrap font-sans text-muted-foreground leading-relaxed">
                                                    {item.answer}
                                                </div>
                                            </CardContent>
                                        </Card>
                                     </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="mt-4 flex items-center justify-end gap-2">
                       <Button variant="outline" size="sm" onClick={() => handleDownloadPdf(session)}>
                        <Download className="mr-2 h-4 w-4" />
                        Unduh Percakapan (PDF)
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
              <p className="mt-2 text-sm">Mulai percakapan dan riwayat Anda akan muncul di sini.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </AppLayout>
  );
}

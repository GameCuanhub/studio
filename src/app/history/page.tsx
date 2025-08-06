
"use client";

import { useEffect, useState, useRef } from "react";
import AppLayout from "@/components/app-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { useLocalStorage } from "@/hooks/use-local-storage";
import type { HistoryItem } from "@/types";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { Copy, Download, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { useRouter } from "next/navigation";

export default function HistoryPage() {
  const [history, setHistory] = useLocalStorage<HistoryItem[]>("pintarai-history", []);
  const [isMounted, setIsMounted] = useState(false);
  const { toast } = useToast();
  const contentRefs = useRef<(HTMLDivElement | null)[]>([]);
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

  const handleDownloadPdf = (item: HistoryItem, index: number) => {
    const content = contentRefs.current[index];
    if (!content) return;

    html2canvas(content, {
      scale: 2,
      backgroundColor: document.body.classList.contains('dark') ? '#09090b' : '#ffffff', 
      useCORS: true,
    }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;
      const ratio = canvasWidth / canvasHeight;
      const width = pdfWidth - 20;
      let height = width / ratio;
      if (height > pdfHeight - 20) {
        height = pdfHeight - 20;
      }

      pdf.addImage(imgData, "PNG", 10, 10, width, height);
      pdf.save(`PintarAI - ${item.summary.slice(0, 20)}.pdf`);
      toast({
        title: "Mengunduh PDF",
        description: "File PDF Anda sedang dibuat.",
      });
    });
  };

  if (!isMounted) {
    return (
      <AppLayout>
        <div className="space-y-4">
          <Skeleton className="h-10 w-1/4" />
          <Card>
            <CardHeader>
              <Skeleton className="h-8 w-3/4" />
            </CardHeader>
            <CardContent>
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
      <div className="flex items-center gap-4 mb-4">
        <Button variant="outline" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Kembali</span>
        </Button>
        <div>
            <h1 className="text-2xl font-bold tracking-tight">Riwayat Pertanyaan</h1>
            <p className="text-muted-foreground">Lihat semua pertanyaan yang pernah Anda ajukan sebelumnya.</p>
        </div>
      </div>
      <Card className="border-0 shadow-none bg-transparent">
        <CardContent className="p-0">
          {sortedHistory.length > 0 ? (
            <Accordion type="single" collapsible className="w-full">
              {sortedHistory.map((item, index) => (
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
                    <div ref={el => contentRefs.current[index] = el} className="space-y-6 p-4 bg-secondary/50 rounded-lg">
                      <div>
                        <h4 className="font-semibold text-base mb-2">Pertanyaan Anda:</h4>
                        <p className="text-sm whitespace-pre-wrap font-sans text-muted-foreground">{item.questionText}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-base mb-2">Jawaban AI:</h4>
                        <div className="prose prose-sm max-w-none text-sm whitespace-pre-wrap font-sans">{item.answer}</div>
                      </div>
                    </div>
                    <div className="mt-4 flex items-center justify-end gap-2">
                       <Button variant="outline" size="sm" onClick={() => handleCopy(item)}>
                        <Copy className="mr-2 h-4 w-4" />
                        Salin
                       </Button>
                       <Button variant="outline" size="sm" onClick={() => handleDownloadPdf(item, index)}>
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


"use client";

import { useState } from "react";
import AppLayout from "@/components/app-layout";
import QuestionForm from "@/components/question-form";
import { HistoryItem } from "@/types";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/context/auth-provider";
import { BrainCircuit, Sparkles, Copy, Download } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import jsPDF from "jspdf";
import { format } from "date-fns";
import { id } from "date-fns/locale";

type Message = {
    type: 'user' | 'ai' | 'loading';
    item: HistoryItem;
}

export default function Home() {
    const [messages, setMessages] = useState<Message[]>([]);
    const { user } = useAuth();
    const { toast } = useToast();

    const getAvatarFallback = () => {
        if (user?.displayName) {
          return user.displayName.charAt(0).toUpperCase();
        }
        if (user?.email) {
          return user.email.charAt(0).toUpperCase();
        }
        return 'U';
    }

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
        doc.text(`Tanggal: ${format(new Date(item.timestamp), "dd MMMM yyyy, HH:mm", { locale: id })}`, pageWidth - margin, y, { align: "right" });
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

    return (
        <AppLayout>
            <div className="flex flex-col h-[calc(100vh-theme(spacing.24))]">
                <div className="flex-1 overflow-y-auto pr-4">
                    <ScrollArea className="h-full">
                        <div className="space-y-6">
                            {messages.length === 0 && (
                                <div className="text-center py-16 text-muted-foreground">
                                    <Sparkles className="mx-auto h-12 w-12 text-muted-foreground" />
                                    <h3 className="mt-4 text-lg font-semibold">Mulai Percakapan</h3>
                                    <p className="mt-2 text-sm">Ajukan pertanyaan apa saja di bawah ini.</p>
                                </div>
                            )}
                            {messages.map((message, index) => (
                                <div key={index} className={`flex items-start gap-4 ${message.type === 'user' ? 'justify-end' : ''}`}>
                                    {message.type !== 'user' && (
                                        <Avatar className="h-9 w-9 border border-primary shrink-0">
                                             <AvatarFallback className="bg-primary text-primary-foreground">
                                                <BrainCircuit className="h-5 w-5" />
                                             </AvatarFallback>
                                        </Avatar>
                                    )}
                                     <div className={`group relative ${message.type === 'user' ? 'flex justify-end' : ''}`}>
                                        <Card className={`${message.type === 'user' ? 'bg-primary text-primary-foreground' : 'bg-secondary'}`}>
                                            <CardContent className="p-3">
                                                {message.type === 'loading' ? (
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-2 h-2 rounded-full bg-muted-foreground animate-pulse"></div>
                                                        <div className="w-2 h-2 rounded-full bg-muted-foreground animate-pulse delay-75"></div>
                                                        <div className="w-2 h-2 rounded-full bg-muted-foreground animate-pulse delay-150"></div>
                                                    </div>
                                                ) : (
                                                    <div className="prose prose-sm max-w-none text-sm whitespace-pre-wrap font-sans text-current leading-relaxed">
                                                      {message.type === 'user' ? message.item.questionText : message.item.answer}
                                                    </div>
                                                )}
                                                 {message.item.uploadedFileUri && message.item.uploadedFileUri.startsWith('data:image') && (
                                                    <div className="mt-3 relative w-full max-w-xs h-48 border rounded-md overflow-hidden bg-background">
                                                        <Image src={message.item.uploadedFileUri} alt="Lampiran file" layout="fill" objectFit="contain" />
                                                    </div>
                                                )}
                                                {message.item.fileName && !message.item.uploadedFileUri?.startsWith('data:image') && (
                                                    <p className="text-xs mt-2 opacity-80">File terlampir: {message.item.fileName}</p>
                                                )}
                                            </CardContent>
                                        </Card>
                                        {message.type === 'ai' && (
                                             <div className="absolute top-1/2 -translate-y-1/2 -right-12 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                                                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleCopy(message.item)}>
                                                    <Copy className="h-4 w-4" />
                                                </Button>
                                                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleDownloadPdf(message.item)}>
                                                    <Download className="h-4 w-4" />
                                                </Button>
                                             </div>
                                        )}
                                     </div>
                                     {message.type === 'user' && (
                                         <Avatar className="h-9 w-9 border shrink-0">
                                            <AvatarFallback>{getAvatarFallback()}</AvatarFallback>
                                        </Avatar>
                                    )}
                                </div>
                            ))}
                        </div>
                    </ScrollArea>
                </div>
                <div className="mt-auto pt-4">
                   <QuestionForm setMessages={setMessages} />
                </div>
            </div>
        </AppLayout>
    );
}

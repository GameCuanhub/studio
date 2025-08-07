
"use client";

import { useState, useEffect } from "react";
import AppLayout from "@/components/app-layout";
import QuestionForm from "@/components/question-form";
import type { ChatSession, QAPair } from "@/types";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/context/auth-provider";
import { BrainCircuit, Sparkles, Copy, Download, PlusCircle } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import jsPDF from "jspdf";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { useLocalStorage } from "@/hooks/use-local-storage";

type DisplayMessage = {
    type: 'user' | 'ai' | 'loading';
    content: string;
    item: QAPair;
}

export default function Home() {
    const [currentSession, setCurrentSession] = useLocalStorage<ChatSession | null>("pintarai-chat-session", null);
    const [history, setHistory] = useLocalStorage<ChatSession[]>("pintarai-history", []);
    const { user } = useAuth();
    const { toast } = useToast();
    const [isMounted, setIsMounted] = useState(false);

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

    const handleCopy = (textToCopy: string) => {
        navigator.clipboard.writeText(textToCopy);
        toast({
            title: "Tersalin!",
            description: "Jawaban AI telah disalin ke clipboard.",
        });
    };

    const handleDownloadPdf = (item: QAPair) => {
        if (!currentSession) return;
        
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
        doc.text(`ID Sesi: ${currentSession.id}`, margin, y);
        doc.text(`Tanggal: ${format(new Date(item.timestamp), "dd MMMM yyyy, HH:mm", { locale: id })}`, pageWidth - margin, y, { align: "right" });
        y += 7;
        doc.text(`Jenjang: ${currentSession.classLevel}`, margin, y);
        doc.text(`Pelajaran: ${currentSession.subject}`, pageWidth - margin, y, { align: "right" });
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

        doc.save(`PintarAI - ${item.questionText.slice(0, 20)}.pdf`);
        toast({
            title: "Mengunduh PDF",
            description: "File PDF Anda sedang dibuat.",
        });
    };
    
    const startNewSession = () => {
        if (currentSession && currentSession.messages.length > 0) {
            const existingIndex = history.findIndex(s => s.id === currentSession.id);
            if (existingIndex > -1) {
                const updatedHistory = [...history];
                updatedHistory[existingIndex] = currentSession;
                setHistory(updatedHistory);
            } else {
                setHistory([currentSession, ...history]);
            }
        }
        setCurrentSession(null);
        toast({
            title: "Sesi Baru Dimulai",
            description: "Anda dapat memulai percakapan baru.",
        });
    };

    if (!isMounted) {
        return <AppLayout><div className="flex flex-col h-[calc(100vh-theme(spacing.24))]"></div></AppLayout>;
    }
    
    const displayMessages: DisplayMessage[] = currentSession?.messages.flatMap(item => [
        { type: 'user', content: item.questionText, item },
        { type: 'ai', content: item.answer, item },
    ]) || [];
    
    // Add loading indicator if the last answer is pending
    if (currentSession && currentSession.messages.length > 0) {
        const lastMessage = currentSession.messages[currentSession.messages.length - 1];
        if (lastMessage.answer === '...') {
            displayMessages.push({ type: 'loading', content: '...', item: lastMessage });
        }
    }


    return (
        <AppLayout>
            <div className="flex flex-col h-[calc(100vh-theme(spacing.24))]">
                 <div className="flex items-center justify-end mb-4">
                    {currentSession && (
                        <Button onClick={startNewSession}>
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Mulai Sesi Baru
                        </Button>
                    )}
                </div>
                <div className="flex-1 overflow-y-auto pr-4">
                    <ScrollArea className="h-full">
                        <div className="space-y-6">
                            {!currentSession ? (
                                <div className="text-center py-16 text-muted-foreground">
                                    <Sparkles className="mx-auto h-12 w-12 text-muted-foreground" />
                                    <h3 className="mt-4 text-lg font-semibold">Mulai Percakapan</h3>
                                    <p className="mt-2 text-sm">Ajukan pertanyaan apa saja di bawah ini untuk memulai sesi baru.</p>
                                </div>
                            ) : (
                                displayMessages.map((message, index) => (
                                    <div key={index} className={`flex items-start gap-4 ${message.type === 'user' ? 'justify-end' : ''}`}>
                                        {message.type !== 'user' && (
                                            <Avatar className="h-9 w-9 border border-primary shrink-0">
                                                 <AvatarFallback className="bg-primary text-primary-foreground">
                                                    <BrainCircuit className="h-5 w-5" />
                                                 </AvatarFallback>
                                            </Avatar>
                                        )}
                                         <div className={`flex flex-col ${message.type === 'user' ? 'items-end' : 'items-start'}`}>
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
                                                          {message.content}
                                                        </div>
                                                    )}
                                                     {message.type === 'user' && message.item.uploadedFileUri && message.item.uploadedFileUri.startsWith('data:image') && (
                                                        <div className="mt-3 relative w-full max-w-xs h-48 border rounded-md overflow-hidden bg-background">
                                                            <Image src={message.item.uploadedFileUri} alt="Lampiran file" layout="fill" objectFit="contain" />
                                                        </div>
                                                    )}
                                                    {message.type === 'user' && message.item.fileName && !message.item.uploadedFileUri?.startsWith('data:image') && (
                                                        <p className="text-xs mt-2 opacity-80">File terlampir: {message.item.fileName}</p>
                                                    )}
                                                </CardContent>
                                            </Card>
                                            {message.type === 'ai' && (
                                                 <div className="mt-2 flex items-center gap-2">
                                                    <Button variant="outline" size="sm" onClick={() => handleCopy(message.item.answer)}>
                                                        <Copy className="mr-2 h-4 w-4" />
                                                        Salin
                                                    </Button>
                                                    <Button variant="outline" size="sm" onClick={() => handleDownloadPdf(message.item)}>
                                                        <Download className="mr-2 h-4 w-4" />
                                                        Unduh PDF
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
                                ))
                            )}
                        </div>
                    </ScrollArea>
                </div>
                <div className="mt-auto pt-4">
                   <QuestionForm currentSession={currentSession} setCurrentSession={setCurrentSession} />
                </div>
            </div>
        </AppLayout>
    );
}

    
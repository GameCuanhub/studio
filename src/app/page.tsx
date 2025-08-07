
"use client";

import { useState, useEffect, useRef } from "react";
import AppLayout from "@/components/app-layout";
import QuestionForm from "@/components/question-form";
import type { ChatSession, QAPair } from "@/types";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/context/auth-provider";
import { BrainCircuit, Sparkles, Copy, Download, PlusCircle, Book, FlaskConical, History, Landmark } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import jsPDF from "jspdf";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { saveChatSession, getChatSession } from "@/services/historyService";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CLASS_LEVELS, SUBJECTS_BY_LEVEL } from "@/lib/constants";
import { Label } from "@/components/ui/label";


type DisplayMessage = {
    type: 'user' | 'ai' | 'loading';
    content: string;
    item: QAPair;
}

export default function Home() {
    const [currentSession, setCurrentSession] = useLocalStorage<ChatSession | null>("pintarai-chat-session", null);
    const { user } = useAuth();
    const { toast } = useToast();
    const [isMounted, setIsMounted] = useState(false);

    // Form state for empty view
    const [classLevel, setClassLevel] = useLocalStorage<string>('pintarai-classLevel', '');
    const [subject, setSubject] = useLocalStorage<string>('pintarai-subject', '');
    const [question, setQuestion] = useState("");
    const formRef = useRef<HTMLFormElement>(null);


    // This effect runs when the component mounts or the user changes.
    // It tries to load the active session from localStorage.
    useEffect(() => {
        setIsMounted(true);
        const activeSessionId = localStorage.getItem('active_session_id');
        if (activeSessionId && user) {
            getChatSession(activeSessionId).then(session => {
                if (session) {
                    setCurrentSession(session);
                }
                 // Clear the active session ID after loading
                localStorage.removeItem('active_session_id');
            });
        }
    }, [user, setCurrentSession]);

    // This effect runs to automatically save the session to Firestore whenever it's updated.
    useEffect(() => {
        if (currentSession && user && currentSession.userId === user.uid && currentSession.messages.length > 0) {
             saveChatSession(currentSession);
        }
    }, [currentSession, user]);


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
        setCurrentSession(null);
        toast({
            title: "Sesi Baru Dimulai",
            description: "Anda dapat memulai percakapan baru.",
        });
    };

    const handleExampleClick = (exampleQuestion: string) => {
        setQuestion(exampleQuestion);
        // We can't use form.handleSubmit directly, so we'll simulate a form submission
        // by creating a synthetic event or directly calling the submit handler logic.
        if (formRef.current) {
            // A bit of a hack to set the textarea value and then trigger submit
            const textarea = formRef.current.querySelector('textarea');
            if(textarea) {
                textarea.value = exampleQuestion;
                // Create a native event to ensure react-hook-form picks up the change
                const nativeTextareaValueSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, "value")?.set;
                nativeTextareaValueSetter?.call(textarea, exampleQuestion);
                const event = new Event('input', { bubbles: true });
                textarea.dispatchEvent(event);
            }
            
            // Wait for state to update, then submit
            setTimeout(() => {
                 formRef.current?.requestSubmit();
            }, 0);
        }
    }


    if (!isMounted) {
        return <AppLayout><div className="flex flex-col h-[calc(100vh-theme(spacing.24))]"></div></AppLayout>;
    }
    
    const displayMessages: DisplayMessage[] = (currentSession?.messages || []).flatMap(item => {
        const messages: DisplayMessage[] = [{ type: 'user', content: item.questionText, item }];
        if (item.answer === '...') {
             messages.push({ type: 'loading', content: '...', item });
        } else {
             messages.push({ type: 'ai', content: item.answer, item });
        }
        return messages;
    });

    const examplePrompts = [
        { icon: Book, title: "Buatkan soal esai", prompt: "Buatkan soal esai tentang sejarah proklamasi kemerdekaan Indonesia untuk kelas 5 SD." },
        { icon: FlaskConical, title: "Jelaskan konsep sulit", prompt: "Jelaskan konsep fotosintesis dengan bahasa yang mudah dipahami anak SMP." },
        { icon: Landmark, title: "Beri ide proyek", prompt: "Beri saya 3 ide proyek IPS tentang keragaman budaya di Indonesia untuk tugas kelompok kelas 8." },
        { icon: History, title: "Buat ringkasan", prompt: "Ringkas bab 5 buku paket Sejarah kelas 11 tentang pendudukan Jepang." }
    ];

    return (
        <AppLayout>
            <div className="flex flex-col h-[calc(100vh-theme(spacing.24))]">
                 <div className="flex items-center justify-end mb-4 h-10">
                    {currentSession && (
                         <div className="transition-opacity duration-300 animate-fade-in">
                            <Button onClick={startNewSession}>
                                <PlusCircle className="mr-2 h-4 w-4" />
                                Mulai Sesi Baru
                            </Button>
                        </div>
                    )}
                </div>
                <div className="flex-1 overflow-y-auto pr-4">
                    <ScrollArea className="h-full">
                        <div className="space-y-6">
                            {!currentSession ? (
                                <div className={`flex flex-col items-center justify-center h-full ${currentSession === null ? 'animate-slide-up-fade-in' : ''}`}>
                                    <div className="text-center mb-8">
                                        <h1 className="text-4xl font-bold tracking-tight text-white mb-2">Halo!</h1>
                                        <p className="text-lg text-muted-foreground">Ada yang bisa saya bantu hari ini?</p>
                                    </div>
                                    <div className="w-full max-w-2xl mb-8 space-y-4">
                                        <div className="flex items-center gap-4">
                                             <div className="grid gap-2 w-full">
                                                <Label htmlFor="classLevel" className="text-white">Jenjang</Label>
                                                <Select onValueChange={setClassLevel} value={classLevel}>
                                                    <SelectTrigger id="classLevel" className="w-full bg-secondary border-secondary">
                                                        <SelectValue placeholder="Pilih jenjang" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                    {CLASS_LEVELS.map((level) => (
                                                        <SelectItem key={level} value={level}>{level}</SelectItem>
                                                    ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                             <div className="grid gap-2 w-full">
                                                <Label htmlFor="subject" className="text-white">Pelajaran</Label>
                                                <Select onValueChange={setSubject} value={subject} disabled={!classLevel}>
                                                    <SelectTrigger id="subject" className="w-full bg-secondary border-secondary">
                                                        <SelectValue placeholder="Pilih pelajaran" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                    {(classLevel ? SUBJECTS_BY_LEVEL[classLevel.split(" ")[0] as keyof typeof SUBJECTS_BY_LEVEL] || [] : []).map((subject) => (
                                                        <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                                                    ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4 w-full max-w-2xl">
                                        {examplePrompts.map((prompt, index) => (
                                            <Card 
                                                key={index}
                                                className="bg-secondary p-4 rounded-lg hover:bg-border transition-colors cursor-pointer group"
                                                onClick={() => handleExampleClick(prompt.prompt)}
                                            >
                                                <div className="flex items-start gap-4">
                                                    <div className="bg-background p-2 rounded-full">
                                                        <prompt.icon className="w-5 h-5 text-primary" />
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-white">{prompt.title}</p>
                                                        <p className="text-sm text-muted-foreground">{prompt.prompt}</p>
                                                    </div>
                                                </div>
                                            </Card>
                                        ))}
                                    </div>
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
                                            <Card className={`max-w-2xl ${message.type === 'user' ? 'bg-primary text-primary-foreground' : 'bg-secondary'}`}>
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
                                            {message.type === 'ai' && message.content !== '...' && (
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
                <div className="mt-auto pt-4 max-w-3xl w-full mx-auto">
                   <QuestionForm 
                    currentSession={currentSession} 
                    setCurrentSession={setCurrentSession}
                    classLevel={classLevel}
                    subject={subject}
                    question={question}
                    setQuestion={setQuestion}
                    formRef={formRef}
                    />
                </div>
            </div>
        </AppLayout>
    );
}

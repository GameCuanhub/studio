
"use client";

import { useState } from "react";
import AppLayout from "@/components/app-layout";
import QuestionForm from "@/components/question-form";
import { HistoryItem } from "@/types";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/context/auth-provider";
import { BrainCircuit, Sparkles } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import Image from 'next/image';

type Message = {
    type: 'user' | 'ai' | 'loading';
    item: HistoryItem;
}

export default function Home() {
    const [messages, setMessages] = useState<Message[]>([]);
    const { user } = useAuth();

    const getAvatarFallback = () => {
        if (user?.displayName) {
          return user.displayName.charAt(0).toUpperCase();
        }
        if (user?.email) {
          return user.email.charAt(0).toUpperCase();
        }
        return 'U';
    }

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

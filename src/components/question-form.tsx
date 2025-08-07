
"use client";

import React, { useState, useEffect, Dispatch, SetStateAction, RefObject } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { answerQuestion } from "@/ai/flows/answer-question";
import type { ChatSession, QAPair } from "@/types";
import { useAuth } from "@/context/auth-provider";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Send, Paperclip, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import { doc, collection, getDoc, runTransaction } from "firebase/firestore";
import { db } from "@/lib/firebase/config";


const formSchema = z.object({
  questionText: z.string().min(1, "Pertanyaan tidak boleh kosong."),
  file: z.any().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const readFileAsDataURL = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
};

interface QuestionFormProps {
    currentSession: ChatSession | null;
    setCurrentSession: Dispatch<SetStateAction<ChatSession | null>>;
    classLevel: string;
    subject: string;
    question: string;
    setQuestion: Dispatch<SetStateAction<string>>;
    formRef: RefObject<HTMLFormElement>;
}

export default function QuestionForm({ 
    currentSession, 
    setCurrentSession,
    classLevel,
    subject,
    question,
    setQuestion,
    formRef
}: QuestionFormProps) {
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState("");
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      questionText: "",
      file: undefined,
    },
  });

   useEffect(() => {
    form.setValue('questionText', question);
  }, [question, form]);


  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type.startsWith("image/")) {
        const fileDataUrl = await readFileAsDataURL(file);
        setFilePreview(fileDataUrl);
      } else {
        setFilePreview(null);
      }
      setFileName(file.name);
      form.setValue("file", e.target.files);
    } else {
      resetFileInput();
    }
  }
  
  const resetFileInput = () => {
    setFilePreview(null);
    setFileName("");
    form.resetField("file");
    const fileInput = document.getElementById('file-upload') as HTMLInputElement;
    if(fileInput) fileInput.value = "";
  }

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    if (!user) {
        toast({ variant: "destructive", title: "Anda harus masuk untuk bertanya." });
        return;
    }
    if(!classLevel || !subject) {
        toast({
            variant: "destructive",
            title: "Pengaturan Diperlukan",
            description: "Silakan pilih jenjang kelas dan mata pelajaran terlebih dahulu.",
        });
        return;
    }
    setLoading(true);

     // Check and decrement token balance within a transaction
    try {
        const userRef = doc(db, "users", user.uid);
        await runTransaction(db, async (transaction) => {
            const userDoc = await transaction.get(userRef);
            if (!userDoc.exists() || userDoc.data().tokenBalance < 1) {
                throw new Error("Token tidak cukup. Silakan isi ulang token Anda di halaman profil.");
            }
            
            const newBalance = userDoc.data().tokenBalance - 1;
            transaction.update(userRef, { tokenBalance: newBalance });
        });
    } catch (error: any) {
         toast({
            variant: "destructive",
            title: "Gagal Mengirim Pertanyaan",
            description: error.message || "Terjadi kesalahan saat memeriksa saldo token.",
        });
        setLoading(false);
        return;
    }


    let uploadedFileUri: string | undefined = undefined;
    if (data.file && data.file[0]) {
      try {
        uploadedFileUri = await readFileAsDataURL(data.file[0]);
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Kesalahan Unggah File",
          description: "Tidak dapat membaca file yang diunggah.",
        });
        setLoading(false);
        return;
      }
    }
    
    const newQAPair: QAPair = {
        id: new Date().toISOString(),
        questionText: data.questionText,
        answer: '...', // Placeholder for loading state
        timestamp: new Date().toISOString(),
    };

    if (uploadedFileUri) {
        newQAPair.uploadedFileUri = uploadedFileUri;
    }
    if (data.file?.[0]?.name) {
        newQAPair.fileName = data.file[0].name;
    }


    if (currentSession) {
        setCurrentSession({
            ...currentSession,
            messages: [...currentSession.messages, newQAPair]
        });
    } else {
        // Create a new session
        const newSessionId = doc(collection(db, 'chats')).id;
        setCurrentSession({
            id: newSessionId,
            userId: user.uid,
            title: data.questionText,
            messages: [newQAPair],
            classLevel,
            subject,
            startTime: new Date().toISOString(),
        });
    }

    form.reset();
    setQuestion("");
    resetFileInput();

    try {
      const answerResponse = await answerQuestion({
        classLevel,
        subject,
        questionText: data.questionText,
        uploadedFileUri,
      });
      
      setCurrentSession(prevSession => {
          if (!prevSession) return null;
          const updatedMessages = prevSession.messages.map(msg => 
              msg.id === newQAPair.id ? { ...msg, answer: answerResponse.answer, timestamp: new Date().toISOString() } : msg
          );
          return { ...prevSession, messages: updatedMessages };
      });

    } catch (error: any) {
        toast({
            variant: "destructive",
            title: "Kesalahan AI",
            description: error.message || "Gagal mendapatkan jawaban dari AI.",
        });
        setCurrentSession(prevSession => {
            if (!prevSession) return null;
            const updatedMessages = prevSession.messages.map(msg => 
                msg.id === newQAPair.id ? { ...msg, answer: `Maaf, terjadi kesalahan: ${error.message}` } : msg
            );
            return { ...prevSession, messages: updatedMessages };
        });
    } finally {
      setLoading(false);
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      form.handleSubmit(onSubmit)();
    }
  };

  return (
    <div className="bg-background/80 backdrop-blur-md rounded-2xl border border-border shadow-2xl shadow-black/20">
        <div className="p-2">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="relative" ref={formRef}>
                    {fileName && (
                        <div className="absolute bottom-[calc(100%+0.5rem)] left-0 bg-secondary p-2 rounded-lg text-sm flex items-center gap-2">
                             {filePreview && (
                                <div className="relative w-10 h-10 border rounded-md overflow-hidden">
                                    <Image src={filePreview} alt="Pratinjau file" layout="fill" objectFit="cover" />
                                </div>
                            )}
                            <span className="text-muted-foreground">{fileName}</span>
                            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={resetFileInput}>
                                <XCircle className="h-4 w-4 text-destructive" />
                            </Button>
                        </div>
                    )}
                    <FormField
                    control={form.control}
                    name="questionText"
                    render={({ field }) => (
                        <FormItem>
                        <FormControl>
                            <Textarea
                                placeholder="Ketik pertanyaan Anda di sini, atau pilih salah satu contoh di atas..."
                                className="min-h-0 pr-24 pl-12 rounded-xl text-base bg-secondary border-secondary focus-visible:ring-primary"
                                {...field}
                                rows={1}
                                onKeyDown={handleKeyDown}
                                disabled={loading}
                                onChange={(e) => {
                                    field.onChange(e);
                                    setQuestion(e.target.value);
                                }}
                                />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <div className="absolute top-1/2 -translate-y-1/2 left-3 flex items-center gap-2">
                        <label htmlFor="file-upload" className="cursor-pointer">
                            <Paperclip className="text-muted-foreground hover:text-primary"/>
                            <input id="file-upload" type="file" className="sr-only" onChange={handleFileChange} disabled={loading} />
                        </label>
                    </div>
                     <div className="absolute top-1/2 -translate-y-1/2 right-3 flex items-center gap-2">
                        <Button type="submit" disabled={loading || !form.formState.isValid} size="icon" className="rounded-full w-8 h-8">
                        {loading ? <Loader2 className="animate-spin" /> : <Send />}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
        <div className="flex items-center justify-center text-xs text-muted-foreground px-4 py-2 border-t border-secondary">
            <p>PintarAI dapat membuat kesalahan. Periksa info penting.</p>
        </div>
    </div>
  );
}

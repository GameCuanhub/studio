
"use client";

import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { answerQuestion } from "@/ai/flows/answer-question";
import { summarizeQuestion } from "@/ai/flows/summarize-question";
import { useLocalStorage } from "@/hooks/use-local-storage";
import type { HistoryItem } from "@/types";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Sparkles, Upload } from "lucide-react";
import { CLASS_LEVELS, SUBJECTS } from "@/lib/constants";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "./ui/skeleton";

const formSchema = z.object({
  classLevel: z.string().min(1, "Silakan pilih jenjang kelas."),
  subject: z.string().min(1, "Silakan pilih mata pelajaran."),
  questionText: z.string().min(10, "Pertanyaan harus minimal 10 karakter."),
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

export default function QuestionForm() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<HistoryItem | null>(null);
  const [history, setHistory] = useLocalStorage<HistoryItem[]>("pintarai-history", []);
  const [fileName, setFileName] = useState("");
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      classLevel: "",
      subject: "",
      questionText: "",
    },
  });

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setLoading(true);
    setResult(null);

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

    try {
      const answerResponse = await answerQuestion({
        classLevel: data.classLevel,
        subject: data.subject,
        questionText: data.questionText,
        uploadedFileUri,
      });

      const summaryResponse = await summarizeQuestion({
         question: data.questionText,
      });


      const newHistoryItem: HistoryItem = {
        id: new Date().toISOString(),
        ...data,
        questionText: data.questionText,
        answer: answerResponse.answer,
        summary: summaryResponse.summary,
        timestamp: new Date().toISOString(),
      };

      setResult(newHistoryItem);
      setHistory([newHistoryItem, ...history]);
      form.reset();
      setFileName("");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Kesalahan AI",
        description: error.message || "Gagal mendapatkan jawaban dari AI.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Card className="border-0 shadow-none">
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Kirim Pertanyaan Anda</CardTitle>
            <CardDescription>Pilih jenjang kelas, mata pelajaran, dan ketik pertanyaan Anda di bawah ini. Anda juga dapat mengunggah file untuk konteks.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="classLevel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Jenjang Kelas</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih jenjang kelas" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {CLASS_LEVELS.map((level) => (
                            <SelectItem key={level} value={level}>{level}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="subject"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mata Pelajaran</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih mata pelajaran" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {SUBJECTS.map((subject) => (
                            <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="questionText"
                render={({ field }) => (
                  <FormItem className="mt-4">
                    <FormLabel>Pertanyaan</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Ketik pertanyaan Anda di sini..." className="min-h-[150px]" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="file"
                render={({ field }) => (
                  <FormItem className="mt-4">
                    <FormLabel>Opsional: Unggah File (Gambar/Dok)</FormLabel>
                    <FormControl>
                      <div className="relative">
                         <Input 
                            id="file-upload"
                            type="file" 
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                            onChange={(e) => {
                                field.onChange(e.target.files);
                                setFileName(e.target.files?.[0]?.name || "");
                            }}
                        />
                        <div className="flex items-center justify-center w-full px-3 py-2 text-sm text-muted-foreground border rounded-md">
                            <Upload className="mr-2 h-4 w-4" />
                            {fileName || "Pilih file untuk diunggah"}
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </Form>
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={loading} size="lg">
              {loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="mr-2 h-4 w-4" />
              )}
              Dapatkan Jawaban
            </Button>
          </CardFooter>
        </form>
      </Card>

      {loading && (
        <Card className="mt-8">
            <CardHeader>
                <CardTitle>Menghasilkan Jawaban...</CardTitle>
                <CardDescription>AI sedang berpikir. Mohon tunggu sebentar.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
            </CardContent>
        </Card>
      )}

      {result && (
        <Card className="mt-8 animate-in fade-in-50">
          <CardHeader>
            <CardTitle>Jawaban yang Dihasilkan AI</CardTitle>
            <CardDescription>Berikut adalah jawaban untuk pertanyaan Anda.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
             <div>
                <h4 className="font-semibold mb-2">Pertanyaan Anda:</h4>
                <p className="text-sm text-muted-foreground p-4 bg-muted/50 rounded-lg whitespace-pre-wrap">{result.questionText}</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Jawabannya:</h4>
                <div className="prose text-sm p-4 border rounded-lg whitespace-pre-wrap leading-relaxed">{result.answer}</div>
              </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

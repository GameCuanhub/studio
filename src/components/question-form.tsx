
"use client";

import { useState, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { answerQuestion } from "@/ai/flows/answer-question";
import { summarizeQuestion } from "@/ai/flows/summarize-question";
import { useLocalStorage } from "@/hooks/use-local-storage";
import type { HistoryItem } from "@/types";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Sparkles, Upload, XCircle } from "lucide-react";
import { CLASS_LEVELS, SUBJECTS_BY_LEVEL } from "@/lib/constants";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "./ui/skeleton";
import Image from "next/image";

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
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      classLevel: "",
      subject: "",
      questionText: "",
      file: undefined,
    },
  });

  const selectedClassLevel = form.watch("classLevel");
  
  useEffect(() => {
    form.resetField("subject");
  }, [selectedClassLevel, form]);

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
      setFilePreview(null);
      setFileName("");
      form.setValue("file", undefined);
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
        uploadedFileUri: uploadedFileUri,
        fileName: data.file?.[0]?.name,
      };

      setResult(newHistoryItem);
      setHistory([newHistoryItem, ...history]);
      form.reset();
      resetFileInput();
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
      <Card className="border-0 shadow-none bg-transparent md:border md:shadow-sm md:bg-card">
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="p-0 md:p-6">
            <Form {...form}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="classLevel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Jenjang Kelas</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
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
                  render={({ field }) => {
                    const availableSubjects = selectedClassLevel ? SUBJECTS_BY_LEVEL[selectedClassLevel.split(" ")[0] as keyof typeof SUBJECTS_BY_LEVEL] || [] : [];
                    return (
                      <FormItem>
                        <FormLabel>Mata Pelajaran</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value} disabled={!selectedClassLevel}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Pilih mata pelajaran" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {availableSubjects.map((subject) => (
                              <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )
                  }}
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
                render={() => (
                  <FormItem className="mt-4">
                    <FormLabel>Opsional: Unggah File</FormLabel>
                    <FormControl>
                      <div className="relative">
                         <Input 
                            id="file-upload"
                            type="file" 
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                            onChange={handleFileChange}
                            accept="image/*,application/pdf,.doc,.docx"
                        />
                        <div className="flex items-center justify-center w-full px-3 py-2 text-sm text-muted-foreground border-2 border-dashed rounded-md h-12">
                            <Upload className="mr-2 h-4 w-4" />
                            {fileName || "Pilih file untuk diunggah (gambar, dok, dll.)"}
                        </div>
                      </div>
                    </FormControl>
                     <FormDescription>
                      Lampirkan gambar atau dokumen untuk memberikan konteks pada pertanyaan Anda.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {filePreview && (
                <div className="mt-4 relative w-40 h-40 border rounded-md overflow-hidden">
                    <Image src={filePreview} alt="Pratinjau file" layout="fill" objectFit="cover" />
                    <Button variant="ghost" size="icon" className="absolute top-1 right-1 bg-black/50 hover:bg-black/75 h-6 w-6" onClick={resetFileInput}>
                        <XCircle className="h-4 w-4 text-white" />
                    </Button>
                </div>
              )}
              {fileName && !filePreview && (
                <div className="mt-4 text-sm text-muted-foreground">
                    File terpilih: {fileName}
                    <Button variant="ghost" size="icon" className="h-6 w-6 ml-2" onClick={resetFileInput}>
                        <XCircle className="h-4 w-4 text-destructive" />
                    </Button>
                </div>
              )}

               <div className="mt-6">
                 <Button type="submit" disabled={loading} size="lg" className="w-full md:w-auto">
                  {loading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Sparkles className="mr-2 h-4 w-4" />
                  )}
                  Dapatkan Jawaban
                </Button>
               </div>
            </Form>
          </CardContent>
        </form>
      </Card>

      {loading && (
        <Card className="mt-8 bg-secondary/50">
            <CardHeader>
                <CardTitle>AI sedang meracik jawaban...</CardTitle>
                <CardDescription>Mohon tunggu sebentar, kami sedang memproses pertanyaan Anda.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <Skeleton className="h-4 w-full bg-muted" />
                <Skeleton className="h-4 w-full bg-muted" />
                <Skeleton className="h-4 w-3/4 bg-muted" />
            </CardContent>
        </Card>
      )}

      {result && (
        <Card className="mt-8 animate-in fade-in-50 bg-card border shadow-sm">
          <CardHeader>
            <CardTitle>Jawaban yang Dihasilkan AI</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
             <div>
                <h4 className="font-semibold mb-2">Pertanyaan Anda:</h4>
                <p className="text-sm text-muted-foreground p-4 bg-secondary/50 rounded-lg whitespace-pre-wrap">{result.questionText}</p>
                 {result.uploadedFileUri && result.uploadedFileUri.startsWith('image/') && (
                    <div className="mt-4 relative w-full max-w-sm h-64 border rounded-md overflow-hidden">
                        <Image src={result.uploadedFileUri} alt="Lampiran file" layout="fill" objectFit="contain" />
                    </div>
                )}
                 {result.fileName && !result.uploadedFileUri?.startsWith('image/') && (
                     <p className="text-sm text-muted-foreground mt-2">File terlampir: {result.fileName}</p>
                )}
              </div>
              <div>
                <h4 className="font-semibold mb-2">Jawabannya:</h4>
                <div className="prose prose-sm max-w-none text-sm p-4 border border-border rounded-lg whitespace-pre-wrap leading-relaxed bg-secondary/50">{result.answer}</div>
              </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

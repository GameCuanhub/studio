
"use client";

import { useEffect, useState, useCallback } from "react";
import AppLayout from "@/components/app-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { ChatSession } from "@/types";
import { format, formatDistanceToNow } from "date-fns";
import { id } from "date-fns/locale";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, History, Trash2, MessageSquare, BookOpen } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import Link from "next/link";
import { useAuth } from "@/context/auth-provider";
import { getUserHistory, clearUserHistory } from "@/services/historyService";

export default function HistoryPage() {
  const [history, setHistory] = useState<ChatSession[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  const fetchHistory = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    const userHistory = await getUserHistory(user.uid);
    setHistory(userHistory);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);
  
  const handleLoadSession = (sessionId: string) => {
    localStorage.setItem('active_session_id', sessionId);
    router.push('/');
  }

  const handleClearHistory = async () => {
    if (!user) return;
    await clearUserHistory(user.uid);
    setHistory([]);
    toast({
        title: "Riwayat Dihapus",
        description: "Semua riwayat percakapan Anda telah dihapus.",
    });
  };
  
  const renderSkeleton = () => (
    <div className="space-y-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <Card key={i}>
            <CardContent className="p-4">
                <div className="space-y-3">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-4 w-1/3" />
                </div>
            </CardContent>
        </Card>
      ))}
    </div>
  );

  return (
    <AppLayout>
        <div className="flex items-start sm:items-center justify-between gap-4 mb-6 flex-col sm:flex-row">
            <div className="flex items-center gap-4">
                <Button variant="outline" size="icon" onClick={() => router.back()} className="shrink-0">
                    <ArrowLeft className="h-4 w-4" />
                    <span className="sr-only">Kembali</span>
                </Button>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                        <BookOpen className="h-6 w-6" />
                        Riwayat Percakapan
                    </h1>
                    <p className="text-muted-foreground">Pilih sesi untuk melihat atau melanjutkan percakapan.</p>
                </div>
            </div>
            {history.length > 0 && (
                 <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button variant="destructive" className="w-full sm:w-auto">
                            <Trash2 />
                            Hapus Semua
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                        <AlertDialogTitle>Apakah Anda benar-benar yakin?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Tindakan ini tidak dapat dibatalkan. Ini akan menghapus semua riwayat percakapan Anda secara permanen dari server.
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
      
      <div className="space-y-4">
        {loading ? renderSkeleton() : (
            history.length > 0 ? (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {history.map((session) => (
                    <Card 
                        key={session.id} 
                        className="hover:bg-secondary/50 cursor-pointer transition-colors flex flex-col"
                        onClick={() => handleLoadSession(session.id)}
                    >
                        <CardHeader className="pb-3">
                           <CardTitle className="text-base leading-snug truncate" title={session.title}>
                                {session.title}
                           </CardTitle>
                        </CardHeader>
                        <CardContent className="flex-grow">
                           <p className="text-sm text-muted-foreground">{session.classLevel}</p>
                           <p className="text-sm text-muted-foreground font-medium">{session.subject}</p>
                        </CardContent>
                        <CardContent className="pt-3 border-t border-secondary/50 flex items-center justify-between text-xs text-muted-foreground">
                            <div className="flex items-center gap-1.5">
                                <MessageSquare className="h-3 w-3" />
                                <span>{session.messages.length} pesan</span>
                            </div>
                           <span>
                            {session.startTime ? formatDistanceToNow(new Date(session.startTime), { addSuffix: true, locale: id }) : 'Waktu tidak valid'}
                           </span>
                        </CardContent>
                    </Card>
                ))}
                </div>
            ) : (
                <div className="text-center py-16 text-muted-foreground border-2 border-dashed border-secondary rounded-lg col-span-full">
                <History className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-semibold">Riwayat Kosong</h3>
                <p className="mt-2 text-sm">Mulai percakapan dan riwayat Anda akan muncul di sini.</p>
                <Button asChild className="mt-4">
                    <Link href="/">Mulai Percakapan Baru</Link>
                </Button>
                </div>
            )
        )}
        </div>
    </AppLayout>
  );
}

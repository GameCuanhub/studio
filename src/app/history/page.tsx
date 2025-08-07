
"use client";

import { useEffect, useState, useCallback } from "react";
import AppLayout from "@/components/app-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { ChatSession } from "@/types";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, History, Trash2, MessageSquare } from "lucide-react";
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
        description: "Semua riwayat percakapan Anda telah dihapus dari cloud.",
    });
  };
  
  if (loading) {
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
                    <p className="text-muted-foreground">Pilih sesi untuk melanjutkan percakapan.</p>
                </div>
            </div>
            {history.length > 0 && (
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
        <p className="text-xs text-muted-foreground mb-4 italic text-center sm:text-left">
            Info: Riwayat Anda disimpan dengan aman di cloud.
        </p>
      <Card className="border-0 shadow-none bg-transparent">
        <CardContent className="p-0">
          {history.length > 0 ? (
            <div className="space-y-2">
              {history.map((session) => (
                 <Card 
                    key={session.id} 
                    className="hover:bg-secondary/50 cursor-pointer transition-colors"
                    onClick={() => handleLoadSession(session.id)}
                >
                    <CardContent className="p-4">
                        <p className="font-semibold text-base truncate">{session.title}</p>
                        <p className="text-sm text-muted-foreground">
                            {session.classLevel} &middot; {session.subject} &middot; {session.startTime ? format(new Date(session.startTime), "PPP p", { locale: id }) : 'Waktu tidak valid'}
                        </p>
                        <div className="flex items-center text-xs text-muted-foreground mt-2">
                            <MessageSquare className="h-3 w-3 mr-1.5" />
                            <span>{session.messages.length} Pasang Tanya Jawab</span>
                        </div>
                    </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 text-muted-foreground border-2 border-dashed border-secondary rounded-lg">
              <History className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold">Riwayat Kosong</h3>
              <p className="mt-2 text-sm">Mulai percakapan dan riwayat Anda akan muncul di sini.</p>
              <Button asChild className="mt-4">
                <Link href="/">Mulai Percakapan Baru</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </AppLayout>
  );
}

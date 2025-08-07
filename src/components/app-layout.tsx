
"use client";

import Link from "next/link";
import { signOut, deleteUser } from "firebase/auth";
import { auth } from "@/lib/firebase/config";
import { useAuth } from "@/context/auth-provider";
import { useRouter, usePathname } from "next/navigation";
import { Home, History, LogOut, PanelLeft, User, UserX, Trash2, PlusCircle, BookOpen } from "lucide-react";
import { clearUserHistory } from "@/services/historyService";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Logo } from "./logo";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const { toast } = useToast();
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);


  const handleLogout = async () => {
    localStorage.removeItem('pintarai-chat-session');
    await signOut(auth);
    router.push("/login");
  };

  const startNewSession = () => {
    // Clear the session from local storage which will trigger the effect in page.tsx
    localStorage.removeItem('pintarai-chat-session');
    // If we are already on the home page, we might need to force a re-render or state update
    // For now, this will work if we navigate away and back, or if page.tsx handles it.
    if (pathname === '/') {
        window.location.reload(); // simple way to force reload and clear state
    } else {
        router.push('/');
    }
    toast({
        title: "Sesi Baru Dimulai",
        description: "Anda dapat memulai percakapan baru.",
    });
  };

  const handleDeleteAccount = async () => {
    if (!user) return;
    try {
      // First, delete all their data from Firestore
      await clearUserHistory(user.uid);
      
      // Clear local storage session just in case
      localStorage.removeItem('pintarai-chat-session');
      
      // Then delete the user from Firebase Auth
      await deleteUser(user);
      
      toast({
        title: "Akun Dihapus",
        description: "Akun Anda dan semua data terkait telah berhasil dihapus.",
      });
      router.push("/register"); // Redirect to a neutral page
    } catch (error: any) {
        console.error("Error deleting account:", error);
        toast({
            variant: "destructive",
            title: "Gagal Menghapus Akun",
            description: "Terjadi kesalahan saat mencoba menghapus akun Anda. Silakan coba lagi atau hubungi dukungan.",
        });
    } finally {
        setIsDeleteAlertOpen(false);
    }
  };

  const navItems = [
    { href: "/", label: "Ajukan Pertanyaan", icon: Home },
    { href: "/history", label: "Riwayat", icon: BookOpen },
    { href: "/profile", label: "Profil", icon: User },
  ];
  
  const getAvatarFallback = () => {
    if (user?.displayName) {
      return user.displayName.charAt(0).toUpperCase();
    }
    if (user?.email) {
      return user.email.charAt(0).toUpperCase();
    }
    return 'P';
  }


  return (
    <AlertDialog open={isDeleteAlertOpen} onOpenChange={setIsDeleteAlertOpen}>
    <div className="flex min-h-screen w-full flex-col bg-background">
       <aside className="fixed inset-y-0 left-0 z-10 hidden w-16 flex-col border-r border-secondary bg-background sm:flex">
        <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
          <Link
            href="/"
            className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-9 md:w-9 md:text-base"
          >
            <Logo />
            <span className="sr-only">PintarAI</span>
          </Link>
          <TooltipProvider>
            {navItems.map((item) => (
              <Tooltip key={item.href} delayDuration={0}>
                <TooltipTrigger asChild>
                  <Link
                    href={item.href}
                    className={`flex h-9 w-9 items-center justify-center rounded-lg transition-colors md:h-9 md:w-9 ${
                      pathname === item.href
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                    }`}
                  >
                    <item.icon className="h-5 w-5" />
                    <span className="sr-only">{item.label}</span>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right">{item.label}</TooltipContent>
              </Tooltip>
            ))}
             <Tooltip delayDuration={0}>
                <TooltipTrigger asChild>
                  <button
                    onClick={startNewSession}
                    className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground md:h-9 md:w-9"
                  >
                    <PlusCircle className="h-5 w-5" />
                    <span className="sr-only">Sesi Baru</span>
                  </button>
                </TooltipTrigger>
                <TooltipContent side="right">Sesi Baru</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </nav>
        <nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-5">
            <DropdownMenu>
                <TooltipProvider>
                    <Tooltip delayDuration={0}>
                        <TooltipTrigger asChild>
                             <DropdownMenuTrigger asChild>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    className="overflow-hidden rounded-full h-9 w-9 border-secondary hover:bg-secondary"
                                >
                                    <Avatar className="h-9 w-9">
                                    <AvatarImage src={user?.photoURL || ''} alt="User avatar" />
                                    <AvatarFallback>{getAvatarFallback()}</AvatarFallback>
                                    </Avatar>
                                </Button>
                            </DropdownMenuTrigger>
                        </TooltipTrigger>
                        <TooltipContent side="right">Profil & Pengaturan</TooltipContent>
                    </Tooltip>
                </TooltipProvider>
                <DropdownMenuContent align="end">
                <DropdownMenuLabel>{user?.displayName || user?.email}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push('/profile')}>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profil Saya</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Keluar</span>
                </DropdownMenuItem>
                 <DropdownMenuSeparator />
                 <AlertDialogTrigger asChild>
                    <DropdownMenuItem className="text-destructive focus:text-destructive">
                      <UserX className="mr-2 h-4 w-4" />
                      <span>Hapus Akun</span>
                    </DropdownMenuItem>
                </AlertDialogTrigger>
                </DropdownMenuContent>
            </DropdownMenu>
        </nav>
      </aside>
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-16">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b border-secondary bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button size="icon" variant="outline" className="sm:hidden">
                <PanelLeft className="h-5 w-5" />
                <span className="sr-only">Buka Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="sm:max-w-xs bg-background border-secondary">
              <SheetTitle className="sr-only">Menu</SheetTitle>
              <nav className="grid gap-6 text-lg font-medium mt-8">
                <Link
                  href="/"
                  className="group flex h-10 shrink-0 items-center justify-center gap-2 rounded-full text-lg font-semibold text-primary-foreground md:text-base mb-4"
                >
                  <Logo />
                   <span className="font-bold text-foreground">PintarAI</span>
                </Link>
                {navItems.map((item) => (
                   <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-4 px-2.5 ${
                        pathname === item.href
                          ? "text-foreground font-semibold"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                  >
                    <item.icon className="h-5 w-5" />
                    {item.label}
                  </Link>
                ))}
                <button
                    onClick={startNewSession}
                    className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                  >
                    <PlusCircle className="h-5 w-5" />
                    Sesi Baru
                  </button>
              </nav>
            </SheetContent>
          </Sheet>
          <div className="relative ml-auto flex-1 md:grow-0">
          </div>
        </header>
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          {children}
        </main>
      </div>
    </div>
    
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Apakah Anda benar-benar yakin?</AlertDialogTitle>
          <AlertDialogDescription>
            Tindakan ini tidak dapat dibatalkan. Ini akan menghapus akun Anda dan semua riwayat pertanyaan Anda secara permanen.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Batal</AlertDialogCancel>
          <AlertDialogAction onClick={handleDeleteAccount} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
            Ya, Hapus Akun Saya
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

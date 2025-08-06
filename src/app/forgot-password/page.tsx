
"use client";

import { useState } from "react";
import Link from "next/link";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/lib/firebase/config";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import AuthLayout from "@/components/auth-layout";
import { CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      toast({
        title: "Email Pengaturan Ulang Kata Sandi Terkirim",
        description: "Silakan periksa kotak masuk Anda untuk mengatur ulang kata sandi Anda.",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Terjadi Kesalahan",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <CardHeader>
        <CardTitle className="text-2xl">Lupa Kata Sandi</CardTitle>
        <CardDescription>Masukkan email Anda dan kami akan mengirimkan tautan untuk mengatur ulang kata sandi Anda.</CardDescription>
      </CardHeader>
      <form onSubmit={handleResetPassword}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="m@example.com" required value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button type="submit" className="w-full" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Kirim Tautan Atur Ulang
          </Button>
          <div className="text-center text-sm">
            Ingat kata sandi Anda?{" "}
            <Link href="/login" passHref className="underline">
              Masuk
            </Link>
          </div>
        </CardFooter>
      </form>
    </AuthLayout>
  );
}

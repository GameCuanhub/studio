
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createUserWithEmailAndPassword, updateProfile, sendEmailVerification } from "firebase/auth";
import { auth } from "@/lib/firebase/config";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import AuthLayout from "@/components/auth-layout";
import { CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) {
      toast({
        variant: "destructive",
        title: "Pendaftaran Gagal",
        description: "Silakan masukkan nama Anda.",
      });
      return;
    }
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, {
        displayName: name,
      });

      await sendEmailVerification(userCredential.user);

      toast({
        title: "Pendaftaran Berhasil",
        description: "Silakan periksa email Anda untuk verifikasi.",
      });
      router.push(`/verify-email?email=${email}`);
      
    } catch (error: any) {
        let description = "Terjadi kesalahan yang tidak diketahui.";
        if (error.code === 'auth/email-already-in-use') {
            description = "Email ini sudah terdaftar. Silakan gunakan email lain atau masuk.";
        } else if (error.code === 'auth/weak-password') {
            description = "Kata sandi terlalu lemah. Harap gunakan minimal 6 karakter.";
        } else if (error.code === 'auth/invalid-email') {
            description = "Format email tidak valid.";
        } else {
            description = error.message;
        }
      toast({
        variant: "destructive",
        title: "Pendaftaran Gagal",
        description,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <CardHeader>
        <CardTitle className="text-2xl">Daftar</CardTitle>
        <CardDescription>Masukkan informasi Anda untuk membuat akun.</CardDescription>
      </CardHeader>
      <form onSubmit={handleRegister}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nama</Label>
            <Input id="name" type="text" placeholder="John Doe" required value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="m@example.com" required value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Kata Sandi</Label>
            <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button type="submit" className="w-full" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Buat akun
          </Button>
          <div className="text-center text-sm">
            Sudah punya akun?{" "}
            <Link href="/login" passHref className="underline">
              Masuk
            </Link>
          </div>
        </CardFooter>
      </form>
    </AuthLayout>
  );
}

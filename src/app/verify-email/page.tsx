
"use client";

import { useSearchParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { MailCheck } from 'lucide-react';
import AuthLayout from '@/components/auth-layout';

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const email = searchParams.get('email');

  if (!email) {
    // Redirect to login if email is not in query params
    if (typeof window !== 'undefined') {
        router.push('/login');
    }
    return null; 
  }

  return (
    <AuthLayout>
        <CardHeader className="items-center text-center">
          <div className="p-3 bg-primary/10 rounded-full mb-4">
            <MailCheck className="h-10 w-10 text-primary" />
          </div>
          <CardTitle className="text-2xl">Verifikasi Email Anda</CardTitle>
          <CardDescription>
            Kami telah mengirimkan tautan verifikasi ke alamat email <br />
            <span className="font-semibold text-foreground">{email}</span>.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-muted-foreground text-sm">
            Silakan periksa kotak masuk Anda (dan folder spam) lalu klik tautan tersebut untuk menyelesaikan pendaftaran. Halaman ini akan otomatis dialihkan setelah Anda berhasil login.
          </p>
          <div className="mt-6">
            <Link href="/login" passHref>
                <Button>Kembali ke Halaman Login</Button>
            </Link>
          </div>
        </CardContent>
    </AuthLayout>
  );
}

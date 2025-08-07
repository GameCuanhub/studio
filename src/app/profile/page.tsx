
"use client";

import AppLayout from "@/components/app-layout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/context/auth-provider";
import { auth } from "@/lib/firebase/config";
import { signOut } from "firebase/auth";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
    const { user } = useAuth();
    const router = useRouter();

    const handleLogout = async () => {
        await signOut(auth);
        router.push("/login");
    };
    
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
            <div className="flex items-center justify-between space-y-2 mb-6">
                <h1 className="text-3xl font-bold tracking-tight">Profil Saya</h1>
            </div>
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-4">
                        <Avatar className="h-20 w-20 border-2 border-primary">
                            <AvatarImage src={user?.photoURL || ''} alt="User avatar" />
                            <AvatarFallback className="text-4xl">{getAvatarFallback()}</AvatarFallback>
                        </Avatar>
                        <div>
                            <CardTitle className="text-2xl">{user?.displayName || 'Pengguna'}</CardTitle>
                            <CardDescription>{user?.email}</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <Button onClick={handleLogout} variant="outline">
                        <LogOut className="mr-2 h-4 w-4"/>
                        Keluar
                    </Button>
                </CardContent>
            </Card>
        </AppLayout>
    )
}


"use client";

import { useState, useEffect } from "react";
import AppLayout from "@/components/app-layout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { useAuth } from "@/context/auth-provider";
import { auth, db } from "@/lib/firebase/config";
import { signOut } from "firebase/auth";
import { LogOut, Coins, PlusCircle, ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";
import { doc, getDoc, setDoc } from "firebase/firestore";
import type { UserProfile } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";
import { TOKEN_PACKAGES } from "@/lib/constants";


export default function ProfilePage() {
    const { user } = useAuth();
    const router = useRouter();
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            if (!user) {
                setLoading(false);
                return;
            };

            const userRef = doc(db, "users", user.uid);
            const docSnap = await getDoc(userRef);

            if (docSnap.exists()) {
                setProfile(docSnap.data() as UserProfile);
            } else {
                // Create a profile if it doesn't exist
                const newProfile: UserProfile = {
                    uid: user.uid,
                    email: user.email,
                    displayName: user.displayName,
                    photoURL: user.photoURL,
                    tokenBalance: 10, // Give some free tokens on first profile creation
                };
                await setDoc(userRef, newProfile);
                setProfile(newProfile);
            }
            setLoading(false);
        }
        fetchProfile();
    }, [user]);

    const handleLogout = async () => {
        await signOut(auth);
        router.push("/login");
    };
    
    const getAvatarFallback = () => {
        if (profile?.displayName) return profile.displayName.charAt(0).toUpperCase();
        if (profile?.email) return profile.email.charAt(0).toUpperCase();
        return 'U';
    }

    if (loading) {
        return (
            <AppLayout>
                <div className="space-y-4">
                    <Skeleton className="h-8 w-48" />
                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-4">
                                <Skeleton className="h-20 w-20 rounded-full" />
                                <div className="space-y-2">
                                    <Skeleton className="h-6 w-40" />
                                    <Skeleton className="h-4 w-52" />
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <Skeleton className="h-10 w-28" />
                        </CardContent>
                    </Card>
                     <Card>
                        <CardHeader>
                            <Skeleton className="h-6 w-40" />
                        </CardHeader>
                        <CardContent className="grid gap-4 md:grid-cols-3">
                           <Skeleton className="h-32 w-full" />
                           <Skeleton className="h-32 w-full" />
                           <Skeleton className="h-32 w-full" />
                        </CardContent>
                    </Card>
                </div>
            </AppLayout>
        )
    }

    return (
        <AppLayout>
            <div className="flex items-center justify-between space-y-2 mb-6">
                <h1 className="text-3xl font-bold tracking-tight">Profil & Token</h1>
            </div>
            <div className="space-y-6">
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-4">
                            <Avatar className="h-20 w-20 border-2 border-primary">
                                <AvatarImage src={profile?.photoURL || ''} alt="User avatar" />
                                <AvatarFallback className="text-4xl">{getAvatarFallback()}</AvatarFallback>
                            </Avatar>
                            <div>
                                <CardTitle className="text-2xl">{profile?.displayName || 'Pengguna'}</CardTitle>
                                <CardDescription>{profile?.email}</CardDescription>
                                <div className="mt-2 flex items-center gap-2 font-bold text-lg text-primary">
                                    <Coins className="h-6 w-6" />
                                    <span>{profile?.tokenBalance} Token Tersisa</span>
                                </div>
                            </div>
                        </div>
                    </CardHeader>
                    <CardFooter>
                        <Button onClick={handleLogout} variant="outline">
                            <LogOut className="mr-2 h-4 w-4"/>
                            Keluar
                        </Button>
                    </CardFooter>
                </Card>

                 <Card>
                    <CardHeader>
                        <CardTitle>
                            <PlusCircle className="mr-2 h-5 w-5 inline-block" />
                            Isi Ulang Token
                        </CardTitle>
                        <CardDescription>Pilih paket untuk melanjutkan bertanya dan mendapatkan jawaban dari AI.</CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-4 md:grid-cols-3">
                       {TOKEN_PACKAGES.map((pkg) => (
                           <Card key={pkg.id} className="flex flex-col">
                               <CardHeader>
                                   <CardTitle className="text-primary flex items-center gap-2">
                                    <Coins /> {pkg.tokens} Token
                                   </CardTitle>
                               </CardHeader>
                               <CardContent className="flex-grow">
                                   <p className="text-2xl font-bold">{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(pkg.price)}</p>
                                   <p className="text-sm text-muted-foreground mt-1">{pkg.description}</p>
                               </CardContent>
                               <CardFooter>
                                    <Button className="w-full">
                                        <ShoppingCart className="mr-2 h-4 w-4" />
                                        Beli Sekarang
                                    </Button>
                               </CardFooter>
                           </Card>
                       ))}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    )
}

    
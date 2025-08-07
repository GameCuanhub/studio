
"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/lib/firebase/config";
import { usePathname, useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import nProgress from "nprogress";

interface AuthContextType {
  user: User | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user) {
            // Force reload user data to get the latest emailVerified state
            user.reload().then(() => {
                const reloadedUser = auth.currentUser;
                setUser(reloadedUser);
                setLoading(false);
            });
        } else {
            setUser(null);
            setLoading(false);
        }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (loading) return;

    const isAuthPage = ["/login", "/register", "/forgot-password", "/verify-email"].includes(pathname);
    
    // If the user is not logged in and not on an authentication page, redirect to login
    if (!user && !isAuthPage) {
      router.push("/login");
      return;
    }

    // If the user is logged in
    if (user) {
        // If email is not verified and they are not on the verification or login page, redirect them.
        if (!user.emailVerified && pathname !== '/verify-email' && pathname !== '/login') {
            router.push(`/verify-email?email=${user.email}`);
            return;
        }

        // If email is verified and they are on an auth page or verification page, redirect to home
        if (user.emailVerified && (isAuthPage || pathname === '/verify-email')) {
            router.push("/");
            return;
        }
    }

    nProgress.done();

  }, [user, loading, pathname, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="space-y-4 text-center">
            <Skeleton className="h-16 w-16 rounded-full mx-auto" />
            <Skeleton className="h-5 w-[250px] mx-auto" />
            <Skeleton className="h-4 w-[200px] mx-auto" />
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};


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
    nProgress.start();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        user.reload().then(() => {
          const reloadedUser = auth.currentUser;
          const isAuthPage = ["/login", "/register", "/forgot-password"].includes(pathname);
          const isVerificationPage = pathname === '/verify-email';

          if (!reloadedUser?.emailVerified) {
            if (!isVerificationPage && pathname !== '/login') {
              router.push(`/verify-email?email=${reloadedUser?.email}`);
            }
          } else { // email is verified
            if (isAuthPage || isVerificationPage) {
              router.push("/");
            }
          }
          setUser(reloadedUser);
          setLoading(false);
          nProgress.done();
        });
      } else {
        const isAuthPage = ["/login", "/register", "/forgot-password", "/verify-email"].includes(pathname);
        if (!isAuthPage) {
          router.push("/login");
        }
        setUser(null);
        setLoading(false);
        nProgress.done();
      }
    });

    return () => {
      unsubscribe();
      if (nProgress.isStarted()) {
        nProgress.done();
      }
    };
  }, [pathname, router]);


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

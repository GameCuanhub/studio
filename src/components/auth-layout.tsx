import { Logo } from "@/components/logo";
import { Card } from "@/components/ui/card";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-6">
          <Logo />
        </div>
        <Card className="p-6 shadow-lg">
          {children}
        </Card>
      </div>
    </main>
  );
}

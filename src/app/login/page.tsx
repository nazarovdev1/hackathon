import Link from "next/link";
import Image from "next/image";
import { ChevronLeft } from "lucide-react";
import { SignInForm } from "@/components/auth/sign-in-form";
import { MotionPanel } from "@/components/providers/motion-panel";

export const metadata = {
  title: "Tizimga kirish - PDP METRIC",
  description: "PDP METRIC hisobingizga kiring.",
};

export default function LoginPage() {
  return (
    <main className="metric-grid min-h-screen flex flex-col px-4 py-6 sm:px-6">
      <nav className="mx-auto flex w-full max-w-7xl items-center justify-between relative z-10">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-full shadow-[0_0_28px_rgba(56,189,248,0.35)] transition-transform group-hover:scale-105 overflow-hidden bg-white">
            <Image src="/pdp-logo.jpg" alt="PDP Logo" width={40} height={40} className="object-contain" />
          </div>
          <span className="text-lg font-semibold tracking-normal">PDP METRIC</span>
        </Link>
        <Link
          href="/"
          className="flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronLeft className="mr-1 h-4 w-4" />
          Bosh sahifaga qaytish
        </Link>
      </nav>

      <div className="flex-1 flex items-center justify-center relative z-10 py-12">
        <MotionPanel className="w-full max-w-md">
          <div className="mb-8 text-center flex flex-col items-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full shadow-[0_0_28px_rgba(16,185,129,0.35)] mb-6 overflow-hidden bg-white ring-1 ring-primary/20">
              <Image src="/pdp-logo.jpg" alt="PDP Logo" width={64} height={64} className="object-cover scale-[1.3]" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight">Xush kelibsiz</h1>
            <p className="text-muted-foreground mt-2">
              Boshqaruv paneliga kirish uchun tizimga kiring
            </p>
          </div>
          <SignInForm />
        </MotionPanel>
      </div>

      {/* Decorative background elements */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center z-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px]" />
      </div>
    </main>
  );
}

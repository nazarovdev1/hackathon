import Link from "next/link";
import { ShieldAlert } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

export default function UnauthorizedPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <div className="glass-panel max-w-md rounded-lg p-8 text-center">
        <ShieldAlert className="mx-auto h-10 w-10 text-rose-300" />
        <h1 className="mt-4 text-2xl font-semibold">Access blocked</h1>
        <p className="mt-3 text-sm text-muted-foreground">Bu route uchun profilingizda yetarli role permission mavjud emas.</p>
        <Link className={buttonVariants({ className: "mt-6" })} href="/">Home</Link>
      </div>
    </main>
  );
}

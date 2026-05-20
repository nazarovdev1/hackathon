import Link from "next/link";
import Image from "next/image";
import { Command, Menu, Search } from "lucide-react";
import { dashboardNavigation } from "@/constants/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { ThemeToggle } from "@/components/shared/theme-toggle";

function NavigationList({ role }: { role: string }) {
  const filteredNav = dashboardNavigation.filter((item) =>
    (item.roles as readonly string[]).includes(role)
  );

  return (
    <nav className="grid gap-1">
      {filteredNav.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-muted-foreground transition hover:bg-secondary hover:text-foreground"
        >
          <item.icon className="h-4 w-4" />
          {item.title}
        </Link>
      ))}
    </nav>
  );
}

export async function DashboardShell({
  children,
  title,
  eyebrow,
}: {
  children: React.ReactNode;
  title: string;
  eyebrow: string;
}) {
  const session = await getServerSession(authOptions);
  const role = session?.user?.role || "STUDENT";

  return (
    <div className="metric-grid min-h-screen">
      <aside className="fixed inset-y-0 left-0 hidden w-72 border-r border-border/40 bg-sidebar/70 p-5 backdrop-blur-xl lg:block">
        <Link href="/" className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-full shadow-[0_0_24px_rgba(16,185,129,0.35)] overflow-hidden bg-white">
            <Image src="/pdp-logo.jpg" alt="PDP Logo" width={40} height={40} className="object-cover scale-[1.3]" />
          </span>
          <span>
            <span className="block text-lg font-semibold tracking-normal">PDP METRIC</span>
            <span className="text-xs text-muted-foreground">Grant Monitoringi</span>
          </span>
        </Link>
        <div className="mt-8">
          <NavigationList role={role} />
        </div>
      </aside>

      <div className="lg:pl-72">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-border/40 bg-background/70 px-4 backdrop-blur-xl sm:px-6">
          <div className="flex items-center gap-3">
            <Sheet>
              <SheetTrigger render={<Button variant="outline" size="icon" className="lg:hidden" />}>
                <Menu className="h-4 w-4" />
              </SheetTrigger>
              <SheetContent side="left" className="w-72">
                <NavigationList role={role} />
              </SheetContent>
            </Sheet>
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-cyan-500">{eyebrow}</p>
              <h1 className="text-lg font-semibold sm:text-xl">{title}</h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden w-80 items-center gap-2 rounded-md border border-border/40 bg-secondary/50 px-3 md:flex">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input className="border-0 bg-transparent shadow-none focus-visible:ring-0" placeholder="Talabalar, guruhlar, grantlarni qidirish..." />
            </div>
            <ThemeToggle />
          </div>
        </header>
        <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6">{children}</main>
      </div>
    </div>
  );
}

import Link from "next/link";
import { Activity, Command, Menu, Search } from "lucide-react";
import { dashboardNavigation } from "@/constants/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

function NavigationList() {
  return (
    <nav className="grid gap-1">
      {dashboardNavigation.map((item) => (
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

export function DashboardShell({ children, title, eyebrow }: { children: React.ReactNode; title: string; eyebrow: string }) {
  return (
    <div className="metric-grid min-h-screen">
      <aside className="fixed inset-y-0 left-0 hidden w-72 border-r border-white/10 bg-sidebar/70 p-5 backdrop-blur-xl lg:block">
        <Link href="/" className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-md bg-primary text-primary-foreground shadow-[0_0_24px_rgba(56,189,248,0.35)]">
            <Command className="h-5 w-5" />
          </span>
          <span>
            <span className="block text-lg font-semibold tracking-normal">EDUMETRIC</span>
            <span className="text-xs text-muted-foreground">Grant Intelligence</span>
          </span>
        </Link>
        <div className="mt-8">
          <NavigationList />
        </div>
      </aside>

      <div className="lg:pl-72">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-white/10 bg-background/70 px-4 backdrop-blur-xl sm:px-6">
          <div className="flex items-center gap-3">
            <Sheet>
              <SheetTrigger render={<Button variant="outline" size="icon" className="lg:hidden" />}>
                <Menu className="h-4 w-4" />
              </SheetTrigger>
              <SheetContent side="left" className="w-72">
                <NavigationList />
              </SheetContent>
            </Sheet>
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-cyan-200/80">{eyebrow}</p>
              <h1 className="text-lg font-semibold sm:text-xl">{title}</h1>
            </div>
          </div>
          <div className="hidden w-80 items-center gap-2 rounded-md border border-white/10 bg-secondary/50 px-3 md:flex">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input className="border-0 bg-transparent shadow-none focus-visible:ring-0" placeholder="Search students, groups, grants" />
          </div>
          <Button size="icon" className="shadow-[0_0_24px_rgba(56,189,248,0.25)]">
            <Activity className="h-4 w-4" />
          </Button>
        </header>
        <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6">{children}</main>
      </div>
    </div>
  );
}

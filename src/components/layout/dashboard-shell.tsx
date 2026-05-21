import Link from "next/link";
import Image from "next/image";
import { Menu, Search, LogOut, User, Settings } from "lucide-react";
import { dashboardNavigation } from "@/constants/navigation";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";

function isActivePath(currentPath: string | undefined, navHref: string) {
  if (!currentPath) return false;

  // Strip query string from navHref to get just the pathname part
  const navHrefPath = navHref.split("?")[0].split("#")[0];
  const navHrefQuery = navHref.includes("?") ? navHref.split("?")[1] : null;

  // If navHref has no hash and no query, do simple path match
  if (!navHrefQuery && !navHref.includes("#")) {
    // Special case: exact match for /dashboard/student to avoid prefix matching
    if (navHref === "/dashboard/student") {
      return currentPath === "/dashboard/student";
    }
    return currentPath === navHref || currentPath.startsWith(navHref + "/");
  }

  // If navHref has a hash anchor (legacy support)
  if (navHref.includes("#") && !navHrefQuery) {
    return currentPath === navHrefPath;
  }

  // If navHref has query params — currentPath must match path (query checked separately)
  // We treat it as active only if the full navHref matches exactly
  return currentPath === navHref || currentPath === navHrefPath + "?" + navHrefQuery;
}

function NavigationList({ role, pathname }: { role: string; pathname?: string }) {
  const filteredNav = dashboardNavigation.filter((item) =>
    (item.roles as readonly string[]).includes(role)
  );

  return (
    <nav className="grid gap-1">
      {filteredNav.map((item) => {
        const isActive = isActivePath(pathname, item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm transition ${
              isActive
                ? "bg-primary/10 font-medium text-primary"
                : "text-muted-foreground hover:bg-secondary hover:text-foreground"
            }`}
          >
            <item.icon className="h-4 w-4" />
            {item.title}
          </Link>
        );
      })}
    </nav>
  );
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export async function DashboardShell({
  children,
  title,
  eyebrow,
  pathname,
}: {
  children: React.ReactNode;
  title: string;
  eyebrow: string;
  pathname?: string;
}) {
  const headersList = await headers();
  const activePathname = pathname || headersList.get("x-pathname") || undefined;
  const session = await getServerSession(authOptions);
  const role = session?.user?.role || "STUDENT";
  const userName = session?.user?.name || "Foydalanuvchi";
  const userEmail = session?.user?.email || "";
  const avatarUrl = session?.user?.image;

  let studentInfo: { group: string; faculty: string } | null = null;
  if (session?.user?.studentProfileId) {
    const profile = await prisma.studentProfile.findUnique({
      where: { id: session.user.studentProfileId },
      select: { groupName: true, faculty: true },
    });
    if (profile) {
      studentInfo = { group: profile.groupName, faculty: profile.faculty };
    }
  }

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
          <NavigationList role={role} pathname={activePathname} />
        </div>

        <div className="absolute bottom-5 left-5 right-5">
          <DropdownMenu>
            <DropdownMenuTrigger
              nativeButton={false}
              render={<div className="flex w-full items-center gap-3 rounded-lg border border-border/40 bg-secondary/30 p-3 text-left transition hover:bg-secondary/50 cursor-pointer" />}
            >
                {avatarUrl ? (
                  <Image
                    src={avatarUrl}
                    alt={userName}
                    width={36}
                    height={36}
                    className="h-9 w-9 rounded-full object-cover"
                  />
                ) : (
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                    {getInitials(userName)}
                  </span>
                )}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{userName}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {studentInfo ? `${studentInfo.group}` : role}
                  </p>
                </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col gap-1">
                  <span className="font-medium">{userName}</span>
                  <span className="text-xs font-normal text-muted-foreground">{userEmail}</span>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Link href="/dashboard/student/profile" className="flex w-full items-center cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  Profil
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link href="/dashboard/settings" className="flex w-full items-center cursor-pointer">
                  <Settings className="mr-2 h-4 w-4" />
                  Sozlamalar
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <form action="/api/auth/signout" method="POST" className="w-full">
                  <button type="submit" className="flex w-full items-center cursor-pointer text-rose-600 dark:text-rose-400">
                    <LogOut className="mr-2 h-4 w-4" />
                    Chiqish
                  </button>
                </form>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </aside>

      <div className="lg:pl-72">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-border/40 bg-background/70 px-4 backdrop-blur-xl sm:px-6">
          <div className="flex items-center gap-3">
            <Sheet>
              <SheetTrigger
                nativeButton={false}
                render={
                  <div className="lg:hidden cursor-pointer flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-background hover:bg-muted transition-all" />
                }
              >
                <Menu className="h-4 w-4" />
              </SheetTrigger>
              <SheetContent side="left" className="w-72">
                <NavigationList role={role} pathname={activePathname} />
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
            <DropdownMenu>
              <DropdownMenuTrigger
                nativeButton={false}
                render={<div className="flex items-center gap-2 rounded-full border border-border/40 bg-secondary/30 p-1 pr-3 transition hover:bg-secondary/50 cursor-pointer" />}
              >
                  {avatarUrl ? (
                    <Image
                      src={avatarUrl}
                      alt={userName}
                      width={28}
                      height={28}
                      className="h-7 w-7 rounded-full object-cover"
                    />
                  ) : (
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                      {getInitials(userName)}
                    </span>
                  )}
                  <span className="hidden text-sm font-medium sm:inline">{userName.split(" ")[0]}</span>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col gap-1">
                    <span className="font-medium">{userName}</span>
                    <span className="text-xs font-normal text-muted-foreground">{userEmail}</span>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Link href="/dashboard/student/profile" className="flex w-full items-center cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    Profil
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href="/dashboard/settings" className="flex w-full items-center cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    Sozlamalar
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <form action="/api/auth/signout" method="POST" className="w-full">
                    <button type="submit" className="flex w-full items-center cursor-pointer text-rose-600 dark:text-rose-400">
                      <LogOut className="mr-2 h-4 w-4" />
                      Chiqish
                    </button>
                  </form>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
        <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6">{children}</main>
      </div>
    </div>
  );
}

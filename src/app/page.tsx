import Link from "next/link";
import Image from "next/image";
import { ArrowRight, LockKeyhole, ShieldCheck, Zap, LineChart, Users } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MotionPanel } from "@/components/providers/motion-panel";
import { ThemeToggle } from "@/components/shared/theme-toggle";

export default function Home() {
  return (
    <main className="metric-grid h-screen w-full px-4 py-4 sm:px-6 relative overflow-hidden flex flex-col">
      {/* Dynamic Background Elements for UX */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-cyan-500/5 blur-[120px] pointer-events-none" />

      <section className="mx-auto flex h-full w-full max-w-7xl flex-col justify-between relative z-10 pb-4">
        {/* Navigation */}
        <nav className="flex items-center justify-between backdrop-blur-sm bg-background/50 p-3 sm:p-4 rounded-2xl border border-border/40 shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full shadow-[0_0_28px_rgba(16,185,129,0.35)] overflow-hidden bg-white">
              <Image src="/pdp-logo.jpg" alt="PDP Logo" width={40} height={40} className="object-cover scale-[1.3]" />
            </div>
            <span className="text-lg font-semibold tracking-normal">PDP METRIC</span>
          </div>
          <div className="flex items-center gap-4">
            <Link className="text-sm font-medium hover:text-primary transition-colors hidden sm:block" href="#features">Imkoniyatlar</Link>
            <Link className="text-sm font-medium hover:text-primary transition-colors hidden sm:block" href="#how-it-works">Qanday ishlaydi</Link>
            <div className="h-4 w-px bg-border hidden sm:block" />
            <ThemeToggle />
            <Link className={buttonVariants({ variant: "ghost", size: "sm" })} href="/login">Kirish</Link>
            <Link className={buttonVariants({ size: "sm", className: "shadow-lg shadow-primary/20" })} href="/login">
              Boshlash <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </nav>

        {/* Hero Section */}
        <div className="flex flex-1 flex-col items-center justify-center text-center py-4">
          <MotionPanel>
            <div className="max-w-4xl mx-auto flex flex-col items-center">
              <div className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-6 backdrop-blur-sm">
                <Zap className="mr-2 h-4 w-4" />
                PDP University KPI Platformasi
              </div>
              
              <h1 className="text-4xl font-bold tracking-tight text-balance sm:text-6xl lg:text-7xl bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/70 mb-4">
                PDP Grantlari. <br/> Kelajak Dasturchilari.
              </h1>
              
              <p className="max-w-2xl text-base sm:text-lg leading-7 text-muted-foreground mb-8">
                Talabalarning GPA, davomat, amaliy loyihalar natijalari (hard/soft skills) va jarimalarini tahlil qilib, PDP grant maqomini avtomatik kuzatib boradi. Bo'lajak IT mutaxassislari uchun intellektual markaz.
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-4">
                <Link className={buttonVariants({ size: "lg", className: "h-11 px-8 text-base shadow-xl shadow-primary/20" })} href="/login">
                  Boshqaruv paneliga o'tish
                </Link>
                <Link className={buttonVariants({ variant: "outline", size: "lg", className: "h-11 px-8 text-base bg-background/50 backdrop-blur-md" })} href="#features">
                  Imkoniyatlarni ko'rish
                </Link>
              </div>
            </div>
          </MotionPanel>
        </div>

        {/* Features Grid */}
        <MotionPanel delay={0.2} id="features" className="shrink-0">
          <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: ShieldCheck, title: "PDP Grant Tizimi", value: "80+ ballik chegarasi", desc: "Amaliy topshiriqlar va modullar natijalariga asoslangan avtomatlashgan grant taqsimoti." },
              { icon: LineChart, title: "Hard & Soft Skills", value: "Modul natijalari tahlili", desc: "Kod yozish malakasi, amaliy loyihalar va davomatni dinamik tarzda kuzating." },
              { icon: LockKeyhole, title: "Ekotizim Rollari", value: "Talaba, Mentor, Tyutor", desc: "PDP ekotizimidagi har bir ishtirokchi uchun alohida moslashtirilgan interfeyslar." },
              { icon: Users, title: "Recovery Signallari", value: "O'zlashtirish nazorati", desc: "Dasturlashda qiynalayotgan talabalarni aniqlang va qo'shimcha mashg'ulotlarga yo'naltiring." },
            ].map((item) => (
              <Card key={item.title} className="glass-panel group hover:bg-card/90 transition-all duration-300 hover:shadow-[0_0_30px_rgba(16,185,129,0.1)] hover:-translate-y-1 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-[40px] -mr-12 -mt-12 transition-opacity group-hover:bg-primary/10" />
                <CardContent className="p-5">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                    <item.icon className="h-5 w-5 text-primary" />
                  </div>
                  <h2 className="text-lg font-semibold mb-1">{item.title}</h2>
                  <div className="text-xs font-medium text-primary mb-2">{item.value}</div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </MotionPanel>
      </section>
    </main>
  );
}

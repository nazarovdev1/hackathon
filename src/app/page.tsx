import Link from "next/link";
import { ArrowRight, BarChart3, LockKeyhole, ShieldCheck } from "lucide-react";
import { DemoSignIn } from "@/components/auth/demo-sign-in";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MotionPanel } from "@/components/providers/motion-panel";

export default function Home() {
  return (
    <main className="metric-grid min-h-screen px-4 py-6 sm:px-6">
      <section className="mx-auto flex min-h-[calc(100vh-3rem)] max-w-7xl flex-col justify-between">
        <nav className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary text-primary-foreground shadow-[0_0_28px_rgba(56,189,248,0.35)]">
              <BarChart3 className="h-5 w-5" />
            </div>
            <span className="text-lg font-semibold tracking-normal">EDUMETRIC</span>
          </div>
          <div className="flex items-center gap-2">
            <Link className={buttonVariants({ variant: "outline" })} href="/dashboard/student">Student</Link>
            <Link className={buttonVariants()} href="/dashboard/admin">
              Admin <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </nav>

        <div className="grid items-end gap-8 py-12 lg:grid-cols-[1.05fr_0.95fr]">
          <MotionPanel>
            <div className="max-w-3xl">
              <p className="text-sm uppercase tracking-[0.28em] text-cyan-200/80">University KPI Intelligence</p>
              <h1 className="mt-5 text-5xl font-semibold tracking-normal text-balance sm:text-7xl">
                EDUMETRIC
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
                Talabalar KPI, attendance, academic score, penalty va recovery signallarini birlashtirib grant statusini avtomatik monitoring qiladi.
              </p>
            </div>
          </MotionPanel>

          <MotionPanel delay={0.1}>
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                { icon: ShieldCheck, title: "Grant Engine", value: "80+ eligible threshold" },
                { icon: LockKeyhole, title: "Role Access", value: "Student, Mentor, Tutor, Admin" },
              ].map((item) => (
                <Card key={item.title} className="glass-panel">
                  <CardContent className="p-5">
                    <item.icon className="h-5 w-5 text-cyan-300" />
                    <h2 className="mt-5 text-base font-semibold">{item.title}</h2>
                    <p className="mt-2 text-sm text-muted-foreground">{item.value}</p>
                  </CardContent>
                </Card>
              ))}
              <div className="sm:col-span-2">
                <DemoSignIn />
              </div>
            </div>
          </MotionPanel>
        </div>
      </section>
    </main>
  );
}

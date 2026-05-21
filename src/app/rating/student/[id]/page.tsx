import Link from "next/link";
import { Award, Gauge, GraduationCap, TrendingUp, UserCheck, Calendar, Code, Heart, Shield, ArrowLeft, Trophy, AlertTriangle } from "lucide-react";
import { getPublicStudentDashboard, getLeaderboard } from "@/services/leaderboard";
import { AcademicChart, AttendanceChart } from "@/components/charts/analytics-charts";
import { MetricCard } from "@/components/dashboard/metric-card";
import { StatusBadge } from "@/components/shared/status-badge";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MotionPanel } from "@/components/providers/motion-panel";

export const dynamic = "force-dynamic";

interface StudentDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function StudentDetailPage({ params }: StudentDetailPageProps) {
  const { id } = await params;

  let student: Awaited<ReturnType<typeof getPublicStudentDashboard>> = null;
  let position = 0;

  try {
    student = await getPublicStudentDashboard(id);
    if (student) {
      const leaderboard = await getLeaderboard();
      position = leaderboard.find((item) => item.id === student!.id)?.position ?? 0;
    }
  } catch {
    // DB unavailable — render error state below
  }

  // Student not found OR DB down
  if (!student) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-amber-500/20 bg-amber-500/5 px-6 py-20 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-amber-500/10">
          <AlertTriangle className="h-7 w-7 text-amber-500" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-foreground">
            Talaba topilmadi yoki ma&apos;lumotlar bazasi mavjud emas
          </h2>
          <p className="mt-1 text-sm text-muted-foreground max-w-sm mx-auto">
            Ushbu talaba profili mavjud emas yoki ma&apos;lumotlar bazasiga ulanib bo&apos;lmadi.
          </p>
        </div>
        <Link
          href="/rating"
          className="mt-2 inline-flex items-center gap-2 rounded-lg border border-border/40 bg-secondary/40 hover:bg-secondary/70 px-4 py-2 text-sm font-medium transition"
        >
          <ArrowLeft className="h-4 w-4" />
          Reytingga qaytish
        </Link>
      </div>
    );
  }

  const grant = student.grant;

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <div className="flex items-center justify-between">
        <Link
          href="/rating"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Reyting jadvaliga qaytish
        </Link>
        <Badge variant="outline" className="border-primary/20 text-primary bg-primary/5">
          Ommaviy ko'rish profili
        </Badge>
      </div>

      {/* Student Banner */}
      <MotionPanel>
        <div className="glass-panel rounded-2xl p-6 border-l-4 border-l-primary relative overflow-hidden">
          <div className="absolute right-6 top-6 opacity-5 pointer-events-none">
            <Trophy className="h-24 w-24 text-primary" />
          </div>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                {student.faculty} / {student.group}
              </p>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
                {student.name}
              </h2>
              <p className="text-xs text-muted-foreground">
                Profil ID: {student.studentId}
              </p>
            </div>
            <div className="flex flex-wrap gap-2 items-center">
              <StatusBadge value={grant.grantStatus} />
              <StatusBadge value={grant.riskLevel} />
              <Badge variant="secondary" className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 text-xs font-bold py-1 px-2.5">
                Reyting #{position}
              </Badge>
            </div>
          </div>
        </div>
      </MotionPanel>

      {/* Metric Cards Grid */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MotionPanel delay={0.03}>
          <MetricCard
            title="Yakuniy ball"
            value={`${grant.finalScore}`}
            helper="Asosiy KPI - jarima + tiklanish + bandlik bonusi"
            icon={Gauge}
          />
        </MotionPanel>
        <MotionPanel delay={0.06}>
          <MetricCard
            title="Asosiy KPI"
            value={`${grant.mainKpi}`}
            helper="O'zlashtirish, davomat, faollik va intizom"
            icon={TrendingUp}
          />
        </MotionPanel>
        <MotionPanel delay={0.09}>
          <MetricCard
            title="Davomat"
            value={`${student.attendanceTrend.at(-1)?.value || 0}%`}
            helper="Oxirgi oylik davomat ko'rsatkichi"
            icon={UserCheck}
          />
        </MotionPanel>
        <MotionPanel delay={0.12}>
          <MetricCard
            title="O'zlashtirish"
            value={`${student.kpi.academicPercent}%`}
            helper="Grant saqlash uchun minimal talab - 80%"
            icon={GraduationCap}
          />
        </MotionPanel>
      </div>

      {/* Analytics Charts */}
      <div className="grid gap-6 xl:grid-cols-2">
        <MotionPanel delay={0.15}>
          <Card className="glass-panel">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Davomat tahlili</CardTitle>
            </CardHeader>
            <CardContent>
              <AttendanceChart data={student.attendanceTrend} />
            </CardContent>
          </Card>
        </MotionPanel>
        <MotionPanel delay={0.18}>
          <Card className="glass-panel">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">O'zlashtirish tahlili (GPA)</CardTitle>
            </CardHeader>
            <CardContent>
              <AcademicChart data={student.academicTrend} />
            </CardContent>
          </Card>
        </MotionPanel>
      </div>

      {/* Detailed KPI and Achievements */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Left Column: KPI distribution */}
        <MotionPanel delay={0.21}>
          <Card className="glass-panel h-full">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">Asosiy reyting (KPI) ballari taqsimoti</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                {
                  label: "Akademik natija",
                  sub: "Academic Performance",
                  value: student.kpi.academic,
                  max: 40,
                  icon: GraduationCap,
                  color: "from-emerald-500 to-teal-400",
                  glow: "rgba(16,185,129,0.3)",
                },
                {
                  label: "O‘quv intizomi: Davomat",
                  sub: "Attendance",
                  value: student.kpi.attendance,
                  max: 20,
                  icon: Calendar,
                  color: "from-teal-500 to-cyan-400",
                  glow: "rgba(20,184,166,0.3)",
                },
                {
                  label: "Amaliy ko‘nikmalar",
                  sub: "Assignment & Projects",
                  value: student.kpi.assignment,
                  max: 15,
                  icon: Code,
                  color: "from-cyan-500 to-sky-400",
                  glow: "rgba(6,182,212,0.3)",
                },
                {
                  label: "Faollik va Sertifikatlar",
                  sub: "Extra-curricular & Certs",
                  value: student.kpi.activity,
                  max: 10,
                  icon: Trophy,
                  color: "from-amber-500 to-yellow-400",
                  glow: "rgba(245,158,11,0.3)",
                },
                {
                  label: "Ijtimoiy mas'uliyat",
                  sub: "Tutor's Evaluation (Tyutor bahosi)",
                  value: student.kpi.tutor,
                  max: 5,
                  icon: Heart,
                  color: "from-rose-500 to-pink-400",
                  glow: "rgba(244,63,94,0.3)",
                },
                {
                  label: "Korporativ madaniyat va Intizom",
                  sub: "Discipline & Corporate Culture",
                  value: student.kpi.discipline,
                  max: 10,
                  icon: Shield,
                  color: "from-blue-500 to-indigo-400",
                  glow: "rgba(59,130,246,0.3)",
                },
              ].map((item) => {
                const Icon = item.icon;
                const percent = (item.value / item.max) * 100;
                return (
                  <div key={item.label} className="p-3.5 rounded-xl bg-secondary/20 border border-border/40 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary/50 text-primary">
                          <Icon className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="font-semibold text-xs sm:text-sm leading-none">{item.label}</p>
                          <p className="text-[10px] text-muted-foreground mt-0.5">{item.sub}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs sm:text-sm font-semibold text-primary">{item.value} / {item.max} ball</p>
                      </div>
                    </div>
                    <div className="h-2 w-full rounded-full bg-secondary/60 overflow-hidden">
                      <div
                        className={`h-full rounded-full bg-gradient-to-r ${item.color} transition-all duration-500`}
                        style={{ width: `${percent}%`, boxShadow: `0 0 10px ${item.glow}` }}
                      />
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </MotionPanel>

        {/* Right Column: Achievements & Penalties */}
        <div className="flex flex-col gap-6">
          {/* Recovery and Penalties */}
          <MotionPanel delay={0.24} className="space-y-4">
            <Card className="glass-panel">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Intizom va Qayta tiklash</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between items-center text-xs mb-1">
                    <span className="text-muted-foreground">Jarimalarni qayta tiklash progressi</span>
                    <span className="font-semibold text-foreground">{student.recoveryStatus}%</span>
                  </div>
                  <Progress value={student.recoveryStatus} className="h-2" />
                </div>
                
                {student.penalties.length > 0 ? (
                  <div className="space-y-2">
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">Jarimalar ro'yxati</span>
                    <div className="overflow-hidden rounded-lg border border-border/40">
                      <Table>
                        <TableHeader className="bg-secondary/20">
                          <TableRow>
                            <TableHead className="py-2 text-xs">Sana</TableHead>
                            <TableHead className="py-2 text-xs">Turi/Sababi</TableHead>
                            <TableHead className="py-2 text-xs text-right">Ball</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {student.penalties.map((penalty, idx) => (
                            <TableRow key={idx}>
                              <TableCell className="py-2 text-xs text-muted-foreground">{penalty.date}</TableCell>
                              <TableCell className="py-2 text-xs font-medium text-foreground">{penalty.reason}</TableCell>
                              <TableCell className="py-2 text-xs text-right font-bold text-rose-600 dark:text-rose-400">-{penalty.score}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 rounded-xl border border-emerald-500/15 bg-emerald-500/5 text-center text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                    Talabada ma'muriy jarimalar mavjud emas.
                  </div>
                )}
              </CardContent>
            </Card>
          </MotionPanel>

          {/* Achievements */}
          <MotionPanel delay={0.27} className="flex-1 flex flex-col">
            <Card className="glass-panel flex-1 flex flex-col">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Talaba yutuqlari (Sertifikatlar & Musobaqalar)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 flex-1">
                {student.achievements.length > 0 ? (
                  student.achievements.map((achievement) => (
                    <Card key={achievement.id} className="glass-panel border-l-4 border-l-cyan-500 transition-all duration-300 hover:translate-x-1">
                      <CardContent className="flex items-center gap-3 p-4">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">
                          <Award className="h-4.5 w-4.5" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h4 className="font-semibold text-xs sm:text-sm truncate text-foreground">{achievement.title}</h4>
                          <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5">
                            {achievement.category} • {achievement.dateAdded}
                          </p>
                        </div>
                        <Badge variant="outline" className="border-cyan-500/20 text-cyan-600 dark:text-cyan-400 bg-cyan-500/5 text-xs font-bold shrink-0">
                          +{achievement.score} ball
                        </Badge>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="h-full flex items-center justify-center text-xs text-muted-foreground py-8">
                    Tasdiqlangan yutuqlar hali mavjud emas.
                  </div>
                )}
              </CardContent>
            </Card>
          </MotionPanel>
        </div>
      </div>
    </div>
  );
}

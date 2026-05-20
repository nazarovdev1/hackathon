import { Award, Gauge, GraduationCap, TrendingUp, UserCheck, Trophy, Calendar, Code, Heart, Shield } from "lucide-react";
import Image from "next/image";
import { AcademicChart, AttendanceChart } from "@/components/charts/analytics-charts";
import { MetricCard } from "@/components/dashboard/metric-card";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { MotionPanel } from "@/components/providers/motion-panel";
import { StatusBadge } from "@/components/shared/status-badge";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { calculateGrantScore } from "@/services/grant-engine";
import { getLeaderboard } from "@/services/leaderboard";
import { students } from "@/services/mock-data";
import { buildRecommendations } from "@/services/recommendations";

export default function StudentDashboardPage() {
  const student = students[0];
  const grant = calculateGrantScore(student.kpi);
  const recommendations = buildRecommendations(student.kpi, grant);
  const leaderboard = getLeaderboard();
  const position = leaderboard.find((item) => item.id === student.id)?.position ?? 0;

  return (
    <DashboardShell title="Talaba paneli" eyebrow="Shaxsiy grant monitoringi">
      <div className="grid gap-5">
        <MotionPanel>
          <div className="glass-panel rounded-lg p-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{student.faculty} / {student.group}</p>
                <h2 className="mt-1 text-2xl font-semibold">{student.name}</h2>
              </div>
              <div className="flex flex-wrap gap-2">
                <StatusBadge value={grant.grantStatus} />
                <StatusBadge value={grant.riskLevel} />
                <Badge variant="outline" className="border-primary/30 text-primary">Reyting #{position}</Badge>
              </div>
            </div>
          </div>
        </MotionPanel>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <MotionPanel delay={0.03}>
            <MetricCard title="Yakuniy ball" value={`${grant.finalScore}`} helper="Asosiy KPI - jarima + tiklanish + ishga joylashish" icon={Gauge} />
          </MotionPanel>
          <MotionPanel delay={0.06}>
            <MetricCard title="Asosiy KPI" value={`${grant.mainKpi}`} helper="O'zlashtirish, davomat, faollik va intizom" icon={TrendingUp} />
          </MotionPanel>
          <MotionPanel delay={0.09}>
            <MetricCard title="Davomat" value={`${student.attendanceTrend.at(-1)?.value}%`} helper="Oxirgi oylik davomat ko'rsatkichi" icon={UserCheck} />
          </MotionPanel>
          <MotionPanel delay={0.12}>
            <MetricCard title="O'zlashtirish" value={`${student.kpi.academicPercent}%`} helper="Grant uchun minimal talab - 80%" icon={GraduationCap} />
          </MotionPanel>
        </div>

        <div id="analytics" className="grid gap-5 xl:grid-cols-2">
          <Card className="glass-panel">
            <CardHeader>
              <CardTitle>Davomat tahlili</CardTitle>
            </CardHeader>
            <CardContent>
              <AttendanceChart data={student.attendanceTrend} />
            </CardContent>
          </Card>
          <Card className="glass-panel">
            <CardHeader>
              <CardTitle>O'zlashtirish tahlili</CardTitle>
            </CardHeader>
            <CardContent>
              <AcademicChart data={student.academicTrend} />
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          <Card className="glass-panel h-full flex flex-col">
            <CardHeader>
              <CardTitle>Jarimalar tarixi</CardTitle>
            </CardHeader>
            <CardContent className="flex-1">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Sana</TableHead>
                    <TableHead>Sabab</TableHead>
                    <TableHead className="text-right">Jarima balli</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {student.penalties.map((penalty) => (
                    <TableRow key={`${penalty.date}-${penalty.reason}`}>
                      <TableCell>{penalty.date}</TableCell>
                      <TableCell>{penalty.reason}</TableCell>
                      <TableCell className="text-right text-rose-600 dark:text-rose-200">-{penalty.score}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card className="glass-panel h-full flex flex-col">
            <CardHeader>
              <CardTitle>Qayta tiklash holati</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col justify-between">
              <div>
                <Progress value={student.recoveryStatus} />
                <p className="mt-3 text-sm text-muted-foreground">{student.recoveryStatus}% qayta tiklash rejasi bajarildi</p>
              </div>
              <div className="mt-5 grid gap-3">
                {recommendations.map((item) => (
                  <div key={item.title} className="rounded-md border border-border/40 bg-secondary/20 p-3">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-medium">{item.title}</p>
                      <StatusBadge value={item.severity} />
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">{item.message}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          {/* Chap ustun: KPI ballari taqsimoti */}
          <Card className="glass-panel">
            <CardHeader className="pb-4">
              <CardTitle className="text-base sm:text-lg">Asosiy reyting (KPI) ballari taqsimoti</CardTitle>
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
                  <div key={item.label} className="p-3.5 rounded-lg bg-secondary/20 border border-border/40 space-y-3 transition-all duration-200 hover:border-border/60 hover:bg-secondary/35">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary/50 text-primary">
                          <Icon className="h-4.5 w-4.5" />
                        </div>
                        <div>
                          <p className="font-semibold text-xs sm:text-sm leading-none">{item.label}</p>
                          <p className="text-[10px] sm:text-xs text-muted-foreground mt-1">{item.sub}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs sm:text-sm font-semibold text-primary">{item.value} / {item.max} ball</p>
                        <p className="text-[10px] text-muted-foreground">{Math.round(percent)}%</p>
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

          {/* O'ng ustun: Yutuqlar */}
          <div className="flex flex-col gap-4">
            <h3 className="text-base sm:text-lg font-semibold px-1">Talabaning yutuqlari</h3>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
              {student.achievements.map((achievement) => (
                <Card key={achievement.title} className="glass-panel transition-all duration-300 hover:translate-x-1 hover:border-cyan-500/30">
                  <CardContent className="flex items-center gap-4 p-5">
                    <div className="flex h-11 w-11 items-center justify-center rounded-md bg-cyan-500/10 text-cyan-600 dark:text-cyan-200">
                      <Award className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm">{achievement.title}</h3>
                      <p className="text-xs text-muted-foreground mt-1">{achievement.category} / +{achievement.score} ball</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}

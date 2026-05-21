import { notFound } from "next/navigation";

import { DashboardShell } from "@/components/layout/dashboard-shell";
import { MotionPanel } from "@/components/providers/motion-panel";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { User, Mail, BookOpen, Users, Award, Calendar, GraduationCap, Shield, TrendingUp } from "lucide-react";
import { getCurrentStudentDashboard } from "@/services/dashboard-data";
import { getStudentAttendance } from "@/services/attendance.service";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export default async function StudentProfilePage() {
  const student = await getCurrentStudentDashboard();
  if (!student) notFound();

  const attendanceData = await getStudentAttendance(student.id);

  const mentor = await prisma.user.findFirst({
    where: { studentProfile: { is: { id: student.id } } },
    select: { fullName: true, email: true, mentorProfile: { select: { specialty: true } } },
  });

  const tutor = await prisma.user.findFirst({
    where: { tutorStudents: { some: { id: student.id } } },
    select: { fullName: true, email: true, tutorProfile: { select: { assignedGroup: true } } },
  });

  const attendancePercentage = attendanceData?.attendance_summary.attendance_percentage ?? 0;
  const totalAchievements = student.achievements.filter((a) => a.status === "APPROVED").length;
  const totalScore = student.achievements.filter((a) => a.status === "APPROVED").reduce((sum, a) => sum + a.score, 0);

  return (
    <DashboardShell title="Profil" eyebrow="Shaxsiy ma'lumotlar">
      <div className="grid gap-6">
        {/* Profil header */}
        <MotionPanel>
          <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border border-primary/20 rounded-lg p-6 relative overflow-hidden">
            <div className="absolute right-6 top-6 opacity-5">
              <User className="h-32 w-32" />
            </div>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-2xl font-bold text-primary ring-4 ring-primary/10">
                {getInitials(student.name)}
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold">{student.name}</h2>
                <p className="text-sm text-muted-foreground mt-1">{student.studentId}</p>
                <div className="flex flex-wrap gap-2 mt-3">
                  <Badge variant="outline" className="border-primary/30 text-primary">
                    {student.faculty}
                  </Badge>
                  <Badge variant="outline" className="border-cyan-500/30 text-cyan-600 dark:text-cyan-400">
                    {student.group}
                  </Badge>
                  <Badge variant="outline" className="border-amber-500/30 text-amber-600 dark:text-amber-400">
                    {student.grantType}
                  </Badge>
                  <Badge
                    className={
                      student.grant.grantStatus === "ELIGIBLE"
                        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                        : student.grant.grantStatus === "RISK"
                        ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                        : "bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20"
                    }
                  >
                    {student.grant.grantStatus}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </MotionPanel>

        {/* Asosiy ma'lumotlar */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Shaxsiy ma'lumotlar */}
          <MotionPanel delay={0.05}>
            <Card className="glass-panel">
              <CardHeader>
                <CardTitle className="text-base">Shaxsiy ma'lumotlar</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-muted-foreground shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground">Email</p>
                    <p className="text-sm font-medium">{student.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <BookOpen className="h-4 w-4 text-muted-foreground shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground">Fakultet</p>
                    <p className="text-sm font-medium">{student.faculty}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Users className="h-4 w-4 text-muted-foreground shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground">Guruh</p>
                    <p className="text-sm font-medium">{student.group}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <GraduationCap className="h-4 w-4 text-muted-foreground shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground">Daraja</p>
                    <p className="text-sm font-medium">{student.level}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-muted-foreground shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground">Grant turi</p>
                    <p className="text-sm font-medium">{student.grantType}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </MotionPanel>

          {/* KPI ko'rsatkichlari */}
          <MotionPanel delay={0.1}>
            <Card className="glass-panel">
              <CardHeader>
                <CardTitle className="text-base">KPI ko'rsatkichlari</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm text-muted-foreground">Yakuniy ball</span>
                    <span className="text-sm font-bold">{student.grant.finalScore}</span>
                  </div>
                  <Progress value={student.grant.finalScore} className="h-2" />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm text-muted-foreground">Asosiy KPI</span>
                    <span className="text-sm font-bold">{student.grant.mainKpi}</span>
                  </div>
                  <Progress value={student.grant.mainKpi} className="h-2" />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm text-muted-foreground">Davomat</span>
                    <span className="text-sm font-bold">{attendancePercentage}%</span>
                  </div>
                  <Progress value={attendancePercentage} className="h-2" />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm text-muted-foreground">O'zlashtirish</span>
                    <span className="text-sm font-bold">{student.kpi.academicPercent}%</span>
                  </div>
                  <Progress value={student.kpi.academicPercent} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </MotionPanel>

          {/* Yutuqlar va Mentor */}
          <MotionPanel delay={0.15}>
            <Card className="glass-panel">
              <CardHeader>
                <CardTitle className="text-base">Yutuqlar va Mentor</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Award className="h-4 w-4 text-primary shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground">Tasdiqlangan yutuqlar</p>
                    <p className="text-sm font-bold">{totalAchievements} ta</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <TrendingUp className="h-4 w-4 text-emerald-500 shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground">Qo'shimcha ball</p>
                    <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">+{totalScore} ball</p>
                  </div>
                </div>
                {mentor && (
                  <>
                    <div className="border-t border-border/40 pt-3">
                      <p className="text-xs text-muted-foreground mb-1">Mentor</p>
                      <p className="text-sm font-medium">{mentor.fullName}</p>
                      <p className="text-xs text-muted-foreground">{mentor.mentorProfile?.specialty}</p>
                    </div>
                  </>
                )}
                {tutor && (
                  <>
                    <div className="border-t border-border/40 pt-3">
                      <p className="text-xs text-muted-foreground mb-1">Tyutor</p>
                      <p className="text-sm font-medium">{tutor.fullName}</p>
                      <p className="text-xs text-muted-foreground">Guruh: {tutor.tutorProfile?.assignedGroup}</p>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </MotionPanel>
        </div>

        {/* KPI ballari taqsimoti */}
        <MotionPanel delay={0.2}>
          <Card className="glass-panel">
            <CardHeader>
              <CardTitle>Batafsil KPI taqsimoti</CardTitle>
              <CardDescription>Har bir yo'nalish bo'yicha olingan ballar</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {[
                  { label: "Akademik natija", value: student.kpi.academic, max: 40, icon: GraduationCap, color: "text-emerald-500" },
                  { label: "Davomat", value: student.kpi.attendance, max: 20, icon: Calendar, color: "text-cyan-500" },
                  { label: "Amaliy ko'nikmalar", value: student.kpi.assignment, max: 15, icon: BookOpen, color: "text-sky-500" },
                  { label: "Faollik", value: student.kpi.activity, max: 10, icon: Award, color: "text-amber-500" },
                  { label: "Tyutor bahosi", value: student.kpi.tutor, max: 5, icon: Users, color: "text-rose-500" },
                  { label: "Intizom", value: student.kpi.discipline, max: 10, icon: Shield, color: "text-blue-500" },
                ].map((item) => {
                  const Icon = item.icon;
                  const percent = (item.value / item.max) * 100;
                  return (
                    <div key={item.label} className="rounded-lg border border-border/40 bg-secondary/10 p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Icon className={`h-4 w-4 ${item.color}`} />
                        <span className="text-sm font-medium">{item.label}</span>
                      </div>
                      <div className="flex items-end justify-between">
                        <span className="text-2xl font-bold">{item.value}</span>
                        <span className="text-xs text-muted-foreground">/ {item.max} ball</span>
                      </div>
                      <Progress value={percent} className="h-1.5 mt-2" />
                      <p className="text-xs text-muted-foreground mt-1">{Math.round(percent)}%</p>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </MotionPanel>
      </div>
    </DashboardShell>
  );
}

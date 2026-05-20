import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusBadge } from "@/components/shared/status-badge";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Activity, BookOpen, User } from "lucide-react";
import { getMentorStudents } from "@/services/dashboard-data";
import { CompleteRecoveryButton, MentorStudentActions } from "@/components/dashboard/mentor-actions";

export const dynamic = "force-dynamic";

export default async function MentorDashboardPage() {
  const rows = await getMentorStudents();

  // High risk students
  const riskStudents = rows.filter(
    (row) => row.grant.grantStatus === "RISK" || row.grant.grantStatus === "DENIED"
  );

  return (
    <DashboardShell title="Mentor paneli" eyebrow="Talabalarni qo'llab-quvvatlash markazi">
      <div className="grid gap-6">
        {/* Yuqori xavf ostidagi talabalar ro'yxati */}
        <Card className="glass-panel">
          <CardHeader>
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-500/10 text-red-400">
                <AlertCircle className="h-5 w-5" />
              </span>
              <div>
                <CardTitle>Nizom bo'yicha grant xavfi ostidagi talabalar</CardTitle>
                <CardDescription>
                  KPI balli 80 dan past yoki akademik o'zlashtirishi (GPA) 80% dan past bo'lgan, grantini yo'qotish arafasidagi talabalar
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {riskStudents.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">Hozirda grant xavfi ostida bo'lgan talabalar mavjud emas.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Talaba</TableHead>
                    <TableHead>Fakultet / Guruh</TableHead>
                    <TableHead>Yakuniy ball</TableHead>
                    <TableHead>O'zlashtirish (GPA)</TableHead>
                    <TableHead>Grant holati</TableHead>
                    <TableHead className="text-right">Harakat</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {riskStudents.map(({ student, grant }) => (
                    <TableRow key={student.id} className="hover:bg-white/5">
                      <TableCell>
                        <div className="font-semibold text-sm">{student.name}</div>
                        <div className="text-xs text-muted-foreground">{student.email}</div>
                      </TableCell>
                      <TableCell>
                        <div>{student.faculty}</div>
                        <div className="text-xs text-muted-foreground">{student.group}</div>
                      </TableCell>
                      <TableCell>
                        <span className="font-bold text-red-400">{grant.finalScore} ball</span>
                      </TableCell>
                      <TableCell>
                        <span className={`font-semibold ${student.kpi.academicPercent < 80 ? 'text-red-400' : 'text-neutral-300'}`}>
                          {student.kpi.academicPercent}%
                        </span>
                      </TableCell>
                      <TableCell>
                        <StatusBadge value={grant.grantStatus} />
                      </TableCell>
                      <TableCell className="text-right">
                        <MentorStudentActions student={student} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Reabilitatsiya (Recovery) rejasi tasdiqlash jarayoni */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Jarimalarni qoplash (Recovery) jarayonidagi talabalar */}
          <Card className="glass-panel">
            <CardHeader>
              <CardTitle className="text-base sm:text-lg">Reabilitatsiya (Recovery) jarayoni</CardTitle>
              <CardDescription>
                Talabaning jarimalarni yuvish va qo'shimcha vazifalarni bajarish holati (Max: +10 ball)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {rows.map(({ student }) => (
                <div key={student.id} className="p-4 rounded-lg bg-secondary/10 border border-white/5 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-sm">{student.name}</p>
                      <p className="text-xs text-muted-foreground">{student.group} • Tyutor bahosi: {student.kpi.tutor}/5 ball</p>
                    </div>
                    <Badge variant="outline" className="border-emerald-500/30 text-emerald-400">
                      +{student.kpi.recovery} ball tiklandi
                    </Badge>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Bajarilish darajasi</span>
                      <span>{student.recoveryStatus}%</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-white/5 overflow-hidden">
                      <div 
                        className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-300"
                        style={{ width: `${student.recoveryStatus}%` }}
                      />
                    </div>
                  </div>
                  {student.recoveryTasks.length > 0 && (
                    <div className="grid gap-2 border-t border-white/5 pt-3">
                      {student.recoveryTasks.slice(0, 3).map((task) => (
                        <div key={task.id} className="flex flex-col gap-2 rounded-md bg-background/30 p-3 sm:flex-row sm:items-center sm:justify-between">
                          <div>
                            <p className="text-xs font-medium">{task.title}</p>
                            <p className="text-[11px] text-muted-foreground">
                              {task.deadline} / +{task.recoveryScore} ball / {task.status}
                            </p>
                          </div>
                          <CompleteRecoveryButton taskId={task.id} disabled={task.status === "COMPLETED"} />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Ijtimoiy Mas'uliyat & Mentorlik vazifalari */}
          <Card className="glass-panel">
            <CardHeader>
              <CardTitle className="text-base sm:text-lg">Mentorlik va Ijtimoiy mas'uliyat</CardTitle>
              <CardDescription>
                Nizom bo'yicha talabalarga beriladigan jamoaviy va ijtimoiy vazifalar nazorati
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 rounded-lg bg-secondary/10 border border-white/5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-sm text-cyan-300 flex items-center gap-2">
                    <BookOpen className="h-4 w-4" /> Peer-to-Peer Mentorlik
                  </span>
                  <Badge className="bg-yellow-600/30 text-yellow-300 border-yellow-500/20">3 ball</Badge>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  O'zlashtirishi past kamida 3 nafar talabaga ustozlik qilish va ularning natijalarini yaxshilashda ko'maklashish.
                </p>
              </div>

              <div className="p-4 rounded-lg bg-secondary/10 border border-white/5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-sm text-cyan-300 flex items-center gap-2">
                    <Activity className="h-4 w-4" /> Volontyorlik & Tashkilotchilik
                  </span>
                  <Badge className="bg-yellow-600/30 text-yellow-300 border-yellow-500/20">1-2 ball</Badge>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Universitet miqyosida o'tkaziladigan ijtimoiy xayriya va ma'naviy tadbirlarni tashkil qilishdagi ishtirok darajasi.
                </p>
              </div>

              <div className="p-4 rounded-lg bg-secondary/10 border border-white/5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-sm text-cyan-300 flex items-center gap-2">
                    <User className="h-4 w-4" /> Yo'nalish rahbari yordamchisi
                  </span>
                  <Badge className="bg-yellow-600/30 text-yellow-300 border-yellow-500/20">3-4 ball</Badge>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  PDP Academy, PDP School yoki PDP Junior rahbarlariga ma'muriy, tashkiliy hamda strategik yordamchi bo'lib ishlash.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardShell>
  );
}

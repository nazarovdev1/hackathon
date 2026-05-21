import { notFound } from "next/navigation";
import { headers } from "next/headers";
import { getLeaderboard } from "@/services/leaderboard";
import { getCurrentStudentDashboard } from "@/services/dashboard-data";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Trophy, Medal, Star, Target } from "lucide-react";
import { MotionPanel } from "@/components/providers/motion-panel";
import { Badge } from "@/components/ui/badge";

export const metadata = {
  title: "Reyting - PDP METRIC",
  description: "Talabalar o'rtasidagi umumiy reyting va o'rinlar.",
};

export const dynamic = "force-dynamic";

export default async function StudentRatingPage() {
  const headersList = await headers();
  const pathname = headersList.get("x-pathname") || "/dashboard/student/rating";

  const currentStudent = await getCurrentStudentDashboard();
  if (!currentStudent) notFound();

  const leaderboard = await getLeaderboard();
  
  const currentPosition = leaderboard.find((item) => item.id === currentStudent.id)?.position ?? 0;

  return (
    <DashboardShell title="Reyting jadvali" eyebrow="KPI reytingi" pathname={pathname}>
      <div className="grid gap-6">
        {/* Shaxsiy o'rin kartasi */}
        <MotionPanel>
          <div className="bg-gradient-to-r from-emerald-500/10 via-teal-500/5 to-transparent border border-emerald-500/20 rounded-lg p-6 relative overflow-hidden">
            <div className="absolute right-6 top-6 opacity-10">
              <Trophy className="h-28 w-28 text-emerald-500" />
            </div>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400">Sizning joriy o'rningiz</p>
                <h2 className="mt-1 text-3xl font-bold tracking-tight">{currentStudent.name}</h2>
                <p className="mt-1 text-sm text-muted-foreground">{currentStudent.faculty} — {currentStudent.group}</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500 text-white font-bold text-2xl shadow-lg shadow-emerald-500/20 ring-4 ring-emerald-500/10">
                  #{currentPosition}
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">Umumiy ball</p>
                  <p className="text-lg font-bold text-foreground">
                    {leaderboard.find((item) => item.id === currentStudent.id)?.score ?? 0} ball
                  </p>
                </div>
              </div>
            </div>
          </div>
        </MotionPanel>

        {/* Kuchli uchlik (Top 3) */}
        <div className="grid gap-4 sm:grid-cols-3">
          {leaderboard.slice(0, 3).map((item, idx) => {
            const medalIcons = [
              <Trophy className="h-8 w-8 text-amber-500" key="gold" />,
              <Medal className="h-8 w-8 text-slate-400" key="silver" />,
              <Medal className="h-8 w-8 text-amber-700" key="bronze" />,
            ];

            return (
              <MotionPanel delay={(idx + 1) * 0.05} key={item.id}>
                <Card className={`glass-panel border-l-4 border-l-${idx === 0 ? "amber-500" : idx === 1 ? "slate-400" : "amber-700"}`}>
                  <CardHeader className="pb-3 flex flex-row items-center justify-between">
                    <div>
                      <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                        {idx + 1}-O'RIN
                      </CardTitle>
                      <CardDescription className="text-xs">Top talaba</CardDescription>
                    </div>
                    {medalIcons[idx]}
                  </CardHeader>
                  <CardContent>
                    <p className="font-bold text-foreground truncate">{item.name}</p>
                    <p className="text-xs text-muted-foreground truncate mt-0.5">{item.faculty}</p>
                    <div className="mt-3 flex items-center justify-between">
                      <Badge variant="outline" className="text-xs font-semibold">
                        {item.score} ball
                      </Badge>
                      {item.id === currentStudent.id && (
                        <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                          <Star className="h-3.5 w-3.5 fill-current" /> Siz
                        </span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </MotionPanel>
            );
          })}
        </div>

        {/* Umumiy Ro'yxat */}
        <MotionPanel delay={0.2}>
          <Card className="glass-panel">
            <CardHeader>
              <CardTitle>Barcha talabalar reytingi</CardTitle>
              <CardDescription>Grant talablari bo'yicha hisoblangan yakuniy ballar asosida shakllantirilgan haftalik reyting.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-16">O'rin</TableHead>
                      <TableHead>F.I.SH.</TableHead>
                      <TableHead>Fakultet</TableHead>
                      <TableHead className="text-right">Yakuniy Ball</TableHead>
                      <TableHead className="w-24"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {leaderboard.map((item) => {
                      const isSelf = item.id === currentStudent.id;
                      return (
                        <TableRow 
                          key={item.id}
                          className={isSelf ? "bg-emerald-500/5 hover:bg-emerald-500/10 font-medium transition-colors" : ""}
                        >
                          <TableCell className="font-bold">
                            {item.position === 1 ? (
                              <span className="text-amber-500">🏆 1</span>
                            ) : item.position === 2 ? (
                              <span className="text-slate-400">🥈 2</span>
                            ) : item.position === 3 ? (
                              <span className="text-amber-700">🥉 3</span>
                            ) : (
                              item.position
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <span>{item.name}</span>
                              {isSelf && (
                                <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-[10px] px-1.5 py-0">
                                  Siz
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="text-muted-foreground">{item.faculty}</TableCell>
                          <TableCell className="text-right font-semibold text-foreground">
                            {item.score} ball
                          </TableCell>
                          <TableCell className="text-right">
                            {isSelf ? (
                              <Target className="h-4 w-4 text-emerald-500 ml-auto" />
                            ) : null}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </MotionPanel>
      </div>
    </DashboardShell>
  );
}

import { Award, Gauge, GraduationCap, TrendingUp, UserCheck } from "lucide-react";
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
    <DashboardShell title="Student Dashboard" eyebrow="Personal Grant Monitor">
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
                <Badge variant="outline" className="border-cyan-300/40 text-cyan-100">Rank #{position}</Badge>
              </div>
            </div>
          </div>
        </MotionPanel>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <MotionPanel delay={0.03}>
            <MetricCard title="Final Score" value={`${grant.finalScore}`} helper="Main KPI - penalty + recovery + employment" icon={Gauge} />
          </MotionPanel>
          <MotionPanel delay={0.06}>
            <MetricCard title="Main KPI" value={`${grant.mainKpi}`} helper="Academic, attendance, activity and discipline" icon={TrendingUp} />
          </MotionPanel>
          <MotionPanel delay={0.09}>
            <MetricCard title="Attendance" value={`${student.attendanceTrend.at(-1)?.value}%`} helper="Latest monthly attendance" icon={UserCheck} />
          </MotionPanel>
          <MotionPanel delay={0.12}>
            <MetricCard title="Academic" value={`${student.kpi.academicPercent}%`} helper="Grant rule minimum is 80%" icon={GraduationCap} />
          </MotionPanel>
        </div>

        <div id="analytics" className="grid gap-5 xl:grid-cols-2">
          <Card className="glass-panel">
            <CardHeader>
              <CardTitle>Attendance Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <AttendanceChart data={student.attendanceTrend} />
            </CardContent>
          </Card>
          <Card className="glass-panel">
            <CardHeader>
              <CardTitle>Academic Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <AcademicChart data={student.academicTrend} />
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-5 xl:grid-cols-[1fr_0.85fr]">
          <Card className="glass-panel">
            <CardHeader>
              <CardTitle>Penalty History</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead className="text-right">Score</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {student.penalties.map((penalty) => (
                    <TableRow key={`${penalty.date}-${penalty.reason}`}>
                      <TableCell>{penalty.date}</TableCell>
                      <TableCell>{penalty.reason}</TableCell>
                      <TableCell className="text-right text-rose-200">-{penalty.score}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card className="glass-panel">
            <CardHeader>
              <CardTitle>Recovery Status</CardTitle>
            </CardHeader>
            <CardContent>
              <Progress value={student.recoveryStatus} />
              <p className="mt-3 text-sm text-muted-foreground">{student.recoveryStatus}% recovery plan completed</p>
              <div className="mt-5 grid gap-3">
                {recommendations.map((item) => (
                  <div key={item.title} className="rounded-md border border-white/10 bg-secondary/40 p-3">
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

        <div className="grid gap-4 md:grid-cols-2">
          {student.achievements.map((achievement) => (
            <Card key={achievement.title} className="glass-panel">
              <CardContent className="flex items-center gap-4 p-5">
                <div className="flex h-11 w-11 items-center justify-center rounded-md bg-cyan-300/10 text-cyan-200">
                  <Award className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold">{achievement.title}</h3>
                  <p className="text-sm text-muted-foreground">{achievement.category} / +{achievement.score} score</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardShell>
  );
}

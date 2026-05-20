import { AlertTriangle, Filter, ShieldCheck, Trophy, Users } from "lucide-react";
import { GrantDistributionChart } from "@/components/charts/analytics-charts";
import { MetricCard } from "@/components/dashboard/metric-card";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { MotionPanel } from "@/components/providers/motion-panel";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { calculateGrantScore } from "@/services/grant-engine";
import { getLeaderboard } from "@/services/leaderboard";
import { students } from "@/services/mock-data";

export default function AdminDashboardPage() {
  const rows = students.map((student) => ({ student, grant: calculateGrantScore(student.kpi) }));
  const eligible = rows.filter((row) => row.grant.grantStatus === "ELIGIBLE").length;
  const highRisk = rows.filter((row) => row.grant.riskLevel === "HIGH").length;
  const distribution = ["ELIGIBLE", "RISK", "DENIED"].map((status) => ({
    status,
    count: rows.filter((row) => row.grant.grantStatus === status).length,
  }));
  const leaderboard = getLeaderboard();

  return (
    <DashboardShell title="Admin Dashboard" eyebrow="Enterprise Grant Operations">
      <div className="grid gap-5">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <MotionPanel delay={0.03}>
            <MetricCard title="Total Students" value={`${students.length}`} helper="Active monitored profiles" icon={Users} />
          </MotionPanel>
          <MotionPanel delay={0.06}>
            <MetricCard title="Eligible Grants" value={`${eligible}`} helper="Final score is 80 or higher" icon={ShieldCheck} />
          </MotionPanel>
          <MotionPanel delay={0.09}>
            <MetricCard title="High Risk" value={`${highRisk}`} helper="Academic denied or score below 65" icon={AlertTriangle} />
          </MotionPanel>
          <MotionPanel delay={0.12}>
            <MetricCard title="Top Score" value={`${leaderboard[0]?.score ?? 0}`} helper={leaderboard[0]?.name ?? "No data"} icon={Trophy} />
          </MotionPanel>
        </div>

        <Tabs defaultValue="students" className="w-full">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <TabsList className="glass-panel">
              <TabsTrigger value="students">Students</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
            </TabsList>
            <div className="flex gap-2">
              <Select defaultValue="all">
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Faculty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All faculties</SelectItem>
                  <SelectItem value="cs">Computer Science</SelectItem>
                  <SelectItem value="ds">Data Science</SelectItem>
                </SelectContent>
              </Select>
              <DropdownMenu>
                <DropdownMenuTrigger render={<Button variant="outline" />}>
                  <Filter className="h-4 w-4" /> Filter
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Eligible only</DropdownMenuItem>
                  <DropdownMenuItem>High risk only</DropdownMenuItem>
                  <DropdownMenuItem>Penalty exists</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <TabsContent value="students" className="mt-5">
            <Card id="grants" className="glass-panel">
              <CardHeader>
                <CardTitle>Grant Status Data Table</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student</TableHead>
                      <TableHead>Faculty</TableHead>
                      <TableHead>Final Score</TableHead>
                      <TableHead>Grant</TableHead>
                      <TableHead>Risk</TableHead>
                      <TableHead className="text-right">Academic</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {rows.map(({ student, grant }) => (
                      <TableRow key={student.id}>
                        <TableCell>
                          <div className="font-medium">{student.name}</div>
                          <div className="text-xs text-muted-foreground">{student.email}</div>
                        </TableCell>
                        <TableCell>{student.faculty}</TableCell>
                        <TableCell>{grant.finalScore}</TableCell>
                        <TableCell><StatusBadge value={grant.grantStatus} /></TableCell>
                        <TableCell><StatusBadge value={grant.riskLevel} /></TableCell>
                        <TableCell className="text-right">{student.kpi.academicPercent}%</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="mt-5">
            <Card className="glass-panel">
              <CardHeader>
                <CardTitle>Grant Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <GrantDistributionChart data={distribution} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="leaderboard" className="mt-5">
            <Card id="leaderboard" className="glass-panel">
              <CardHeader>
                <CardTitle>Leaderboard Management</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3">
                  {leaderboard.map((student) => (
                    <div key={student.id} className="flex items-center justify-between rounded-md border border-white/10 bg-secondary/40 p-4">
                      <div>
                        <p className="font-medium">#{student.position} {student.name}</p>
                        <p className="text-sm text-muted-foreground">{student.faculty}</p>
                      </div>
                      <div className="text-2xl font-semibold">{student.score}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardShell>
  );
}

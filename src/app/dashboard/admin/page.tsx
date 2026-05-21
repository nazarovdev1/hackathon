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
import { getAdminGrantOverview } from "@/services/dashboard-data";

export const dynamic = 'force-dynamic'

export default async function AdminDashboardPage() {
  const { rows, eligible, highRisk, distribution, leaderboard, total } = await getAdminGrantOverview();

	return (
		<DashboardShell
			title='Admin boshqaruv paneli'
			eyebrow='Universitet grant operatsiyalari'
		>
			<div className='grid gap-5'>
				<div className='grid gap-4 md:grid-cols-2 xl:grid-cols-4'>
					<MotionPanel delay={0.03}>
						<MetricCard
							title='Jami talabalar'
							value={`${total}`}
							helper='Faol nazoratdagi profillar'
							icon={Users}
						/>
					</MotionPanel>
					<MotionPanel delay={0.06}>
						<MetricCard
							title='Grantga munosiblar'
							value={`${eligible}`}
							helper='Yakuniy balli 80 va undan yuqori'
							icon={ShieldCheck}
						/>
					</MotionPanel>
					<MotionPanel delay={0.09}>
						<MetricCard
							title='Yuqori xavf guruhi'
							value={`${highRisk}`}
							helper='Akademik rad etilgan yoki ball 65 dan past'
							icon={AlertTriangle}
						/>
					</MotionPanel>
					<MotionPanel delay={0.12}>
						<MetricCard
							title='Eng yuqori ball'
							value={`${leaderboard[0]?.score ?? 0}`}
							helper={leaderboard[0]?.name ?? "Ma'lumot yo'q"}
							icon={Trophy}
						/>
					</MotionPanel>
				</div>

        <Tabs defaultValue="students" className="w-full">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <TabsList className="glass-panel">
              <TabsTrigger value="students">Talabalar</TabsTrigger>
              <TabsTrigger value="analytics">Tahlillar</TabsTrigger>
              <TabsTrigger value="leaderboard">Reyting</TabsTrigger>
            </TabsList>
            <div className="flex gap-2">
              <Select defaultValue="all">
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Fakultet" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Barcha fakultetlar</SelectItem>
                  <SelectItem value="cs">Computer Science</SelectItem>
                  <SelectItem value="ds">Data Science</SelectItem>
                </SelectContent>
              </Select>
              <DropdownMenu>
                <DropdownMenuTrigger render={<Button variant="outline" />}>
                  <Filter className="h-4 w-4" /> Saralash
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Faqat grantdagilar</DropdownMenuItem>
                  <DropdownMenuItem>Faqat yuqori xavfdagilar</DropdownMenuItem>
                  <DropdownMenuItem>Jarimasi borlar</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <TabsContent value="students" className="mt-5">
            <Card id="grants" className="glass-panel">
              <CardHeader>
                <CardTitle>Grant holatlari jadvali</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Talaba</TableHead>
                      <TableHead>Fakultet</TableHead>
                      <TableHead>Yakuniy ball</TableHead>
                      <TableHead>Grant holati</TableHead>
                      <TableHead>Xavf darajasi</TableHead>
                      <TableHead className="text-right">O'zlashtirish</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {rows.map((row) => (
                      <TableRow key={row.id}>
                        <TableCell>
                          <div className="font-medium">{row.name}</div>
                          <div className="text-xs text-muted-foreground">{row.email}</div>
                        </TableCell>
                        <TableCell>{row.faculty}</TableCell>
                        <TableCell>{row.grant.finalScore}</TableCell>
                        <TableCell><StatusBadge value={row.grant.grantStatus} /></TableCell>
                        <TableCell><StatusBadge value={row.grant.riskLevel} /></TableCell>
                        <TableCell className="text-right">{row.academicPercent}%</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

					<TabsContent value='analytics' className='mt-5'>
						<Card className='glass-panel'>
							<CardHeader>
								<CardTitle>Grantlar taqsimoti</CardTitle>
							</CardHeader>
							<CardContent>
								<GrantDistributionChart data={distribution} />
							</CardContent>
						</Card>
					</TabsContent>

					<TabsContent value='leaderboard' className='mt-5'>
						<Card id='leaderboard' className='glass-panel'>
							<CardHeader>
								<CardTitle>Reyting jadvalini boshqarish</CardTitle>
							</CardHeader>
							<CardContent>
								<div className='grid gap-3'>
									{leaderboard.map(student => (
										<div
											key={student.id}
											className='flex items-center justify-between rounded-md border border-white/10 bg-secondary/40 p-4'
										>
											<div>
												<p className='font-medium'>
													#{student.position} {student.name}
												</p>
												<p className='text-sm text-muted-foreground'>
													{student.faculty}
												</p>
											</div>
											<div className='text-2xl font-semibold'>
												{student.score}
											</div>
										</div>
									))}
								</div>
							</CardContent>
						</Card>
					</TabsContent>
				</Tabs>
			</div>
		</DashboardShell>
	)
}

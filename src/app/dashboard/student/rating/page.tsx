import { notFound } from 'next/navigation'
import { Medal, Star, Target, Trophy } from 'lucide-react'
import { DashboardShell } from '@/components/layout/dashboard-shell'
import { MotionPanel } from '@/components/providers/motion-panel'
import { Badge } from '@/components/ui/badge'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table'
import {
	getCurrentStudentDashboard,
	getLeaderboard,
} from '@/services/dashboard-data'

export const metadata = {
	title: 'Reyting - PDP METRIC',
	description: "Talabalar o'rtasidagi umumiy reyting va o'rinlar.",
}

export const dynamic = 'force-dynamic'

export default async function StudentRatingPage() {
	const [currentStudent, leaderboard] = await Promise.all([
		getCurrentStudentDashboard(),
		getLeaderboard(),
	])
	if (!currentStudent) notFound()

	const currentEntry = leaderboard.find(item => item.id === currentStudent.id)
	const currentPosition = currentEntry?.position ?? 0

	return (
		<DashboardShell title='Reyting jadvali' eyebrow='KPI reytingi'>
			<div className='grid gap-6'>
				<MotionPanel>
					<div className='relative overflow-hidden rounded-lg border border-emerald-500/20 bg-gradient-to-r from-emerald-500/10 via-teal-500/5 to-transparent p-6'>
						<div className='absolute right-6 top-6 opacity-10'>
							<Trophy className='h-28 w-28 text-emerald-500' />
						</div>
						<div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
							<div>
								<p className='text-sm font-medium text-emerald-600 dark:text-emerald-400'>
									Sizning joriy o'rningiz
								</p>
								<h2 className='mt-1 text-3xl font-bold tracking-tight'>
									{currentStudent.name}
								</h2>
								<p className='mt-1 text-sm text-muted-foreground'>
									{currentStudent.faculty} - {currentStudent.group}
								</p>
							</div>
							<div className='flex items-center gap-3'>
								<div className='flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500 text-2xl font-bold text-white shadow-lg shadow-emerald-500/20 ring-4 ring-emerald-500/10'>
									#{currentPosition}
								</div>
								<div>
									<p className='text-xs uppercase tracking-wider text-muted-foreground'>
										Umumiy ball
									</p>
									<p className='text-lg font-bold text-foreground'>
										{currentEntry?.score ?? 0} ball
									</p>
								</div>
							</div>
						</div>
					</div>
				</MotionPanel>

				<div className='grid gap-4 sm:grid-cols-3'>
					{leaderboard.slice(0, 3).map((item, index) => {
						const icon =
							index === 0 ? (
								<Trophy className='h-8 w-8 text-amber-500' />
							) : (
								<Medal
									className={
										index === 1
											? 'h-8 w-8 text-slate-400'
											: 'h-8 w-8 text-amber-700'
									}
								/>
							)

						return (
							<MotionPanel delay={(index + 1) * 0.05} key={item.id}>
								<Card className='glass-panel'>
									<CardHeader className='flex flex-row items-center justify-between pb-3'>
										<div>
											<CardTitle className='text-sm font-semibold uppercase tracking-wider text-muted-foreground'>
												{index + 1}-O'RIN
											</CardTitle>
											<CardDescription className='text-xs'>
												Top talaba
											</CardDescription>
										</div>
										{icon}
									</CardHeader>
									<CardContent>
										<p className='truncate font-bold text-foreground'>{item.name}</p>
										<p className='mt-0.5 truncate text-xs text-muted-foreground'>
											{item.faculty}
										</p>
										<div className='mt-3 flex items-center justify-between'>
											<Badge variant='outline' className='text-xs font-semibold'>
												{item.score} ball
											</Badge>
											{item.id === currentStudent.id && (
												<span className='flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400'>
													<Star className='h-3.5 w-3.5 fill-current' /> Siz
												</span>
											)}
										</div>
									</CardContent>
								</Card>
							</MotionPanel>
						)
					})}
				</div>

				<MotionPanel delay={0.2}>
					<Card className='glass-panel'>
						<CardHeader>
							<CardTitle>Barcha talabalar reytingi</CardTitle>
							<CardDescription>
								Grant talablari bo'yicha hisoblangan yakuniy ballar asosida
								shakllantirilgan haftalik reyting.
							</CardDescription>
						</CardHeader>
						<CardContent>
							<div className='overflow-x-auto'>
								<Table>
									<TableHeader>
										<TableRow>
											<TableHead className='w-16'>O'rin</TableHead>
											<TableHead>F.I.SH.</TableHead>
											<TableHead>Fakultet</TableHead>
											<TableHead className='text-right'>Yakuniy Ball</TableHead>
											<TableHead className='w-24' />
										</TableRow>
									</TableHeader>
									<TableBody>
										{leaderboard.map(item => {
											const isSelf = item.id === currentStudent.id
											return (
												<TableRow
													key={item.id}
													className={
														isSelf
															? 'bg-emerald-500/5 font-medium transition-colors hover:bg-emerald-500/10'
															: ''
													}
												>
													<TableCell className='font-bold'>
														{item.position}
													</TableCell>
													<TableCell>
														<div className='flex items-center gap-2'>
															<span>{item.name}</span>
															{isSelf && (
																<Badge
																	variant='secondary'
																	className='border border-emerald-500/20 bg-emerald-500/10 px-1.5 py-0 text-[10px] text-emerald-600 dark:text-emerald-400'
																>
																	Siz
																</Badge>
															)}
														</div>
													</TableCell>
													<TableCell className='text-muted-foreground'>
														{item.faculty}
													</TableCell>
													<TableCell className='text-right font-semibold text-foreground'>
														{item.score} ball
													</TableCell>
													<TableCell className='text-right'>
														{isSelf ? (
															<Target className='ml-auto h-4 w-4 text-emerald-500' />
														) : null}
													</TableCell>
												</TableRow>
											)
										})}
									</TableBody>
								</Table>
							</div>
						</CardContent>
					</Card>
				</MotionPanel>
			</div>
		</DashboardShell>
	)
}

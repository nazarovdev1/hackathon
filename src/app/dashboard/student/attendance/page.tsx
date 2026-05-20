import { AttendanceCalendar } from '@/components/dashboard/attendance-calendar'
import { SubjectBreakdown } from '@/components/dashboard/subject-breakdown'
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
import { Progress } from '@/components/ui/progress'
import { getStudentAttendance } from '@/services/attendance.service'
import { getCurrentStudentDashboard } from '@/services/dashboard-data'
import {
	AlertCircle,
	Calendar,
	CheckCircle2,
	Clock,
	Timer,
	XCircle,
} from 'lucide-react'
import { notFound } from 'next/navigation'

type AttendanceLog = {
	date: string
	time: string | null
	status: string
	reason: string | null
}

type SubjectData = {
	subject_id: string
	subject_name: string
	teacher: string
	subject_summary: {
		total: number
		attended: number
		absent: number
		percentage: number
	}
	logs: AttendanceLog[]
}

export const dynamic = 'force-dynamic'

export default async function StudentAttendancePage() {
	const student = await getCurrentStudentDashboard()
	if (!student) notFound()

	const attendanceData = await getStudentAttendance(student.id)
	if (!attendanceData) notFound()

	const { attendance_summary, subjects } = attendanceData as {
		attendance_summary: {
			total_lessons: number
			attended: number
			absent: number
			attendance_percentage: number
		}
		subjects: SubjectData[]
	}
	const percentage = attendance_summary.attendance_percentage
	const riskLevel =
		percentage >= 90 ? 'LOW' : percentage >= 75 ? 'MEDIUM' : 'HIGH'

	const statusColors = {
		LOW: 'text-emerald-600 dark:text-emerald-400',
		MEDIUM: 'text-amber-600 dark:text-amber-400',
		HIGH: 'text-rose-600 dark:text-rose-400',
	}

	const statusBg = {
		LOW: 'from-emerald-500/10 via-emerald-500/5 to-transparent border-emerald-500/20',
		MEDIUM:
			'from-amber-500/10 via-amber-500/5 to-transparent border-amber-500/20',
		HIGH: 'from-rose-500/10 via-rose-500/5 to-transparent border-rose-500/20',
	}

	return (
		<DashboardShell title='Davomat' eyebrow='Qatnashuv nazorati'>
			<div className='grid gap-6'>
				{/* Yuqori statistika */}
				<MotionPanel>
					<div
						className={`bg-linear-to-r ${statusBg[riskLevel]} border rounded-lg p-6 relative overflow-hidden`}
					>
						<div className='absolute right-6 top-6 opacity-10'>
							<Calendar className='h-28 w-28' />
						</div>
						<div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
							<div>
								<p className={`text-sm font-medium ${statusColors[riskLevel]}`}>
									{riskLevel === 'LOW'
										? 'Davomat yaxshi'
										: riskLevel === 'MEDIUM'
											? "Davomat o'rtacha"
											: "Davomat past — e'tibor bering!"}
								</p>
								<h2 className='mt-1 text-3xl font-bold tracking-tight'>
									{student.name}
								</h2>
								<p className='mt-1 text-sm text-muted-foreground'>
									{student.faculty} — {student.group}
								</p>
							</div>
							<div className='flex items-center gap-4'>
								<div className='text-right'>
									<p className='text-xs text-muted-foreground uppercase tracking-wider'>
										Davomat foizi
									</p>
									<p
										className={`text-4xl font-bold ${statusColors[riskLevel]}`}
									>
										{percentage}%
									</p>
								</div>
								<div className='flex flex-col gap-1'>
									<div className='flex items-center gap-2 text-xs'>
										<CheckCircle2 className='h-3.5 w-3.5 text-emerald-500' />
										<span>{attendance_summary.attended} qatnashgan</span>
									</div>
									<div className='flex items-center gap-2 text-xs'>
										<XCircle className='h-3.5 w-3.5 text-rose-500' />
										<span>{attendance_summary.absent} qatnashmagan</span>
									</div>
									<div className='flex items-center gap-2 text-xs'>
										<Timer className='h-3.5 w-3.5 text-muted-foreground' />
										<span>Jami {attendance_summary.total_lessons} dars</span>
									</div>
								</div>
							</div>
						</div>
						<div className='mt-4'>
							<Progress value={percentage} className='h-2' />
						</div>
					</div>
				</MotionPanel>

				{/* KPI kartalar */}
				<div className='grid gap-4 sm:grid-cols-3'>
					<MotionPanel delay={0.05}>
						<Card className='glass-panel'>
							<CardContent className='pt-6'>
								<div className='flex items-center justify-between'>
									<div>
										<p className='text-sm text-muted-foreground'>Qatnashgan</p>
										<p className='text-2xl font-bold text-emerald-600 dark:text-emerald-400'>
											{attendance_summary.attended}
										</p>
									</div>
									<div className='h-10 w-10 rounded-full bg-emerald-500/10 flex items-center justify-center'>
										<CheckCircle2 className='h-5 w-5 text-emerald-500' />
									</div>
								</div>
							</CardContent>
						</Card>
					</MotionPanel>

					<MotionPanel delay={0.1}>
						<Card className='glass-panel'>
							<CardContent className='pt-6'>
								<div className='flex items-center justify-between'>
									<div>
										<p className='text-sm text-muted-foreground'>
											Qatnashmagan
										</p>
										<p className='text-2xl font-bold text-rose-600 dark:text-rose-400'>
											{attendance_summary.absent}
										</p>
									</div>
									<div className='h-10 w-10 rounded-full bg-rose-500/10 flex items-center justify-center'>
										<XCircle className='h-5 w-5 text-rose-500' />
									</div>
								</div>
							</CardContent>
						</Card>
					</MotionPanel>

					<MotionPanel delay={0.15}>
						<Card className='glass-panel'>
							<CardContent className='pt-6'>
								<div className='flex items-center justify-between'>
									<div>
										<p className='text-sm text-muted-foreground'>
											Jami darslar
										</p>
										<p className='text-2xl font-bold'>
											{attendance_summary.total_lessons}
										</p>
									</div>
									<div className='h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center'>
										<Clock className='h-5 w-5 text-primary' />
									</div>
								</div>
							</CardContent>
						</Card>
					</MotionPanel>
				</div>

				{/* Fanlar bo'yicha tahlil */}
				<MotionPanel delay={0.2}>
					<SubjectBreakdown subjects={subjects} />
				</MotionPanel>

				{/* Davomat kalendari va sabablar */}
				<div className='grid gap-6 lg:grid-cols-2'>
					<MotionPanel delay={0.25}>
						<AttendanceCalendar subjects={subjects} />
					</MotionPanel>

					<MotionPanel delay={0.3}>
						<Card className='glass-panel'>
							<CardHeader>
								<CardTitle className='flex items-center gap-2'>
									<AlertCircle className='h-5 w-5 text-amber-500' />
									Qatnashmagan darslar sabablari
								</CardTitle>
								<CardDescription>
									Barcha absent holatlar va ularning sabablari
								</CardDescription>
							</CardHeader>
							<CardContent className='space-y-3'>
								{subjects.flatMap(s =>
									s.logs
										.filter(log => log.status === 'absent')
										.map((log, idx: number) => (
											<div
												key={`${s.subject_id}-${idx}`}
												className='rounded-md border border-border/40 bg-secondary/10 p-3'
											>
												<div className='flex items-start justify-between gap-2'>
													<div>
														<p className='text-sm font-medium'>
															{s.subject_name}
														</p>
														<p className='text-xs text-muted-foreground mt-0.5'>
															{log.date} {log.time ? `soat ${log.time}` : ''}
														</p>
													</div>
													<Badge
														variant='outline'
														className={`text-xs ${
															log.reason
																? 'border-amber-500/30 text-amber-600 dark:text-amber-400'
																: 'border-rose-500/30 text-rose-600 dark:text-rose-400'
														}`}
													>
														{log.reason ? 'Uzorli' : 'Sababsiz'}
													</Badge>
												</div>
												{log.reason && (
													<p className='mt-2 text-xs text-muted-foreground italic'>
														"{log.reason}"
													</p>
												)}
											</div>
										)),
								)}
								{subjects.flatMap(s =>
									s.logs.filter(log => log.status === 'absent'),
								).length === 0 && (
									<div className='text-center py-8 text-muted-foreground'>
										<CheckCircle2 className='h-10 w-10 mx-auto opacity-30 mb-2 text-emerald-500' />
										<p className='text-sm'>
											Ajoyib! Barcha darslarga qatnashgansiz
										</p>
									</div>
								)}
							</CardContent>
						</Card>
					</MotionPanel>
				</div>
			</div>
		</DashboardShell>
	)
}

'use client'

import {
	CompleteRecoveryButton,
	MentorStudentActions,
} from '@/components/dashboard/mentor-actions'
import { MentorGroupsList } from '@/components/dashboard/mentor-groups-list'
import { MotionPanel } from '@/components/providers/motion-panel'
import { StatusBadge } from '@/components/shared/status-badge'
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
import type { StudentDashboardSnapshot } from '@/types/grant'
import {
	Activity,
	AlertCircle,
	BookOpen,
	TrendingUp,
	User,
	Users,
} from 'lucide-react'
import { useEffect, useState } from 'react'

type StudentRow = {
	student: StudentDashboardSnapshot
	grant: {
		mainKpi: number
		finalScore: number
		grantStatus: 'ELIGIBLE' | 'RISK' | 'DENIED'
		riskLevel: 'LOW' | 'MEDIUM' | 'HIGH'
	}
}

type MentorDashboardClientProps = {
	rows: StudentRow[]
}

export function MentorDashboardClient({ rows }: MentorDashboardClientProps) {
	const [activeTab, setActiveTab] = useState<
		'students' | 'risk' | 'recovery' | 'criteria'
	>('students')

	useEffect(() => {
		const navigateToHash = () => {
			const hash = window.location.hash.replace('#', '')
			if (hash === 'risk-students') {
				setActiveTab('risk')
			} else if (hash === 'mentor-groups') {
				setActiveTab('students')
			} else if (hash === 'recovery-process') {
				setActiveTab('recovery')
			} else if (hash === 'mentor-criteria') {
				setActiveTab('criteria')
			}
		}

		navigateToHash()
		window.addEventListener('hashchange', navigateToHash)

		return () => {
			window.removeEventListener('hashchange', navigateToHash)
		}
	}, [])

	useEffect(() => {
		const hash = window.location.hash.replace('#', '')
		if (!hash) return

		const element = document.getElementById(hash)
		if (element) {
			element.scrollIntoView({ behavior: 'smooth', block: 'start' })
		}
	}, [activeTab])

	// Filter high risk students
	const riskStudents = rows.filter(
		row =>
			row.grant.grantStatus === 'RISK' || row.grant.grantStatus === 'DENIED',
	)

	// Filter students in recovery process (who have tasks or recovery > 0)
	const recoveryStudents = rows.filter(
		row =>
			row.student.recoveryStatus > 0 || row.student.recoveryTasks.length > 0,
	)

	const tabs = [
		{
			id: 'students',
			label: 'Guruhlar & Talabalar',
			icon: Users,
			count: rows.length,
			color: 'border-emerald-500/20 text-emerald-400 bg-emerald-500/5',
		},
		{
			id: 'risk',
			label: 'Grant Xavfi',
			icon: AlertCircle,
			count: riskStudents.length,
			color: 'border-rose-500/20 text-rose-400 bg-rose-500/5',
		},
		{
			id: 'recovery',
			label: 'Reabilitatsiya (Recovery)',
			icon: Activity,
			count: recoveryStudents.length,
			color: 'border-teal-500/20 text-teal-400 bg-teal-500/5',
		},
		{
			id: 'criteria',
			label: 'Mentorlik Nizomi',
			icon: BookOpen,
			count: null,
			color: 'border-cyan-500/20 text-cyan-400 bg-cyan-500/5',
		},
	] as const

	return (
		<div className='space-y-6'>
			{/* Dashboard Top Tabs Navigation */}
			<div className='flex flex-wrap gap-2.5 p-1.5 rounded-2xl bg-secondary/20 border border-white/5 backdrop-blur-md max-w-fit'>
				{tabs.map(tab => {
					const Icon = tab.icon
					const isActive = activeTab === tab.id
					return (
						<button
							key={tab.id}
							onClick={() => setActiveTab(tab.id)}
							className={`relative flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 cursor-pointer ${
								isActive
									? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20 scale-[1.02]'
									: 'text-muted-foreground hover:text-foreground hover:bg-white/5'
							}`}
						>
							<Icon
								className={`h-4.5 w-4.5 ${isActive ? 'text-primary-foreground' : 'text-muted-foreground'}`}
							/>
							<span>{tab.label}</span>
							{tab.count !== null && (
								<span
									className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
										isActive
											? 'bg-white/20 text-white'
											: 'bg-secondary/80 text-muted-foreground border border-white/5'
									}`}
								>
									{tab.count}
								</span>
							)}
						</button>
					)
				})}
			</div>

			{/* Tab Contents */}
			<div className='transition-all duration-300'>
				{/* 1. Guruhlar & Talabalar Tab */}
				{activeTab === 'students' && (
					<MotionPanel>
						<div id='mentor-groups' />
						<Card className='glass-panel'>
							<CardHeader>
								<div className='flex items-center gap-3'>
									<span className='flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary-foreground'>
										<Users className='h-5 w-5 text-emerald-400' />
									</span>
									<div>
										<CardTitle>
											Mentorga tegishli guruhlar va talabalar
										</CardTitle>
										<CardDescription>
											Sizga biriktirilgan guruhlar, talabalarning KPI ballari va
											batafsil ko'rsatkichlari.
										</CardDescription>
									</div>
								</div>
							</CardHeader>
							<CardContent>
								<MentorGroupsList rows={rows} />
							</CardContent>
						</Card>
					</MotionPanel>
				)}

				{/* 2. Grant Xavfi Tab */}
				{activeTab === 'risk' && (
					<MotionPanel>
						<div id='risk-students' />
						<Card className='glass-panel'>
							<CardHeader>
								<div className='flex items-center gap-3'>
									<span className='flex h-10 w-10 items-center justify-center rounded-lg bg-red-500/10 text-red-400'>
										<AlertCircle className='h-5 w-5' />
									</span>
									<div>
										<CardTitle>
											Nizom bo'yicha grant xavfi ostidagi talabalar
										</CardTitle>
										<CardDescription>
											KPI balli 80 dan past yoki akademik o'zlashtirishi (GPA)
											80% dan past bo'lgan, grantini yo'qotish arafasidagi
											talabalar.
										</CardDescription>
									</div>
								</div>
							</CardHeader>
							<CardContent>
								{riskStudents.length === 0 ? (
									<p className='text-sm text-muted-foreground py-8 text-center'>
										Hozirda grant xavfi ostida bo'lgan talabalar mavjud emas. 🎉
									</p>
								) : (
									<div className='overflow-x-auto'>
										<Table>
											<TableHeader>
												<TableRow>
													<TableHead>Talaba</TableHead>
													<TableHead>Fakultet / Guruh</TableHead>
													<TableHead>Yakuniy ball</TableHead>
													<TableHead>O'zlashtirish (GPA)</TableHead>
													<TableHead>Grant holati</TableHead>
													<TableHead className='text-right'>Harakat</TableHead>
												</TableRow>
											</TableHeader>
											<TableBody>
												{riskStudents.map(({ student, grant }) => (
													<TableRow
														key={student.id}
														className='hover:bg-white/5'
													>
														<TableCell>
															<div className='font-semibold text-sm'>
																{student.name}
															</div>
															<div className='text-xs text-muted-foreground'>
																{student.email}
															</div>
														</TableCell>
														<TableCell>
															<div>{student.faculty}</div>
															<div className='text-xs text-muted-foreground'>
																{student.group}
															</div>
														</TableCell>
														<TableCell>
															<span className='font-bold text-red-400'>
																{grant.finalScore} ball
															</span>
														</TableCell>
														<TableCell>
															<span
																className={`font-semibold ${student.kpi.academicPercent < 80 ? 'text-red-400' : 'text-neutral-300'}`}
															>
																{student.kpi.academicPercent}%
															</span>
														</TableCell>
														<TableCell>
															<StatusBadge value={grant.grantStatus} />
														</TableCell>
														<TableCell className='text-right'>
															<MentorStudentActions student={student} />
														</TableCell>
													</TableRow>
												))}
											</TableBody>
										</Table>
									</div>
								)}
							</CardContent>
						</Card>
					</MotionPanel>
				)}

				{/* 3. Reabilitatsiya Tab */}
				{activeTab === 'recovery' && (
					<MotionPanel>
						<div id='recovery-process' />
						<Card className='glass-panel'>
							<CardHeader>
								<div className='flex items-center gap-3'>
									<span className='flex h-10 w-10 items-center justify-center rounded-lg bg-teal-500/10 text-teal-400'>
										<Activity className='h-5 w-5' />
									</span>
									<div>
										<CardTitle>Reabilitatsiya (Recovery) jarayoni</CardTitle>
										<CardDescription>
											Talabalarning jarimalarni yuvish va qo'shimcha vazifalarni
											bajarish holati (Maksimal: +10 ball).
										</CardDescription>
									</div>
								</div>
							</CardHeader>
							<CardContent className='grid gap-6 md:grid-cols-2'>
								{recoveryStudents.length === 0 ? (
									<p className='text-sm text-muted-foreground py-8 text-center col-span-2'>
										Tizimda faol reabilitatsiya jarayonidagi talabalar mavjud
										emas.
									</p>
								) : (
									recoveryStudents.map(({ student }) => (
										<div
											key={student.id}
											className='p-4 rounded-xl bg-secondary/10 border border-white/5 space-y-3 flex flex-col justify-between'
										>
											<div className='space-y-3'>
												<div className='flex items-center justify-between'>
													<div>
														<p className='font-semibold text-sm'>
															{student.name}
														</p>
														<p className='text-xs text-muted-foreground'>
															{student.group} • Tyutor bahosi:{' '}
															{student.kpi.tutor}/5 ball
														</p>
													</div>
													<Badge
														variant='outline'
														className='border-emerald-500/30 text-emerald-400 bg-emerald-500/5'
													>
														+{student.kpi.recovery} ball tiklandi
													</Badge>
												</div>
												<div className='space-y-1'>
													<div className='flex justify-between text-xs text-muted-foreground'>
														<span>Bajarilish darajasi</span>
														<span>{student.recoveryStatus}%</span>
													</div>
													<div className='h-2 w-full rounded-full bg-white/5 overflow-hidden'>
														<div
															className='h-full rounded-full bg-linear-to-r from-emerald-500 to-teal-400 transition-all duration-300'
															style={{ width: `${student.recoveryStatus}%` }}
														/>
													</div>
												</div>
											</div>

											{student.recoveryTasks.length > 0 && (
												<div className='grid gap-2 border-t border-white/5 pt-3 mt-3'>
													{student.recoveryTasks.slice(0, 3).map(task => (
														<div
															key={task.id}
															className='flex flex-col gap-2 rounded-md bg-background/30 p-3 sm:flex-row sm:items-center sm:justify-between border border-white/5'
														>
															<div>
																<p className='text-xs font-semibold'>
																	{task.title}
																</p>
																<p className='text-[10px] text-muted-foreground mt-0.5'>
																	Muddat: {task.deadline} / +
																	{task.recoveryScore} ball
																</p>
															</div>
															<CompleteRecoveryButton
																taskId={task.id}
																disabled={task.status === 'COMPLETED'}
															/>
														</div>
													))}
												</div>
											)}
										</div>
									))
								)}
							</CardContent>
						</Card>
					</MotionPanel>
				)}

				{/* 4. Mentorlik Nizomi Tab */}
				{activeTab === 'criteria' && (
					<MotionPanel>
						<div id='mentor-criteria' />
						<Card className='glass-panel'>
							<CardHeader>
								<div className='flex items-center gap-3'>
									<span className='flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-400'>
										<BookOpen className='h-5 w-5' />
									</span>
									<div>
										<CardTitle>
											Mentorlik va Ijtimoiy mas'uliyat nizomi
										</CardTitle>
										<CardDescription>
											Nizom bo'yicha talabalarga beriladigan jamoaviy va
											ijtimoiy vazifalar nazorati va tartibi.
										</CardDescription>
									</div>
								</div>
							</CardHeader>
							<CardContent className='grid gap-6 md:grid-cols-3'>
								<div className='p-5 rounded-2xl bg-secondary/10 border border-white/5 space-y-3 hover:bg-secondary/15 transition-all duration-300'>
									<div className='flex items-center justify-between'>
										<span className='font-bold text-sm text-cyan-300 flex items-center gap-2'>
											<BookOpen className='h-4 w-4' /> Peer-to-Peer Mentorlik
										</span>
										<Badge className='bg-yellow-600/30 text-yellow-300 border border-yellow-500/20'>
											3 ball
										</Badge>
									</div>
									<p className='text-xs text-muted-foreground leading-relaxed'>
										O'zlashtirishi past kamida 3 nafar talabaga ustozlik qilish
										va ularning natijalarini yaxshilashda doimiy ko'maklashish.
									</p>
								</div>

								<div className='p-5 rounded-2xl bg-secondary/10 border border-white/5 space-y-3 hover:bg-secondary/15 transition-all duration-300'>
									<div className='flex items-center justify-between'>
										<span className='font-bold text-sm text-cyan-300 flex items-center gap-2'>
											<TrendingUp className='h-4 w-4' /> Volontyorlik &
											Tashkilotchilik
										</span>
										<Badge className='bg-yellow-600/30 text-yellow-300 border border-yellow-500/20'>
											1-2 ball
										</Badge>
									</div>
									<p className='text-xs text-muted-foreground leading-relaxed'>
										Universitet miqyosida o'tkaziladigan ijtimoiy xayriya va
										ma'naviy tadbirlarni tashkil qilishdagi faol ishtirok
										darajasi.
									</p>
								</div>

								<div className='p-5 rounded-2xl bg-secondary/10 border border-white/5 space-y-3 hover:bg-secondary/15 transition-all duration-300'>
									<div className='flex items-center justify-between'>
										<span className='font-bold text-sm text-cyan-300 flex items-center gap-2'>
											<User className='h-4 w-4' /> Yo'nalish rahbari yordamchisi
										</span>
										<Badge className='bg-yellow-600/30 text-yellow-300 border border-yellow-500/20'>
											3-4 ball
										</Badge>
									</div>
									<p className='text-xs text-muted-foreground leading-relaxed'>
										PDP Academy, PDP School yoki PDP Junior rahbarlariga
										ma'muriy, tashkiliy hamda strategik yordamchi bo'lib xizmat
										qilish.
									</p>
								</div>
							</CardContent>
						</Card>
					</MotionPanel>
				)}
			</div>
		</div>
	)
}

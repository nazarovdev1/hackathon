'use client'

import { useState, useMemo, Fragment } from 'react'
import type { StudentDashboardSnapshot } from '@/types/grant'
import { MentorStudentActions } from './mentor-actions'
import { StatusBadge } from '@/components/shared/status-badge'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import {
	Search,
	ChevronDown,
	ChevronUp,
	Users,
	GraduationCap,
	BookOpen,
	Activity,
	Award,
	User,
} from 'lucide-react'

type StudentRow = {
	student: StudentDashboardSnapshot
	grant: {
		mainKpi: number
		finalScore: number
		grantStatus: 'ELIGIBLE' | 'RISK' | 'DENIED'
		riskLevel: 'LOW' | 'MEDIUM' | 'HIGH'
	}
}

export function MentorGroupsList({ rows }: { rows: StudentRow[] }) {
	const [selectedGroup, setSelectedGroup] = useState<string>('ALL')
	const [searchQuery, setSearchQuery] = useState<string>('')
	const [expandedStudentId, setExpandedStudentId] = useState<string | null>(null)

	// Get list of unique groups
	const groups = useMemo(() => {
		const unique = new Set(rows.map(r => r.student.group))
		return Array.from(unique).sort()
	}, [rows])

	// Filter rows based on selected group and search query
	const filteredRows = useMemo(() => {
		return rows.filter(row => {
			const groupMatch = selectedGroup === 'ALL' || row.student.group === selectedGroup
			const searchMatch =
				row.student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
				row.student.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
				row.student.studentId.toLowerCase().includes(searchQuery.toLowerCase())
			return groupMatch && searchMatch
		})
	}, [rows, selectedGroup, searchQuery])

	const toggleExpand = (studentId: string) => {
		setExpandedStudentId(expandedStudentId === studentId ? null : studentId)
	}

	return (
		<div className='space-y-6'>
			{/* Filters & Tabs */}
			<div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between p-4 rounded-2xl border border-white/5 bg-secondary/15 backdrop-blur-md'>
				<div className='flex flex-wrap items-center gap-3 flex-1 w-full sm:w-auto'>
					<div className='flex items-center gap-2 bg-primary/10 border border-primary/20 text-primary px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider shrink-0'>
						<Users className='h-3.5 w-3.5' />
						Guruhlar ({groups.length})
					</div>
					<Select
						value={selectedGroup}
						onValueChange={val => {
							setSelectedGroup(val || 'ALL')
							setExpandedStudentId(null)
						}}
					>
						<SelectTrigger className='w-full sm:w-64 border-border bg-card hover:bg-accent/50 text-foreground transition-all font-semibold h-9'>
							<SelectValue placeholder='Guruhni tanlang' />
						</SelectTrigger>
						<SelectContent className='bg-popover border border-border text-popover-foreground shadow-md'>
							<SelectItem value='ALL' className='font-medium'>
								Barchasi ({rows.length} talaba)
							</SelectItem>
							{groups.map(group => {
								const count = rows.filter(r => r.student.group === group).length
								return (
									<SelectItem key={group} value={group} className='font-medium'>
										{group} ({count} talaba)
									</SelectItem>
								)
							})}
						</SelectContent>
					</Select>
				</div>

				{/* Search box */}
				<div className='relative w-full sm:w-72 shrink-0'>
					<Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
					<Input
						placeholder='Talaba ismi, ID yoki pochtasi...'
						value={searchQuery}
						onChange={e => setSearchQuery(e.target.value)}
						className='pl-9 border-white/10 bg-background/50 focus-visible:ring-primary h-9 text-sm'
					/>
				</div>
			</div>

			{/* Student list */}
			<div className='rounded-xl border border-white/10 bg-background/50 overflow-hidden'>
				{filteredRows.length === 0 ? (
					<div className='py-8 text-center text-sm text-muted-foreground'>
						Talabalar topilmadi.
					</div>
				) : (
					<Table>
						<TableHeader className='bg-secondary/5'>
							<TableRow className='border-b border-white/10'>
								<TableHead className='w-10'></TableHead>
								<TableHead>Talaba</TableHead>
								<TableHead>Guruh</TableHead>
								<TableHead>Akademik (GPA)</TableHead>
								<TableHead>Yakuniy ball</TableHead>
								<TableHead>Grant statusi</TableHead>
								<TableHead className='text-right'>Harakatlar</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{filteredRows.map(({ student, grant }) => {
								const isExpanded = expandedStudentId === student.id
								return (
									<Fragment key={student.id}>
										<TableRow
											key={student.id}
											className={`cursor-pointer border-b border-white/5 hover:bg-white/5 transition-colors duration-150 ${isExpanded ? 'bg-white/5' : ''}`}
											onClick={() => toggleExpand(student.id)}
										>
											<TableCell onClick={e => e.stopPropagation()}>
												<button
													onClick={() => toggleExpand(student.id)}
													className='flex h-6 w-6 items-center justify-center rounded-md hover:bg-white/10 transition-colors'
												>
													{isExpanded ? (
														<ChevronUp className='h-4 w-4 text-muted-foreground' />
													) : (
														<ChevronDown className='h-4 w-4 text-muted-foreground' />
													)}
												</button>
											</TableCell>
											<TableCell>
												<div className='font-semibold text-sm text-foreground'>
													{student.name}
												</div>
												<div className='text-xs text-muted-foreground'>
													{student.email} • {student.studentId}
												</div>
											</TableCell>
											<TableCell>
												<span className='text-sm'>{student.group}</span>
											</TableCell>
											<TableCell>
												<span
													className={`text-sm font-semibold ${student.kpi.academicPercent < 80 ? 'text-rose-400' : 'text-emerald-400'}`}
												>
													{student.kpi.academicPercent}%
												</span>
											</TableCell>
											<TableCell>
												<span className='text-sm font-bold text-cyan-400'>
													{grant.finalScore} ball
												</span>
											</TableCell>
											<TableCell>
												<StatusBadge value={grant.grantStatus} />
											</TableCell>
											<TableCell className='text-right' onClick={e => e.stopPropagation()}>
												<MentorStudentActions student={student} />
											</TableCell>
										</TableRow>

										{/* Expanded details row */}
										{isExpanded && (
											<TableRow className='bg-secondary/5 border-b border-white/5 hover:bg-secondary/5'>
												<TableCell colSpan={7} className='p-6'>
													<div className='grid gap-6 md:grid-cols-3' onClick={e => e.stopPropagation()}>
														{/* KPI Breakdown */}
														<div className='space-y-4 md:col-span-2'>
															<h4 className='text-xs font-semibold uppercase tracking-wider text-muted-foreground'>
																KPI Ballari Taqsimoti
															</h4>
															<div className='grid gap-3 sm:grid-cols-2'>
																{/* Academic */}
																<div className='rounded-lg bg-background/50 border border-white/5 p-3 space-y-1.5'>
																	<div className='flex justify-between text-xs'>
																		<span className='text-muted-foreground flex items-center gap-1.5'>
																			<GraduationCap className='h-3.5 w-3.5 text-emerald-400' /> Akademik ball
																		</span>
																		<span className='font-semibold'>{student.kpi.academic} / 40</span>
																	</div>
																	<div className='h-1.5 w-full rounded-full bg-white/5 overflow-hidden'>
																		<div
																			className='h-full bg-emerald-500 rounded-full'
																			style={{ width: `${(student.kpi.academic / 40) * 100}%` }}
																		/>
																	</div>
																</div>

																{/* Attendance */}
																<div className='rounded-lg bg-background/50 border border-white/5 p-3 space-y-1.5'>
																	<div className='flex justify-between text-xs'>
																		<span className='text-muted-foreground flex items-center gap-1.5'>
																			<Users className='h-3.5 w-3.5 text-teal-400' /> Davomat ball
																		</span>
																		<span className='font-semibold'>{student.kpi.attendance} / 20</span>
																	</div>
																	<div className='h-1.5 w-full rounded-full bg-white/5 overflow-hidden'>
																		<div
																			className='h-full bg-teal-500 rounded-full'
																			style={{ width: `${(student.kpi.attendance / 20) * 100}%` }}
																		/>
																	</div>
																</div>

																{/* Assignment */}
																<div className='rounded-lg bg-background/50 border border-white/5 p-3 space-y-1.5'>
																	<div className='flex justify-between text-xs'>
																		<span className='text-muted-foreground flex items-center gap-1.5'>
																			<BookOpen className='h-3.5 w-3.5 text-cyan-400' /> Topshiriqlar ball
																		</span>
																		<span className='font-semibold'>{student.kpi.assignment} / 15</span>
																	</div>
																	<div className='h-1.5 w-full rounded-full bg-white/5 overflow-hidden'>
																		<div
																			className='h-full bg-cyan-500 rounded-full'
																			style={{ width: `${(student.kpi.assignment / 15) * 100}%` }}
																		/>
																	</div>
																</div>

																{/* Activity */}
																<div className='rounded-lg bg-background/50 border border-white/5 p-3 space-y-1.5'>
																	<div className='flex justify-between text-xs'>
																		<span className='text-muted-foreground flex items-center gap-1.5'>
																			<Activity className='h-3.5 w-3.5 text-amber-400' /> Faollik / Sertifikatlar
																		</span>
																		<span className='font-semibold'>{student.kpi.activity} / 10</span>
																	</div>
																	<div className='h-1.5 w-full rounded-full bg-white/5 overflow-hidden'>
																		<div
																			className='h-full bg-amber-500 rounded-full'
																			style={{ width: `${(student.kpi.activity / 10) * 100}%` }}
																		/>
																	</div>
																</div>

																{/* Tutor eval */}
																<div className='rounded-lg bg-background/50 border border-white/5 p-3 space-y-1.5'>
																	<div className='flex justify-between text-xs'>
																		<span className='text-muted-foreground flex items-center gap-1.5'>
																			<User className='h-3.5 w-3.5 text-blue-400' /> Tyutor bahosi (Ijtimoiy)
																		</span>
																		<span className='font-semibold'>{student.kpi.tutor} / 5</span>
																	</div>
																	<div className='h-1.5 w-full rounded-full bg-white/5 overflow-hidden'>
																		<div
																			className='h-full bg-blue-500 rounded-full'
																			style={{ width: `${(student.kpi.tutor / 5) * 100}%` }}
																		/>
																	</div>
																</div>

																{/* Discipline */}
																<div className='rounded-lg bg-background/50 border border-white/5 p-3 space-y-1.5'>
																	<div className='flex justify-between text-xs'>
																		<span className='text-muted-foreground flex items-center gap-1.5'>
																			<Award className='h-3.5 w-3.5 text-indigo-400' /> Intizom ball
																		</span>
																		<span className='font-semibold'>{student.kpi.discipline} / 10</span>
																	</div>
																	<div className='h-1.5 w-full rounded-full bg-white/5 overflow-hidden'>
																		<div
																			className='h-full bg-indigo-500 rounded-full'
																			style={{ width: `${(student.kpi.discipline / 10) * 100}%` }}
																		/>
																	</div>
																</div>
															</div>

															{/* Penalty & Recovery Overview */}
															<div className='flex flex-wrap gap-4 pt-2'>
																<Badge variant='outline' className='border-rose-500/20 bg-rose-500/5 text-rose-400 px-3 py-1 text-xs'>
																	Jarima: -{student.kpi.penalty} ball
																</Badge>
																<Badge variant='outline' className='border-emerald-500/20 bg-emerald-500/5 text-emerald-400 px-3 py-1 text-xs'>
																	Recovery: +{student.kpi.recovery} ball (Progress: {student.recoveryStatus}%)
																</Badge>
																{student.kpi.employmentBonus > 0 && (
																	<Badge variant='outline' className='border-cyan-500/20 bg-cyan-500/5 text-cyan-400 px-3 py-1 text-xs'>
																		Ishlash bonusi: +{student.kpi.employmentBonus} ball
																	</Badge>
																)}
															</div>
														</div>

														{/* Active Penalties & Actions */}
														<div className='space-y-4 border-t border-white/5 pt-4 md:border-t-0 md:pt-0 md:border-l md:pl-6'>
															<div>
																<h4 className='text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2'>
																	So'nggi Jarimalar
																</h4>
																{student.penalties.length === 0 ? (
																	<p className='text-xs text-muted-foreground italic'>
																		Jarima ballari mavjud emas.
																	</p>
																) : (
																	<div className='space-y-2 max-h-30 overflow-y-auto pr-1'>
																		{student.penalties.map(penalty => (
																			<div key={penalty.id} className='flex items-start justify-between text-xs bg-background/30 p-2 rounded border border-white/5'>
																				<div className='space-y-0.5'>
																					<p className='font-medium text-foreground'>{penalty.reason}</p>
																					<p className='text-[10px] text-muted-foreground'>{penalty.date}</p>
																				</div>
																				<span className='font-semibold text-rose-400'>-{penalty.score} b</span>
																			</div>
																		))}
																	</div>
																)}
															</div>

															<div>
																<h4 className='text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2'>
																	Reabilitatsiya Topshiriqlari
																</h4>
																{student.recoveryTasks.length === 0 ? (
																	<p className='text-xs text-muted-foreground italic'>
																		Tizimda topshiriqlar mavjud emas.
																	</p>
																) : (
																	<div className='space-y-2 max-h-30 overflow-y-auto pr-1'>
																		{student.recoveryTasks.map(task => (
																			<div key={task.id} className='flex items-start justify-between text-xs bg-background/30 p-2 rounded border border-white/5'>
																				<div className='space-y-0.5'>
																					<p className='font-medium text-foreground'>{task.title}</p>
																					<p className='text-[10px] text-muted-foreground'>Muddat: {task.deadline} • +{task.recoveryScore} b</p>
																				</div>
																				<Badge variant='outline' className={`text-[10px] uppercase font-mono py-0 px-1.5 ${
																					task.status === 'COMPLETED' ? 'border-emerald-500/20 text-emerald-400 bg-emerald-500/5' :
																					task.status === 'IN_PROGRESS' ? 'border-amber-500/20 text-amber-400 bg-amber-500/5' :
																					'border-neutral-500/20 text-neutral-400'
																				}`}>
																					{task.status}
																				</Badge>
																			</div>
																		))}
																	</div>
																)}
															</div>
														</div>
													</div>
												</TableCell>
											</TableRow>
										)}
									</Fragment>
								)
							})}
						</TableBody>
					</Table>
				)}
			</div>
		</div>
	)
}

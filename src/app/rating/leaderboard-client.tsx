'use client'

import { MotionPanel } from '@/components/providers/motion-panel'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table'
import {
	Eye,
	Filter,
	Medal,
	Search,
	Trophy,
	GripVertical,
	ArrowLeft,
	Plus,
	X,
	Users,
	BookOpen,
	User,
} from 'lucide-react'
import Link from 'next/link'
import { useState, useMemo } from 'react'

interface LeaderboardItem {
	id: string
	name: string
	faculty: string
	score: number
	position: number
	group: string
	level: string
	mentorName: string
}

interface LeaderboardClientProps {
	initialData: LeaderboardItem[]
}

export function LeaderboardClient({ initialData }: LeaderboardClientProps) {
	// General Search and Faculty Filters
	const [searchTerm, setSearchTerm] = useState('')
	const [facultyFilter, setFacultyFilter] = useState('ALL')

	// Active Hierarchy Filter Tab (GROUP, MODULE, MENTOR)
	const [activeFilterTab, setActiveFilterTab] = useState<'GROUP' | 'MODULE' | 'MENTOR'>('GROUP')
	const [filterSearchQuery, setFilterSearchQuery] = useState('')

	// Selected filter criteria lists
	const [selectedGroups, setSelectedGroups] = useState<string[]>([])
	const [selectedModules, setSelectedModules] = useState<string[]>([])
	const [selectedMentors, setSelectedMentors] = useState<string[]>([])

	// Extract unique faculties
	const faculties = useMemo(() => {
		return Array.from(new Set(initialData.map(item => item.faculty)))
	}, [initialData])

	// Extract unique groups, modules (levels), and mentors
	const groupsList = useMemo(() => {
		return Array.from(new Set(initialData.map(item => item.group))).filter(Boolean).sort()
	}, [initialData])

	const modulesList = useMemo(() => {
		return Array.from(new Set(initialData.map(item => item.level))).filter(Boolean).sort()
	}, [initialData])

	const mentorsList = useMemo(() => {
		return Array.from(new Set(initialData.map(item => item.mentorName))).filter(Boolean).sort()
	}, [initialData])

	// Get active items list to render in the bottom selector panel
	const selectorItems = useMemo(() => {
		let list: string[] = []
		if (activeFilterTab === 'GROUP') list = groupsList
		else if (activeFilterTab === 'MODULE') list = modulesList
		else if (activeFilterTab === 'MENTOR') list = mentorsList

		if (!filterSearchQuery) return list

		return list.filter(item =>
			item.toLowerCase().includes(filterSearchQuery.toLowerCase())
		)
	}, [activeFilterTab, groupsList, modulesList, mentorsList, filterSearchQuery])

	// Toggle filter items
	const toggleFilterItem = (type: 'GROUP' | 'MODULE' | 'MENTOR', item: string) => {
		if (type === 'GROUP') {
			setSelectedGroups(prev =>
				prev.includes(item) ? prev.filter(x => x !== item) : [...prev, item]
			)
		} else if (type === 'MODULE') {
			setSelectedModules(prev =>
				prev.includes(item) ? prev.filter(x => x !== item) : [...prev, item]
			)
		} else if (type === 'MENTOR') {
			setSelectedMentors(prev =>
				prev.includes(item) ? prev.filter(x => x !== item) : [...prev, item]
			)
		}
	}

	const clearAllFilters = () => {
		setSelectedGroups([])
		setSelectedModules([])
		setSelectedMentors([])
		setSearchTerm('')
		setFacultyFilter('ALL')
	}

	// Filter dataset based on all active criteria
	const filteredData = useMemo(() => {
		const result = initialData.filter(item => {
			const matchesSearch = item.name
				.toLowerCase()
				.includes(searchTerm.toLowerCase())
			
			const matchesFaculty =
				facultyFilter === 'ALL' || item.faculty === facultyFilter

			const matchesGroups =
				selectedGroups.length === 0 || selectedGroups.includes(item.group)

			const matchesModules =
				selectedModules.length === 0 || selectedModules.includes(item.level)

			const matchesMentors =
				selectedMentors.length === 0 || selectedMentors.includes(item.mentorName)

			return matchesSearch && matchesFaculty && matchesGroups && matchesModules && matchesMentors
		})

		// Recalculate position/rank based on filtered view
		return result.map((item, index) => ({
			...item,
			filteredPosition: index + 1
		}))
	}, [initialData, searchTerm, facultyFilter, selectedGroups, selectedModules, selectedMentors])

	// Top 3 Podium (Always show actual top 3 of the overall rating to keep it prestigious)
	const top3 = useMemo(() => {
		return initialData.slice(0, 3)
	}, [initialData])

	const podiumOrder = useMemo(() => {
		return [
			top3[1], // 2nd Place
			top3[0], // 1st Place
			top3[2], // 3rd Place
		].filter(Boolean)
	}, [top3])

	const hasActiveFilters =
		selectedGroups.length > 0 ||
		selectedModules.length > 0 ||
		selectedMentors.length > 0 ||
		searchTerm !== '' ||
		facultyFilter !== 'ALL'

	return (
		<div className='space-y-8'>
			{/* Top 3 Podium (Visual Showcase) */}
			{!hasActiveFilters && top3.length > 0 && (
				<div className='grid gap-6 sm:grid-cols-3 items-end pt-4'>
					{podiumOrder.map(student => {
						const isFirst = student.position === 1
						const isSecond = student.position === 2

						let cardStyles = ''
						let badgeStyles = ''
						let iconColor = ''
						let heightClass = ''

						if (isFirst) {
							cardStyles =
								'border-amber-400 bg-amber-500/5 shadow-[0_0_40px_rgba(245,158,11,0.1)] order-1 sm:order-2 sm:-translate-y-4 ring-2 ring-amber-400/30'
							badgeStyles =
								'bg-amber-400/20 text-amber-600 dark:text-amber-400 border-amber-400/30'
							iconColor =
								'text-amber-500 drop-shadow-[0_0_10px_rgba(245,158,11,0.3)]'
							heightClass = 'sm:py-8'
						} else if (isSecond) {
							cardStyles = 'border-slate-300 bg-slate-400/5 order-2 sm:order-1'
							badgeStyles =
								'bg-slate-300/20 text-slate-500 dark:text-slate-400 border-slate-300/30'
							iconColor = 'text-slate-400'
							heightClass = 'sm:py-6'
						} else {
							cardStyles =
								'border-amber-700/30 bg-amber-800/5 order-3 sm:order-3'
							badgeStyles =
								'bg-amber-700/20 text-amber-700 dark:text-amber-500 border-amber-700/20'
							iconColor = 'text-amber-700'
							heightClass = 'sm:py-6'
						}

						return (
							<MotionPanel
								key={student.id}
								className={isFirst ? 'sm:z-10' : ''}
							>
								<Card
									className={`glass-panel border-t-4 transition-all duration-300 hover:shadow-xl ${cardStyles} ${heightClass}`}
								>
									<CardHeader className='pb-2 text-center flex flex-col items-center'>
										{isFirst ? (
											<Trophy className={`h-12 w-12 mb-2 ${iconColor}`} />
										) : (
											<Medal className={`h-10 w-10 mb-2 ${iconColor}`} />
										)}
										<Badge
											variant='outline'
											className={`font-bold px-2 py-0.5 text-xs ${badgeStyles}`}
										>
											{student.position === 1
												? "1-O'RIN"
												: student.position === 2
													? "2-O'RIN"
													: "3-O'RIN"}
										</Badge>
									</CardHeader>
									<CardContent className='text-center space-y-3'>
										<div>
											<h3 className='font-extrabold text-base truncate text-foreground'>
												{student.name}
											</h3>
											<p className='text-xs text-muted-foreground truncate mt-0.5'>
												{student.faculty}
											</p>
										</div>
										<div className='flex flex-col items-center'>
											<span className='text-2xl font-black text-primary'>
												{student.score}
											</span>
											<span className='text-[10px] text-muted-foreground uppercase tracking-widest'>
												Yakuniy ball
											</span>
										</div>
										<Link
											href={`/rating/student/${student.id}`}
											className='inline-flex w-full items-center justify-center gap-1.5 rounded-lg border border-border/40 bg-secondary/40 hover:bg-secondary/70 py-2 text-xs font-semibold transition'
										>
											<Eye className='h-3.5 w-3.5' /> KPI ko'rish
										</Link>
									</CardContent>
								</Card>
							</MotionPanel>
						)
					})}
				</div>
			)}

			{/* Main Grid Layout: Filters Left, Table Right */}
			<div className='grid gap-6 lg:grid-cols-12'>
				{/* 1. FILTER SIDEBAR (Left 4 cols on desktop) */}
				<div className='lg:col-span-4 space-y-4'>
					{/* Hierarchy Selector Panel */}
					<MotionPanel>
						<Card className='glass-panel border-white/10'>
							<CardHeader className='pb-4'>
								<CardTitle className='text-base flex items-center gap-2'>
									<Filter className='h-4 w-4 text-primary' />
									Ierarxik filtrlar
								</CardTitle>
								<CardDescription className='text-xs'>
									Guruh, modul yoki mentor bo'yicha filterlarni sozlang.
								</CardDescription>
							</CardHeader>
							<CardContent className='space-y-3'>
								{/* GROUP BUTTON */}
								<button
									onClick={() => {
										setActiveFilterTab('GROUP')
										setFilterSearchQuery('')
									}}
									className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl border text-sm font-bold transition-all duration-200 cursor-pointer ${
										activeFilterTab === 'GROUP'
											? 'bg-slate-900 border-slate-800 text-white shadow-md'
											: 'bg-white/5 border-white/5 hover:bg-white/10 text-muted-foreground'
									}`}
								>
									<span className='flex items-center gap-2'>
										<Users className='h-4 w-4 text-blue-400' />
										GURUH (GROUP)
									</span>
									<span className='flex items-center gap-2'>
										{selectedGroups.length > 0 && (
											<Badge variant='outline' className='bg-blue-500/10 text-blue-400 border-blue-500/20 text-[10px] font-bold px-1.5 py-0'>
												{selectedGroups.length}
											</Badge>
										)}
										<GripVertical className='h-4 w-4 opacity-50' />
									</span>
								</button>

								{/* MODULE BUTTON */}
								<button
									onClick={() => {
										setActiveFilterTab('MODULE')
										setFilterSearchQuery('')
									}}
									className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl border text-sm font-bold transition-all duration-200 cursor-pointer ${
										activeFilterTab === 'MODULE'
											? 'bg-slate-900 border-slate-800 text-white shadow-md'
											: 'bg-white/5 border-white/5 hover:bg-white/10 text-muted-foreground'
									}`}
								>
									<span className='flex items-center gap-2'>
										<BookOpen className='h-4 w-4 text-cyan-400' />
										MODUL (MODULE)
									</span>
									<span className='flex items-center gap-2'>
										{selectedModules.length > 0 && (
											<Badge variant='outline' className='bg-cyan-500/10 text-cyan-400 border-cyan-500/20 text-[10px] font-bold px-1.5 py-0'>
												{selectedModules.length}
											</Badge>
										)}
										<GripVertical className='h-4 w-4 opacity-50' />
									</span>
								</button>

								{/* MENTOR BUTTON */}
								<button
									onClick={() => {
										setActiveFilterTab('MENTOR')
										setFilterSearchQuery('')
									}}
									className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl border text-sm font-bold transition-all duration-200 cursor-pointer ${
										activeFilterTab === 'MENTOR'
											? 'bg-slate-900 border-slate-800 text-white shadow-md'
											: 'bg-white/5 border-white/5 hover:bg-white/10 text-muted-foreground'
									}`}
								>
									<span className='flex items-center gap-2'>
										<User className='h-4 w-4 text-emerald-400' />
										MENTOR (MENTOR)
									</span>
									<span className='flex items-center gap-2'>
										{selectedMentors.length > 0 && (
											<Badge variant='outline' className='bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-[10px] font-bold px-1.5 py-0'>
												{selectedMentors.length}
											</Badge>
										)}
										<GripVertical className='h-4 w-4 opacity-50' />
									</span>
								</button>
							</CardContent>
						</Card>
					</MotionPanel>

					{/* Options Selector Panel */}
					<MotionPanel delay={0.05}>
						<Card className='glass-panel border-white/10'>
							<CardHeader className='p-4 pb-2'>
								<div className='flex items-center gap-2'>
									{/* Back Arrow button */}
									<button
										onClick={() => {
											setFilterSearchQuery('')
										}}
										className='flex items-center justify-center h-8 w-8 rounded-lg border border-white/10 hover:bg-white/5 text-muted-foreground hover:text-foreground transition-all cursor-pointer'
									>
										<ArrowLeft className='h-4 w-4' />
									</button>
									{/* Search Box */}
									<div className='flex-1 flex items-center gap-2 rounded-lg border border-white/10 bg-secondary/10 px-2.5 py-1'>
										<Search className='h-3.5 w-3.5 text-muted-foreground' />
										<input
											className='w-full border-0 bg-transparent text-xs text-foreground focus:outline-hidden placeholder:text-muted-foreground/75'
											placeholder='Qidirish...'
											value={filterSearchQuery}
											onChange={e => setFilterSearchQuery(e.target.value)}
										/>
									</div>
								</div>
							</CardHeader>
							<CardContent className='p-3 pt-2 max-h-[300px] overflow-y-auto space-y-1.5 custom-scrollbar'>
								{selectorItems.length === 0 ? (
									<p className='text-xs text-muted-foreground text-center py-6'>
										Elementlar topilmadi
									</p>
								) : (
									selectorItems.map((item, index) => {
										let isSelected = false
										if (activeFilterTab === 'GROUP') isSelected = selectedGroups.includes(item)
										else if (activeFilterTab === 'MODULE') isSelected = selectedModules.includes(item)
										else if (activeFilterTab === 'MENTOR') isSelected = selectedMentors.includes(item)

										return (
											<div
												key={item}
												className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold border transition-all duration-150 ${
													isSelected
														? 'bg-primary/10 border-primary/20 text-foreground'
														: 'bg-background/40 border-white/5 text-muted-foreground hover:bg-white/5'
												}`}
											>
												<span className='truncate pr-2'>
													{index + 1}. {item}
												</span>
												<button
													onClick={() => toggleFilterItem(activeFilterTab, item)}
													className={`h-6 w-6 flex items-center justify-center rounded-full transition-all cursor-pointer ${
														isSelected
															? 'bg-rose-500/20 text-rose-400 hover:bg-rose-500 hover:text-white'
															: 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500 hover:text-white'
													}`}
												>
													{isSelected ? (
														<X className='h-3.5 w-3.5' />
													) : (
														<Plus className='h-3.5 w-3.5' />
													)}
												</button>
											</div>
										)
									})
								)}
							</CardContent>
						</Card>
					</MotionPanel>
				</div>

				{/* 2. LEADERBOARD LIST (Right 8 cols on desktop) */}
				<div className='lg:col-span-8 space-y-4'>
					{/* Active Filter Badges and Action Controls */}
					<MotionPanel delay={0.08}>
						<div className='flex flex-col gap-4 p-4 rounded-2xl border border-border/40 bg-card/45 backdrop-blur-md'>
							{/* Top Bar: Search Input and Faculty Filter */}
							<div className='flex flex-col sm:flex-row items-center gap-4 w-full'>
								{/* Student Name Search */}
								<div className='flex-1 w-full flex items-center gap-2 rounded-lg border border-border/40 bg-secondary/20 px-3 py-1.5'>
									<Search className='h-4 w-4 text-muted-foreground' />
									<Input
										className='border-0 bg-transparent shadow-none focus-visible:ring-0 h-7 text-sm py-0 pl-1'
										placeholder='Talaba ismini kiriting...'
										value={searchTerm}
										onChange={e => setSearchTerm(e.target.value)}
									/>
								</div>

								{/* Faculty Filter */}
								<div className='flex items-center gap-2 w-full sm:w-auto shrink-0 justify-end'>
									<Filter className='h-4 w-4 text-muted-foreground hidden xs:block' />
									<select
										value={facultyFilter}
										onChange={e => setFacultyFilter(e.target.value)}
										className='h-9 w-full sm:w-52 rounded-lg border border-input bg-transparent px-3 py-1 text-sm text-foreground shadow-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/30 transition-colors cursor-pointer'
									>
										<option value='ALL'>Barcha fakultetlar</option>
										{faculties.map(f => (
											<option key={f} value={f}>{f}</option>
										))}
									</select>
								</div>
							</div>

							{/* Display Active Badges */}
							{hasActiveFilters && (
								<div className='flex flex-wrap items-center gap-2 border-t border-white/5 pt-3'>
									<span className='text-xs text-muted-foreground mr-1'>
										Faol filtrlar:
									</span>

									{/* Group badges */}
									{selectedGroups.map(grp => (
										<Badge
											key={grp}
											variant='secondary'
											className='gap-1 bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 text-[11px]'
										>
											Guruh: {grp}
											<X
												className='h-3 w-3 cursor-pointer hover:text-white'
												onClick={() => toggleFilterItem('GROUP', grp)}
											/>
										</Badge>
									))}

									{/* Module badges */}
									{selectedModules.map(mod => (
										<Badge
											key={mod}
											variant='secondary'
											className='gap-1 bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 px-2 py-0.5 text-[11px]'
										>
											Modul: {mod}
											<X
												className='h-3 w-3 cursor-pointer hover:text-white'
												onClick={() => toggleFilterItem('MODULE', mod)}
											/>
										</Badge>
									))}

									{/* Mentor badges */}
									{selectedMentors.map(mnt => (
										<Badge
											key={mnt}
											variant='secondary'
											className='gap-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 text-[11px]'
										>
											Mentor: {mnt}
											<X
												className='h-3 w-3 cursor-pointer hover:text-white'
												onClick={() => toggleFilterItem('MENTOR', mnt)}
											/>
										</Badge>
									))}

									{/* Faculty badge */}
									{facultyFilter !== 'ALL' && (
										<Badge
											variant='secondary'
											className='gap-1 bg-slate-500/10 text-slate-300 border border-slate-500/20 px-2 py-0.5 text-[11px]'
										>
											Fakultet: {facultyFilter}
											<X
												className='h-3 w-3 cursor-pointer hover:text-white'
												onClick={() => setFacultyFilter('ALL')}
											/>
										</Badge>
									)}

									{/* Search query badge */}
									{searchTerm && (
										<Badge
											variant='secondary'
											className='gap-1 bg-purple-500/10 text-purple-400 border border-purple-500/20 px-2 py-0.5 text-[11px]'
										>
											Ism: "{searchTerm}"
											<X
												className='h-3 w-3 cursor-pointer hover:text-white'
												onClick={() => setSearchTerm('')}
											/>
										</Badge>
									)}

									{/* Clear Button */}
									<Button
										variant='ghost'
										size='sm'
										onClick={clearAllFilters}
										className='h-6 text-[10px] font-bold text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 ml-auto cursor-pointer'
									>
										Tozalash
									</Button>
								</div>
							)}
						</div>
					</MotionPanel>

					{/* Leaderboard Table List */}
					<MotionPanel delay={0.12}>
						<Card className='glass-panel'>
							<CardContent className='p-0'>
								<div className='overflow-x-auto'>
									<Table>
										<TableHeader>
											<TableRow className='bg-secondary/20 hover:bg-secondary/20'>
												<TableHead className='w-20 pl-6'>O'rin</TableHead>
												<TableHead>F.I.SH.</TableHead>
												<TableHead className='hidden sm:table-cell'>
													Fakultet / Guruh
												</TableHead>
												<TableHead className='hidden md:table-cell'>
													Modul / Mentor
												</TableHead>
												<TableHead className='text-right pr-6'>
													Yakuniy Ball
												</TableHead>
												<TableHead className='w-24 text-center pr-6'></TableHead>
											</TableRow>
										</TableHeader>
										<TableBody>
											{filteredData.length > 0 ? (
												filteredData.map(item => (
													<TableRow
														key={item.id}
														className='hover:bg-secondary/15 transition-colors border-b border-white/5'
													>
														<TableCell className='font-bold pl-6'>
															{item.filteredPosition === 1 ? (
																<span className='text-amber-500 flex items-center gap-1'>
																	🏆 1
																</span>
															) : item.filteredPosition === 2 ? (
																<span className='text-slate-400 flex items-center gap-1'>
																	🥈 2
																</span>
															) : item.filteredPosition === 3 ? (
																<span className='text-amber-700 flex items-center gap-1'>
																	🥉 3
																</span>
															) : (
																<span className='text-muted-foreground pl-1'>
																	{item.filteredPosition}
																</span>
															)}
														</TableCell>
														<TableCell className='font-medium text-foreground'>
															<div>
																<p className='text-sm font-semibold'>{item.name}</p>
																<span className='sm:hidden text-[10px] text-muted-foreground'>
																	{item.faculty} • {item.group}
																</span>
															</div>
														</TableCell>
														<TableCell className='text-muted-foreground text-sm hidden sm:table-cell'>
															<div>{item.faculty}</div>
															<div className='text-xs text-muted-foreground mt-0.5'>{item.group}</div>
														</TableCell>
														<TableCell className='text-muted-foreground text-xs hidden md:table-cell'>
															<div className='font-medium text-foreground'>{item.level}</div>
															<div className='text-muted-foreground mt-0.5'>Mentor: {item.mentorName}</div>
														</TableCell>
														<TableCell className='text-right font-bold text-foreground text-sm pr-6 shrink-0'>
															<span className='text-primary'>{item.score} ball</span>
														</TableCell>
														<TableCell className='text-center pr-6'>
															<Link
																href={`/rating/student/${item.id}`}
																className='inline-flex h-8 items-center justify-center gap-1 rounded-md bg-primary/10 text-primary hover:bg-primary/20 px-3 text-xs font-semibold transition'
															>
																Ko'rish
															</Link>
														</TableCell>
													</TableRow>
												))
											) : (
												<TableRow>
													<TableCell
														colSpan={6}
														className='text-center py-12 text-muted-foreground text-sm'
													>
														Qidiruv mezonlariga mos keladigan talabalar topilmadi.
													</TableCell>
												</TableRow>
											)}
										</TableBody>
									</Table>
								</div>
							</CardContent>
						</Card>
					</MotionPanel>
				</div>
			</div>
		</div>
	)
}

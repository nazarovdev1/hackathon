'use client'

import { MotionPanel } from '@/components/providers/motion-panel'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table'
import { Eye, Filter, Medal, Search, Trophy } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

interface LeaderboardItem {
	id: string
	name: string
	faculty: string
	score: number
	position: number
}

interface LeaderboardClientProps {
	initialData: LeaderboardItem[]
}

export function LeaderboardClient({ initialData }: LeaderboardClientProps) {
	const [searchTerm, setSearchTerm] = useState('')
	const [facultyFilter, setFacultyFilter] = useState('ALL')

	// Get unique faculties
	const faculties = Array.from(new Set(initialData.map(item => item.faculty)))

	// Filter dataset
	const filteredData = initialData.filter(item => {
		const matchesSearch = item.name
			.toLowerCase()
			.includes(searchTerm.toLowerCase())
		const matchesFaculty =
			facultyFilter === 'ALL' || item.faculty === facultyFilter
		return matchesSearch && matchesFaculty
	})

	// Top 3 Podium (Always show actual top 3 of the overall rating, or of the filtered rating depending on user choice)
	// Let's show the top 3 overall to keep the podium authentic and prestigious!
	const top3 = initialData.slice(0, 3)

	// Arrange top 3 as: 2nd place, 1st place, 3rd place for visual balance on desktop
	const podiumOrder = [
		top3[1], // 2nd Place
		top3[0], // 1st Place
		top3[2], // 3rd Place
	].filter(Boolean)

	return (
		<div className='space-y-8'>
			{/* Top 3 Podium (Visual Showcase) */}
			{searchTerm === '' && facultyFilter === 'ALL' && top3.length > 0 && (
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

			{/* Filter and Search Bar */}
			<MotionPanel delay={0.1}>
				<div className='flex flex-col sm:flex-row items-center gap-4 p-4 rounded-2xl border border-border/40 bg-card/45 backdrop-blur-md'>
					{/* Search bar */}
					<div className='flex-1 w-full flex items-center gap-2 rounded-lg border border-border/40 bg-secondary/20 px-3 py-1.5'>
						<Search className='h-4 w-4 text-muted-foreground' />
						<Input
							className='border-0 bg-transparent shadow-none focus-visible:ring-0 h-7 text-sm py-0 pl-1'
							placeholder='Talaba ismini kiriting...'
							value={searchTerm}
							onChange={e => setSearchTerm(e.target.value)}
						/>
					</div>

					{/* Faculty dropdown — native select for reliability */}
					<div className='flex items-center gap-2 w-full sm:w-auto shrink-0 justify-end'>
						<Filter className='h-4 w-4 text-muted-foreground hidden xs:block' />
						<select
							value={facultyFilter}
							onChange={e => setFacultyFilter(e.target.value)}
							className='h-9 w-full sm:w-55 rounded-lg border border-input bg-transparent px-3 py-1 text-sm text-foreground shadow-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/30 transition-colors cursor-pointer'
						>
							<option value='ALL'>Barcha fakultetlar</option>
							{faculties.map(f => (
								<option key={f} value={f}>{f}</option>
							))}
						</select>
					</div>
				</div>
			</MotionPanel>

			{/* Leaderboard Table List */}
			<MotionPanel delay={0.15}>
				<Card className='glass-panel'>
					<CardContent className='p-0'>
						<div className='overflow-x-auto'>
							<Table>
								<TableHeader>
									<TableRow className='bg-secondary/20 hover:bg-secondary/20'>
										<TableHead className='w-20 pl-6'>O'rin</TableHead>
										<TableHead>F.I.SH.</TableHead>
										<TableHead className='hidden sm:table-cell'>
											Fakultet
										</TableHead>
										<TableHead className='text-right pr-6'>
											Yakuniy Ball
										</TableHead>
										<TableHead className='w-28 text-center pr-6'></TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{filteredData.length > 0 ? (
										filteredData.map(item => (
											<TableRow
												key={item.id}
												className='hover:bg-secondary/15 transition-colors'
											>
												<TableCell className='font-bold pl-6'>
													{item.position === 1 ? (
														<span className='text-amber-500 flex items-center gap-1'>
															🏆 1
														</span>
													) : item.position === 2 ? (
														<span className='text-slate-400 flex items-center gap-1'>
															🥈 2
														</span>
													) : item.position === 3 ? (
														<span className='text-amber-700 flex items-center gap-1'>
															🥉 3
														</span>
													) : (
														<span className='text-muted-foreground pl-1'>
															{item.position}
														</span>
													)}
												</TableCell>
												<TableCell className='font-medium text-foreground'>
													<div>
														<p className='text-sm font-semibold'>{item.name}</p>
														<span className='sm:hidden text-[10px] text-muted-foreground'>
															{item.faculty}
														</span>
													</div>
												</TableCell>
												<TableCell className='text-muted-foreground text-sm hidden sm:table-cell'>
													{item.faculty}
												</TableCell>
												<TableCell className='text-right font-bold text-foreground text-sm pr-6'>
													{item.score} ball
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
												colSpan={5}
												className='text-center py-10 text-muted-foreground'
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
	)
}

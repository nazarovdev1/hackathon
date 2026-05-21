import { DashboardShell } from '@/components/layout/dashboard-shell'
import { MotionPanel } from '@/components/providers/motion-panel'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import {
	getCurrentStudentDashboard,
	getCurrentStudentFeedback,
} from '@/services/dashboard-data'
import {
	Calendar,
	CheckCircle2,
	GraduationCap,
	MessageSquare,
	Star,
	StarHalf,
} from 'lucide-react'
import { notFound } from 'next/navigation'

export const metadata = {
	title: 'Mentor Feedback - PDP METRIC',
	description:
		'Mentor va tyutorlar tomonidan berilgan baholar hamda fikr-mulohazalar.',
}

type FeedbackItem = {
	id: string
	mentorName: string
	role: string
	date: string
	subject: string
	grade: number // Out of 5
	score: number // Added to KPI
	comment: string
	category: string
}

export const dynamic = 'force-dynamic'

export default async function StudentFeedbackPage() {
	const currentStudent = await getCurrentStudentDashboard()
	if (!currentStudent) notFound()

	const feedbacks: FeedbackItem[] = await getCurrentStudentFeedback()

	const averageGrade =
		feedbacks.length > 0
			? (
					feedbacks.reduce((sum, item) => sum + item.grade, 0) /
					feedbacks.length
				).toFixed(1)
			: 'N/A'

	const totalScoreAdded = feedbacks.reduce((sum, item) => sum + item.score, 0)

	// Render Stars function
	const renderStars = (rating: number) => {
		const stars = []
		const fullStars = Math.floor(rating)
		const hasHalf = rating % 1 !== 0

		for (let i = 1; i <= 5; i++) {
			if (i <= fullStars) {
				stars.push(
					<Star className='h-4 w-4 fill-amber-400 text-amber-400' key={i} />,
				)
			} else if (i === fullStars + 1 && hasHalf) {
				stars.push(
					<StarHalf
						className='h-4 w-4 fill-amber-400 text-amber-400'
						key='half'
					/>,
				)
			} else {
				stars.push(
					<Star className='h-4 w-4 text-muted-foreground/30' key={i} />,
				)
			}
		}
		return stars
	}

	return (
		<DashboardShell
			title='Mentor Feedback va Baholari'
			eyebrow='Ustozlar fikrlari'
		>
			<div className='grid gap-6'>
				{/* Yuqori qism: Statistika kartalari */}
				<div className='grid gap-5 md:grid-cols-3'>
					<MotionPanel delay={0.05}>
						<Card className='glass-panel'>
							<CardContent className='pt-6 flex items-center justify-between'>
								<div>
									<p className='text-sm font-medium text-muted-foreground'>
										O'rtacha baho
									</p>
									<h3 className='text-3xl font-bold mt-1 text-foreground'>
										{averageGrade} / 5.0
									</h3>
									<div className='flex items-center gap-1 mt-2'>
										{renderStars(Number(averageGrade) || 0)}
									</div>
								</div>
								<div className='h-12 w-12 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500'>
									<Star className='h-6 w-6 fill-current' />
								</div>
							</CardContent>
						</Card>
					</MotionPanel>

					<MotionPanel delay={0.1}>
						<Card className='glass-panel'>
							<CardContent className='pt-6 flex items-center justify-between'>
								<div>
									<p className='text-sm font-medium text-muted-foreground'>
										Jami baholanganlar
									</p>
									<h3 className='text-3xl font-bold mt-1 text-foreground'>
										{feedbacks.length} ta
									</h3>
									<p className='text-xs text-muted-foreground mt-2'>
										Darslar, amaliyot va intizom
									</p>
								</div>
								<div className='h-12 w-12 rounded-full bg-cyan-500/10 flex items-center justify-center text-cyan-500'>
									<MessageSquare className='h-6 w-6' />
								</div>
							</CardContent>
						</Card>
					</MotionPanel>

					<MotionPanel delay={0.15}>
						<Card className='glass-panel'>
							<CardContent className='pt-6 flex items-center justify-between'>
								<div>
									<p className='text-sm font-medium text-muted-foreground'>
										Olingan jami KPI balli
									</p>
									<h3 className='text-3xl font-bold mt-1 text-foreground'>
										+{totalScoreAdded} ball
									</h3>
									<p className='text-xs text-muted-foreground mt-2'>
										Reyting jadvaliga qo'shilgan
									</p>
								</div>
								<div className='h-12 w-12 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500'>
									<CheckCircle2 className='h-6 w-6' />
								</div>
							</CardContent>
						</Card>
					</MotionPanel>
				</div>

				{/* Fikrlar ro'yxati */}
				<MotionPanel delay={0.2}>
					<div className='space-y-6'>
						<h2 className='text-xl font-semibold'>
							Tafsilotli fikr-mulohazalar
						</h2>

						{feedbacks.length === 0 ? (
							<Card className='glass-panel'>
								<CardContent className='text-center py-12 text-muted-foreground'>
									<MessageSquare className='h-12 w-12 mx-auto opacity-30 mb-3' />
									Sizga hali mentor yoki tyutorlar tomonidan feedback
									berilmagan.
								</CardContent>
							</Card>
						) : (
							feedbacks.map((item) => (
								<Card
									key={item.id}
									className='glass-panel relative overflow-hidden transition-all hover:border-border'
								>
									<div className='absolute top-0 left-0 w-1.5 h-full bg-primary' />
									<CardHeader className='pb-3'>
										<div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
											<div className='flex items-center gap-3'>
												<div className='h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary'>
													<GraduationCap className='h-5 w-5' />
												</div>
												<div>
													<p className='font-bold text-foreground'>
														{item.mentorName}
													</p>
													<p className='text-xs text-muted-foreground'>
														{item.role}
													</p>
												</div>
											</div>
											<div className='flex flex-wrap items-center gap-2'>
												<Badge
													variant='outline'
													className='text-xs font-semibold'
												>
													{item.category}
												</Badge>
												<Badge className='bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-xs font-bold'>
													+{item.score} KPI Ball
												</Badge>
											</div>
										</div>
									</CardHeader>
									<CardContent className='space-y-4'>
										<div>
											<h4 className='text-sm font-semibold text-foreground flex items-center gap-1.5'>
												{item.subject}
											</h4>
											<div className='flex items-center gap-1.5 mt-1'>
												<span className='text-xs font-medium'>
													Baho: {item.grade} / 5.0
												</span>
												<div className='flex items-center gap-0.5 ml-1'>
													{renderStars(item.grade)}
												</div>
											</div>
										</div>

										<div className='bg-secondary/20 border border-border/40 rounded-lg p-4 text-sm leading-relaxed text-muted-foreground'>
											"{item.comment}"
										</div>

										<div className='flex items-center gap-1.5 text-xs text-muted-foreground'>
											<Calendar className='h-3.5 w-3.5' />
											<span>Baholangan sana: {item.date}</span>
										</div>
									</CardContent>
								</Card>
							))
						)}
					</div>
				</MotionPanel>
			</div>
		</DashboardShell>
	)
}

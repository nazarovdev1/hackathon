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
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import {
	Mail,
	User,
	Users,
	BookOpen,
	GraduationCap,
	Phone,
	Calendar,
	Building,
} from 'lucide-react'

export const dynamic = 'force-dynamic'

function getInitials(name: string) {
	return name
		.split(' ')
		.map(n => n[0])
		.join('')
		.toUpperCase()
		.slice(0, 2)
}

export default async function GeneralProfilePage() {
	const session = await getServerSession(authOptions)
	if (!session?.user) {
		redirect('/login')
	}

	const role = session.user.role

	// If the user is a Student, redirect to their dedicated profile page
	if (role === 'STUDENT') {
		redirect('/dashboard/student/profile')
	}

	// Fetch detailed user profile based on role
	const user = await prisma.user.findUnique({
		where: { id: session.user.id },
		include: {
			mentorProfile: true,
			tutorProfile: true,
			mentorStudents: {
				include: {
					scoreRecords: {
						orderBy: { calculatedAt: 'desc' },
						take: 1,
					},
				},
			},
			tutorStudents: {
				include: {
					scoreRecords: {
						orderBy: { calculatedAt: 'desc' },
						take: 1,
					},
				},
			},
		},
	})

	if (!user) {
		redirect('/login')
	}

	const initials = getInitials(user.fullName)
	const assignedStudents = role === 'MENTOR' ? user.mentorStudents : user.tutorStudents
	const studentCount = assignedStudents.length

	return (
		<DashboardShell title='Profil' eyebrow="Tizimdagi shaxsiy ma'lumotlar">
			<div className='grid gap-6'>
				{/* Profil header */}
				<MotionPanel>
					<div className='bg-linear-to-r from-primary/10 via-primary/5 to-transparent border border-primary/20 rounded-2xl p-6 relative overflow-hidden'>
						<div className='absolute right-6 top-6 opacity-5'>
							<User className='h-32 w-32' />
						</div>
						<div className='flex flex-col gap-4 sm:flex-row sm:items-center'>
							<div className='flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-2xl font-bold text-primary ring-4 ring-primary/10'>
								{initials}
							</div>
							<div className='flex-1'>
								<h2 className='text-2xl font-bold'>{user.fullName}</h2>
								<p className='text-sm text-muted-foreground mt-1'>
									{user.email}
								</p>
								<div className='flex flex-wrap gap-2 mt-3'>
									<Badge
										variant='outline'
										className='border-primary/30 text-primary'
									>
										Role: {role}
									</Badge>
									{role === 'MENTOR' && user.mentorProfile && (
										<>
											<Badge
												variant='outline'
												className='border-cyan-500/30 text-cyan-400'
											>
												Bo'lim: {user.mentorProfile.department}
											</Badge>
											<Badge
												variant='outline'
												className='border-amber-500/30 text-amber-400'
											>
												Mutaxassislik: {user.mentorProfile.specialty}
											</Badge>
										</>
									)}
									{role === 'TUTOR' && user.tutorProfile && (
										<Badge
											variant='outline'
											className='border-cyan-500/30 text-cyan-400'
										>
											Guruh: {user.tutorProfile.assignedGroup}
										</Badge>
									)}
									<Badge
										className={
											user.isActive
												? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
												: 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
										}
									>
										{user.isActive ? 'Faol' : 'Nofaol'}
									</Badge>
								</div>
							</div>
						</div>
					</div>
				</MotionPanel>

				{/* Asosiy ma'lumotlar */}
				<div className='grid gap-6 lg:grid-cols-2'>
					{/* Shaxsiy ma'lumotlar */}
					<MotionPanel delay={0.05}>
						<Card className='glass-panel h-full'>
							<CardHeader>
								<CardTitle className='text-base flex items-center gap-2'>
									<User className='h-5 w-5 text-primary' />
									Shaxsiy ma'lumotlar
								</CardTitle>
								<CardDescription>Batafsil kontakt va profil ma'lumotlari</CardDescription>
							</CardHeader>
							<CardContent className='space-y-4'>
								<div className='flex items-center gap-3'>
									<Mail className='h-4 w-4 text-muted-foreground shrink-0' />
									<div>
										<p className='text-xs text-muted-foreground'>Email</p>
										<p className='text-sm font-medium'>{user.email}</p>
									</div>
								</div>
								{user.phone && (
									<div className='flex items-center gap-3'>
										<Phone className='h-4 w-4 text-muted-foreground shrink-0' />
										<div>
											<p className='text-xs text-muted-foreground'>Telefon raqami</p>
											<p className='text-sm font-medium'>{user.phone}</p>
										</div>
									</div>
								)}
								<div className='flex items-center gap-3'>
									<Calendar className='h-4 w-4 text-muted-foreground shrink-0' />
									<div>
										<p className='text-xs text-muted-foreground'>Ro'yxatdan o'tgan sana</p>
										<p className='text-sm font-medium'>
											{new Date(user.createdAt).toLocaleDateString('uz-UZ')}
										</p>
									</div>
								</div>
								<div className='flex items-center gap-3'>
									<Building className='h-4 w-4 text-muted-foreground shrink-0' />
									<div>
										<p className='text-xs text-muted-foreground'>Tizimdagi maqomi</p>
										<p className='text-sm font-medium text-emerald-400'>
											Ruxsat etilgan ({role === 'ADMIN' ? 'Administrator' : role === 'MENTOR' ? 'Mentor' : 'Tutor'})
										</p>
									</div>
								</div>
							</CardContent>
						</Card>
					</MotionPanel>

					{/* Faoliyat statistikasi */}
					<MotionPanel delay={0.1}>
						<Card className='glass-panel h-full'>
							<CardHeader>
								<CardTitle className='text-base flex items-center gap-2'>
									<Users className='h-5 w-5 text-teal-400' />
									Faoliyat statistikasi
								</CardTitle>
								<CardDescription>Mas'uliyat va biriktirilgan ob'ektlar</CardDescription>
							</CardHeader>
							<CardContent className='space-y-6'>
								{role !== 'ADMIN' ? (
									<>
										<div className='flex justify-between items-center p-4 rounded-xl bg-secondary/10 border border-white/5'>
											<div>
												<p className='text-sm font-semibold'>Biriktirilgan talabalar</p>
												<p className='text-xs text-muted-foreground'>
													Siz nazorat qiladigan jami talabalar soni
												</p>
											</div>
											<span className='text-3xl font-extrabold text-teal-400'>{studentCount}</span>
										</div>

										{role === 'MENTOR' && user.mentorProfile && (
											<div className='space-y-2'>
												<p className='text-xs text-muted-foreground uppercase tracking-wider font-semibold'>
													Kafedra ma'lumotlari
												</p>
												<div className='grid grid-cols-2 gap-3'>
													<div className='p-3 rounded-lg bg-background/50 border border-white/5'>
														<p className='text-[10px] text-muted-foreground'>Kafedra (Department)</p>
														<p className='text-sm font-medium mt-0.5'>{user.mentorProfile.department}</p>
													</div>
													<div className='p-3 rounded-lg bg-background/50 border border-white/5'>
														<p className='text-[10px] text-muted-foreground'>Mutaxassislik (Specialty)</p>
														<p className='text-sm font-medium mt-0.5'>{user.mentorProfile.specialty}</p>
													</div>
												</div>
											</div>
										)}

										{role === 'TUTOR' && user.tutorProfile && (
											<div className='p-4 rounded-xl bg-secondary/10 border border-white/5 space-y-2'>
												<p className='text-xs text-muted-foreground uppercase tracking-wider font-semibold'>
													Biriktirilgan guruh
												</p>
												<div className='flex items-center gap-2 text-cyan-400 font-bold text-lg'>
													<BookOpen className='h-5 w-5' />
													{user.tutorProfile.assignedGroup}
												</div>
											</div>
										)}
									</>
								) : (
									<div className='space-y-4'>
										<div className='flex justify-between items-center p-4 rounded-xl bg-secondary/10 border border-white/5'>
											<div>
												<p className='text-sm font-semibold'>Tizim to'liq nazorati</p>
												<p className='text-xs text-muted-foreground'>
													Barcha talabalar, mentorlar va sozlamalarni tahrirlash huquqi
												</p>
											</div>
											<Badge className='bg-primary/20 text-primary border border-primary/30'>Super Admin</Badge>
										</div>
										<div className='p-4 rounded-xl bg-secondary/10 border border-white/5 space-y-2'>
											<p className='text-xs text-muted-foreground uppercase tracking-wider font-semibold'>
												Tizim statusi
											</p>
											<div className='flex items-center gap-2 text-emerald-400 font-semibold'>
												<GraduationCap className='h-5 w-5' />
												Server Online & Production Ready
											</div>
										</div>
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

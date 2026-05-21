'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { 
	createAdminUser, 
	createMentorUser, 
	createStudentUser, 
	assignMentorToGroup, 
	assignTutorToGroup,
	createGroup
} from '@/actions/admin-actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { 
	Table, 
	TableBody, 
	TableCell, 
	TableHead, 
	TableHeader, 
	TableRow 
} from '@/components/ui/table'
import { Loader2, Plus, UserCheck, Shield } from 'lucide-react'

type UserRole = 'ADMIN' | 'MENTOR' | 'TUTOR' | 'STUDENT'

type GroupInfo = {
	name: string
	studentCount: number
	mentorName: string
	tutorName: string
}

type MentorOrTutor = {
	id: string
	fullName: string
}

type SystemManagementProps = {
	groups: GroupInfo[]
	mentors: MentorOrTutor[]
	tutors: MentorOrTutor[]
}

export function SystemManagement({ groups, mentors, tutors }: SystemManagementProps) {
	const router = useRouter()
	const [activeSubTab, setActiveSubTab] = useState<'create' | 'groups'>('create')
	const [isPending, startTransition] = useTransition()
	const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

	// User creation states
	const [role, setRole] = useState<UserRole>('STUDENT')
	const [fullName, setFullName] = useState('')
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [phone, setPhone] = useState('')
	
	// Mentor specific states
	const [department, setDepartment] = useState('Dasturlash')
	const [specialty, setSpecialty] = useState('Software Engineering')

	// Student specific states
	const [studentId, setStudentId] = useState('')
	const [groupName, setGroupName] = useState('')
	const [isNewGroup, setIsNewGroup] = useState(groups.length === 0)
	const [faculty, setFaculty] = useState('')
	const [level, setLevel] = useState('1')
	const [grantType, setGrantType] = useState('Grant')
	const [currentGpaPercent, setCurrentGpaPercent] = useState('85')
	const [studentMentorId, setStudentMentorId] = useState('')
	const [studentTutorId, setStudentTutorId] = useState('')

	// Group Assignment States
	const [assignGroup, setAssignGroup] = useState(groups[0]?.name || '')
	const [assignMentorId, setAssignMentorId] = useState(mentors[0]?.id || '')
	const [assignTutorId, setAssignTutorId] = useState(tutors[0]?.id || '')
	const [isAssignGroupNewMentor, setIsAssignGroupNewMentor] = useState(false)
	const [isAssignGroupNewTutor, setIsAssignGroupNewTutor] = useState(false)

	// Guruh Yaratish States
	const [newGroupName, setNewGroupName] = useState('')
	const [newGroupMentorId, setNewGroupMentorId] = useState('')
	const [newGroupTutorId, setNewGroupTutorId] = useState('')

	const handleCreateUser = async (e: React.FormEvent) => {
		e.preventDefault()
		setStatus(null)

		if (!fullName || !email || !password) {
			setStatus({ type: 'error', message: 'Iltimos, barcha majburiy maydonlarni to\'ldiring.' })
			return
		}

		startTransition(async () => {
			try {
				if (role === 'ADMIN') {
					await createAdminUser({
						fullName,
						email,
						passwordHash: password,
						phone,
					})
				} else if (role === 'MENTOR' || role === 'TUTOR') {
					await createMentorUser({
						fullName,
						email,
						passwordHash: password,
						phone,
						role,
						department: role === 'MENTOR' ? department : undefined,
						specialty: role === 'MENTOR' ? specialty : undefined,
						assignedGroup: role === 'TUTOR' ? groupName : undefined,
					})
				} else if (role === 'STUDENT') {
					await createStudentUser({
						fullName,
						email,
						passwordHash: password,
						phone,
						studentId,
						groupName,
						faculty,
						level,
						grantType,
						currentGpaPercent: currentGpaPercent ? Number(currentGpaPercent) : 85,
						mentorId: studentMentorId || undefined,
						tutorId: studentTutorId || undefined,
					})
				}

				setStatus({ type: 'success', message: 'Foydalanuvchi muvaffaqiyatli yaratildi!' })
				// Reset main states
				setFullName('')
				setEmail('')
				setPassword('')
				setPhone('')
				setStudentId('')
				setGroupName('')
				setFaculty('')
				setStudentMentorId('')
				setStudentTutorId('')
				router.refresh()
			} catch (err: any) {
				setStatus({ type: 'error', message: err?.message || 'Foydalanuvchini yaratib bo\'lmadi.' })
			}
		})
	}

	const handleCreateGroup = async (e: React.FormEvent) => {
		e.preventDefault()
		setStatus(null)
		if (!newGroupName.trim()) {
			setStatus({ type: 'error', message: 'Guruh nomini kiriting.' })
			return
		}

		startTransition(async () => {
			try {
				await createGroup({
					groupName: newGroupName,
					mentorId: newGroupMentorId || undefined,
					tutorId: newGroupTutorId || undefined,
				})
				setStatus({ type: 'success', message: `"${newGroupName}" guruhi muvaffaqiyatli yaratildi!` })
				setNewGroupName('')
				setNewGroupMentorId('')
				setNewGroupTutorId('')
				router.refresh()
			} catch (err: any) {
				setStatus({ type: 'error', message: err?.message || 'Guruhni yaratib bo\'lmadi.' })
			}
		})
	}

	const handleAssignMentor = async (e: React.FormEvent) => {
		e.preventDefault()
		setStatus(null)
		if (!assignGroup || !assignMentorId) {
			setStatus({ type: 'error', message: 'Guruh va mentorni tanlang.' })
			return
		}

		startTransition(async () => {
			try {
				const res = await assignMentorToGroup({
					groupName: assignGroup,
					mentorId: assignMentorId,
				})
				setStatus({ type: 'success', message: `${res.count} talabaga mentor muvaffaqiyatli biriktirildi!` })
				router.refresh()
			} catch (err: any) {
				setStatus({ type: 'error', message: err?.message || 'Mentorni biriktirib bo\'lmadi.' })
			}
		})
	}

	const handleAssignTutor = async (e: React.FormEvent) => {
		e.preventDefault()
		setStatus(null)
		if (!assignGroup || !assignTutorId) {
			setStatus({ type: 'error', message: 'Guruh va tyutorni tanlang.' })
			return
		}

		startTransition(async () => {
			try {
				await assignTutorToGroup({
					groupName: assignGroup,
					tutorId: assignTutorId,
				})
				setStatus({ type: 'success', message: `Guruhga tyutor muvaffaqiyatli biriktirildi!` })
				router.refresh()
			} catch (err: any) {
				setStatus({ type: 'error', message: err?.message || 'Tyutorni biriktirib bo\'lmadi.' })
			}
		})
	}

	return (
		<div className="grid gap-6">
			{/* Sub Tabs */}
			<div className="flex border-b border-border/40 pb-px">
				<button
					onClick={() => { setActiveSubTab('create'); setStatus(null); }}
					className={`pb-3 text-sm font-semibold relative transition-colors ${
						activeSubTab === 'create' 
							? 'text-primary border-b-2 border-primary' 
							: 'text-muted-foreground hover:text-foreground'
					}`}
				>
					Foydalanuvchi yaratish
				</button>
				<button
					onClick={() => { setActiveSubTab('groups'); setStatus(null); }}
					className={`ml-6 pb-3 text-sm font-semibold relative transition-colors ${
						activeSubTab === 'groups' 
							? 'text-primary border-b-2 border-primary' 
							: 'text-muted-foreground hover:text-foreground'
					}`}
				>
					Guruhlar va biriktirish
				</button>
			</div>

			{status && (
				<div className={`p-4 rounded-xl border ${
					status.type === 'success' 
						? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400' 
						: 'bg-rose-500/10 border-rose-500/20 text-rose-600 dark:text-rose-400'
				}`}>
					{status.message}
				</div>
			)}

			{activeSubTab === 'create' && (
				<div className="grid gap-6 md:grid-cols-3">
					<Card className="glass-panel md:col-span-2">
						<CardHeader>
							<CardTitle className="text-xl">Foydalanuvchi yaratish shakli</CardTitle>
							<CardDescription>Tizimga yangi admin, mentor, tyutor yoki talaba qo'shish.</CardDescription>
						</CardHeader>
						<CardContent>
							<form onSubmit={handleCreateUser} className="grid gap-4">
								<div className="grid gap-2">
									<Label htmlFor="role">Rol</Label>
									<select
										id="role"
										value={role}
										onChange={(e) => setRole(e.target.value as UserRole)}
										className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
									>
										<option value="STUDENT">Talaba (Student)</option>
										<option value="MENTOR">Mentor</option>
										<option value="TUTOR">Tyutor (Tutor)</option>
										<option value="ADMIN">Administrator</option>
									</select>
								</div>

								<div className="grid sm:grid-cols-2 gap-4">
									<div className="grid gap-2">
										<Label htmlFor="fullName">To'liq ism-sharifi</Label>
										<Input
											id="fullName"
											placeholder="Toshpo'latov Eshmat"
											value={fullName}
											onChange={(e) => setFullName(e.target.value)}
											required
										/>
									</div>
									<div className="grid gap-2">
										<Label htmlFor="email">Email manzili</Label>
										<Input
											id="email"
											type="email"
											placeholder="eshmat@pdp.uz"
											value={email}
											onChange={(e) => setEmail(e.target.value)}
											required
										/>
									</div>
								</div>

								<div className="grid sm:grid-cols-2 gap-4">
									<div className="grid gap-2">
										<Label htmlFor="password">Parol</Label>
										<Input
											id="password"
											type="password"
											placeholder="******"
											value={password}
											onChange={(e) => setPassword(e.target.value)}
											required
										/>
									</div>
									<div className="grid gap-2">
										<Label htmlFor="phone">Telefon raqami (ixtiyoriy)</Label>
										<Input
											id="phone"
											placeholder="+998901234567"
											value={phone}
											onChange={(e) => setPhone(e.target.value)}
										/>
									</div>
								</div>

								{/* MENTOR SPECIFIC FIELDS */}
								{role === 'MENTOR' && (
									<div className="grid sm:grid-cols-2 gap-4 border-t border-border/20 pt-4 mt-2">
										<div className="grid gap-2">
											<Label htmlFor="department">Kafedra / Yo'nalish</Label>
											<Input
												id="department"
												placeholder="Dasturlash"
												value={department}
												onChange={(e) => setDepartment(e.target.value)}
											/>
										</div>
										<div className="grid gap-2">
											<Label htmlFor="specialty">Mutaxassislik</Label>
											<Input
												id="specialty"
												placeholder="Python, AI & Data Science"
												value={specialty}
												onChange={(e) => setSpecialty(e.target.value)}
											/>
										</div>
									</div>
								)}

								{/* STUDENT SPECIFIC FIELDS */}
								{role === 'STUDENT' && (
									<div className="grid gap-4 border-t border-border/20 pt-4 mt-2">
										<div className="grid sm:grid-cols-3 gap-4">
											<div className="grid gap-2">
												<Label htmlFor="studentId">Talaba ID raqami</Label>
												<Input
													id="studentId"
													placeholder="ST10293"
													value={studentId}
													onChange={(e) => setStudentId(e.target.value)}
													required={role === 'STUDENT'}
												/>
											</div>
											<div className="grid gap-2">
												<div className="flex justify-between items-center mb-1">
													<Label htmlFor="groupName">Guruh nomi</Label>
													{groups.length > 0 && (
														<button
															type="button"
															onClick={() => {
																setIsNewGroup(!isNewGroup)
																setGroupName('')
															}}
															className="text-xs text-primary hover:underline"
														>
															{isNewGroup ? "Mavjud guruhlardan tanlash" : "Yangi guruh yozish"}
														</button>
													)}
												</div>
												{isNewGroup || groups.length === 0 ? (
													<Input
														id="groupName"
														placeholder="CS-20"
														value={groupName}
														onChange={(e) => setGroupName(e.target.value)}
														required={role === 'STUDENT'}
													/>
												) : (
													<select
														id="groupName"
														value={groupName}
														onChange={(e) => {
															if (e.target.value === '__new__') {
																setIsNewGroup(true)
																setGroupName('')
															} else {
																setGroupName(e.target.value)
															}
														}}
														className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
														required={role === 'STUDENT'}
													>
														<option value="">Guruhni tanlang...</option>
														{groups.map((g) => (
															<option key={g.name} value={g.name}>{g.name}</option>
														))}
														<option value="__new__">+ Yangi guruh...</option>
													</select>
												)}
											</div>
											<div className="grid gap-2">
												<Label htmlFor="faculty">Fakultet</Label>
												<Input
													id="faculty"
													placeholder="Computer Science"
													value={faculty}
													onChange={(e) => setFaculty(e.target.value)}
													required={role === 'STUDENT'}
												/>
											</div>
										</div>

										<div className="grid sm:grid-cols-3 gap-4">
											<div className="grid gap-2">
												<Label htmlFor="level">Kurs darajasi</Label>
												<select
													id="level"
													value={level}
													onChange={(e) => setLevel(e.target.value)}
													className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
												>
													<option value="1">1-kurs</option>
													<option value="2">2-kurs</option>
													<option value="3">3-kurs</option>
													<option value="4">4-kurs</option>
												</select>
											</div>
											<div className="grid gap-2">
												<Label htmlFor="grantType">Grant holati</Label>
												<select
													id="grantType"
													value={grantType}
													onChange={(e) => setGrantType(e.target.value)}
													className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
												>
													<option value="Grant">Grant</option>
													<option value="Contract">Kontrakt</option>
													<option value="Half-Grant">Yarim-grant</option>
												</select>
											</div>
											<div className="grid gap-2">
												<Label htmlFor="currentGpaPercent">Boshlang'ich GPA (%)</Label>
												<Input
													id="currentGpaPercent"
													type="number"
													min="0"
													max="100"
													value={currentGpaPercent}
													onChange={(e) => setCurrentGpaPercent(e.target.value)}
												/>
											</div>
										</div>

										<div className="grid sm:grid-cols-2 gap-4 border-t border-border/10 pt-4 mt-2">
											<div className="grid gap-2">
												<Label htmlFor="studentMentor">Mentor (ixtiyoriy, tanlanmasa guruhdan meros oladi)</Label>
												<select
													id="studentMentor"
													value={studentMentorId}
													onChange={(e) => setStudentMentorId(e.target.value)}
													className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
												>
													<option value="">Meros olish yoki tanlanmagan</option>
													{mentors.map((m) => (
														<option key={m.id} value={m.id}>{m.fullName}</option>
													))}
												</select>
											</div>
											<div className="grid gap-2">
												<Label htmlFor="studentTutor">Tyutor (ixtiyoriy, tanlanmasa guruhdan meros oladi)</Label>
												<select
													id="studentTutor"
													value={studentTutorId}
													onChange={(e) => setStudentTutorId(e.target.value)}
													className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
												>
													<option value="">Meros olish yoki tanlanmagan</option>
													{tutors.map((t) => (
														<option key={t.id} value={t.id}>{t.fullName}</option>
													))}
												</select>
											</div>
										</div>
									</div>
								)}

								<Button
									type="submit"
									disabled={isPending}
									className="w-full mt-4 bg-primary text-primary-foreground hover:bg-primary/90 flex items-center justify-center gap-2"
								>
									{isPending ? (
										<Loader2 className="h-4 w-4 animate-spin" />
									) : (
										<Plus className="h-4 w-4" />
									)}
									Yaratish
								</Button>
							</form>
						</CardContent>
					</Card>

					<div className="grid gap-6">
						<Card className="glass-panel">
							<CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
								<CardTitle className="text-sm font-medium">Boshqaruv roli izohlari</CardTitle>
								<Shield className="w-4 h-4 text-primary" />
							</CardHeader>
							<CardContent className="text-xs text-muted-foreground space-y-2">
								<p><strong>Talaba (Student):</strong> KPI va reytingi baholanadigan, grant uchun kurashadigan asosiy o'quvchi.</p>
								<p><strong>Mentor:</strong> Talabalarga dars beradigan, ularga jarima belgilaydigan yoki davomat va topshiriqlarni tekshiradigan mutaxassis.</p>
								<p><strong>Tyutor (Tutor):</strong> Muayyan guruhga biriktirilib, talabalarning yutuqlarini (achievement) tasdiqlaydigan yoki rad etadigan mas'ul.</p>
								<p><strong>Admin:</strong> Tizimni to'liq boshqaradi, yuzaga kelgan muammolarni va yangi foydalanuvchilar va guruhlarni sozlaydi.</p>
							</CardContent>
						</Card>
					</div>
				</div>
			)}

			{activeSubTab === 'groups' && (
				<div className="grid gap-6 md:grid-cols-3">
					<Card className="glass-panel md:col-span-2">
						<CardHeader>
							<CardTitle className="text-xl">Mavjud guruhlar ro'yxati</CardTitle>
							<CardDescription>Guruhlardagi talaba va mentorlar/tyutorlar holati.</CardDescription>
						</CardHeader>
						<CardContent>
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>Guruh</TableHead>
										<TableHead>Talabalar soni</TableHead>
										<TableHead>Mentor</TableHead>
										<TableHead>Tyutor (Tutor)</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{groups.length === 0 ? (
										<TableRow>
											<TableCell colSpan={4} className="text-center text-muted-foreground py-6">
												Hozircha guruhlar mavjud emas.
											</TableCell>
										</TableRow>
									) : (
										groups.map((g) => (
											<TableRow key={g.name}>
												<TableCell className="font-semibold">{g.name}</TableCell>
												<TableCell>{g.studentCount} ta</TableCell>
												<TableCell>{g.mentorName}</TableCell>
												<TableCell>{g.tutorName}</TableCell>
											</TableRow>
										))
									)}
								</TableBody>
							</Table>
						</CardContent>
					</Card>

					<div className="grid gap-6">
						<Card className="glass-panel">
							<CardHeader>
								<CardTitle className="text-lg">Guruh yaratish</CardTitle>
								<CardDescription>Yangi guruh nomini kiriting va unga mentor/tyutor biriktiring (ixtiyoriy).</CardDescription>
							</CardHeader>
							<CardContent>
								<form onSubmit={handleCreateGroup} className="grid gap-4">
									<div className="grid gap-2">
										<Label htmlFor="newGroupName">Guruh nomi</Label>
										<Input
											id="newGroupName"
											placeholder="CS-25"
											value={newGroupName}
											onChange={(e) => setNewGroupName(e.target.value)}
											required
										/>
									</div>
									<div className="grid gap-2">
										<Label htmlFor="newGroupMentor">Mentor (ixtiyoriy)</Label>
										<select
											id="newGroupMentor"
											value={newGroupMentorId}
											onChange={(e) => setNewGroupMentorId(e.target.value)}
											className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
										>
											<option value="">Tanlanmagan</option>
											{mentors.map((m) => (
												<option key={m.id} value={m.id}>{m.fullName}</option>
											))}
										</select>
									</div>
									<div className="grid gap-2">
										<Label htmlFor="newGroupTutor">Tyutor (ixtiyoriy)</Label>
										<select
											id="newGroupTutor"
											value={newGroupTutorId}
											onChange={(e) => setNewGroupTutorId(e.target.value)}
											className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
										>
											<option value="">Tanlanmagan</option>
											{tutors.map((t) => (
												<option key={t.id} value={t.id}>{t.fullName}</option>
											))}
										</select>
									</div>
									<Button type="submit" disabled={isPending || !newGroupName}>
										{isPending ? (
											<Loader2 className="h-4 w-4 animate-spin" />
										) : (
											<Plus className="h-4 w-4 mr-2" />
										)}
										Guruh yaratish
									</Button>
								</form>
							</CardContent>
						</Card>

						<Card className="glass-panel">
							<CardHeader>
								<CardTitle className="text-lg">Mentor biriktirish</CardTitle>
								<CardDescription>Tanlangan guruh talabalariga mentor biriktirish.</CardDescription>
							</CardHeader>
							<CardContent>
								<form onSubmit={handleAssignMentor} className="grid gap-4">
									<div className="grid gap-2">
										<div className="flex justify-between items-center mb-1">
											<Label>Guruh</Label>
											{groups.length > 0 && (
												<button
													type="button"
													onClick={() => {
														setIsAssignGroupNewMentor(!isAssignGroupNewMentor)
														setAssignGroup('')
													}}
													className="text-xs text-primary hover:underline"
												>
													{isAssignGroupNewMentor ? "Mavjud guruhlardan tanlash" : "Yangi guruh yozish"}
												</button>
											)}
										</div>
										{isAssignGroupNewMentor || groups.length === 0 ? (
											<Input
												placeholder="CS-25"
												value={assignGroup}
												onChange={(e) => setAssignGroup(e.target.value)}
												required
											/>
										) : (
											<select
												value={assignGroup}
												onChange={(e) => setAssignGroup(e.target.value)}
												className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
												required
											>
												<option value="">Guruhni tanlang...</option>
												{groups.map((g) => (
													<option key={g.name} value={g.name}>{g.name}</option>
												))}
											</select>
										)}
									</div>

									<div className="grid gap-2">
										<Label>Mentor</Label>
										<select
											value={assignMentorId}
											onChange={(e) => setAssignMentorId(e.target.value)}
											className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
											required
										>
											<option value="">Mentorni tanlang...</option>
											{mentors.map((m) => (
												<option key={m.id} value={m.id}>{m.fullName}</option>
											))}
										</select>
									</div>

									<Button type="submit" disabled={isPending || !assignGroup || !assignMentorId}>
										{isPending ? (
											<Loader2 className="h-4 w-4 animate-spin" />
										) : (
											<UserCheck className="h-4 w-4 mr-2" />
										)}
										Mentorni biriktirish
									</Button>
								</form>
							</CardContent>
						</Card>

						<Card className="glass-panel">
							<CardHeader>
								<CardTitle className="text-lg">Tyutor biriktirish</CardTitle>
								<CardDescription>Guruh talabalariga va guruhga tyutor biriktirish.</CardDescription>
							</CardHeader>
							<CardContent>
								<form onSubmit={handleAssignTutor} className="grid gap-4">
									<div className="grid gap-2">
										<div className="flex justify-between items-center mb-1">
											<Label>Guruh</Label>
											{groups.length > 0 && (
												<button
													type="button"
													onClick={() => {
														setIsAssignGroupNewTutor(!isAssignGroupNewTutor)
														setAssignGroup('')
													}}
													className="text-xs text-primary hover:underline"
												>
													{isAssignGroupNewTutor ? "Mavjud guruhlardan tanlash" : "Yangi guruh yozish"}
												</button>
											)}
										</div>
										{isAssignGroupNewTutor || groups.length === 0 ? (
											<Input
												placeholder="CS-25"
												value={assignGroup}
												onChange={(e) => setAssignGroup(e.target.value)}
												required
											/>
										) : (
											<select
												value={assignGroup}
												onChange={(e) => setAssignGroup(e.target.value)}
												className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
												required
											>
												<option value="">Guruhni tanlang...</option>
												{groups.map((g) => (
													<option key={g.name} value={g.name}>{g.name}</option>
												))}
											</select>
										)}
									</div>

									<div className="grid gap-2">
										<Label>Tyutor</Label>
										<select
											value={assignTutorId}
											onChange={(e) => setAssignTutorId(e.target.value)}
											className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
											required
										>
											<option value="">Tyutorni tanlang...</option>
											{tutors.map((t) => (
												<option key={t.id} value={t.id}>{t.fullName}</option>
											))}
										</select>
									</div>

									<Button type="submit" disabled={isPending || !assignGroup || !assignTutorId}>
										{isPending ? (
											<Loader2 className="h-4 w-4 animate-spin" />
										) : (
											<UserCheck className="h-4 w-4 mr-2" />
										)}
										Tyutorni biriktirish
									</Button>
								</form>
							</CardContent>
						</Card>
					</div>
				</div>
			)}
		</div>
	)
}

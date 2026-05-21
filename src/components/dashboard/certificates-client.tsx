'use client'

import {
	deleteAchievement,
	editAchievement,
	uploadAchievement,
} from '@/actions/grant-actions'
import { MotionPanel } from '@/components/providers/motion-panel'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { StudentDashboardSnapshot } from '@/types/grant'
import {
	AlertCircle,
	Award,
	CheckCircle2,
	Clock,
	Edit,
	FileText,
	PlusCircle,
	Trash2,
	Upload,
} from 'lucide-react'
import React, { useEffect, useState } from 'react'

type Achievement = {
	id?: string
	title: string
	score: number
	category: string
	status: 'APPROVED' | 'PENDING' | 'REJECTED'
	dateAdded: string
}

type AchievementType =
	| 'ACADEMIC'
	| 'INNOVATION'
	| 'LANGUAGE'
	| 'SOCIAL'
	| 'SPORT'

export function CertificatesClient({
	student,
}: {
	student: StudentDashboardSnapshot
}) {
	const [achievements, setAchievements] = useState<Achievement[]>([])
	const [title, setTitle] = useState('')
	const [category, setCategory] = useState<AchievementType>('ACADEMIC')
	const [selectedFile, setSelectedFile] = useState<File | null>(null)
	const [isSubmitting, setIsSubmitting] = useState(false)
	const [toastMessage, setToastMessage] = useState<string | null>(null)

	// Edit dialog state
	const [editingId, setEditingId] = useState<string | null>(null)
	const [editOpen, setEditOpen] = useState(false)
	const [editTitle, setEditTitle] = useState('')
	const [editCategory, setEditCategory] = useState<AchievementType>('ACADEMIC')
	const [editFile, setEditFile] = useState<File | null>(null)
	const [editSubmitting, setEditSubmitting] = useState(false)

	// Delete confirm dialog
	const [deleteId, setDeleteId] = useState<string | null>(null)
	const [deleteOpen, setDeleteOpen] = useState(false)

	// Initialize achievements from student prop
	useEffect(() => {
		if (student) {
			const initial = student.achievements.map(item => ({
				id: item.id,
				title: item.title,
				score: item.score,
				category: item.category,
				status: item.status,
				dateAdded: item.dateAdded,
			}))
			setAchievements(initial)
		}
	}, [student])

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files[0]) {
			setSelectedFile(e.target.files[0])
		}
	}

	const handleEditFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files[0]) setEditFile(e.target.files[0])
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		// allow using file name as fallback title when title field is empty
		const fallbackTitle = selectedFile
			? selectedFile.name.replace(/\.[^/.]+$/, '')
			: ''
		const finalTitle = title.trim() || fallbackTitle
		if (!finalTitle) return

		setIsSubmitting(true)
		setToastMessage(null)

		try {
			let proofUrl: string | undefined = undefined
			if (selectedFile) {
				if (selectedFile.size > 5 * 1024 * 1024)
					throw new Error('File too large')
				// read file as data URL
				const dataUrl = await new Promise<string>((resolve, reject) => {
					const reader = new FileReader()
					reader.onload = () => resolve(String(reader.result))
					reader.onerror = () => reject(new Error('Failed to read file'))
					reader.readAsDataURL(selectedFile)
				})

				const res = await fetch('/api/uploads', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ filename: selectedFile.name, data: dataUrl }),
				})
				if (!res.ok) throw new Error('Upload failed')
				const json = await res.json()
				proofUrl = json.url
			}

			const created = await uploadAchievement({
				title: finalTitle,
				type: category,
				proofUrl: proofUrl,
			})
			const newAchievement: Achievement = {
				id: created.id,
				title: created.title,
				category,
				score: 0, // Pending evaluation
				status: 'PENDING',
				dateAdded: new Date().toISOString().split('T')[0],
			}

			setAchievements(prev => [newAchievement, ...prev])
			setTitle('')
			setCategory('ACADEMIC')
			setSelectedFile(null)
			setIsSubmitting(false)
			setToastMessage(
				"Sertifikat muvaffaqiyatli yuklandi! Hozirda ko'rib chiqilmoqda.",
			)

			// Clear toast after 4 seconds
			setTimeout(() => setToastMessage(null), 4000)
		} catch {
			setIsSubmitting(false)
			setToastMessage('Sertifikatni yuklashda xatolik yuz berdi.')
		}
	}

	const handleDelete = async (id?: string) => {
		if (!id) return
		setDeleteId(id)
		setDeleteOpen(true)
	}

	const confirmDelete = async () => {
		if (!deleteId) return
		try {
			await deleteAchievement({ achievementId: deleteId })
			setAchievements(prev => prev.filter(a => a.id !== deleteId))
			setToastMessage('Sertifikat o`chirildi')
			setDeleteOpen(false)
			setDeleteId(null)
			setTimeout(() => setToastMessage(null), 3000)
		} catch {
			setToastMessage('O`chirishda xatolik yuz berdi')
			setTimeout(() => setToastMessage(null), 3000)
		}
	}

	const handleEdit = (item: Achievement) => {
		setEditingId(item.id ?? null)
		setEditTitle(item.title)
		setEditCategory(item.category as AchievementType)
		setEditFile(null)
		setEditOpen(true)
	}

	const submitEdit = async () => {
		if (!editingId) return
		setEditSubmitting(true)
		try {
			let proofUrl: string | undefined = undefined
			if (editFile) {
				if (editFile.size > 5 * 1024 * 1024) throw new Error('File too large')
				const dataUrl = await new Promise<string>((resolve, reject) => {
					const reader = new FileReader()
					reader.onload = () => resolve(String(reader.result))
					reader.onerror = () => reject(new Error('Failed to read file'))
					reader.readAsDataURL(editFile)
				})
				const res = await fetch('/api/uploads', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ filename: editFile.name, data: dataUrl }),
				})
				if (!res.ok) throw new Error('Upload failed')
				proofUrl = (await res.json()).url
			}

			await editAchievement({
				achievementId: editingId,
				title: editTitle,
				type: editCategory,
				proofUrl,
			})
			setAchievements(prev =>
				prev.map(a =>
					a.id === editingId
						? { ...a, title: editTitle, category: editCategory }
						: a,
				),
			)
			setToastMessage('Sertifikat yangilandi')
			setEditOpen(false)
			setEditingId(null)
			setEditFile(null)
			setTimeout(() => setToastMessage(null), 3000)
		} catch (err) {
			setToastMessage('Yangilashda xatolik yuz berdi')
		} finally {
			setEditSubmitting(false)
		}
	}

	// Calculate sum of approved scores
	const totalApprovedScore = achievements
		.filter(a => a.status === 'APPROVED')
		.reduce((sum, item) => sum + item.score, 0)

	return (
		<>
			<div className='grid gap-6 lg:grid-cols-[1.2fr_0.8fr]'>
				{/* Chap ustun: Yuklash va Ro'yxat */}
				<div className='space-y-6'>
					{/* Toast Notification */}
					{toastMessage && (
						<MotionPanel>
							<div className='flex items-center gap-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 p-4 rounded-md text-sm font-medium'>
								<CheckCircle2 className='h-5 w-5 shrink-0' />
								<span>{toastMessage}</span>
							</div>
						</MotionPanel>
					)}

					{/* Yangi sertifikat yuklash */}
					<MotionPanel delay={0.05}>
						<Card className='glass-panel'>
							<CardHeader>
								<CardTitle className='flex items-center gap-2'>
									<PlusCircle className='h-5 w-5 text-primary' />
									Yangi sertifikat yuklash
								</CardTitle>
								<CardDescription>
									Erishgan yutuqlaringizni tasdiqlovchi sertifikat yoki
									hujjatlarni ushbu form orqali yuboring.
								</CardDescription>
							</CardHeader>
							<CardContent className='pt-2'>
								<form onSubmit={handleSubmit} className='space-y-4'>
									<div className='grid gap-2'>
										<Label htmlFor='title'>Yutuq / Hujjat nomi</Label>
										<Input
											id='title'
											placeholder="Masalan: IELTS 7.5 sertifikati, Hackathon g'olibi"
											value={title ?? ''}
											onChange={e => setTitle(e.target.value)}
											disabled={isSubmitting}
										/>
									</div>

									<div className='grid gap-2'>
										<Label htmlFor='category'>Yo'nalish / Kategoriya</Label>
										<select
											id='category'
											value={category}
											onChange={e =>
												setCategory(e.target.value as AchievementType)
											}
											className='flex h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
											disabled={isSubmitting}
										>
											<option value='ACADEMIC'>
												Akademik faoliyat (Maqola, olimpiada)
											</option>
											<option value='INNOVATION'>
												Innovatsiya & Loyihalar (Hackathon, startap)
											</option>
											<option value='LANGUAGE'>
												Chet tillari (IELTS, CEFR)
											</option>
											<option value='SOCIAL'>
												Ijtimoiy faoliyat (Volontyorlik)
											</option>
											<option value='SPORT'>Sport yutuqlari</option>
										</select>
									</div>

									<div className='grid gap-2'>
										<Label htmlFor='file'>Hujjat fayli (PDF yoki Rasm)</Label>
										<div className='border-2 border-dashed border-border/60 hover:border-primary/50 transition-colors rounded-md p-6 flex flex-col items-center justify-center cursor-pointer relative bg-secondary/10'>
											<Input
												id='file'
												type='file'
												accept='.pdf,.png,.jpg,.jpeg'
												onChange={handleFileChange}
												className='absolute inset-0 opacity-0 cursor-pointer'
												disabled={isSubmitting}
											/>
											<Upload className='h-8 w-8 text-muted-foreground mb-2' />
											<p className='text-sm font-medium'>
												Faylni sudrab joylashtiring yoki tanlang
											</p>
											<p className='text-xs text-muted-foreground mt-1'>
												PDF, PNG, JPG (maksimal 5MB)
											</p>
											{selectedFile && (
												<div className='mt-3 flex items-center gap-2 bg-primary/10 border border-primary/20 text-primary text-xs px-2.5 py-1 rounded'>
													<FileText className='h-3.5 w-3.5' />
													<span className='truncate max-w-50'>
														{selectedFile.name}
													</span>
												</div>
											)}
										</div>
									</div>

									<Button
										type='submit'
										className='w-full'
										disabled={isSubmitting}
									>
										{isSubmitting ? (
											<>Fayl yuborilmoqda...</>
										) : (
											<>
												<Upload className='h-4 w-4 mr-2' /> Sertifikatni
												jo'natish
											</>
										)}
									</Button>
								</form>
							</CardContent>
						</Card>
					</MotionPanel>

					{/* Sertifikatlar Ro'yxati */}
					<MotionPanel delay={0.1}>
						<Card className='glass-panel'>
							<CardHeader>
								<CardTitle>Mening sertifikatlarim</CardTitle>
								<CardDescription>
									Yuklangan va tasdiqlanish jarayonidagi yutuqlaringiz ro'yxati.
								</CardDescription>
							</CardHeader>
							<CardContent className='space-y-4'>
								{achievements.length === 0 ? (
									<div className='text-center py-6 text-muted-foreground'>
										<Award className='h-10 w-10 mx-auto opacity-30 mb-2' />
										Hozircha yuklangan yutuqlar yo'q
									</div>
								) : (
									achievements.map((item, idx) => (
										<div
											key={`${item.title}-${idx}`}
											className='flex items-start justify-between p-4 border border-border/40 rounded-md bg-secondary/10 hover:bg-secondary/20 transition-colors'
										>
											<div className='flex items-start gap-3'>
												<div className='h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0 mt-0.5'>
													<Award className='h-5 w-5' />
												</div>
												<div>
													<p className='text-sm font-semibold'>{item.title}</p>
													<div className='flex flex-wrap items-center gap-2 mt-1'>
														<span className='text-xs text-muted-foreground'>
															{item.category}
														</span>
														<span className='text-xs text-muted-foreground'>
															•
														</span>
														<span className='text-xs text-muted-foreground'>
															{item.dateAdded}
														</span>
													</div>
												</div>
											</div>

											<div className='text-right flex flex-col items-end gap-2 shrink-0'>
												{item.status === 'APPROVED' ? (
													<>
														<Badge className='bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-[10px] px-1.5 py-0'>
															<CheckCircle2 className='h-3 w-3 mr-1 inline' />{' '}
															Tasdiqlangan
														</Badge>
														<span className='text-xs font-bold text-emerald-600 dark:text-emerald-400'>
															+{item.score} ball
														</span>
													</>
												) : (
													<>
														<Badge className='bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 text-[10px] px-1.5 py-0'>
															<Clock className='h-3 w-3 mr-1 inline' />{' '}
															Ko'rilmoqda
														</Badge>
														<span className='text-xs text-muted-foreground font-semibold'>
															Baholanmoqda
														</span>
													</>
												)}
												{/* Actions: edit/delete for pending items */}
												{item.status === 'PENDING' && (
													<div className='mt-2 flex items-center gap-2'>
														<button
															onClick={() => handleEdit(item)}
															className='inline-flex items-center gap-2 rounded-md px-2 py-1 text-xs border border-border/40 bg-secondary/20 hover:bg-secondary/30'
														>
															<Edit className='h-3.5 w-3.5' /> Tahrirlash
														</button>
														<button
															onClick={() => handleDelete(item.id)}
															className='inline-flex items-center gap-2 rounded-md px-2 py-1 text-xs border border-rose-400 text-rose-600 bg-rose-50 hover:bg-rose-100'
														>
															<Trash2 className='h-3.5 w-3.5' /> O'chirish
														</button>
													</div>
												)}
											</div>
										</div>
									))
								)}
							</CardContent>
						</Card>
					</MotionPanel>
				</div>

				{/* O'ng ustun: Qo'llanma va Statistika */}
				<div className='space-y-6'>
					{/* Yutuqlar Statistikasi */}
					<MotionPanel delay={0.15}>
						<Card className='glass-panel'>
							<CardHeader>
								<CardTitle className='text-base sm:text-lg'>
									Statistika
								</CardTitle>
							</CardHeader>
							<CardContent className='space-y-4'>
								<div className='flex items-center justify-between border-b border-border/40 pb-3'>
									<span className='text-sm text-muted-foreground'>
										Jami yuklangan sertifikatlar
									</span>
									<span className='text-lg font-bold'>
										{achievements.length} ta
									</span>
								</div>
								<div className='flex items-center justify-between border-b border-border/40 pb-3'>
									<span className='text-sm text-muted-foreground'>
										Tasdiqlangan yutuqlar
									</span>
									<span className='text-lg font-bold text-emerald-600 dark:text-emerald-400'>
										{achievements.filter(a => a.status === 'APPROVED').length}{' '}
										ta
									</span>
								</div>
								<div className='flex items-center justify-between border-b border-border/40 pb-3'>
									<span className='text-sm text-muted-foreground'>
										Ko'rib chiqilmoqda
									</span>
									<span className='text-lg font-bold text-amber-500'>
										{achievements.filter(a => a.status === 'PENDING').length} ta
									</span>
								</div>
								<div className='flex items-center justify-between pt-1'>
									<span className='text-sm font-semibold'>
										Qo'shimcha reyting ballari
									</span>
									<span className='text-xl font-bold text-primary'>
										+{totalApprovedScore} ball
									</span>
								</div>
							</CardContent>
						</Card>
					</MotionPanel>

					{/* Qo'llanma */}
					<MotionPanel delay={0.2}>
						<Card className='glass-panel'>
							<CardHeader>
								<CardTitle className='text-base sm:text-lg flex items-center gap-2'>
									<AlertCircle className='h-5 w-5 text-amber-500' />
									Sertifikat yuklash qoidalari
								</CardTitle>
							</CardHeader>
							<CardContent className='text-sm text-muted-foreground space-y-3'>
								<p>
									1. <strong>Faqat shaxsiy yutuqlar:</strong> Yuklanadigan
									hujjat aynan sizning nomingizga yozilgan va joriy o'quv yili
									davomida olingan bo'lishi lozim.
								</p>
								<p>
									2. <strong>Sifat va format:</strong> Hujjatlar aniq
									o'qiladigan PDF yoki tasvir (JPEG, PNG) formatida, o'lchami
									5MB dan oshmagan holda yuklanishi kerak.
								</p>
								<p>
									3. <strong>Ko'rib chiqish muddati:</strong> Adminlar va
									tyutorlar tomonidan sertifikatlar 24-48 soat davomida
									tekshiriladi va tasdiqlansa, reytingingizga qo'shimcha ball
									sifatida qo'shiladi.
								</p>
								<p>
									4. <strong>Notog'ri ma'lumot:</strong> Soxta yoki noto'g'ri
									hujjat taqdim etish reyting ballarining kamayishiga (jarima)
									sabab bo'lishi mumkin.
								</p>
							</CardContent>
						</Card>
					</MotionPanel>
				</div>
			</div>

			{/* Edit Dialog */}
			<Dialog open={editOpen} onOpenChange={setEditOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Sertifikatni tahrirlash</DialogTitle>
						<DialogDescription>
							Nomini, kategoriyasini o'zgartiring yoki faylni almashtiring.
						</DialogDescription>
					</DialogHeader>
					<div className='grid gap-3 mt-2'>
						<Label htmlFor='edit-title'>Sarlavha</Label>
						<Input
							id='edit-title'
							value={editTitle ?? ''}
							onChange={e => setEditTitle(e.target.value)}
						/>
						<Label htmlFor='edit-category'>Kategoriya</Label>
						<select
							id='edit-category'
							value={editCategory}
							onChange={e => setEditCategory(e.target.value as AchievementType)}
							className='flex h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm'
						>
							<option value='ACADEMIC'>Akademik faoliyat</option>
							<option value='INNOVATION'>Innovatsiya & Loyihalar</option>
							<option value='LANGUAGE'>Chet tillari</option>
							<option value='SOCIAL'>Ijtimoiy faoliyat</option>
							<option value='SPORT'>Sport yutuqlari</option>
						</select>
						<Label htmlFor='edit-file'>Yangi fayl (ixtiyoriy)</Label>
						<Input
							id='edit-file'
							type='file'
							accept='.pdf,.png,.jpg,.jpeg'
							onChange={handleEditFileChange}
						/>
					</div>
					<DialogFooter className='mt-4'>
						<Button
							variant='secondary'
							onClick={() => setEditOpen(false)}
							disabled={editSubmitting}
						>
							Bekor qilish
						</Button>
						<Button onClick={submitEdit} disabled={editSubmitting}>
							{editSubmitting ? 'Saqlanmoqda...' : 'Saqlash'}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			{/* Delete Confirm Dialog */}
			<Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Haqiqatan ham o'chirmoqchimisiz?</DialogTitle>
						<DialogDescription>
							Bu amalni bajarganingizdan so'ng sertifikat butunlay o'chiriladi.
						</DialogDescription>
					</DialogHeader>
					<DialogFooter className='mt-4'>
						<Button variant='secondary' onClick={() => setDeleteOpen(false)}>
							Bekor qilish
						</Button>
						<Button
							onClick={confirmDelete}
							className='bg-rose-600 text-white hover:bg-rose-700'
						>
							O'chirish
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	)
}

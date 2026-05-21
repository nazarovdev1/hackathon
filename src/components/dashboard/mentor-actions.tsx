'use client'

import {
	assignRecoveryTask,
	completeRecoveryTask,
	createFeedback,
	createPenalty,
} from '@/actions/grant-actions'
import { Button } from '@/components/ui/button'
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
	CheckCircle2,
	Loader2,
	MessageSquare,
	Plus,
	TriangleAlert,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import type { ReactNode } from 'react'
import { useMemo, useState, useTransition } from 'react'

type ActionStatus = {
	kind: 'success' | 'error'
	message: string
}

export function MentorStudentActions({
	student,
}: {
	student: StudentDashboardSnapshot
}) {
	const router = useRouter()
	const [isPending, startTransition] = useTransition()
	const [status, setStatus] = useState<ActionStatus | null>(null)
	const [dialog, setDialog] = useState<
		'feedback' | 'recovery' | 'penalty' | null
	>(null)
	const [feedbackSubject, setFeedbackSubject] = useState(
		"Grant bo'yicha tavsiya",
	)
	const [feedbackMessage, setFeedbackMessage] = useState(
		buildDefaultFeedback(student),
	)
	const [recoveryTitle, setRecoveryTitle] = useState('Recovery vazifasi')
	const [recoveryDescription, setRecoveryDescription] = useState(
		buildDefaultRecovery(student),
	)
	const [recoveryScore, setRecoveryScore] = useState(1)
	const [recoveryDeadline, setRecoveryDeadline] = useState(defaultDeadline())
	const [penaltyType, setPenaltyType] = useState<
		'ATTENDANCE' | 'ASSIGNMENT' | 'DISCIPLINE' | 'ACADEMIC' | 'OTHER'
	>('ATTENDANCE')
	const [penaltyReason, setPenaltyReason] = useState(
		"Nizom bo'yicha qoidabuzarlik",
	)
	const [penaltyScore, setPenaltyScore] = useState(1)

	const recoveryLimit = useMemo(() => {
		const allowed = Math.min(10, student.kpi.penalty * 0.5)
		return Math.max(0, Number((allowed - student.kpi.recovery).toFixed(2)))
	}, [student.kpi.penalty, student.kpi.recovery])
	const penaltyLimit = Math.max(
		0,
		Number((20 - student.kpi.penalty).toFixed(2)),
	)

	function runAction(action: () => Promise<unknown>, successMessage: string) {
		setStatus(null)
		startTransition(async () => {
			try {
				await action()
				setDialog(null)
				setStatus({ kind: 'success', message: successMessage })
				router.refresh()
			} catch (error) {
				setStatus({
					kind: 'error',
					message: error instanceof Error ? error.message : 'Amal bajarilmadi.',
				})
			}
		})
	}

	function submitFeedback() {
		if (!feedbackMessage.trim()) return
		runAction(
			() =>
				createFeedback({
					studentId: student.id,
					type: 'GENERAL',
					subject: feedbackSubject,
					message: feedbackMessage,
				}),
			'Tavsiya saqlandi.',
		)
	}

	function submitRecovery() {
		if (
			recoveryLimit <= 0 ||
			recoveryScore <= 0 ||
			recoveryScore > recoveryLimit
		)
			return
		runAction(
			() =>
				assignRecoveryTask({
					studentId: student.id,
					title: recoveryTitle,
					description: recoveryDescription,
					recoveryScore,
					deadline: new Date(`${recoveryDeadline}T23:59:59`),
				}),
			'Reabilitatsiya vazifasi biriktirildi.',
		)
	}

	function submitPenalty() {
		if (penaltyLimit <= 0 || penaltyScore <= 0 || penaltyScore > penaltyLimit)
			return
		runAction(
			() =>
				createPenalty({
					studentId: student.id,
					type: penaltyType,
					reason: penaltyReason,
					score: penaltyScore,
				}),
			'Jarima saqlandi va KPI qayta hisoblandi.',
		)
	}

	return (
		<div className='flex flex-col items-end gap-2'>
			<div className='flex flex-wrap justify-end gap-2'>
				<Button
					size='sm'
					variant='outline'
					className='border-cyan-500/20 text-cyan-300 hover:bg-cyan-500/10'
					onClick={() => setDialog('feedback')}
				>
					<MessageSquare className='mr-1 h-3.5 w-3.5' /> Tavsiya
				</Button>
				<Button
					size='sm'
					className='bg-emerald-600 text-white hover:bg-emerald-500'
					onClick={() => setDialog('recovery')}
					disabled={recoveryLimit <= 0}
					title={
						recoveryLimit <= 0
							? "Recovery limiti tugagan yoki jarima yo'q"
							: undefined
					}
				>
					<Plus className='mr-1 h-3.5 w-3.5' /> Reabilitatsiya
				</Button>
				<Button
					size='sm'
					variant='outline'
					className='border-rose-500/20 text-rose-300 hover:bg-rose-500/10'
					onClick={() => setDialog('penalty')}
					disabled={penaltyLimit <= 0}
					title={
						penaltyLimit <= 0 ? 'Jarima limiti -20 ballga yetgan' : undefined
					}
				>
					<TriangleAlert className='mr-1 h-3.5 w-3.5' /> Jarima
				</Button>
			</div>
			{status && (
				<p
					className={
						status.kind === 'success'
							? 'text-xs text-emerald-400'
							: 'text-xs text-rose-400'
					}
				>
					{status.message}
				</p>
			)}

			<Dialog
				open={dialog === 'feedback'}
				onOpenChange={open => setDialog(open ? 'feedback' : null)}
			>
				<DialogContent className='sm:max-w-lg'>
					<DialogHeader>
						<DialogTitle>Tavsiya yuborish</DialogTitle>
						<DialogDescription>
							{student.name} profiliga mentor/tutor tavsiyasi yoziladi.
						</DialogDescription>
					</DialogHeader>
					<form
						className='grid gap-4'
						onSubmit={event => event.preventDefault()}
					>
						<Field label='Mavzu'>
							<Input
								value={feedbackSubject}
								onChange={event => setFeedbackSubject(event.target.value)}
								required
							/>
						</Field>
						<TextareaField
							label='Tavsiya matni'
							value={feedbackMessage}
							onChange={setFeedbackMessage}
						/>
						<DialogFooter>
							<Button
								type='button'
								disabled={isPending || !feedbackMessage.trim()}
								onClick={submitFeedback}
							>
								{isPending ? (
									<Loader2 className='h-4 w-4 animate-spin' />
								) : (
									<MessageSquare className='h-4 w-4' />
								)}
								Saqlash
							</Button>
						</DialogFooter>
					</form>
				</DialogContent>
			</Dialog>

			<Dialog
				open={dialog === 'recovery'}
				onOpenChange={open => setDialog(open ? 'recovery' : null)}
			>
				<DialogContent className='sm:max-w-lg'>
					<DialogHeader>
						<DialogTitle>Reabilitatsiya vazifasi</DialogTitle>
						<DialogDescription>
							Maksimal qo'shish mumkin bo'lgan recovery: {recoveryLimit} ball.
						</DialogDescription>
					</DialogHeader>
					<form
						className='grid gap-4'
						onSubmit={event => event.preventDefault()}
					>
						<Field label='Vazifa nomi'>
							<Input
								value={recoveryTitle}
								onChange={event => setRecoveryTitle(event.target.value)}
								required
							/>
						</Field>
						<TextareaField
							label='Vazifa tavsifi'
							value={recoveryDescription}
							onChange={setRecoveryDescription}
						/>
						<div className='grid gap-3 sm:grid-cols-2'>
							<Field label='Recovery ball'>
								<Input
									type='number'
									min={1}
									max={Math.max(1, recoveryLimit)}
									step='0.5'
									value={recoveryScore}
									onChange={event =>
										setRecoveryScore(Number(event.target.value))
									}
									required
								/>
							</Field>
							<Field label='Deadline'>
								<Input
									type='date'
									value={recoveryDeadline}
									onChange={event => setRecoveryDeadline(event.target.value)}
									required
								/>
							</Field>
						</div>
						<DialogFooter>
							<Button
								type='button'
								disabled={
									isPending ||
									recoveryLimit <= 0 ||
									recoveryScore <= 0 ||
									recoveryScore > recoveryLimit
								}
								onClick={submitRecovery}
							>
								{isPending ? (
									<Loader2 className='h-4 w-4 animate-spin' />
								) : (
									<Plus className='h-4 w-4' />
								)}
								Biriktirish
							</Button>
						</DialogFooter>
					</form>
				</DialogContent>
			</Dialog>

			<Dialog
				open={dialog === 'penalty'}
				onOpenChange={open => setDialog(open ? 'penalty' : null)}
			>
				<DialogContent className='sm:max-w-lg'>
					<DialogHeader>
						<DialogTitle>Jarima kiritish</DialogTitle>
						<DialogDescription>
							Semestr bo'yicha qolgan jarima limiti: {penaltyLimit} ball.
						</DialogDescription>
					</DialogHeader>
					<form
						className='grid gap-4'
						onSubmit={event => event.preventDefault()}
					>
						<Field label='Jarima turi'>
							<select
								value={penaltyType}
								onChange={event =>
									setPenaltyType(event.target.value as typeof penaltyType)
								}
								className='h-8 w-full rounded-lg border border-input bg-background px-2.5 text-sm'
							>
								<option value='ATTENDANCE'>Davomat</option>
								<option value='ASSIGNMENT'>Topshiriq</option>
								<option value='DISCIPLINE'>Intizom</option>
								<option value='ACADEMIC'>Akademik</option>
								<option value='OTHER'>Boshqa</option>
							</select>
						</Field>
						<TextareaField
							label='Sabab'
							value={penaltyReason}
							onChange={setPenaltyReason}
						/>
						<Field label='Jarima ball'>
							<Input
								type='number'
								min={1}
								max={Math.max(1, penaltyLimit)}
								step='1'
								value={penaltyScore}
								onChange={event => setPenaltyScore(Number(event.target.value))}
								required
							/>
						</Field>
						<DialogFooter>
							<Button
								type='button'
								disabled={
									isPending ||
									penaltyLimit <= 0 ||
									penaltyScore <= 0 ||
									penaltyScore > penaltyLimit
								}
								onClick={submitPenalty}
							>
								{isPending ? (
									<Loader2 className='h-4 w-4 animate-spin' />
								) : (
									<TriangleAlert className='h-4 w-4' />
								)}
								Jarimani saqlash
							</Button>
						</DialogFooter>
					</form>
				</DialogContent>
			</Dialog>
		</div>
	)
}

export function CompleteRecoveryButton({
	taskId,
	disabled,
}: {
	taskId: string
	disabled?: boolean
}) {
	const router = useRouter()
	const [isPending, startTransition] = useTransition()

	return (
		<Button
			size='sm'
			variant='outline'
			className='h-7 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/10'
			disabled={disabled || isPending}
			onClick={() => {
				startTransition(async () => {
					await completeRecoveryTask({ taskId })
					router.refresh()
				})
			}}
		>
			{isPending ? (
				<Loader2 className='h-3.5 w-3.5 animate-spin' />
			) : (
				<CheckCircle2 className='h-3.5 w-3.5' />
			)}
			Bajarildi
		</Button>
	)
}

function Field({ label, children }: { label: string; children: ReactNode }) {
	return (
		<div className='grid gap-2 text-left'>
			<Label>{label}</Label>
			{children}
		</div>
	)
}

function TextareaField({
	label,
	value,
	onChange,
}: {
	label: string
	value: string
	onChange: (value: string) => void
}) {
	return (
		<Field label={label}>
			<textarea
				value={value}
				onChange={event => onChange(event.target.value)}
				required
				rows={4}
				className='min-h-24 w-full resize-none rounded-lg border border-input bg-background px-2.5 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50'
			/>
		</Field>
	)
}

function defaultDeadline() {
	const date = new Date()
	date.setDate(date.getDate() + 14)
	return date.toISOString().slice(0, 10)
}

function buildDefaultFeedback(student: StudentDashboardSnapshot) {
	if (student.kpi.academicPercent < 80) {
		return "Akademik o'zlashtirish 80% dan past. Keyingi ikki hafta ichida mentor bilan individual reja tuzish va past fanlardan qayta topshiriqlarni yopish tavsiya etiladi."
	}

	if (student.grant.finalScore < 80) {
		return 'Yakuniy KPI 80 balldan past. Davomat, assignment va jarima sabablarini yopish uchun recovery rejasi biriktirish tavsiya etiladi.'
	}

	return 'Grant holatini saqlab qolish uchun joriy ritmni davom ettirish va sertifikat/faollik bloklarini kuchaytirish tavsiya etiladi.'
}

function buildDefaultRecovery(student: StudentDashboardSnapshot) {
	if (student.kpi.academicPercent < 80) {
		return "Past akademik ko'rsatkichlar bo'yicha qo'shimcha mashg'ulotlarga qatnashish va mentor nazoratida qayta baholashga tayyorlanish."
	}

	return "Jarimani qisman qoplash uchun qo'shimcha akademik yoki ijtimoiy vazifani namunali bajarish."
}

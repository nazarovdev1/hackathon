'use server'

import { prisma } from '@/lib/prisma'
import { getCachedServerSession } from '@/lib/session'
import { revalidatePath } from 'next/cache'
import bcrypt from 'bcryptjs'
import type { Prisma } from '@prisma/client'

function revalidateDashboards() {
	revalidatePath('/dashboard/admin')
	revalidatePath('/dashboard/mentor')
	revalidatePath('/dashboard/student')
}

async function assertAdmin() {
	const session = await getCachedServerSession()
	if (!session || session.user.role !== 'ADMIN') {
		throw new Error('Unauthorized: Faqat adminlar ushbu amalni bajara oladi.')
	}
	return session
}

export async function createAdminUser(data: {
	fullName: string
	email: string
	passwordHash: string
	phone?: string
}) {
	await assertAdmin()

	const email = data.email.trim().toLowerCase()
	if (!email || !data.fullName || !data.passwordHash) {
		throw new Error('Barcha majburiy maydonlarni to\'ldiring.')
	}

	const existingUser = await prisma.user.findUnique({
		where: { email },
	})
	if (existingUser) {
		throw new Error('Ushbu email bilan allaqachon foydalanuvchi mavjud.')
	}

	const passwordHash = await bcrypt.hash(data.passwordHash, 10)

	const user = await prisma.user.create({
		data: {
			fullName: data.fullName,
			email,
			passwordHash,
			phone: data.phone || null,
			role: 'ADMIN',
		},
	})

	revalidateDashboards()
	return { success: true, id: user.id }
}

export async function createMentorUser(data: {
	fullName: string
	email: string
	passwordHash: string
	phone?: string
	role: 'MENTOR' | 'TUTOR'
	department?: string
	specialty?: string
	assignedGroup?: string
}) {
	await assertAdmin()

	const email = data.email.trim().toLowerCase()
	if (!email || !data.fullName || !data.passwordHash) {
		throw new Error('Barcha majburiy maydonlarni to\'ldiring.')
	}

	const existingUser = await prisma.user.findUnique({
		where: { email },
	})
	if (existingUser) {
		throw new Error('Ushbu email bilan allaqachon foydalanuvchi mavjud.')
	}

	const passwordHash = await bcrypt.hash(data.passwordHash, 10)

	const user = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
		const createdUser = await tx.user.create({
			data: {
				fullName: data.fullName,
				email,
				passwordHash,
				phone: data.phone || null,
				role: data.role,
			},
		})

		if (data.role === 'MENTOR') {
			await tx.mentorProfile.create({
				data: {
					userId: createdUser.id,
					department: data.department || 'Dasturlash',
					specialty: data.specialty || 'Full-stack',
				},
			})
		} else {
			await tx.tutorProfile.create({
				data: {
					userId: createdUser.id,
					assignedGroup: data.assignedGroup || '',
				},
			})
		}

		return createdUser
	})

	revalidateDashboards()
	return { success: true, id: user.id }
}

export async function createStudentUser(data: {
	fullName: string
	email: string
	passwordHash: string
	phone?: string
	studentId: string
	groupName: string
	faculty: string
	level: string
	grantType: string
	currentGpaPercent?: number
	mentorId?: string
	tutorId?: string
}) {
	await assertAdmin()

	const email = data.email.trim().toLowerCase()
	if (!email || !data.fullName || !data.passwordHash || !data.studentId || !data.groupName || !data.faculty) {
		throw new Error('Barcha maydonlarni to\'ldiring.')
	}

	const existingUser = await prisma.user.findUnique({
		where: { email },
	})
	if (existingUser) {
		throw new Error('Ushbu email bilan allaqachon foydalanuvchi mavjud.')
	}

	const existingStudentId = await prisma.studentProfile.findUnique({
		where: { studentId: data.studentId },
	})
	if (existingStudentId) {
		throw new Error('Ushbu ID raqamiga ega talaba allaqachon mavjud.')
	}

	const passwordHash = await bcrypt.hash(data.passwordHash, 10)
	const gpaPercent = Number(data.currentGpaPercent || 85)

	const user = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
		let mentorId = data.mentorId || null
		if (!mentorId) {
			const sibling = await tx.studentProfile.findFirst({
				where: { groupName: data.groupName, mentorId: { not: null } },
				select: { mentorId: true }
			})
			if (sibling) {
				mentorId = sibling.mentorId
			}
		}

		let tutorId = data.tutorId || null
		if (!tutorId) {
			const tutor = await tx.tutorProfile.findFirst({
				where: { assignedGroup: data.groupName },
				select: { userId: true }
			})
			if (tutor) {
				tutorId = tutor.userId
			} else {
				const sibling = await tx.studentProfile.findFirst({
					where: { groupName: data.groupName, tutorId: { not: null } },
					select: { tutorId: true }
				})
				if (sibling) {
					tutorId = sibling.tutorId
				}
			}
		}

		const createdUser = await tx.user.create({
			data: {
				fullName: data.fullName,
				email,
				passwordHash,
				phone: data.phone || null,
				role: 'STUDENT',
			},
		})

		const profile = await tx.studentProfile.create({
			data: {
				userId: createdUser.id,
				studentId: data.studentId,
				groupName: data.groupName,
				faculty: data.faculty,
				level: data.level,
				grantType: data.grantType,
				currentGpaPercent: gpaPercent,
				mentorId,
				tutorId,
			},
		})

		// Create default initial ScoreRecord to prevent runtime rendering bugs
		// Academic score based on the starting GPA
		const academicScore = (gpaPercent / 100) * 40
		const finalScore = academicScore + 20 + 10 // Starting stats: GPA + attendance + assignment default

		await tx.scoreRecord.create({
			data: {
				studentId: profile.id,
				semester: '2026 Spring',
				academicPercent: gpaPercent,
				academicScore: academicScore,
				attendancePercent: 100,
				attendanceScore: 20,
				assignmentScore: 10,
				activityScore: 10,
				tutorScore: 10,
				disciplineScore: 10,
				mainKpi: finalScore,
				penaltyScore: 0,
				recoveryScore: 0,
				employmentBonus: 0,
				adminBonusScore: 0,
				finalScore: finalScore,
				riskLevel: 'LOW',
				grantStatus: 'ELIGIBLE',
			},
		})

		return createdUser
	})

	revalidateDashboards()
	return { success: true, id: user.id }
}

export async function createGroup(data: {
	groupName: string
	mentorId?: string
	tutorId?: string
}) {
	await assertAdmin()

	const groupName = data.groupName.trim()
	if (!groupName) {
		throw new Error('Guruh nomini kiriting.')
	}

	await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
		// If tutorId is provided, update tutor profile assignedGroup
		if (data.tutorId) {
			await tx.tutorProfile.updateMany({
				where: { userId: data.tutorId },
				data: { assignedGroup: groupName }
			})
		}

		// Update all existing students in this group to match the tutor/mentor
		const updateData: any = {}
		if (data.mentorId) {
			updateData.mentorId = data.mentorId
		}
		if (data.tutorId) {
			updateData.tutorId = data.tutorId
		}

		if (Object.keys(updateData).length > 0) {
			await tx.studentProfile.updateMany({
				where: { groupName },
				data: updateData
			})
		}
	})

	revalidateDashboards()
	return { success: true }
}

export async function assignMentorToGroup(data: {
	groupName: string
	mentorId: string
}) {
	await assertAdmin()

	if (!data.groupName || !data.mentorId) {
		throw new Error('Guruh nomi va mentorni belgilang.')
	}

	const updated = await prisma.studentProfile.updateMany({
		where: { groupName: data.groupName },
		data: { mentorId: data.mentorId },
	})

	revalidateDashboards()
	return { success: true, count: updated.count }
}

export async function assignTutorToGroup(data: {
	groupName: string
	tutorId: string
}) {
	await assertAdmin()

	if (!data.groupName || !data.tutorId) {
		throw new Error('Guruh nomi va tyutorni belgilang.')
	}

	await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
		// Update student profiles in that group to point to this tutor
		await tx.studentProfile.updateMany({
			where: { groupName: data.groupName },
			data: { tutorId: data.tutorId },
		})

		// Also update the tutor's profile assigned group
		await tx.tutorProfile.updateMany({
			where: { userId: data.tutorId },
			data: { assignedGroup: data.groupName },
		})
	})

	revalidateDashboards()
	return { success: true }
}

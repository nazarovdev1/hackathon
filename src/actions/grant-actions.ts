'use server'

import {
	approveAchievement as approveAchievementService,
	assignRecoveryTask as assignRecoveryTaskService,
	completeRecoveryTask as completeRecoveryTaskService,
	createFeedback as createFeedbackService,
	createGrantDecision as createGrantDecisionService,
	createPenalty as createPenaltyService,
	deleteAchievement as deleteAchievementService,
	getAdminGrantOverview,
	getCurrentStudentDashboard,
	getMentorStudents,
	getStudentGrantSnapshot,
	updateAchievement as updateAchievementService,
	uploadAchievement as uploadAchievementService,
} from '@/services/dashboard-data'
import { revalidatePath } from 'next/cache'
import { Prisma } from '@prisma/client'

export {
	getAdminGrantOverview,
	getCurrentStudentDashboard,
	getMentorStudents,
	getStudentGrantSnapshot,
}

export async function createFeedback(
	input: Parameters<typeof createFeedbackService>[0],
) {
	const result = await createFeedbackService(input)
	revalidateDashboards()
	return result
}

export async function createPenalty(
	input: Parameters<typeof createPenaltyService>[0],
) {
	const result = await createPenaltyService(input)
	revalidateDashboards()
	return result
}

export async function assignRecoveryTask(
	input: Parameters<typeof assignRecoveryTaskService>[0],
) {
	const result = await assignRecoveryTaskService(input)
	revalidateDashboards()
	return result
}

export async function uploadAchievement(
	input: Parameters<typeof uploadAchievementService>[0],
) {
	const achievement = await uploadAchievementService(input)
	return {
		id: achievement.id,
		title: achievement.title,
	}
}

export async function editAchievement(
	input: Parameters<typeof updateAchievementService>[0],
) {
	const achievement = await updateAchievementService(input)
	revalidateDashboards()
	return { id: achievement.id, title: achievement.title }
}

export async function deleteAchievement(input: { achievementId: string }) {
	const result = await deleteAchievementService(input)
	revalidateDashboards()
	return { id: result.id }
}

export async function approveAchievement(
	input: Parameters<typeof approveAchievementService>[0],
) {
	const result = await approveAchievementService(input)
	revalidateDashboards()
	return { id: result.id }
}

export async function createGrantDecision(
	input: Parameters<typeof createGrantDecisionService>[0],
) {
	const result = await createGrantDecisionService(input)
	revalidateDashboards()
	return { id: result.id }
}

export async function completeRecoveryTask(
	input: Parameters<typeof completeRecoveryTaskService>[0],
) {
	const result = await completeRecoveryTaskService(input)
	revalidateDashboards()
	return result
}

function revalidateDashboards() {
	revalidatePath('/dashboard/mentor')
	revalidatePath('/dashboard/admin')
	revalidatePath('/dashboard/student')
	revalidatePath('/dashboard/student/feedback')
	revalidatePath('/dashboard/student/rating')
}

import { getCachedServerSession } from '@/lib/session'
import { prisma } from '@/lib/prisma'

export async function awardAdminBonus(input: {
	studentId: string
	score: number
	reason: string
}) {
	const session = await getCachedServerSession()
	if (!session || session.user.role !== 'ADMIN') {
		throw new Error('Unauthorized')
	}

	const score = Number(input.score)
	if (isNaN(score) || score < 0.5 || score > 20) {
		throw new Error("Bonus ball 0.5 va 20 oralig'ida bo'lishi kerak.")
	}

	await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
		await tx.adminScoreAdjustment.create({
			data: {
				studentId: input.studentId,
				adminId: session.user.id,
				score: score,
				reason: input.reason,
			}
		})

		const record = await tx.scoreRecord.findFirst({
			where: { studentId: input.studentId },
			orderBy: { calculatedAt: 'desc' },
		})

		if (record) {
			const next = {
				academic: Number(record.academicScore),
				attendance: Number(record.attendanceScore),
				assignment: Number(record.assignmentScore),
				activity: Number(record.activityScore),
				tutor: Number(record.tutorScore),
				discipline: Number(record.disciplineScore),
				penalty: Number(record.penaltyScore),
				recovery: Number(record.recoveryScore),
				employmentBonus: Number(record.employmentBonus),
				adminBonus: score,
				academicPercent: Number(record.academicPercent),
			}
			const { calculateGrantScore } = await import('@/services/grant-engine')
			const grant = calculateGrantScore(next)

			await tx.scoreRecord.update({
				where: { id: record.id },
				data: {
					adminBonusScore: score,
					mainKpi: grant.mainKpi,
					finalScore: grant.finalScore,
					grantStatus: grant.grantStatus,
					riskLevel: grant.riskLevel,
				}
			})
		}
	})

	revalidateDashboards()
	return { success: true }
}

export async function expelStudent(input: {
	studentId: string
	reason?: string
}) {
	const session = await getCachedServerSession()
	if (!session || session.user.role !== 'ADMIN') {
		throw new Error('Unauthorized')
	}

	await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
		const student = await tx.studentProfile.findUnique({
			where: { id: input.studentId },
			select: { userId: true }
		})

		if (!student) {
			throw new Error('Talaba topilmadi.')
		}

		await tx.studentProfile.update({
			where: { id: input.studentId },
			data: {
				status: 'EXPELLED',
				statusReason: input.reason || "O'qishdan chetlashtirildi",
				statusChangedAt: new Date(),
				statusChangedById: session.user.id,
			}
		})

		await tx.user.update({
			where: { id: student.userId },
			data: { isActive: false }
		})
	})

	revalidateDashboards()
	return { success: true }
}

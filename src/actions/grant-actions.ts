'use server'

import {
  approveAchievement as approveAchievementService,
  assignRecoveryTask as assignRecoveryTaskService,
  completeRecoveryTask as completeRecoveryTaskService,
  createFeedback as createFeedbackService,
  createGrantDecision as createGrantDecisionService,
  createPenalty as createPenaltyService,
  getAdminGrantOverview,
  getCurrentStudentDashboard,
  getMentorStudents,
  getStudentGrantSnapshot,
  uploadAchievement as uploadAchievementService,
} from "@/services/dashboard-data";

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

export async function awardAdminBonus(input: Parameters<typeof awardAdminBonusService>[0]) {
  const result = await awardAdminBonusService(input);
  revalidateDashboards();
  return result;
}

export async function expelStudent(input: Parameters<typeof expelStudentService>[0]) {
  const result = await expelStudentService(input);
  revalidateDashboards();
  return result;
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

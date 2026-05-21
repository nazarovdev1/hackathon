import { MentorDashboardClient } from '@/components/dashboard/mentor-dashboard-client'
import { DashboardShell } from '@/components/layout/dashboard-shell'
import { getMentorStudents } from '@/services/dashboard-data'

import { getCachedServerSession } from '@/lib/session'
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function MentorDashboardPage() {
	const session = await getCachedServerSession()
	if (!session || (session.user.role !== 'MENTOR' && session.user.role !== 'TUTOR' && session.user.role !== 'ADMIN')) {
		redirect('/')
	}
	const rows = await getMentorStudents()

	return (
		<DashboardShell
			title='Mentor paneli'
			eyebrow="Talabalarni qo'llab-quvvatlash markazi"
		>
			<MentorDashboardClient rows={rows} />
		</DashboardShell>
	)
}



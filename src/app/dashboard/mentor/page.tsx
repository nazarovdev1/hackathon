import { MentorDashboardClient } from '@/components/dashboard/mentor-dashboard-client'
import { DashboardShell } from '@/components/layout/dashboard-shell'
import { getMentorStudents } from '@/services/dashboard-data'

export const dynamic = 'force-dynamic'

export default async function MentorDashboardPage() {
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



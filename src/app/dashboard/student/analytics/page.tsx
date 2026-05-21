import {
	AcademicChart,
	AttendanceChart,
} from '@/components/charts/analytics-charts'
import { DashboardShell } from '@/components/layout/dashboard-shell'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getCurrentStudentDashboard } from '@/services/dashboard-data'
import { notFound } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function StudentAnalyticsPage() {
	const student = await getCurrentStudentDashboard()
	if (!student) notFound()

	return (
		<DashboardShell title='Tahlil' eyebrow='Talaba tahlili'>
			<div className='grid gap-5 xl:grid-cols-2'>
				<Card className='glass-panel'>
					<CardHeader>
						<CardTitle>Davomat tahlili</CardTitle>
					</CardHeader>
					<CardContent>
						<AttendanceChart data={student.attendanceTrend} />
					</CardContent>
				</Card>

				<Card className='glass-panel'>
					<CardHeader>
						<CardTitle>O'zlashtirish tahlili</CardTitle>
					</CardHeader>
					<CardContent>
						<AcademicChart data={student.academicTrend} />
					</CardContent>
				</Card>
			</div>
		</DashboardShell>
	)
}

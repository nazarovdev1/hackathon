import { notFound } from 'next/navigation'
import { CertificatesClient } from '@/components/dashboard/certificates-client'
import { DashboardShell } from '@/components/layout/dashboard-shell'
import { getCurrentStudentDashboard } from '@/services/dashboard-data'

export const metadata = {
	title: 'Sertifikatlar - PDP METRIC',
	description: 'Talabaning yuklangan sertifikatlari va yutuqlari.',
}

export const dynamic = 'force-dynamic'

export default async function StudentCertificatesPage() {
	const currentStudent = await getCurrentStudentDashboard()
	if (!currentStudent) notFound()

	return (
		<DashboardShell title='Sertifikatlar va Yutuqlar' eyebrow='Yutuqlar ombori'>
			<CertificatesClient student={currentStudent} />
		</DashboardShell>
	)
}

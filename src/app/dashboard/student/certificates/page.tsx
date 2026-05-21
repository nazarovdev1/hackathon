import { notFound } from "next/navigation";
import { headers } from "next/headers";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { CertificatesClient } from "@/components/dashboard/certificates-client";
import { getCurrentStudentDashboard } from "@/services/dashboard-data";

export const metadata = {
  title: "Sertifikatlar - PDP METRIC",
  description: "Talabaning yuklangan sertifikatlari va yutuqlari.",
};

export const dynamic = "force-dynamic";

export default async function StudentCertificatesPage() {
  const headersList = await headers();
  const pathname = headersList.get("x-pathname") || "/dashboard/student/certificates";

  const currentStudent = await getCurrentStudentDashboard();
  if (!currentStudent) notFound();

  return (
    <DashboardShell title="Sertifikatlar va Yutuqlar" eyebrow="Yutuqlar ombori" pathname={pathname}>
      <CertificatesClient student={currentStudent} />
    </DashboardShell>
  );
}

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { students } from "@/services/mock-data";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { CertificatesClient } from "@/components/dashboard/certificates-client";

export const metadata = {
  title: "Sertifikatlar - PDP METRIC",
  description: "Talabaning yuklangan sertifikatlari va yutuqlari.",
};

export default async function StudentCertificatesPage() {
  const session = await getServerSession(authOptions);
  const currentStudent = students.find((s) => s.email === session?.user?.email) || students[0];

  return (
    <DashboardShell title="Sertifikatlar va Yutuqlar" eyebrow="Yutuqlar ombori">
      <CertificatesClient student={currentStudent} />
    </DashboardShell>
  );
}

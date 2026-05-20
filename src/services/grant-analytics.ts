import { getAdminGrantOverview } from "@/services/dashboard-data";

export async function getGrantAnalyticsSummary() {
  const overview = await getAdminGrantOverview();

  return {
    total: overview.total,
    eligible: overview.eligible,
    risk: overview.rows.filter((item) => item.grant.grantStatus === "RISK").length,
    denied: overview.rows.filter((item) => item.grant.grantStatus === "DENIED").length,
    highRisk: overview.highRisk,
  };
}

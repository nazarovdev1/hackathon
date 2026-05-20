import { calculateGrantScore } from "@/services/grant-engine";
import { students } from "@/services/mock-data";

export function getGrantAnalyticsSummary() {
  const scored = students.map((student) => calculateGrantScore(student.kpi));

  return {
    total: scored.length,
    eligible: scored.filter((item) => item.grantStatus === "ELIGIBLE").length,
    risk: scored.filter((item) => item.grantStatus === "RISK").length,
    denied: scored.filter((item) => item.grantStatus === "DENIED").length,
    highRisk: scored.filter((item) => item.riskLevel === "HIGH").length,
  };
}

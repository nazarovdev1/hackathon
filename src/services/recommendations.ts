import type { GrantCalculationResult, GrantKpiInput } from "@/types/grant";

export function buildRecommendations(input: GrantKpiInput, result: GrantCalculationResult) {
  const recommendations = [];

  if (input.attendance < 12) {
    recommendations.push({
      title: "Attendance pasaymoqda",
      message: "Keyingi 2 hafta ichida qatnashuvni barqarorlashtirish grant riskini kamaytiradi.",
      severity: "HIGH" as const,
    });
  }

  if (input.assignment < 12) {
    recommendations.push({
      title: "Assignment topshirish kechikmoqda",
      message: "Kechikkan topshiriqlarni yopish final score uchun eng tez tiklanish yo‘li.",
      severity: "MEDIUM" as const,
    });
  }

  if (result.grantStatus !== "ELIGIBLE") {
    recommendations.push({
      title: "Grant xavf ostida",
      message: "Academic, attendance va penalty faktorlarini mentor bilan qayta ko‘rib chiqing.",
      severity: result.riskLevel,
    });
  }

  return recommendations;
}

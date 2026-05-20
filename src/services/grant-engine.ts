import type { GrantCalculationResult, GrantKpiInput, RiskLevel } from "@/types/grant";

const clampScore = (value: number) => Math.max(0, Math.min(100, Number(value.toFixed(2))));

function resolveRiskLevel(finalScore: number, academicPercent: number): RiskLevel {
  if (academicPercent < 80 || finalScore < 65) return "HIGH";
  if (finalScore < 80) return "MEDIUM";
  return "LOW";
}

export function calculateGrantScore(input: GrantKpiInput): GrantCalculationResult {
  const mainKpi = clampScore(
    input.academic + input.attendance + input.assignment + input.activity + input.tutor + input.discipline,
  );
  const finalScore = clampScore(mainKpi - input.penalty + input.recovery + input.employmentBonus);
  const academicDenied = input.academicPercent < 80;
  const grantStatus = academicDenied ? "DENIED" : finalScore >= 80 ? "ELIGIBLE" : "RISK";
  const reasons: string[] = [];

  if (academicDenied) reasons.push("Academic percent 80% dan past, grant avtomatik rad etiladi.");
  if (finalScore < 80) reasons.push("Final score grant eligibility chegarasidan past.");
  if (input.penalty > 0) reasons.push("Penalty ballari final natijani kamaytiryapti.");
  if (input.attendance < 12) reasons.push("Attendance komponenti monitoring talab qiladi.");

  return {
    mainKpi,
    finalScore,
    grantStatus,
    riskLevel: resolveRiskLevel(finalScore, input.academicPercent),
    reasons,
  };
}

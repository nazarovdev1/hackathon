export type GrantStatus = "ELIGIBLE" | "RISK" | "DENIED";

export type RiskLevel = "LOW" | "MEDIUM" | "HIGH";

export type GrantKpiInput = {
  academic: number;
  attendance: number;
  assignment: number;
  activity: number;
  tutor: number;
  discipline: number;
  penalty: number;
  recovery: number;
  employmentBonus: number;
  academicPercent: number;
};

export type GrantCalculationResult = {
  mainKpi: number;
  finalScore: number;
  grantStatus: GrantStatus;
  riskLevel: RiskLevel;
  reasons: string[];
};

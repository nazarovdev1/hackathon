import { GrantStatus, RiskLevel } from "@prisma/client";

export interface KPIData {
  academic: number;
  attendance: number;
  assignment: number;
  activity: number;
  tutor: number;
  discipline: number;
  penalty: number;
  recovery: number;
  employmentBonus: number;
}

export interface KPIResult {
  mainKPI: number;
  finalScore: number;
  grantStatus: GrantStatus;
  riskLevel: RiskLevel;
}

/**
 * Calculates the KPI and determines Grant Status & Risk Level.
 * 
 * Rules:
 * - academicPercent < 80 => grant denied
 * - finalScore >= 80 => eligible
 * - finalScore < 80 => risk
 * 
 * Risk levels logic (can be adjusted):
 * - >= 80: LOW (or NONE)
 * - 60-79: MEDIUM
 * - < 60: HIGH
 */
export function calculateKPI(data: KPIData, academicPercent: number): KPIResult {
  const {
    academic,
    attendance,
    assignment,
    activity,
    tutor,
    discipline,
    penalty,
    recovery,
    employmentBonus
  } = data;

  const mainKPI = academic + attendance + assignment + activity + tutor + discipline;
  const finalScore = mainKPI - penalty + recovery + employmentBonus;

  let grantStatus: GrantStatus = GrantStatus.ELIGIBLE;
  let riskLevel: RiskLevel = RiskLevel.LOW;

  // Determine Grant Status
  if (academicPercent < 80) {
    grantStatus = GrantStatus.DENIED;
  } else if (finalScore < 80) {
    grantStatus = GrantStatus.RISK;
  } else {
    grantStatus = GrantStatus.ELIGIBLE;
  }

  // Determine Risk Level based on finalScore
  if (finalScore >= 80) {
    riskLevel = RiskLevel.LOW; // Not much risk
  } else if (finalScore >= 60) {
    riskLevel = RiskLevel.MEDIUM;
  } else {
    riskLevel = RiskLevel.HIGH;
  }

  // Override risk level to HIGH if grant is denied
  if (grantStatus === GrantStatus.DENIED) {
    riskLevel = RiskLevel.HIGH;
  }

  return {
    mainKPI,
    finalScore,
    grantStatus,
    riskLevel
  };
}

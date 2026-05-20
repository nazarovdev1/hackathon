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

export type AttendanceTrendPoint = {
  month: string;
  value: number;
};

export type AcademicTrendPoint = {
  month: string;
  gpa: number;
  credits: number;
};

export type StudentDashboardSnapshot = {
  id: string;
  name: string;
  email: string;
  faculty: string;
  group: string;
  studentId: string;
  grantType: string;
  level: string;
  kpi: GrantKpiInput;
  grant: GrantCalculationResult;
  attendanceTrend: AttendanceTrendPoint[];
  academicTrend: AcademicTrendPoint[];
  penalties: { id: string; date: string; reason: string; score: number }[];
  recoveryTasks: {
    id: string;
    title: string;
    description: string | null;
    recoveryScore: number;
    status: "ASSIGNED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
    deadline: string;
    completedAt: string | null;
  }[];
  achievements: {
    id: string;
    title: string;
    score: number;
    category: string;
    status: "PENDING" | "APPROVED" | "REJECTED";
    proofUrl: string | null;
    dateAdded: string;
  }[];
  recoveryStatus: number;
};

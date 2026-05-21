import { getServerSession } from "next-auth";
import type { Prisma } from "@prisma/client";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { calculateGrantScore, toGrantKpiInput } from "@/services/grant-engine";
import type { GrantCalculationResult, StudentDashboardSnapshot, StudentStatus } from "@/types/grant";
import type { AppRole } from "@/types/auth";

const latestScoreOrder = { calculatedAt: "desc" } as const;

const studentInclude = {
  user: true,
  scoreRecords: { orderBy: latestScoreOrder },
  attendanceRecords: { orderBy: { date: "asc" } },
  penalties: { orderBy: { createdAt: "desc" } },
  achievements: { orderBy: { createdAt: "desc" } },
  recoveryTasks: { orderBy: { deadline: "asc" } },
  employments: true,
  feedbacks: {
    orderBy: { createdAt: "desc" },
    include: {
      author: {
        include: {
          mentorProfile: true,
          tutorProfile: true,
        },
      },
    },
  },
} satisfies Prisma.StudentProfileInclude;

type StudentWithDashboardData = Prisma.StudentProfileGetPayload<{ include: typeof studentInclude }>;

type AdminStudentRow = {
  id: string;
  name: string;
  email: string;
  faculty: string;
  group: string;
  status: StudentStatus;
  statusReason: string | null;
  academicPercent: number;
  grant: GrantCalculationResult;
  achievements: {
    id: string;
    title: string;
    score: number;
    status: "PENDING" | "APPROVED" | "REJECTED";
  }[];
};

function formatDate(value: Date) {
  return value.toISOString().slice(0, 10);
}

function formatMonth(value: Date) {
  return new Intl.DateTimeFormat("en", { month: "short" }).format(value);
}

function assertRole(role: AppRole | undefined, allowedRoles: AppRole[]) {
  if (!role || !allowedRoles.includes(role)) {
    throw new Error("Unauthorized");
  }
}

async function getSessionUser() {
  const session = await getServerSession(authOptions);
  return session?.user ?? null;
}

function emptyKpi() {
  return {
    academic: 0,
    attendance: 0,
    assignment: 0,
    activity: 0,
    tutor: 0,
    discipline: 0,
    penalty: 0,
    recovery: 0,
    employmentBonus: 0,
    adminBonus: 0,
    academicPercent: 0,
  };
}

function buildAttendanceTrend(records: StudentWithDashboardData["attendanceRecords"]) {
  const grouped = new Map<string, { date: Date; earned: number; total: number }>();

  for (const record of records) {
    const key = `${record.date.getFullYear()}-${record.date.getMonth()}`;
    const current = grouped.get(key) ?? { date: record.date, earned: 0, total: 0 };
    const earned = record.status === "ABSENT" ? 0 : record.status === "LATE" ? 0.5 : 1;
    grouped.set(key, { date: current.date, earned: current.earned + earned, total: current.total + 1 });
  }

  return Array.from(grouped.values())
    .slice(-5)
    .map((item) => ({
      month: formatMonth(item.date),
      value: Math.round((item.earned / Math.max(item.total, 1)) * 100),
    }));
}

function buildAcademicTrend(records: StudentWithDashboardData["scoreRecords"]) {
  return [...records]
    .reverse()
    .slice(-5)
    .map((record) => ({
      month: record.semester,
      gpa: Number(record.academicPercent),
      credits: Math.round((Number(record.academicScore) / 40) * 30),
    }));
}

function buildRecoveryStatus(tasks: StudentWithDashboardData["recoveryTasks"]) {
  if (!tasks.length) return 0;

  const statusValues: number[] = tasks.map((task) => {
    if (task.status === "COMPLETED") return 100;
    if (task.status === "IN_PROGRESS") return 68;
    if (task.status === "ASSIGNED") return 24;
    return 0;
  });

  return Math.round(statusValues.reduce((sum, value) => sum + value, 0) / statusValues.length);
}

function buildStudentSnapshot(student: StudentWithDashboardData): StudentDashboardSnapshot {
  const latestScore = student.scoreRecords[0];
  const kpi = latestScore ? toGrantKpiInput(latestScore) : emptyKpi();
  const grant = calculateGrantScore(kpi);

  return {
    id: student.id,
    name: student.user.fullName,
    email: student.user.email,
    faculty: student.faculty,
    group: student.groupName,
    studentId: student.studentId,
    grantType: student.grantType,
    level: student.level,
    status: student.status,
    statusReason: student.statusReason,
    kpi,
    grant,
    attendanceTrend: buildAttendanceTrend(student.attendanceRecords),
    academicTrend: buildAcademicTrend(student.scoreRecords),
    penalties: student.penalties.map((penalty) => ({
      id: penalty.id,
      date: formatDate(penalty.createdAt),
      reason: penalty.reason,
      score: Number(penalty.score),
    })),
    recoveryTasks: student.recoveryTasks.map((task) => ({
      id: task.id,
      title: task.title,
      description: task.description,
      recoveryScore: Number(task.recoveryScore),
      status: task.status,
      deadline: formatDate(task.deadline),
      completedAt: task.completedAt ? formatDate(task.completedAt) : null,
    })),
    achievements: student.achievements.map((achievement) => ({
      id: achievement.id,
      title: achievement.title,
      score: Number(achievement.score),
      category: achievement.type,
      status: achievement.status,
      proofUrl: achievement.proofUrl,
      dateAdded: formatDate(achievement.createdAt),
    })),
    recoveryStatus: buildRecoveryStatus(student.recoveryTasks),
  };
}

async function getStudentByAccess(studentId?: string) {
  const user = await getSessionUser();
  if (!user) throw new Error("Unauthorized");

  const where: Prisma.StudentProfileWhereInput =
    user.role === "STUDENT"
      ? { userId: user.id }
      : studentId
        ? { id: studentId }
        : {};

  return prisma.studentProfile.findFirst({
    where,
    include: studentInclude,
    orderBy: { createdAt: "asc" },
  });
}

export async function getCurrentStudentDashboard(studentId?: string) {
  const student = await getStudentByAccess(studentId);
  if (!student) return null;

  return buildStudentSnapshot(student);
}

export async function getStudentGrantSnapshot(studentId: string) {
  const student = await getStudentByAccess(studentId);
  if (!student) return null;

  const snapshot = buildStudentSnapshot(student);
  return { student: snapshot, grant: snapshot.grant };
}

function toAdminStudentRow(student: StudentWithDashboardData): AdminStudentRow {
  const latestScore = student.scoreRecords[0];
  const kpi = latestScore ? toGrantKpiInput(latestScore) : emptyKpi();

  return {
    id: student.id,
    name: student.user.fullName,
    email: student.user.email,
    faculty: student.faculty,
    group: student.groupName,
    status: student.status,
    statusReason: student.statusReason,
    academicPercent: kpi.academicPercent,
    grant: calculateGrantScore(kpi),
    achievements: student.achievements.map((achievement) => ({
      id: achievement.id,
      title: achievement.title,
      score: Number(achievement.score),
      status: achievement.status,
    })),
  };
}

export async function getAdminGrantOverview() {
  const user = await getSessionUser();
  assertRole(user?.role, ["ADMIN"]);

  const students = await prisma.studentProfile.findMany({
    include: studentInclude,
    orderBy: { createdAt: "asc" },
  });
  const rows = students.map(toAdminStudentRow);
  const leaderboard = rows
    .map((row) => ({
      id: row.id,
      name: row.name,
      faculty: row.faculty,
      score: row.grant.finalScore,
    }))
    .sort((a, b) => b.score - a.score)
    .map((student, index) => ({ ...student, position: index + 1 }));

  return {
    total: rows.length,
    eligible: rows.filter((row) => row.grant.grantStatus === "ELIGIBLE").length,
    highRisk: rows.filter((row) => row.grant.riskLevel === "HIGH").length,
    rows,
    distribution: (["ELIGIBLE", "RISK", "DENIED"] as const).map((status) => ({
      status,
      count: rows.filter((row) => row.grant.grantStatus === status).length,
    })),
    leaderboard,
  };
}

export async function getLeaderboard() {
  const students = await prisma.studentProfile.findMany({
    include: studentInclude,
    orderBy: { createdAt: "asc" },
  });

  return students
    .map(toAdminStudentRow)
    .map((row) => ({ id: row.id, name: row.name, faculty: row.faculty, score: row.grant.finalScore }))
    .sort((a, b) => b.score - a.score)
    .map((student, index) => ({ ...student, position: index + 1 }));
}

export async function getMentorStudents() {
  const user = await getSessionUser();
  assertRole(user?.role, ["MENTOR", "TUTOR", "ADMIN"]);

  const where: Prisma.StudentProfileWhereInput =
    user?.role === "ADMIN"
      ? {}
      : user?.role === "MENTOR"
        ? { mentorId: user.id }
        : { tutorId: user?.id };

  const students = await prisma.studentProfile.findMany({
    where,
    include: studentInclude,
    orderBy: { createdAt: "asc" },
  });

  return students.map((student) => {
    const snapshot = buildStudentSnapshot(student);
    return {
      student: snapshot,
      grant: snapshot.grant,
    };
  });
}

export async function getCurrentStudentFeedback() {
  const student = await getStudentByAccess();
  if (!student) return [];

  return student.feedbacks.map((item) => ({
    id: item.id,
    mentorName: item.author.fullName,
    role: item.author.mentorProfile?.specialty ?? (item.author.tutorProfile ? "Tyutor" : item.author.role),
    date: formatDate(item.createdAt),
    subject: item.subject ?? item.type,
    grade: item.grade ? Number(item.grade) : 0,
    score: item.score ? Number(item.score) : 0,
    comment: item.message,
    category: item.type,
  }));
}

export async function createFeedback(input: {
  studentId: string;
  message: string;
  type: Prisma.FeedbackCreateInput["type"];
  subject?: string;
  grade?: number;
  score?: number;
}) {
  const user = await getSessionUser();
  assertRole(user?.role, ["MENTOR", "TUTOR", "ADMIN"]);
  await assertStudentAccess(user!, input.studentId);

  const feedback = await prisma.feedback.create({
    data: {
      student: { connect: { id: input.studentId } },
      author: { connect: { id: user!.id } },
      message: input.message,
      type: input.type,
      subject: input.subject,
      grade: input.grade,
      score: input.score,
    },
  });

  return { id: feedback.id };
}

export async function createPenalty(input: {
  studentId: string;
  type: Prisma.PenaltyCreateInput["type"];
  reason: string;
  score: number;
}) {
  const user = await getSessionUser();
  assertRole(user?.role, ["MENTOR", "TUTOR", "ADMIN"]);
  await assertStudentAccess(user!, input.studentId);

  const score = normalizeScore(input.score, 1, 20, "Jarima balli 1 va 20 oralig'ida bo'lishi kerak.");
  const currentPenalty = await getLatestScoreValue(input.studentId, "penaltyScore");
  if (currentPenalty + score > 20) {
    throw new Error("Bir semestrdagi jami jarima -20 balldan oshmasligi kerak.");
  }

  const penalty = await prisma.$transaction(async (tx) => {
    const created = await tx.penalty.create({
      data: {
        student: { connect: { id: input.studentId } },
        createdBy: { connect: { id: user!.id } },
        type: input.type,
        reason: input.reason,
        score,
      },
    });

    await bumpLatestScore(tx, input.studentId, { penaltyScore: currentPenalty + score });
    return created;
  });

  return { id: penalty.id };
}

export async function assignRecoveryTask(input: {
  studentId: string;
  title: string;
  description?: string;
  recoveryScore: number;
  deadline: Date;
}) {
  const user = await getSessionUser();
  assertRole(user?.role, ["MENTOR", "TUTOR", "ADMIN"]);
  await assertStudentAccess(user!, input.studentId);

  const recoveryScore = normalizeScore(
    input.recoveryScore,
    1,
    10,
    "Recovery balli 1 va 10 oralig'ida bo'lishi kerak.",
  );
  const penaltyScore = await getLatestScoreValue(input.studentId, "penaltyScore");
  const currentRecovery = await getLatestScoreValue(input.studentId, "recoveryScore");
  const allowedRecovery = Math.min(10, penaltyScore * 0.5);

  if (currentRecovery + recoveryScore > allowedRecovery) {
    throw new Error(`Recovery jami ${allowedRecovery} balldan oshmasligi kerak (jarimaning 50%).`);
  }

  const task = await prisma.$transaction(async (tx) => {
    const created = await tx.recoveryTask.create({
      data: {
        student: { connect: { id: input.studentId } },
        assignedBy: { connect: { id: user!.id } },
        title: input.title,
        description: input.description,
        recoveryScore,
        deadline: input.deadline,
      },
    });

    await bumpLatestScore(tx, input.studentId, { recoveryScore: currentRecovery + recoveryScore });
    return created;
  });

  return { id: task.id };
}

export async function uploadAchievement(input: {
  studentId?: string;
  type: Prisma.AchievementCreateInput["type"];
  title: string;
  description?: string;
  proofUrl?: string;
}) {
  const user = await getSessionUser();
  if (!user) throw new Error("Unauthorized");

  const studentId = user.role === "STUDENT" ? user.studentProfileId : input.studentId;
  if (!studentId) throw new Error("Student profile not found");

  return prisma.achievement.create({
    data: {
      student: { connect: { id: studentId } },
      type: input.type,
      title: input.title,
      description: input.description,
      proofUrl: input.proofUrl,
      score: 0,
      status: "PENDING",
    },
  });
}

export async function completeRecoveryTask(input: { taskId: string }) {
  const user = await getSessionUser();
  assertRole(user?.role, ["MENTOR", "TUTOR", "ADMIN"]);

  const task = await prisma.recoveryTask.findUnique({
    where: { id: input.taskId },
    select: { id: true, studentId: true },
  });
  if (!task) throw new Error("Recovery vazifasi topilmadi.");

  await assertStudentAccess(user!, task.studentId);

  const updated = await prisma.recoveryTask.update({
    where: { id: input.taskId },
    data: { status: "COMPLETED", completedAt: new Date() },
  });

  return { id: updated.id };
}

export async function approveAchievement(input: {
  achievementId: string;
  score: number;
  status?: "APPROVED" | "REJECTED";
}) {
  const user = await getSessionUser();
  assertRole(user?.role, ["TUTOR", "ADMIN"]);

  return prisma.achievement.update({
    where: { id: input.achievementId },
    data: {
      approvedById: user!.id,
      score: input.score,
      status: input.status ?? "APPROVED",
    },
  });
}

export async function createGrantDecision(input: {
  studentId: string;
  semester: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  finalScore: number;
  reason?: string;
}) {
  const user = await getSessionUser();
  assertRole(user?.role, ["ADMIN"]);

  return prisma.grantDecision.create({
    data: {
      student: { connect: { id: input.studentId } },
      approvedBy: { connect: { id: user!.id } },
      semester: input.semester,
      status: input.status,
      finalScore: input.finalScore,
      reason: input.reason,
    },
  });
}

export async function awardAdminBonus(input: {
  studentId: string;
  score: number;
  reason: string;
}) {
  const user = await getSessionUser();
  assertRole(user?.role, ["ADMIN"]);

  const score = normalizeScore(input.score, 0.5, 20, "Bonus balli 0.5 va 20 oralig'ida bo'lishi kerak.");
  const reason = input.reason.trim();
  if (!reason) throw new Error("Bonus sababi kiritilishi kerak.");

  const currentBonus = await getLatestScoreValue(input.studentId, "adminBonusScore");

  const adjustment = await prisma.$transaction(async (tx) => {
    const created = await tx.adminScoreAdjustment.create({
      data: {
        student: { connect: { id: input.studentId } },
        admin: { connect: { id: user!.id } },
        score,
        reason,
      },
    });

    await bumpLatestScore(tx, input.studentId, { adminBonusScore: currentBonus + score });
    return created;
  });

  return { id: adjustment.id };
}

export async function expelStudent(input: {
  studentId: string;
  reason: string;
}) {
  const user = await getSessionUser();
  assertRole(user?.role, ["ADMIN"]);

  const reason = input.reason.trim();
  if (!reason) throw new Error("Chetlashtirish sababi kiritilishi kerak.");

  const student = await prisma.studentProfile.findUnique({
    where: { id: input.studentId },
    select: { id: true, userId: true, status: true },
  });
  if (!student) throw new Error("Talaba topilmadi.");
  if (student.status === "EXPELLED") throw new Error("Talaba allaqachon chetlashtirilgan.");

  await prisma.$transaction([
    prisma.studentProfile.update({
      where: { id: input.studentId },
      data: {
        status: "EXPELLED",
        statusReason: reason,
        statusChangedAt: new Date(),
        statusChangedById: user!.id,
      },
    }),
    prisma.user.update({
      where: { id: student.userId },
      data: { isActive: false },
    }),
  ]);

  return { id: student.id };
}

type MutableScoreField = "penaltyScore" | "recoveryScore" | "adminBonusScore";

function normalizeScore(value: number, min: number, max: number, message: string) {
  if (!Number.isFinite(value) || value < min || value > max) {
    throw new Error(message);
  }

  return Number(value.toFixed(2));
}

async function assertStudentAccess(user: { id: string; role: AppRole }, studentId: string) {
  const where: Prisma.StudentProfileWhereInput =
    user.role === "ADMIN"
      ? { id: studentId }
      : user.role === "MENTOR"
        ? { id: studentId, mentorId: user.id }
        : user.role === "TUTOR"
          ? { id: studentId, tutorId: user.id }
          : { id: studentId, userId: user.id };

  const student = await prisma.studentProfile.findFirst({
    where,
    select: { id: true },
  });

  if (!student) throw new Error("Bu talaba bo'yicha amal bajarishga ruxsat yo'q.");
}

async function getLatestScoreValue(studentId: string, field: MutableScoreField) {
  const record = await prisma.scoreRecord.findFirst({
    where: { studentId },
    orderBy: latestScoreOrder,
    select: { [field]: true },
  });

  return record ? Number(record[field]) : 0;
}

async function bumpLatestScore(
  tx: Prisma.TransactionClient,
  studentId: string,
  data: Partial<Record<MutableScoreField, number>>,
) {
  const record = await tx.scoreRecord.findFirst({
    where: { studentId },
    orderBy: latestScoreOrder,
  });
  if (!record) return;

  const next = {
    academic: Number(record.academicScore),
    attendance: Number(record.attendanceScore),
    assignment: Number(record.assignmentScore),
    activity: Number(record.activityScore),
    tutor: Number(record.tutorScore),
    discipline: Number(record.disciplineScore),
    penalty: data.penaltyScore ?? Number(record.penaltyScore),
    recovery: data.recoveryScore ?? Number(record.recoveryScore),
    employmentBonus: Number(record.employmentBonus),
    adminBonus: data.adminBonusScore ?? Number(record.adminBonusScore),
    academicPercent: Number(record.academicPercent),
  };
  const grant = calculateGrantScore(next);

  await tx.scoreRecord.update({
    where: { id: record.id },
    data: {
      ...data,
      mainKpi: grant.mainKpi,
      finalScore: grant.finalScore,
      grantStatus: grant.grantStatus,
      riskLevel: grant.riskLevel,
    },
  });
}

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('STUDENT', 'MENTOR', 'TUTOR', 'ADMIN');

-- CreateEnum
CREATE TYPE "GrantStatus" AS ENUM ('ELIGIBLE', 'RISK', 'DENIED');

-- CreateEnum
CREATE TYPE "DecisionStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "RiskLevel" AS ENUM ('LOW', 'MEDIUM', 'HIGH');

-- CreateEnum
CREATE TYPE "AttendanceStatus" AS ENUM ('PRESENT', 'ABSENT', 'LATE', 'EXCUSED');

-- CreateEnum
CREATE TYPE "AssignmentStatus" AS ENUM ('PENDING', 'SUBMITTED', 'LATE', 'MISSED');

-- CreateEnum
CREATE TYPE "AchievementType" AS ENUM ('ACADEMIC', 'INNOVATION', 'LANGUAGE', 'SOCIAL', 'SPORT', 'LEADERSHIP', 'RESEARCH', 'COMPETITION', 'VOLUNTEERING');

-- CreateEnum
CREATE TYPE "RecordStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "PenaltyType" AS ENUM ('ATTENDANCE', 'ASSIGNMENT', 'DISCIPLINE', 'ACADEMIC', 'OTHER');

-- CreateEnum
CREATE TYPE "RecoveryStatus" AS ENUM ('ASSIGNED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "EmploymentType" AS ENUM ('INTERNSHIP', 'PART_TIME', 'FULL_TIME', 'RESEARCH_ASSISTANT');

-- CreateEnum
CREATE TYPE "EmploymentStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'ACTIVE', 'COMPLETED');

-- CreateEnum
CREATE TYPE "FeedbackType" AS ENUM ('ASSIGNMENT', 'ACTIVITY', 'TUTOR', 'DISCIPLINE', 'GENERAL');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "passwordHash" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'STUDENT',
    "avatarUrl" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StudentProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "mentorId" TEXT,
    "tutorId" TEXT,
    "studentId" TEXT NOT NULL,
    "groupName" TEXT NOT NULL,
    "faculty" TEXT NOT NULL,
    "level" TEXT NOT NULL,
    "grantType" TEXT NOT NULL,
    "currentGpaPercent" DECIMAL(5,2) NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StudentProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MentorProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "department" TEXT NOT NULL,
    "specialty" TEXT NOT NULL,

    CONSTRAINT "MentorProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TutorProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "assignedGroup" TEXT NOT NULL,

    CONSTRAINT "TutorProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ScoreRecord" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "semester" TEXT NOT NULL,
    "academicPercent" DECIMAL(5,2) NOT NULL,
    "academicScore" DECIMAL(5,2) NOT NULL,
    "attendanceScore" DECIMAL(5,2) NOT NULL,
    "assignmentScore" DECIMAL(5,2) NOT NULL,
    "activityScore" DECIMAL(5,2) NOT NULL,
    "tutorScore" DECIMAL(5,2) NOT NULL,
    "disciplineScore" DECIMAL(5,2) NOT NULL,
    "mainKpi" DECIMAL(5,2) NOT NULL,
    "penaltyScore" DECIMAL(5,2) NOT NULL,
    "recoveryScore" DECIMAL(5,2) NOT NULL,
    "employmentBonus" DECIMAL(5,2) NOT NULL,
    "finalScore" DECIMAL(5,2) NOT NULL,
    "riskLevel" "RiskLevel" NOT NULL,
    "grantStatus" "GrantStatus" NOT NULL,
    "calculatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ScoreRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AttendanceRecord" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "status" "AttendanceStatus" NOT NULL,
    "subject" TEXT,
    "note" TEXT,

    CONSTRAINT "AttendanceRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AssignmentRecord" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "score" DECIMAL(5,2) NOT NULL,
    "status" "AssignmentStatus" NOT NULL DEFAULT 'PENDING',
    "submittedOnTime" BOOLEAN NOT NULL DEFAULT false,
    "isOriginal" BOOLEAN NOT NULL DEFAULT true,
    "qualityNote" TEXT,
    "deadline" TIMESTAMP(3) NOT NULL,
    "submittedAt" TIMESTAMP(3),

    CONSTRAINT "AssignmentRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Achievement" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "approvedById" TEXT,
    "type" "AchievementType" NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "score" DECIMAL(5,2) NOT NULL,
    "status" "RecordStatus" NOT NULL DEFAULT 'PENDING',
    "proofUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Achievement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Penalty" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "createdById" TEXT NOT NULL,
    "type" "PenaltyType" NOT NULL,
    "reason" TEXT NOT NULL,
    "score" DECIMAL(5,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Penalty_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RecoveryTask" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "assignedById" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "recoveryScore" DECIMAL(5,2) NOT NULL,
    "status" "RecoveryStatus" NOT NULL DEFAULT 'ASSIGNED',
    "deadline" TIMESTAMP(3) NOT NULL,
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "RecoveryTask_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Employment" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "type" "EmploymentType" NOT NULL,
    "companyName" TEXT NOT NULL,
    "position" TEXT NOT NULL,
    "bonusScore" DECIMAL(5,2) NOT NULL,
    "proofUrl" TEXT,
    "status" "EmploymentStatus" NOT NULL DEFAULT 'PENDING',

    CONSTRAINT "Employment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Feedback" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "type" "FeedbackType" NOT NULL,
    "subject" TEXT,
    "grade" DECIMAL(3,1),
    "score" DECIMAL(5,2),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Feedback_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GrantDecision" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "approvedById" TEXT NOT NULL,
    "semester" TEXT NOT NULL,
    "status" "DecisionStatus" NOT NULL,
    "finalScore" DECIMAL(5,2) NOT NULL,
    "reason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GrantDecision_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_role_isActive_idx" ON "User"("role", "isActive");

-- CreateIndex
CREATE UNIQUE INDEX "StudentProfile_userId_key" ON "StudentProfile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "StudentProfile_studentId_key" ON "StudentProfile"("studentId");

-- CreateIndex
CREATE INDEX "StudentProfile_faculty_groupName_idx" ON "StudentProfile"("faculty", "groupName");

-- CreateIndex
CREATE INDEX "StudentProfile_mentorId_idx" ON "StudentProfile"("mentorId");

-- CreateIndex
CREATE INDEX "StudentProfile_tutorId_idx" ON "StudentProfile"("tutorId");

-- CreateIndex
CREATE UNIQUE INDEX "MentorProfile_userId_key" ON "MentorProfile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "TutorProfile_userId_key" ON "TutorProfile"("userId");

-- CreateIndex
CREATE INDEX "ScoreRecord_grantStatus_riskLevel_idx" ON "ScoreRecord"("grantStatus", "riskLevel");

-- CreateIndex
CREATE INDEX "ScoreRecord_finalScore_idx" ON "ScoreRecord"("finalScore");

-- CreateIndex
CREATE UNIQUE INDEX "ScoreRecord_studentId_semester_key" ON "ScoreRecord"("studentId", "semester");

-- CreateIndex
CREATE INDEX "AttendanceRecord_studentId_date_idx" ON "AttendanceRecord"("studentId", "date");

-- CreateIndex
CREATE INDEX "AttendanceRecord_status_idx" ON "AttendanceRecord"("status");

-- CreateIndex
CREATE INDEX "AssignmentRecord_studentId_status_idx" ON "AssignmentRecord"("studentId", "status");

-- CreateIndex
CREATE INDEX "AssignmentRecord_deadline_idx" ON "AssignmentRecord"("deadline");

-- CreateIndex
CREATE INDEX "Achievement_studentId_status_idx" ON "Achievement"("studentId", "status");

-- CreateIndex
CREATE INDEX "Achievement_approvedById_idx" ON "Achievement"("approvedById");

-- CreateIndex
CREATE INDEX "Penalty_studentId_createdAt_idx" ON "Penalty"("studentId", "createdAt");

-- CreateIndex
CREATE INDEX "Penalty_createdById_idx" ON "Penalty"("createdById");

-- CreateIndex
CREATE INDEX "RecoveryTask_studentId_status_idx" ON "RecoveryTask"("studentId", "status");

-- CreateIndex
CREATE INDEX "RecoveryTask_assignedById_idx" ON "RecoveryTask"("assignedById");

-- CreateIndex
CREATE INDEX "RecoveryTask_deadline_idx" ON "RecoveryTask"("deadline");

-- CreateIndex
CREATE INDEX "Employment_studentId_status_idx" ON "Employment"("studentId", "status");

-- CreateIndex
CREATE INDEX "Employment_type_idx" ON "Employment"("type");

-- CreateIndex
CREATE INDEX "Feedback_studentId_authorId_idx" ON "Feedback"("studentId", "authorId");

-- CreateIndex
CREATE INDEX "Feedback_type_idx" ON "Feedback"("type");

-- CreateIndex
CREATE INDEX "GrantDecision_studentId_semester_idx" ON "GrantDecision"("studentId", "semester");

-- CreateIndex
CREATE INDEX "GrantDecision_approvedById_idx" ON "GrantDecision"("approvedById");

-- CreateIndex
CREATE INDEX "GrantDecision_status_idx" ON "GrantDecision"("status");

-- AddForeignKey
ALTER TABLE "StudentProfile" ADD CONSTRAINT "StudentProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentProfile" ADD CONSTRAINT "StudentProfile_mentorId_fkey" FOREIGN KEY ("mentorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentProfile" ADD CONSTRAINT "StudentProfile_tutorId_fkey" FOREIGN KEY ("tutorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MentorProfile" ADD CONSTRAINT "MentorProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TutorProfile" ADD CONSTRAINT "TutorProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScoreRecord" ADD CONSTRAINT "ScoreRecord_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "StudentProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AttendanceRecord" ADD CONSTRAINT "AttendanceRecord_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "StudentProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssignmentRecord" ADD CONSTRAINT "AssignmentRecord_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "StudentProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Achievement" ADD CONSTRAINT "Achievement_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "StudentProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Achievement" ADD CONSTRAINT "Achievement_approvedById_fkey" FOREIGN KEY ("approvedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Penalty" ADD CONSTRAINT "Penalty_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "StudentProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Penalty" ADD CONSTRAINT "Penalty_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecoveryTask" ADD CONSTRAINT "RecoveryTask_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "StudentProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecoveryTask" ADD CONSTRAINT "RecoveryTask_assignedById_fkey" FOREIGN KEY ("assignedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Employment" ADD CONSTRAINT "Employment_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "StudentProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Feedback" ADD CONSTRAINT "Feedback_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "StudentProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Feedback" ADD CONSTRAINT "Feedback_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GrantDecision" ADD CONSTRAINT "GrantDecision_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "StudentProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GrantDecision" ADD CONSTRAINT "GrantDecision_approvedById_fkey" FOREIGN KEY ("approvedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

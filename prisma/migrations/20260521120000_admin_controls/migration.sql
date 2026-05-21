-- CreateEnum
CREATE TYPE "StudentStatus" AS ENUM ('ACTIVE', 'SUSPENDED', 'EXPELLED');

-- AlterTable
ALTER TABLE "StudentProfile"
ADD COLUMN "status" "StudentStatus" NOT NULL DEFAULT 'ACTIVE',
ADD COLUMN "statusReason" TEXT,
ADD COLUMN "statusChangedAt" TIMESTAMP(3),
ADD COLUMN "statusChangedById" TEXT;

-- AlterTable
ALTER TABLE "ScoreRecord"
ADD COLUMN "adminBonusScore" DECIMAL(5,2) NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "AdminScoreAdjustment" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "adminId" TEXT NOT NULL,
    "score" DECIMAL(5,2) NOT NULL,
    "reason" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AdminScoreAdjustment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "StudentProfile_status_idx" ON "StudentProfile"("status");

-- CreateIndex
CREATE INDEX "AdminScoreAdjustment_studentId_createdAt_idx" ON "AdminScoreAdjustment"("studentId", "createdAt");

-- CreateIndex
CREATE INDEX "AdminScoreAdjustment_adminId_idx" ON "AdminScoreAdjustment"("adminId");

-- AddForeignKey
ALTER TABLE "StudentProfile" ADD CONSTRAINT "StudentProfile_statusChangedById_fkey" FOREIGN KEY ("statusChangedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdminScoreAdjustment" ADD CONSTRAINT "AdminScoreAdjustment_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "StudentProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdminScoreAdjustment" ADD CONSTRAINT "AdminScoreAdjustment_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

require("dotenv/config");
const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");
const bcrypt = require("bcryptjs");

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is required to seed the database.");
}

function withRequiredSslMode(connectionString) {
  const url = new URL(connectionString);

  if (!url.searchParams.has("sslmode")) {
    url.searchParams.set("sslmode", "require");
  }

  return url.toString();
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: withRequiredSslMode(process.env.DATABASE_URL) }),
});

const semester = "2026 Spring";

async function createUser({ id, fullName, email, password, role, phone }) {
  return prisma.user.create({
    data: {
      id,
      fullName,
      email,
      phone,
      role,
      passwordHash: await bcrypt.hash(password, 10),
    },
  });
}

function resolveRiskLevel(finalScore, academicPercent) {
  if (academicPercent < 80 || finalScore < 65) return "HIGH";
  if (finalScore < 80) return "MEDIUM";
  return "LOW";
}

function resolveGrantStatus(finalScore, academicPercent) {
  if (academicPercent < 80) return "DENIED";
  return finalScore >= 80 ? "ELIGIBLE" : "RISK";
}

function scoreRecord(studentId, kpi) {
  const mainKpi =
    kpi.academicScore +
    kpi.attendanceScore +
    kpi.assignmentScore +
    kpi.activityScore +
    kpi.tutorScore +
    kpi.disciplineScore;
  const adminBonusScore = kpi.adminBonusScore ?? 0;
  const finalScore = mainKpi - kpi.penaltyScore + kpi.recoveryScore + kpi.employmentBonus + adminBonusScore;

  return {
    studentId,
    semester,
    ...kpi,
    adminBonusScore,
    mainKpi,
    finalScore,
    riskLevel: resolveRiskLevel(finalScore, kpi.academicPercent),
    grantStatus: resolveGrantStatus(finalScore, kpi.academicPercent),
  };
}

async function clearSeedData() {
  const seedStudentProfileIds = ["sp_001", "sp_002", "sp_003"];
  const seedUserIds = ["admin_1", "mentor_1", "tutor_1", "student_1", "student_2", "student_3"];

  await prisma.grantDecision.deleteMany({ where: { OR: [{ studentId: { in: seedStudentProfileIds } }, { approvedById: { in: seedUserIds } }] } });
  await prisma.feedback.deleteMany({ where: { OR: [{ studentId: { in: seedStudentProfileIds } }, { authorId: { in: seedUserIds } }] } });
  await prisma.employment.deleteMany({ where: { studentId: { in: seedStudentProfileIds } } });
  await prisma.recoveryTask.deleteMany({ where: { OR: [{ studentId: { in: seedStudentProfileIds } }, { assignedById: { in: seedUserIds } }] } });
  await prisma.penalty.deleteMany({ where: { OR: [{ studentId: { in: seedStudentProfileIds } }, { createdById: { in: seedUserIds } }] } });
  await prisma.achievement.deleteMany({ where: { OR: [{ studentId: { in: seedStudentProfileIds } }, { approvedById: { in: seedUserIds } }] } });
  await prisma.assignmentRecord.deleteMany({ where: { studentId: { in: seedStudentProfileIds } } });
  await prisma.attendanceRecord.deleteMany({ where: { studentId: { in: seedStudentProfileIds } } });
  await prisma.scoreRecord.deleteMany({ where: { studentId: { in: seedStudentProfileIds } } });
  await prisma.tutorProfile.deleteMany({ where: { userId: { in: seedUserIds } } });
  await prisma.mentorProfile.deleteMany({ where: { userId: { in: seedUserIds } } });
  await prisma.studentProfile.deleteMany({ where: { OR: [{ id: { in: seedStudentProfileIds } }, { userId: { in: seedUserIds } }] } });
  await prisma.user.deleteMany({ where: { id: { in: seedUserIds } } });
}

async function main() {
  await clearSeedData();

  const admin = await createUser({
    id: "admin_1",
    fullName: "PDP Admin",
    email: "admin@pdp.uz",
    password: "admin123",
    role: "ADMIN",
    phone: "+998900000001",
  });
  const mentor = await createUser({
    id: "mentor_1",
    fullName: "Rustam Qodirov",
    email: "mentor@pdp.uz",
    password: "mentor123",
    role: "MENTOR",
    phone: "+998900000002",
  });
  const tutor = await createUser({
    id: "tutor_1",
    fullName: "Dilfuza Alimova",
    email: "tutor@pdp.uz",
    password: "tutor123",
    role: "TUTOR",
    phone: "+998900000003",
  });

  await prisma.mentorProfile.create({
    data: { id: "mp_1", userId: mentor.id, department: "Engineering", specialty: "Backend Spring Boot" },
  });
  await prisma.tutorProfile.create({
    data: { id: "tp_1", userId: tutor.id, assignedGroup: "CS-21A" },
  });

  const studentUsers = await Promise.all([
    createUser({
      id: "student_1",
      fullName: "Madina Karimova",
      email: "student@pdp.uz",
      password: "student123",
      role: "STUDENT",
      phone: "+998901111111",
    }),
    createUser({
      id: "student_2",
      fullName: "Azizbek Rahmonov",
      email: "azizbek.r@edumetric.uz",
      password: "student123",
      role: "STUDENT",
      phone: "+998902222222",
    }),
    createUser({
      id: "student_3",
      fullName: "Sevara Olimova",
      email: "sevara.o@edumetric.uz",
      password: "student123",
      role: "STUDENT",
      phone: "+998903333333",
    }),
  ]);

  const profiles = await Promise.all([
    prisma.studentProfile.create({
      data: {
        id: "sp_001",
        userId: studentUsers[0].id,
        mentorId: mentor.id,
        tutorId: tutor.id,
        studentId: "STU-001",
        faculty: "Computer Science",
        groupName: "CS-21A",
        level: "3-kurs",
        grantType: "FULL",
        currentGpaPercent: 91,
      },
    }),
    prisma.studentProfile.create({
      data: {
        id: "sp_002",
        userId: studentUsers[1].id,
        mentorId: mentor.id,
        tutorId: tutor.id,
        studentId: "STU-002",
        faculty: "Economics",
        groupName: "EC-20B",
        level: "4-kurs",
        grantType: "FULL",
        currentGpaPercent: 78,
      },
    }),
    prisma.studentProfile.create({
      data: {
        id: "sp_003",
        userId: studentUsers[2].id,
        mentorId: mentor.id,
        tutorId: tutor.id,
        studentId: "STU-003",
        faculty: "Data Science",
        groupName: "DS-22C",
        level: "2-kurs",
        grantType: "FULL",
        currentGpaPercent: 96,
      },
    }),
  ]);

  await prisma.scoreRecord.createMany({
    data: [
      scoreRecord(profiles[0].id, {
        academicPercent: 91,
        academicScore: 34,
        attendanceScore: 17,
        assignmentScore: 15,
        activityScore: 9,
        tutorScore: 4,
        disciplineScore: 8,
        penaltyScore: 3,
        recoveryScore: 4,
        employmentBonus: 2,
      }),
      scoreRecord(profiles[1].id, {
        academicPercent: 78,
        academicScore: 28,
        attendanceScore: 11,
        assignmentScore: 10,
        activityScore: 7,
        tutorScore: 3,
        disciplineScore: 7,
        penaltyScore: 8,
        recoveryScore: 2,
        employmentBonus: 0,
      }),
      scoreRecord(profiles[2].id, {
        academicPercent: 96,
        academicScore: 36,
        attendanceScore: 18,
        assignmentScore: 14,
        activityScore: 10,
        tutorScore: 5,
        disciplineScore: 9,
        penaltyScore: 0,
        recoveryScore: 1,
        employmentBonus: 3,
      }),
    ],
  });

  await prisma.attendanceRecord.createMany({
    data: [
      { studentId: profiles[0].id, date: new Date("2026-01-10"), status: "PRESENT", subject: "Backend" },
      { studentId: profiles[0].id, date: new Date("2026-02-10"), status: "PRESENT", subject: "Backend" },
      { studentId: profiles[0].id, date: new Date("2026-03-10"), status: "LATE", subject: "Database" },
      { studentId: profiles[0].id, date: new Date("2026-04-10"), status: "PRESENT", subject: "Database" },
      { studentId: profiles[0].id, date: new Date("2026-05-10"), status: "PRESENT", subject: "DevOps" },
      { studentId: profiles[1].id, date: new Date("2026-01-10"), status: "PRESENT", subject: "Economics" },
      { studentId: profiles[1].id, date: new Date("2026-02-10"), status: "LATE", subject: "Economics" },
      { studentId: profiles[1].id, date: new Date("2026-03-10"), status: "ABSENT", subject: "Finance" },
      { studentId: profiles[1].id, date: new Date("2026-04-10"), status: "ABSENT", subject: "Finance" },
      { studentId: profiles[1].id, date: new Date("2026-05-10"), status: "LATE", subject: "Analytics" },
      { studentId: profiles[2].id, date: new Date("2026-01-10"), status: "PRESENT", subject: "Data Mining" },
      { studentId: profiles[2].id, date: new Date("2026-02-10"), status: "PRESENT", subject: "ML" },
      { studentId: profiles[2].id, date: new Date("2026-03-10"), status: "PRESENT", subject: "ML" },
      { studentId: profiles[2].id, date: new Date("2026-04-10"), status: "PRESENT", subject: "Statistics" },
      { studentId: profiles[2].id, date: new Date("2026-05-10"), status: "PRESENT", subject: "Statistics" },
    ],
  });

  await prisma.assignmentRecord.createMany({
    data: [
      {
        studentId: profiles[0].id,
        subject: "Backend Spring Boot",
        title: "Database loyihasi",
        score: 15,
        status: "SUBMITTED",
        submittedOnTime: true,
        isOriginal: true,
        qualityNote: "Clean architecture va transaction management yaxshi.",
        deadline: new Date("2026-05-14"),
        submittedAt: new Date("2026-05-13"),
      },
      {
        studentId: profiles[1].id,
        subject: "Spring Core",
        title: "MVC loyiha",
        score: 10,
        status: "LATE",
        submittedOnTime: false,
        isOriginal: true,
        qualityNote: "Kod takrorlanishi ko'p.",
        deadline: new Date("2026-05-10"),
        submittedAt: new Date("2026-05-15"),
      },
      {
        studentId: profiles[2].id,
        subject: "Next.js",
        title: "Analytics dashboard",
        score: 14,
        status: "SUBMITTED",
        submittedOnTime: true,
        isOriginal: true,
        qualityNote: "Responsive dizayn va state management yaxshi.",
        deadline: new Date("2026-05-18"),
        submittedAt: new Date("2026-05-17"),
      },
    ],
  });

  await prisma.achievement.createMany({
    data: [
      {
        studentId: profiles[0].id,
        approvedById: admin.id,
        type: "INNOVATION",
        title: "AI Hackathon finalist",
        description: "Universitet hackathon final bosqichi.",
        score: 5,
        status: "APPROVED",
        proofUrl: "/uploads/ai-hackathon.pdf",
      },
      {
        studentId: profiles[0].id,
        approvedById: admin.id,
        type: "RESEARCH",
        title: "Research assistant",
        description: "Ilmiy loyiha yordamchisi.",
        score: 4,
        status: "APPROVED",
        proofUrl: "/uploads/research-assistant.pdf",
      },
      {
        studentId: profiles[1].id,
        approvedById: tutor.id,
        type: "SOCIAL",
        title: "Case study speaker",
        description: "Talabalar seminarida chiqish.",
        score: 2,
        status: "APPROVED",
      },
      {
        studentId: profiles[2].id,
        approvedById: admin.id,
        type: "ACADEMIC",
        title: "Dean list",
        description: "Akademik yuqori natija.",
        score: 5,
        status: "APPROVED",
      },
      {
        studentId: profiles[2].id,
        approvedById: admin.id,
        type: "LEADERSHIP",
        title: "Open data project lead",
        description: "Ochiq data loyihasi yetakchisi.",
        score: 5,
        status: "APPROVED",
      },
    ],
  });

  await prisma.penalty.createMany({
    data: [
      { studentId: profiles[0].id, createdById: mentor.id, type: "ASSIGNMENT", reason: "Late lab submission", score: 3, createdAt: new Date("2026-04-11") },
      { studentId: profiles[1].id, createdById: mentor.id, type: "ATTENDANCE", reason: "Attendance violation", score: 5, createdAt: new Date("2026-03-20") },
      { studentId: profiles[1].id, createdById: mentor.id, type: "ASSIGNMENT", reason: "Missed assignment", score: 3, createdAt: new Date("2026-04-28") },
    ],
  });

  await prisma.recoveryTask.createMany({
    data: [
      { studentId: profiles[0].id, assignedById: mentor.id, title: "Lab qayta topshirish", description: "Kechikkan labni himoya qilish.", recoveryScore: 4, status: "IN_PROGRESS", deadline: new Date("2026-05-30") },
      { studentId: profiles[1].id, assignedById: mentor.id, title: "Davomat tiklash rejasi", description: "Qo'shimcha mashg'ulot va mentor sessiyalari.", recoveryScore: 2, status: "ASSIGNED", deadline: new Date("2026-06-05") },
      { studentId: profiles[2].id, assignedById: tutor.id, title: "Peer review", description: "Guruhdoshlarga loyiha review qilish.", recoveryScore: 1, status: "COMPLETED", deadline: new Date("2026-05-22"), completedAt: new Date("2026-05-20") },
    ],
  });

  await prisma.employment.createMany({
    data: [
      { studentId: profiles[0].id, type: "RESEARCH_ASSISTANT", companyName: "PDP Research Lab", position: "Assistant", bonusScore: 2, proofUrl: "/uploads/research-work.pdf", status: "APPROVED" },
      { studentId: profiles[2].id, type: "INTERNSHIP", companyName: "DataCraft", position: "Data intern", bonusScore: 3, proofUrl: "/uploads/datacraft.pdf", status: "APPROVED" },
    ],
  });

  await prisma.feedback.createMany({
    data: [
      {
        studentId: profiles[0].id,
        authorId: mentor.id,
        type: "ASSIGNMENT",
        subject: "Backend Spring Boot & Database Loyihasi",
        grade: 5,
        score: 15,
        message: "Loyiha arxitekturasi juda yaxshi tuzilgan. JPA relation-lardan to'g'ri foydalanilgan.",
        createdAt: new Date("2026-05-18"),
      },
      {
        studentId: profiles[0].id,
        authorId: tutor.id,
        type: "TUTOR",
        subject: "Faollik va jamoaviy ish",
        grade: 4.8,
        score: 4,
        message: "Darslarda faol va guruh sardori sifatida boshqalarni rag'batlantiradi.",
        createdAt: new Date("2026-05-12"),
      },
      {
        studentId: profiles[1].id,
        authorId: mentor.id,
        type: "ASSIGNMENT",
        subject: "Spring Core & MVC",
        grade: 3.5,
        score: 10,
        message: "Loyiha o'z vaqtida topshirilmadi. Dependency Injection mavzularini qayta ko'rish kerak.",
        createdAt: new Date("2026-05-15"),
      },
      {
        studentId: profiles[2].id,
        authorId: mentor.id,
        type: "ASSIGNMENT",
        subject: "Next.js & State Management Project",
        grade: 5,
        score: 14,
        message: "Komponentlar yaxshi bo'lingan va responsive dizayn to'liq ta'minlangan.",
        createdAt: new Date("2026-05-19"),
      },
    ],
  });

  await prisma.grantDecision.createMany({
    data: [
      { studentId: profiles[0].id, approvedById: admin.id, semester, status: "APPROVED", finalScore: 90, reason: "Grant talablari bajarilgan." },
      { studentId: profiles[1].id, approvedById: admin.id, semester, status: "REJECTED", finalScore: 60, reason: "Academic percent 80% dan past." },
      { studentId: profiles[2].id, approvedById: admin.id, semester, status: "APPROVED", finalScore: 96, reason: "Yuqori akademik va faollik natijalari." },
    ],
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });

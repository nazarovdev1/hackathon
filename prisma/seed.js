require('dotenv/config')
const { PrismaClient } = require('@prisma/client')
const { PrismaPg } = require('@prisma/adapter-pg')
const bcrypt = require('bcryptjs')

if (!process.env.DATABASE_URL) {
	throw new Error('DATABASE_URL is required to seed the database.')
}

function withRequiredSslMode(connectionString) {
	const url = new URL(connectionString)
	if (!url.searchParams.has('sslmode')) {
		url.searchParams.set('sslmode', 'require')
	}
	return url.toString()
}

const prisma = new PrismaClient({
	adapter: new PrismaPg({
		connectionString: withRequiredSslMode(process.env.DATABASE_URL),
	}),
})

const semester = '2026 Spring'

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
	})
}

function resolveRiskLevel(finalScore, academicPercent) {
	if (academicPercent < 80 || finalScore < 65) return 'HIGH'
	if (finalScore < 80) return 'MEDIUM'
	return 'LOW'
}

function resolveGrantStatus(finalScore, academicPercent) {
	if (academicPercent < 80) return 'DENIED'
	return finalScore >= 80 ? 'ELIGIBLE' : 'RISK'
}

function scoreRecord(studentId, kpi) {
	// Formuladan to'g'ri hisoblash:
	// Akademik ball = (acPct × 40) / 100
	// Davomat ball  = (attPct × 20) / 100
	const academicScore =
		Math.round(((kpi.academicPercent * 40) / 100) * 100) / 100
	const attendanceScore =
		Math.round(((kpi.attendancePercent * 20) / 100) * 100) / 100

  const mainKpi =
    academicScore +
    attendanceScore +
    kpi.assignmentScore +
    kpi.activityScore +
    kpi.tutorScore +
    kpi.disciplineScore;
  const adminBonusScore = kpi.adminBonusScore ?? 0;
  const finalScore = mainKpi - kpi.penaltyScore + kpi.recoveryScore + kpi.employmentBonus + adminBonusScore;
  return {
    studentId,
    semester,
    academicPercent: kpi.academicPercent,
    academicScore,
    attendancePercent: kpi.attendancePercent,
    attendanceScore,
    assignmentScore: kpi.assignmentScore,
    activityScore: kpi.activityScore,
    tutorScore: kpi.tutorScore,
    disciplineScore: kpi.disciplineScore,
    penaltyScore: kpi.penaltyScore,
    recoveryScore: kpi.recoveryScore,
    employmentBonus: kpi.employmentBonus,
    adminBonusScore,
    mainKpi,
    finalScore,
    riskLevel: resolveRiskLevel(finalScore, kpi.academicPercent),
    grantStatus: resolveGrantStatus(finalScore, kpi.academicPercent),
  };
}

// 20 ta talaba ma'lumotlari — acPct: akademik foiz, attPct: davomat foiz
// academicScore = (acPct × 40) / 100
// attendanceScore = (attPct × 20) / 100
const students = [
	{
		id: 'student_01',
		fullName: 'Madina Karimova',
		email: 'madina.k@edumetric.uz',
		faculty: 'Computer Science',
		group: 'CS-21A',
		level: '3-kurs',
		grantType: 'FULL',
		acPct: 91,
		attPct: 87,
		asgn: 15,
		act: 9,
		tut: 4,
		disc: 8,
		pen: 3,
		rec: 4,
		emp: 2,
	},
	{
		id: 'student_02',
		fullName: 'Azizbek Rahmonov',
		email: 'azizbek.r@edumetric.uz',
		faculty: 'Economics',
		group: 'EC-20B',
		level: '4-kurs',
		grantType: 'FULL',
		acPct: 78,
		attPct: 55,
		asgn: 10,
		act: 7,
		tut: 3,
		disc: 7,
		pen: 8,
		rec: 2,
		emp: 0,
	},
	{
		id: 'student_03',
		fullName: 'Sevara Olimova',
		email: 'sevara.o@edumetric.uz',
		faculty: 'Data Science',
		group: 'DS-22C',
		level: '2-kurs',
		grantType: 'FULL',
		acPct: 96,
		attPct: 99,
		asgn: 14,
		act: 10,
		tut: 5,
		disc: 9,
		pen: 0,
		rec: 1,
		emp: 3,
	},
	{
		id: 'student_04',
		fullName: 'Jasur Toshmatov',
		email: 'jasur.t@edumetric.uz',
		faculty: 'Engineering',
		group: 'EN-21A',
		level: '3-kurs',
		grantType: 'FULL',
		acPct: 85,
		attPct: 82,
		asgn: 13,
		act: 8,
		tut: 4,
		disc: 7,
		pen: 2,
		rec: 3,
		emp: 1,
	},
	{
		id: 'student_05',
		fullName: 'Nodira Alimova',
		email: 'nodira.a@edumetric.uz',
		faculty: 'Business',
		group: 'BU-20B',
		level: '4-kurs',
		grantType: 'FULL',
		acPct: 82,
		attPct: 78,
		asgn: 12,
		act: 6,
		tut: 4,
		disc: 8,
		pen: 5,
		rec: 1,
		emp: 0,
	},
	{
		id: 'student_06',
		fullName: 'Bobur Mirzayev',
		email: 'bobur.m@edumetric.uz',
		faculty: 'Computer Science',
		group: 'CS-22C',
		level: '2-kurs',
		grantType: 'FULL',
		acPct: 88,
		attPct: 90,
		asgn: 14,
		act: 9,
		tut: 5,
		disc: 8,
		pen: 1,
		rec: 2,
		emp: 2,
	},
	{
		id: 'student_07',
		fullName: 'Gulnora Usmanova',
		email: 'gulnora.u@edumetric.uz',
		faculty: 'Information Tech',
		group: 'IT-22A',
		level: '2-kurs',
		grantType: 'FULL',
		acPct: 76,
		attPct: 62,
		asgn: 9,
		act: 5,
		tut: 3,
		disc: 6,
		pen: 10,
		rec: 4,
		emp: 1,
	},
	{
		id: 'student_08',
		fullName: 'Sherzod Akbarov',
		email: 'sherzod.a@edumetric.uz',
		faculty: 'Mathematics',
		group: 'MA-21B',
		level: '3-kurs',
		grantType: 'FULL',
		acPct: 93,
		attPct: 98,
		asgn: 15,
		act: 10,
		tut: 5,
		disc: 10,
		pen: 0,
		rec: 0,
		emp: 0,
	},
	{
		id: 'student_09',
		fullName: 'Zarina Ergasheva',
		email: 'zarina.e@edumetric.uz',
		faculty: 'Computer Science',
		group: 'CS-23A',
		level: '1-kurs',
		grantType: 'FULL',
		acPct: 70,
		attPct: 52,
		asgn: 8,
		act: 4,
		tut: 3,
		disc: 5,
		pen: 12,
		rec: 3,
		emp: 0,
	},
	{
		id: 'student_10',
		fullName: 'Farrux Xasanov',
		email: 'farrux.x@edumetric.uz',
		faculty: 'Data Science',
		group: 'DS-20B',
		level: '4-kurs',
		grantType: 'FULL',
		acPct: 90,
		attPct: 88,
		asgn: 14,
		act: 9,
		tut: 5,
		disc: 9,
		pen: 2,
		rec: 2,
		emp: 3,
	},
	{
		id: 'student_11',
		fullName: 'Dildora Yusupova',
		email: 'dildora.y@edumetric.uz',
		faculty: 'Economics',
		group: 'EC-21A',
		level: '3-kurs',
		grantType: 'FULL',
		acPct: 87,
		attPct: 84,
		asgn: 13,
		act: 8,
		tut: 4,
		disc: 8,
		pen: 3,
		rec: 3,
		emp: 1,
	},
	{
		id: 'student_12',
		fullName: 'Islom Qodirov',
		email: 'islom.q@edumetric.uz',
		faculty: 'Engineering',
		group: 'EN-23C',
		level: '1-kurs',
		grantType: 'FULL',
		acPct: 74,
		attPct: 60,
		asgn: 9,
		act: 6,
		tut: 3,
		disc: 6,
		pen: 8,
		rec: 2,
		emp: 0,
	},
	{
		id: 'student_13',
		fullName: 'Malika Rahimova',
		email: 'malika.r@edumetric.uz',
		faculty: 'Business',
		group: 'BU-22A',
		level: '2-kurs',
		grantType: 'FULL',
		acPct: 83,
		attPct: 80,
		asgn: 13,
		act: 7,
		tut: 4,
		disc: 7,
		pen: 4,
		rec: 2,
		emp: 1,
	},
	{
		id: 'student_14',
		fullName: 'Temur Soliyev',
		email: 'temur.s@edumetric.uz',
		faculty: 'Information Tech',
		group: 'IT-21B',
		level: '3-kurs',
		grantType: 'FULL',
		acPct: 79,
		attPct: 72,
		asgn: 11,
		act: 7,
		tut: 4,
		disc: 7,
		pen: 6,
		rec: 3,
		emp: 2,
	},
	{
		id: 'student_15',
		fullName: 'Feruza Norboyeva',
		email: 'feruza.n@edumetric.uz',
		faculty: 'Mathematics',
		group: 'MA-22C',
		level: '2-kurs',
		grantType: 'FULL',
		acPct: 95,
		attPct: 97,
		asgn: 15,
		act: 10,
		tut: 5,
		disc: 10,
		pen: 0,
		rec: 1,
		emp: 0,
	},
	{
		id: 'student_16',
		fullName: 'Olim Ruzmetov',
		email: 'olim.r@edumetric.uz',
		faculty: 'Computer Science',
		group: 'CS-20A',
		level: '4-kurs',
		grantType: 'FULL',
		acPct: 92,
		attPct: 91,
		asgn: 15,
		act: 9,
		tut: 5,
		disc: 9,
		pen: 1,
		rec: 2,
		emp: 3,
	},
	{
		id: 'student_17',
		fullName: 'Saodat Mirzayeva',
		email: 'saodat.m@edumetric.uz',
		faculty: 'Data Science',
		group: 'DS-23A',
		level: '1-kurs',
		grantType: 'FULL',
		acPct: 68,
		attPct: 48,
		asgn: 8,
		act: 3,
		tut: 2,
		disc: 5,
		pen: 15,
		rec: 5,
		emp: 0,
	},
	{
		id: 'student_18',
		fullName: 'Akbar Shukurov',
		email: 'akbar.s@edumetric.uz',
		faculty: 'Engineering',
		group: 'EN-22B',
		level: '2-kurs',
		grantType: 'FULL',
		acPct: 86,
		attPct: 83,
		asgn: 13,
		act: 8,
		tut: 4,
		disc: 8,
		pen: 2,
		rec: 1,
		emp: 0,
	},
	{
		id: 'student_19',
		fullName: 'Lola Xudoyberdiyeva',
		email: 'lola.x@edumetric.uz',
		faculty: 'Economics',
		group: 'EC-22B',
		level: '2-kurs',
		grantType: 'FULL',
		acPct: 81,
		attPct: 79,
		asgn: 12,
		act: 7,
		tut: 4,
		disc: 7,
		pen: 4,
		rec: 2,
		emp: 1,
	},
	{
		id: 'student_20',
		fullName: 'Sardor Ganiyev',
		email: 'sardor.g@edumetric.uz',
		faculty: 'Business',
		group: 'BU-21A',
		level: '3-kurs',
		grantType: 'FULL',
		acPct: 89,
		attPct: 92,
		asgn: 14,
		act: 9,
		tut: 5,
		disc: 8,
		pen: 1,
		rec: 1,
		emp: 2,
	},
]

const MONTHS = ['2026-01', '2026-02', '2026-03', '2026-04', '2026-05']
const SUBJECTS = [
	'Backend',
	'Frontend',
	'Database',
	'DevOps',
	'ML',
	'Statistics',
	'Analytics',
	'Economics',
]

async function main() {
	await prisma.grantDecision.deleteMany({})
	await prisma.feedback.deleteMany({})
	await prisma.employment.deleteMany({})
	await prisma.recoveryTask.deleteMany({})
	await prisma.penalty.deleteMany({})
	await prisma.achievement.deleteMany({})
	await prisma.assignmentRecord.deleteMany({})
	await prisma.attendanceRecord.deleteMany({})
	await prisma.scoreRecord.deleteMany({})
	await prisma.tutorProfile.deleteMany({})
	await prisma.mentorProfile.deleteMany({})
	await prisma.studentProfile.deleteMany({})
	await prisma.user.deleteMany({})

	console.log('Eski seed tozalandi.')

	// Admin, Mentor, Tutor
	const admin = await createUser({
		id: 'admin_1',
		fullName: 'PDP Admin',
		email: 'admin@pdp.uz',
		password: 'admin123',
		role: 'ADMIN',
		phone: '+998900000001',
	})
	const mentor = await createUser({
		id: 'mentor_1',
		fullName: 'Rustam Qodirov',
		email: 'mentor@pdp.uz',
		password: 'mentor123',
		role: 'MENTOR',
		phone: '+998900000002',
	})
	const tutor = await createUser({
		id: 'tutor_1',
		fullName: 'Dilfuza Alimova',
		email: 'tutor@pdp.uz',
		password: 'tutor123',
		role: 'TUTOR',
		phone: '+998900000003',
	})

	await prisma.mentorProfile.create({
		data: {
			id: 'mp_1',
			userId: mentor.id,
			department: 'Engineering',
			specialty: 'Backend Spring Boot',
		},
	})
	await prisma.tutorProfile.create({
		data: { id: 'tp_1', userId: tutor.id, assignedGroup: 'CS-21A' },
	})

	// 20 ta talaba yaratish
	console.log('20 ta talaba yaratilmoqda...')
	for (let i = 0; i < students.length; i++) {
		const s = students[i]
		const profileId = `sp_${String(i + 1).padStart(3, '0')}`

		const user = await createUser({
			id: s.id,
			fullName: s.fullName,
			email: s.email,
			password: 'student123',
			role: 'STUDENT',
			phone: `+99890${String(1000000 + i).slice(0, 7)}`,
		})

		await prisma.studentProfile.create({
			data: {
				id: profileId,
				userId: user.id,
				mentorId: mentor.id,
				tutorId: tutor.id,
				studentId: `STU-${String(i + 1).padStart(3, '0')}`,
				faculty: s.faculty,
				groupName: s.group,
				level: s.level,
				grantType: s.grantType,
				currentGpaPercent: s.acPct,
			},
		})

		// ScoreRecord — akademik va davomat ballari formuladan avtomatik hisoblanadi
		await prisma.scoreRecord.create({
			data: scoreRecord(profileId, {
				academicPercent: s.acPct,
				attendancePercent: s.attPct,
				assignmentScore: s.asgn,
				activityScore: s.act,
				tutorScore: s.tut,
				disciplineScore: s.disc,
				penaltyScore: s.pen,
				recoveryScore: s.rec,
				employmentBonus: s.emp,
			}),
		})

		// AttendanceRecords — har bir talabaga 5 ta oylik
		const attRecords = MONTHS.map((m, idx) => {
			const statuses = ['PRESENT', 'PRESENT', 'PRESENT', 'LATE', 'PRESENT']
			return {
				studentId: profileId,
				date: new Date(`${m}-10`),
				status: idx === 0 ? statuses[i % 5] : statuses[(i + idx) % 5],
				subject: SUBJECTS[(i + idx) % SUBJECTS.length],
			}
		})
		await prisma.attendanceRecord.createMany({ data: attRecords })

		// AssignmentRecord — har bir talabaga 1 ta
		await prisma.assignmentRecord.create({
			data: {
				studentId: profileId,
				subject: SUBJECTS[i % SUBJECTS.length],
				title: `${SUBJECTS[i % SUBJECTS.length]} loyihasi`,
				score: s.asgn,
				status: s.asgn >= 12 ? 'SUBMITTED' : s.asgn >= 9 ? 'LATE' : 'MISSED',
				submittedOnTime: s.asgn >= 12,
				isOriginal: true,
				qualityNote: s.asgn >= 13 ? 'Yaxshi natija.' : 'Yaxshilash kerak.',
				deadline: new Date('2026-05-20'),
				submittedAt: new Date('2026-05-18'),
			},
		})
	}

	// Achievement, Penalty, Recovery — ba'zi talabalarga
	await prisma.achievement.createMany({
		data: [
			{
				studentId: 'sp_001',
				approvedById: admin.id,
				type: 'INNOVATION',
				title: 'AI Hackathon finalist',
				description: 'Universitet hackathon',
				score: 5,
				status: 'APPROVED',
			},
			{
				studentId: 'sp_003',
				approvedById: admin.id,
				type: 'ACADEMIC',
				title: 'Dean list',
				description: 'Yuqori akademik natija',
				score: 5,
				status: 'APPROVED',
			},
			{
				studentId: 'sp_008',
				approvedById: admin.id,
				type: 'RESEARCH',
				title: 'Math Olympiad winner',
				description: 'Matematika olimpiadasi',
				score: 5,
				status: 'APPROVED',
			},
			{
				studentId: 'sp_015',
				approvedById: admin.id,
				type: 'ACADEMIC',
				title: 'Top GPA',
				description: 'Eng yuqori GPA',
				score: 5,
				status: 'APPROVED',
			},
			{
				studentId: 'sp_016',
				approvedById: admin.id,
				type: 'LEADERSHIP',
				title: 'Student council chair',
				description: 'Talabalar kengashi raisi',
				score: 5,
				status: 'APPROVED',
			},
		],
	})

	await prisma.penalty.createMany({
		data: [
			{
				studentId: 'sp_001',
				createdById: mentor.id,
				type: 'ASSIGNMENT',
				reason: 'Kech topshirilgan lab',
				score: 3,
			},
			{
				studentId: 'sp_002',
				createdById: mentor.id,
				type: 'ATTENDANCE',
				reason: 'Davomat buzilishi',
				score: 5,
			},
			{
				studentId: 'sp_002',
				createdById: mentor.id,
				type: 'ASSIGNMENT',
				reason: 'Topshiriq kechikishi',
				score: 3,
			},
			{
				studentId: 'sp_007',
				createdById: mentor.id,
				type: 'DISCIPLINE',
				reason: 'Intizom buzilishi',
				score: 10,
			},
			{
				studentId: 'sp_009',
				createdById: mentor.id,
				type: 'ATTENDANCE',
				reason: 'Dars qoldirish',
				score: 12,
			},
			{
				studentId: 'sp_017',
				createdById: mentor.id,
				type: 'ACADEMIC',
				reason: 'Plagiat holati',
				score: 15,
			},
		],
	})

	await prisma.recoveryTask.createMany({
		data: [
			{
				studentId: 'sp_001',
				assignedById: mentor.id,
				title: 'Lab qayta topshirish',
				recoveryScore: 4,
				status: 'IN_PROGRESS',
				deadline: new Date('2026-05-30'),
			},
			{
				studentId: 'sp_002',
				assignedById: mentor.id,
				title: 'Davomat tiklash',
				recoveryScore: 2,
				status: 'ASSIGNED',
				deadline: new Date('2026-06-05'),
			},
			{
				studentId: 'sp_007',
				assignedById: mentor.id,
				title: 'Intizom reabilitatsiya',
				recoveryScore: 4,
				status: 'IN_PROGRESS',
				deadline: new Date('2026-06-10'),
			},
			{
				studentId: 'sp_017',
				assignedById: tutor.id,
				title: 'Akademik qayta tiklash',
				recoveryScore: 5,
				status: 'ASSIGNED',
				deadline: new Date('2026-06-15'),
			},
		],
	})

	await prisma.employment.createMany({
		data: [
			{
				studentId: 'sp_001',
				type: 'RESEARCH_ASSISTANT',
				companyName: 'PDP Research Lab',
				position: 'Assistant',
				bonusScore: 2,
				status: 'APPROVED',
			},
			{
				studentId: 'sp_003',
				type: 'INTERNSHIP',
				companyName: 'DataCraft',
				position: 'Data intern',
				bonusScore: 3,
				status: 'APPROVED',
			},
			{
				studentId: 'sp_010',
				type: 'FULL_TIME',
				companyName: 'TechSoft',
				position: 'Engineer',
				bonusScore: 3,
				status: 'APPROVED',
			},
			{
				studentId: 'sp_016',
				type: 'INTERNSHIP',
				companyName: 'Google',
				position: 'Software intern',
				bonusScore: 3,
				status: 'APPROVED',
			},
			{
				studentId: 'sp_020',
				type: 'PART_TIME',
				companyName: 'StartUpX',
				position: 'Developer',
				bonusScore: 2,
				status: 'APPROVED',
			},
		],
	})

	console.log("20 ta talaba muvaffaqiyatli qo'shildi!")
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

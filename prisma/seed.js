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
		fullName: "YUSUPOV TOHIRJON BOTIRALI O'G'LI",
		email: 'student@pdp.uz',
		faculty: 'Software Engineering',
		group: '23-314',
		level: '3-kurs',
		grantType: 'Grant',
		acPct: 0,
		attPct: 100,
		asgn: 0,
		act: 0,
		tut: 0,
		disc: 0,
		pen: 0,
		rec: 0,
		emp: 0,
	},
	{
		id: 'student_02',
		fullName: "ADXAMOV AZIZBEK FARXOD O'G'LI",
		email: 'azizbek.adxamov@pdp.uz',
		faculty: 'Software Engineering',
		group: '23-303',
		level: '3-kurs',
		grantType: 'Grant',
		acPct: 0,
		attPct: 100,
		asgn: 0,
		act: 0,
		tut: 0,
		disc: 0,
		pen: 0,
		rec: 0,
		emp: 0,
	},
	{
		id: 'student_03',
		fullName: "O'RINBOYEV MURODALI MAXSUD O'G'LI",
		email: 'murodali.orinboyev@pdp.uz',
		faculty: 'Software Engineering',
		group: '23-312',
		level: '3-kurs',
		grantType: 'Kontrakt',
		acPct: 0,
		attPct: 100,
		asgn: 0,
		act: 0,
		tut: 0,
		disc: 0,
		pen: 0,
		rec: 0,
		emp: 0,
	},
	{
		id: 'student_04',
		fullName: "ASROROV ASILBEK AZAMAT O'G'LI",
		email: 'asilbek.asrorov@pdp.uz',
		faculty: 'Software Engineering',
		group: '23-306',
		level: '3-kurs',
		grantType: 'Kontrakt',
		acPct: 0,
		attPct: 100,
		asgn: 0,
		act: 0,
		tut: 0,
		disc: 0,
		pen: 0,
		rec: 0,
		emp: 0,
	},
	{
		id: 'student_05',
		fullName: "O'RALOVA ZARINA O'KTAM QIZI",
		email: 'zarina.oralova@pdp.uz',
		faculty: 'Software Engineering',
		group: '23-301',
		level: '3-kurs',
		grantType: 'Grant',
		acPct: 0,
		attPct: 99,
		asgn: 0,
		act: 0,
		tut: 0,
		disc: 0,
		pen: 0,
		rec: 0,
		emp: 0,
	},
	{
		id: 'student_06',
		fullName: "ABDUQODIROV HUMOYUN G'AYRAT O'G'LI",
		email: 'humoyun.abduqodirov@pdp.uz',
		faculty: 'Software Engineering',
		group: '23-314',
		level: '3-kurs',
		grantType: 'Grant',
		acPct: 0,
		attPct: 99,
		asgn: 0,
		act: 0,
		tut: 0,
		disc: 0,
		pen: 0,
		rec: 0,
		emp: 0,
	},
	{
		id: 'student_07',
		fullName: "OBIDOV ZUXRIDDIN ZOKIRJON O'G'LI",
		email: 'zuxriddin.obidov@pdp.uz',
		faculty: 'Software Engineering',
		group: '23-309',
		level: '3-kurs',
		grantType: 'Kontrakt',
		acPct: 0,
		attPct: 99,
		asgn: 0,
		act: 0,
		tut: 0,
		disc: 0,
		pen: 0,
		rec: 0,
		emp: 0,
	},
	{
		id: 'student_08',
		fullName: "FAZLIDDIN SAID-SHUAYB ZUXRIDDIN O'G'LI",
		email: 'saidshuayb.fazliddin@pdp.uz',
		faculty: 'Software Engineering',
		group: '23-303',
		level: '3-kurs',
		grantType: 'Kontrakt',
		acPct: 0,
		attPct: 98,
		asgn: 0,
		act: 0,
		tut: 0,
		disc: 0,
		pen: 0,
		rec: 0,
		emp: 0,
	},
	{
		id: 'student_09',
		fullName: "ABDURAHIMOV ABDURAHMON ABDUG'AFUR O'G'LI",
		email: 'abdurahmon.abdurahimov@pdp.uz',
		faculty: 'Software Engineering',
		group: '23-309',
		level: '3-kurs',
		grantType: 'Kontrakt',
		acPct: 0,
		attPct: 98,
		asgn: 0,
		act: 0,
		tut: 0,
		disc: 0,
		pen: 0,
		rec: 0,
		emp: 0,
	},
	{
		id: 'student_10',
		fullName: "XASANOV SAMANDAR JASURBEK O'G'LI",
		email: 'samandar.xasanov@pdp.uz',
		faculty: 'Software Engineering',
		group: '23-314',
		level: '3-kurs',
		grantType: 'Kontrakt',
		acPct: 0,
		attPct: 98,
		asgn: 0,
		act: 0,
		tut: 0,
		disc: 0,
		pen: 0,
		rec: 0,
		emp: 0,
	},
	{
		id: 'student_11',
		fullName: "XUSANOV ABDULLOH FAYZIRAHMON O'G'LI",
		email: 'abdulloh.xusanov@pdp.uz',
		faculty: 'Software Engineering',
		group: '23-314',
		level: '3-kurs',
		grantType: 'Kontrakt',
		acPct: 0,
		attPct: 98,
		asgn: 0,
		act: 0,
		tut: 0,
		disc: 0,
		pen: 0,
		rec: 0,
		emp: 0,
	},
	{
		id: 'student_12',
		fullName: "NIG'MONOV DILSHOD UTKIR O'G'LI",
		email: 'dilshod.nigmonov@pdp.uz',
		faculty: 'Software Engineering',
		group: '23-311',
		level: '3-kurs',
		grantType: 'Kontrakt',
		acPct: 0,
		attPct: 97,
		asgn: 0,
		act: 0,
		tut: 0,
		disc: 0,
		pen: 0,
		rec: 0,
		emp: 0,
	},
	{
		id: 'student_13',
		fullName: "SHAROBIDINOVA SEVINCH FAROXITDIN QIZI",
		email: 'sevinch.sharobidinova@pdp.uz',
		faculty: 'Software Engineering',
		group: '23-315',
		level: '3-kurs',
		grantType: 'Grant',
		acPct: 0,
		attPct: 97,
		asgn: 0,
		act: 0,
		tut: 0,
		disc: 0,
		pen: 0,
		rec: 0,
		emp: 0,
	},
	{
		id: 'student_14',
		fullName: "QO'CHQOROV AKOBIR BAXODIR O'G'LI",
		email: 'akobir.qochqorov@pdp.uz',
		faculty: 'Software Engineering',
		group: '23-307',
		level: '3-kurs',
		grantType: 'Kontrakt',
		acPct: 0,
		attPct: 97,
		asgn: 0,
		act: 0,
		tut: 0,
		disc: 0,
		pen: 0,
		rec: 0,
		emp: 0,
	},
	{
		id: 'student_15',
		fullName: "TOXIRJONOVA MUYASSARXON ZOXIDJON QIZI",
		email: 'muyassarxon.toxirjonova@pdp.uz',
		faculty: 'Software Engineering',
		group: '23-316',
		level: '3-kurs',
		grantType: 'Grant',
		acPct: 0,
		attPct: 97,
		asgn: 0,
		act: 0,
		tut: 0,
		disc: 0,
		pen: 0,
		rec: 0,
		emp: 0,
	},
	{
		id: 'student_16',
		fullName: "OMONOV IBROXIMJON SHUXRAT O'G'LI",
		email: 'ibroximjon.omonov@pdp.uz',
		faculty: 'Software Engineering',
		group: '23-302',
		level: '3-kurs',
		grantType: 'Kontrakt',
		acPct: 0,
		attPct: 97,
		asgn: 0,
		act: 0,
		tut: 0,
		disc: 0,
		pen: 0,
		rec: 0,
		emp: 0,
	},
	{
		id: 'student_17',
		fullName: "MAHKAMOV JOVIDON AVAZMURODOVICH",
		email: 'jovidon.mahkamov@pdp.uz',
		faculty: 'Software Engineering',
		group: '23-316',
		level: '3-kurs',
		grantType: 'Kontrakt',
		acPct: 0,
		attPct: 96,
		asgn: 0,
		act: 0,
		tut: 0,
		disc: 0,
		pen: 0,
		rec: 0,
		emp: 0,
	},
	{
		id: 'student_18',
		fullName: "ABDUSATTOROVA MADINABONU JASURBEK QIZI",
		email: 'madinabonu.abdusattorova@pdp.uz',
		faculty: 'Software Engineering',
		group: '23-309',
		level: '3-kurs',
		grantType: 'Kontrakt',
		acPct: 0,
		attPct: 96,
		asgn: 0,
		act: 0,
		tut: 0,
		disc: 0,
		pen: 0,
		rec: 0,
		emp: 0,
	},
	{
		id: 'student_19',
		fullName: "MUHAMMADISOQOVA MEHRIBON SARDOR QIZI",
		email: 'mehribon.muhammadisoqova@pdp.uz',
		faculty: 'Software Engineering',
		group: '23-303',
		level: '3-kurs',
		grantType: 'Kontrakt',
		acPct: 0,
		attPct: 96,
		asgn: 0,
		act: 0,
		tut: 0,
		disc: 0,
		pen: 0,
		rec: 0,
		emp: 0,
	},
	{
		id: 'student_20',
		fullName: "QURANBOYEV BEKTEMUR UMARJON O'G'LI",
		email: 'bektemur.quranboyev@pdp.uz',
		faculty: 'Software Engineering',
		group: '23-304',
		level: '3-kurs',
		grantType: 'Grant',
		acPct: 0,
		attPct: 96,
		asgn: 0,
		act: 0,
		tut: 0,
		disc: 0,
		pen: 0,
		rec: 0,
		emp: 0,
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
		data: [],
	})

	await prisma.penalty.createMany({
		data: [],
	})

	await prisma.recoveryTask.createMany({
		data: [],
	})

	await prisma.employment.createMany({
		data: [],
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

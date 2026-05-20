import { MotionPanel } from '@/components/providers/motion-panel'
import { Badge } from '@/components/ui/badge'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
	AlertTriangle,
	Briefcase,
	Calendar,
	CheckCircle2,
	Code,
	FileText,
	GraduationCap,
	Heart,
	Info,
	RotateCcw,
	Shield,
	Sparkles,
	Trophy,
} from 'lucide-react'

export const metadata = {
	title: 'Grant Nizomi - PDP METRIC',
	description:
		"PDP University ta'lim grantlarini ajratish va monitoring qilish bo'yicha strategik nizom.",
}

export default function GrantCriteriaPage() {
	return (
		<div className='space-y-8 py-2'>
			{/* Header Banner */}
			<MotionPanel>
				<div className='relative overflow-hidden rounded-3xl bg-linear-to-r from-emerald-600/10 via-cyan-500/5 to-transparent border border-emerald-500/15 p-6 sm:p-8 md:p-10'>
					<div className='absolute right-0 top-1/2 -translate-y-1/2 translate-x-12 opacity-5 pointer-events-none'>
						<GraduationCap className='h-96 w-96 text-emerald-500' />
					</div>
					<div className='max-w-3xl space-y-4'>
						<Badge className='bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 px-3 py-1 text-xs font-semibold rounded-full uppercase tracking-wider'>
							Strategik Nizom
						</Badge>
						<h1 className='text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight leading-tight'>
							PDP UNIVERSITY: TA’LIM GRANTLARINI AJRATISH VA MONITORING QILISH
						</h1>
						<p className='text-sm sm:text-base text-muted-foreground leading-relaxed'>
							Mazkur yo‘riqnoma grant mablag‘laridan foydalanishda shaffoflikni
							ta’minlash, IT-mutaxassisiga xos mas’uliyat va intizomni
							shakllantirish uchun xizmat qiladi.
						</p>
					</div>
				</div>
			</MotionPanel>

			{/* Main Tabs Container */}
			<Tabs defaultValue='umumiy' className='w-full'>
				<TabsList className='w-full flex-wrap justify-start h-auto gap-1 bg-secondary/30 p-1 border border-border/40 rounded-xl mb-6'>
					<TabsTrigger
						value='umumiy'
						className='px-4 py-2 text-xs sm:text-sm font-medium'
					>
						Umumiy Nizom
					</TabsTrigger>
					<TabsTrigger
						value='ball-tizimi'
						className='px-4 py-2 text-xs sm:text-sm font-medium'
					>
						KPI Matrix
					</TabsTrigger>
					<TabsTrigger
						value='akademik-amaliy'
						className='px-4 py-2 text-xs sm:text-sm font-medium'
					>
						Akademik & Fanlar
					</TabsTrigger>
					<TabsTrigger
						value='faollik-ijtimoiy'
						className='px-4 py-2 text-xs sm:text-sm font-medium'
					>
						Faollik & Tyutor
					</TabsTrigger>
					<TabsTrigger
						value='intizom-jarima'
						className='px-4 py-2 text-xs sm:text-sm font-medium'
					>
						Intizom & Jarimalar
					</TabsTrigger>
					<TabsTrigger
						value='employment'
						className='px-4 py-2 text-xs sm:text-sm font-medium'
					>
						Bandlik (Bonus)
					</TabsTrigger>
				</TabsList>

				{/* 1. UMUYMIY NIZOM */}
				<TabsContent value='umumiy' className='outline-none space-y-6'>
					<div className='grid gap-6 md:grid-cols-2'>
						<Card className='glass-panel'>
							<CardHeader>
								<CardTitle className='flex items-center gap-2 text-lg'>
									<Sparkles className='h-5 w-5 text-emerald-500' />
									Grantning maqsadi va imtiyozlari
								</CardTitle>
								<CardDescription>
									Ushbu grant ijtimoiy himoyaga muhtoj, IT sohasiga yuqori
									ishtiyoqi bor talabalarni qo‘llab-quvvatlash uchun ajratiladi.
								</CardDescription>
							</CardHeader>
							<CardContent className='space-y-4'>
								<div className='space-y-3'>
									{[
										"O‘qish to‘lovi (kontraktning 50% dan 100% gacha bo'lgan qismi).",
										'Yotoqxona xarajatlari (bepul turar joy).',
										'Kunlik 3 mahal sifatli ovqatlanish xarajatlari.',
									].map((item, idx) => (
										<div
											key={idx}
											className='flex items-start gap-3 p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/10'
										>
											<CheckCircle2 className='h-5 w-5 text-emerald-500 shrink-0 mt-0.5' />
											<p className='text-sm font-medium'>{item}</p>
										</div>
									))}
								</div>
							</CardContent>
						</Card>

						<Card className='glass-panel'>
							<CardHeader>
								<CardTitle className='flex items-center gap-2 text-lg'>
									<FileText className='h-5 w-5 text-cyan-500' />
									🚀 Grant berish tartibi: Ikki bosqichli saralash
								</CardTitle>
								<CardDescription>
									Yangi talabalarga grant ajratish jarayoni
								</CardDescription>
							</CardHeader>
							<CardContent className='space-y-4'>
								<div className='relative pl-6 border-l-2 border-primary/20 space-y-6 py-1'>
									<div className='relative'>
										<span className='absolute -left-7.75 top-0 flex h-4 w-4 items-center justify-center rounded-full bg-primary ring-4 ring-background' />
										<h4 className='text-sm font-semibold text-foreground'>
											1-bosqich: Reyting tizimi (Filtr)
										</h4>
										<p className='mt-1 text-xs sm:text-sm text-muted-foreground'>
											Talabalar akademik ko‘rsatkich, amaliy loyiha va ijtimoiy
											faollik bo‘yicha ball to‘playdilar. Eng yuqori natija
											ko‘rsatganlar suhbatga tavsiya etiladi.
										</p>
									</div>
									<div className='relative'>
										<span className='absolute -left-7.75 top-0 flex h-4 w-4 items-center justify-center rounded-full bg-primary ring-4 ring-background' />
										<h4 className='text-sm font-semibold text-foreground'>
											2-bosqich: Yakuniy suhbat
										</h4>
										<p className='mt-1 text-xs sm:text-sm text-muted-foreground'>
											Maxsus komissiya talabaning salohiyati va universitet
											qadriyatlariga mosligini baholaydi. Muvaffaqiyatli
											o‘tganlarga grant ajratiladi.
										</p>
									</div>
								</div>
							</CardContent>
						</Card>
					</div>

					<Card className='glass-panel border-l-4 border-l-amber-500'>
						<CardHeader>
							<CardTitle className='flex items-center gap-2 text-lg text-amber-600 dark:text-amber-400'>
								<AlertTriangle className='h-5 w-5' />
								🔄 Grantni saqlab qolish shartlari
							</CardTitle>
							<CardDescription>
								Har bir semestr yakunida grantni davom ettirish mezonlari
							</CardDescription>
						</CardHeader>
						<CardContent className='space-y-4'>
							<div className='grid gap-4 sm:grid-cols-2'>
								<div className='p-4 rounded-xl bg-secondary/35 border border-border/40'>
									<h4 className='text-sm font-semibold text-foreground mb-1'>
										1. Minimal o‘tish balli
									</h4>
									<p className='text-xs sm:text-sm text-muted-foreground'>
										Umumiy reytingda kamida{' '}
										<strong className='text-foreground'>80 ball</strong>{' '}
										to‘plash majburiy.
									</p>
								</div>
								<div className='p-4 rounded-xl bg-secondary/35 border border-border/40'>
									<h4 className='text-sm font-semibold text-foreground mb-1'>
										2. Raqobatli saralash
									</h4>
									<p className='text-xs sm:text-sm text-muted-foreground'>
										Grant kafolatlanmagan; u 80 balldan yuqori natija
										ko‘rsatganlar orasida eng munosiblarga qayta taqsimlanadi.
									</p>
								</div>
							</div>
							<div className='mt-2 p-3 rounded-lg bg-rose-500/5 border border-rose-500/20 text-rose-700 dark:text-rose-300 text-xs sm:text-sm flex gap-2'>
								<Info className='h-5 w-5 shrink-0 mt-0.5' />
								<span>
									<strong>❗ Qo‘shimcha shart:</strong> Umumiy ball yetarli
									bo‘lsa-da, agar talabaning akademik o‘zlashtirishi (GPA){' '}
									<strong>80% dan past</strong> bo‘lsa, grant to‘liq
									to‘xtatiladi.
								</span>
							</div>
						</CardContent>
					</Card>
				</TabsContent>

				{/* 2. BALL TIZIMI (KPI MATRIX) */}
				<TabsContent value='ball-tizimi' className='outline-none'>
					<Card className='glass-panel'>
						<CardHeader>
							<CardTitle>Ball to‘plash tizimi (Max: 100 ball)</CardTitle>
							<CardDescription>
								Asosiy reyting mezonlari va bonus/jarimalar taqsimoti.
							</CardDescription>
						</CardHeader>
						<CardContent>
							<div className='overflow-x-auto rounded-lg border border-border/40'>
								<Table>
									<TableHeader className='bg-secondary/40'>
										<TableRow>
											<TableHead className='w-12'>№</TableHead>
											<TableHead>
												Baholash mezonlari va ko‘rsatkichlari
											</TableHead>
											<TableHead className='text-right w-36'>
												Maksimal ball
											</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{[
											{
												num: 1,
												name: 'Akademik natija (Academic Performance)',
												max: 40,
												icon: GraduationCap,
												color: 'text-emerald-500 bg-emerald-500/10',
											},
											{
												num: 2,
												name: 'O‘quv intizomi: Davomat (Attendance)',
												max: 20,
												icon: Calendar,
												color: 'text-teal-500 bg-teal-500/10',
											},
											{
												num: 3,
												name: 'Amaliy ko‘nikmalar (Assignment & Projects)',
												max: 15,
												icon: Code,
												color: 'text-cyan-500 bg-cyan-500/10',
											},
											{
												num: 4,
												name: 'Faollik va Sertifikatlar',
												max: 10,
												icon: Trophy,
												color: 'text-amber-500 bg-amber-500/10',
											},
											{
												num: 5,
												name: "Ijtimoiy mas'uliyat: Tyutor bahosi",
												max: 5,
												icon: Heart,
												color: 'text-rose-500 bg-rose-500/10',
											},
											{
												num: 6,
												name: 'Korporativ madaniyat va Intizom',
												max: 10,
												icon: Shield,
												color: 'text-blue-500 bg-blue-500/10',
											},
										].map(row => {
											const Icon = row.icon
											return (
												<TableRow key={row.num}>
													<TableCell className='font-semibold'>
														{row.num}
													</TableCell>
													<TableCell className='font-medium text-foreground'>
														<div className='flex items-center gap-2.5'>
															<span
																className={`flex h-8 w-8 items-center justify-center rounded-lg ${row.color}`}
															>
																<Icon className='h-4.5 w-4.5' />
															</span>
															<span>{row.name}</span>
														</div>
													</TableCell>
													<TableCell className='text-right font-bold text-primary'>
														{row.max} ball
													</TableCell>
												</TableRow>
											)
										})}
										<TableRow className='bg-secondary/20 font-bold border-t-2 border-border/80'>
											<TableCell></TableCell>
											<TableCell className='text-foreground'>
												JAMI ASOSIY REYTING (KPI)
											</TableCell>
											<TableCell className='text-right text-primary'>
												100 ball
											</TableCell>
										</TableRow>

										{/* Bonus & Penalties */}
										<TableRow className='bg-muted/30'>
											<TableCell className='font-semibold'>B1</TableCell>
											<TableCell className='font-medium text-rose-600 dark:text-rose-400'>
												<div className='flex items-center gap-2.5'>
													<span className='flex h-8 w-8 items-center justify-center rounded-lg text-rose-500 bg-rose-500/10'>
														<AlertTriangle className='h-4.5 w-4.5' />
													</span>
													<span>
														Ma'muriy jarimalar (Penalty) - Asosiy balldan
														chegiriladi
													</span>
												</div>
											</TableCell>
											<TableCell className='text-right font-bold text-rose-600 dark:text-rose-400'>
												Uchrashgacha -20 ball
											</TableCell>
										</TableRow>
										<TableRow className='bg-muted/30'>
											<TableCell className='font-semibold'>B2</TableCell>
											<TableCell className='font-medium text-emerald-600 dark:text-emerald-400'>
												<div className='flex items-center gap-2.5'>
													<span className='flex h-8 w-8 items-center justify-center rounded-lg text-emerald-500 bg-emerald-500/10'>
														<RotateCcw className='h-4.5 w-4.5' />
													</span>
													<span>
														Reabilitatsiya: Jarimalarni qoplash (Recovery) -
														Bonus
													</span>
												</div>
											</TableCell>
											<TableCell className='text-right font-bold text-emerald-600 dark:text-emerald-400'>
												+10 ball gacha
											</TableCell>
										</TableRow>
										<TableRow className='bg-muted/30'>
											<TableCell className='font-semibold'>B3</TableCell>
											<TableCell className='font-medium text-cyan-600 dark:text-cyan-400'>
												<div className='flex items-center gap-2.5'>
													<span className='flex h-8 w-8 items-center justify-center rounded-lg text-cyan-500 bg-cyan-500/10'>
														<Briefcase className='h-4.5 w-4.5' />
													</span>
													<span>
														Karyeraviy o‘sish: Bandlik (Employment Bonus) -
														Bonus
													</span>
												</div>
											</TableCell>
											<TableCell className='text-right font-bold text-cyan-600 dark:text-cyan-400'>
												+10 ball gacha
											</TableCell>
										</TableRow>
									</TableBody>
								</Table>
							</div>
						</CardContent>
					</Card>
				</TabsContent>

				{/* 3. AKADEMIK VA FANLAR */}
				<TabsContent value='akademik-amaliy' className='outline-none space-y-6'>
					<div className='grid gap-6 md:grid-cols-2'>
						{/* Akademik */}
						<Card className='glass-panel flex flex-col justify-between'>
							<div>
								<CardHeader>
									<CardTitle className='flex items-center gap-2 text-lg'>
										<GraduationCap className='h-5 w-5 text-emerald-500' />
										1. Akademik natija (Academic Performance)
									</CardTitle>
									<CardDescription>40 ballik mezon</CardDescription>
								</CardHeader>
								<CardContent className='space-y-4'>
									<p className='text-sm text-muted-foreground'>
										Talabaning o‘rtacha o‘zlashtirish ko‘rsatkichi foizda
										olinadi va maksimal 40 ball bilan hisoblanadi (masalan, 90%
										GPA olinganda 36 ball beriladi).
									</p>
									<div className='p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 text-center'>
										<span className='text-xs uppercase tracking-wider text-muted-foreground block mb-1'>
											Formula
										</span>
										<span className='text-lg font-bold text-emerald-600 dark:text-emerald-400'>
											Ball = (O‘rtacha ko‘rsatkich % × 40) / 100
										</span>
									</div>
								</CardContent>
							</div>
							<CardContent className='pt-0'>
								<div className='p-3 rounded-lg bg-rose-500/5 border border-rose-500/20 text-rose-700 dark:text-rose-300 text-xs sm:text-sm'>
									<strong>⚠️ Muhim:</strong> Agar akademik natija{' '}
									<strong>80% dan past</strong> bo‘lsa, keyingi semestr uchun
									grant berilmaydi.
								</div>
							</CardContent>
						</Card>

						{/* Davomat */}
						<Card className='glass-panel flex flex-col justify-between'>
							<div>
								<CardHeader>
									<CardTitle className='flex items-center gap-2 text-lg'>
										<Calendar className='h-5 w-5 text-teal-500' />
										2. O‘quv intizomi: Davomat (Attendance)
									</CardTitle>
									<CardDescription>20 ballik mezon</CardDescription>
								</CardHeader>
								<CardContent className='space-y-4'>
									<p className='text-sm text-muted-foreground'>
										Darslardagi ishtirok darajasini o‘lchaydi. Talaba dars
										qoldirmasdan qatnashishi talab etiladi.
									</p>
									<div className='p-4 rounded-xl border border-teal-500/20 bg-teal-500/5 text-center'>
										<span className='text-xs uppercase tracking-wider text-muted-foreground block mb-1'>
											Formula
										</span>
										<span className='text-lg font-bold text-teal-600 dark:text-teal-400'>
											Ball = (Semestrdagi davomat foizi % × 20) / 100
										</span>
									</div>
								</CardContent>
							</div>
							<CardContent className='pt-0'>
								<div className='p-3 rounded-lg bg-secondary/40 border border-border/40 text-xs sm:text-sm text-muted-foreground'>
									<strong>Misol:</strong> Agar semestrdagi umumiy davomatingiz{' '}
									<strong>80%</strong> bo‘lsa, siz ushbu mezon bo'yicha{' '}
									<strong>16 ball</strong> olasiz.
								</div>
							</CardContent>
						</Card>
					</div>

					{/* Amaliy ko'nikmalar */}
					<Card className='glass-panel'>
						<CardHeader>
							<CardTitle className='flex items-center gap-2 text-lg'>
								<Code className='h-5 w-5 text-cyan-500' />
								3. Amaliy ko‘nikmalar (Assignment & Projects) (15 ball)
							</CardTitle>
							<CardDescription>
								Mutaxassislik va ingliz tili fanlaridan berilgan vazifalar va
								amaliy ishlar
							</CardDescription>
						</CardHeader>
						<CardContent className='space-y-6'>
							<p className='text-sm text-muted-foreground'>
								Topshiriqlar 4 ta asosiy mezon asosida baholanadi:
							</p>

							<div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
								{[
									{
										title: 'Bajarish darajasi',
										desc: 'Vazifaning to‘liq, qisman yoki bajarilmaganligi.',
									},
									{
										title: 'Muddat (Deadline)',
										desc: 'Vaqtida topshirish majburiy (kechikish ballni kamaytiradi).',
									},
									{
										title: 'Sifat darajasi',
										desc: 'Toza, aniq, xatolarsiz va ishlaydigan kod/loyiha.',
									},
									{
										title: 'Mustaqillik',
										desc: 'Copy-paste (ko‘chirish) holati aniqlansa, topshiriqqa 0 ball beriladi.',
									},
								].map((item, idx) => (
									<div
										key={idx}
										className='p-4 rounded-xl bg-secondary/30 border border-border/40 space-y-1'
									>
										<h5 className='font-semibold text-sm text-foreground'>
											{item.title}
										</h5>
										<p className='text-xs text-muted-foreground leading-relaxed'>
											{item.desc}
										</p>
									</div>
								))}
							</div>

							<div className='space-y-3'>
								<h4 className='font-bold text-sm text-foreground uppercase tracking-wide'>
									Fanlar ro'yxati (Vazifa topshiriladigan fanlar):
								</h4>
								<div className='overflow-x-auto rounded-lg border border-border/40'>
									<Table>
										<TableHeader className='bg-secondary/40'>
											<TableRow>
												<TableHead className='w-32'>Kurs</TableHead>
												<TableHead>1-Semestr</TableHead>
												<TableHead>2-Semestr</TableHead>
											</TableRow>
										</TableHeader>
										<TableBody>
											<TableRow>
												<TableCell className='font-semibold'>1-kurs</TableCell>
												<TableCell className='text-muted-foreground text-xs sm:text-sm'>
													1. ITS <br />
													2. Programming <br />
													3. Website
												</TableCell>
												<TableCell className='text-muted-foreground text-xs sm:text-sm'>
													1. Full Stack <br />
													2. BPM <br />
													3. Big Data
												</TableCell>
											</TableRow>
											<TableRow>
												<TableCell className='font-semibold'>2-kurs</TableCell>
												<TableCell className='text-muted-foreground text-xs sm:text-sm'>
													1. Mutaxassislik fani (tanlov fan) <br />
													2. Mutaxassislik fani <br />
													3. Ingliz tili
												</TableCell>
												<TableCell className='text-muted-foreground text-xs sm:text-sm'>
													1. Mutaxassislik fani <br />
													2. Mutaxassislik fani <br />
													3. Ingliz tili
												</TableCell>
											</TableRow>
										</TableBody>
									</Table>
								</div>
							</div>
						</CardContent>
					</Card>
				</TabsContent>

				{/* 4. FAOLLIK VA IJTIMOIY */}
				<TabsContent
					value='faollik-ijtimoiy'
					className='outline-none space-y-6'
				>
					<Card className='glass-panel'>
						<CardHeader>
							<CardTitle className='flex items-center gap-2 text-lg'>
								<Trophy className='h-5 w-5 text-amber-500' />
								4. Faollik va Sertifikatlar (10 ball)
							</CardTitle>
							<CardDescription>
								Darsdan tashqari faoliyat, musobaqalar va yutuqlar uchun ball
								taqsimoti
							</CardDescription>
						</CardHeader>
						<CardContent className='space-y-6'>
							<div className='grid gap-6 sm:grid-cols-2 md:grid-cols-3'>
								<div className='p-4 rounded-xl bg-secondary/30 border border-border/40 space-y-2'>
									<h5 className='font-bold text-sm text-foreground'>
										Musobaqalar va Loyihalar
									</h5>
									<ul className='text-xs text-muted-foreground space-y-1.5 list-disc pl-4'>
										<li>
											Ishtirokchi: <strong>1 ball</strong> (Hackathon, Ideathon
											va boshqalar).
										</li>
										<li>
											G‘oliblik / Sovrinli o‘rinlar:{' '}
											<strong>3 ballgacha</strong>.
										</li>
										<li>
											Startup loyihalar: <strong>7 ballgacha</strong> (real
											muammoga yechim beruvchi loyihalar).
										</li>
									</ul>
								</div>

								<div className='p-4 rounded-xl bg-secondary/30 border border-border/40 space-y-2'>
									<h5 className='font-bold text-sm text-foreground'>
										📜 IT & Til Sertifikatlari
									</h5>
									<ul className='text-xs text-muted-foreground space-y-1.5 list-disc pl-4'>
										<li>PDP Academy: Online (2 ball), Offline (3 ball).</li>
										<li>
											IT sertifikatlar (Milliy): <strong>2 ballgacha</strong>.
										</li>
										<li>
											Chet tillari: IELTS / CEFR darajasiga qarab{' '}
											<strong>5 ballgacha</strong>.
										</li>
										<li>
											Xalqaro IT sertifikatlar (Google, AWS, Azure, Microsoft,
											Cisco): Maxsus yuqori ballar.
										</li>
									</ul>
								</div>

								<div className='p-4 rounded-xl bg-secondary/30 border border-border/40 space-y-2'>
									<h5 className='font-bold text-sm text-foreground'>
										🤝 Ijtimoiy & Boshqaruv
									</h5>
									<ul className='text-xs text-muted-foreground space-y-1.5 list-disc pl-4'>
										<li>
											Mentorlik: <strong>3 ball</strong> (akademik past 3+
											talabaga ustozlik qilish).
										</li>
										<li>
											Volontyorlik / Event tashkilotchilik:{' '}
											<strong>1-2 ball</strong>.
										</li>
										<li>
											Treninglar & Soft skills: <strong>1 ball</strong>.
										</li>
										<li>
											Networking (ICT Week va b.): <strong>1 ball</strong>.
										</li>
									</ul>
								</div>
							</div>

							<div className='p-4 rounded-xl border border-primary/20 bg-primary/5 space-y-3'>
								<h5 className='font-bold text-sm text-foreground flex items-center gap-1.5'>
									<Sparkles className='h-4 w-4 text-primary' />
									Karyeraviy Rivojlanish va Assistentlik Imkoniyatlari:
								</h5>
								<div className='grid gap-4 sm:grid-cols-3 text-xs sm:text-sm'>
									<div className='p-3 bg-background/55 rounded-lg border border-border/45'>
										<strong>Loyiha ishtirokchisi (2 ball):</strong> PDP
										Ecosystem loyihalarida haftasiga kamida 10 soat amaliy
										ishlash.
									</div>
									<div className='p-3 bg-background/55 rounded-lg border border-border/45'>
										<strong>Yo‘nalish rahbari yordamchisi (3 ball):</strong> PDP
										akademiyalarida tashkiliy yordamchilik qilish.
									</div>
									<div className='p-3 bg-background/55 rounded-lg border border-border/45'>
										<strong>Strategik yordamchi (4 ballgacha):</strong>{' '}
										Universitet Ta’sischisi yoki Rektori bilan assistent bo'lib
										ishlash.
									</div>
								</div>
							</div>
						</CardContent>
					</Card>

					<Card className='glass-panel'>
						<CardHeader>
							<CardTitle className='flex items-center gap-2 text-lg'>
								<Heart className='h-5 w-5 text-rose-500' />
								5. Ijtimoiy mas'uliyat: Tyutor bahosi (5 ball)
							</CardTitle>
							<CardDescription>
								Tyutorlar talabaning kundalik hayoti va faolligini 5 ta asosiy
								yo‘nalish bo‘yicha baholaydilar
							</CardDescription>
						</CardHeader>
						<CardContent>
							<div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-5'>
								{[
									{
										title: '1. Etika va Kiyinish',
										desc: 'Dress-code va xodimlar bilan muloqot odobi.',
									},
									{
										title: '2. Tadbirlarda faollik',
										desc: "Tadbirlarda tashkilotchi yoki faol ishtirokchi bo'lish.",
									},
									{
										title: '3. Soft Skills',
										desc: 'Konstruktiv muloqot va nizolarni hal qila olish.',
									},
									{
										title: '4. Mas’uliyat',
										desc: 'Tyutor topshiriqlarini vaqtida bajarish va uchrashuvlarga kechikmaslik.',
									},
									{
										title: '5. Yotoqxona faolligi',
										desc: 'Yotoqxonada tozalik, navbatchilik va qoidalarga rioya qilish (tursa).',
									},
								].map((item, idx) => (
									<div
										key={idx}
										className='p-3.5 rounded-xl bg-secondary/35 border border-border/40 flex flex-col justify-between'
									>
										<div>
											<h6 className='font-semibold text-xs sm:text-sm text-foreground mb-1'>
												{item.title}
											</h6>
											<p className='text-[11px] sm:text-xs text-muted-foreground leading-relaxed'>
												{item.desc}
											</p>
										</div>
									</div>
								))}
							</div>
						</CardContent>
					</Card>
				</TabsContent>

				{/* 5. INTIZOM VA JARIMALAR */}
				<TabsContent value='intizom-jarima' className='outline-none space-y-6'>
					<Card className='glass-panel'>
						<CardHeader>
							<CardTitle className='flex items-center gap-2 text-lg'>
								<Shield className='h-5 w-5 text-blue-500' />
								6. Korporativ madaniyat va Intizom (10 ball)
							</CardTitle>
							<CardDescription>
								Akademik halollik va ichki tartib qoidalariga rioya etish
							</CardDescription>
						</CardHeader>
						<CardContent className='space-y-4 text-sm text-muted-foreground'>
							<div className='grid gap-4 sm:grid-cols-2'>
								<div className='p-4 rounded-xl bg-secondary/35 border border-border/40 space-y-2'>
									<h5 className='font-bold text-sm text-foreground flex items-center gap-1.5 dark:text-blue-400'>
										<CheckCircle2 className='h-4 w-4' /> Akademik halollik (Eng
										muhim mezon)
									</h5>
									<p className='text-xs sm:text-sm leading-relaxed'>
										Ko'chirmachilik (Plagiat), imtihonlarda aldash, yoki
										vazifalarni sun'iy intellektdan noo'rin foydalanib
										topshirish qat'iyan taqiqlanadi. Qoidabuzarlik aniqlansa,
										intizom balli pasaytiriladi.
									</p>
								</div>

								<div className='p-4 rounded-xl bg-secondary/35 border border-border/40 space-y-2'>
									<h5 className='font-bold text-sm text-foreground flex items-center gap-1.5 dark:text-blue-400'>
										<CheckCircle2 className='h-4 w-4' /> Auditoriya, yotoqxona
										va kiyinish intizomi
									</h5>
									<p className='text-xs sm:text-sm leading-relaxed'>
										Belgilangan dress-code, auditoriyada telefon ishlatmaslik
										(kompyuter o'yinlari o'ynamaslik), universitet mulkiga zarar
										yetkazmaslik hamda yotoqxona tozalik va xavfsizlik
										qoidalariga amal qilish lozim.
									</p>
								</div>
							</div>

							{/* Moliyaviy intizom */}
							<div className='p-4 rounded-xl border border-rose-500/15 bg-rose-500/5 space-y-2'>
								<h5 className='font-bold text-sm text-rose-600 dark:text-rose-300 flex items-center gap-1.5'>
									<AlertTriangle className='h-4 w-4' /> Moliyaviy intizom
									(Kontrakt to'lovlari)
								</h5>
								<p className='text-xs sm:text-sm leading-relaxed'>
									Talaba o'z hisobidagi kontrakt qismini shartnomadagi muddatdan
									kechiktirmasligi lozim. Kechikish oqibatlari:
								</p>
								<ul className='text-xs sm:text-sm list-disc pl-5 space-y-1 text-muted-foreground'>
									<li>
										<strong>Jarima balli (Penalty):</strong> Muddat o'tgan har
										bir hafta uchun umumiy balldan <strong>-2 ball</strong>{' '}
										chegiriladi.
									</li>
									<li>
										<strong>Grantni to'xtatish:</strong> To'lov muddati 30
										kundan oshib ketsa, talaba grant saralashidan butunlay
										chetlashtiriladi.
									</li>
									<li>
										<strong>Akademik cheklov:</strong> Qarzdorlik mavjud bo'lsa
										imtihonlarga kirish va natijalarni ko'rish cheklanishi
										mumkin.
									</li>
								</ul>
							</div>
						</CardContent>
					</Card>

					<div className='grid gap-6 md:grid-cols-2'>
						{/* Jarimalar */}
						<Card className='glass-panel'>
							<CardHeader>
								<CardTitle className='flex items-center gap-2 text-lg text-rose-600 dark:text-rose-400'>
									<AlertTriangle className='h-5 w-5' />
									7. Ma’muriy jarimalar (Penalty) (Maksimal: -20 ball)
								</CardTitle>
								<CardDescription>
									Qoidabuzarlik darajalariga qarab ball chegirilishi
								</CardDescription>
							</CardHeader>
							<CardContent className='space-y-4'>
								<div className='space-y-3'>
									<div className='p-3 bg-secondary/35 rounded-lg border border-border/40'>
										<span className='font-bold text-xs text-rose-600 uppercase'>
											Yengil qoidabuzarliklar (-1 ball):
										</span>
										<p className='text-xs sm:text-sm text-muted-foreground mt-0.5'>
											Darsga kechikish, telefondan darsda maqsadsiz foydalanish,
											yotoqxona tartibini buzish.
										</p>
									</div>
									<div className='p-3 bg-secondary/35 rounded-lg border border-border/40'>
										<span className='font-bold text-xs text-rose-600 uppercase'>
											O‘rtacha qoidabuzarliklar (-3 ball):
										</span>
										<p className='text-xs sm:text-sm text-muted-foreground mt-0.5'>
											Sababsiz dars qoldirish, mentor yoki tyutor
											ogohlantirishlarini e’tiborsiz qoldirish, ichki qoidalarni
											buzish.
										</p>
									</div>
									<div className='p-3 bg-secondary/35 rounded-lg border border-border/40'>
										<span className='font-bold text-xs text-rose-600 uppercase'>
											Og‘ir qoidabuzarliklar (-5 dan -15 ballgacha):
										</span>
										<p className='text-xs sm:text-sm text-muted-foreground mt-0.5'>
											Tizimli ravishda dars qoldirish (-5), jiddiy intizomiy
											muammolar (-10), akademik firbgarlik/ko‘chirish (-15).
										</p>
									</div>
								</div>
								<div className='p-3 bg-rose-500/10 rounded-lg border border-rose-500/25 text-center text-xs font-semibold text-rose-600 dark:text-rose-300'>
									Bir semestr davomida jami jarimalar miqdori -20 balldan
									oshishi mumkin emas.
								</div>
							</CardContent>
						</Card>

						{/* Tiklanish */}
						<Card className='glass-panel flex flex-col justify-between'>
							<div>
								<CardHeader>
									<CardTitle className='flex items-center gap-2 text-lg text-emerald-600 dark:text-emerald-400'>
										<RotateCcw className='h-5 w-5' />
										8. Reabilitatsiya: Jarimalarni qoplash (Recovery)
									</CardTitle>
									<CardDescription>
										Xatolarni tuzatish va ballarni qaytarish imkoniyati (+10
										ballgacha)
									</CardDescription>
								</CardHeader>
								<CardContent className='space-y-4'>
									<p className='text-xs sm:text-sm text-muted-foreground leading-relaxed'>
										Universitet talabaga o‘z xatosini tuzatish va to‘plangan
										jarimalarni qisman yuvish imkoniyatini beradi.
									</p>
									<div className='p-3.5 bg-emerald-500/5 border border-emerald-500/15 rounded-lg space-y-1.5'>
										<h6 className='font-bold text-xs text-emerald-600 uppercase'>
											Qoplash darajasi:
										</h6>
										<p className='text-xs sm:text-sm text-muted-foreground leading-relaxed'>
											Tyutor yoki kordinator tomonidan yuklatilgan qo'shimcha
											ijtimoiy yoki akademik vazifalar namunali bajarilgan
											taqdirda, talaba to‘plagan jami jarima ballarining{' '}
											<strong>50% qismini</strong> (maksimal{' '}
											<strong>+10 ballgacha</strong>) qaytarib olishi mumkin.
										</p>
									</div>
								</CardContent>
							</div>
							<CardContent className='pt-0'>
								<div className='p-3 rounded-lg bg-secondary/35 border border-border/40 text-xs sm:text-sm text-muted-foreground'>
									<strong>Maqsad:</strong> Talabani intizomga qaytarish va unga
									ikkinchi imkoniyat berish orqali motivatsiyani saqlab qolish.
								</div>
							</CardContent>
						</Card>
					</div>
				</TabsContent>

				{/* 6. EMPLOYMENT (BANDLIK) */}
				<TabsContent value='employment' className='outline-none'>
					<Card className='glass-panel'>
						<CardHeader>
							<CardTitle className='flex items-center gap-2 text-lg'>
								<Briefcase className='h-5 w-5 text-cyan-500' />
								9. Karyeraviy o‘sish: Bandlik (Employment Bonus) (10 ball)
							</CardTitle>
							<CardDescription>
								IT sohasida band bo'lgan talabalar uchun qo'shimcha bonus ballar
								tizimi
							</CardDescription>
						</CardHeader>
						<CardContent className='space-y-6'>
							<p className='text-sm text-muted-foreground'>
								Ushbu blok talabalar o‘rtasida tenglik holati yuzaga kelganda
								"hal qiluvchi ustunlik" (tie-breaker) vazifasini o‘taydi.
								To‘plangan ballar asosiy 100 ballga bonus sifatida qo‘shiladi.
							</p>

							<div className='overflow-x-auto rounded-lg border border-border/40'>
								<Table>
									<TableHeader className='bg-secondary/40'>
										<TableRow>
											<TableHead className='w-48'>Bandlik turi</TableHead>
											<TableHead className='w-32 text-center'>
												Bonus ball
											</TableHead>
											<TableHead>Izoh</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										<TableRow>
											<TableCell className='font-semibold'>
												Internship (Amaliyot)
											</TableCell>
											<TableCell className='text-center font-bold text-cyan-600 dark:text-cyan-400'>
												0 - 5 ball
											</TableCell>
											<TableCell className='text-muted-foreground text-xs sm:text-sm'>
												Yo‘nalish bo‘yicha IT kompaniyalarda rasmiy amaliyot
												o‘tash darajasi va davomiyligiga ko‘ra.
											</TableCell>
										</TableRow>
										<TableRow>
											<TableCell className='font-semibold'>
												Part-time ish
											</TableCell>
											<TableCell className='text-center font-bold text-cyan-600 dark:text-cyan-400'>
												5 - 7 ball
											</TableCell>
											<TableCell className='text-muted-foreground text-xs sm:text-sm'>
												IT sohasida yarim stavka (kunlik 4 soat) faoliyat
												yuritish.
											</TableCell>
										</TableRow>
										<TableRow>
											<TableCell className='font-semibold'>
												Full-time ish
											</TableCell>
											<TableCell className='text-center font-bold text-cyan-600 dark:text-cyan-400'>
												7 - 10 ball
											</TableCell>
											<TableCell className='text-muted-foreground text-xs sm:text-sm'>
												IT kompaniyada to‘liq stavka asosida rasmiy bandlik va
												oylik shartnoma.
											</TableCell>
										</TableRow>
									</TableBody>
								</Table>
							</div>

							<div className='p-3.5 bg-cyan-500/5 border border-cyan-500/15 rounded-lg text-xs sm:text-sm text-muted-foreground flex gap-2'>
								<Info className='h-5 w-5 text-cyan-500 shrink-0 mt-0.5' />
								<span>
									<strong>Eslatma:</strong> Bonus balli talabaning ishga
									joylashgan IT kompaniya nufuzi, ish staji va egallab turgan
									lavozimiga qarab belgilanadi.
								</span>
							</div>
						</CardContent>
					</Card>
				</TabsContent>
			</Tabs>

			{/* Approvals/Footer Footer */}
			<MotionPanel>
				<Card className='glass-panel border border-border/40'>
					<CardContent className='p-6'>
						<h4 className='text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4'>
							Tasdiqlovchilar:
						</h4>
						<div className='grid gap-4 sm:grid-cols-2 md:grid-cols-4 text-xs'>
							<div className='space-y-1'>
								<p className='font-semibold text-foreground'>
									J.P.Mambetkarimov
								</p>
								<p className='text-muted-foreground'>
									PDP EcoSystem bosh direktori, PDP University
								</p>
							</div>
							<div className='space-y-1'>
								<p className='font-semibold text-foreground'>I.M.Matkosimov</p>
								<p className='text-muted-foreground'>
									Ma`muriy masalalar bo‘yicha prorektor
								</p>
							</div>
							<div className='space-y-1'>
								<p className='font-semibold text-foreground'>A.B.Davlatov</p>
								<p className='text-muted-foreground'>
									O‘quv ishlari bo‘yicha prorektor
								</p>
							</div>
							<div className='space-y-1'>
								<p className='font-semibold text-foreground'>K.K.Xaitbayev</p>
								<p className='text-muted-foreground'>
									Grantlar bo‘yicha kordinator
								</p>
							</div>
						</div>
					</CardContent>
				</Card>
			</MotionPanel>
		</div>
	)
}

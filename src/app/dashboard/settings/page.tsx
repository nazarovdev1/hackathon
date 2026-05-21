import { DashboardShell } from '@/components/layout/dashboard-shell'
import { MotionPanel } from '@/components/providers/motion-panel'
import { ThemeToggle } from '@/components/shared/theme-toggle'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import { authOptions } from '@/lib/auth'
import { Bell, EyeOff, Globe, Key, Palette, Shield } from 'lucide-react'
import { getServerSession } from 'next-auth'

export const dynamic = 'force-dynamic'

export default async function SettingsPage() {
	const session = await getServerSession(authOptions)
	const userName = session?.user?.name || 'Foydalanuvchi'

	return (
		<DashboardShell title='Sozlamalar' eyebrow='Tizim konfiguratsiyasi'>
			<div className='grid gap-6'>
				{/* Ko'rinish */}
				<MotionPanel>
					<Card className='glass-panel'>
						<CardHeader>
							<CardTitle className='flex items-center gap-2'>
								<Palette className='h-5 w-5 text-primary' />
								Ko'rinish
							</CardTitle>
							<CardDescription>Mavzu va interfeys sozlamalari</CardDescription>
						</CardHeader>
						<CardContent className='space-y-4'>
							<div className='flex items-center justify-between rounded-lg border border-border/40 bg-secondary/10 p-4'>
								<div>
									<p className='font-medium text-sm'>Mavzu (Theme)</p>
									<p className='text-xs text-muted-foreground'>
										Yorug' yoki qorong'u rejim
									</p>
								</div>
								<ThemeToggle />
							</div>
						</CardContent>
					</Card>
				</MotionPanel>

				{/* Bildirishnomalar */}
				<MotionPanel delay={0.05}>
					<Card className='glass-panel'>
						<CardHeader>
							<CardTitle className='flex items-center gap-2'>
								<Bell className='h-5 w-5 text-amber-500' />
								Bildirishnomalar
							</CardTitle>
							<CardDescription>
								Qaysi bildirishnomalarni olishni tanlang
							</CardDescription>
						</CardHeader>
						<CardContent className='space-y-3'>
							{[
								{
									label: 'Yangi feedback',
									desc: 'Mentor yoki tyutor feedback berganda',
									defaultChecked: true,
								},
								{
									label: 'Jarima ogohlantirishi',
									desc: "Yangi jarima qo'yilganda",
									defaultChecked: true,
								},
								{
									label: 'Sertifikat tasdiqlandi',
									desc: 'Sertifikatingiz tasdiqlanganda',
									defaultChecked: true,
								},
								{
									label: 'Recovery deadline',
									desc: 'Vazifa muddati yaqinlashganda',
									defaultChecked: true,
								},
								{
									label: "Reyting o'zgarishi",
									desc: "Reytingingiz o'zgarganda",
									defaultChecked: false,
								},
							].map(item => (
								<label
									key={item.label}
									className='flex items-center justify-between rounded-lg border border-border/40 bg-secondary/10 p-3 cursor-pointer hover:bg-secondary/20 transition-colors'
								>
									<div>
										<p className='font-medium text-sm'>{item.label}</p>
										<p className='text-xs text-muted-foreground'>{item.desc}</p>
									</div>
									<input
										type='checkbox'
										defaultChecked={item.defaultChecked}
										className='h-4 w-4 rounded border-border text-primary focus:ring-primary'
									/>
								</label>
							))}
						</CardContent>
					</Card>
				</MotionPanel>

				{/* Xavfsizlik */}
				<MotionPanel delay={0.1}>
					<Card className='glass-panel'>
						<CardHeader>
							<CardTitle className='flex items-center gap-2'>
								<Shield className='h-5 w-5 text-emerald-500' />
								Xavfsizlik
							</CardTitle>
							<CardDescription>Hisob xavfsizligi va maxfiylik</CardDescription>
						</CardHeader>
						<CardContent className='space-y-3'>
							<div className='rounded-lg border border-border/40 bg-secondary/10 p-4'>
								<div className='flex items-center justify-between'>
									<div>
										<p className='font-medium text-sm'>Parolni o'zgartirish</p>
										<p className='text-xs text-muted-foreground'>
											Xavfsizlik uchun parolingizni muntazam yangilang
										</p>
									</div>
									<button className='flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors'>
										<Key className='h-4 w-4' />
										O'zgartirish
									</button>
								</div>
							</div>
							<div className='rounded-lg border border-border/40 bg-secondary/10 p-4'>
								<div className='flex items-center justify-between'>
									<div>
										<p className='font-medium text-sm'>
											Ikki bosqichli autentifikatsiya
										</p>
										<p className='text-xs text-muted-foreground'>
											Qo'shimcha xavfsizlik qatlami
										</p>
									</div>
									<span className='text-xs text-muted-foreground flex items-center gap-1'>
										<EyeOff className='h-3.5 w-3.5' />
										Faol emas
									</span>
								</div>
							</div>
						</CardContent>
					</Card>
				</MotionPanel>

				{/* Til */}
				<MotionPanel delay={0.15}>
					<Card className='glass-panel'>
						<CardHeader>
							<CardTitle className='flex items-center gap-2'>
								<Globe className='h-5 w-5 text-cyan-500' />
								Til
							</CardTitle>
							<CardDescription>Interfeys tilini tanlang</CardDescription>
						</CardHeader>
						<CardContent>
							<div className='flex items-center gap-3'>
								<select
									defaultValue='uz'
									className='flex h-10 rounded-md border border-border bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary'
								>
									<option value='uz'>O'zbekcha</option>
									<option value='ru'>Русский</option>
									<option value='en'>English</option>
								</select>
							</div>
						</CardContent>
					</Card>
				</MotionPanel>

				{/* Ma'lumot */}
				<MotionPanel delay={0.2}>
					<Card className='glass-panel'>
						<CardHeader>
							<CardTitle>Tizim ma'lumotlari</CardTitle>
						</CardHeader>
						<CardContent className='space-y-2 text-sm'>
							<div className='flex justify-between'>
								<span className='text-muted-foreground'>Foydalanuvchi</span>
								<span className='font-medium'>{userName}</span>
							</div>
							<div className='flex justify-between'>
								<span className='text-muted-foreground'>Rol</span>
								<span className='font-medium'>
									{session?.user?.role ?? 'STUDENT'}
								</span>
							</div>
							<div className='flex justify-between'>
								<span className='text-muted-foreground'>Versiya</span>
								<span className='font-medium'>v0.1.0</span>
							</div>
						</CardContent>
					</Card>
				</MotionPanel>
			</div>
		</DashboardShell>
	)
}

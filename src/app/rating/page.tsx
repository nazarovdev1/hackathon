import { getLeaderboard } from '@/services/leaderboard'
import { LeaderboardClient } from './leaderboard-client'
import { AlertTriangle } from 'lucide-react'

export const metadata = {
	title: 'Talabalar Reytingi - PDP METRIC',
	description:
		"PDP University talabalari o'rtasidagi umumiy reyting va kpi ko'rsatkichlari.",
}

export const dynamic = 'force-dynamic'

export default async function RatingPage() {
	let leaderboard: Awaited<ReturnType<typeof getLeaderboard>> = []
	let dbError = false

	try {
		leaderboard = await getLeaderboard()
	} catch (error) {
		console.error("Database connection error in rating page:", error)
		dbError = true
	}

	return (
		<div className='space-y-6'>
			<div className='flex flex-col gap-2'>
				<h1 className='text-3xl font-bold tracking-tight'>
					Talabalar reytingi
				</h1>
				<p className='text-muted-foreground text-sm sm:text-base'>
					Grant talablari bo&apos;yicha hisoblangan yakuniy ballar asosida
					shakllantirilgan haftalik reyting jadvali.
				</p>
			</div>

			{dbError ? (
				<div className='flex flex-col items-center justify-center gap-4 rounded-2xl border border-amber-500/20 bg-amber-500/5 px-6 py-16 text-center'>
					<div className='flex h-14 w-14 items-center justify-center rounded-full bg-amber-500/10'>
						<AlertTriangle className='h-7 w-7 text-amber-500' />
					</div>
					<div>
						<h2 className='text-lg font-semibold text-foreground'>
							Ma&apos;lumotlar bazasiga ulanib bo&apos;lmadi
						</h2>
						<p className='mt-1 text-sm text-muted-foreground max-w-sm mx-auto'>
							Reyting ma&apos;lumotlari hozircha mavjud emas. Iltimos, keyinroq
							qayta urinib ko&apos;ring yoki tizim administratoriga murojaat
							qiling.
						</p>
					</div>
					<div className='mt-2 rounded-lg border border-border/40 bg-secondary/30 px-4 py-2 text-xs text-muted-foreground font-mono'>
						Xato: Ma&apos;lumotlar bazasi ulanishi amalga oshmadi
					</div>
				</div>
			) : (
				<LeaderboardClient initialData={leaderboard} />
			)}
		</div>
	)
}


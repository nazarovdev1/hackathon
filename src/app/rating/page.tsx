import { getLeaderboard } from '@/services/leaderboard'
import { LeaderboardClient } from './leaderboard-client'

export const metadata = {
	title: 'Talabalar Reytingi - PDP METRIC',
	description:
		"PDP University talabalari o'rtasidagi umumiy reyting va kpi ko'rsatkichlari.",
}

export const dynamic = 'force-dynamic'

export default async function RatingPage() {
	const leaderboard = await getLeaderboard()

	return (
		<div className='space-y-6'>
			<div className='flex flex-col gap-2'>
				<h1 className='text-3xl font-bold tracking-tight'>
					Talabalar reytingi
				</h1>
				<p className='text-muted-foreground text-sm sm:text-base'>
					Grant talablari bo'yicha hisoblangan yakuniy ballar asosida
					shakllantirilgan haftalik reyting jadvali.
				</p>
			</div>

			<LeaderboardClient initialData={leaderboard} />
		</div>
	)
}

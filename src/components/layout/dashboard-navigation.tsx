'use client'

import { dashboardNavigation } from '@/constants/navigation'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function DashboardNavigation({ role }: { role: string }) {
	const pathname = usePathname() || ''

	const filteredNav = dashboardNavigation.filter(item =>
		(item.roles as readonly string[]).includes(role),
	)

	return (
		<nav className='grid gap-1'>
			{filteredNav.map(item => {
				const isActive =
					pathname === item.href ||
					(item.href !== '/dashboard/student' && pathname.startsWith(item.href))
				return (
					<Link
						key={item.href}
						href={item.href}
						className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm transition ${
							isActive
								? 'bg-primary/10 font-medium text-primary'
								: 'text-muted-foreground hover:bg-secondary hover:text-foreground'
						}`}
					>
						<item.icon className='h-4 w-4' />
						{item.title}
					</Link>
				)
			})}
		</nav>
	)
}

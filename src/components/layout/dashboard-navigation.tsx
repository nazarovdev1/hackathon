'use client'

import { dashboardNavigation } from '@/constants/navigation'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function DashboardNavigation({ role }: { role: string }) {
	const pathname = usePathname() || ''
	const [hash, setHash] = useState('')
	const [mounted, setMounted] = useState(false)

	useEffect(() => {
		setMounted(true)
		const updateHash = () => setHash(window.location.hash || '')
		updateHash()
		window.addEventListener('hashchange', updateHash)
		return () => window.removeEventListener('hashchange', updateHash)
	}, [])

	const filteredNav = dashboardNavigation.filter(item =>
		(item.roles as readonly string[]).includes(role),
	)

	return (
		<nav className='grid gap-1'>
			{filteredNav.map(item => {
				let isActive = false

				if (item.href.includes('#')) {
					const [itemPath, itemHash] = item.href.split('#')
					isActive = pathname === itemPath && hash === `#${itemHash}`
				} else {
					isActive = pathname === item.href
				}

				return (
					<Link
						key={item.href}
						href={item.href}
						className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-all duration-200 ${
							isActive
								? 'bg-primary/10 text-primary shadow-sm cursor-default'
								: 'text-muted-foreground'
						} ${!isActive && mounted ? 'hover:bg-secondary/50 hover:text-foreground' : ''}`}
					>
						<item.icon className='h-4 w-4' />
						{item.title}
					</Link>
				)
			})}
		</nav>
	)
}

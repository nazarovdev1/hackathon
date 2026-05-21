'use client'

import { dashboardNavigation } from '@/constants/navigation'
import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function DashboardNavigation({ role }: { role: string }) {
	const pathname = usePathname() || ''
	const searchParams = useSearchParams()
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

	// Precompute compatibility and specificity score for each item to select the best match
	const navItemsWithScores = filteredNav.map(item => {
		const [itemPathWithQuery, itemHash] = item.href.split('#')
		const [itemPath, itemQuery] = itemPathWithQuery.split('?')

		let isCompatible = pathname === itemPath
		let specificity = 0

		if (isCompatible) {
			// Check hash compatibility
			if (item.href.includes('#')) {
				if (hash === `#${itemHash}`) {
					specificity += 10
				} else {
					isCompatible = false
				}
			}

			// Check query compatibility
			if (isCompatible && itemQuery) {
				const params = new URLSearchParams(itemQuery)
				const matchesAllParams = Array.from(params.entries()).every(
					([key, value]) => searchParams.get(key) === value,
				)
				if (matchesAllParams) {
					specificity += Array.from(params.keys()).length
				} else {
					isCompatible = false
				}
			}
		}

		return {
			item,
			isCompatible,
			specificity,
		}
	})

	const maxSpecificity = Math.max(
		-1,
		...navItemsWithScores
			.filter(item => item.isCompatible)
			.map(item => item.specificity),
	)

	return (
		<nav className='grid gap-1'>
			{navItemsWithScores.map(({ item, isCompatible, specificity }) => {
				const isActive = isCompatible && specificity === maxSpecificity

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

'use client'

import { useEffect, useState } from 'react'

export function GlobalLoading() {
	const [isLoading, setIsLoading] = useState(false)

	useEffect(() => {
		let timeoutId: NodeJS.Timeout | null = null
		let isLoadingRef = false

		const startLoading = () => {
			if (timeoutId) clearTimeout(timeoutId)
			isLoadingRef = true
			// Use microtask to avoid interference with history API
			queueMicrotask(() => {
				setIsLoading(true)
			})
		}

		const stopLoading = () => {
			if (timeoutId) clearTimeout(timeoutId)
			timeoutId = setTimeout(() => {
				isLoadingRef = false
				setIsLoading(false)
			}, 300)
		}

		// Detect route changes via history API
		const originalPushState = window.history.pushState
		const originalReplaceState = window.history.replaceState

		window.history.pushState = function (...args) {
			if (!isLoadingRef) startLoading()
			return originalPushState.apply(window.history, args)
		}

		window.history.replaceState = function (...args) {
			if (!isLoadingRef) startLoading()
			return originalReplaceState.apply(window.history, args)
		}

		window.addEventListener('popstate', () => {
			if (!isLoadingRef) startLoading()
		})
		window.addEventListener('load', stopLoading)

		return () => {
			if (timeoutId) clearTimeout(timeoutId)
			window.removeEventListener('load', stopLoading)
			window.history.pushState = originalPushState
			window.history.replaceState = originalReplaceState
		}
	}, [])

	if (!isLoading) return null

	return (
		<div className='fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm'>
			<div className='flex flex-col items-center gap-4'>
				{/* Spinner */}
				<div className='relative h-12 w-12'>
					<div className='absolute inset-0 rounded-full border-4 border-primary/20' />
					<div className='absolute inset-0 rounded-full border-4 border-transparent border-t-primary animate-spin' />
				</div>
				<p className='text-sm font-medium text-foreground'>Yuklanmoqda...</p>
			</div>
		</div>
	)
}

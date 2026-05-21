'use client'

import {
	createContext,
	ReactNode,
	useContext,
	useEffect,
	useState,
} from 'react'

interface LoadingContextType {
	isLoading: boolean
	setIsLoading: (loading: boolean) => void
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined)

export function LoadingProvider({ children }: { children: ReactNode }) {
	const [isLoading, setIsLoading] = useState(false)

	useEffect(() => {
		let navigationTimeout: NodeJS.Timeout | null = null

		const startLoading = () => {
			queueMicrotask(() => {
				setIsLoading(true)
			})
		}

		const stopLoading = () => {
			if (navigationTimeout) clearTimeout(navigationTimeout)
			navigationTimeout = setTimeout(() => {
				setIsLoading(false)
			}, 200)
		}

		// Detect route changes via history API
		const originalPushState = window.history.pushState
		const originalReplaceState = window.history.replaceState

		window.history.pushState = function (...args) {
			startLoading()
			return originalPushState.apply(window.history, args)
		}

		window.history.replaceState = function (...args) {
			startLoading()
			return originalReplaceState.apply(window.history, args)
		}

		window.addEventListener('popstate', startLoading)

		// Stop loading when page is fully loaded or content shown
		window.addEventListener('load', stopLoading)
		window.addEventListener('pageshow', stopLoading)

		// Also stop on navigation start completion (Next.js specific)
		const handleBeforeUnload = () => startLoading()
		window.addEventListener('beforeunload', handleBeforeUnload)

		return () => {
			if (navigationTimeout) clearTimeout(navigationTimeout)
			window.removeEventListener('load', stopLoading)
			window.removeEventListener('pageshow', stopLoading)
			window.removeEventListener('popstate', startLoading)
			window.removeEventListener('beforeunload', handleBeforeUnload)
			window.history.pushState = originalPushState
			window.history.replaceState = originalReplaceState
		}
	}, [])

	return (
		<LoadingContext.Provider value={{ isLoading, setIsLoading }}>
			{children}
		</LoadingContext.Provider>
	)
}

export function useLoading() {
	const context = useContext(LoadingContext)
	if (context === undefined) {
		throw new Error('useLoading must be used within LoadingProvider')
	}
	return context
}

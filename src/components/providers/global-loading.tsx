'use client'

import { useLoading } from './loading-provider'

export function GlobalLoading() {
	const { isLoading } = useLoading()

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

import { ThemeToggle } from '@/components/shared/theme-toggle'
import { buttonVariants } from '@/components/ui/button'
import { ArrowRight, BookOpen, Trophy } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

export default function PublicRatingLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<div className='metric-grid min-h-screen flex flex-col bg-background'>
			{/* Header */}
			<header className='sticky top-0 z-30 border-b border-border/40 bg-background/60 backdrop-blur-xl shrink-0'>
				<div className='mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6'>
					{/* Logo */}
					<Link href='/' className='flex items-center gap-3 group'>
						<span className='flex h-10 w-10 items-center justify-center rounded-full shadow-[0_0_24px_rgba(16,185,129,0.3)] overflow-hidden bg-white group-hover:scale-105 transition-transform'>
							<Image
								src='/pdp-logo.jpg'
								alt='PDP Logo'
								width={40}
								height={40}
								className='object-cover scale-[1.3]'
							/>
						</span>
						<span className='hidden sm:block'>
							<span className='block text-md font-semibold tracking-normal leading-tight'>
								PDP METRIC
							</span>
							<span className='text-[10px] text-muted-foreground block leading-none'>
								Mehmon rejimi
							</span>
						</span>
					</Link>

					{/* Navigation links */}
					<div className='flex items-center gap-2 sm:gap-6'>
						<Link
							href='/rating'
							className='flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-secondary transition-colors'
						>
							<Trophy className='h-4 w-4 text-amber-500' />
							<span className='hidden xs:inline'>Reyting</span>
						</Link>
						<Link
							href='/rating/criteria'
							className='flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-secondary transition-colors'
						>
							<BookOpen className='h-4 w-4 text-primary' />
							<span className='hidden xs:inline'>Grant Nizomi</span>
							<span className='xs:hidden'>Nizom</span>
						</Link>
					</div>

					{/* Action buttons */}
					<div className='flex items-center gap-4'>
						<ThemeToggle />
						<Link
							href='/login'
							className={buttonVariants({
								size: 'sm',
								className: 'shadow-md shadow-primary/10 font-semibold gap-1',
							})}
						>
							Kirish <ArrowRight className='h-4 w-4' />
						</Link>
					</div>
				</div>
			</header>

			{/* Main Content */}
			<main className='flex-1 w-full max-w-7xl mx-auto px-4 py-8 sm:px-6 relative z-10'>
				{children}
			</main>
		</div>
	)
}

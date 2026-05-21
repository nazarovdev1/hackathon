import { ThemeToggle } from '@/components/shared/theme-toggle'
import { buttonVariants } from '@/components/ui/button-variants'
import { ArrowRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

export default function PublicRatingLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<div className='metric-grid min-h-screen flex flex-col bg-background'>
			{/* Navigation — matching home page navbar */}
			<nav className='sticky top-3 z-30 mx-auto w-full max-w-7xl px-4 sm:px-6 shrink-0'>
				<div className='flex items-center justify-between backdrop-blur-sm bg-background/50 p-3 sm:p-4 rounded-2xl border border-border/40'>
					<Link href='/' className='flex items-center gap-3 group'>
						<div className='flex h-10 w-10 items-center justify-center rounded-full shadow-[0_0_28px_rgba(16,185,129,0.35)] transition-transform group-hover:scale-105 overflow-hidden bg-white'>
							<Image
								src='/pdp-logo.jpg'
								alt='PDP Logo'
								width={40}
								height={40}
								className='object-cover scale-[1.3]'
							/>
						</div>
						<span className='text-lg font-semibold tracking-normal'>
							PDP METRIC
						</span>
					</Link>
					<div className='flex items-center gap-4'>
						<div className='flex items-center gap-1 sm:gap-2 bg-secondary/40 rounded-xl p-1 border border-border/30'>
							<Link
								className='text-sm font-medium hover:text-primary transition-colors px-3 py-1.5 rounded-lg hover:bg-secondary'
								href='/rating'
							>
								Reyting
							</Link>
							<Link
								className='text-sm font-medium hover:text-primary transition-colors px-3 py-1.5 rounded-lg hover:bg-secondary'
								href='/rating/criteria'
							>
								Grant Nizomi
							</Link>
						</div>
						<ThemeToggle />
						<Link
							className={buttonVariants({ variant: 'ghost', size: 'sm' })}
							href='/login'
						>
							Kirish
						</Link>
						<Link
							className={buttonVariants({
								size: 'sm',
								className: 'shadow-lg shadow-primary/20',
							})}
							href='/login'
						>
							Boshlash <ArrowRight className='ml-2 h-4 w-4' />
						</Link>
					</div>
				</div>
			</nav>

			{/* Main Content */}
			<main className='flex-1 w-full max-w-7xl mx-auto px-4 py-8 sm:px-6 relative z-10'>
				{children}
			</main>
		</div>
	)
}

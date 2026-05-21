import { SignInForm } from '@/components/auth/sign-in-form'
import { MotionPanel } from '@/components/providers/motion-panel'
import { ChevronLeft } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

export const metadata = {
	title: 'Tizimga kirish - PDP METRIC',
	description: 'PDP METRIC hisobingizga kiring.',
}

export default function LoginPage() {
	return (
		<main className='metric-grid min-h-screen flex flex-col px-4 py-4 sm:px-6'>
			<nav className='mx-auto flex w-full max-w-7xl items-center justify-between relative z-10 mb-8'>
				<Link href='/' className='flex items-center gap-3 group'>
					<div className='flex h-12 w-12 items-center justify-center rounded-full shadow-[0_0_32px_rgba(16,185,129,0.4)] transition-all group-hover:scale-110 overflow-hidden bg-white ring-2 ring-primary/20'>
						<Image
							src='/pdp-logo.jpg'
							alt='PDP Logo'
							width={48}
							height={48}
							className='object-cover scale-[1.1]'
						/>
					</div>
					<div className='flex flex-col'>
						<span className='text-xl font-bold tracking-tight'>PDP METRIC</span>
						<span className='text-xs text-muted-foreground font-medium'>
							Grant Monitoringi
						</span>
					</div>
				</Link>
				<Link
					href='/'
					className='flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors px-4 py-2 rounded-lg hover:bg-secondary/20'
				>
					<ChevronLeft className='h-4 w-4' />
					Qaytish
				</Link>
			</nav>

			<div className='flex-1 flex items-center justify-center relative z-10 py-12'>
				<MotionPanel className='w-full max-w-md rounded-3xl'>
					<div className='mb-8 text-center flex flex-col items-center'>
						<div className='flex h-14 w-14 items-center justify-center rounded-full shadow-[0_0_28px_rgba(16,185,129,0.35)] mb-6 overflow-hidden bg-white ring-1 ring-primary/20'>
							<Image
								src='/pdp-logo.jpg'
								alt='PDP Logo'
								width={56}
								height={56}
								className='object-cover scale-[1.1]'
							/>
						</div>
						<h1 className='text-3xl font-bold tracking-tight'>Xush kelibsiz</h1>
						<p className='text-muted-foreground mt-2'>
							Boshqaruv paneliga kirish uchun tizimga kiring
						</p>
					</div>
					<SignInForm />
				</MotionPanel>
			</div>

			{/* Decorative background elements */}
			<div className='pointer-events-none absolute inset-0 flex items-center justify-center z-0 overflow-hidden'>
				<div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-200 h-200 bg-primary/5 rounded-full blur-[120px]' />
			</div>
		</main>
	)
}

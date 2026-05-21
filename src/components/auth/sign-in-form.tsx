'use client'

import { Button } from '@/components/ui/button'
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Eye, EyeOff, Loader2, LogIn } from 'lucide-react'
import { getSession, signIn } from 'next-auth/react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export function SignInForm() {
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [showPassword, setShowPassword] = useState(false)
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState('')
	const router = useRouter()

	const submitCredentials = async () => {
		setIsLoading(true)
		setError('')

		try {
			const res = await signIn('credentials', {
				email,
				password,
				redirect: false,
				callbackUrl: window.location.origin,
			})

			if (res?.error || res?.ok === false) {
				setError("Noto'g'ri email yoki parol")
			} else {
				const session = await getSession()
				const role = session?.user?.role

				if (role === 'ADMIN') {
					router.push('/dashboard/admin')
				} else if (role === 'MENTOR' || role === 'TUTOR') {
					router.push('/dashboard/mentor')
				} else {
					router.push('/dashboard/student')
				}
			}
		} catch {
			setError("Xatolik yuz berdi. Iltimos, qaytadan urinib ko'ring.")
		} finally {
			setIsLoading(false)
		}
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		await submitCredentials()
	}

	return (
		<Card className='glass-panel w-full max-w-md mx-auto'>
			<CardHeader className='space-y-1'>
				<CardTitle className='text-2xl font-semibold tracking-tight'>
					Tizimga kirish
				</CardTitle>
				<CardDescription className='text-muted-foreground'>
					Hisobingizga kirish uchun email va parolingizni kiriting.
				</CardDescription>
			</CardHeader>
			<form onSubmit={handleSubmit}>
				<CardContent className='grid gap-4'>
					<div className='grid gap-2'>
						<Label htmlFor='email'>Email</Label>
						<Input
							id='email'
							type='email'
							placeholder='m@example.com'
							required
							value={email}
							onChange={e => setEmail(e.target.value)}
							disabled={isLoading}
							className='bg-background/50'
						/>
					</div>
					<div className='grid gap-2'>
						<div className='flex items-center'>
							<Label htmlFor='password'>Parol</Label>
							<a
								href='#'
								className='ml-auto inline-block text-sm text-primary hover:underline'
							>
								Parolni unutdingizmi?
							</a>
						</div>
						<div className='relative'>
							<Input
								id='password'
								type={showPassword ? 'text' : 'password'}
								required
								value={password}
								onChange={e => setPassword(e.target.value)}
								disabled={isLoading}
								className='bg-background/50 pr-10'
							/>
							<button
								type='button'
								className='absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors'
								onClick={() => setShowPassword(!showPassword)}
								tabIndex={-1}
							>
								{showPassword ? (
									<EyeOff className='h-4 w-4' />
								) : (
									<Eye className='h-4 w-4' />
								)}
								<span className='sr-only'>
									{showPassword ? 'Parolni yashirish' : "Parolni ko'rsatish"}
								</span>
							</button>
						</div>
					</div>
					{error && (
						<p className='text-sm font-medium text-destructive'>{error}</p>
					)}
				</CardContent>
				<CardFooter className='flex flex-col gap-4 bg-transparent border-t-0 pb-6 pt-2'>
					<Button className='w-full' type='submit' disabled={isLoading}>
						{isLoading ? (
							<Loader2 className='mr-2 h-4 w-4 animate-spin' />
						) : (
							<LogIn className='mr-2 h-4 w-4' />
						)}
						Kirish
					</Button>
					<div className='flex flex-col items-center gap-2 text-center text-sm w-full mt-1'>
						<Link
							href='/rating'
							className='text-primary hover:underline font-semibold flex items-center gap-1'
						>
							Reytingni ko'rish →
						</Link>
						<div className='text-muted-foreground text-xs mt-1'>
							Hisobingiz yo'qmi?{' '}
							<a
								href='#'
								className='underline underline-offset-4 hover:text-primary'
							>
								Administratorga murojaat qiling
							</a>
						</div>
					</div>
				</CardFooter>
			</form>
		</Card>
	)
}

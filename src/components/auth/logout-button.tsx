'use client'

import { LogOut } from 'lucide-react'
import { signOut } from 'next-auth/react'
import { useTransition } from 'react'

export function LogoutButton() {
	const [isPending, startTransition] = useTransition()

	const handleLogout = () => {
		startTransition(async () => {
			await signOut({
				redirect: true,
				callbackUrl: '/',
			})
		})
	}

	return (
		<button
			onClick={handleLogout}
			disabled={isPending}
			className='flex w-full items-center cursor-pointer text-rose-600 dark:text-rose-400 hover:opacity-80 disabled:opacity-50'
		>
			<LogOut className='mr-2 h-4 w-4' />
			{isPending ? 'Chiqilmoqda...' : 'Chiqish'}
		</button>
	)
}

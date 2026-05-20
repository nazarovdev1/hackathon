'use client'

import type { Toast } from '@/hooks/use-toast'
import { AlertCircle, CheckCircle2, Info, X, XCircle } from 'lucide-react'

const icons = {
	success: CheckCircle2,
	error: XCircle,
	warning: AlertCircle,
	info: Info,
}

const styles = {
	success:
		'border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300',
	error: 'border-rose-500/30 bg-rose-500/10 text-rose-700 dark:text-rose-300',
	warning:
		'border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300',
	info: 'border-cyan-500/30 bg-cyan-500/10 text-cyan-700 dark:text-cyan-300',
}

export function ToastContainer({
	toasts,
	onDismiss,
}: {
	toasts: Toast[]
	onDismiss: (id: string) => void
}) {
	if (toasts.length === 0) return null

	return (
		<div className='fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm'>
			{toasts.map(toast => {
				const Icon = icons[toast.type]
				return (
					<div
						key={toast.id}
						className={`flex items-start gap-3 rounded-lg border p-4 backdrop-blur-sm shadow-lg animate-in slide-in-from-right ${styles[toast.type]}`}
					>
						<Icon className='h-5 w-5 shrink-0 mt-0.5' />
						<div className='flex-1 min-w-0'>
							<p className='font-medium text-sm'>{toast.title}</p>
							{toast.description && (
								<p className='text-xs mt-0.5 opacity-80'>{toast.description}</p>
							)}
						</div>
						<button
							onClick={() => onDismiss(toast.id)}
							className='shrink-0 opacity-60 hover:opacity-100 transition-opacity'
						>
							<X className='h-4 w-4' />
						</button>
					</div>
				)
			})}
		</div>
	)
}

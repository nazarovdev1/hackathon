import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

const tone = {
	ELIGIBLE: 'border-emerald-500/20 bg-emerald-50 text-emerald-700 dark:border-emerald-400/30 dark:bg-emerald-500/10 dark:text-emerald-300',
	RISK: 'border-amber-500/20 bg-amber-50 text-amber-700 dark:border-amber-400/30 dark:bg-amber-500/10 dark:text-amber-300',
	DENIED: 'border-rose-500/20 bg-rose-50 text-rose-700 dark:border-rose-400/30 dark:bg-rose-500/10 dark:text-rose-300',
	LOW: 'border-emerald-500/20 bg-emerald-50 text-emerald-700 dark:border-emerald-400/30 dark:bg-emerald-500/10 dark:text-emerald-300',
	MEDIUM: 'border-amber-500/20 bg-amber-50 text-amber-700 dark:border-amber-400/30 dark:bg-amber-500/10 dark:text-amber-300',
	HIGH: 'border-rose-500/20 bg-rose-50 text-rose-700 dark:border-rose-400/30 dark:bg-rose-500/10 dark:text-rose-300',
	ACTIVE: 'border-emerald-500/20 bg-emerald-50 text-emerald-700 dark:border-emerald-400/30 dark:bg-emerald-500/10 dark:text-emerald-300',
	SUSPENDED: 'border-amber-500/20 bg-amber-50 text-amber-700 dark:border-amber-400/30 dark:bg-amber-500/10 dark:text-amber-300',
	EXPELLED: 'border-rose-500/20 bg-rose-50 text-rose-700 dark:border-rose-400/30 dark:bg-rose-500/10 dark:text-rose-300',
} as const

export function StatusBadge({ value }: { value: keyof typeof tone }) {
	return (
		<Badge className={cn('border font-medium', tone[value])}>{value}</Badge>
	)
}

'use client'

import type { HTMLMotionProps } from 'framer-motion'
import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

interface MotionPanelProps extends HTMLMotionProps<'div'> {
	children: ReactNode
	delay?: number
}

export function MotionPanel({
	children,
	delay = 0,
	...props
}: MotionPanelProps) {
	return (
		<motion.div
			initial={{ opacity: 0, y: 14 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.45, delay, ease: 'easeOut' }}
			{...props}
		>
			{children}
		</motion.div>
	)
}

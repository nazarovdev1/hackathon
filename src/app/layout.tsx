import { GlobalLoading } from '@/components/providers/global-loading'
import { ThemeProvider } from '@/components/providers/theme-provider'
import { TooltipProvider } from '@/components/ui/tooltip'
import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
	title: 'EDUMETRIC | University Analytics',
	description: 'Grant monitoring and KPI analytics platform for universities.',
	icons: {
		icon: '/favicon.svg',
		shortcut: '/favicon.svg',
		apple: '/favicon.svg',
	},
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang='uz' className='h-full antialiased' suppressHydrationWarning>
			<body className='min-h-full bg-background text-foreground transition-colors duration-200'>
				<GlobalLoading />
				<ThemeProvider
					attribute='class'
					defaultTheme='light'
					enableSystem={false}
					disableTransitionOnChange
				>
					<TooltipProvider>{children}</TooltipProvider>
				</ThemeProvider>
			</body>
		</html>
	)
}

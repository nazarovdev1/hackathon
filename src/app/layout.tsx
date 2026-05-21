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
			<head>
				<script
					id='strip-extension-hydration-attrs'
					suppressHydrationWarning
					dangerouslySetInnerHTML={{
						__html: `
							(function () {
								function cleanNode(node) {
									if (!node || node.nodeType !== 1) return;
									var attrs = Array.prototype.slice.call(node.attributes || []);
									for (var i = 0; i < attrs.length; i++) {
										var name = attrs[i].name;
										if (name === 'bis_skin_checked' || name === 'bis_register' || name.indexOf('__processed_') === 0) {
											node.removeAttribute(name);
										}
									}
								}

								function cleanTree(root) {
									cleanNode(root);
									var all = root.querySelectorAll ? root.querySelectorAll('*') : [];
									for (var j = 0; j < all.length; j++) cleanNode(all[j]);
								}

								cleanTree(document.documentElement);
								new MutationObserver(function (mutations) {
									for (var i = 0; i < mutations.length; i++) {
										if (mutations[i].type === 'attributes') cleanNode(mutations[i].target);
										for (var j = 0; j < mutations[i].addedNodes.length; j++) cleanTree(mutations[i].addedNodes[j]);
									}
								}).observe(document.documentElement, {
									subtree: true,
									childList: true,
									attributes: true,
									attributeFilter: ['bis_skin_checked', 'bis_register']
								});
							})();
						`
					}}
				/>
			</head>
			<body
				className='min-h-full bg-background text-foreground transition-colors duration-200'
				suppressHydrationWarning
			>
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

import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ErrorBoundary } from '@/components/error-boundary'
import { ThemeProvider } from '@/components/theme-provider'
import content from '../../data/content.json'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: content.metadata.title,
    template: '%s | Soumitra Ghosh',
  },
  description: content.metadata.description,
  keywords: content.metadata.keywords,
  authors: [{ name: content.metadata.author }],
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className} suppressHydrationWarning={true}>
        <ErrorBoundary>
          <ThemeProvider>
            {children}
          </ThemeProvider>
        </ErrorBoundary>
      </body>
    </html>
  )
}

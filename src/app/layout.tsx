import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ErrorBoundary } from '@/components/error-boundary'
import { ThemeProvider } from '@/components/theme-provider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Engineering Leader - Innovation-Driven Technology Leadership',
  description: '28 years of experience building scalable SaaS products, leading high-performing teams, and driving innovation across backend/frontend architectures, cloud computing, and DevOps processes.',
  keywords: 'Engineering Leader, CTO, Technology Leadership, SaaS, Backend Architecture, Cloud Computing, DevOps',
  authors: [{ name: 'Engineering Leader' }],
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
      <body className={inter.className}>
        <ErrorBoundary>
          <ThemeProvider>
            {children}
          </ThemeProvider>
        </ErrorBoundary>
      </body>
    </html>
  )
} 
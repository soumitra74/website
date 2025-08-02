import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Engineering Leader - Innovation-Driven Technology Leadership',
  description: '28 years of experience building scalable SaaS products, leading high-performing teams, and driving innovation across backend/frontend architectures, cloud computing, and DevOps processes.',
  keywords: 'Engineering Leader, CTO, Technology Leadership, SaaS, Backend Architecture, Cloud Computing, DevOps',
  authors: [{ name: 'Engineering Leader' }],
  viewport: 'width=device-width, initial-scale=1',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
} 
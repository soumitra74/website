import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Now',
  description:
    'What Soumitra is working on, learning, and excited about right now — updated monthly.',
}

export default function NowLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}

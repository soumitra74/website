import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Now Archive',
  description:
    'Past monthly Now snapshots from Soumitra Ghosh — what he was working on, learning, and excited about.',
}

export default function NowArchiveLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}

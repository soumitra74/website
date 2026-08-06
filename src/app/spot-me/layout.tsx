import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Spot Me',
  description:
    'See what Soumitra Ghosh is up to right now — coding, reading, or learning based on a live daily schedule.',
}

export default function SpotMeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}

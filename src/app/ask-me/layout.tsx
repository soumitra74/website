import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Ask Me',
  description:
    "Chat with an AI assistant about Soumitra Ghosh's experience, leadership background, and career journey.",
}

export default function AskMeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}

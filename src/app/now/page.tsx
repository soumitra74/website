'use client'

import React, { useState, useEffect } from 'react'
import { ArrowLeft, Calendar, Briefcase, BookOpen, Sparkles, type LucideIcon } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ThemeToggle } from '@/components/theme-toggle'
import { AnimatedBackground } from '@/components/ui/animated-background'
import Link from 'next/link'
import Image from 'next/image'

interface NowSection {
  id: string
  question: string
  icon: string
  paragraphs: string[]
}

interface NowContent {
  title: string
  subtitle: string
  last_updated: string
  intro: string
  sections: NowSection[]
}

const sectionIcons: Record<string, LucideIcon> = {
  Briefcase,
  BookOpen,
  Sparkles,
}

export default function NowPage() {
  const [nowData, setNowData] = useState<NowContent | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchNowData = async () => {
      try {
        const response = await fetch('/api/now')
        if (response.ok) {
          const data = await response.json()
          setNowData(data)
        }
      } catch (error) {
        console.error('Error fetching now content:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchNowData()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 ambient:ambient-gradient-bg ambient:dark:ambient-gradient-bg-dark transition-colors duration-300 flex items-center justify-center relative">
        <AnimatedBackground />
        <div className="text-center relative z-10">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">Loading Now...</p>
        </div>
      </div>
    )
  }

  if (!nowData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 ambient:ambient-gradient-bg ambient:dark:ambient-gradient-bg-dark transition-colors duration-300 flex items-center justify-center relative">
        <AnimatedBackground />
        <div className="text-center relative z-10">
          <p className="text-slate-600 dark:text-slate-400">Failed to load Now content.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 ambient:ambient-gradient-bg ambient:dark:ambient-gradient-bg-dark transition-colors duration-300 relative">
      <AnimatedBackground />

      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 ambient:glass-nav ambient:dark:glass-nav-dark backdrop-blur-md border-b border-slate-200 dark:border-slate-700 transition-colors duration-300">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-4">
              <Link href="/" className="flex items-center gap-3 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors">
                <ArrowLeft className="w-4 h-4" />
                <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-slate-200 dark:border-slate-600 profile-light-pulse-small ambient:glass-glow">
                  <Image
                    src="/images/profile.png"
                    alt="Soumitra Ghosh"
                    width={32}
                    height={32}
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="text-xl font-bold text-slate-900 dark:text-white">Back to Home</span>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-slate-600 dark:text-slate-400 font-medium">Now</span>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-slate-900 dark:text-white mb-6 transition-colors">
            {nowData.title}
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed transition-colors mb-4">
            {nowData.subtitle}
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xl mx-auto transition-colors">
            {nowData.intro}
          </p>
        </div>

        <div className="space-y-6">
          {nowData.sections.map((section) => {
            const Icon = sectionIcons[section.icon] || Sparkles
            return (
              <Card
                key={section.id}
                className="hover:shadow-lg transition-all dark:bg-slate-800 dark:border-slate-700 ambient:glass-card ambient:dark:glass-card-dark"
              >
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Icon className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                    <CardTitle className="text-2xl dark:text-white transition-colors">
                      {section.question}
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {section.paragraphs.map((paragraph, index) => (
                    <p
                      key={index}
                      className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed transition-colors"
                    >
                      {paragraph}
                    </p>
                  ))}
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className="mt-8 text-center">
          <Badge variant="outline" className="dark:border-slate-600 dark:text-slate-300">
            <Calendar className="w-3 h-3 mr-2" />
            Last updated: {nowData.last_updated}
          </Badge>
        </div>
      </div>
    </div>
  )
}

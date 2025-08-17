'use client'

import React, { useState, useEffect } from 'react'
import { ArrowLeft, ExternalLink, Play, BookOpen, Monitor } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ThemeToggle } from '@/components/theme-toggle'
import { AnimatedBackground } from '@/components/ui/animated-background'
import { WebsiteEmbed } from '@/components/ui/website-embed'
import Link from 'next/link'
import Image from 'next/image'

interface DailySchedule {
  common_sections: {
    websites: Array<{
      name: string
      url: string
    }>
    youtube_channels: Array<{
      name: string
      url: string
    }>
    coding_activities: string[]
  }
  daily_routines: {
    weekday: { [key: string]: string }
    weekend: { [key: string]: string }
    holiday: { [key: string]: string }
  }
  indian_holidays: Array<{
    date: string
    name: string
    type: string
  }>
}

interface CurrentActivity {
  type: 'website' | 'youtube' | 'coding' | 'other'
  title: string
  description: string
  url?: string
  embedUrl?: string
}

export default function SpotMePage() {
  const [scheduleData, setScheduleData] = useState<DailySchedule | null>(null)
  const [currentActivity, setCurrentActivity] = useState<CurrentActivity | null>(null)
  const [loading, setLoading] = useState(true)

  // Fetch schedule data
  useEffect(() => {
    const fetchScheduleData = async () => {
      try {
        const response = await fetch('/api/daily-schedule')
        if (response.ok) {
          const data = await response.json()
          setScheduleData(data)
        }
      } catch (error) {
        console.error('Error fetching schedule data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchScheduleData()
  }, [])

  // Determine current activity based on time
  useEffect(() => {
    if (!scheduleData) return

    const now = new Date()
    const currentHour = now.getHours()
    const currentMinute = now.getMinutes()
    const timeString = `${currentHour.toString().padStart(2, '0')}:${currentMinute.toString().padStart(2, '0')}`
    
    // Determine day type
    const dayOfWeek = now.getDay()
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6
    const isHoliday = checkIfHoliday(now, scheduleData.indian_holidays)
    
    let routine: { [key: string]: string }
    if (isHoliday) {
      routine = scheduleData.daily_routines.holiday
    } else if (isWeekend) {
      routine = scheduleData.daily_routines.weekend
    } else {
      routine = scheduleData.daily_routines.weekday
    }

    // Find current activity
    const currentActivityDescription = findCurrentActivity(timeString, routine)
    
    if (currentActivityDescription) {
      const activity = generateActivity(currentActivityDescription, scheduleData)
      setCurrentActivity(activity)
    } else {
      setCurrentActivity(null)
    }
  }, [scheduleData])

  const checkIfHoliday = (date: Date, holidays: Array<{ date: string; name: string; type: string }>) => {
    const dateString = date.toISOString().split('T')[0]
    return holidays.some(holiday => holiday.date === dateString)
  }

  const findCurrentActivity = (timeString: string, routine: { [key: string]: string }) => {
    const times = Object.keys(routine).sort()
    let currentActivity = null
    
    for (let i = 0; i < times.length; i++) {
      if (timeString >= times[i]) {
        currentActivity = routine[times[i]]
      } else {
        break
      }
    }
    
    return currentActivity
  }

  const generateActivity = (description: string, scheduleData: DailySchedule): CurrentActivity => {
    const lowerDescription = description.toLowerCase()
    
    // Check if it's learning time (reading/watching)
    if (lowerDescription.includes('learning') || lowerDescription.includes('reading') || lowerDescription.includes('watching')) {
      // 70% chance for website, 30% chance for YouTube
      const isWebsite = Math.random() < 0.7
      
      if (isWebsite) {
        const randomWebsite = scheduleData.common_sections.websites[Math.floor(Math.random() * scheduleData.common_sections.websites.length)]
        return {
          type: 'website',
          title: `Reading at ${randomWebsite.name}`,
          description: `Soumitra is reading the latest news and articles at ${randomWebsite.name}`,
          url: randomWebsite.url,
          embedUrl: randomWebsite.url
        }
      } else {
        const randomChannel = scheduleData.common_sections.youtube_channels[Math.floor(Math.random() * scheduleData.common_sections.youtube_channels.length)]
        return {
          type: 'youtube',
          title: `Watching ${randomChannel.name}`,
          description: `Soumitra is watching educational content on ${randomChannel.name}`,
          url: randomChannel.url,
          embedUrl: randomChannel.url
        }
      }
    }
    
    // Check if it's coding time
    if (lowerDescription.includes('coding') || lowerDescription.includes('development') || lowerDescription.includes('projects')) {
      const randomActivity = scheduleData.common_sections.coding_activities[Math.floor(Math.random() * scheduleData.common_sections.coding_activities.length)]
      return {
        type: 'coding',
        title: 'Coding Activity',
        description: `Soumitra is currently ${randomActivity.toLowerCase()}`
      }
    }
    
    // Default activity
    return {
      type: 'other',
      title: 'Current Activity',
      description: description
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 ambient:ambient-gradient-bg ambient:dark:ambient-gradient-bg-dark transition-colors duration-300 flex items-center justify-center relative">
        <AnimatedBackground />
        <div className="text-center relative z-10">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">Loading current activity...</p>
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
              <span className="text-sm text-slate-600 dark:text-slate-400 font-medium">Spot Me</span>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-slate-900 dark:text-white mb-6 transition-colors">
            Spot Me
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed transition-colors">
            See what Soumitra is currently up to based on his daily routine
          </p>
        </div>

        {currentActivity ? (
          <div className="space-y-8">
            {/* Activity Card */}
            <Card className="hover:shadow-lg transition-all dark:bg-slate-800 dark:border-slate-700 ambient:glass-card ambient:dark:glass-card-dark">
              <CardHeader>
                <div className="flex items-center gap-3">
                  {currentActivity.type === 'website' && <BookOpen className="w-6 h-6 text-emerald-600" />}
                  {currentActivity.type === 'youtube' && <Play className="w-6 h-6 text-red-600" />}
                  {currentActivity.type === 'coding' && <Monitor className="w-6 h-6 text-blue-600" />}
                  {currentActivity.type === 'other' && <BookOpen className="w-6 h-6 text-slate-600" />}
                  <CardTitle className="text-2xl dark:text-white transition-colors">
                    {currentActivity.title}
                  </CardTitle>
                </div>
                <CardDescription className="text-lg text-slate-600 dark:text-slate-300 transition-colors">
                  {currentActivity.description}
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Embed Card - Only show for website or YouTube */}
            {(currentActivity.type === 'website' || currentActivity.type === 'youtube') && currentActivity.embedUrl && (
              <Card className="hover:shadow-lg transition-all dark:bg-slate-800 dark:border-slate-700 ambient:glass-card ambient:dark:glass-card-dark">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl dark:text-white transition-colors">
                      {currentActivity.type === 'website' ? 'Current Reading' : 'Currently Watching'}
                    </CardTitle>
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                      className="dark:border-slate-600 dark:text-slate-300"
                    >
                      <a href={currentActivity.url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Open
                      </a>
                    </Button>
                  </div>
                </CardHeader>
                                  <CardContent>
                    <div className="aspect-video w-full rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-700">
                      {currentActivity.type === 'website' ? (
                        <WebsiteEmbed
                          url={currentActivity.embedUrl || ''}
                          title={currentActivity.title}
                          description={currentActivity.description}
                          className="w-full h-full"
                        />
                      ) : (
                        <iframe
                          src={currentActivity.embedUrl.replace('/@', '/embed/')}
                          className="w-full h-full"
                          title={currentActivity.title}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      )}
                    </div>
                  </CardContent>
              </Card>
            )}
          </div>
        ) : (
          <Card className="hover:shadow-lg transition-all dark:bg-slate-800 dark:border-slate-700 ambient:glass-card ambient:dark:glass-card-dark">
            <CardContent className="py-12">
              <div className="text-center">
                <BookOpen className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2 transition-colors">
                  No Active Reading/Watching
                </h3>
                <p className="text-slate-600 dark:text-slate-400 transition-colors">
                  Soumitra is currently not reading any websites or watching videos.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Time Info */}
        <div className="mt-8 text-center">
          <Badge variant="outline" className="dark:border-slate-600 dark:text-slate-300">
            Last updated: {new Date().toLocaleTimeString()}
          </Badge>
        </div>
      </div>
    </div>
  )
}

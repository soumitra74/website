'use client'

import React, { useState, useEffect } from 'react'
import { X, ExternalLink, Play, BookOpen, Monitor, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { WebsiteEmbed } from '@/components/ui/website-embed'
import { convertToIST, getTimezoneInfo } from '@/lib/utils'

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

interface SpotMePopupProps {
  isOpen: boolean
  onClose: () => void
  refreshTrigger: number
}

export default function SpotMePopup({ isOpen, onClose, refreshTrigger }: SpotMePopupProps) {
  const [scheduleData, setScheduleData] = useState<DailySchedule | null>(null)
  const [currentActivity, setCurrentActivity] = useState<CurrentActivity | null>(null)
  const [loading, setLoading] = useState(true)
  const [showContent, setShowContent] = useState(false)
  const [timezoneInfo, setTimezoneInfo] = useState<{
    localTime: string
    istTime: string
    timezone: string
  } | null>(null)

  // Fetch schedule data
  useEffect(() => {
    if (!isOpen) {
      setShowContent(false)
      return
    }

    const fetchScheduleData = async () => {
      setLoading(true)
      setShowContent(false)
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
        // Add a slight delay before showing content
        setTimeout(() => {
          setShowContent(true)
        }, 300)
      }
    }

    fetchScheduleData()
  }, [isOpen, refreshTrigger])

  // Determine current activity based on time
  useEffect(() => {
    if (!scheduleData) return

    const updateActivity = () => {
      const now = new Date()
      const istTime = convertToIST(now)
      const currentHour = istTime.getHours()
      const currentMinute = istTime.getMinutes()
      const timeString = `${currentHour.toString().padStart(2, '0')}:${currentMinute.toString().padStart(2, '0')}`
      
      // Update timezone information
      const tzInfo = getTimezoneInfo(now)
      setTimezoneInfo(tzInfo)
      
      // Determine day type based on IST time
      const dayOfWeek = istTime.getDay()
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6
      const isHoliday = checkIfHoliday(istTime, scheduleData.indian_holidays)
      
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
    }

    // Initial update
    updateActivity()

    // Set up interval to update every minute
    const interval = setInterval(updateActivity, 60000)

    return () => clearInterval(interval)
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

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Popup Content */}
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white dark:bg-slate-900 rounded-t-xl border-b border-slate-200 dark:border-slate-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Where is Soumitra?</h2>
              <p className="text-slate-600 dark:text-slate-400 mt-1">
                See what Soumitra is currently up to based on his daily routine
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto mb-4"></div>
              <p className="text-slate-600 dark:text-slate-400">Loading current activity...</p>
            </div>
          ) : !showContent ? (
            <div className="text-center py-12">
              <div className="animate-pulse">
                <div className="w-8 h-8 bg-emerald-200 dark:bg-emerald-800 rounded-full mx-auto mb-4"></div>
                <p className="text-slate-600 dark:text-slate-400">Preparing your personalized view...</p>
              </div>
            </div>
          ) : currentActivity ? (
            <div className={`space-y-6 transition-opacity duration-300 ${showContent ? 'opacity-100' : 'opacity-0'}`}>
              {/* Activity Card */}
              <Card className="hover:shadow-lg transition-all dark:bg-slate-800 dark:border-slate-700">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    {currentActivity.type === 'website' && <BookOpen className="w-6 h-6 text-emerald-600" />}
                    {currentActivity.type === 'youtube' && <Play className="w-6 h-6 text-red-600" />}
                    {currentActivity.type === 'coding' && <Monitor className="w-6 h-6 text-blue-600" />}
                    {currentActivity.type === 'other' && <BookOpen className="w-6 h-6 text-slate-600" />}
                    <CardTitle className="text-xl dark:text-white transition-colors">
                      {currentActivity.title}
                    </CardTitle>
                  </div>
                  <CardDescription className="text-base text-slate-600 dark:text-slate-300 transition-colors">
                    {currentActivity.description}
                  </CardDescription>
                  {timezoneInfo && (
                    <div className="flex items-center gap-2 mt-2 text-sm text-slate-500 dark:text-slate-400">
                      <Clock className="w-4 h-4" />
                      <span>Your time: {timezoneInfo.localTime} ({timezoneInfo.timezone})</span>
                      <span>•</span>
                      <span>Soumitra's time: {timezoneInfo.istTime}</span>
                    </div>
                  )}
                </CardHeader>
              </Card>

              {/* Embed Card - Only show for website or YouTube */}
              {(currentActivity.type === 'website' || currentActivity.type === 'youtube') && currentActivity.embedUrl && (
                <Card className="hover:shadow-lg transition-all dark:bg-slate-800 dark:border-slate-700">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg dark:text-white transition-colors">
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
            <div className={`transition-opacity duration-300 ${showContent ? 'opacity-100' : 'opacity-0'}`}>
              <Card className="hover:shadow-lg transition-all dark:bg-slate-800 dark:border-slate-700">
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
            </div>
          )}

          {/* Time Info */}
          <div className="mt-6 text-center">
            <Badge variant="outline" className="dark:border-slate-600 dark:text-slate-300">
              Last updated: {new Date().toLocaleTimeString()}
            </Badge>
            {timezoneInfo && (
              <div className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                <span>Your timezone: {timezoneInfo.timezone}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}



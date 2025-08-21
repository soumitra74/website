"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { DynamicIcon } from "@/components/ui/dynamic-icon"
import { getCareerTimelineData, CareerTimelineData } from "@/lib/career-timeline"
import { getContent, ContentData } from "@/lib/content"
import { MessageCircle, Play, Square, ArrowLeft, MapPin } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import SpotMePopup from "@/components/spot-me-popup"

export default function CareerTimeline() {
  const [selectedYear, setSelectedYear] = useState(2025)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [isHovering, setIsHovering] = useState(false)
  const [hoveredMonth, setHoveredMonth] = useState<string | null>(null)
  const [timelineData, setTimelineData] = useState<CareerTimelineData | null>(null)
  const [content, setContent] = useState<ContentData | null>(null)
  const [loading, setLoading] = useState(true)
  const [isPlayingForward, setIsPlayingForward] = useState(false)
  const [isPlayingBackward, setIsPlayingBackward] = useState(false)
  const [isSpotMeOpen, setIsSpotMeOpen] = useState(false)
  const [spotMeRefreshTrigger, setSpotMeRefreshTrigger] = useState(0)
  const circleRef = useRef<HTMLDivElement>(null)
  const playIntervalRef = useRef<NodeJS.Timeout | null>(null)

  // Function to get delay from URL parameters
  const getDelayFromUrl = useCallback(() => {
    if (typeof window === 'undefined') return null
    
    const urlParams = new URLSearchParams(window.location.search)
    const delayParam = urlParams.get('delay')
    
    if (delayParam) {
      const delay = parseInt(delayParam)
      return isNaN(delay) ? null : delay
    }
    
    return null
  }, [])

  // Function to get effective delay (URL override or metadata default)
  const getEffectiveDelay = useCallback(() => {
    const urlDelay = getDelayFromUrl()
    const metadataDelay = timelineData?.metadata?.delay || 5000
    
    return urlDelay || metadataDelay
  }, [getDelayFromUrl, timelineData?.metadata?.delay])

  // Load data on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const [timelineDataResult, contentResult] = await Promise.all([
          getCareerTimelineData(),
          getContent()
        ])
        setTimelineData(timelineDataResult)
        setContent(contentResult)
      } catch (error) {
        console.error('Error loading data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (playIntervalRef.current) {
        clearInterval(playIntervalRef.current)
      }
    }
  }, [])

  // Define all hooks before any conditional returns
  const years = timelineData?.metadata?.years || []
  const months = ["Dec", "Nov", "Oct", "Sep", "Aug", "Jul", "Jun", "May", "Apr", "Mar", "Feb", "Jan"]

  const getMonthsToShow = useCallback((year: number) => {
    return year === 2025 ? 8 : 12 // Show 8 months for current year, 12 for others
  }, [])

  const getAngleFromYear = useCallback((year: number) => {
    const yearIndex = years.indexOf(year)
    return (yearIndex * 360) / years.length - 90 // -90 to start from top
  }, [years])

  const getYearFromAngle = useCallback((angle: number) => {
    // Normalize angle to 0-360
    const normalizedAngle = (((angle + 90) % 360) + 360) % 360
    const yearIndex = Math.round((normalizedAngle * years.length) / 360) % years.length
    return years[yearIndex]
  }, [years])

  const handleYearChange = useCallback((newYear: number) => {
    if (newYear !== selectedYear) {
      setIsTransitioning(true)
      setTimeout(() => {
        setSelectedYear(newYear)
        setTimeout(() => setIsTransitioning(false), 50)
      }, 150)
    }
  }, [selectedYear])

  const stopPlayback = useCallback(() => {
    if (playIntervalRef.current) {
      clearInterval(playIntervalRef.current)
      playIntervalRef.current = null
    }
    setIsPlayingForward(false)
    setIsPlayingBackward(false)
  }, [])

  const handleSpotMeClick = () => {
    if (isSpotMeOpen) {
      // If already open, refresh the content
      setSpotMeRefreshTrigger(prev => prev + 1)
    } else {
      // Open the popup
      setIsSpotMeOpen(true)
    }
  }

  const handleSpotMeClose = () => {
    setIsSpotMeOpen(false)
  }

  const handlePlayForward = useCallback(() => {
    if (isPlayingForward) {
      stopPlayback()
      return
    }

    stopPlayback() // Stop any existing playback
    setIsPlayingForward(true)
    setIsPlayingBackward(false)

    let currentIndex = years.indexOf(selectedYear)
    if (currentIndex === -1) currentIndex = years.length - 1

    playIntervalRef.current = setInterval(() => {
      currentIndex = currentIndex === 0 ? years.length - 1 : currentIndex - 1
      handleYearChange(years[currentIndex])
    }, getEffectiveDelay())
  }, [isPlayingForward, selectedYear, years, handleYearChange, stopPlayback, getEffectiveDelay])

  const handlePlayBackward = useCallback(() => {
    if (isPlayingBackward) {
      stopPlayback()
      return
    }

    stopPlayback() // Stop any existing playback
    setIsPlayingBackward(true)
    setIsPlayingForward(false)

    let currentIndex = years.indexOf(selectedYear)
    if (currentIndex === -1) currentIndex = 0

    playIntervalRef.current = setInterval(() => {
      currentIndex = (currentIndex + 1) % years.length
      handleYearChange(years[currentIndex])
    }, getEffectiveDelay())
  }, [isPlayingBackward, selectedYear, years, handleYearChange, stopPlayback, getEffectiveDelay])

  // Early return after all hooks are defined
  if (loading || !timelineData || !content) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading career timeline...</div>
      </div>
    )
  }

  const selectedProject = timelineData.projects[selectedYear] || {
    title: "No project data",
    description: "No project information available for this year.",
    techStack: [],
    achievements: [],
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
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
            
            {/* Center CTA */}
            <div className="flex-1 flex justify-center">
              <Button
                onClick={handleSpotMeClick}
                variant="outline"
                size="sm"
                className="bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-900/20 dark:hover:bg-emerald-900/30 border-emerald-200 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300 hover:text-emerald-800 dark:hover:text-emerald-200 transition-all duration-200 shadow-sm hover:shadow-md"
              >
                <MapPin className="w-4 h-4 mr-2" />
                Where is Soumitra?
              </Button>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm text-slate-600 dark:text-slate-400 font-medium">Career Timeline</span>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </nav>

      {/* Timeline Content */}
      <div className="flex items-center justify-center p-4">
        <div className="relative flex items-center gap-8 min-h-[800px]">
          {/* Main Circle Container */}
          <div ref={circleRef} className="relative w-96 h-96 md:w-[600px] md:h-[600px]">
            {/* Outer Ring with Year Markers */}
            <div className="absolute inset-0 rounded-full border-[20px] border-slate-700/50 bg-gradient-to-br from-slate-800 to-slate-900">
              {years.map((year, index) => {
                const angle = (index * 360) / years.length - 90
                const isSelected = year === selectedYear
                const radius = 290 // Increased from 240
                const x = Math.cos((angle * Math.PI) / 180) * radius
                const y = Math.sin((angle * Math.PI) / 180) * radius

                return (
                  <div
                    key={year}
                    className="absolute text-xs font-mono cursor-pointer transition-all duration-200 select-none px-3 py-2 rounded-lg hover:bg-cyan-400/20 hover:scale-125 active:scale-110"
                    style={{
                      left: "50%",
                      top: "50%",
                      transform: `translate(${x}px, ${y}px) translate(-50%, -50%)`,
                      color: isSelected ? "#22d3ee" : "#94a3b8",
                      fontWeight: isSelected ? "bold" : "normal",
                      textShadow: isSelected ? "0 0 10px rgba(34, 211, 238, 0.5)" : "none",
                      backgroundColor: isSelected ? "rgba(34, 211, 238, 0.1)" : "transparent",
                      border: isSelected ? "1px solid rgba(34, 211, 238, 0.3)" : "1px solid transparent",
                    }}
                    onClick={() => handleYearChange(year)}
                    title={`Click to view ${year}`}
                  >
                    {String(year).slice(-2)}
                  </div>
                )
              })}
            </div>

            <div className="absolute inset-8 rounded-full border-[12px] border-slate-600/30 bg-transparent">
              {Array.from({ length: getMonthsToShow(selectedYear) }).map((_, index) => {
                const monthsToShow = getMonthsToShow(selectedYear)
                const angle = (index * 360) / monthsToShow - 90
                const radius = 220
                const x = Math.cos((angle * Math.PI) / 180) * radius
                const y = Math.sin((angle * Math.PI) / 180) * radius
                const monthName = months[index]

                return (
                  <div
                    key={`${selectedYear}-${index}`}
                    className="absolute w-3 h-3 bg-slate-500/60 rounded-full cursor-pointer hover:bg-cyan-400 hover:scale-150 transition-all duration-200"
                    style={{
                      left: "50%",
                      top: "50%",
                      transform: `translate(${x}px, ${y}px) translate(-50%, -50%)`,
                    }}
                    onMouseEnter={() => setHoveredMonth(monthName)}
                    onMouseLeave={() => setHoveredMonth(null)}
                  >
                    {/* Month label on hover */}
                    {hoveredMonth === monthName && (
                      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-slate-800 text-cyan-400 text-xs px-2 py-1 rounded shadow-lg border border-slate-600 whitespace-nowrap z-10">
                        {monthName}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>

            

            {/* Inner Content Circle */}
            <div className="absolute inset-20 rounded-full bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-sm border border-slate-600/50 flex items-center justify-center p-8">
              <Card
                className={`bg-slate-800/80 border-slate-600/50 p-6 text-center max-w-sm transition-all duration-300 cursor-pointer ${
                  isTransitioning ? "opacity-0 scale-95 blur-sm" : "opacity-100 scale-100 blur-0"
                } ${isHovering ? "border-cyan-400/50 shadow-lg shadow-cyan-500/20" : ""}`}
                onMouseEnter={() => {
                  setIsHovering(true)
                }}
                onMouseLeave={() => {
                  setIsHovering(false)
                }}
              >
                <div className="text-3xl font-bold text-cyan-400 mb-3 transition-all duration-300">{selectedYear}</div>
                <h3 className="text-xl font-semibold text-white mb-4 leading-tight transition-all duration-300">
                  {selectedProject.title}
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed transition-all duration-300">
                  {selectedProject.description}
                </p>
              </Card>
            </div>

            {/* Decorative Elements */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-500/10 to-blue-500/10 animate-pulse"></div>

            {/* Glow Effect */}
            <div className="absolute inset-0 rounded-full shadow-2xl shadow-cyan-500/20"></div>

            {/* Play Controls - 100px below the circle center */}
            <div className="absolute left-1/2 transform -translate-x-1/2 top-full mt-[50px]">
              <div className="flex flex-col items-center gap-4">
                <div className="flex items-center gap-[150px]">
                  {/* Play Forward Button */}
                  <button
                    onClick={handlePlayForward}
                    disabled={isPlayingBackward}
                    className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                      isPlayingForward
                        ? 'bg-red-600 hover:bg-red-700 text-white shadow-lg'
                        : isPlayingBackward
                        ? 'bg-slate-600 text-slate-400 cursor-not-allowed'
                        : 'bg-cyan-600 hover:bg-cyan-700 text-white shadow-lg hover:shadow-xl'
                    }`}
                  >
                    {isPlayingForward ? (
                      <>
                        <Square className="w-4 h-4" />
                        Stop
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4" />
                        Play
                      </>
                    )}
                  </button>

                  {/* Play Backward Button */}
                  <button
                    onClick={handlePlayBackward}
                    disabled={isPlayingForward}
                    className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                      isPlayingBackward
                        ? 'bg-red-600 hover:bg-red-700 text-white shadow-lg'
                        : isPlayingForward
                        ? 'bg-slate-600 text-slate-400 cursor-not-allowed'
                        : 'bg-purple-600 hover:bg-purple-700 text-white shadow-lg hover:shadow-xl'
                    }`}
                  >
                    {isPlayingBackward ? (
                      <>
                        <Square className="w-4 h-4" />
                        Stop
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 rotate-180" />
                        Rewind
                      </>
                    )}
                  </button>
                </div>
                
                {/* Delay indicator */}
                <div className="text-xs text-slate-400 bg-slate-800/50 px-3 py-1 rounded-lg border border-slate-600/30">
                  Delay: {getEffectiveDelay()}ms
                  {getDelayFromUrl() !== null && (
                    <span className="text-cyan-400 ml-2">(URL override)</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Hover details card on the right side */}
          <div
            className={`transition-all duration-300 ease-out z-50 ${
              isHovering ? "opacity-100 translate-x-0" : "opacity-30 translate-x-8"
            }`}
          >
            <Card className="w-80 bg-gradient-to-b from-slate-200/90 to-slate-800/90 dark:from-slate-700/90 dark:to-slate-900/90 border-2 border-cyan-500/50 backdrop-blur-sm p-6 shadow-2xl">
              {/* Debug indicator */}
              {isHovering && (
                <div className="absolute -top-2 -left-2 w-4 h-4 bg-green-500 rounded-full animate-pulse"></div>
              )}
              <div className="space-y-4">
                {/* Screenshot */}
                {selectedProject.screenshot && (
                  <div className="rounded-lg overflow-hidden">
                    <img
                      src={selectedProject.screenshot || "/images/career-timeline/placeholder.svg"}
                      alt={`${selectedProject.title} screenshot`}
                      className="w-full h-48 object-cover"
                    />
                  </div>
                )}

                {/* Tech Stack */}
                {selectedProject.techStack && selectedProject.techStack.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-cyan-400 mb-2">Tech Stack</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedProject.techStack.map((tech, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-slate-700/50 text-slate-300 text-xs rounded-md border border-slate-600/30"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Achievements */}
                {selectedProject.achievements && selectedProject.achievements.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-cyan-400 mb-2">Key Achievements</h4>
                    <ul className="space-y-1">
                      {selectedProject.achievements.map((achievement, index) => (
                        <li key={index} className="text-xs text-slate-100 flex items-start">
                          <span className="text-cyan-400 mr-2">•</span>
                          {achievement}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Video Link */}
                {selectedProject.videoUrl && (
                  <div>
                    <h4 className="text-sm font-semibold text-cyan-400 mb-2">Demo Video</h4>
                    <a
                      href={selectedProject.videoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-xs text-slate-300 hover:text-cyan-400 transition-colors duration-200"
                    >
                      <span className="mr-1">▶</span>
                      Watch Demo
                    </a>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* SpotMe Popup */}
      <SpotMePopup
        isOpen={isSpotMeOpen}
        onClose={handleSpotMeClose}
        refreshTrigger={spotMeRefreshTrigger}
      />
    </div>
  )
}

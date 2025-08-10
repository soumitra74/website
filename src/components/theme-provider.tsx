'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { Theme, getThemeFromLocalStorage, setThemeInLocalStorage, getEffectiveTheme } from '@/lib/theme'

interface ThemeContextType {
  theme: Theme
  effectiveTheme: 'light' | 'dark'
  setTheme: (theme: Theme) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('light')
  const [effectiveTheme, setEffectiveTheme] = useState<'light' | 'dark'>('light')

  useEffect(() => {
    const storedTheme = getThemeFromLocalStorage()
    setThemeState(storedTheme)
    setEffectiveTheme(getEffectiveTheme(storedTheme))
  }, [])

  useEffect(() => {
    const newEffectiveTheme = getEffectiveTheme(theme)
    setEffectiveTheme(newEffectiveTheme)
    
    // Update document class for Tailwind CSS
    const root = document.documentElement
    root.classList.remove('light', 'dark', 'ambient')
    
    if (theme === 'ambient') {
      root.classList.add('ambient', newEffectiveTheme)
    } else {
      root.classList.add(newEffectiveTheme)
    }
    
    // Update meta theme-color
    const metaThemeColor = document.querySelector('meta[name="theme-color"]')
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', newEffectiveTheme === 'dark' ? '#0f172a' : '#ffffff')
    }
  }, [theme])

  // Update ambient theme based on time
  useEffect(() => {
    if (theme !== 'ambient') return

    const updateAmbientTheme = () => {
      const newEffectiveTheme = getEffectiveTheme(theme)
      setEffectiveTheme(newEffectiveTheme)
      
      // Update document class for ambient theme
      const root = document.documentElement
      root.classList.remove('light', 'dark')
      root.classList.add('ambient', newEffectiveTheme)
    }

    // Update every minute for ambient mode
    const interval = setInterval(updateAmbientTheme, 60000)
    
    // Also update on visibility change (when user returns to tab)
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        updateAmbientTheme()
      }
    }
    
    document.addEventListener('visibilitychange', handleVisibilityChange)
    
    return () => {
      clearInterval(interval)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [theme])

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme)
    setThemeInLocalStorage(newTheme)
  }

  return (
    <ThemeContext.Provider value={{ theme, effectiveTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
} 
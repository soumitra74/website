export type Theme = 'light' | 'dark' | 'ambient'

export function getAmbientTheme(): 'light' | 'dark' {
  const hour = new Date().getHours()
  
  // Morning: 6 AM - 6 PM (light)
  if (hour >= 6 && hour < 18) {
    return 'light'
  }
  
  // Night: 6 PM - 6 AM (dark)
  return 'dark'
}

export function getThemeFromLocalStorage(): Theme {
  if (typeof window === 'undefined') return 'light'
  
  const stored = localStorage.getItem('theme')
  if (stored === 'dark' || stored === 'light' || stored === 'ambient') {
    return stored
  }
  
  return 'light'
}

export function setThemeInLocalStorage(theme: Theme) {
  if (typeof window === 'undefined') return
  localStorage.setItem('theme', theme)
}

export function getEffectiveTheme(theme: Theme): 'light' | 'dark' {
  if (theme === 'ambient') {
    return getAmbientTheme()
  }
  return theme
} 
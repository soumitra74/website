import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Convert visitor's local time to IST (Indian Standard Time)
 * @param localDate - The visitor's local date/time
 * @returns The equivalent time in IST
 */
export function convertToIST(localDate: Date): Date {
  try {
    // Use toLocaleString with timeZone option for simple conversion
    const istTimeString = localDate.toLocaleString('en-US', {
      timeZone: 'Asia/Kolkata'
    })
    
    return new Date(istTimeString)
  } catch (error) {
    console.error('Error converting to IST:', error)
    // Fallback: return the original date if conversion fails
    return localDate
  }
}

/**
 * Get the current time in IST
 * @returns Current time in IST
 */
export function getCurrentISTTime(): Date {
  return convertToIST(new Date())
}

/**
 * Format time for display with timezone information
 * @param date - The date to format
 * @param showTimezone - Whether to show timezone info
 * @returns Formatted time string
 */
export function formatTimeWithTimezone(date: Date, showTimezone: boolean = true): string {
  const hours = date.getHours().toString().padStart(2, '0')
  const minutes = date.getMinutes().toString().padStart(2, '0')
  
  if (showTimezone) {
    return `${hours}:${minutes} IST`
  }
  
  return `${hours}:${minutes}`
}

/**
 * Get timezone information for display
 * @param localDate - The visitor's local date/time
 * @returns Object with timezone information
 */
export function getTimezoneInfo(localDate: Date) {
  try {
    // Get local time with timezone name
    const localTimeString = localDate.toLocaleTimeString('en-US', { 
      hour12: false, 
      hour: '2-digit', 
      minute: '2-digit',
      timeZoneName: 'short'
    })
    
    // Get IST time using toLocaleString
    const istTimeString = localDate.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Asia/Kolkata'
    })
    
    return {
      localTime: localTimeString,
      istTime: `${istTimeString} IST`,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
    }
  } catch (error) {
    console.error('Error getting timezone info:', error)
    // Fallback: return basic timezone info
    return {
      localTime: localDate.toLocaleTimeString('en-US', { hour12: false }),
      istTime: 'Unknown',
      timezone: 'Unknown'
    }
  }
} 
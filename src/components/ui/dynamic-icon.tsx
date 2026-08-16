import React from 'react'
import { 
  ArrowRight, 
  Mail, 
  Linkedin, 
  MapPin, 
  Calendar, 
  Users, 
  Award, 
  Code, 
  Database, 
  Cloud, 
  Zap,
  Sun,
  Moon,
  Monitor,
  ChevronDown,
  Send,
  ArrowLeft,
  Bot,
  User,
  Loader2,
  MessageCircle
} from "lucide-react"

const Github = ({ className, size }: { className?: string; size?: number }) => (
  <svg
    className={className}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
  </svg>
)

// Custom Medium Icon Component
const Medium = ({ className, size }: { className?: string; size?: number }) => (
  <svg 
    className={className} 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="currentColor"
  >
    <path d="M13.54 12a6.8 6.8 0 01-6.77 6.82A6.8 6.8 0 010 12a6.8 6.8 0 016.77-6.82A6.8 6.8 0 0113.54 12zM20.96 12c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z"/>
  </svg>
)

interface DynamicIconProps {
  name: string
  className?: string
  size?: number
}

const iconMap: { [key: string]: React.ComponentType<any> } = {
  ArrowRight,
  Mail,
  Linkedin,
  MapPin,
  Calendar,
  Users,
  Award,
  Code,
  Database,
  Cloud,
  Zap,
  Sun,
  Moon,
  Monitor,
  ChevronDown,
  Send,
  ArrowLeft,
  Bot,
  User,
  Loader2,
  MessageCircle,
  Github,
  Medium,
}

export function DynamicIcon({ name, className = "", size = 16 }: DynamicIconProps) {
  const IconComponent = iconMap[name]
  
  if (!IconComponent) {
    console.warn(`Icon "${name}" not found`)
    return null
  }
  
  return <IconComponent className={className} size={size} />
} 
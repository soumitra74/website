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
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
  Zap 
} from "lucide-react"

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
}

export function DynamicIcon({ name, className = "", size = 16 }: DynamicIconProps) {
  const IconComponent = iconMap[name]
  
  if (!IconComponent) {
    console.warn(`Icon "${name}" not found`)
    return null
  }
  
  return <IconComponent className={className} size={size} />
} 
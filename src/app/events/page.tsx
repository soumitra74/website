'use client'

import React from 'react'
import { ArrowLeft, Calendar, MapPin, Users, ExternalLink, Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ThemeToggle } from '@/components/theme-toggle'
import { AnimatedBackground } from '@/components/ui/animated-background'
import Link from 'next/link'
import Image from 'next/image'

// Events data - you can move this to a separate JSON file later
const eventsData = [
  {
    id: 1,
    title: "DataDog Observability Summit",
    type: "Conference",
    date: "March 2024",
    location: "San Francisco, CA",
    description: "Presented on 'Building Observability-First Engineering Culture' and shared insights on implementing comprehensive monitoring strategies for distributed systems.",
    role: "Speaker",
    attendees: "500+",
    institution: "DataDog",
    image: "/images/events/datadog-summit.jpg",
    tags: ["Observability", "Monitoring", "Engineering Culture"],
    highlights: [
      "Keynote presentation on observability best practices",
      "Panel discussion on modern monitoring strategies",
      "Networking with industry leaders"
    ]
  },
  {
    id: 2,
    title: "Product Tank Meetup",
    type: "Community Event",
    date: "January 2024",
    location: "Bangalore, India",
    description: "Shared experiences on 'Product-Led Engineering Leadership' and how to align engineering teams with product strategy for better outcomes.",
    role: "Speaker",
    attendees: "150+",
    institution: "Product Tank",
    image: "/images/events/product-tank.jpg",
    tags: ["Product Strategy", "Leadership", "Community"],
    highlights: [
      "Interactive workshop on product-engineering alignment",
      "Q&A session with product managers and engineers",
      "Community building and networking"
    ]
  },
  {
    id: 3,
    title: "SAP TechEd Conference",
    type: "Technology Conference",
    date: "November 2023",
    location: "Las Vegas, NV",
    description: "Presented on 'Enterprise AI Integration Strategies' and discussed practical approaches to implementing AI solutions in large-scale enterprise environments.",
    role: "Speaker",
    attendees: "1000+",
    institution: "SAP",
    image: "/images/events/sap-teched.jpg",
    tags: ["Enterprise AI", "Integration", "Technology"],
    highlights: [
      "Technical deep-dive on AI integration patterns",
      "Enterprise architecture best practices",
      "Industry case studies and success stories"
    ]
  },
  {
    id: 4,
    title: "Visionet Innovation Summit",
    type: "Innovation Summit",
    date: "September 2023",
    location: "Mumbai, India",
    description: "Led a fireside chat on 'The Future of Fintech Engineering' and explored emerging trends in financial technology and engineering practices.",
    role: "Panelist",
    attendees: "300+",
    institution: "Visionet",
    image: "/images/events/visionet-summit.jpg",
    tags: ["Fintech", "Innovation", "Future Trends"],
    highlights: [
      "Fireside chat on fintech engineering trends",
      "Innovation showcase and demos",
      "Strategic discussions on industry evolution"
    ]
  }
]

export default function EventsPage() {
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
                <span className="text-xl font-bold text-slate-900 dark:text-white">Back to Home</span>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-slate-600 dark:text-slate-400 font-medium">Events & Speaking</span>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-slate-900 dark:text-white mb-6 transition-colors">
            Events & Speaking
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300 mb-8 max-w-3xl mx-auto leading-relaxed transition-colors">
            Sharing insights and experiences at industry conferences, meetups, and innovation summits. 
            From technical deep-dives to leadership discussions, I'm passionate about contributing to the tech community.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400">
              <Users className="w-4 h-4 mr-2" />
              15+ Events
            </Badge>
            <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">
              <Calendar className="w-4 h-4 mr-2" />
              Speaker & Panelist
            </Badge>
            <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400">
              <MapPin className="w-4 h-4 mr-2" />
              Global Reach
            </Badge>
          </div>
        </div>
      </section>

      {/* Events Grid */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-slate-900 ambient:glass-bg ambient:dark:glass-bg-dark transition-colors duration-300 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            {eventsData.map((event, index) => (
              <Card key={event.id} className="hover:shadow-lg transition-all dark:bg-slate-800 dark:border-slate-700 dark:hover:shadow-slate-900/50 ambient:glass-card ambient:dark:glass-card-dark ambient:hover:shadow-2xl ambient:dark:hover:shadow-slate-900/50 floating-glass">
                <div className="relative h-48 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800 rounded-t-lg overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <Calendar className="w-12 h-12 text-slate-400 dark:text-slate-500 mx-auto mb-2" />
                      <p className="text-slate-500 dark:text-slate-400 text-sm">Event Photo</p>
                    </div>
                  </div>
                  <Badge className="absolute top-4 right-4 bg-emerald-600 text-white">
                    {event.role}
                  </Badge>
                </div>
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <CardTitle className="text-xl dark:text-white transition-colors">{event.title}</CardTitle>
                    <Badge variant="outline" className="dark:border-slate-600 dark:text-slate-300">
                      {event.type}
                    </Badge>
                  </div>
                  <CardDescription className="text-lg font-semibold text-emerald-600 dark:text-emerald-400 transition-colors">
                    {event.institution}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600 dark:text-slate-300 mb-4 transition-colors">
                    {event.description}
                  </p>
                  
                  <div className="flex items-center gap-4 mb-4 text-sm text-slate-500 dark:text-slate-400">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {event.date}
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {event.location}
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {event.attendees}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {event.tags.map((tag, tagIndex) => (
                      <Badge key={tagIndex} variant="secondary" className="dark:bg-slate-700 dark:text-slate-300 text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-semibold text-slate-900 dark:text-white text-sm">Highlights:</h4>
                    <ul className="text-sm text-slate-600 dark:text-slate-300 space-y-1">
                      {event.highlights.map((highlight, highlightIndex) => (
                        <li key={highlightIndex} className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
                          {highlight}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-800 ambient:glass-bg ambient:dark:glass-bg-dark transition-colors duration-300 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4 transition-colors">
            Interested in Having Me Speak?
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-300 mb-8 transition-colors">
            I'm always excited to share insights on engineering leadership, AI/ML, fintech, and technology innovation. 
            Let's discuss how I can contribute to your next event.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-emerald-600 hover:bg-emerald-700 ambient:glass-button ambient:dark:glass-button-dark"
              asChild
            >
              <a href="mailto:soumitra@ghosh.blog?subject=Speaking%20Opportunity">
                <Mail className="w-4 h-4 mr-2" />
                Get In Touch
              </a>
            </Button>
            <Button 
              size="lg" 
              className="border-slate-300 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700 dark:bg-slate-800 ambient:glass-button ambient:dark:glass-button-dark"
              asChild
            >
              <Link href="/">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Portfolio
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 dark:bg-black ambient:glass-bg ambient:dark:glass-bg-dark text-slate-400 dark:text-slate-500 py-8 px-4 sm:px-6 lg:px-8 transition-colors duration-300 relative z-10">
        <div className="max-w-6xl mx-auto text-center">
          <p>© 2025 Soumitra Ghosh. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

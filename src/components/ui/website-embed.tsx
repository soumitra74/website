'use client'

import React, { useState, useEffect } from 'react'
import { BookOpen, ExternalLink, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface WebsiteEmbedProps {
  url: string
  title: string
  description: string
  className?: string
}

export function WebsiteEmbed({ url, title, description, className = '' }: WebsiteEmbedProps) {
  const [embedFailed, setEmbedFailed] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Reset state when URL changes
    setEmbedFailed(false)
    setIsLoading(true)
  }, [url])

  const handleIframeError = () => {
    setEmbedFailed(true)
    setIsLoading(false)
  }

  const handleIframeLoad = () => {
    setIsLoading(false)
  }

  if (embedFailed) {
    return (
      <div className={`w-full h-full flex items-center justify-center ${className}`}>
        <div className="text-center p-6">
          <AlertCircle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
            {title}
          </h3>
          <p className="text-slate-600 dark:text-slate-400 mb-4">
            {description}
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-500 mb-4">
            This website cannot be embedded due to security restrictions.
          </p>
          <Button asChild>
            <a 
              href={url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2"
            >
              <ExternalLink className="w-4 h-4" />
              Visit Website
            </a>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className={`relative w-full h-full ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-100 dark:bg-slate-700 z-10">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto mb-4"></div>
            <p className="text-slate-600 dark:text-slate-400">Loading website...</p>
          </div>
        </div>
      )}
      
      <iframe
        src={url}
        className="w-full h-full"
        title={title}
        loading="lazy"
        onError={handleIframeError}
        onLoad={handleIframeLoad}
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
      />
    </div>
  )
}

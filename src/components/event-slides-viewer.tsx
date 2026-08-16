'use client'

import React from 'react'
import { ExternalLink, Presentation, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getSlidesEmbedUrl, getSlidesOpenUrl } from '@/lib/slides'

interface EventSlidesViewerProps {
  url: string
  title: string
}

export function EventSlidesViewer({ url, title }: EventSlidesViewerProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const embedUrl = getSlidesEmbedUrl(url)
  const openUrl = getSlidesOpenUrl(url)

  React.useEffect(() => {
    if (!isOpen) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen])

  return (
    <>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(true)}
        className="mt-4 border-slate-300 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700 dark:bg-slate-800"
      >
        <Presentation className="w-4 h-4 mr-2" />
        View slides
      </Button>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black/90 z-[60] flex items-center justify-center p-4"
          onClick={() => setIsOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="slides-viewer-title"
        >
          <div
            className="relative w-full max-w-6xl h-[85vh] flex flex-col"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-4 mb-3">
              <h3
                id="slides-viewer-title"
                className="text-white text-lg font-semibold truncate"
              >
                {title}
              </h3>
              <div className="flex items-center gap-2 flex-shrink-0">
                <Button
                  asChild
                  size="sm"
                  variant="outline"
                  className="border-white/30 bg-black/40 text-white hover:bg-black/70 hover:text-white"
                >
                  <a href={openUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Open in new tab
                  </a>
                </Button>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="text-white hover:text-gray-300 p-1"
                  aria-label="Close slides"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <iframe
              src={embedUrl}
              title={`${title} slides`}
              className="w-full flex-1 rounded-lg bg-slate-900"
              allow="autoplay; fullscreen"
              allowFullScreen
            />
          </div>
        </div>
      )}
    </>
  )
}

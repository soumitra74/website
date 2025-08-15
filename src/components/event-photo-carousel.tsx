"use client"

import React from 'react'
import { Calendar, ChevronLeft, ChevronRight, X } from 'lucide-react'
import Image from 'next/image'

interface EventPhotoCarouselProps {
  photos: string[]
}

export function EventPhotoCarousel({ photos }: EventPhotoCarouselProps) {
  const [currentIndex, setCurrentIndex] = React.useState(0)
  const [isModalOpen, setIsModalOpen] = React.useState(false)

  if (!photos || photos.length === 0) {
    return (
      <div className="relative h-48 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800 rounded-t-lg overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <Calendar className="w-12 h-12 text-slate-400 dark:text-slate-500 mx-auto mb-2" />
            <p className="text-slate-500 dark:text-slate-400 text-sm">Event Photo</p>
          </div>
        </div>
      </div>
    )
  }

  const nextPhoto = () => {
    setCurrentIndex((prev) => (prev + 1) % photos.length)
  }

  const prevPhoto = () => {
    setCurrentIndex((prev) => (prev - 1 + photos.length) % photos.length)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') prevPhoto()
    if (e.key === 'ArrowRight') nextPhoto()
    if (e.key === 'Escape') setIsModalOpen(false)
  }

  // Convert Google Drive sharing links to direct image URLs
  const getImageUrl = (url: string) => {
    if (url.includes('drive.google.com/file/d/')) {
      const fileId = url.match(/\/file\/d\/([^\/]+)/)?.[1]
      if (fileId) {
        return `https://drive.google.com/uc?export=view&id=${fileId}`
      }
    }
    return url
  }

  return (
    <>
      {/* Photo Carousel */}
      <div className="relative h-48 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800 rounded-t-lg overflow-hidden group">
        <Image
          src={getImageUrl(photos[currentIndex])}
          alt={`Event photo ${currentIndex + 1}`}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        
        {/* Overlay with photo count and view button */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center">
            <span className="text-white text-sm font-medium bg-black/50 px-2 py-1 rounded">
              {currentIndex + 1} / {photos.length}
            </span>
            <button
              onClick={() => setIsModalOpen(true)}
              className="text-white bg-black/50 hover:bg-black/70 px-3 py-1 rounded text-sm transition-colors"
            >
              View All
            </button>
          </div>
        </div>

        {/* Navigation arrows for multiple photos */}
        {photos.length > 1 && (
          <>
            <button
              onClick={prevPhoto}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label="Previous photo"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={nextPhoto}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label="Next photo"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </>
        )}

        {/* Photo indicators */}
        {photos.length > 1 && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
            {photos.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentIndex 
                    ? 'bg-white' 
                    : 'bg-white/50 hover:bg-white/75'
                }`}
                aria-label={`Go to photo ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modal for full-size photo viewing */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setIsModalOpen(false)}
          onKeyDown={handleKeyDown}
          tabIndex={0}
        >
          <div className="relative max-w-4xl max-h-full" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 z-10"
              aria-label="Close modal"
            >
              <X className="w-6 h-6" />
            </button>
            
            <div className="relative">
              <Image
                src={getImageUrl(photos[currentIndex])}
                alt={`Event photo ${currentIndex + 1}`}
                width={800}
                height={600}
                className="max-w-full max-h-[80vh] object-contain rounded-lg"
              />
            </div>

            {/* Modal navigation */}
            {photos.length > 1 && (
              <>
                <button
                  onClick={prevPhoto}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full"
                  aria-label="Previous photo"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={nextPhoto}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full"
                  aria-label="Next photo"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}

            {/* Photo counter in modal */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white bg-black/50 px-3 py-1 rounded">
              {currentIndex + 1} / {photos.length}
            </div>
          </div>
        </div>
      )}
    </>
  )
}


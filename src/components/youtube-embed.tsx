'use client'

import { useState } from 'react'
import { extractYouTubeId, getYouTubeThumbnailUrl } from '@/lib/youtube'

interface YouTubeEmbedProps {
  url: string
  title?: string
  className?: string
}

export default function YouTubeEmbed({ url, title, className = '' }: YouTubeEmbedProps) {
  const [isLoaded, setIsLoaded] = useState(false)

  const videoId = extractYouTubeId(url)

  if (!videoId) {
    return (
      <div className={`bg-gray-100 rounded-lg p-4 text-center ${className}`}>
        <p className="text-gray-600">Invalid YouTube URL</p>
      </div>
    )
  }

  const embedUrl = `https://www.youtube.com/embed/${videoId}`
  const thumbnailUrl = getYouTubeThumbnailUrl(url)

  return (
    <div className={`relative w-full ${className}`}>
      {!isLoaded && (
        <div 
          className="relative w-full aspect-video bg-gray-200 rounded-lg overflow-hidden cursor-pointer"
          onClick={() => setIsLoaded(true)}
        >
          {thumbnailUrl && (
            <img
              src={thumbnailUrl}
              alt={title || 'YouTube video thumbnail'}
              className="w-full h-full object-cover"
            />
          )}
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
            <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center hover:bg-red-700 transition-colors">
              <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
        </div>
      )}
      
      {isLoaded && (
        <iframe
          className="w-full aspect-video rounded-lg"
          src={embedUrl}
          title={title || 'YouTube video'}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      )}
    </div>
  )
}

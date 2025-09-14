'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Share2, MessageCircle, Instagram, Facebook, Twitter, Mail } from 'lucide-react'

interface SocialSharingProps {
  title: string
  url: string
  description?: string
  className?: string
}

export default function SocialSharing({ title, url, description, className = '' }: SocialSharingProps) {
  const [isClient, setIsClient] = useState(false)
  const [hasNativeShare, setHasNativeShare] = useState(false)

  useEffect(() => {
    setIsClient(true)
    setHasNativeShare(typeof navigator !== 'undefined' && 'share' in navigator)
  }, [])

  const encodedTitle = encodeURIComponent(title)
  const encodedUrl = encodeURIComponent(url)
  const encodedDescription = encodeURIComponent(description || '')

  const shareLinks = {
    whatsapp: `https://wa.me/?text=${encodedTitle}%20-%20${encodedUrl}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
    instagram: `https://www.instagram.com/`, // Instagram doesn't support direct sharing, so we'll open their main page
    email: `mailto:?subject=${encodedTitle}&body=${encodedDescription}%0A%0A${encodedUrl}`
  }

  const handleShare = (platform: keyof typeof shareLinks) => {
    if (platform === 'instagram') {
      // For Instagram, we'll copy the URL to clipboard and open Instagram
      navigator.clipboard.writeText(url)
      window.open(shareLinks[platform], '_blank', 'noopener,noreferrer')
      // You could show a toast notification here
    } else {
      window.open(shareLinks[platform], '_blank', 'noopener,noreferrer')
    }
  }

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: description,
          url
        })
      } catch (error) {
        console.log('Error sharing:', error)
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(url)
      // You could show a toast notification here
    }
  }

  // Don't render until client-side to avoid hydration mismatch
  if (!isClient) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <span className="text-sm font-medium text-muted-foreground mr-2">Share:</span>
        <div className="flex gap-2">
          <div className="w-8 h-8 bg-gray-200 rounded animate-pulse"></div>
          <div className="w-8 h-8 bg-gray-200 rounded animate-pulse"></div>
          <div className="w-8 h-8 bg-gray-200 rounded animate-pulse"></div>
          <div className="w-8 h-8 bg-gray-200 rounded animate-pulse"></div>
          <div className="w-8 h-8 bg-gray-200 rounded animate-pulse"></div>
          <div className="w-8 h-8 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </div>
    )
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <span className="text-sm font-medium text-muted-foreground mr-2">Share:</span>
      
      {/* Native Share Button (for mobile) */}
      {hasNativeShare && (
        <Button
          variant="outline"
          size="sm"
          onClick={handleNativeShare}
          className="text-gray-600 hover:text-gray-700 hover:bg-gray-50"
        >
          <Share2 className="h-4 w-4" />
        </Button>
      )}

      {/* WhatsApp */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleShare('whatsapp')}
        className="text-green-600 hover:text-green-700 hover:bg-green-50"
        title="Share on WhatsApp"
      >
        <MessageCircle className="h-4 w-4" />
      </Button>

      {/* Facebook */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleShare('facebook')}
        className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
        title="Share on Facebook"
      >
        <Facebook className="h-4 w-4" />
      </Button>

      {/* Twitter */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleShare('twitter')}
        className="text-sky-600 hover:text-sky-700 hover:bg-sky-50"
        title="Share on Twitter"
      >
        <Twitter className="h-4 w-4" />
      </Button>

      {/* Instagram */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleShare('instagram')}
        className="text-pink-600 hover:text-pink-700 hover:bg-pink-50"
        title="Share on Instagram (URL copied to clipboard)"
      >
        <Instagram className="h-4 w-4" />
      </Button>

      {/* Email */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleShare('email')}
        className="text-gray-600 hover:text-gray-700 hover:bg-gray-50"
        title="Share via Email"
      >
        <Mail className="h-4 w-4" />
      </Button>
    </div>
  )
}

'use client'

import { Button } from '@/components/ui/button'
import { config } from '@/lib/config'
import { MessageCircle, Instagram, Facebook, Twitter } from 'lucide-react'

interface SocialMediaButtonsProps {
  variant?: 'default' | 'outline' | 'ghost'
  size?: 'sm' | 'default' | 'lg'
  showLabels?: boolean
  className?: string
}

export default function SocialMediaButtons({ 
  variant = 'outline', 
  size = 'default', 
  showLabels = false,
  className = ''
}: SocialMediaButtonsProps) {
  const socialLinks = [
    {
      name: 'WhatsApp',
      icon: MessageCircle,
      url: config.social.whatsapp,
      color: 'text-green-600 hover:text-green-700',
      bgColor: 'hover:bg-green-50'
    },
    {
      name: 'Instagram',
      icon: Instagram,
      url: config.social.instagram,
      color: 'text-pink-600 hover:text-pink-700',
      bgColor: 'hover:bg-pink-50'
    },
    {
      name: 'Facebook',
      icon: Facebook,
      url: config.social.facebook,
      color: 'text-blue-600 hover:text-blue-700',
      bgColor: 'hover:bg-blue-50'
    },
    {
      name: 'Twitter',
      icon: Twitter,
      url: config.social.twitter,
      color: 'text-sky-600 hover:text-sky-700',
      bgColor: 'hover:bg-sky-50'
    }
  ]

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {socialLinks.map((social) => {
        const Icon = social.icon
        return (
          <Button
            key={social.name}
            variant={variant}
            size={size}
            className={`transition-all duration-200 ${social.color} ${social.bgColor} border-0`}
            onClick={() => window.open(social.url, '_blank', 'noopener,noreferrer')}
            title={`Follow us on ${social.name}`}
          >
            <Icon className="h-4 w-4" />
            {showLabels && <span className="ml-2">{social.name}</span>}
          </Button>
        )
      })}
    </div>
  )
}

'use client'

import { Button } from '@/components/ui/button'
import { MessageCircle } from 'lucide-react'
import { config } from '@/lib/config'

interface WhatsAppContactProps {
  message?: string
  className?: string
  variant?: 'default' | 'outline' | 'secondary' | 'ghost' | 'link' | 'destructive'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  children?: React.ReactNode
}

function whatsappDigits(): string {
  return (config.contact.whatsapp || '').replace(/\D/g, '')
}

export default function WhatsAppContact({
  message,
  className = '',
  variant = 'default',
  size = 'default',
  children,
}: WhatsAppContactProps) {
  const digits = whatsappDigits()
  if (!digits) return null

  const defaultMessage = `Hi, I came from ${config.appName}`
  const text = message?.trim() || defaultMessage

  const handleWhatsAppClick = () => {
    const encodedMessage = encodeURIComponent(text)
    window.open(`https://wa.me/${digits}?text=${encodedMessage}`, '_blank', 'noopener,noreferrer')
  }

  return (
    <Button
      onClick={handleWhatsAppClick}
      className={`bg-green-600 hover:bg-green-700 text-white ${className}`}
      variant={variant}
      size={size}
    >
      <MessageCircle className="h-4 w-4 mr-2" />
      {children || 'Contact via WhatsApp'}
    </Button>
  )
}

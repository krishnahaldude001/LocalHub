'use client'

import { Button } from '@/components/ui/button'
import { MessageCircle } from 'lucide-react'

interface WhatsAppContactProps {
  message?: string
  className?: string
  variant?: 'default' | 'outline' | 'secondary' | 'ghost' | 'link' | 'destructive'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  children?: React.ReactNode
}

export default function WhatsAppContact({ 
  message = "Hi Krishna, I came from your website", 
  className = "",
  variant = "default",
  size = "default",
  children
}: WhatsAppContactProps) {
  const handleWhatsAppClick = () => {
    const encodedMessage = encodeURIComponent(message)
    const whatsappUrl = `https://wa.me/918169321761?text=${encodedMessage}`
    window.open(whatsappUrl, '_blank')
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

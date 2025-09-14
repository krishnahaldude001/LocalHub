'use client'

import { useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { CreditCard, Phone, MessageCircle, User, MapPin, Mail } from 'lucide-react'

interface CODOrderFormProps {
  deal: {
    id: string
    title: string
    salePrice: number
    price: number
    shop: {
      name: string
      phone?: string
      whatsapp?: string
    }
  }
}

export default function CODOrderForm({ deal }: CODOrderFormProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [orderId, setOrderId] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const orderId = uuidv4()
      
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          dealId: deal.id,
          customerName: formData.name,
          customerPhone: formData.phone,
          customerEmail: formData.email,
          customerAddress: formData.address,
          customerMessage: formData.message,
          orderId: orderId
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to submit order')
      }

      const result = await response.json()
      setOrderId(result.order.id)
      setIsSubmitted(true)
    } catch (error) {
      console.error('Error submitting order:', error)
      alert(`Failed to submit order: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const openWhatsApp = () => {
    const message = `Hi! I'm interested in ordering "${deal.title}" for ₹${deal.salePrice}. My details:
Name: ${formData.name}
Phone: ${formData.phone}
Address: ${formData.address}
${formData.message ? `Message: ${formData.message}` : ''}`
    
    const encodedMessage = encodeURIComponent(message)
    const whatsappUrl = `https://wa.me/${deal.shop.whatsapp || deal.shop.phone}?text=${encodedMessage}`
    window.open(whatsappUrl, '_blank')
  }

  const callShop = () => {
    window.open(`tel:${deal.shop.phone}`, '_self')
  }

  if (isSubmitted) {
    return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button className="w-full h-12 text-lg bg-green-600 hover:bg-green-700">
            <CreditCard className="h-4 w-4 mr-2" />
            Order with COD
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-green-600">Order Submitted Successfully!</DialogTitle>
            <DialogDescription>
              Your COD order has been submitted. The shop will contact you soon.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="text-center">
              <Badge className="bg-green-100 text-green-800 mb-4">
                Order ID: #{orderId.slice(-8).toUpperCase()}
              </Badge>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-medium">Contact the shop directly:</h4>
              
              {deal.shop.whatsapp && (
                <Button 
                  onClick={openWhatsApp}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  WhatsApp Shop
                </Button>
              )}
              
              {deal.shop.phone && (
                <Button 
                  onClick={callShop}
                  variant="outline"
                  className="w-full"
                >
                  <Phone className="h-4 w-4 mr-2" />
                  Call Shop
                </Button>
              )}
            </div>
            
            <Button 
              onClick={() => {
                setIsOpen(false)
                setIsSubmitted(false)
                setFormData({ name: '', phone: '', email: '', address: '', message: '' })
              }}
              className="w-full"
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="w-full h-12 text-lg bg-green-600 hover:bg-green-700">
          <CreditCard className="h-4 w-4 mr-2" />
          Order with COD
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Place COD Order</DialogTitle>
          <DialogDescription>
            Fill in your details to place a Cash on Delivery order for "{deal.title}"
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Deal Summary */}
          <Card>
            <CardContent className="p-4">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-medium">{deal.title}</h4>
                  <p className="text-sm text-gray-500">{deal.shop.name}</p>
                </div>
                <div className="text-right">
                  <div className="font-bold text-green-600">₹{deal.salePrice}</div>
                  <div className="text-sm text-gray-500 line-through">₹{deal.price}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Order Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                <User className="h-4 w-4 inline mr-1" />
                Full Name *
              </label>
              <Input
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter your full name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                <Phone className="h-4 w-4 inline mr-1" />
                Phone Number *
              </label>
              <Input
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="Enter your phone number"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                <Mail className="h-4 w-4 inline mr-1" />
                Email (Optional)
              </label>
              <Input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                <MapPin className="h-4 w-4 inline mr-1" />
                Delivery Address *
              </label>
              <Textarea
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="Enter your complete delivery address"
                rows={3}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Additional Message (Optional)
              </label>
              <Textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                placeholder="Any special instructions or notes"
                rows={2}
              />
            </div>

            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsOpen(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                {isSubmitting ? 'Submitting...' : 'Place Order'}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  )
}

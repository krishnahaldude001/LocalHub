'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Mail, Phone, MapPin, Clock, Save, RefreshCw } from 'lucide-react'
import { useState, useEffect } from 'react'
import { toast } from 'sonner'

interface ContactInfo {
  id?: string
  email: string
  phone: string
  whatsapp: string
  address: string
  businessHours: string
}

export default function ContactManagementPage() {
  const [contactInfo, setContactInfo] = useState<ContactInfo>({
    email: '',
    phone: '',
    whatsapp: '',
    address: '',
    businessHours: ''
  })
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    fetchContactInfo()
  }, [])

  const fetchContactInfo = async () => {
    try {
      const response = await fetch('/api/admin/contact')
      if (response.ok) {
        const data = await response.json()
        setContactInfo(data)
      }
    } catch (error) {
      console.error('Error fetching contact info:', error)
      toast.error('Failed to load contact information')
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setContactInfo({
      ...contactInfo,
      [e.target.name]: e.target.value
    })
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const response = await fetch('/api/admin/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(contactInfo),
      })

      if (response.ok) {
        toast.success('Contact information updated successfully!')
        await fetchContactInfo() // Refresh data
      } else {
        const error = await response.json()
        toast.error(error.error || 'Failed to update contact information')
      }
    } catch (error) {
      console.error('Error updating contact info:', error)
      toast.error('Failed to update contact information')
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading contact information...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Contact Management</h1>
          <p className="text-muted-foreground">Manage your business contact information</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchContactInfo}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            <Save className="h-4 w-4 mr-2" />
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>

      {/* Contact Information Form */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Contact Information</CardTitle>
          <CardDescription>
            Update your business contact details. These will be displayed on your contact page and throughout the website.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Email */}
          <div className="space-y-2">
            <label htmlFor="email" className="flex items-center gap-2 text-sm font-medium">
              <Mail className="h-4 w-4" />
              Email Address
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              value={contactInfo.email}
              onChange={handleInputChange}
              placeholder="admin@localhub.space"
              className="w-full"
            />
            <p className="text-xs text-muted-foreground">
              This email will be used for contact forms and general inquiries
            </p>
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <label htmlFor="phone" className="flex items-center gap-2 text-sm font-medium">
              <Phone className="h-4 w-4" />
              Phone Number
            </label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              value={contactInfo.phone}
              onChange={handleInputChange}
              placeholder="+91-9876543210"
              className="w-full"
            />
            <p className="text-xs text-muted-foreground">
              Include country code (e.g., +91 for India)
            </p>
          </div>

          {/* WhatsApp */}
          <div className="space-y-2">
            <label htmlFor="whatsapp" className="flex items-center gap-2 text-sm font-medium">
              <Phone className="h-4 w-4" />
              WhatsApp Number
            </label>
            <Input
              id="whatsapp"
              name="whatsapp"
              type="tel"
              value={contactInfo.whatsapp}
              onChange={handleInputChange}
              placeholder="+91-9876543210"
              className="w-full"
            />
            <p className="text-xs text-muted-foreground">
              Same as phone number or separate WhatsApp business number
            </p>
          </div>

          {/* Address */}
          <div className="space-y-2">
            <label htmlFor="address" className="flex items-center gap-2 text-sm font-medium">
              <MapPin className="h-4 w-4" />
              Business Address
            </label>
            <Input
              id="address"
              name="address"
              value={contactInfo.address}
              onChange={handleInputChange}
              placeholder="Mumbai, Maharashtra, India"
              className="w-full"
            />
            <p className="text-xs text-muted-foreground">
              Your business location or service area
            </p>
          </div>

          {/* Business Hours */}
          <div className="space-y-2">
            <label htmlFor="businessHours" className="flex items-center gap-2 text-sm font-medium">
              <Clock className="h-4 w-4" />
              Business Hours
            </label>
            <Input
              id="businessHours"
              name="businessHours"
              value={contactInfo.businessHours}
              onChange={handleInputChange}
              placeholder="9:00 AM - 6:00 PM (Mon-Fri), 10:00 AM - 4:00 PM (Sat)"
              className="w-full"
            />
            <p className="text-xs text-muted-foreground">
              When customers can reach you
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Preview */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="text-2xl">Preview</CardTitle>
          <CardDescription>
            How your contact information will appear on the website
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-primary mt-1" />
                <div>
                  <h3 className="font-semibold">Email</h3>
                  <a href={`mailto:${contactInfo.email}`} className="text-primary hover:underline">
                    {contactInfo.email}
                  </a>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-primary mt-1" />
                <div>
                  <h3 className="font-semibold">Phone</h3>
                  <a href={`tel:${contactInfo.phone.replace(/\s/g, '')}`} className="text-primary hover:underline">
                    {contactInfo.phone}
                  </a>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-primary mt-1" />
                <div>
                  <h3 className="font-semibold">Address</h3>
                  <p className="text-muted-foreground">{contactInfo.address}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-primary mt-1" />
                <div>
                  <h3 className="font-semibold">Business Hours</h3>
                  <p className="text-muted-foreground">{contactInfo.businessHours}</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

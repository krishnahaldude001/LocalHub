"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { config } from '@/lib/config'
import { Save } from 'lucide-react'

export default function SiteSettingsForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    appName: config.appName,
    appDescription: config.appDescription,
    appUrl: config.appUrl,
    contactEmail: config.contact.email,
    contactPhone: config.contact.phone,
    contactAddress: config.contact.address
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // For now, we'll just show success message
      // In Phase 2, this will save to database/config
      console.log('Settings data:', formData)
      
      alert('Settings updated successfully! (Note: This is a demo - in Phase 2 this will save to database)')
    } catch (error) {
      console.error('Error updating settings:', error)
      alert('Failed to update settings. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <div className="space-y-2">
        <Label htmlFor="appName">App Name *</Label>
        <Input
          id="appName"
          name="appName"
          value={formData.appName}
          onChange={handleInputChange}
          placeholder="e.g., LocalHub, YourCityHub"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="appDescription">App Description *</Label>
        <textarea
          id="appDescription"
          name="appDescription"
          value={formData.appDescription}
          onChange={handleInputChange}
          placeholder="Brief description of your platform..."
          className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="appUrl">App URL *</Label>
        <Input
          id="appUrl"
          name="appUrl"
          type="url"
          value={formData.appUrl}
          onChange={handleInputChange}
          placeholder="https://yourdomain.com"
          required
        />
      </div>

      {/* Contact Information */}
      <div className="space-y-4">
        <h4 className="font-medium">Contact Information</h4>
        
        <div className="space-y-2">
          <Label htmlFor="contactEmail">Contact Email *</Label>
          <Input
            id="contactEmail"
            name="contactEmail"
            type="email"
            value={formData.contactEmail}
            onChange={handleInputChange}
            placeholder="hello@yourdomain.com"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="contactPhone">Contact Phone</Label>
          <Input
            id="contactPhone"
            name="contactPhone"
            type="tel"
            value={formData.contactPhone}
            onChange={handleInputChange}
            placeholder="+91-9876543210"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="contactAddress">Contact Address</Label>
          <textarea
            id="contactAddress"
            name="contactAddress"
            value={formData.contactAddress}
            onChange={handleInputChange}
            placeholder="Your business address..."
            className="flex min-h-[60px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            'Saving...'
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save Settings
            </>
          )}
        </Button>
      </div>
    </form>
  )
}

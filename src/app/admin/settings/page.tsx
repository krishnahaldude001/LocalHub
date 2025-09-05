import { Metadata } from 'next'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { config } from '@/lib/config'
import { Settings, Globe, MapPin, Mail, Phone, Users, Palette, Database } from 'lucide-react'
import SiteSettingsForm from './site-settings-form'

export const metadata: Metadata = {
  title: 'Site Settings | Admin Dashboard',
  description: 'Configure website settings and preferences',
}

export default function SiteSettingsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Site Settings</h1>
          <p className="text-muted-foreground">Configure your website settings and preferences</p>
        </div>
      </div>

      {/* Current Settings Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">App Name</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{config.appName}</div>
            <p className="text-xs text-muted-foreground">Current brand name</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Coverage Areas</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{config.defaultLocation.areas.length}</div>
            <p className="text-xs text-muted-foreground">Active areas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Features</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Object.values(config.features).filter(Boolean).length}
            </div>
            <p className="text-xs text-muted-foreground">Enabled features</p>
          </CardContent>
        </Card>
      </div>

      {/* Settings Forms */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* General Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              General Settings
            </CardTitle>
            <CardDescription>Basic website configuration</CardDescription>
          </CardHeader>
          <CardContent>
            <SiteSettingsForm />
          </CardContent>
        </Card>

        {/* Location Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Location Settings
            </CardTitle>
            <CardDescription>Configure coverage areas and locations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Current Default Location</h4>
                <div className="p-3 bg-muted rounded-lg">
                  <p><strong>Name:</strong> {config.defaultLocation.name}</p>
                  <p><strong>City:</strong> {config.defaultLocation.city}</p>
                  <p><strong>State:</strong> {config.defaultLocation.state}</p>
                  <p><strong>Country:</strong> {config.defaultLocation.country}</p>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Coverage Areas</h4>
                <div className="flex flex-wrap gap-2">
                  {config.defaultLocation.areas.map(area => (
                    <Badge key={area} variant="secondary">{area}</Badge>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Supported Locations</h4>
                <div className="space-y-2">
                  {config.supportedLocations.map(location => (
                    <div key={location.name} className="p-2 border rounded text-sm">
                      <strong>{location.name}</strong> - {location.areas.join(', ')}
                    </div>
                  ))}
                </div>
              </div>

              <Button className="w-full" disabled>
                <MapPin className="h-4 w-4 mr-2" />
                Edit Locations
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Contact Information
            </CardTitle>
            <CardDescription>Update contact details and social links</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Contact Details</h4>
                <div className="p-3 bg-muted rounded-lg space-y-1 text-sm">
                  <p><strong>Email:</strong> {config.contact.email}</p>
                  <p><strong>Phone:</strong> {config.contact.phone}</p>
                  <p><strong>Address:</strong> {config.contact.address}</p>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Social Media</h4>
                <div className="p-3 bg-muted rounded-lg space-y-1 text-sm">
                  <p><strong>WhatsApp:</strong> {config.social.whatsapp}</p>
                  <p><strong>Twitter:</strong> {config.social.twitter}</p>
                  <p><strong>Facebook:</strong> {config.social.facebook}</p>
                  <p><strong>Instagram:</strong> {config.social.instagram}</p>
                </div>
              </div>

              <Button className="w-full" disabled>
                <Mail className="h-4 w-4 mr-2" />
                Edit Contact Info
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Features & Integrations */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Features & Integrations
            </CardTitle>
            <CardDescription>Enable/disable website features</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Current Features</h4>
                <div className="space-y-2">
                  {Object.entries(config.features).map(([feature, enabled]) => (
                    <div key={feature} className="flex items-center justify-between p-2 border rounded">
                      <span className="capitalize">{feature.replace(/([A-Z])/g, ' $1').trim()}</span>
                      <Badge variant={enabled ? "default" : "secondary"}>
                        {enabled ? "Enabled" : "Disabled"}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Integrations</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2 border rounded">
                    <span>NextAuth (Authentication)</span>
                    <Badge variant="default">Configured</Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 border rounded">
                    <span>Razorpay (Payments)</span>
                    <Badge variant="secondary">Stub</Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 border rounded">
                    <span>Sanity CMS</span>
                    <Badge variant="secondary">Phase 2</Badge>
                  </div>
                </div>
              </div>

              <Button className="w-full" disabled>
                <Settings className="h-4 w-4 mr-2" />
                Configure Features
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Database & System Info */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            System Information
          </CardTitle>
          <CardDescription>Database and system status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-medium mb-2">Database</h4>
              <div className="p-3 bg-muted rounded-lg text-sm">
                <p><strong>Type:</strong> SQLite</p>
                <p><strong>Status:</strong> <Badge variant="default">Connected</Badge></p>
                <p><strong>Location:</strong> ./dev.db</p>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-2">Environment</h4>
              <div className="p-3 bg-muted rounded-lg text-sm">
                <p><strong>Mode:</strong> Development</p>
                <p><strong>Node.js:</strong> v22.19.0</p>
                <p><strong>Next.js:</strong> 14.0.4</p>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-2">Performance</h4>
              <div className="p-3 bg-muted rounded-lg text-sm">
                <p><strong>Build Time:</strong> ~6.7s</p>
                <p><strong>Compile Time:</strong> ~13.8s</p>
                <p><strong>Status:</strong> <Badge variant="default">Healthy</Badge></p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

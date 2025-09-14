"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Phone, Mail, MessageCircle, Clock, CreditCard, CheckCircle, XCircle, AlertCircle } from 'lucide-react'
import { adminConfig } from '@/lib/admin-config'

interface ShopActivationMessageProps {
  status: 'pending' | 'active' | 'suspended' | 'rejected'
  shopName?: string
  activationNotes?: string
}

export default function ShopActivationMessage({ 
  status, 
  shopName, 
  activationNotes 
}: ShopActivationMessageProps) {
  const getStatusInfo = () => {
    switch (status) {
      case 'pending':
        return {
          icon: <Clock className="h-5 w-5" />,
          title: "Account Pending Activation",
          description: adminConfig.messages.activationPending,
          color: "bg-yellow-100 text-yellow-800 border-yellow-200",
          badgeColor: "bg-yellow-500"
        }
      case 'active':
        return {
          icon: <CheckCircle className="h-5 w-5" />,
          title: "Account Active",
          description: "Your shop account is active and you can start adding deals!",
          color: "bg-green-100 text-green-800 border-green-200",
          badgeColor: "bg-green-500"
        }
      case 'suspended':
        return {
          icon: <AlertCircle className="h-5 w-5" />,
          title: "Account Suspended",
          description: adminConfig.messages.accountSuspended,
          color: "bg-orange-100 text-orange-800 border-orange-200",
          badgeColor: "bg-orange-500"
        }
      case 'rejected':
        return {
          icon: <XCircle className="h-5 w-5" />,
          title: "Account Rejected",
          description: adminConfig.messages.activationRejected,
          color: "bg-red-100 text-red-800 border-red-200",
          badgeColor: "bg-red-500"
        }
    }
  }

  const statusInfo = getStatusInfo()

  const handleContact = (method: 'email' | 'whatsapp' | 'phone') => {
    switch (method) {
      case 'email':
        window.open(`mailto:${adminConfig.contact.email}?subject=Shop Activation - ${shopName || 'New Shop'}`)
        break
      case 'whatsapp':
        const whatsappMessage = `Hi, I want to activate my shop account "${shopName || 'New Shop'}" on Govandi Hub. Please provide payment details.`
        window.open(`https://wa.me/${adminConfig.contact.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(whatsappMessage)}`)
        break
      case 'phone':
        window.open(`tel:${adminConfig.contact.phone}`)
        break
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <div className={`p-3 rounded-full ${statusInfo.color}`}>
            {statusInfo.icon}
          </div>
        </div>
        <CardTitle className="text-2xl">{statusInfo.title}</CardTitle>
        <CardDescription className="text-base">
          {statusInfo.description}
        </CardDescription>
        {activationNotes && (
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-700">
              <strong>Admin Notes:</strong> {activationNotes}
            </p>
          </div>
        )}
      </CardHeader>

      {status === 'pending' && (
        <CardContent className="space-y-6">
          {/* Payment Information */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-3">
              <CreditCard className="h-5 w-5 text-blue-600" />
              <h3 className="font-semibold text-blue-900">Activation Fee</h3>
            </div>
            <div className="space-y-2 text-sm">
              <p><strong>Amount:</strong> ₹{adminConfig.activation.fee} {adminConfig.activation.currency}</p>
              <p><strong>Payment Methods:</strong> {adminConfig.activation.paymentMethods.join(', ')}</p>
              <p><strong>Activation Time:</strong> {adminConfig.activation.activationTime}</p>
            </div>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="font-semibold mb-3">Contact Us for Payment</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Button 
                variant="outline" 
                className="flex items-center gap-2"
                onClick={() => handleContact('email')}
              >
                <Mail className="h-4 w-4" />
                Email
              </Button>
              <Button 
                variant="outline" 
                className="flex items-center gap-2"
                onClick={() => handleContact('whatsapp')}
              >
                <MessageCircle className="h-4 w-4" />
                WhatsApp
              </Button>
              <Button 
                variant="outline" 
                className="flex items-center gap-2"
                onClick={() => handleContact('phone')}
              >
                <Phone className="h-4 w-4" />
                Call
              </Button>
            </div>
          </div>

          {/* Contact Details */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium mb-2">Our Contact Details:</h4>
            <div className="space-y-1 text-sm text-gray-600">
              <p><strong>Email:</strong> {adminConfig.contact.email}</p>
              <p><strong>WhatsApp:</strong> {adminConfig.contact.whatsapp}</p>
              <p><strong>Phone:</strong> {adminConfig.contact.phone}</p>
            </div>
          </div>
        </CardContent>
      )}

      {status === 'suspended' && (
        <CardContent>
          <div className="text-center space-y-4">
            <p className="text-gray-600">
              Your account has been temporarily suspended. Please contact us to resolve this issue.
            </p>
            <div className="flex justify-center gap-3">
              <Button onClick={() => handleContact('whatsapp')}>
                <MessageCircle className="h-4 w-4 mr-2" />
                Contact WhatsApp
              </Button>
              <Button variant="outline" onClick={() => handleContact('email')}>
                <Mail className="h-4 w-4 mr-2" />
                Send Email
              </Button>
            </div>
          </div>
        </CardContent>
      )}

      {status === 'rejected' && (
        <CardContent>
          <div className="text-center space-y-4">
            <p className="text-gray-600">
              Your account activation was rejected. Please contact us for more information and to reapply.
            </p>
            <div className="flex justify-center gap-3">
              <Button onClick={() => handleContact('whatsapp')}>
                <MessageCircle className="h-4 w-4 mr-2" />
                Contact WhatsApp
              </Button>
              <Button variant="outline" onClick={() => handleContact('phone')}>
                <Phone className="h-4 w-4 mr-2" />
                Call Us
              </Button>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  )
}

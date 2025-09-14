"use client"

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertCircle, 
  Save,
  Loader2
} from 'lucide-react'
import { toast } from 'sonner'

interface Shop {
  id: string
  name: string
  status: string
  activationNotes?: string | null
  paymentReference?: string | null
  activatedAt?: Date | null
  activatedBy?: string | null
}

interface ShopManagementFormProps {
  shop: Shop
}

export default function ShopManagementForm({ shop }: ShopManagementFormProps) {
  const [status, setStatus] = useState(shop.status)
  const [activationNotes, setActivationNotes] = useState(shop.activationNotes || '')
  const [paymentReference, setPaymentReference] = useState(shop.paymentReference || '')
  const [isLoading, setIsLoading] = useState(false)

  const handleStatusChange = async (newStatus: string) => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/admin/shops/${shop.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: newStatus,
          activationNotes,
          paymentReference
        }),
      })

      if (response.ok) {
        setStatus(newStatus)
        toast.success(`Shop ${newStatus === 'active' ? 'activated' : 'status updated'} successfully`)
      } else {
        const error = await response.json()
        toast.error(error.error || 'Failed to update shop status')
      }
    } catch (error) {
      console.error('Error updating shop status:', error)
      toast.error('Failed to update shop status')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSaveNotes = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/admin/shops/${shop.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status,
          activationNotes,
          paymentReference
        }),
      })

      if (response.ok) {
        toast.success('Notes saved successfully')
      } else {
        const error = await response.json()
        toast.error(error.error || 'Failed to save notes')
      }
    } catch (error) {
      console.error('Error saving notes:', error)
      toast.error('Failed to save notes')
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusInfo = () => {
    switch (status) {
      case 'active':
        return {
          icon: <CheckCircle className="h-4 w-4" />,
          color: "text-green-600",
          bgColor: "bg-green-50",
          borderColor: "border-green-200"
        }
      case 'pending':
        return {
          icon: <Clock className="h-4 w-4" />,
          color: "text-yellow-600",
          bgColor: "bg-yellow-50",
          borderColor: "border-yellow-200"
        }
      case 'suspended':
        return {
          icon: <AlertCircle className="h-4 w-4" />,
          color: "text-orange-600",
          bgColor: "bg-orange-50",
          borderColor: "border-orange-200"
        }
      case 'rejected':
        return {
          icon: <XCircle className="h-4 w-4" />,
          color: "text-red-600",
          bgColor: "bg-red-50",
          borderColor: "border-red-200"
        }
      default:
        return {
          icon: <Clock className="h-4 w-4" />,
          color: "text-gray-600",
          bgColor: "bg-gray-50",
          borderColor: "border-gray-200"
        }
    }
  }

  const statusInfo = getStatusInfo()

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className={`p-2 rounded-full ${statusInfo.bgColor} ${statusInfo.borderColor} border`}>
            <div className={statusInfo.color}>
              {statusInfo.icon}
            </div>
          </div>
          Shop Management
        </CardTitle>
        <CardDescription>
          Manage shop activation status and add notes
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Current Status */}
        <div>
          <Label className="text-sm font-medium">Current Status</Label>
          <div className="mt-2">
            <Badge className={`${statusInfo.bgColor} ${statusInfo.color} border ${statusInfo.borderColor}`}>
              {statusInfo.icon}
              <span className="ml-1 capitalize">{status}</span>
            </Badge>
          </div>
        </div>

        {/* Status Actions */}
        <div>
          <Label className="text-sm font-medium mb-3 block">Change Status</Label>
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant={status === 'active' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleStatusChange('active')}
              disabled={isLoading || status === 'active'}
              className="flex items-center gap-2"
            >
              {isLoading ? <Loader2 className="h-3 w-3 animate-spin" /> : <CheckCircle className="h-3 w-3" />}
              Activate
            </Button>
            <Button
              variant={status === 'pending' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleStatusChange('pending')}
              disabled={isLoading || status === 'pending'}
              className="flex items-center gap-2"
            >
              {isLoading ? <Loader2 className="h-3 w-3 animate-spin" /> : <Clock className="h-3 w-3" />}
              Pending
            </Button>
            <Button
              variant={status === 'suspended' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleStatusChange('suspended')}
              disabled={isLoading || status === 'suspended'}
              className="flex items-center gap-2"
            >
              {isLoading ? <Loader2 className="h-3 w-3 animate-spin" /> : <AlertCircle className="h-3 w-3" />}
              Suspend
            </Button>
            <Button
              variant={status === 'rejected' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleStatusChange('rejected')}
              disabled={isLoading || status === 'rejected'}
              className="flex items-center gap-2"
            >
              {isLoading ? <Loader2 className="h-3 w-3 animate-spin" /> : <XCircle className="h-3 w-3" />}
              Reject
            </Button>
          </div>
        </div>

        {/* Payment Reference */}
        <div>
          <Label htmlFor="paymentReference" className="text-sm font-medium">
            Payment Reference
          </Label>
          <Input
            id="paymentReference"
            value={paymentReference}
            onChange={(e) => setPaymentReference(e.target.value)}
            placeholder="Enter payment reference number"
            className="mt-1"
          />
        </div>

        {/* Activation Notes */}
        <div>
          <Label htmlFor="activationNotes" className="text-sm font-medium">
            Admin Notes
          </Label>
          <Textarea
            id="activationNotes"
            value={activationNotes}
            onChange={(e) => setActivationNotes(e.target.value)}
            placeholder="Add notes about activation, payment, or any other relevant information..."
            className="mt-1 min-h-[100px]"
          />
        </div>

        {/* Save Button */}
        <Button 
          onClick={handleSaveNotes}
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save Notes
            </>
          )}
        </Button>

        {/* Status Information */}
        <div className="p-3 bg-gray-50 rounded-lg">
          <h4 className="text-sm font-medium mb-2">Status Information:</h4>
          <ul className="text-xs text-gray-600 space-y-1">
            <li><strong>Active:</strong> Shop can add deals and receive orders</li>
            <li><strong>Pending:</strong> Awaiting payment and activation</li>
            <li><strong>Suspended:</strong> Temporarily disabled</li>
            <li><strong>Rejected:</strong> Application rejected</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}

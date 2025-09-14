import { Metadata } from 'next'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { config } from '@/lib/config'
import Link from 'next/link'
import { ArrowLeft, Save } from 'lucide-react'
import DealForm from './deal-form'

export const metadata: Metadata = {
  title: 'Add New Deal | Admin Dashboard',
  description: 'Add a new deal to LocalHub',
}

export default function NewDealPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Admin
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Add New Deal</h1>
          <p className="text-muted-foreground">Create a new deal for your users</p>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle>Deal Information</CardTitle>
            <CardDescription>
              Create either an affiliate marketing deal or a local shop deal. Required fields depend on the deal type you select.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DealForm />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

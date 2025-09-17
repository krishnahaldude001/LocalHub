import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { getDealById } from '@/lib/simple-db'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import EditDealForm from './edit-deal-form'

interface EditDealPageProps {
  params: {
    id: string
  }
}

export const metadata: Metadata = {
  title: 'Edit Deal | Admin Dashboard',
  description: 'Edit deal information',
}

export default async function EditDealPage({ params }: EditDealPageProps) {
  const deal = await getDealById(params.id)

  if (!deal) {
    notFound()
  }

  // Transform deal to ensure required fields are not null
  const transformedDeal = {
    ...deal,
    platformId: deal.platformId || '',
    affiliateUrl: deal.affiliateUrl || '',
    description: deal.description || '',
    image: deal.image || '',
    youtubeUrl: deal.youtubeUrl || '',
    platform: deal.platform || { id: '', name: '', color: '', slug: '', description: null, isActive: true, createdAt: new Date(), updatedAt: new Date() }
  }

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
          <h1 className="text-3xl font-bold">Edit Deal</h1>
          <p className="text-muted-foreground">Update deal information</p>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle>Deal Information</CardTitle>
            <CardDescription>
              Update the details for this deal.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <EditDealForm deal={transformedDeal} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

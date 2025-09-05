import { Metadata } from 'next'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import NewsForm from './news-form'

export const metadata: Metadata = {
  title: 'Add New Article | Admin Dashboard',
  description: 'Create a new news article',
}

export default function NewNewsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/news">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to News
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Add New Article</h1>
          <p className="text-muted-foreground">Create a new news article for your readers</p>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle>Article Information</CardTitle>
            <CardDescription>
              Fill in the details for your new article. All fields are required.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <NewsForm />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

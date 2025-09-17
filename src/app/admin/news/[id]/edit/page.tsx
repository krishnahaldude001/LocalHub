import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { getPostById } from '@/lib/simple-db'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import EditNewsForm from './edit-news-form'

interface EditNewsPageProps {
  params: {
    id: string
  }
}

export const metadata: Metadata = {
  title: 'Edit News Article | Admin Dashboard',
  description: 'Edit news article information',
}

export default async function EditNewsPage({ params }: EditNewsPageProps) {
  const post = await getPostById(params.id)

  if (!post) {
    notFound()
  }

  // Transform post to ensure date fields are strings
  const transformedPost = {
    ...post,
    publishedAt: post.publishedAt.toISOString(),
    createdAt: post.createdAt.toISOString(),
    updatedAt: post.updatedAt.toISOString()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center space-x-4 mb-8">
        <Link href="/admin/news">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to News
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Edit News Article</h1>
          <p className="text-muted-foreground">Update article information and content</p>
        </div>
      </div>

      {/* Edit Form */}
      <Card>
        <CardHeader>
          <CardTitle>Article Details</CardTitle>
          <CardDescription>
            Update the article title, content, and metadata
          </CardDescription>
        </CardHeader>
        <CardContent>
          <EditNewsForm post={transformedPost} />
        </CardContent>
      </Card>
    </div>
  )
}

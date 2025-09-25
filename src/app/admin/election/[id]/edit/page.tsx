import { Metadata } from 'next'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowLeft, Eye, Trash2 } from 'lucide-react'
import ElectionEditForm from '@/components/election-edit-form'
import { createPrismaClient } from '@/lib/db-connection'

export const metadata: Metadata = {
  title: 'Edit Election Article | Admin Dashboard',
  description: 'Edit existing election article with data, images, and analytics.',
}

// Fetch article data from database
async function getArticleData(id: string) {
  try {
    const prisma = createPrismaClient()
    const article = await prisma.election.findUnique({
      where: { id }
    })
    
    if (!article) {
      return null
    }
    
    // Transform database article to form format
    return {
      id: article.id,
      title: article.title,
      excerpt: article.description || '',
      category: article.category,
      area: article.area,
      author: article.author,
      content: article.content,
      status: article.published ? 'published' : 'draft',
      featured: false, // This field doesn't exist in the database schema
      hasPDF: false,  // This field doesn't exist in the database schema
      hasData: false, // This field doesn't exist in the database schema
      tags: [], // This field doesn't exist in the database schema
      publishedAt: article.publishedAt.toISOString().slice(0, 16)
    }
  } catch (error) {
    console.error('Error fetching article:', error)
    return null
  }
}


interface EditArticlePageProps {
  params: {
    id: string
  }
}

export default async function EditElectionArticlePage({ params }: EditArticlePageProps) {
  const article = await getArticleData(params.id)
  
  if (!article) {
    // If article doesn't exist, create a sample one for testing
    console.log('Article not found, creating sample data for ID:', params.id)
    const sampleArticle = {
      id: params.id,
      title: 'Voter Demographics Analysis 2025',
      excerpt: 'Comprehensive analysis of voter demographics in Govandi, Shivaji Nagar, and Baiganwadi areas.',
      category: 'demographics',
      area: 'govandi',
      author: 'Election Analytics Team',
      content: `# Voter Demographics Analysis 2025

## Executive Summary
This comprehensive analysis examines voter demographics across Govandi, Shivaji Nagar, and Baiganwadi areas for the upcoming 2025 elections.

## Key Findings
- **18-25 years**: 28% of registered voters
- **26-35 years**: 32% of registered voters
- **36-50 years**: 25% of registered voters
- **51+ years**: 15% of registered voters

## Conclusion
The 2025 elections will be significantly influenced by the changing demographic profile.`,
      status: 'published',
      featured: true,
      hasPDF: true,
      hasData: true,
      tags: ['Demographics', 'Voting Patterns', 'Age Groups'],
      publishedAt: '2025-01-15T10:00'
    }
    
    return (
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/admin/election">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Election Management
            </Button>
          </Link>
          <div className="flex-1">
            <h1 className="text-3xl font-bold">Edit Election Article</h1>
            <p className="text-muted-foreground">Update article content, data, and settings</p>
          </div>
          <div className="flex gap-2">
            <Link href={`/election/articles/${params.id}`}>
              <Button variant="outline" size="sm">
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </Button>
            </Link>
            <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </div>
        </div>

        <ElectionEditForm article={sampleArticle} articleId={params.id} />
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/election">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Election Management
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl font-bold">Edit Election Article</h1>
          <p className="text-muted-foreground">Update article content, data, and settings</p>
        </div>
        <div className="flex gap-2">
          <Link href={`/election/articles/${params.id}`}>
            <Button variant="outline" size="sm">
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </Button>
          </Link>
          <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      <ElectionEditForm article={article} articleId={params.id} />
    </div>
  )
}

import { NextRequest, NextResponse } from 'next/server'
import { createPrismaClient } from '@/lib/db-connection'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { hasPermission } from '@/lib/roles'

// DELETE election article
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userRole = (session.user as any)?.role
    if (!hasPermission(userRole, 'canDeleteNews')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const prisma = createPrismaClient()
    const articleId = params.id

    // Check if article exists
    const article = await prisma.election.findUnique({
      where: { id: articleId }
    })

    if (!article) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 })
    }

    // Delete the article
    await prisma.election.delete({
      where: { id: articleId }
    })

    return NextResponse.json({ message: 'Article deleted successfully' })
  } catch (error) {
    console.error('Error deleting article:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  } finally {
    const prisma = createPrismaClient()
    await prisma.$disconnect()
  }
}

// PUT election article (update)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log('PUT request received for article:', params.id)
    
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      console.log('Unauthorized: No session')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userRole = (session.user as any)?.role
    console.log('User role:', userRole)
    
    if (!hasPermission(userRole, 'canEditNews')) {
      console.log('Forbidden: User does not have permission')
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const prisma = createPrismaClient()
    const articleId = params.id
    const body = await request.json()
    
    console.log('Request body:', body)

    // Check if article exists
    const existingArticle = await prisma.election.findUnique({
      where: { id: articleId }
    })

    if (!existingArticle) {
      console.log('Article not found:', articleId)
      return NextResponse.json({ error: 'Article not found' }, { status: 404 })
    }

    console.log('Existing article found:', existingArticle.title)

    // Update the article
    const updatedArticle = await prisma.election.update({
      where: { id: articleId },
      data: {
        title: body.title,
        content: body.content,
        description: body.excerpt,
        category: body.category,
        area: body.area,
        author: body.author,
        published: body.status === 'published',
        publishedAt: body.publishedAt ? new Date(body.publishedAt) : undefined
      }
    })

    console.log('Article updated successfully:', updatedArticle.title)

    return NextResponse.json({ 
      message: 'Article updated successfully',
      article: updatedArticle 
    })
  } catch (error) {
    console.error('Error updating article:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  } finally {
    const prisma = createPrismaClient()
    await prisma.$disconnect()
  }
}

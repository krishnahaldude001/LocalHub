import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

interface RouteParams {
  params: {
    id: string
  }
}

// GET /api/admin/news/[id] - Get specific news article
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const post = await prisma.post.findUnique({
      where: { id: params.id },
    })

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    return NextResponse.json(post)
  } catch (error) {
    console.error('Error fetching news article:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PUT /api/admin/news/[id] - Update news article
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { title, excerpt, content, image, category, area, author, published } = body

    // Generate slug from title if title changed
    let slug
    if (title) {
      slug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')
    }

    const updateData: any = {}
    if (title) updateData.title = title
    if (excerpt) updateData.excerpt = excerpt
    if (content) updateData.content = content
    if (image) updateData.image = image
    if (category) updateData.category = category
    if (area) updateData.area = area
    if (author) updateData.author = author
    if (published !== undefined) updateData.published = published
    if (slug) updateData.slug = slug

    const post = await prisma.post.update({
      where: { id: params.id },
      data: updateData,
    })

    return NextResponse.json(post)
  } catch (error) {
    console.error('Error updating news article:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE /api/admin/news/[id] - Delete news article
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await prisma.post.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ message: 'Post deleted successfully' })
  } catch (error) {
    console.error('Error deleting news article:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { normalizeGoogleDrivePdfEmbedUrl } from '@/lib/google-drive-pdf-embed'

// GET /api/admin/news - Get all news articles
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const posts = await prisma.post.findMany({
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(posts)
  } catch (error) {
    console.error('Error fetching news:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/admin/news - Create new news article
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const {
      title,
      excerpt,
      content,
      image,
      category,
      area,
      author,
      published = true,
      embeddedPdfUrl,
    } = body

    const embeddedPdfUrlTrimmed =
      typeof embeddedPdfUrl === 'string' ? embeddedPdfUrl.trim() : ''
    const embeddedPdfNormalized =
      embeddedPdfUrlTrimmed === ''
        ? null
        : normalizeGoogleDrivePdfEmbedUrl(embeddedPdfUrlTrimmed)
    if (embeddedPdfUrlTrimmed && !embeddedPdfNormalized) {
      return NextResponse.json(
        {
          error:
            'Invalid Google Drive link. Paste a shared file URL (Anyone with the link can view).',
        },
        { status: 400 }
      )
    }

    // Generate slug from title
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')

    const post = await prisma.post.create({
      data: {
        slug,
        title,
        excerpt,
        content,
        image,
        category,
        area,
        author,
        published,
        embeddedPdfUrl: embeddedPdfNormalized,
      },
    })

    return NextResponse.json(post, { status: 201 })
  } catch (error) {
    console.error('Error creating news article:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

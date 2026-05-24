import { NextRequest, NextResponse } from 'next/server'
import { createPrismaClient } from '@/lib/db-connection'
import { serializeContentWithYouTube } from '@/lib/content-utils'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { hasPermission, type UserRole } from '@/lib/roles'
import { slugFromTitle } from '@/lib/news-slug'
import { normalizeGoogleDrivePdfEmbedUrl } from '@/lib/google-drive-pdf-embed'

export async function POST(request: NextRequest) {
  const prisma = createPrismaClient()
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const role = (session.user as { role?: string }).role as UserRole
    if (!hasPermission(role, 'canCreateNews')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()
    const {
      title,
      content,
      excerpt,
      image,
      imageFocusX,
      imageFocusY,
      category,
      area,
      author,
      published,
      youtubeUrl,
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

    const focusX = Number(imageFocusX)
    const imageFocusXClamped =
      Number.isFinite(focusX) ? Math.min(100, Math.max(0, Math.round(focusX))) : 50
    const focusY = Number(imageFocusY)
    const imageFocusYClamped =
      Number.isFinite(focusY) ? Math.min(100, Math.max(0, Math.round(focusY))) : 50

    // Validate required fields
    if (!title || !content || !category || !area || !author) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Serialize content with YouTube URL if provided
    const serializedContent = serializeContentWithYouTube({ content, youtubeUrl })

    // Generate a unique slug
    const baseSlug = slugFromTitle(title)
    let slug = baseSlug
    let counter = 1

    // Check if slug already exists and make it unique
    while (true) {
      const existingPost = await prisma.post.findUnique({
        where: { slug },
        select: { id: true }
      })
      if (!existingPost) break
      slug = `${baseSlug}-${counter}`
      counter++
    }

    // Create the post using Prisma ORM
    const post = await prisma.post.create({
      data: {
        slug,
        title,
        content: serializedContent,
        excerpt: excerpt || '',
        image: image || '',
        imageFocusX: imageFocusXClamped,
        imageFocusY: imageFocusYClamped,
        category,
        area,
        author,
        published: published !== false, // Default to true if not specified
        youtubeUrl: youtubeUrl || null,
        embeddedPdfUrl: embeddedPdfNormalized,
      }
    })

    return NextResponse.json({ 
      success: true, 
      id: post.id 
    })

  } catch (error) {
    console.error('Error creating news article:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

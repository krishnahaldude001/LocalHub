import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { serializeContentWithYouTube } from '@/lib/content-utils'
import { normalizeGoogleDrivePdfEmbedUrl } from '@/lib/google-drive-pdf-embed'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const {
      title,
      content,
      excerpt,
      image,
      imageFocusX,
      imageFocusY,
      youtubeUrl,
      category,
      area,
      author,
      published,
      embeddedPdfUrl,
    } = body

    const focusX = Number(imageFocusX)
    const imageFocusXClamped =
      Number.isFinite(focusX) ? Math.min(100, Math.max(0, Math.round(focusX))) : 50
    const focusY = Number(imageFocusY)
    const imageFocusYClamped =
      Number.isFinite(focusY) ? Math.min(100, Math.max(0, Math.round(focusY))) : 50

    if (!title || !content || !category || !area || !author) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

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

    const serializedContent = serializeContentWithYouTube({ content, youtubeUrl })

    await prisma.post.update({
      where: { id: params.id },
      data: {
        title,
        content: serializedContent,
        excerpt,
        image,
        youtubeUrl: youtubeUrl || null,
        category,
        area,
        author,
        published,
        imageFocusX: imageFocusXClamped,
        imageFocusY: imageFocusYClamped,
        embeddedPdfUrl: embeddedPdfNormalized,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating news article:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.post.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting news article:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

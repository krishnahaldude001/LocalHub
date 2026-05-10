import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/simple-db'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { title, content, excerpt, image, imageFocusX, imageFocusY, youtubeUrl, category, area, author, published } = body

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

    // Update the post
    await query(`
      UPDATE posts 
      SET 
        title = $1,
        content = $2,
        excerpt = $3,
        image = $4,
        "youtubeUrl" = $5,
        category = $6,
        area = $7,
        author = $8,
        published = $9,
        "imageFocusX" = $10,
        "imageFocusY" = $11,
        "updatedAt" = NOW()
      WHERE id = $12
    `, [title, content, excerpt, image, youtubeUrl, category, area, author, published, imageFocusXClamped, imageFocusYClamped, params.id])

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Error updating news article:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Delete the post
    await query('DELETE FROM posts WHERE id = $1', [params.id])

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Error deleting news article:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

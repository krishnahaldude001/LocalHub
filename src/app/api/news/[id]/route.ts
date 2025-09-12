import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/simple-db'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { title, content, excerpt, image, category, area, author, published } = body

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
        category = $5,
        area = $6,
        author = $7,
        published = $8,
        "updatedAt" = NOW()
      WHERE id = $9
    `, [title, content, excerpt, image, category, area, author, published, params.id])

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

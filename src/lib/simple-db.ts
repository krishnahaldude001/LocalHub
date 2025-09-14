import { createPrismaClient } from './db-connection'

// Simple database query function using Prisma
export async function query(text: string, params?: any[]) {
  const prisma = createPrismaClient()
  try {
    // Use Prisma's raw query functionality
    const result = await prisma.$queryRawUnsafe(text, ...(params || []))
    return result as any[]
  } finally {
    await prisma.$disconnect()
  }
}

// Get deals
export async function getDeals(limit = 6, area?: string) {
  let whereClause = 'WHERE d."isActive" = true'
  let params: any[] = [limit]
  
  if (area) {
    whereClause += ' AND (d.area = $2 OR (d.area IS NULL AND s.area = $2))'
    params = [limit, area]
  }
  
  const deals = await query(`
    SELECT 
      d.*, 
      p.name as platform_name, 
      p.color as platform_color,
      s.name as shop_name,
      s.area as shop_area,
      s.phone as shop_phone,
      s.whatsapp as shop_whatsapp,
      s.slug as shop_slug,
      COUNT(c.id) as click_count
    FROM deals d
    LEFT JOIN platforms p ON d."platformId" = p.id
    LEFT JOIN shops s ON d."shopId" = s.id
    LEFT JOIN clicks c ON d.id = c."dealId"
    ${whereClause}
    GROUP BY d.id, p.name, p.color, s.name, s.area, s.phone, s.whatsapp, s.slug
    ORDER BY d."publishedAt" DESC
    LIMIT $1
  `, params)
  
  return deals.map(deal => ({
    ...deal,
    platform: deal.platform_name ? {
      name: deal.platform_name,
      color: deal.platform_color
    } : null,
    shop: deal.shop_name ? {
      name: deal.shop_name,
      area: deal.shop_area,
      phone: deal.shop_phone,
      whatsapp: deal.shop_whatsapp,
      slug: deal.shop_slug
    } : null,
    area: deal.area || deal.shop_area,
    gallery: deal.gallery ? (typeof deal.gallery === 'string' && deal.gallery.startsWith('[') ? JSON.parse(deal.gallery) : [deal.gallery]) : [],
    _count: {
      clicks: parseInt(deal.click_count) || 0
    }
  }))
}

// Get posts
export async function getPosts(limit = 6, area?: string) {
  let whereClause = 'WHERE published = true'
  let params: any[] = [limit]
  
  if (area) {
    whereClause += ' AND area = $2'
    params = [limit, area]
  }
  
  return await query(`
    SELECT *
    FROM posts
    ${whereClause}
    ORDER BY "publishedAt" DESC
    LIMIT $1
  `, params)
}

// Get users
export async function getUsers() {
  return await query('SELECT * FROM users')
}

// Get clicks
export async function getClicks() {
  return await query('SELECT * FROM clicks')
}

// Get post count
export async function getPostCount() {
  const result = await query('SELECT COUNT(*) as count FROM posts')
  return parseInt(result[0].count)
}

// Get platforms
export async function getPlatforms() {
  return await query('SELECT * FROM platforms ORDER BY name ASC')
}

// Get single deal by ID
export async function getDealById(id: string) {
  const deals = await query(`
    SELECT d.*, p.name as platform_name, p.color as platform_color
    FROM deals d
    JOIN platforms p ON d."platformId" = p.id
    WHERE d.id = $1
  `, [id])
  
  if (deals.length === 0) return null
  
  const deal = deals[0]
  return {
    ...deal,
    platform: {
      name: deal.platform_name,
      color: deal.platform_color
    },
    gallery: deal.gallery ? (typeof deal.gallery === 'string' && deal.gallery.startsWith('[') ? JSON.parse(deal.gallery) : [deal.gallery]) : []
  }
}

// Get single post by ID
export async function getPostById(id: string) {
  const posts = await query('SELECT * FROM posts WHERE id = $1', [id])
  return posts.length > 0 ? posts[0] : null
}

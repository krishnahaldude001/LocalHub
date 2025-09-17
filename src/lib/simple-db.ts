import { prisma } from './db'

// Get deals using proper Prisma queries
export async function getDeals(limit = 6, area?: string) {
  const deals = await prisma.deal.findMany({
    where: {
      isActive: true,
      OR: area ? [
        { area: area },
        { shop: { area: area } }
      ] : undefined
    },
    include: {
      platform: true,
      shop: true,
      _count: {
        select: {
          clicks: true
        }
      }
    },
    orderBy: {
      publishedAt: 'desc'
    },
    take: limit
  })
  
  return deals.map(deal => ({
    ...deal,
    area: deal.area || deal.shop?.area,
    gallery: deal.gallery ? (typeof deal.gallery === 'string' && deal.gallery.startsWith('[') ? JSON.parse(deal.gallery) : [deal.gallery]) : []
  }))
}

// Get posts using proper Prisma queries
export async function getPosts(limit = 6, area?: string) {
  return await prisma.post.findMany({
    where: {
      published: true,
      area: area
    },
    orderBy: {
      publishedAt: 'desc'
    },
    take: limit
  })
}

// Get users
export async function getUsers() {
  return await prisma.user.findMany()
}

// Get clicks
export async function getClicks() {
  return await prisma.click.findMany()
}

// Get post count
export async function getPostCount() {
  return await prisma.post.count()
}

// Get platforms
export async function getPlatforms() {
  return await prisma.platform.findMany({
    orderBy: {
      name: 'asc'
    }
  })
}

// Get single deal by ID
export async function getDealById(id: string) {
  const deal = await prisma.deal.findUnique({
    where: { id },
    include: {
      platform: true
    }
  })
  
  if (!deal) return null
  
  return {
    ...deal,
    gallery: deal.gallery ? (typeof deal.gallery === 'string' && deal.gallery.startsWith('[') ? JSON.parse(deal.gallery) : [deal.gallery]) : []
  }
}

// Get single post by ID
export async function getPostById(id: string) {
  return await prisma.post.findUnique({
    where: { id }
  })
}

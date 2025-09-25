import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Create Prisma client with production-optimized settings
function createPrismaClient() {
  try {
    // Use appropriate database URL for environment
    let databaseUrl = process.env.DATABASE_URL
    
    // For production, use connection pooling
    if (process.env.NODE_ENV === 'production') {
      // Use the pooler URL for production
      databaseUrl = process.env.DATABASE_URL
    } else {
      // For development, use direct connection to avoid prepared statement conflicts
      databaseUrl = process.env.DIRECT_URL || process.env.DATABASE_URL
      
      // Add parameters to disable prepared statements in development
      if (databaseUrl?.includes('postgresql://')) {
        const url = new URL(databaseUrl)
        url.search = ''
        url.searchParams.set('prepared_statements', 'false')
        url.searchParams.set('connection_limit', '1')
        url.searchParams.set('pool_timeout', '0')
        url.searchParams.set('connect_timeout', '10')
        url.searchParams.set('sslmode', 'disable')
        databaseUrl = url.toString()
      }
    }
    
    return new PrismaClient({
      log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
      errorFormat: 'pretty',
      datasources: {
        db: {
          url: databaseUrl,
        },
      },
    })
  } catch (error) {
    console.error('Failed to create Prisma client:', error)
    throw error
  }
}

// Use singleton pattern to ensure only one Prisma client instance
export const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}

// Graceful shutdown handlers
const gracefulShutdown = async () => {
  try {
    await prisma.$disconnect()
    console.log('Prisma client disconnected gracefully')
  } catch (error) {
    console.error('Error during Prisma disconnect:', error)
  }
}

process.on('beforeExit', gracefulShutdown)
process.on('SIGINT', gracefulShutdown)
process.on('SIGTERM', gracefulShutdown)

// Helper function to parse gallery JSON string
export function parseGallery(gallery: string | null): string[] {
  if (!gallery) return []
  try {
    return JSON.parse(gallery)
  } catch {
    return []
  }
}

// Helper function to stringify gallery array
export function stringifyGallery(gallery: string[]): string {
  return JSON.stringify(gallery)
}

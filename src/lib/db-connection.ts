import { PrismaClient } from '@prisma/client'

// Create a new Prisma client instance for each request to avoid connection pooling issues
export function createPrismaClient() {
  // For Supabase, use DATABASE_URL (pooler) for better connectivity
  let databaseUrl = process.env.DATABASE_URL || process.env.DIRECT_URL;
  
  // Add connection parameters to prevent prepared statement conflicts
  if (databaseUrl?.includes('postgresql://')) {
    const url = new URL(databaseUrl)
    url.searchParams.set('prepared_statements', 'false')
    url.searchParams.set('connection_limit', '1')
    url.searchParams.set('pool_timeout', '20')
    databaseUrl = url.toString()
  }
  
  return new PrismaClient({
    log: ['error'],
    errorFormat: 'pretty',
    datasources: {
      db: {
        url: databaseUrl,
      },
    },
  })
}

// For server-side usage
export async function withPrisma<T>(
  operation: (prisma: PrismaClient) => Promise<T>
): Promise<T> {
  const prisma = createPrismaClient()
  try {
    return await operation(prisma)
  } finally {
    await prisma.$disconnect()
  }
}

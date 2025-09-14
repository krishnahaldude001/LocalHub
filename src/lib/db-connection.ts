import { PrismaClient } from '@prisma/client'

// Create a new Prisma client instance for each request to avoid connection pooling issues
export function createPrismaClient() {
  // Use direct URL if available, otherwise use the regular DATABASE_URL
  const databaseUrl = process.env.DIRECT_URL || process.env.DATABASE_URL;
  
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

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding platforms...')

  // Default platforms
  const platforms = [
    {
      name: 'Amazon',
      slug: 'amazon',
      color: 'bg-orange-500',
      description: 'Amazon India'
    },
    {
      name: 'Flipkart',
      slug: 'flipkart',
      color: 'bg-blue-500',
      description: 'Flipkart'
    },
    {
      name: 'Meesho',
      slug: 'meesho',
      color: 'bg-pink-500',
      description: 'Meesho'
    },
    {
      name: 'Myntra',
      slug: 'myntra',
      color: 'bg-red-500',
      description: 'Myntra Fashion'
    },
    {
      name: 'Nykaa',
      slug: 'nykaa',
      color: 'bg-purple-500',
      description: 'Nykaa Beauty'
    },
    {
      name: 'Ajio',
      slug: 'ajio',
      color: 'bg-green-500',
      description: 'Ajio Fashion'
    },
    {
      name: 'Tata CLiQ',
      slug: 'tatacliq',
      color: 'bg-indigo-500',
      description: 'Tata CLiQ'
    },
    {
      name: 'Snapdeal',
      slug: 'snapdeal',
      color: 'bg-yellow-500',
      description: 'Snapdeal'
    },
    {
      name: 'Paytm Mall',
      slug: 'paytm',
      color: 'bg-cyan-500',
      description: 'Paytm Mall'
    },
    {
      name: 'ShopClues',
      slug: 'shopclues',
      color: 'bg-teal-500',
      description: 'ShopClues'
    },
    {
      name: 'JioMart',
      slug: 'jiomart',
      color: 'bg-emerald-500',
      description: 'JioMart'
    },
    {
      name: 'BigBasket',
      slug: 'bigbasket',
      color: 'bg-lime-500',
      description: 'BigBasket Grocery'
    },
    {
      name: 'Grofers',
      slug: 'grofers',
      color: 'bg-amber-500',
      description: 'Grofers (Blinkit)'
    },
    {
      name: 'Swiggy',
      slug: 'swiggy',
      color: 'bg-orange-600',
      description: 'Swiggy Instamart'
    },
    {
      name: 'Zomato',
      slug: 'zomato',
      color: 'bg-red-600',
      description: 'Zomato'
    },
    {
      name: 'BookMyShow',
      slug: 'bookmyshow',
      color: 'bg-pink-600',
      description: 'BookMyShow'
    },
    {
      name: 'MakeMyTrip',
      slug: 'makemytrip',
      color: 'bg-blue-600',
      description: 'MakeMyTrip'
    },
    {
      name: 'Goibibo',
      slug: 'goibibo',
      color: 'bg-indigo-600',
      description: 'Goibibo'
    },
    {
      name: 'Cleartrip',
      slug: 'cleartrip',
      color: 'bg-cyan-600',
      description: 'Cleartrip'
    },
    {
      name: 'Other',
      slug: 'other',
      color: 'bg-gray-500',
      description: 'Other Platform'
    }
  ]

  for (const platformData of platforms) {
    try {
      const platform = await prisma.platform.upsert({
        where: { slug: platformData.slug },
        update: {
          name: platformData.name,
          color: platformData.color,
          description: platformData.description,
        },
        create: platformData,
      })
      console.log(`✅ Created/Updated platform: ${platform.name}`)
    } catch (error) {
      console.error(`❌ Error creating platform ${platformData.name}:`, error)
    }
  }

  console.log('🎉 Platform seeding completed!')
  console.log('\n📱 Available platforms:')
  const allPlatforms = await prisma.platform.findMany({ orderBy: { name: 'asc' } })
  allPlatforms.forEach(platform => {
    console.log(`- ${platform.name} (${platform.slug})`)
  })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding deals...')

  // Get platform IDs
  const amazon = await prisma.platform.findUnique({ where: { slug: 'amazon' } })
  const flipkart = await prisma.platform.findUnique({ where: { slug: 'flipkart' } })
  const meesho = await prisma.platform.findUnique({ where: { slug: 'meesho' } })

  if (!amazon || !flipkart || !meesho) {
    console.error('❌ Required platforms not found. Please run platform seeding first.')
    return
  }

  // Sample deals data
  const deals = [
    {
      slug: 'amazon-echo-dot-4th-gen',
      title: 'Echo Dot (4th Gen) - Smart Speaker with Alexa',
      description: 'Smart speaker with Alexa | Charcoal fabric design',
      price: 4999,
      salePrice: 2999,
      platformId: amazon.id,
      affiliateUrl: 'https://amzn.to/example1',
      rating: 4.5,
      cod: true,
      image: 'https://picsum.photos/400/300?random=1',
      gallery: JSON.stringify([
        'https://picsum.photos/400/300?random=2',
        'https://picsum.photos/400/300?random=3'
      ]),
      area: 'Govandi',
      category: 'Electronics',
      discountType: 'percentage'
    },
    {
      slug: 'flipkart-samsung-galaxy-m34',
      title: 'Samsung Galaxy M34 5G (Prism Silver, 8GB, 128GB Storage)',
      description: '6.5 inch FHD+ Display, 50MP Triple Camera, 6000mAh Battery',
      price: 18999,
      salePrice: 15999,
      platformId: flipkart.id,
      affiliateUrl: 'https://flipkart.com/example1',
      rating: 4.2,
      cod: false,
      image: 'https://picsum.photos/400/300?random=4',
      gallery: JSON.stringify([
        'https://picsum.photos/400/300?random=5'
      ]),
      area: 'Shivaji Nagar',
      category: 'Electronics',
      discountType: 'percentage'
    },
    {
      slug: 'meesho-casual-tshirts-pack',
      title: 'Pack of 3 Casual T-Shirts for Men',
      description: 'Comfortable cotton t-shirts, perfect for daily wear',
      price: 999,
      salePrice: 599,
      platformId: meesho.id,
      affiliateUrl: 'https://meesho.com/example1',
      rating: 4.0,
      cod: true,
      image: 'https://picsum.photos/400/300?random=6',
      gallery: JSON.stringify([
        'https://picsum.photos/400/300?random=7'
      ]),
      area: 'Baiganwadi',
      category: 'Fashion',
      discountType: 'percentage'
    },
    {
      slug: 'amazon-mi-tv-4a',
      title: 'Mi TV 4A 80 cm (32 inches) HD Ready Android Smart LED TV',
      description: 'HD Ready (1366x768) | Android 9.0 | 1GB RAM + 8GB Storage',
      price: 15999,
      salePrice: 12999,
      platformId: amazon.id,
      affiliateUrl: 'https://amzn.to/example2',
      rating: 4.3,
      cod: true,
      image: 'https://picsum.photos/400/300?random=8',
      gallery: JSON.stringify([
        'https://picsum.photos/400/300?random=9'
      ]),
      area: 'Govandi',
      category: 'Electronics',
      discountType: 'percentage'
    },
    {
      slug: 'flipkart-boat-rockerz-450',
      title: 'boAt Rockerz 450 Bluetooth Headphones',
      description: '40mm Dynamic Drivers, 15 Hours Playback, Lightweight Design',
      price: 1999,
      salePrice: 1499,
      platformId: flipkart.id,
      affiliateUrl: 'https://flipkart.com/example2',
      rating: 4.1,
      cod: false,
      image: 'https://picsum.photos/400/300?random=10',
      gallery: JSON.stringify([
        'https://picsum.photos/400/300?random=11'
      ]),
      area: 'Shivaji Nagar',
      category: 'Electronics',
      discountType: 'percentage'
    }
  ]

  for (const deal of deals) {
    await prisma.deal.create({
      data: deal
    })
  }

  console.log('✅ Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

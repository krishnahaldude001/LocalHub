import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Clear existing data
  await prisma.click.deleteMany()
  await prisma.deal.deleteMany()
  await prisma.platform.deleteMany()

  // Create platforms first
  const platforms = [
    { name: 'Amazon', slug: 'amazon', color: 'bg-orange-500' },
    { name: 'Flipkart', slug: 'flipkart', color: 'bg-blue-500' },
    { name: 'Meesho', slug: 'meesho', color: 'bg-pink-500' },
    { name: 'Ajio', slug: 'ajio', color: 'bg-purple-500' },
    { name: 'Myntra', slug: 'myntra', color: 'bg-red-500' }
  ]

  for (const platform of platforms) {
    await prisma.platform.create({
      data: platform
    })
  }

  // Get platform IDs
  const amazon = await prisma.platform.findUnique({ where: { slug: 'amazon' } })
  const flipkart = await prisma.platform.findUnique({ where: { slug: 'flipkart' } })
  const meesho = await prisma.platform.findUnique({ where: { slug: 'meesho' } })
  const ajio = await prisma.platform.findUnique({ where: { slug: 'ajio' } })
  const myntra = await prisma.platform.findUnique({ where: { slug: 'myntra' } })

  // Sample deals data
  const deals = [
    {
      slug: 'amazon-echo-dot-4th-gen',
      title: 'Echo Dot (4th Gen) - Smart Speaker with Alexa',
      description: 'Smart speaker with Alexa | Charcoal fabric design',
      price: 4999,
      salePrice: 2999,
      platformId: amazon!.id,
      affiliateUrl: 'https://amzn.to/example1',
      rating: 4.5,
      cod: true,
      image: 'https://picsum.photos/400/300?random=1',
      gallery: JSON.stringify([
        'https://picsum.photos/400/300?random=2',
        'https://picsum.photos/400/300?random=3'
      ]),
      area: 'Govandi'
    },
    {
      slug: 'flipkart-samsung-galaxy-m34',
      title: 'Samsung Galaxy M34 5G (Prism Silver, 8GB, 128GB Storage)',
      description: '6.5 inch FHD+ Display, 50MP Triple Camera, 6000mAh Battery',
      price: 18999,
      salePrice: 15999,
      platformId: flipkart!.id,
      affiliateUrl: 'https://flipkart.com/example1',
      rating: 4.2,
      cod: false,
      image: 'https://picsum.photos/400/300?random=4',
      gallery: JSON.stringify([
        'https://picsum.photos/400/300?random=5'
      ]),
      area: 'Shivaji Nagar'
    },
    {
      slug: 'meesho-casual-tshirts-pack',
      title: 'Pack of 3 Casual T-Shirts for Men',
      description: 'Comfortable cotton t-shirts, perfect for daily wear',
      price: 899,
      salePrice: 599,
      platformId: meesho!.id,
      affiliateUrl: 'https://meesho.com/example1',
      rating: 4.0,
      cod: true,
      image: 'https://picsum.photos/400/300?random=6',
      gallery: JSON.stringify([
        'https://picsum.photos/400/300?random=7'
      ]),
      area: 'Baiganwadi'
    },
    {
      slug: 'ajio-women-kurti-set',
      title: 'Women\'s Cotton Kurti Set with Dupatta',
      description: 'Elegant kurti set perfect for casual and semi-formal occasions',
      price: 1299,
      salePrice: 899,
      platformId: ajio!.id,
      affiliateUrl: 'https://ajio.com/example1',
      rating: 4.3,
      cod: true,
      image: 'https://picsum.photos/400/300?random=8',
      gallery: JSON.stringify([
        'https://picsum.photos/400/300?random=9'
      ]),
      area: 'Govandi'
    },
    {
      slug: 'myntra-sports-shoes',
      title: 'Men\'s Sports Running Shoes',
      description: 'Comfortable running shoes with good grip and cushioning',
      price: 2499,
      salePrice: 1799,
      platformId: myntra!.id,
      affiliateUrl: 'https://myntra.com/example1',
      rating: 4.1,
      cod: false,
      image: 'https://picsum.photos/400/300?random=10',
      gallery: JSON.stringify([
        'https://picsum.photos/400/300?random=11'
      ]),
      area: 'Shivaji Nagar'
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
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding additional news articles...')

  // Additional recent news articles
  const additionalNews = [
    {
      slug: 'govandi-metro-connectivity-update',
      title: 'Metro Connectivity Plans for Govandi Area',
      excerpt: 'BMC announces plans for improved metro connectivity to serve Govandi and surrounding areas.',
      content: `
        <h2>Metro Expansion Plans</h2>
        <p>The Brihanmumbai Municipal Corporation (BMC) has announced new metro connectivity plans for the Govandi area:</p>
        <ul>
          <li>Extension of existing metro lines to serve Govandi Station</li>
          <li>New metro stations planned in Shivaji Nagar and Baiganwadi</li>
          <li>Improved last-mile connectivity with feeder bus services</li>
          <li>Integration with existing railway network</li>
        </ul>
        <p>The project is expected to significantly reduce travel time to central Mumbai and improve overall connectivity for residents.</p>
        <h3>Timeline</h3>
        <p>Construction is expected to begin in 2024 with completion targeted for 2026, subject to necessary approvals and funding.</p>
      `,
      image: 'https://picsum.photos/800/400?random=20',
      category: 'Transport',
      area: 'Govandi',
      author: 'Metro Correspondent',
      published: true
    },
    {
      slug: 'govandi-flood-prevention-measures',
      title: 'New Flood Prevention Measures Implemented',
      excerpt: 'Municipal corporation implements comprehensive flood prevention measures ahead of monsoon season.',
      content: `
        <h2>Flood Prevention Initiative</h2>
        <p>In preparation for the upcoming monsoon season, the municipal corporation has implemented several flood prevention measures:</p>
        <ul>
          <li>Cleaning and desilting of major drains and nullahs</li>
          <li>Installation of new pumping stations in low-lying areas</li>
          <li>Construction of retaining walls along water bodies</li>
          <li>Community awareness programs on flood safety</li>
        </ul>
        <p>These measures aim to prevent waterlogging and flooding in residential areas during heavy rainfall.</p>
        <h3>Community Involvement</h3>
        <p>Residents are encouraged to participate in community cleanup drives and report any blocked drains to the authorities.</p>
      `,
      image: 'https://picsum.photos/800/400?random=21',
      category: 'Infrastructure',
      area: 'Govandi',
      author: 'Disaster Management Reporter',
      published: true
    },
    {
      slug: 'shivaji-nagar-digital-literacy-program',
      title: 'Digital Literacy Program Launched in Shivaji Nagar',
      excerpt: 'Free computer training program helps residents learn essential digital skills.',
      content: `
        <h2>Digital Skills Training</h2>
        <p>A new digital literacy program has been launched in Shivaji Nagar to help residents learn essential computer skills:</p>
        <ul>
          <li>Basic computer operations and internet usage</li>
          <li>Online banking and digital payments</li>
          <li>Government service portals and online applications</li>
          <li>Social media and communication tools</li>
        </ul>
        <p>The program is free for all residents and includes both theoretical and practical training sessions.</p>
        <h3>Registration</h3>
        <p>Interested residents can register at the local community center or online through the program's website.</p>
      `,
      image: 'https://picsum.photos/800/400?random=22',
      category: 'Education',
      area: 'Shivaji Nagar',
      author: 'Technology Correspondent',
      published: true
    },
    {
      slug: 'baiganwadi-women-empowerment-initiative',
      title: 'Women Empowerment Initiative in Baiganwadi',
      excerpt: 'New program provides skill development and entrepreneurship opportunities for women.',
      content: `
        <h2>Empowerment Program</h2>
        <p>A comprehensive women empowerment initiative has been launched in Baiganwadi focusing on:</p>
        <ul>
          <li>Skill development in tailoring, handicrafts, and food processing</li>
          <li>Financial literacy and micro-entrepreneurship training</li>
          <li>Health and nutrition awareness programs</li>
          <li>Legal rights and safety awareness sessions</li>
        </ul>
        <p>The program aims to provide women with the skills and knowledge needed to become financially independent.</p>
        <h3>Success Stories</h3>
        <p>Several participants have already started their own small businesses and are contributing to their family income.</p>
      `,
      image: 'https://picsum.photos/800/400?random=23',
      category: 'Social Development',
      area: 'Baiganwadi',
      author: 'Social Development Reporter',
      published: true
    },
    {
      slug: 'govandi-sports-complex-inauguration',
      title: 'New Sports Complex Inaugurated in Govandi',
      excerpt: 'State-of-the-art sports facility opens with modern amenities for youth and community.',
      content: `
        <h2>Sports Complex Features</h2>
        <p>A new sports complex has been inaugurated in Govandi with modern facilities including:</p>
        <ul>
          <li>Multi-purpose indoor sports hall for badminton, table tennis, and basketball</li>
          <li>Outdoor football and cricket grounds</li>
          <li>Swimming pool and fitness center</li>
          <li>Coaching facilities for various sports</li>
        </ul>
        <p>The complex is open to all residents and offers both recreational and competitive sports programs.</p>
        <h3>Youth Development</h3>
        <p>Special programs are available for youth development, including coaching camps and inter-community tournaments.</p>
      `,
      image: 'https://picsum.photos/800/400?random=24',
      category: 'Sports',
      area: 'Govandi',
      author: 'Sports Correspondent',
      published: true
    }
  ]

  for (const article of additionalNews) {
    try {
      const existingArticle = await prisma.post.findUnique({
        where: { slug: article.slug }
      })

      if (!existingArticle) {
        await prisma.post.create({
          data: article
        })
        console.log(`✅ Created additional news article: ${article.title}`)
      } else {
        console.log(`⏭️  Article already exists: ${article.title}`)
      }
    } catch (error) {
      console.error(`❌ Error creating article ${article.title}:`, error)
    }
  }

  console.log('🎉 Additional news seeding completed!')
  
  // Show total count
  const totalArticles = await prisma.post.count({
    where: { published: true }
  })
  console.log(`📰 Total news articles in database: ${totalArticles}`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

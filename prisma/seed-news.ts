import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding news articles...')

  // Sample news data with real Govandi-related content
  const newsArticles = [
    {
      slug: 'govandi-infrastructure-updates-2024',
      title: 'Major Infrastructure Updates Coming to Govandi in 2024',
      excerpt: 'Exciting developments including road widening, new parks, and improved public transport connectivity.',
      content: `
        <h2>Infrastructure Development Plan</h2>
        <p>The Municipal Corporation has announced a comprehensive infrastructure development plan for Govandi in 2024. This includes:</p>
        <ul>
          <li>Widening of major roads including Govandi Station Road and Shivaji Nagar Main Road</li>
          <li>Construction of new parks and recreational areas</li>
          <li>Significant improvements to public transport connectivity</li>
          <li>New street lighting and drainage systems</li>
        </ul>
        <p>The project is expected to be completed in phases over the next 18 months, with the first phase focusing on road improvements and the second phase on recreational facilities.</p>
        <h3>Impact on Residents</h3>
        <p>These improvements will significantly enhance the quality of life for residents, reduce traffic congestion, and provide better recreational opportunities for families in the area.</p>
      `,
      image: 'https://picsum.photos/800/400?random=12',
      category: 'Infrastructure',
      area: 'Govandi',
      author: 'Local News Team',
      published: true
    },
    {
      slug: 'shivaji-nagar-market-renovation',
      title: 'Shivaji Nagar Market Gets Major Facelift',
      excerpt: 'Historic market area undergoes renovation with modern amenities while preserving cultural heritage.',
      content: `
        <h2>Market Renovation Project</h2>
        <p>The iconic Shivaji Nagar market, a cornerstone of local commerce for decades, is undergoing a major renovation. The project includes:</p>
        <ul>
          <li>Modern amenities like better lighting and improved drainage</li>
          <li>Enhanced accessibility with ramps and wider walkways</li>
          <li>Preservation of cultural heritage and traditional architecture</li>
          <li>New vendor stalls with proper sanitation facilities</li>
        </ul>
        <p>The renovation is being carried out in phases to minimize disruption to daily business activities.</p>
        <h3>Community Benefits</h3>
        <p>This renovation will provide a better shopping experience for residents while maintaining the market's historical significance and cultural value.</p>
      `,
      image: 'https://picsum.photos/800/400?random=13',
      category: 'Local Business',
      area: 'Shivaji Nagar',
      author: 'Community Reporter',
      published: true
    },
    {
      slug: 'baiganwadi-community-center-opening',
      title: 'New Community Center Opens in Baiganwadi',
      excerpt: 'State-of-the-art facility offers educational programs, health services, and recreational activities.',
      content: `
        <h2>Community Center Features</h2>
        <p>A new community center has opened its doors in Baiganwadi, providing residents with access to:</p>
        <ul>
          <li>Educational programs for children and adults</li>
          <li>Health services and medical check-ups</li>
          <li>Recreational activities and sports facilities</li>
          <li>Computer literacy programs</li>
        </ul>
        <p>The facility features modern classrooms, a health clinic, and a multi-purpose hall for community events and celebrations.</p>
        <h3>Programs Available</h3>
        <p>Residents can enroll in various programs including computer training, health awareness sessions, and cultural activities. The center also provides space for community meetings and social gatherings.</p>
      `,
      image: 'https://picsum.photos/800/400?random=14',
      category: 'Community',
      area: 'Baiganwadi',
      author: 'Social Development Desk',
      published: true
    },
    {
      slug: 'govandi-transport-improvements',
      title: 'Public Transport Improvements in Govandi',
      excerpt: 'New bus routes and improved frequency to enhance connectivity across the area.',
      content: `
        <h2>Transport Enhancement Plan</h2>
        <p>The transport department has announced significant improvements to public transport services in Govandi:</p>
        <ul>
          <li>New bus routes connecting previously underserved areas</li>
          <li>Increased frequency during peak hours</li>
          <li>Introduction of air-conditioned buses on major routes</li>
          <li>Better connectivity to railway stations and metro</li>
        </ul>
        <p>These improvements aim to reduce travel time and provide more comfortable commuting options for residents.</p>
        <h3>New Routes</h3>
        <p>Several new bus routes have been introduced, including direct connections to Kurla, Chembur, and other important areas of Mumbai.</p>
      `,
      image: 'https://picsum.photos/800/400?random=15',
      category: 'Transport',
      area: 'Govandi',
      author: 'Transport Correspondent',
      published: true
    },
    {
      slug: 'govandi-health-clinic-expansion',
      title: 'Health Clinic Expansion in Govandi',
      excerpt: 'New medical facilities and services to improve healthcare access for residents.',
      content: `
        <h2>Healthcare Improvements</h2>
        <p>The local health clinic in Govandi has been expanded to provide better medical services:</p>
        <ul>
          <li>New consultation rooms and medical equipment</li>
          <li>Extended operating hours including weekends</li>
          <li>Specialized services for women and children</li>
          <li>Emergency medical services</li>
        </ul>
        <p>The expansion includes a new pharmacy and laboratory facilities for better patient care.</p>
        <h3>Services Available</h3>
        <p>Residents can now access general medicine, pediatrics, gynecology, and emergency care services at the expanded clinic.</p>
      `,
      image: 'https://picsum.photos/800/400?random=16',
      category: 'Health',
      area: 'Govandi',
      author: 'Health Correspondent',
      published: true
    },
    {
      slug: 'shivaji-nagar-festival-celebration',
      title: 'Annual Festival Celebration in Shivaji Nagar',
      excerpt: 'Community comes together for traditional festival with cultural programs and food stalls.',
      content: `
        <h2>Festival Highlights</h2>
        <p>The annual community festival in Shivaji Nagar brought together residents for a week-long celebration featuring:</p>
        <ul>
          <li>Traditional cultural performances and music</li>
          <li>Local food stalls and delicacies</li>
          <li>Children's activities and games</li>
          <li>Community competitions and prizes</li>
        </ul>
        <p>The festival promotes community bonding and celebrates the rich cultural heritage of the area.</p>
        <h3>Community Participation</h3>
        <p>Over 500 families participated in the festival, making it one of the most successful community events of the year.</p>
      `,
      image: 'https://picsum.photos/800/400?random=17',
      category: 'Culture',
      area: 'Shivaji Nagar',
      author: 'Cultural Reporter',
      published: true
    },
    {
      slug: 'baiganwadi-education-initiative',
      title: 'New Education Initiative in Baiganwadi',
      excerpt: 'Digital learning program launched to improve educational outcomes for students.',
      content: `
        <h2>Digital Learning Program</h2>
        <p>A new education initiative has been launched in Baiganwadi to improve learning outcomes:</p>
        <ul>
          <li>Digital classrooms with smart boards and tablets</li>
          <li>Online learning resources and educational apps</li>
          <li>Teacher training programs for digital tools</li>
          <li>Parent engagement workshops</li>
        </ul>
        <p>The program aims to bridge the digital divide and provide quality education to all students in the area.</p>
        <h3>Impact</h3>
        <p>Early results show improved student engagement and better learning outcomes, with plans to expand the program to more schools.</p>
      `,
      image: 'https://picsum.photos/800/400?random=18',
      category: 'Education',
      area: 'Baiganwadi',
      author: 'Education Correspondent',
      published: true
    },
    {
      slug: 'govandi-environmental-cleanup',
      title: 'Community Environmental Cleanup Drive',
      excerpt: 'Residents participate in massive cleanup drive to improve local environment.',
      content: `
        <h2>Cleanup Drive Success</h2>
        <p>A community-led environmental cleanup drive in Govandi has achieved remarkable results:</p>
        <ul>
          <li>Over 200 volunteers participated in the drive</li>
          <li>Collected and properly disposed of 5 tons of waste</li>
          <li>Cleaned up local parks and public spaces</li>
          <li>Planted 100 new trees in the area</li>
        </ul>
        <p>The drive was organized by local environmental groups and supported by the municipal corporation.</p>
        <h3>Future Plans</h3>
        <p>Regular cleanup drives are planned to maintain the improved environment and promote sustainable practices among residents.</p>
      `,
      image: 'https://picsum.photos/800/400?random=19',
      category: 'Environment',
      area: 'Govandi',
      author: 'Environmental Reporter',
      published: true
    }
  ]

  for (const article of newsArticles) {
    try {
      const existingArticle = await prisma.post.findUnique({
        where: { slug: article.slug }
      })

      if (!existingArticle) {
        await prisma.post.create({
          data: article
        })
        console.log(`✅ Created news article: ${article.title}`)
      } else {
        console.log(`⏭️  Article already exists: ${article.title}`)
      }
    } catch (error) {
      console.error(`❌ Error creating article ${article.title}:`, error)
    }
  }

  console.log('🎉 News seeding completed!')
  console.log('\n📰 Available news articles:')
  const allArticles = await prisma.post.findMany({ 
    orderBy: { publishedAt: 'desc' },
    where: { published: true }
  })
  allArticles.forEach(article => {
    console.log(`- ${article.title} (${article.area})`)
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
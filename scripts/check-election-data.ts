import { createPrismaClient } from '../src/lib/db-connection'

async function checkElectionData() {
  const prisma = createPrismaClient()
  
  try {
    console.log('🗳️ Checking Election Data in Database...\n')
    
    // Check election content
    const elections = await prisma.election.findMany({
      select: {
        id: true,
        title: true,
        slug: true,
        category: true,
        area: true,
        author: true,
        published: true,
        viewCount: true,
        publishedAt: true,
        image: true,
        youtubeUrl: true
      },
      orderBy: { publishedAt: 'desc' }
    })
    
    console.log(`📊 Found ${elections.length} election entries:`)
    
    if (elections.length === 0) {
      console.log('❌ No election data found in database!')
      console.log('\n💡 To add election data, you can:')
      console.log('1. Use the admin panel to create election content')
      console.log('2. Run a seed script to add sample data')
      console.log('3. Import data from external sources')
    } else {
      elections.forEach((election, index) => {
        console.log(`\n${index + 1}. ${election.title}`)
        console.log(`   Slug: ${election.slug}`)
        console.log(`   Category: ${election.category}`)
        console.log(`   Area: ${election.area}`)
        console.log(`   Author: ${election.author}`)
        console.log(`   Published: ${election.published ? 'Yes' : 'No'}`)
        console.log(`   Views: ${election.viewCount}`)
        console.log(`   Published: ${election.publishedAt.toLocaleDateString()}`)
        if (election.image) {
          console.log(`   Image: ${election.image}`)
        }
        if (election.youtubeUrl) {
          console.log(`   YouTube: ${election.youtubeUrl}`)
        }
      })
    }
    
    // Check view analytics for election content
    const electionViews = await prisma.view.findMany({
      where: {
        type: 'election'
      },
      select: {
        id: true,
        contentId: true,
        userAgent: true,
        ipAddress: true,
        referrer: true,
        createdAt: true
      },
      orderBy: { createdAt: 'desc' },
      take: 10
    })
    
    console.log(`\n📈 Election Analytics:`)
    console.log(`   Total election views: ${electionViews.length}`)
    
    if (electionViews.length > 0) {
      console.log(`   Recent views:`)
      electionViews.slice(0, 5).forEach((view, index) => {
        console.log(`   ${index + 1}. Content ID: ${view.contentId}`)
        console.log(`      Date: ${view.createdAt.toLocaleDateString()}`)
        console.log(`      IP: ${view.ipAddress || 'Unknown'}`)
        console.log(`      Referrer: ${view.referrer || 'Direct'}`)
      })
    }
    
    // Check for any election-related images in public folder
    console.log(`\n🖼️ Checking for election images...`)
    console.log(`   Public folder contents: Check manually in /public directory`)
    console.log(`   Look for files like: election-*.jpg, analytics-*.png, charts-*.svg`)
    
    // Summary
    console.log(`\n📋 Election Data Summary:`)
    console.log(`   Election entries: ${elections.length}`)
    console.log(`   Total views: ${electionViews.length}`)
    console.log(`   Published entries: ${elections.filter(e => e.published).length}`)
    console.log(`   Categories: ${Array.from(new Set(elections.map(e => e.category))).join(', ')}`)
    console.log(`   Areas: ${Array.from(new Set(elections.map(e => e.area))).join(', ')}`)
    
    if (elections.length === 0) {
      console.log(`\n🚀 Next Steps:`)
      console.log(`1. Create election content via admin panel`)
      console.log(`2. Add sample election data`)
      console.log(`3. Upload analytics images to /public folder`)
      console.log(`4. Test election reports functionality`)
    }
    
  } catch (error) {
    console.error('❌ Error checking election data:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Run the check
checkElectionData()

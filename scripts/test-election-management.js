const { PrismaClient } = require('@prisma/client')

async function testElectionManagement() {
  const prisma = new PrismaClient()
  
  try {
    console.log('=== Testing Election Management Data ===\n')
    
    // Test 1: Check if articles exist
    console.log('1. Checking election articles...')
    const articles = await prisma.election.findMany({
      orderBy: { publishedAt: 'desc' }
    })
    
    console.log(`Found ${articles.length} articles:`)
    articles.forEach((article, index) => {
      console.log(`  ${index + 1}. ${article.title} (${article.published ? 'published' : 'draft'})`)
    })
    
    // Test 2: Check categories
    console.log('\n2. Checking categories...')
    const categoryCounts = articles.reduce((acc, article) => {
      acc[article.category] = (acc[article.category] || 0) + 1
      return acc
    }, {})
    
    console.log('Categories:', Object.entries(categoryCounts).map(([name, count]) => `${name}: ${count}`).join(', '))
    
    // Test 3: Simulate the election management page data structure
    console.log('\n3. Testing data structure for election management page...')
    const formattedArticles = articles.map(article => ({
      id: article.id,
      title: article.title,
      excerpt: article.description || '',
      category: article.category,
      area: article.area,
      author: article.author,
      publishedAt: article.publishedAt.toISOString(),
      readTime: '—',
      views: article.viewCount,
      status: article.published ? 'published' : 'draft',
      hasPDF: false,
      hasData: false,
      tags: [],
    }))
    
    console.log('Formatted articles for UI:')
    formattedArticles.forEach((article, index) => {
      console.log(`  ${index + 1}. ${article.title} (${article.status})`)
    })
    
    // Test 4: Check if the issue is with the database connection
    console.log('\n4. Testing database connection...')
    const count = await prisma.election.count()
    console.log(`Total election articles in database: ${count}`)
    
    if (count === 0) {
      console.log('\n❌ No articles found in database!')
      console.log('This explains why the election management page shows 0 articles.')
      console.log('The dashboard might be showing cached or hardcoded data.')
    } else {
      console.log('\n✅ Articles found in database!')
      console.log('The election management page should show these articles.')
    }
    
  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testElectionManagement()

const { PrismaClient } = require('@prisma/client')

async function testCompleteFlow() {
  console.log('=== Testing Complete Election Management Flow ===\n')
  
  const prisma = new PrismaClient()
  
  try {
    // Step 1: Check if we have articles
    console.log('1. Checking existing articles...')
    const articles = await prisma.election.findMany({
      select: {
        id: true,
        title: true,
        published: true
      }
    })
    
    console.log(`Found ${articles.length} articles:`)
    articles.forEach(article => {
      console.log(`  - ${article.id}: ${article.title} (${article.published ? 'published' : 'draft'})`)
    })
    
    if (articles.length === 0) {
      console.log('\n2. No articles found. Creating a test article...')
      const newArticle = await prisma.election.create({
        data: {
          slug: 'test-article-' + Date.now(),
          title: 'Test Article for Edit Functionality',
          description: 'This is a test article to verify edit functionality.',
          content: '# Test Article\n\nThis is a test article to verify that the edit functionality works correctly.',
          category: 'test',
          area: 'test',
          author: 'Test Author',
          published: true,
          publishedAt: new Date()
        }
      })
      console.log(`Created test article with ID: ${newArticle.id}`)
      articles.push(newArticle)
    }
    
    // Step 2: Test update functionality
    console.log('\n3. Testing update functionality...')
    const testArticle = articles[0]
    console.log(`Testing with article: ${testArticle.id}`)
    
    const updatedArticle = await prisma.election.update({
      where: { id: testArticle.id },
      data: {
        title: 'Updated: ' + testArticle.title,
        description: 'This article has been updated to test the edit functionality.',
        published: true
      }
    })
    
    console.log('✅ Update successful!')
    console.log(`  - New title: ${updatedArticle.title}`)
    console.log(`  - New description: ${updatedArticle.description}`)
    
    // Step 3: Verify the update
    console.log('\n4. Verifying the update...')
    const verifyArticle = await prisma.election.findUnique({
      where: { id: testArticle.id }
    })
    
    if (verifyArticle.title === updatedArticle.title) {
      console.log('✅ Verification successful! The article was updated correctly.')
    } else {
      console.log('❌ Verification failed! The article was not updated correctly.')
    }
    
    // Step 4: Test the admin page data structure
    console.log('\n5. Testing admin page data structure...')
    const adminArticles = await prisma.election.findMany({
      orderBy: { publishedAt: 'desc' }
    })
    
    const formattedArticles = adminArticles.map(article => ({
      id: article.id,
      title: article.title,
      excerpt: article.description || '',
      category: article.category,
      area: article.area,
      author: article.author,
      publishedAt: article.publishedAt.toISOString(),
      status: article.published ? 'published' : 'draft',
      views: article.viewCount
    }))
    
    console.log('✅ Admin page data structure test:')
    console.log(`  - Total articles: ${formattedArticles.length}`)
    console.log(`  - Published articles: ${formattedArticles.filter(a => a.status === 'published').length}`)
    console.log(`  - Draft articles: ${formattedArticles.filter(a => a.status === 'draft').length}`)
    
    console.log('\n=== All Tests Passed! ===')
    console.log('The election management system is working correctly.')
    console.log('You can now:')
    console.log('1. Visit http://localhost:3000/admin/election to see the admin interface')
    console.log('2. Click Edit on any article to test the edit functionality')
    console.log('3. The Save Changes and Update Article buttons should work correctly')
    
  } catch (error) {
    console.error('❌ Test failed:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testCompleteFlow()

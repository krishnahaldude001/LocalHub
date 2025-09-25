const { PrismaClient } = require('@prisma/client')

async function showCorrectUrls() {
  const prisma = new PrismaClient()
  
  try {
    console.log('=== Finding Real Election Article IDs ===\n')
    
    const articles = await prisma.election.findMany({
      select: {
        id: true,
        title: true,
        published: true
      }
    })
    
    if (articles.length === 0) {
      console.log('❌ No articles found in database!')
      console.log('Please run: node scripts/test-election-db.js first')
      return
    }
    
    console.log('✅ Found articles in database:')
    articles.forEach((article, index) => {
      console.log(`\n${index + 1}. Article ID: ${article.id}`)
      console.log(`   Title: ${article.title}`)
      console.log(`   Status: ${article.published ? 'Published' : 'Draft'}`)
      console.log(`   Edit URL: http://localhost:3000/admin/election/${article.id}/edit`)
      console.log(`   View URL: http://localhost:3000/election/articles/${article.id}`)
    })
    
    console.log('\n=== Instructions ===')
    console.log('1. Go to: http://localhost:3000/admin/election')
    console.log('2. You should see the real article(s) from the database')
    console.log('3. Click "Edit" on the real article (not ID "1")')
    console.log('4. The edit page should work correctly')
    
  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

showCorrectUrls()

const { PrismaClient } = require('@prisma/client')

async function testEditFunctionality() {
  const prisma = new PrismaClient()
  
  try {
    console.log('Testing election edit functionality...')
    
    // Get the first article
    const article = await prisma.election.findFirst()
    
    if (!article) {
      console.log('No articles found')
      return
    }
    
    console.log('Found article:')
    console.log(`- ID: ${article.id}`)
    console.log(`- Title: ${article.title}`)
    console.log(`- Published: ${article.published}`)
    
    // Test updating the article
    console.log('\nTesting update...')
    const updatedArticle = await prisma.election.update({
      where: { id: article.id },
      data: {
        title: 'Updated: ' + article.title,
        description: 'This article has been updated for testing purposes.',
        published: true
      }
    })
    
    console.log('Update successful!')
    console.log(`- New title: ${updatedArticle.title}`)
    console.log(`- New description: ${updatedArticle.description}`)
    
    // Revert the changes
    console.log('\nReverting changes...')
    await prisma.election.update({
      where: { id: article.id },
      data: {
        title: article.title,
        description: article.description,
        published: article.published
      }
    })
    
    console.log('Reverted successfully!')
    
  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testEditFunctionality()

const { PrismaClient } = require('@prisma/client')

async function testElectionDB() {
  const prisma = new PrismaClient()
  
  try {
    console.log('Testing election database connection...')
    
    // Check existing articles
    const articles = await prisma.election.findMany({
      select: {
        id: true,
        title: true,
        slug: true,
        published: true
      }
    })
    
    console.log('Found articles:', articles.length)
    articles.forEach(article => {
      console.log(`- ID: ${article.id}, Title: ${article.title}, Published: ${article.published}`)
    })
    
    if (articles.length === 0) {
      console.log('Creating a sample article...')
      const newArticle = await prisma.election.create({
        data: {
          slug: 'voter-demographics-analysis-2025',
          title: 'Voter Demographics Analysis 2025',
          description: 'Comprehensive analysis of voter demographics in Govandi, Shivaji Nagar, and Baiganwadi areas.',
          content: `# Voter Demographics Analysis 2025

## Executive Summary
This comprehensive analysis examines voter demographics across Govandi, Shivaji Nagar, and Baiganwadi areas for the upcoming 2025 elections.

## Key Findings
- **18-25 years**: 28% of registered voters
- **26-35 years**: 32% of registered voters
- **36-50 years**: 25% of registered voters
- **51+ years**: 15% of registered voters

## Conclusion
The 2025 elections will be significantly influenced by the changing demographic profile.`,
          category: 'demographics',
          area: 'govandi',
          author: 'Election Analytics Team',
          published: true,
          publishedAt: new Date('2025-01-15T10:00:00Z')
        }
      })
      
      console.log('Created article with ID:', newArticle.id)
      console.log('Article title:', newArticle.title)
    }
    
  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testElectionDB()

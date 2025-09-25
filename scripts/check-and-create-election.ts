import { prisma } from '../src/lib/db'

async function checkAndCreateElection() {
  try {
    console.log('Checking existing election articles...')
    
    // Check what election articles exist
    const existingArticles = await prisma.election.findMany({
      select: {
        id: true,
        title: true,
        slug: true,
        published: true
      }
    })
    
    console.log('Existing articles:', existingArticles)
    
    if (existingArticles.length === 0) {
      console.log('No election articles found. Creating a sample article...')
      
      // Create a sample election article
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
    } else {
      console.log('Found existing articles. Using the first one for testing.')
      const firstArticle = existingArticles[0]
      console.log('Using article ID:', firstArticle.id)
      console.log('Article title:', firstArticle.title)
    }
    
  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkAndCreateElection()

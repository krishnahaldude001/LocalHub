import { createPrismaClient } from '../src/lib/db-connection'

async function seedElectionData() {
  const prisma = createPrismaClient()
  
  try {
    console.log('🗳️ Seeding Election Data...\n')
    
    // Sample election content
    const electionData = [
      {
        slug: 'voter-demographics-govandi-2025',
        title: 'Voter Demographics Analysis - Govandi 2025',
        description: 'Comprehensive demographic analysis of voters in Govandi area for the 2025 elections.',
        content: `
# Voter Demographics Analysis - Govandi 2025

## Executive Summary
This report provides a detailed analysis of voter demographics in the Govandi constituency for the upcoming 2025 elections.

## Key Findings

### Age Distribution
- **18-25 years**: 28% of registered voters
- **26-35 years**: 32% of registered voters  
- **36-50 years**: 25% of registered voters
- **51+ years**: 15% of registered voters

### Gender Distribution
- **Male**: 52% of registered voters
- **Female**: 48% of registered voters

### Community Analysis
- **Marathi**: 45% of population
- **Hindi**: 30% of population
- **Gujarati**: 15% of population
- **Other**: 10% of population

## Voting Patterns
Based on historical data and current trends, the following patterns emerge:

1. **Youth Engagement**: High participation among 18-25 age group
2. **Digital Influence**: Social media plays significant role in voter decisions
3. **Local Issues**: Infrastructure and employment are top concerns
4. **Community Factors**: Strong community-based voting patterns

## Recommendations
1. Focus on youth-centric campaigns
2. Address local infrastructure concerns
3. Engage with community leaders
4. Utilize digital platforms for outreach
        `,
        category: 'poll',
        area: 'Govandi',
        author: 'Election Analytics Team',
        published: true,
        image: '/election/demographics-chart.png',
        youtubeUrl: 'https://youtube.com/watch?v=example1'
      },
      {
        slug: 'constituency-analysis-shivaji-nagar',
        title: 'Constituency Analysis - Shivaji Nagar',
        description: 'Detailed constituency analysis with candidate profiles and historical data.',
        content: `
# Constituency Analysis - Shivaji Nagar

## Constituency Overview
Shivaji Nagar constituency has been a key battleground in previous elections with close contests between major parties.

## Key Candidates

### Candidate A (INC)
- **Experience**: 15 years in politics
- **Key Issues**: Education, Healthcare, Infrastructure
- **Support Base**: Youth, Middle Class
- **Previous Performance**: 45% vote share in 2019

### Candidate B (BJP)
- **Experience**: 12 years in politics  
- **Key Issues**: Development, Security, Employment
- **Support Base**: Business Community, Senior Citizens
- **Previous Performance**: 48% vote share in 2019

### Candidate C (Independent)
- **Experience**: 8 years in local governance
- **Key Issues**: Local Development, Transparency
- **Support Base**: Local Communities
- **Previous Performance**: 7% vote share in 2019

## Historical Trends
- **2019**: BJP won with 48% votes
- **2014**: INC won with 42% votes
- **2009**: INC won with 38% votes

## Current Predictions
Based on current trends and ground reports:
- **BJP**: 45-50% (Strong position)
- **INC**: 40-45% (Competitive)
- **Others**: 5-10% (Swing factor)
        `,
        category: 'candidate',
        area: 'Shivaji Nagar',
        author: 'Political Analyst',
        published: true,
        image: '/election/constituency-map.png',
        youtubeUrl: 'https://youtube.com/watch?v=example2'
      },
      {
        slug: 'election-predictions-2025',
        title: 'Election Predictions 2025 - Data Analysis',
        description: 'Data-driven predictions and forecasts for the 2025 elections.',
        content: `
# Election Predictions 2025 - Data Analysis

## Methodology
Our predictions are based on:
- Historical voting patterns
- Current opinion polls
- Demographic analysis
- Ground reports
- Social media sentiment

## Prediction Models

### Model 1: Historical Trend Analysis
- **Accuracy**: 78% in previous elections
- **Method**: Linear regression on historical data
- **Result**: BJP leads with 52% probability

### Model 2: Demographic Analysis  
- **Accuracy**: 82% in previous elections
- **Method**: Age, gender, community-based predictions
- **Result**: Close contest with BJP slight edge

### Model 3: Sentiment Analysis
- **Accuracy**: 75% in previous elections
- **Method**: Social media and news sentiment
- **Result**: Mixed signals, high uncertainty

## Final Predictions

### Probability Distribution
- **BJP**: 45% probability
- **INC**: 40% probability  
- **Others**: 15% probability

### Confidence Level
- **High Confidence**: 60% of predictions
- **Medium Confidence**: 30% of predictions
- **Low Confidence**: 10% of predictions

## Risk Factors
1. **Voter Turnout**: Unpredictable weather impact
2. **Last-minute Issues**: Breaking news events
3. **Third Party Factor**: Independent candidates
4. **External Factors**: National political climate

## Recommendations
1. Focus on high-probability areas
2. Prepare for multiple scenarios
3. Monitor real-time developments
4. Adjust strategies based on feedback
        `,
        category: 'poll',
        area: 'Baiganwadi',
        author: 'Data Science Team',
        published: true,
        image: '/election/prediction-chart.png',
        youtubeUrl: 'https://youtube.com/watch?v=example3'
      },
      {
        slug: 'infrastructure-development-issues',
        title: 'Infrastructure Development - Key Issues',
        description: 'Analysis of infrastructure issues affecting voter decisions.',
        content: `
# Infrastructure Development - Key Issues

## Current Infrastructure Status

### Roads and Transportation
- **Condition**: Poor in 60% of areas
- **Maintenance**: Inadequate
- **Public Transport**: Limited connectivity
- **Traffic**: Major congestion points

### Water and Sanitation
- **Water Supply**: Irregular in many areas
- **Sanitation**: Basic facilities lacking
- **Drainage**: Poor drainage system
- **Waste Management**: Inefficient

### Healthcare Facilities
- **Hospitals**: Limited number
- **Clinics**: Insufficient coverage
- **Emergency Services**: Poor response time
- **Specialized Care**: Not available locally

### Education Infrastructure
- **Schools**: Overcrowded classrooms
- **Colleges**: Limited options
- **Libraries**: Inadequate resources
- **Digital Infrastructure**: Poor connectivity

## Voter Concerns
Based on surveys and feedback:

1. **Road Development**: 35% of voters prioritize
2. **Water Supply**: 28% of voters prioritize  
3. **Healthcare**: 22% of voters prioritize
4. **Education**: 15% of voters prioritize

## Political Promises
### Party A Promises:
- 100% road coverage in 2 years
- 24x7 water supply
- New hospital construction
- Digital education infrastructure

### Party B Promises:
- Metro connectivity
- Water treatment plants
- Healthcare for all
- Skill development centers

## Impact on Voting
Infrastructure development is expected to be a major factor in voter decisions, with 70% of voters considering it a top priority.
        `,
        category: 'issue',
        area: 'Govandi',
        author: 'Infrastructure Analyst',
        published: true,
        image: '/election/infrastructure-map.png'
      }
    ]

    // Clear existing election data
    console.log('🧹 Clearing existing election data...')
    await prisma.election.deleteMany()
    
    // Add new election data
    console.log('📝 Adding election content...')
    for (const election of electionData) {
      await prisma.election.create({
        data: election
      })
      console.log(`✅ Added: ${election.title}`)
    }
    
    // Add some sample analytics data
    console.log('📊 Adding sample analytics data...')
    const sampleViews = [
      { type: 'election', contentId: electionData[0].slug, userAgent: 'Mozilla/5.0...', ipAddress: '192.168.1.1', referrer: 'google.com' },
      { type: 'election', contentId: electionData[1].slug, userAgent: 'Mozilla/5.0...', ipAddress: '192.168.1.2', referrer: 'facebook.com' },
      { type: 'election', contentId: electionData[2].slug, userAgent: 'Mozilla/5.0...', ipAddress: '192.168.1.3', referrer: 'twitter.com' },
      { type: 'election', contentId: electionData[0].slug, userAgent: 'Mozilla/5.0...', ipAddress: '192.168.1.4', referrer: 'direct' },
      { type: 'election', contentId: electionData[1].slug, userAgent: 'Mozilla/5.0...', ipAddress: '192.168.1.5', referrer: 'linkedin.com' }
    ]
    
    for (const view of sampleViews) {
      await prisma.view.create({
        data: view
      })
    }
    
    console.log('✅ Added sample analytics data')
    
    // Summary
    console.log('\n📋 Election Data Summary:')
    console.log(`   Election entries: ${electionData.length}`)
    console.log(`   Categories: ${[...new Set(electionData.map(e => e.category))].join(', ')}`)
    console.log(`   Areas: ${[...new Set(electionData.map(e => e.area))].join(', ')}`)
    console.log(`   Sample views: ${sampleViews.length}`)
    
    console.log('\n🎉 Election data seeded successfully!')
    console.log('\n📁 Next Steps:')
    console.log('1. Add analytics images to /public/election/ folder')
    console.log('2. Test election reports at /election/reports/')
    console.log('3. Manage content via /admin/election/')
    
  } catch (error) {
    console.error('❌ Error seeding election data:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Run the seeding
seedElectionData()

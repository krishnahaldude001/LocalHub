import { Metadata } from 'next'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import Link from 'next/link'
import { ArrowLeft, Download, BarChart3, FileText, Calendar, Eye, User, Tag, Share2, Bookmark } from 'lucide-react'
import ArticleImage from '@/components/article-image'

export const metadata: Metadata = {
  title: 'Election Article | LocalHub',
  description: 'Detailed election analysis with data, charts, and insights.',
}

// Sample article data - this would come from database
const getArticleData = (id: string) => {
  const articles = {
    '1': {
      title: 'Voter Demographics Analysis 2025',
      excerpt: 'Comprehensive analysis of voter demographics in Govandi, Shivaji Nagar, and Baiganwadi areas.',
      category: 'Demographics',
      area: 'Govandi',
      author: 'Election Analytics Team',
      publishedAt: '2025-01-15',
      readTime: '8 min read',
      views: 1250,
      image: '/election/demographics-chart.svg',
      hasPDF: true,
      hasData: true,
      tags: ['Demographics', 'Voting Patterns', 'Age Groups'],
      content: `
# Voter Demographics Analysis 2025

## Executive Summary
This comprehensive analysis examines voter demographics across Govandi, Shivaji Nagar, and Baiganwadi areas for the upcoming 2025 elections. Our data reveals significant trends in age distribution, gender participation, and community-based voting patterns.

## Key Findings

### Age Distribution Analysis
Our research shows a significant shift in voter demographics:

- **18-25 years**: 28% of registered voters (↑ 5% from 2019)
- **26-35 years**: 32% of registered voters (↑ 3% from 2019)
- **36-50 years**: 25% of registered voters (↓ 2% from 2019)
- **51+ years**: 15% of registered voters (↓ 6% from 2019)

### Gender Participation
The gender gap in voter registration has narrowed significantly:

- **Male voters**: 52% of registered voters
- **Female voters**: 48% of registered voters
- **Gender gap**: Reduced from 8% in 2019 to 4% in 2025

### Community Analysis
Community-wise distribution shows interesting patterns:

- **Marathi community**: 45% of population
- **Hindi-speaking**: 30% of population
- **Gujarati community**: 15% of population
- **Other communities**: 10% of population

## Data Visualization

### Interactive Charts
Our analysis includes several interactive charts showing:
- Age-wise voter distribution
- Gender participation trends
- Community-wise voting patterns
- Historical comparison data

### Key Metrics
- **Total registered voters**: 2,45,000
- **New registrations (2024-25)**: 18,500
- **Voter turnout projection**: 68-72%
- **Youth participation**: Expected to increase by 12%

## Methodology
This analysis is based on:
- Official voter registration data
- Census 2021 data
- Sample surveys conducted in target areas
- Historical election data analysis
- Community leader interviews

## Implications for 2025 Elections

### Youth Factor
The significant increase in young voters (18-35 years) suggests:
- Digital campaigning will be crucial
- Social media influence will be high
- Local development issues will be prioritized
- Employment and education will be key concerns

### Community Dynamics
The community distribution indicates:
- Multi-lingual campaign materials needed
- Community-specific messaging required
- Local leaders' influence will be significant
- Cultural sensitivities must be considered

## Recommendations

### For Political Parties
1. **Youth Engagement**: Develop youth-centric policies and campaigns
2. **Digital Strategy**: Invest heavily in social media and digital outreach
3. **Local Issues**: Focus on employment, education, and infrastructure
4. **Community Outreach**: Engage with community leaders and organizations

### For Voters
1. **Registration**: Ensure all eligible family members are registered
2. **Information**: Stay informed about candidates and issues
3. **Participation**: Encourage community participation in democratic process
4. **Verification**: Verify voter details and polling booth locations

## Data Sources
- Election Commission of India
- Census of India 2021
- Local administration records
- Community surveys
- Historical election data

## Download Resources
- **Full Report PDF**: Comprehensive 25-page analysis
- **Data Sheets**: Excel files with raw data
- **Charts**: High-resolution images of all visualizations
- **Summary**: Executive summary for quick reference

## Conclusion
The 2025 elections in these areas will be significantly influenced by the changing demographic profile, with youth and women playing crucial roles. Political parties must adapt their strategies to address the concerns of these key voter segments.
      `,
      pdfUrl: '/election/reports/demographics-analysis-2025.pdf',
      dataFiles: [
        { name: 'Age Distribution Data', url: '/election/data/age-distribution.xlsx' },
        { name: 'Gender Analysis', url: '/election/data/gender-analysis.xlsx' },
        { name: 'Community Data', url: '/election/data/community-data.xlsx' }
      ],
      charts: [
        { title: 'Age-wise Voter Distribution', image: '/election/charts/age-distribution.png' },
        { title: 'Gender Participation Trends', image: '/election/charts/gender-trends.png' },
        { title: 'Community-wise Analysis', image: '/election/charts/community-analysis.png' }
      ],
      inlineImages: [
        {
          url: '/election/inline/voter-registration-trends.png',
          caption: 'Voter registration trends over the past 5 years showing significant growth in youth participation',
          position: 'after-age-analysis'
        },
        {
          url: '/election/inline/community-distribution-map.png',
          caption: 'Geographic distribution of different communities across the target areas',
          position: 'after-community-analysis'
        },
        {
          url: '/election/inline/gender-gap-reduction.png',
          caption: 'Historical comparison showing the reduction in gender gap in voter registration',
          position: 'after-gender-analysis'
        }
      ]
    }
  }
  
  return articles[id as keyof typeof articles] || null
}

interface ArticlePageProps {
  params: {
    id: string
  }
}


export default function ArticlePage({ params }: ArticlePageProps) {
  const article = getArticleData(params.id)
  
  if (!article) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Article Not Found</h1>
          <p className="text-muted-foreground mb-8">The requested article could not be found.</p>
          <Link href="/election">
            <Button>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Election Articles
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back Button */}
      <div className="mb-6">
        <Link href="/election">
          <Button variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Articles
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-3">
          {/* Article Header */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Badge variant="outline">{article.category}</Badge>
              <Badge variant="secondary">{article.area}</Badge>
              {article.hasPDF && (
                <Badge variant="outline" className="text-xs">
                  <FileText className="h-3 w-3 mr-1" />
                  PDF Available
                </Badge>
              )}
              {article.hasData && (
                <Badge variant="outline" className="text-xs">
                  <BarChart3 className="h-3 w-3 mr-1" />
                  Data Available
                </Badge>
              )}
            </div>
            
            <h1 className="text-4xl font-bold mb-4">{article.title}</h1>
            <p className="text-xl text-muted-foreground mb-6">{article.excerpt}</p>
            
            <div className="flex items-center gap-6 text-sm text-muted-foreground mb-6">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>{article.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>{new Date(article.publishedAt).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4" />
                <span>{article.views} views</span>
              </div>
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                <span>{article.readTime}</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
              {article.tags.map((tag, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  <Tag className="h-3 w-3 mr-1" />
                  {tag}
                </Badge>
              ))}
            </div>

            <div className="flex gap-4">
              <Button>
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </Button>
              <Button variant="outline">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
              <Button variant="outline">
                <Bookmark className="h-4 w-4 mr-2" />
                Save
              </Button>
            </div>
          </div>

          {/* Article Image */}
          {article.image && (
            <div className="mb-8">
              <img 
                src={article.image} 
                alt={article.title}
                className="w-full h-64 object-cover rounded-lg"
              />
            </div>
          )}

          {/* Article Content */}
          <div className="prose prose-lg max-w-none">
            <div dangerouslySetInnerHTML={{ __html: article.content.replace(/\n/g, '<br>') }} />
          </div>

          {/* Inline Images - You can add these anywhere in your article */}
          <div className="my-8">
            <ArticleImage
              src="/election/inline/voter-registration-trends.svg"
              alt="Voter registration trends over the past 5 years"
              caption="Voter registration trends showing significant growth in youth participation (2019-2025)"
              credit="Election Commission of India"
              type="chart"
              size="large"
              downloadUrl="/election/data/voter-registration-trends.xlsx"
            />
          </div>

          <div className="my-8">
            <ArticleImage
              src="/election/inline/community-distribution-map.svg"
              alt="Geographic distribution of communities"
              caption="Geographic distribution of different communities across Govandi, Shivaji Nagar, and Baiganwadi"
              credit="Census 2021 Data"
              type="map"
              size="full"
            />
          </div>

          <div className="my-8">
            <ArticleImage
              src="/election/inline/gender-gap-reduction.svg"
              alt="Gender gap reduction in voter registration"
              caption="Historical comparison showing the reduction in gender gap in voter registration from 2019 to 2025"
              credit="LocalHub Analytics"
              type="infographic"
              size="medium"
              align="center"
            />
          </div>

          {/* Charts Section */}
          {article.charts && article.charts.length > 0 && (
            <div className="mt-12">
              <h2 className="text-2xl font-bold mb-6">Data Visualizations</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {article.charts.map((chart, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <CardTitle className="text-lg">{chart.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <img 
                        src={chart.image} 
                        alt={chart.title}
                        className="w-full h-48 object-cover rounded"
                      />
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Data Files Section */}
          {article.dataFiles && article.dataFiles.length > 0 && (
            <div className="mt-12">
              <h2 className="text-2xl font-bold mb-6">Download Data Files</h2>
              <div className="space-y-4">
                {article.dataFiles.map((file, index) => (
                  <Card key={index}>
                    <CardContent className="flex items-center justify-between p-4">
                      <div className="flex items-center gap-3">
                        <FileText className="h-8 w-8 text-primary" />
                        <div>
                          <p className="font-medium">{file.name}</p>
                          <p className="text-sm text-muted-foreground">Excel file</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Article Info */}
          <Card>
            <CardHeader>
              <CardTitle>Article Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Category</span>
                <Badge variant="outline">{article.category}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Area</span>
                <span className="text-sm">{article.area}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Author</span>
                <span className="text-sm">{article.author}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Published</span>
                <span className="text-sm">{new Date(article.publishedAt).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Views</span>
                <span className="text-sm">{article.views}</span>
              </div>
            </CardContent>
          </Card>

          {/* Download Resources */}
          <Card>
            <CardHeader>
              <CardTitle>Download Resources</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {article.hasPDF && (
                <Button className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  Full Report PDF
                </Button>
              )}
              {article.hasData && (
                <Button variant="outline" className="w-full">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Data Files
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Related Articles */}
          <Card>
            <CardHeader>
              <CardTitle>Related Articles</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Link href="/election/articles/2" className="block p-3 border rounded hover:bg-accent/50">
                  <p className="font-medium text-sm">Constituency Performance Report</p>
                  <p className="text-xs text-muted-foreground">Shivaji Nagar</p>
                </Link>
                <Link href="/election/articles/3" className="block p-3 border rounded hover:bg-accent/50">
                  <p className="font-medium text-sm">Infrastructure Development Impact</p>
                  <p className="text-xs text-muted-foreground">Baiganwadi</p>
                </Link>
                <Link href="/election/articles/4" className="block p-3 border rounded hover:bg-accent/50">
                  <p className="font-medium text-sm">Youth Voting Trends 2025</p>
                  <p className="text-xs text-muted-foreground">All Areas</p>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

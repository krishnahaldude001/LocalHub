import { Metadata } from 'next'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { ArrowRight, Shield, TrendingUp, Users, FileText, CheckCircle } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Election Reports - GovandiHub',
  description: 'Access comprehensive election reports and analysis for Govandi, Shivaji Nagar, and Baiganwadi areas.',
}

export default function ElectionPage() {
  const benefits = [
    {
      icon: <Shield className="h-8 w-8 text-primary" />,
      title: 'Verified Information',
      description: 'All reports are verified and fact-checked by our team of local experts.'
    },
    {
      icon: <TrendingUp className="h-8 w-8 text-primary" />,
      title: 'Trend Analysis',
      description: 'Understand voting patterns and demographic trends in your area.'
    },
    {
      icon: <Users className="h-8 w-8 text-primary" />,
      title: 'Community Insights',
      description: 'Get insights into how your community votes and what matters most.'
    },
    {
      icon: <FileText className="h-8 w-8 text-primary" />,
      title: 'Detailed Reports',
      description: 'Comprehensive analysis with charts, graphs, and actionable insights.'
    }
  ]

  const reportTypes = [
    {
      title: 'Voter Demographics',
      description: 'Age, gender, and community-wise voting patterns',
      price: '₹299',
      features: ['Population analysis', 'Voting trends', 'Demographic breakdown']
    },
    {
      title: 'Constituency Analysis',
      description: 'Detailed analysis of your specific constituency',
      price: '₹499',
      features: ['Constituency map', 'Candidate profiles', 'Historical data']
    },
    {
      title: 'Election Predictions',
      description: 'Data-driven predictions and forecasts',
      price: '₹799',
      features: ['Prediction models', 'Trend analysis', 'Risk assessment']
    }
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <Badge className="mb-4 bg-gradient-primary text-white border-0">
          Election 2025
        </Badge>
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          Make Informed <span className="text-primary">Voting</span> Decisions
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
          Access comprehensive election reports, demographic analysis, and voting trends for Govandi, Shivaji Nagar, and Baiganwadi areas. 
          Make your vote count with data-driven insights for the upcoming 2025 elections.
        </p>
        <Link href="/election/reports">
          <Button size="lg" className="text-lg px-8 py-3">
            Access Reports
            <ArrowRight className="h-5 w-5 ml-2" />
          </Button>
        </Link>
      </div>

      {/* Benefits Section */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-12">Why Choose Our Reports?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((benefit, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-center mb-4">
                  {benefit.icon}
                </div>
                <CardTitle className="text-lg">{benefit.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm">
                  {benefit.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Report Types */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-12">Available Report Types</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reportTypes.map((report, index) => (
            <Card key={index} className="relative hover:shadow-lg transition-shadow">
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-xl">{report.title}</CardTitle>
                <CardDescription className="text-sm">
                  {report.description}
                </CardDescription>
                <div className="text-3xl font-bold text-primary mt-2">
                  {report.price}
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <ul className="space-y-2 mb-6">
                  {report.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link href={`/election/reports/${report.title.toLowerCase().replace(/\s+/g, '-')}`}>
                  <Button className="w-full">
                    Get Report
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Features Section */}
      <div className="mb-16">
        <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl p-8">
          <h2 className="text-3xl font-bold text-center mb-8">What's Included in Each Report?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-primary/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <FileText className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">PDF Download</h3>
              <p className="text-sm text-muted-foreground">
                High-quality PDF reports you can save and share
              </p>
            </div>
            <div className="text-center">
              <div className="bg-primary/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Interactive Charts</h3>
              <p className="text-sm text-muted-foreground">
                Visual data representation for better understanding
              </p>
            </div>
            <div className="text-center">
              <div className="bg-primary/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Data Verification</h3>
              <p className="text-sm text-muted-foreground">
                All data is verified and sourced from official records
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="text-center">
        <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl p-8">
          <h2 className="text-2xl font-bold mb-4">Ready to Make an Informed Decision?</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Get access to comprehensive election reports and make your vote count with data-driven insights.
          </p>
          <Link href="/election/reports">
            <Button size="lg" className="text-lg px-8 py-3">
              Access Reports Now
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

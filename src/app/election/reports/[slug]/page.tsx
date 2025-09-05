"use client"

import { useState } from 'react'
import { useParams } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import Link from 'next/link'
import { ArrowLeft, Lock, Download, CheckCircle, CreditCard, Shield } from 'lucide-react'

export default function ElectionReportPage() {
  const params = useParams()
  const slug = params.slug as string
  const [hasAccess, setHasAccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Mock report data based on slug
  const getReportData = (slug: string) => {
    switch (slug) {
      case 'voter-demographics':
        return {
          title: 'Voter Demographics Report',
          description: 'Comprehensive analysis of age, gender, and community-wise voting patterns in your area.',
          price: 299,
          features: [
            'Population analysis by age groups',
            'Gender-wise voting trends',
            'Community demographic breakdown',
            'Historical voting patterns',
            'PDF download with charts',
            'Data verification certificate'
          ]
        }
      case 'constituency-analysis':
        return {
          title: 'Constituency Analysis Report',
          description: 'Detailed analysis of your specific constituency with maps and candidate profiles.',
          price: 499,
          features: [
            'Constituency map and boundaries',
            'Candidate profiles and history',
            'Historical election data',
            'Voter turnout analysis',
            'Interactive charts and graphs',
            'PDF download with maps'
          ]
        }
      case 'election-predictions':
        return {
          title: 'Election Predictions Report',
          description: 'Data-driven predictions and forecasts based on current trends and historical data.',
          price: 799,
          features: [
            'Prediction models and algorithms',
            'Trend analysis and forecasting',
            'Risk assessment factors',
            'Scenario planning',
            'Expert commentary and insights',
            'PDF download with predictions'
          ]
        }
      default:
        return {
          title: 'Election Report',
          description: 'Comprehensive election analysis and insights for your area.',
          price: 399,
          features: [
            'Data analysis and insights',
            'Historical trends',
            'Current statistics',
            'PDF download',
            'Data verification',
            'Expert analysis'
          ]
        }
    }
  }

  const report = getReportData(slug)

  const handlePurchase = async () => {
    setIsLoading(true)
    try {
      // Mock purchase process - in real app, this would call Razorpay
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Simulate successful purchase
      setHasAccess(true)
    } catch (error) {
      console.error('Purchase failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (hasAccess) {
    return (
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Link href="/election">
            <Button variant="ghost" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Election
            </Button>
          </Link>
        </div>

        {/* Report Content */}
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <Badge className="mb-4" variant="secondary">
              Report Access Granted
            </Badge>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">{report.title}</h1>
            <p className="text-xl text-muted-foreground">{report.description}</p>
          </div>

          {/* Download Section */}
          <Card className="mb-8">
            <CardHeader className="text-center">
              <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <CardTitle className="text-2xl">Report Ready for Download</CardTitle>
              <CardDescription>
                Your purchase is complete. Download the report below.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Button size="lg" className="gap-2">
                <Download className="h-5 w-5" />
                Download Report (PDF)
              </Button>
              <p className="text-sm text-muted-foreground mt-3">
                The report will be downloaded as a high-quality PDF file.
              </p>
            </CardContent>
          </Card>

          {/* Report Preview */}
          <Card>
            <CardHeader>
              <CardTitle>Report Preview</CardTitle>
              <CardDescription>
                Here's what you'll find in your {report.title.toLowerCase()}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {report.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back Button */}
      <div className="mb-6">
        <Link href="/election">
          <Button variant="ghost" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Election
          </Button>
        </Link>
      </div>

      {/* Paywall */}
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="bg-primary/20 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
            <Lock className="h-10 w-10 text-primary" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{report.title}</h1>
          <p className="text-xl text-muted-foreground">{report.description}</p>
        </div>

        {/* Pricing Card */}
        <Card className="mb-8">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Get Full Access</CardTitle>
            <CardDescription>
              Unlock comprehensive election insights and data
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <div className="mb-6">
              <span className="text-4xl font-bold text-primary">₹{report.price}</span>
              <span className="text-muted-foreground"> / one-time</span>
            </div>
            
            <Button 
              onClick={handlePurchase} 
              disabled={isLoading}
              size="lg" 
              className="w-full mb-4"
            >
              {isLoading ? (
                'Processing...'
              ) : (
                <>
                  <CreditCard className="h-5 w-5 mr-2" />
                  Purchase Report
                </>
              )}
            </Button>
            
            <p className="text-xs text-muted-foreground">
              Secure payment via Razorpay. You'll receive instant access after payment.
            </p>
          </CardContent>
        </Card>

        {/* Features */}
        <Card>
          <CardHeader>
            <CardTitle>What's Included</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {report.features.map((feature, index) => (
                <div key={index} className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Trust Indicators */}
        <div className="mt-8 text-center">
          <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              <span>Secure Payment</span>
            </div>
            <div className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              <span>Instant Download</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              <span>Verified Data</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

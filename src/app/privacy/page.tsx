import { Metadata } from 'next'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import Link from 'next/link'
import { Shield, Eye, Lock, Users, FileText, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = {
  title: 'Privacy Policy - GovandiHub',
  description: 'Learn how GovandiHub collects, uses, and protects your personal information. Read our comprehensive privacy policy.',
}

export default function PrivacyPage() {
  const lastUpdated = 'January 15, 2024'

  const sections = [
    {
      title: 'Information We Collect',
      content: [
        'Personal information (name, email, phone number) when you contact us or sign up for services',
        'Usage data including pages visited, time spent on site, and search queries',
        'Device information such as IP address, browser type, and operating system',
        'Location data based on your selected area (Govandi, Shivaji Nagar, or Baiganwadi)',
        'Click tracking data for affiliate links and deals'
      ]
    },
    {
      title: 'How We Use Your Information',
      content: [
        'Provide and improve our services',
        'Personalize content based on your selected area and preferences',
        'Track affiliate clicks for commission purposes',
        'Send you updates about local news and deals',
        'Respond to your inquiries and provide customer support',
        'Analyze usage patterns to improve user experience'
      ]
    },
    {
      title: 'Information Sharing',
      content: [
        'We do not sell, trade, or rent your personal information to third parties',
        'We may share information with trusted service providers who assist in operating our platform',
        'Affiliate partners receive click tracking data for commission purposes',
        'We may disclose information if required by law or to protect our rights'
      ]
    },
    {
      title: 'Data Security',
      content: [
        'We implement appropriate security measures to protect your information',
        'All data is encrypted during transmission using SSL/TLS protocols',
        'We regularly review and update our security practices',
        'Access to personal information is restricted to authorized personnel only'
      ]
    },
    {
      title: 'Your Rights',
      content: [
        'Access and review your personal information',
        'Request correction of inaccurate data',
        'Request deletion of your personal information',
        'Opt-out of marketing communications',
        'Withdraw consent for data processing'
      ]
    },
    {
      title: 'Cookies and Tracking',
      content: [
        'We use cookies to enhance your browsing experience',
        'Essential cookies are required for basic site functionality',
        'Analytics cookies help us understand how you use our platform',
        'You can control cookie settings through your browser preferences'
      ]
    }
  ]

  const dataRetention = [
    { type: 'Account Information', duration: 'Until account deletion' },
    { type: 'Usage Data', duration: '2 years' },
    { type: 'Click Tracking', duration: '1 year' },
    { type: 'Contact Form Submissions', duration: '3 years' },
    { type: 'Newsletter Subscriptions', duration: 'Until unsubscribed' }
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <Badge className="mb-4" variant="secondary">
          Privacy & Security
        </Badge>
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          Privacy <span className="text-primary">Policy</span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          We are committed to protecting your privacy and being transparent about how we collect, 
          use, and safeguard your personal information.
        </p>
        <div className="flex items-center justify-center gap-2 mt-4 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>Last updated: {lastUpdated}</span>
        </div>
      </div>

      {/* Overview */}
      <Card className="mb-12">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" />
            Our Commitment to Privacy
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground leading-relaxed mb-4">
            At GovandiHub, we understand the importance of privacy and are committed to protecting your personal information. 
            This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            By using GovandiHub, you agree to the collection and use of information in accordance with this policy. 
            If you have any questions about this Privacy Policy, please contact us.
          </p>
        </CardContent>
      </Card>

      {/* Privacy Principles */}
      <div className="mb-12">
        <h2 className="text-3xl font-bold text-center mb-8">Our Privacy Principles</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="bg-primary/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Eye className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-lg">Transparency</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                We are clear about what information we collect and how we use it.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="bg-primary/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Lock className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-lg">Security</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                We implement robust security measures to protect your data.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="bg-primary/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-lg">User Control</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                You have control over your personal information and how it's used.
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Detailed Sections */}
      <div className="space-y-8 mb-12">
        {sections.map((section, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-xl">{section.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {section.content.map((item, itemIndex) => (
                  <li key={itemIndex} className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span className="text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Data Retention */}
      <div className="mb-12">
        <h2 className="text-3xl font-bold text-center mb-8">Data Retention</h2>
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">How Long We Keep Your Data</CardTitle>
            <CardDescription>
              We retain your personal information only for as long as necessary to fulfill the purposes 
              outlined in this Privacy Policy.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {dataRetention.map((item, index) => (
                <div key={index} className="flex justify-between items-center py-2 border-b border-border last:border-b-0">
                  <span className="font-medium">{item.type}</span>
                  <Badge variant="outline">{item.duration}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Children's Privacy */}
      <Card className="mb-12">
        <CardHeader>
          <CardTitle className="text-xl">Children's Privacy</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground leading-relaxed">
            GovandiHub is not intended for children under the age of 13. We do not knowingly collect 
            personal information from children under 13. If you are a parent or guardian and believe 
            your child has provided us with personal information, please contact us immediately.
          </p>
        </CardContent>
      </Card>

      {/* Third-Party Services */}
      <Card className="mb-12">
        <CardHeader>
          <CardTitle className="text-xl">Third-Party Services</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground leading-relaxed mb-4">
            Our platform may contain links to third-party websites and services. We are not responsible 
            for the privacy practices of these third parties. We encourage you to read their privacy 
            policies before providing any personal information.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            We use affiliate links for deals and may receive commissions from purchases made through 
            these links. Click tracking is used solely for commission purposes and does not include 
            personal information.
          </p>
        </CardContent>
      </Card>

      {/* Changes to Policy */}
      <Card className="mb-12">
        <CardHeader>
          <CardTitle className="text-xl">Changes to This Privacy Policy</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground leading-relaxed">
            We may update this Privacy Policy from time to time. We will notify you of any changes by 
            posting the new Privacy Policy on this page and updating the "Last updated" date. We encourage 
            you to review this Privacy Policy periodically for any changes.
          </p>
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card className="mb-12">
        <CardHeader>
          <CardTitle className="text-xl">Contact Us</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground leading-relaxed mb-4">
            If you have any questions about this Privacy Policy or our privacy practices, please contact us:
          </p>
          <div className="space-y-2">
            <p className="text-muted-foreground">
              <strong>Email:</strong> privacy@govandihub.com
            </p>
            <p className="text-muted-foreground">
              <strong>Phone:</strong> +91 98765 43210
            </p>
            <p className="text-muted-foreground">
              <strong>Address:</strong> Mumbai, Maharashtra, India
            </p>
          </div>
        </CardContent>
      </Card>

      {/* CTA Section */}
      <div className="text-center">
        <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl p-8">
          <h2 className="text-2xl font-bold mb-4">Questions About Privacy?</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            We're here to help. If you have any questions about our privacy practices or need to 
            exercise your privacy rights, don't hesitate to reach out.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <Button size="lg">
                Contact Us
              </Button>
            </Link>
            <Link href="/disclosures">
              <Button variant="outline" size="lg">
                View Disclosures
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

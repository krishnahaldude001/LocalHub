import { Metadata } from 'next'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'

export const metadata: Metadata = {
  title: 'Disclosures & Affiliate Information | GovandiHub',
  description: 'Learn about our affiliate partnerships, sponsored content, and transparency practices.',
}

export default function DisclosuresPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">Disclosures & Transparency</h1>
        <p className="text-muted-foreground text-lg">
          We believe in complete transparency about our business practices and partnerships.
        </p>
      </div>

      <div className="space-y-8">
        {/* Affiliate Disclosure */}
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Badge variant="secondary">Affiliate Disclosure</Badge>
              Transparency First
            </CardTitle>
            <CardDescription>
              How we handle affiliate partnerships and sponsored content
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              <strong>We may earn a commission from qualifying purchases.</strong> When you click on 
              links to products or services on our platform, we may receive a small commission at no 
              additional cost to you.
            </p>
            <p>
              All affiliate links are clearly marked with <code className="bg-muted px-2 py-1 rounded text-sm">rel="sponsored nofollow"</code> 
              and will open in a new tab. This helps us maintain transparency and comply with 
              advertising standards.
            </p>
            <div className="bg-muted p-4 rounded-lg">
              <h4 className="font-semibold mb-2">What This Means:</h4>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>We only recommend products we genuinely believe in</li>
                <li>Our recommendations are based on research and user feedback</li>
                <li>Affiliate commissions help us keep GovandiHub free for users</li>
                <li>You pay the same price whether you use our links or not</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Separator />

        {/* Content Partnerships */}
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Badge variant="outline">Content Partnerships</Badge>
              Sponsored Content
            </CardTitle>
            <CardDescription>
              How we handle sponsored posts and brand collaborations
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              Some content on GovandiHub may be sponsored by brands or businesses. We clearly 
              label all sponsored content and maintain editorial independence in our recommendations.
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-muted p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Sponsored Content:</h4>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Clearly marked as "Sponsored" or "Partner Content"</li>
                  <li>Maintains our editorial standards</li>
                  <li>Includes disclosure statements</li>
                </ul>
              </div>
              <div className="bg-muted p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Editorial Content:</h4>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Independent research and reviews</li>
                  <li>No brand influence</li>
                  <li>Based on user needs and feedback</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <Separator />

        {/* Data & Privacy */}
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Badge variant="destructive">Data & Privacy</Badge>
              Your Information
            </CardTitle>
            <CardDescription>
              How we collect, use, and protect your data
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              We collect minimal data necessary to provide our services. This includes:
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold mb-2">Data We Collect:</h4>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Click tracking for affiliate links</li>
                  <li>Search queries and filters</li>
                  <li>Area preferences (stored locally)</li>
                  <li>Basic analytics (anonymous)</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Data We Don't Collect:</h4>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Personal identification</li>
                  <li>Financial information</li>
                  <li>Browsing history</li>
                  <li>Third-party tracking</li>
                </ul>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              For complete details, please see our{' '}
              <a href="/privacy" className="text-primary hover:underline">
                Privacy Policy
              </a>
              .
            </p>
          </CardContent>
        </Card>

        <Separator />

        {/* Business Model */}
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Badge variant="default">Business Model</Badge>
              How We Operate
            </CardTitle>
            <CardDescription>
              Our revenue streams and sustainability
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              GovandiHub is a free platform for our community. We sustain our operations through:
            </p>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-muted rounded-lg">
                <h4 className="font-semibold mb-2">Affiliate Commissions</h4>
                <p className="text-sm text-muted-foreground">
                  Small commissions from product sales
                </p>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <h4 className="font-semibold mb-2">Sponsored Content</h4>
                <p className="text-sm text-muted-foreground">
                  Brand partnerships and collaborations
                </p>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <h4 className="font-semibold mb-2">Premium Services</h4>
                <p className="text-sm text-muted-foreground">
                  Election reports and premium content
                </p>
              </div>
            </div>
            <p className="text-center text-sm text-muted-foreground">
              Our goal is to keep the platform free while providing valuable local information 
              and deals to the Govandi community.
            </p>
          </CardContent>
        </Card>

        <Separator />

        {/* Contact Information */}
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle>Questions About Disclosures?</CardTitle>
            <CardDescription>
              We're here to answer any questions about our practices
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              If you have questions about our disclosures, affiliate practices, or want to 
              learn more about how we operate, please don't hesitate to reach out.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="/contact"
                className="inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                Contact Us
              </a>
              <a
                href="/about"
                className="inline-flex items-center justify-center px-6 py-3 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90 transition-colors"
              >
                Learn More About Us
              </a>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-12 text-center text-sm text-muted-foreground">
        <p>Last updated: {new Date().toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        })}</p>
        <p>
          This page is regularly reviewed and updated to ensure transparency and compliance.
        </p>
      </div>
    </div>
  )
}

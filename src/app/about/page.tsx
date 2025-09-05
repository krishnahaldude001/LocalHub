import { Metadata } from 'next'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Users, MapPin, Target, Award, Heart, ArrowRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'About Us - GovandiHub',
  description: 'Learn about GovandiHub, your local hub for news, deals, and community updates in Govandi, Shivaji Nagar, and Baiganwadi areas.',
}

export default function AboutPage() {
  const areas = ['Govandi', 'Shivaji Nagar', 'Baiganwadi']
  
  const values = [
    {
      icon: <Users className="h-8 w-8 text-primary" />,
      title: 'Community First',
      description: 'We prioritize the needs and interests of our local community above everything else.'
    },
    {
      icon: <Target className="h-8 w-8 text-primary" />,
      title: 'Local Focus',
      description: 'Dedicated to serving the specific areas of Govandi, Shivaji Nagar, and Baiganwadi.'
    },
    {
      icon: <Award className="h-8 w-8 text-primary" />,
      title: 'Quality Content',
      description: 'We maintain high standards for all our news, deals, and community updates.'
    },
    {
      icon: <Heart className="h-8 w-8 text-primary" />,
      title: 'Trust & Transparency',
      description: 'Building trust through honest reporting and transparent affiliate relationships.'
    }
  ]

  const team = [
    {
      name: 'Local News Team',
      role: 'Community Reporting',
      description: 'Dedicated journalists covering local events, infrastructure, and community developments.'
    },
    {
      name: 'Deals Curation Team',
      role: 'Product Research',
      description: 'Experts who find and verify the best deals from trusted e-commerce platforms.'
    },
    {
      name: 'Community Engagement',
      role: 'User Experience',
      description: 'Team members who ensure our platform serves the community effectively.'
    }
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <Badge className="mb-4" variant="secondary">
          About GovandiHub
        </Badge>
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          Your Local <span className="text-primary">Community Hub</span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          GovandiHub is dedicated to bringing you the latest local news, best deals, and community updates 
          for the areas of Govandi, Shivaji Nagar, and Baiganwadi in Mumbai.
        </p>
      </div>

      {/* Mission & Vision */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Our Mission</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed">
              To create a comprehensive local platform that keeps residents informed about their community, 
              helps them save money through curated deals, and fosters a sense of connection within their neighborhoods.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Our Vision</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed">
              To become the go-to destination for local information, making it easier for residents to stay 
              connected with their community and make informed decisions about their daily lives.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Values */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-12">Our Core Values</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((value, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-center mb-4">
                  {value.icon}
                </div>
                <CardTitle className="text-lg">{value.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm">
                  {value.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* What We Do */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-12">What We Do</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-xl">Local News Coverage</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                We cover infrastructure updates, community events, local business news, and developments 
                that matter to residents in our target areas.
              </p>
              <Link href="/news">
                <Button variant="outline" className="w-full">
                  Read News
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-xl">Deals Curation</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Our team researches and curates the best deals from Amazon, Flipkart, and Meesho, 
                helping you save money on quality products.
              </p>
              <Link href="/deals">
                <Button variant="outline" className="w-full">
                  Browse Deals
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-xl">Community Updates</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Stay informed about local elections, community initiatives, and events that shape 
                the future of your neighborhood.
              </p>
              <Link href="/election">
                <Button variant="outline" className="w-full">
                  Learn More
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Our Team */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-12">Our Team</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {team.map((member, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-xl">{member.name}</CardTitle>
                <CardDescription className="text-primary font-medium">
                  {member.role}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  {member.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Coverage Areas */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-12">Areas We Cover</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {areas.map((area) => (
            <Card key={area} className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="bg-primary/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <MapPin className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-xl">{area}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  Comprehensive coverage of news, deals, and community updates in {area}.
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="text-center">
        <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl p-8">
          <h2 className="text-2xl font-bold mb-4">Join Our Community</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Stay connected with your local community and never miss important updates or great deals.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <Button size="lg">
                Get in Touch
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </Link>
            <Link href="/">
              <Button variant="outline" size="lg">
                Explore Platform
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

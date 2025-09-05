import { Metadata } from 'next'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { Mail, Phone, MapPin, MessageSquare, Send, Clock, Users } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Contact Us - GovandiHub',
  description: 'Get in touch with the GovandiHub team. We\'re here to help with your questions, feedback, and suggestions.',
}

export default function ContactPage() {
  const contactMethods = [
    {
      icon: <Mail className="h-6 w-6 text-primary" />,
      title: 'Email',
      value: 'hello@govandihub.com',
      description: 'Send us an email anytime',
      link: 'mailto:hello@govandihub.com'
    },
    {
      icon: <Phone className="h-6 w-6 text-primary" />,
      title: 'Phone',
      value: '+91 98765 43210',
      description: 'Call us during business hours',
      link: 'tel:+919876543210'
    },
    {
      icon: <MapPin className="h-6 w-6 text-primary" />,
      title: 'Office',
      value: 'Mumbai, Maharashtra',
      description: 'Based in Mumbai, serving local communities',
      link: '#'
    }
  ]

  const businessHours = [
    { day: 'Monday - Friday', hours: '9:00 AM - 6:00 PM' },
    { day: 'Saturday', hours: '10:00 AM - 4:00 PM' },
    { day: 'Sunday', hours: 'Closed' }
  ]

  const faqs = [
    {
      question: 'How can I submit local news or events?',
      answer: 'You can email us at hello@govandihub.com with details about local news, events, or community updates you\'d like us to cover.'
    },
    {
      question: 'Are the deals on your platform verified?',
      answer: 'Yes, all deals are personally verified by our team before being published. We ensure they offer genuine value to our community.'
    },
    {
      question: 'How do you select which areas to cover?',
      answer: 'We focus on Govandi, Shivaji Nagar, and Baiganwadi as these are our core communities. We\'re always looking to expand coverage based on community needs.'
    },
    {
      question: 'Can I advertise my local business on GovandiHub?',
      answer: 'Yes! We offer various advertising options for local businesses. Please contact us for more information about our advertising packages.'
    }
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <Badge className="mb-4" variant="secondary">
          Get in Touch
        </Badge>
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          Let's <span className="text-primary">Connect</span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Have questions, feedback, or suggestions? We'd love to hear from you. 
          Our team is here to help and always welcomes community input.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
        {/* Contact Form */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Send us a Message</CardTitle>
              <CardDescription>
                Fill out the form below and we'll get back to you as soon as possible.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium mb-2">
                      First Name
                    </label>
                    <Input id="firstName" placeholder="Your first name" required />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium mb-2">
                      Last Name
                    </label>
                    <Input id="lastName" placeholder="Your last name" required />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-2">
                    Email
                  </label>
                  <Input id="email" type="email" placeholder="your.email@example.com" required />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium mb-2">
                    Phone Number
                  </label>
                  <Input id="phone" type="tel" placeholder="+91 98765 43210" />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium mb-2">
                    Subject
                  </label>
                  <Input id="subject" placeholder="What's this about?" required />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    rows={5}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="Tell us more about your inquiry..."
                    required
                  />
                </div>

                <Button type="submit" className="w-full">
                  <Send className="h-4 w-4 mr-2" />
                  Send Message
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Contact Information */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Contact Information</CardTitle>
              <CardDescription>
                Reach out to us through any of these channels
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {contactMethods.map((method, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="mt-1">
                    {method.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold">{method.title}</h3>
                    <a 
                      href={method.link}
                      className="text-primary hover:underline block"
                    >
                      {method.value}
                    </a>
                    <p className="text-sm text-muted-foreground">
                      {method.description}
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Business Hours */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Business Hours
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {businessHours.map((schedule, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="font-medium">{schedule.day}</span>
                    <span className="text-muted-foreground">{schedule.hours}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {faqs.map((faq, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg">{faq.question}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  {faq.answer}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Community Section */}
      <div className="mb-16">
        <Card className="bg-gradient-to-r from-primary/10 to-secondary/10">
          <CardHeader className="text-center">
            <div className="bg-primary/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Users className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-2xl">Join Our Community</CardTitle>
            <CardDescription className="text-lg">
              Stay connected with your local community
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Follow us on social media and join our WhatsApp channel to stay updated with the latest 
              news, deals, and community events in your area.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="https://wa.me/your-number"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
              >
                📱 Join WhatsApp Channel
              </a>
              <Button variant="outline">
                Follow on Social Media
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* CTA Section */}
      <div className="text-center">
        <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl p-8">
          <h2 className="text-2xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Explore our platform and discover what GovandiHub has to offer for your community.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/">
              <Button size="lg">
                Explore Platform
              </Button>
            </Link>
            <Link href="/about">
              <Button variant="outline" size="lg">
                Learn More About Us
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

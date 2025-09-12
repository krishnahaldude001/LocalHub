import Link from 'next/link'
import { Separator } from '@/components/ui/separator'
import { config } from '@/lib/config'
import SocialMediaButtons from '@/components/social-media-buttons'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t bg-muted/50">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">LO</span>
              </div>
              <span className="font-bold text-lg">{config.appName}</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Your local hub for news, deals, and community updates in Mumbai - covering {config.defaultLocation.areas.slice(0, 3).join(', ')} and more areas.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-semibold">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/news" className="text-muted-foreground hover:text-foreground transition-colors">
                  News
                </Link>
              </li>
              <li>
                <Link href="/deals" className="text-muted-foreground hover:text-foreground transition-colors">
                  Deals
                </Link>
              </li>
              <li>
                <Link href="/election" className="text-muted-foreground hover:text-foreground transition-colors">
                  Election
                </Link>
              </li>
            </ul>
          </div>

          {/* Information */}
          <div className="space-y-4">
            <h3 className="font-semibold">Information</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-foreground transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-foreground transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/disclosures" className="text-muted-foreground hover:text-foreground transition-colors">
                  Disclosures
                </Link>
              </li>
            </ul>
          </div>

          {/* Social & Contact */}
          <div className="space-y-4">
            <h3 className="font-semibold">Connect With Us</h3>
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Follow us on social media for the latest updates and community news.
              </p>
              <SocialMediaButtons variant="outline" size="sm" />
              <div className="text-xs text-muted-foreground">
                <p>📧 {config.contact.email}</p>
                <p>📱 {config.contact.phone}</p>
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-8" />

        {/* Bottom */}
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-sm text-muted-foreground">
            © {currentYear} {config.appName}. All rights reserved.
          </p>
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <span>Made with ❤️ for the community</span>
          </div>
        </div>
      </div>
    </footer>
  )
}

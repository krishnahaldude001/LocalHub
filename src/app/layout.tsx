import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import AuthSessionProvider from '@/components/session-provider'
import Header from '@/components/header'
import Footer from '@/components/footer'
import { config } from '@/lib/config'
import { Toaster } from 'sonner'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: `${config.appName} - Local News & Deals`,
  description: `${config.appDescription} in ${config.defaultLocation.areas.join(', ')} areas.`,
  keywords: `${config.defaultLocation.areas.join(', ')}, local news, deals, community, ${config.defaultLocation.city}`,
  authors: [{ name: `${config.appName} Team` }],
  creator: config.appName,
  metadataBase: new URL(process.env.NEXTAUTH_URL || 'http://localhost:3001'),
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: config.appUrl,
    title: `${config.appName} - Local News & Deals`,
    description: `${config.appDescription} in ${config.defaultLocation.areas.join(', ')} areas.`,
    siteName: config.appName,
  },
  twitter: {
    card: 'summary_large_image',
    title: `${config.appName} - Local News & Deals`,
    description: `${config.appDescription} in ${config.defaultLocation.areas.join(', ')} areas.`,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <AuthSessionProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <div className="min-h-screen flex flex-col">
              <Header />
              <main className="flex-1">
                {children}
              </main>
              <Footer />
            </div>
            <Toaster />
          </ThemeProvider>
        </AuthSessionProvider>
      </body>
    </html>
  )
}

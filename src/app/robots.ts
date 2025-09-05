import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/api/',
        '/election/reports/',
        '/_next/',
        '/admin/',
      ],
    },
    sitemap: 'https://govandihub.com/sitemap.xml',
  }
}

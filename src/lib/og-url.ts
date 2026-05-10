import { config } from '@/lib/config'

/** Origin used for metadataBase and og:image absolute URLs (matches deployment). */
export function getSiteOrigin(): string {
  const auth = process.env.NEXTAUTH_URL?.trim()
  if (auth && /^https?:\/\//i.test(auth)) {
    try {
      return new URL(auth).origin
    } catch {
      /* fall through */
    }
  }
  const vercel = process.env.VERCEL_URL?.trim()
  if (vercel) {
    return `https://${vercel.replace(/^https?:\/\//i, '')}`
  }
  try {
    return new URL(config.appUrl).origin
  } catch {
    return 'https://localhub.space'
  }
}

/**
 * Open Graph / WhatsApp / Facebook need a normal HTTPS image URL.
 * data: and blob: URLs are not supported by crawlers — return null to omit og:image.
 */
export function absoluteUrlForOpenGraph(href: string | null | undefined): string | null {
  if (!href || !String(href).trim()) return null
  const s = String(href).trim()
  if (s.startsWith('data:') || s.startsWith('blob:')) return null
  if (/^https?:\/\//i.test(s)) return s
  const origin = getSiteOrigin().replace(/\/$/, '')
  return `${origin}${s.startsWith('/') ? s : `/${s}`}`
}

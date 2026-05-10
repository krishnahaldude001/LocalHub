import { headers } from 'next/headers'
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
 * Prefer the actual request host (e.g. www) so og:url / canonical match the link
 * users paste on WhatsApp; falls back to getSiteOrigin() when headers() is unavailable.
 */
export function getPublicSiteOrigin(): string {
  try {
    const h = headers()
    const combined = h.get('x-forwarded-host') || h.get('host') || ''
    const host = combined.split(',')[0]?.trim() || ''
    if (host && !/^localhost(:\d+)?$/i.test(host)) {
      const protoRaw = h.get('x-forwarded-proto')?.split(',')[0]?.trim() || ''
      const proto = /^https?$/i.test(protoRaw) ? protoRaw : 'https'
      return `${proto}://${host}`
    }
  } catch {
    /* headers() outside a request */
  }
  return getSiteOrigin()
}

/**
 * Open Graph / WhatsApp / Facebook need a normal HTTPS image URL.
 * data: and blob: URLs are not supported by crawlers — return null to omit og:image.
 */
export function absoluteUrlForOpenGraph(
  href: string | null | undefined,
  siteOrigin?: string
): string | null {
  if (!href || !String(href).trim()) return null
  const s = String(href).trim()
  if (s.startsWith('data:') || s.startsWith('blob:')) return null
  if (/^https?:\/\//i.test(s)) return s
  const origin = (siteOrigin ?? getPublicSiteOrigin()).replace(/\/$/, '')
  return `${origin}${s.startsWith('/') ? s : `/${s}`}`
}

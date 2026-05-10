/**
 * URL-safe slug for news posts. Never returns empty or hyphen-only strings
 * (those produced bad slugs like "-" → "--1" after uniqueness suffixing).
 */
export function slugFromTitle(title: string): string {
  const raw = String(title || '')
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '')
    .trim()
  if (raw) return raw
  return `article-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`
}

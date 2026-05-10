/**
 * Turn common sharing links into URLs that work as <img src>.
 * Google Drive "view" links are HTML pages, not direct image bytes.
 */
export function extractGoogleDriveFileId(url: string): string | null {
  const trimmed = url.trim()
  try {
    const u = new URL(trimmed)
    if (!u.hostname.includes('drive.google.com')) return null
    const fromPath = u.pathname.match(/\/(?:file\/)?d\/([^/]+)/)
    if (fromPath?.[1]) return fromPath[1]
    const id = u.searchParams.get('id')
    if (id) return id
    return null
  } catch {
    return null
  }
}

export function normalizeImageUrlForEmbed(url: string): string {
  const trimmed = url.trim()
  if (!trimmed) return ''
  const id = extractGoogleDriveFileId(trimmed)
  if (id) {
    return `https://drive.google.com/uc?export=view&id=${id}`
  }
  return trimmed
}

/** Horizontal focal point for object-cover (0–100). */
export function clampImageFocusX(focusX?: number | null): number {
  if (typeof focusX !== 'number' || !Number.isFinite(focusX)) return 50
  return Math.min(100, Math.max(0, Math.round(focusX)))
}

export function featuredImageStyle(focusX?: number | null): { objectPosition: string } {
  return { objectPosition: `${clampImageFocusX(focusX)}% center` }
}

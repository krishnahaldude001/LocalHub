/**
 * Turn common sharing links into URLs that work as <img src>.
 * Google Drive "view" and "uc?export=view" pages often block or redirect in <img>;
 * the thumbnail endpoint is more reliable for embedding.
 */
export function extractGoogleDriveFileId(url: string): string | null {
  const trimmed = url.trim()
  try {
    const u = new URL(trimmed)
    if (!u.hostname.includes('drive.google.com')) return null

    const fromPath = u.pathname.match(/\/(?:file\/)?d\/([^/]+)/)
    if (fromPath?.[1]) return fromPath[1]

    const id = u.searchParams.get('id')
    if (id) {
      if (u.pathname.includes('/open')) return id
      if (u.pathname === '/uc' || u.pathname.startsWith('/uc')) return id
      if (u.pathname.includes('/thumbnail')) return id
    }
    return null
  } catch {
    return null
  }
}

/** Store / embed: prefer Drive thumbnail URL (works better in <img> and Next/Image). */
export function normalizeImageUrlForEmbed(url: string): string {
  const trimmed = url.trim()
  if (!trimmed) return ''
  const id = extractGoogleDriveFileId(trimmed)
  if (id) {
    return `https://drive.google.com/thumbnail?id=${encodeURIComponent(id)}&sz=w2000`
  }
  return trimmed
}

/** What to put in <img src> so previews and Drive links actually paint (data URLs unchanged). */
export function displaySrcForImageUrl(url: string): string {
  const trimmed = url.trim()
  if (!trimmed) return ''
  if (trimmed.startsWith('data:') || trimmed.startsWith('blob:')) return trimmed
  const id = extractGoogleDriveFileId(trimmed)
  if (id) {
    return `https://drive.google.com/thumbnail?id=${encodeURIComponent(id)}&sz=w2000`
  }
  return trimmed
}

export function clampImageFocusX(focusX?: number | null): number {
  if (typeof focusX !== 'number' || !Number.isFinite(focusX)) return 50
  return Math.min(100, Math.max(0, Math.round(focusX)))
}

export function clampImageFocusY(focusY?: number | null): number {
  if (typeof focusY !== 'number' || !Number.isFinite(focusY)) return 50
  return Math.min(100, Math.max(0, Math.round(focusY)))
}

export function featuredImageStyle(
  focusX?: number | null,
  focusY?: number | null
): { objectPosition: string } {
  return {
    objectPosition: `${clampImageFocusX(focusX)}% ${clampImageFocusY(focusY)}%`,
  }
}

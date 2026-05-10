import { ImageResponse } from 'next/og'
import { NextRequest } from 'next/server'
import { config } from '@/lib/config'

export const runtime = 'edge'

const BRAND = config.appName
const BRAND_INITIALS = BRAND.replace(/[^A-Za-z]/g, '').slice(0, 2).toUpperCase() || 'LH'

/** Best-effort font fetch; returns null on any failure so the route never breaks. */
async function loadFont(url: string): Promise<ArrayBuffer | null> {
  try {
    const res = await fetch(url, { cache: 'force-cache' })
    if (!res.ok) return null
    return await res.arrayBuffer()
  } catch {
    return null
  }
}

function pickTitleFontSize(title: string): number {
  const len = title.length
  if (len <= 40) return 64
  if (len <= 70) return 52
  if (len <= 110) return 42
  return 36
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const title = (searchParams.get('title') || BRAND).slice(0, 180)
  const subtitle = (searchParams.get('subtitle') || 'Mumbai Local News & Deals').slice(0, 80)

  // Devanagari + Latin support via Google Fonts; both fall back to default if fetch fails.
  const [devanagari, latin] = await Promise.all([
    loadFont(
      'https://fonts.gstatic.com/s/notosansdevanagari/v26/TuGoUUFzXI5FBtUq5a8bjKYTZjtRU6Sgv3NaV_SNmI0b8QQCQmHn6B2OHjbL.ttf'
    ),
    loadFont(
      'https://fonts.gstatic.com/s/inter/v13/UcC73FwrK3iLTeHuS_fvQtMwCp50KnMa1ZL7.ttf'
    ),
  ])

  const fonts: { name: string; data: ArrayBuffer; weight?: 400 | 700; style?: 'normal' }[] = []
  if (latin) fonts.push({ name: 'Inter', data: latin, weight: 700, style: 'normal' })
  if (devanagari)
    fonts.push({ name: 'NotoDevanagari', data: devanagari, weight: 700, style: 'normal' })

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          padding: '40px',
          fontFamily: '"Inter", "NotoDevanagari", sans-serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: '40px',
          }}
        >
          <div
            style={{
              width: '80px',
              height: '80px',
              borderRadius: '16px',
              backgroundColor: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: '20px',
            }}
          >
            <span style={{ fontSize: '32px', fontWeight: 700, color: '#667eea' }}>
              {BRAND_INITIALS}
            </span>
          </div>
          <span style={{ fontSize: '48px', fontWeight: 700, color: '#ffffff' }}>{BRAND}</span>
        </div>

        <div
          style={{
            display: 'flex',
            fontSize: `${pickTitleFontSize(title)}px`,
            fontWeight: 700,
            color: '#ffffff',
            textAlign: 'center',
            margin: '0 0 20px 0',
            lineHeight: 1.2,
            maxWidth: 1000,
            justifyContent: 'center',
          }}
        >
          {title}
        </div>

        <div
          style={{
            display: 'flex',
            fontSize: '32px',
            color: '#f3f4f6',
            textAlign: 'center',
            margin: 0,
            maxWidth: 800,
            opacity: 0.9,
            justifyContent: 'center',
          }}
        >
          {subtitle}
        </div>

        <div
          style={{
            position: 'absolute',
            bottom: '40px',
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
            color: '#ffffff',
            fontSize: '24px',
            opacity: 0.8,
          }}
        >
          <span>Mumbai • Local News & Deals</span>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      ...(fonts.length ? { fonts } : {}),
    }
  )
}

import { ImageResponse } from 'next/og'
import { NextRequest } from 'next/server'

export const runtime = 'edge'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const title = searchParams.get('title') || 'LocalHub'
  const subtitle = searchParams.get('subtitle') || 'Mumbai Local News & Deals'

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
          backgroundColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          padding: '40px',
        }}
      >
        {/* Logo */}
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
            <span
              style={{
                fontSize: '32px',
                fontWeight: 'bold',
                color: '#667eea',
              }}
            >
              GH
            </span>
          </div>
          <span
            style={{
              fontSize: '48px',
              fontWeight: 'bold',
              color: '#ffffff',
            }}
          >
            GovandiHub
          </span>
        </div>

        {/* Title */}
        <h1
          style={{
            fontSize: '64px',
            fontWeight: 'bold',
            color: '#ffffff',
            textAlign: 'center',
            margin: '0 0 20px 0',
            lineHeight: '1.2',
            maxWidth: '800px',
          }}
        >
          {title}
        </h1>

        {/* Subtitle */}
        <p
          style={{
            fontSize: '32px',
            color: '#f3f4f6',
            textAlign: 'center',
            margin: '0',
            maxWidth: '600px',
            opacity: 0.9,
          }}
        >
          {subtitle}
        </p>

        {/* Footer */}
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
          <span>📍 Mumbai • Govandi • Shivaji Nagar • Baiganwadi</span>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  )
}

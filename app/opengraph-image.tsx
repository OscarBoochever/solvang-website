import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const alt = 'City of Solvang - The Danish Capital of America'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #1e3a5f 0%, #2d4a6f 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        {/* Logo Circle */}
        <div
          style={{
            width: 150,
            height: 150,
            borderRadius: '50%',
            backgroundColor: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 40,
          }}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            width="90"
            height="90"
            stroke="#1e3a5f"
            strokeWidth="1.5"
          >
            <path d="M4 4l5 5M15 15l5 5M20 4l-5 5M9 15l-5 5" />
            <circle cx="12" cy="12" r="3" />
          </svg>
        </div>

        {/* City Name */}
        <div
          style={{
            fontSize: 72,
            fontWeight: 700,
            color: 'white',
            marginBottom: 16,
          }}
        >
          City of Solvang
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: 32,
            color: '#d4a84b',
            fontWeight: 500,
          }}
        >
          The Danish Capital of America
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}

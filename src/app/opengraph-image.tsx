import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Advlink — Da editori, per editori';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          backgroundColor: '#ffffff',
          padding: '80px',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
          }}
        >
          <span
            style={{
              fontSize: 88,
              fontWeight: 700,
              color: '#0f172a',
              letterSpacing: '-0.02em',
              lineHeight: 1,
            }}
          >
            Advlink
          </span>
          <span
            style={{
              display: 'flex',
              backgroundColor: '#991b1b',
              borderRadius: '9999px',
              width: 24,
              height: 24,
            }}
          />
        </div>
        <div
          style={{
            display: 'flex',
            marginTop: 60,
            fontSize: 56,
            fontWeight: 700,
            color: '#0f172a',
            letterSpacing: '-0.02em',
            lineHeight: 1.05,
          }}
        >
          Da editori, per editori.
        </div>
        <div
          style={{
            display: 'flex',
            marginTop: 28,
            fontSize: 28,
            color: '#475569',
            lineHeight: 1.3,
          }}
        >
          Tecnologia pubblicitaria per editori italiani
        </div>
      </div>
    ),
    { ...size },
  );
}

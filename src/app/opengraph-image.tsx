import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { ImageResponse } from 'next/og';

export const alt = 'Story Book Generator: turn your memories into magical storybooks';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
  const hero = await readFile(join(process.cwd(), 'public/assets/images/heroImg.png'));
  const src = `data:image/png;base64,${hero.toString('base64')}`;

  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', background: '#1D283A' }}>
        <img src={src} width={1200} height={776} style={{ position: 'absolute', top: 0, left: 0 }} />
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            padding: 64,
            background: 'linear-gradient(90deg, rgba(29,40,58,0.95) 0%, rgba(29,40,58,0.55) 55%, rgba(29,40,58,0) 100%)',
          }}
        >
          <div style={{ fontSize: 76, fontWeight: 700, color: '#E5E7EB', lineHeight: 1.1 }}>Turn Your Memories Into</div>
          <div style={{ fontSize: 76, fontWeight: 700, color: '#F59F0A', lineHeight: 1.1 }}>Magical Storybooks</div>
          <div style={{ fontSize: 30, color: '#E5E7EB', marginTop: 24, maxWidth: 760 }}>
            Personalized, illustrated storybooks from your photos in minutes.
          </div>
        </div>
      </div>
    ),
    size,
  );
}

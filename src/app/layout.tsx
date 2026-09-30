import type { Metadata } from 'next';
import '../index.css';

const description = 'Create personalized storybooks in minutes. Add your photos and watch AI bring your tale to life.';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'),
  title: 'Story Book Generator',
  description,
  openGraph: { title: 'Story Book Generator', description, type: 'website' },
  twitter: { card: 'summary_large_image' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div id="root">{children}</div>
      </body>
    </html>
  );
}

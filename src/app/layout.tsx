import type { Metadata } from 'next';
import '../index.css';

const description = 'Create personalized storybooks in minutes. Add your photos and watch AI bring your tale to life.';

// Absolute base for OpenGraph URLs. Netlify sets URL on every build; an empty or scheme-less
// NEXT_PUBLIC_SITE_URL must not fail the build with "Invalid URL".
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.URL || 'http://localhost:3000';

export const metadata: Metadata = {
  metadataBase: new URL(/^https?:\/\//.test(siteUrl) ? siteUrl : `https://${siteUrl}`),
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

import type { Metadata } from 'next';
import { ClientOnly } from '../../[[...slug]]/client-only';

// Same SPA as every other path; this route only exists so a shared book's link preview
// (WhatsApp, iMessage, Slack) shows its title and cover instead of the generic site card.
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || '';
  const res = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/shared-book`, {
    method: 'POST',
    headers: { apikey: key, Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ storyId: id }),
  }).catch(() => null);
  if (!res?.ok) return {};
  const book: { title: string; subtitle: string; creator: string | null; pages: { imageUrl: string }[] } = await res.json();
  const description = `${book.subtitle ? `${book.subtitle}. ` : ''}A storybook made by ${book.creator || 'a friend'}. Make your own from your photos.`;
  const cover = book.pages[0]?.imageUrl;
  return {
    title: book.title,
    description,
    openGraph: { title: book.title, description, type: 'website', ...(cover && { images: [cover] }) },
    twitter: { card: 'summary_large_image', title: book.title, description, ...(cover && { images: [cover] }) },
  };
}

export default function Page() {
  return <ClientOnly />;
}

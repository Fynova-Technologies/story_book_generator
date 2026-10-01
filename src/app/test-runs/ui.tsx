import Link from 'next/link';
import type { MetricRow } from '@/server/testRuns';

export const fileUrl = (run: string, file: string) => `/api/test-runs/${encodeURIComponent(run)}/${file}`;

export function Shell({ title, back, children }: { title: string; back?: { href: string; label: string }; children: React.ReactNode }) {
  return (
    <div className="min-h-screen w-full bg-light-bg font-body text-light-text">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        {back && <Link href={back.href} className="text-sm font-semibold text-light-primary hover:underline">← {back.label}</Link>}
        <h1 className="mt-2 font-heading text-3xl font-bold break-words">{title}</h1>
        <div className="mt-6 space-y-6">{children}</div>
      </div>
    </div>
  );
}

export function Card({ title, children, className = '' }: { title?: React.ReactNode; children: React.ReactNode; className?: string }) {
  return (
    <section className={`rounded-2xl bg-white/60 p-5 shadow-sm ${className}`}>
      {title && <h2 className="mb-3 font-heading text-xl font-bold">{title}</h2>}
      {children}
    </section>
  );
}

const STATUS_STYLES: Record<string, string> = {
  scored: 'bg-green-100 text-green-800',
  generated: 'bg-blue-100 text-blue-800',
  failed: 'bg-red-100 text-red-800',
  running: 'bg-amber-100 text-amber-800',
};

export const Status = ({ status }: { status: string }) => (
  <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${STATUS_STYLES[status] || ''}`}>{status}</span>
);

export const formatDate = (iso: string) =>
  iso ? new Date(iso).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'UTC' }) + ' UTC' : '—';

// A value plus its change against the baseline, green when it moved the right way.
export function MetricCell({ row, value, base }: { row: MetricRow; value: number | null | undefined; base?: number | null }) {
  if (value == null || Number.isNaN(value)) return <span className="text-light-outline-secondary">—</span>;
  const diff = base == null || Number.isNaN(base) ? 0 : value - base;
  const good = row.better === 'higher' ? diff > 0 : diff < 0;
  return (
    <span className="whitespace-nowrap">
      {row.format(value)}
      {Math.abs(diff) > 1e-9 && (
        <span className={`ml-1.5 text-xs font-semibold ${good ? 'text-green-700' : 'text-red-700'}`}>
          {diff > 0 ? '▲' : '▼'} {row.format(Math.abs(diff))}
        </span>
      )}
    </span>
  );
}

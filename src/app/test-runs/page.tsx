import Link from 'next/link';
import { listRuns } from '@/server/testRuns';
import { Card, Shell, Status, formatDate } from './ui';
import PhotoCheck from './PhotoCheck';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Story Test Runs' };

const avg = (values: Record<string, number> | undefined) => {
  const xs = Object.values(values || {}).filter(v => typeof v === 'number');
  return xs.length ? (xs.reduce((a, b) => a + b, 0) / xs.length).toFixed(2) : '—';
};
const pct = (values: Record<string, number | null> | undefined) => {
  const xs = Object.values(values || {}).filter((v): v is number => typeof v === 'number');
  return xs.length ? `${Math.round((xs.reduce((a, b) => a + b, 0) / xs.length) * 100)}%` : '—';
};

export default function TestRunsPage() {
  const runs = listRuns();
  return (
    <Shell title="Story test runs">
      <p className="text-sm text-light-outline">
        Local runs from <code>test-runs/</code>. Start one with{' '}
        <code className="rounded bg-white/70 px-1.5 py-0.5">bun run test:story test/story/cases/whatsapp-duo.json</code>.
        Tick two or more runs to compare them; the oldest ticked run is the baseline.
      </p>
      <PhotoCheck />
      {runs.length === 0 ? (
        <Card><p>No runs yet.</p></Card>
      ) : (
        <form action="/test-runs/compare">
          <Card className="overflow-x-auto p-0">
            <table className="w-full min-w-[900px] text-left text-sm">
              <thead className="border-b border-light-outline-secondary text-xs uppercase tracking-wide text-light-outline">
                <tr>
                  <th className="p-3" />
                  <th className="p-3">Run</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Beats look-alikes</th>
                  <th className="p-3 text-right">Face similarity</th>
                  <th className="p-3 text-right">Same face across pages</th>
                  <th className="p-3 text-right">Pages without text</th>
                  <th className="p-3 text-right">Time</th>
                  <th className="p-3 text-right">Tokens</th>
                  <th className="p-3 text-right">Est. cost</th>
                </tr>
              </thead>
              <tbody>
                {runs.map(run => (
                  <tr key={run.id} className="border-b border-light-outline-secondary/40 last:border-0 hover:bg-white/50">
                    <td className="p-3"><input type="checkbox" name="run" value={run.id} aria-label={`Compare ${run.id}`} className="size-4" /></td>
                    <td className="p-3">
                      <Link href={`/test-runs/${encodeURIComponent(run.id)}`} className="font-semibold text-light-primary hover:underline">
                        {run.summary?.title || run.caseName}
                      </Link>
                      <div className="text-xs text-light-outline">{run.caseName} · {formatDate(run.startedAt)}</div>
                      {run.error && <div className="mt-1 max-w-md truncate text-xs text-red-700" title={run.error}>{run.error}</div>}
                    </td>
                    <td className="p-3"><Status status={run.status} /></td>
                    <td className="p-3 text-right">{pct(run.summary?.faceBeatsRivals)}</td>
                    <td className="p-3 text-right">{avg(run.summary?.faceSimilarity)}</td>
                    <td className="p-3 text-right">{avg(run.summary?.faceCrossPage)}</td>
                    <td className="p-3 text-right">{run.summary?.emptyPageText ?? '—'}</td>
                    <td className="p-3 text-right">{run.metrics ? `${run.metrics.seconds.total}s` : '—'}</td>
                    <td className="p-3 text-right">{run.metrics?.totalTokens?.toLocaleString('en-US') ?? '—'}</td>
                    <td className="p-3 text-right">{run.metrics ? `$${run.metrics.estCostUsd.toFixed(3)}` : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
          <button type="submit" className="mt-4 rounded-lg bg-light-primary px-5 py-2.5 font-semibold text-light-on-primary hover:opacity-90">
            Compare selected
          </button>
        </form>
      )}
    </Shell>
  );
}

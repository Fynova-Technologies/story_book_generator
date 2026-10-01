import Link from 'next/link';
import { listRuns, loadRun, metricRows } from '@/server/testRuns';
import { Card, MetricCell, Shell, Status, fileUrl, formatDate } from '../ui';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Compare Test Runs' };

export default async function ComparePage({ searchParams }: { searchParams: Promise<{ run?: string | string[]; base?: string }> }) {
  const { run, base } = await searchParams;
  const selected = new Set([run ?? []].flat());
  // Oldest first, so changes read left to right.
  const runs = listRuns().filter(r => selected.has(r.id)).reverse();
  const back = { href: '/test-runs', label: 'All runs' };

  if (runs.length < 2) {
    return (
      <Shell title="Compare runs" back={back}>
        <Card><p>Pick at least two runs to compare.</p></Card>
      </Shell>
    );
  }

  const baseline = runs.find(r => r.id === base) || runs[0];
  const rows = metricRows(runs);
  const groups = [...new Set(rows.map(row => row.group))];
  const details = new Map(runs.map(r => [r.id, loadRun(r.id)]));
  const pageCount = Math.max(...runs.map(r => details.get(r.id)?.story?.pages?.length || 0));
  const query = (extra: Record<string, string>) =>
    '?' + new URLSearchParams([...runs.map(r => ['run', r.id]), ...Object.entries(extra)]).toString();
  const columns = { gridTemplateColumns: `repeat(${runs.length}, minmax(220px, 1fr))` };

  return (
    <Shell title="Compare runs" back={back}>
      <p className="text-sm text-light-outline">
        Changes are against the baseline: <span className="font-semibold text-green-700">green</span> is better,{' '}
        <span className="font-semibold text-red-700">red</span> is worse. Face scores are local ArcFace numbers and vary run to run; the pages are what count.
      </p>

      <Card className="overflow-x-auto p-0">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-light-outline-secondary align-top">
              <th className="p-3 text-xs uppercase tracking-wide text-light-outline">Metric</th>
              {runs.map(r => (
                <th key={r.id} className="min-w-[200px] p-3 font-normal">
                  <Link href={`/test-runs/${encodeURIComponent(r.id)}`} className="font-semibold text-light-primary hover:underline">
                    {r.summary?.title || r.caseName}
                  </Link>
                  <div className="text-xs text-light-outline">{formatDate(r.startedAt)}</div>
                  <div className="mt-1 flex items-center gap-2">
                    <Status status={r.status} />
                    {r.id === baseline.id
                      ? <span className="rounded-full bg-light-primary px-2 py-0.5 text-xs font-semibold text-light-on-primary">baseline</span>
                      : <Link href={query({ base: r.id })} className="text-xs text-light-primary hover:underline">set as baseline</Link>}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {groups.map(group => (
              <GroupRows key={group} group={group} rows={rows.filter(row => row.group === group)} runs={runs} baseline={baseline} />
            ))}
          </tbody>
        </table>
      </Card>

      {pageCount > 0 && (
        <Card title="Pages side by side" className="overflow-x-auto">
          <div className="space-y-6">
            {Array.from({ length: pageCount }, (_, i) => (
              <div key={i}>
                <h3 className="mb-2 font-semibold">Page {i + 1}</h3>
                <div className="grid gap-4" style={columns}>
                  {runs.map(r => {
                    const page = details.get(r.id)?.story?.pages?.[i];
                    const face = details.get(r.id)?.faces?.pages?.find((f: any) => f.page === page?.page);
                    return page ? (
                      <figure key={r.id}>
                        <img src={fileUrl(r.id, page.image)} alt={`Page ${page.page} of ${r.summary?.title || r.id}`} className="w-full rounded-lg" />
                        <figcaption className="mt-1 text-xs text-light-outline">
                          {face && Object.entries(face.matches).map(([name, m]: [string, any]) => `${name} ${m.similarity ?? 'no face'}`).join(' · ')}
                        </figcaption>
                      </figure>
                    ) : <div key={r.id} className="text-sm text-light-outline">—</div>;
                  })}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </Shell>
  );
}

function GroupRows({ group, rows, runs, baseline }: {
  group: string;
  rows: ReturnType<typeof metricRows>;
  runs: ReturnType<typeof listRuns>;
  baseline: ReturnType<typeof listRuns>[number];
}) {
  return (
    <>
      <tr className="bg-white/40">
        <td colSpan={runs.length + 1} className="px-3 py-2 text-xs font-bold uppercase tracking-wide text-light-outline">{group}</td>
      </tr>
      {rows.map(row => (
        <tr key={row.label} className="border-t border-light-outline-secondary/30">
          <td className="p-3">{row.label}</td>
          {runs.map(r => (
            <td key={r.id} className="p-3">
              <MetricCell row={row} value={row.value(r)} base={r.id === baseline.id ? null : row.value(baseline)} />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}

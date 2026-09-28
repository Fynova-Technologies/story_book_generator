import { notFound } from 'next/navigation';
import { loadRun } from '@/server/testRuns';
import { Card, Shell, Status, fileUrl, formatDate } from '../ui';

export const dynamic = 'force-dynamic';

const FLAGS: Record<string, string> = {
  duplicateCharacter: 'Duplicated character',
  borrowedFace: 'Borrowed face',
  textInImage: 'Text in image',
  anatomyIssues: 'Anatomy issues',
};

const Stat = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div className="rounded-xl bg-white/70 p-3">
    <div className="text-xs uppercase tracking-wide text-light-outline">{label}</div>
    <div className="mt-1 text-lg font-bold">{value ?? '—'}</div>
  </div>
);

export default async function RunPage({ params }: { params: Promise<{ run: string }> }) {
  const { run: id } = await params;
  const run = loadRun(id);
  if (!run) notFound();
  const { story, judge, metrics, summary, trace, refs } = run;
  const verdicts = new Map<number, any>((judge?.pages || []).map((p: any) => [p.page, p]));

  return (
    <Shell title={story?.title || run.caseName} back={{ href: '/test-runs', label: 'All runs' }}>
      <div className="flex flex-wrap items-center gap-3 text-sm text-light-outline">
        <Status status={run.status} />
        <span>{run.caseName}</span>
        <span>{formatDate(run.startedAt)}</span>
        <a className="text-light-primary hover:underline" href={fileUrl(run.id, 'trace.jsonl')}>trace.jsonl</a>
        {judge && <a className="text-light-primary hover:underline" href={fileUrl(run.id, 'judge.json')}>judge.json</a>}
      </div>
      {story?.subtitle && <p className="text-light-outline">{story.subtitle}</p>}
      {run.error && <Card><p className="font-semibold text-red-700">Failed: {run.error}</p></Card>}

      <Card title="Summary">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-6">
          {Object.entries(summary?.identity || {}).map(([name, v]) => <Stat key={`i-${name}`} label={`Likeness · ${name}`} value={`${v}/10`} />)}
          {Object.entries(summary?.crossPageConsistency || {}).map(([name, v]) => <Stat key={`c-${name}`} label={`Consistency · ${name}`} value={`${v}/10`} />)}
          <Stat label="Style consistency" value={summary && `${summary.styleConsistency}/10`} />
          <Stat label="Cast correct" value={summary && `${summary.castCorrectPages}/${summary.pages}`} />
          <Stat label="Missing page text" value={summary?.emptyPageText} />
          <Stat label="Text in image" value={summary?.textInImagePages} />
          <Stat label="Total time" value={metrics && `${metrics.seconds.total}s`} />
          <Stat label="Est. cost" value={metrics && `$${metrics.estCostUsd.toFixed(3)}`} />
        </div>
        {judge?.book?.notes && <p className="mt-4 text-sm">{judge.book.notes}</p>}
      </Card>

      {metrics && (
        <Card title="Time, tokens and cost" className="overflow-x-auto">
          <p className="mb-3 text-sm text-light-outline">
            Stages: photo analysis {metrics.seconds.describe}s · storyboard {metrics.seconds.director}s · illustrations {metrics.seconds.images}s
            (illustrations run in parallel). {metrics.imageAttempts} image attempts, {metrics.failedImageAttempts} failed.
          </p>
          <table className="w-full min-w-[640px] text-right text-sm">
            <thead className="text-xs uppercase tracking-wide text-light-outline">
              <tr><th className="p-2 text-left">Model</th><th className="p-2">Calls</th><th className="p-2">Call time</th><th className="p-2">Input</th><th className="p-2">Image input</th><th className="p-2">Output</th><th className="p-2">Reasoning</th><th className="p-2">Total</th><th className="p-2">Est. cost</th></tr>
            </thead>
            <tbody>
              {Object.entries(metrics.models).map(([model, m]: [string, any]) => (
                <tr key={model} className="border-t border-light-outline-secondary/40">
                  <td className="p-2 text-left font-semibold">{model}</td>
                  <td className="p-2">{m.calls}{m.failed ? ` (${m.failed} failed)` : ''}</td>
                  <td className="p-2">{(m.ms / 1000).toFixed(1)}s</td>
                  <td className="p-2">{m.inputTokens.toLocaleString('en-US')}</td>
                  <td className="p-2">{m.inputImageTokens.toLocaleString('en-US')}</td>
                  <td className="p-2">{m.outputTokens.toLocaleString('en-US')}</td>
                  <td className="p-2">{m.reasoningTokens.toLocaleString('en-US')}</td>
                  <td className="p-2">{m.totalTokens.toLocaleString('en-US')}</td>
                  <td className="p-2">${m.estCostUsd.toFixed(4)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {judge?.usage && <p className="mt-3 text-xs text-light-outline">Judge ({judge.model}, not included above): {judge.usage.calls} calls, {judge.usage.inputTokens.toLocaleString('en-US')} input / {judge.usage.outputTokens.toLocaleString('en-US')} output tokens.</p>}
        </Card>
      )}

      <Card title="Reference photos">
        <div className="flex flex-wrap gap-4">
          {refs.map(r => (
            <figure key={r.file}>
              <img src={fileUrl(run.id, r.file)} alt={`Reference photo of ${r.characterName}`} className="h-48 rounded-lg object-cover" />
              <figcaption className="mt-1 text-sm font-semibold">{r.characterName}</figcaption>
            </figure>
          ))}
        </div>
      </Card>

      {(story?.pages || []).map((page: any) => {
        const v = verdicts.get(page.page);
        return (
          <Card key={page.page} className="grid gap-5 md:grid-cols-[minmax(0,420px)_1fr]">
            <img src={fileUrl(run.id, page.image)} alt={`Illustration for page ${page.page}`} className="w-full rounded-xl" />
            <div className="min-w-0 text-sm">
              <h2 className="font-heading text-xl font-bold">Page {page.page}</h2>
              <p className="mt-2">{page.text || <span className="font-semibold text-red-700">No page text</span>}</p>
              {v && (
                <>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <span className="rounded-full bg-white/80 px-2 py-0.5 text-xs">Expected: {v.expected.join(', ') || 'none'}</span>
                    <span className="rounded-full bg-white/80 px-2 py-0.5 text-xs">Prompt adherence {v.promptAdherence}/10</span>
                    {Object.entries(FLAGS).filter(([k]) => v[k]).map(([k, label]) => (
                      <span key={k} className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-semibold text-red-800">{label}</span>
                    ))}
                  </div>
                  <ul className="mt-3 space-y-2">
                    {v.characters.map((c: any) => (
                      <li key={c.name}>
                        <b>{c.name}</b>: {c.present ? `${c.identityScore}/10` : 'absent'}
                        {c.present && !c.outfitMatches && <span className="ml-1 font-semibold text-red-700">outfit off</span>}
                        <span className="text-light-outline"> — {c.notes}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="mt-3 text-light-outline">{v.notes}</p>
                </>
              )}
              <details className="mt-3">
                <summary className="cursor-pointer font-semibold text-light-primary">Image prompt</summary>
                <pre className="mt-2 whitespace-pre-wrap rounded-lg bg-white/70 p-3 text-xs">{page.imagePrompt}</pre>
              </details>
            </div>
          </Card>
        );
      })}

      <Card title="Trace" className="overflow-x-auto">
        <table className="w-full min-w-[700px] text-left text-sm">
          <thead className="text-xs uppercase tracking-wide text-light-outline">
            <tr><th className="p-2">At</th><th className="p-2">Event</th><th className="p-2">Detail</th><th className="p-2">Model</th><th className="p-2 text-right">Took</th><th className="p-2 text-right">Tokens</th><th className="p-2" /></tr>
          </thead>
          <tbody>
            {trace.map((e: any, i: number) => (
              <tr key={i} className="border-t border-light-outline-secondary/40 align-top">
                <td className="p-2">{(e.t / 1000).toFixed(1)}s</td>
                <td className="p-2 font-semibold">{e.event}</td>
                <td className="p-2">{e.characterName || (e.page != null && `page ${e.page}, attempt ${e.attempt}`) || e.stage || ''}{e.ok === false && <span className="ml-1 text-red-700">failed</span>}</td>
                <td className="p-2">{e.model || ''}</td>
                <td className="p-2 text-right">{e.ms != null ? `${(e.ms / 1000).toFixed(1)}s` : ''}</td>
                <td className="p-2 text-right">{e.usage?.totalTokens?.toLocaleString('en-US') ?? ''}</td>
                <td className="p-2">
                  <details>
                    <summary className="cursor-pointer text-light-primary">raw</summary>
                    <pre className="mt-2 max-h-96 max-w-2xl overflow-auto whitespace-pre-wrap rounded-lg bg-white/70 p-3 text-xs">{JSON.stringify(e, null, 2)}</pre>
                  </details>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </Shell>
  );
}

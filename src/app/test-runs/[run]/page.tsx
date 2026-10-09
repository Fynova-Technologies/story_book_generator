import { notFound } from 'next/navigation';
import { loadRun } from '@/server/testRuns';
import { Card, Shell, Status, fileUrl, formatDate } from '../ui';

export const dynamic = 'force-dynamic';

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
  const { story, faces, metrics, summary, trace, refs, sheets, narration } = run;
  const providers = Object.entries(narration?.providers || {}) as [string, any][];

  return (
    <Shell title={story?.title || run.caseName} back={{ href: '/test-runs', label: 'All runs' }}>
      <div className="flex flex-wrap items-center gap-3 text-sm text-light-outline">
        <Status status={run.status} />
        <span>{run.caseName}</span>
        <span>{formatDate(run.startedAt)}</span>
        <a className="text-light-primary hover:underline" href={fileUrl(run.id, 'trace.jsonl')}>trace.jsonl</a>
      </div>
      {story?.subtitle && <p className="text-light-outline">{story.subtitle}</p>}
      {run.error && <Card><p className="font-semibold text-red-700">Failed: {run.error}</p></Card>}

      <Card title="Summary">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-6">
          {Object.entries(summary?.faceBeatsRivals || {}).map(([name, v]) => <Stat key={`f-${name}`} label={`Beats look-alikes · ${name}`} value={v == null ? '—' : `${Math.round(Number(v) * 100)}%`} />)}
          {Object.entries(summary?.faceSimilarity || {}).map(([name, v]) => <Stat key={`s-${name}`} label={`Face similarity · ${name}`} value={v == null ? "—" : String(v)} />)}
          {Object.entries(summary?.faceCrossPage || {}).map(([name, v]) => <Stat key={`x-${name}`} label={`Same face across pages · ${name}`} value={v == null ? '—' : String(v)} />)}
          <Stat label="Missing page text" value={summary?.emptyPageText} />
          <Stat label="Total time" value={metrics && `${metrics.seconds.total}s`} />
          <Stat label="Est. cost" value={metrics && `$${metrics.estCostUsd.toFixed(3)}`} />
        </div>
      </Card>

      {metrics && (
        <Card title="Time, tokens and cost" className="overflow-x-auto">
          <p className="mb-3 text-sm text-light-outline">
            Stages: photo analysis {metrics.seconds.describe}s · storyboard {metrics.seconds.director}s
            {metrics.seconds.sheets ? ` · character sheets ${metrics.seconds.sheets}s (parallel with storyboard)` : ''} · illustrations {metrics.seconds.images}s
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
        </Card>
      )}

      {narration && (
        <Card title="Narration">
          <p className="text-sm text-light-outline">
            Voice “{narration.voice}” · {narration.chars.toLocaleString('en-US')} characters, the same script for every provider.
          </p>
          <ul className="mt-2 text-sm">
            {providers.map(([name, p]) => (
              <li key={name}>
                <b>{name}</b> ({p.model}): {p.pages.length} pages, {p.seconds ?? '—'}s of audio, est. ${p.estCostUsd?.toFixed(4) ?? '—'}{p.ms != null && `, took ${(p.ms / 1000).toFixed(1)}s`}
                {p.error && <span className="ml-1 text-red-700">failed: {p.error}</span>}
              </li>
            ))}
          </ul>
        </Card>
      )}

      <Card title="Reference photos and character sheets">
        <div className="flex flex-wrap gap-4">
          {refs.map(r => (
            <figure key={r.file}>
              <img src={fileUrl(run.id, r.file)} alt={`Reference photo of ${r.characterName}`} className="h-48 rounded-lg object-cover" />
              <figcaption className="mt-1 text-sm font-semibold">{r.characterName}</figcaption>
            </figure>
          ))}
          {sheets.map(r => (
            <figure key={r.file}>
              <img src={fileUrl(run.id, r.file)} alt={`Character sheet for ${r.characterName}`} className="h-48 rounded-lg object-cover" />
              <figcaption className="mt-1 text-sm font-semibold">{r.characterName} · character sheet</figcaption>
            </figure>
          ))}
        </div>
      </Card>

      {(story?.pages || []).map((page: any) => {
        const face = faces?.pages?.find((f: any) => f.page === page.page);
        return (
          <Card key={page.page} className="grid gap-5 md:grid-cols-[minmax(0,420px)_1fr]">
            <img src={fileUrl(run.id, page.image)} alt={`Illustration for page ${page.page}`} className="w-full rounded-xl" />
            <div className="min-w-0 text-sm">
              <h2 className="font-heading text-xl font-bold">Page {page.page}</h2>
              <p className="mt-2">{page.text || <span className="font-semibold text-red-700">No page text</span>}</p>
              {narration && (
                <div className="mt-3 space-y-2">
                  <p><b>Read aloud:</b> {narration.pages.find((n: any) => n.page === page.page)?.script}</p>
                  {providers.map(([name, p]) => {
                    const audio = p.pages.find((a: any) => a.page === page.page);
                    return (
                      <div key={name} className="flex items-center gap-3">
                        <span className="w-24 font-semibold">{name}</span>
                        {audio ? <audio controls preload="none" src={fileUrl(run.id, audio.file)} className="h-9 w-full max-w-sm" /> : <span className="text-red-700">no audio</span>}
                        {audio?.estCostUsd != null && <span className="text-xs text-light-outline">{audio.seconds.toFixed(1)}s · ${audio.estCostUsd.toFixed(4)}</span>}
                      </div>
                    );
                  })}
                </div>
              )}
              {face && (
                <p className="mt-3">
                  <b>Face identity (ArcFace):</b> {face.facesFound} face{face.facesFound === 1 ? '' : 's'} found ·{' '}
                  {Object.entries(face.matches).map(([name, m]: [string, any], i) => (
                    <span key={name} className={m.beatsRivals ? 'text-green-700' : 'text-red-700'}>
                      {i > 0 && ' · '}{name} {m.similarity == null ? 'not found' : `${m.similarity} vs look-alike ${m.bestRival}`}
                    </span>
                  ))}
                </p>
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

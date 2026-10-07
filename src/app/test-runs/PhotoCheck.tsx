'use client';

import { useState } from 'react';
import { compressPhoto, formatBytes } from '@/lib/compressPhoto';
import { Card } from './ui';

type Shot = { url: string; bytes: number; type: string; width: number; height: number };

const describe = async (blob: Blob): Promise<Shot> => {
  const bitmap = await createImageBitmap(blob);
  const shot = { url: URL.createObjectURL(blob), bytes: blob.size, type: blob.type, width: bitmap.width, height: bitmap.height };
  bitmap.close();
  return shot;
};

// Runs a photo through the same compression the upload step uses, free and in the browser.
export default function PhotoCheck() {
  const [shots, setShots] = useState<[Shot, Shot] | null>(null);
  const [error, setError] = useState('');

  const pick = async (file?: File) => {
    if (!file) return;
    shots?.forEach(shot => URL.revokeObjectURL(shot.url));
    setShots(null);
    try {
      setShots([await describe(file), await describe(await compressPhoto(file))]);
      setError('');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not read the photo.');
    }
  };

  return (
    <Card title="Photo compression check">
      <p className="text-sm text-light-outline">Pick a photo to see exactly what gets stored and sent to the model. Nothing is uploaded.</p>
      <input type="file" accept="image/jpg,image/jpeg,image/png,image/webp" onChange={e => pick(e.target.files?.[0])} className="mt-3 text-sm" />
      {error && <p role="alert" className="mt-3 text-sm font-semibold text-red-700">{error}</p>}
      {shots && (
        <>
          <p className="mt-3 text-sm font-semibold">{Math.round((1 - shots[1].bytes / shots[0].bytes) * 100)}% smaller</p>
          <div className="mt-3 grid gap-4 md:grid-cols-2">
            {shots.map((shot, i) => (
              <figure key={shot.url}>
                <a href={shot.url} target="_blank" rel="noreferrer">
                  <img src={shot.url} alt={i ? 'Processed photo' : 'Original photo'} className="max-h-[480px] w-full rounded-lg bg-white object-contain" />
                </a>
                <figcaption className="mt-2 text-sm">
                  <span className="font-semibold">{i ? 'Processed' : 'Original'}</span>{' · '}
                  {shot.width}×{shot.height} · {shot.type || 'unknown'} · {formatBytes(shot.bytes)}
                </figcaption>
              </figure>
            ))}
          </div>
        </>
      )}
    </Card>
  );
}

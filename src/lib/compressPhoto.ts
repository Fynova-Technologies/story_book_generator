// Photos are shrunk in the browser as soon as they are picked; only this copy is stored and sent to the model.
// Image input tokens grow with pixel area (not file size) and every photo is sent with every page.
const MAX_SIDE = 1024;
const QUALITY = 0.85;

export async function compressPhoto(file: Blob): Promise<Blob> {
  const image = await createImageBitmap(file);
  const scale = Math.min(1, MAX_SIDE / Math.max(image.width, image.height));
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(image.width * scale);
  canvas.height = Math.round(image.height * scale);
  canvas.getContext('2d')!.drawImage(image, 0, 0, canvas.width, canvas.height);
  image.close();
  const encode = (type: string) => new Promise<Blob | null>(resolve => canvas.toBlob(resolve, type, QUALITY));
  // Browsers that can't encode WebP hand back a PNG instead; use JPEG there.
  const webp = await encode('image/webp');
  const blob = webp?.type === 'image/webp' ? webp : await encode('image/jpeg');
  if (!blob) throw new Error('Could not read the photo.');
  return blob;
}

export const MAX_TOTAL_BYTES = 10 * 1024 * 1024;

export const formatBytes = (bytes: number) =>
  bytes >= 1024 * 1024 ? `${+(bytes / 1024 / 1024).toFixed(1)} MB` : `${Math.round(bytes / 1024)} KB`;

export const blobToDataUrl = (blob: Blob) => new Promise<string>((resolve, reject) => {
  const reader = new FileReader();
  reader.onload = () => resolve(reader.result as string);
  reader.onerror = () => reject(reader.error);
  reader.readAsDataURL(blob);
});

// A picked file, compressed, as the wizard stores it.
export async function readPhoto(file: Blob) {
  const blob = await compressPhoto(file);
  return { image: await blobToDataUrl(blob), size: blob.size };
}

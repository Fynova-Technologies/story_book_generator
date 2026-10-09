import { useId, useRef, useState } from "react";
import { readPhoto } from "../../lib/compressPhoto";

// Figma 1502:2577 / 1502:2927 (Upload image) and the DropzoneUploadCard component 1502:3124.
const ACCEPT = "image/jpg,image/jpeg,image/png,image/webp";
export const NOTE_LIMIT = 100;
export type PickedPhoto = { image: string; size: number };

const PhotosIcon = () => (
  <svg width="68" height="58" viewBox="0 0 68 58" fill="none" aria-hidden="true">
    <rect x="30" y="0" width="38" height="38" rx="10" fill="#A3B8F5" />
    <rect x="0" y="14" width="48" height="44" rx="10" fill="#6E8FEF" />
    <path d="M12 46l9-11 7 8 4-5 6 8z" fill="#fff" />
    <circle cx="31" cy="28" r="2.5" fill="#fff" />
  </svg>
);

// Drop or pick photos. The empty step shows the big card; once there is a photo, the compact
// "Add another photo" bar. Several files at once fill the free slots in order.
export function PhotoDropzone({ compact, slots, onPhotos }: { compact?: boolean; slots: number; onPhotos: (photos: PickedPhoto[]) => void }) {
  const input = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  const read = async (files: FileList | null) => {
    const picked = [...(files || [])];
    if (!picked.length) return;
    setBusy(true);
    setMessage("");
    const results = await Promise.allSettled(picked.slice(0, slots).map(readPhoto));
    setBusy(false);
    const photos = results.flatMap((r) => (r.status === "fulfilled" ? [r.value] : []));
    if (photos.length) onPhotos(photos);
    if (photos.length < results.length) setMessage("We couldn't read one of those photos. Try a JPG, PNG or WEBP.");
    else if (picked.length > slots) setMessage(`Only ${slots} more ${slots === 1 ? "photo fits" : "photos fit"}; the rest were skipped.`);
  };

  const drop = {
    onDragOver: (e: React.DragEvent) => { e.preventDefault(); setDragging(true); },
    onDragLeave: () => setDragging(false),
    onDrop: (e: React.DragEvent) => { e.preventDefault(); setDragging(false); read(e.dataTransfer.files); },
  };
  const pick = () => input.current?.click();
  const fileInput = (
    <input ref={input} type="file" accept={ACCEPT} multiple className="hidden"
      onChange={(e) => { read(e.target.files); e.target.value = ""; }} />
  );
  const status = message && <p role="alert" className="mt-3 font-body text-sm font-semibold text-red-700">{message}</p>;

  if (compact) {
    return (
      <div>
        <button type="button" onClick={pick} disabled={busy} {...drop}
          className={`w-full flex items-center gap-5 p-5 md:px-6 md:py-9 rounded-[26px] border border-dashed text-left transition-all ${dragging ? "border-light-primary bg-light-primary/10" : "border-[#93A6DB] bg-white/40 hover:bg-white/70"}`}>
          <span className="w-14 h-14 shrink-0 rounded-2xl bg-light-primary text-white flex items-center justify-center shadow-[0_6px_16px_rgba(21,90,209,0.35)]">
            {busy
              ? <span className="w-6 h-6 rounded-full border-[3px] border-white/40 border-t-white animate-spin" />
              : <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>}
          </span>
          <span>
            <span className="block font-body text-lg font-semibold text-[#0F172A]">{busy ? "Processing…" : "Add another photo"}</span>
            <span className="block mt-0.5 font-body text-[13px] text-[#64748B]">Drag a photo here · JPG, PNG or WEBP · up to 10 MB</span>
          </span>
        </button>
        {fileInput}
        {status}
      </div>
    );
  }

  return (
    <div {...drop}
      className={`flex flex-col items-center text-center px-6 py-12 md:py-14 rounded-[26px] bg-white border border-dashed transition-all ${dragging ? "border-light-primary shadow-[0_8px_30px_rgba(21,90,209,0.25)]" : "border-[#E2E8F0] hover:shadow-[0_8px_30px_rgba(21,90,209,0.15)]"}`}>
      <PhotosIcon />
      {busy ? (
        <p role="status" className="mt-6 font-body text-base font-bold text-[#1E293B]">Processing…</p>
      ) : (
        <>
          <p className="mt-6 font-body text-base font-bold text-[#1E293B]">
            Drop your photo here, or <button type="button" onClick={pick} className="text-light-primary hover:underline">browse</button>
          </p>
          <p className="mt-1.5 font-body text-xs text-[#64748B]">Supports: PNG, JPG, JPEG, WEBP · up to 10 MB</p>
          <button type="button" onClick={pick} className="mt-6 px-7 py-3 rounded-full bg-light-primary text-white font-body text-base font-semibold hover:opacity-90 active:scale-[0.99] transition-all">
            Browse photos
          </button>
        </>
      )}
      {fileInput}
      {status}
    </div>
  );
}

interface RowProps {
  image: string;
  characterName: string;
  description: string;
  role?: string;
  roles: string[];
  nameOptions: string[];
  onChange: (change: { characterName?: string; description?: string; role?: string } | PickedPhoto) => void;
  onRemove: () => void;
}

// One uploaded photo: who it is, their role, an optional note. The photo itself can be replaced.
export default function PhotoRow({ image, characterName, description, role, roles, nameOptions, onChange, onRemove }: RowProps) {
  const ids = { name: useId(), list: useId() };
  const input = useRef<HTMLInputElement>(null);
  // The new photo, shown blurred while it is compressed.
  const [processing, setProcessing] = useState<string | null>(null);
  const [readError, setReadError] = useState(false);
  const named = !!characterName.trim();

  const replace = async (file?: File) => {
    if (!file) return;
    const preview = URL.createObjectURL(file);
    setProcessing(preview);
    try {
      onChange(await readPhoto(file));
      setReadError(false);
    } catch {
      setReadError(true);
    } finally {
      setProcessing(null);
      URL.revokeObjectURL(preview);
    }
  };

  return (
    <div className="relative flex flex-col sm:flex-row gap-5 sm:gap-6 p-5 md:p-6 rounded-[26px] bg-white border border-[#F0EBD9]/60">
      <button type="button" onClick={onRemove} aria-label={named ? `Remove photo of ${characterName}` : "Remove photo"}
        className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#F4ECE0] text-[#5C5244] flex items-center justify-center hover:bg-[#EADFCC] transition-colors">
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M1 1l10 10M11 1L1 11" /></svg>
      </button>

      {/* ── PHOTO: click to replace ── */}
      <div className="relative w-28 sm:w-[124px] shrink-0 self-start">
        <button type="button" onClick={() => input.current?.click()} aria-label="Replace photo"
          className="group relative block w-full aspect-[124/180] rounded-3xl overflow-hidden border border-[#F5E6D0]">
          <img src={processing || image} alt={named ? `Photo of ${characterName}` : "Uploaded photo"}
            className={`w-full h-full object-cover transition-[filter] duration-300 ${processing ? "blur-sm scale-105" : ""}`} />
          <span className="absolute inset-0 flex items-end justify-center pb-3 bg-black/35 opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity font-body text-xs font-semibold text-white">
            {processing ? "Processing…" : "Replace"}
          </span>
        </button>
        <span className="absolute -bottom-1.5 -right-1.5 w-6 h-6 rounded-full bg-[#1B874B] border-2 border-white flex items-center justify-center shadow" aria-hidden="true">
          <svg width="10" height="8" viewBox="0 0 10 8" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M1 4l2.6 2.6L9 1" /></svg>
        </span>
        <input ref={input} type="file" accept={ACCEPT} className="hidden" onChange={(e) => { replace(e.target.files?.[0]); e.target.value = ""; }} />
      </div>

      {/* ── WHO / ROLE / NOTE ── */}
      <div className="flex-1 min-w-0 flex flex-col gap-3 sm:pr-10">
        <label htmlFor={ids.name} className="font-body text-sm font-bold text-[#2D3139]">
          Who is this? <span className="text-red-600" aria-label="required">*</span>
        </label>
        <input id={ids.name} type="text" value={characterName} required list={ids.list} placeholder="e.g. Arjun"
          onChange={(e) => onChange({ characterName: e.target.value.slice(0, 80) })} aria-invalid={!named}
          className={`w-full h-[50px] px-4 rounded-xl bg-white border font-body text-base text-[#2C323F] placeholder:text-[#7E858F] focus:outline-none focus:ring-2 focus:ring-light-primary/15 ${named ? "border-[#D6CFC4] focus:border-light-primary" : "border-red-400"}`} />
        <datalist id={ids.list}>
          {nameOptions.map((name) => <option key={name} value={name} />)}
        </datalist>

        <div role="group" aria-label="Their role in the story" className="flex flex-wrap gap-2">
          {roles.map((r) => (
            <button key={r} type="button" aria-pressed={role === r} onClick={() => onChange({ role: role === r ? "" : r })}
              className={`px-4 py-1.5 rounded-full font-body text-xs transition-all ${role === r
                ? "bg-light-primary text-white font-semibold shadow-[0_2px_6px_rgba(21,90,209,0.3)]"
                : "bg-white border border-[#D2CCC0] text-[#4A5568] font-medium hover:border-light-primary/50"}`}>
              {r}
            </button>
          ))}
        </div>

        <div>
          <textarea value={description} maxLength={NOTE_LIMIT} rows={1} aria-label={`Note about ${characterName || "this person"}`}
            onChange={(e) => onChange({ description: e.target.value })} placeholder="Optional: age, what they love…"
            className="block w-full min-h-[45px] field-sizing-content px-4 py-2.5 rounded-xl bg-white border border-[#D6CFC4] font-body text-base text-[#3F4041] placeholder:text-[#7E858F] resize-none focus:outline-none focus:border-light-primary focus:ring-2 focus:ring-light-primary/15" />
          {description.length >= NOTE_LIMIT * 0.8 && (
            <p className="mt-1 text-right font-body text-[11px] text-light-outline/60" aria-live="polite">{description.length}/{NOTE_LIMIT}</p>
          )}
        </div>
        {readError && <p role="alert" className="font-body text-sm font-semibold text-red-700">We couldn&apos;t read that photo. Try a JPG, PNG or WEBP.</p>}
      </div>
    </div>
  );
}

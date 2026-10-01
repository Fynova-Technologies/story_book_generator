import React, { useState, useRef, useId } from "react";

const ImageUploadCard = ({
    onImageUpload,
    previewImage,
    description,
    onDescriptionChange,
    onFileSizeChange,
    characterName,
    onNameChange,
    onRemove,
    dimmed = false, // empty slots after the next one to fill
    nameOptions = [],
}: {
    onImageUpload: (image: string) => void;
    previewImage: string | null;
    description: string;
    onDescriptionChange: (description: string) => void;
    onFileSizeChange: (sizeMB: number) => void;
    characterName: string;
    onNameChange: (name: string) => void;
    onRemove?: () => void;
    dimmed?: boolean;
    nameOptions?: string[];
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const nameListId = useId();
  const [isDragging, setIsDragging] = useState(false);
  const charLimit = 100;

  const readFile = (file?: File) => {
    if (!file) return;
    onFileSizeChange?.(file.size / (1024 * 1024));
    const reader = new FileReader();
    reader.onloadend = () => {
      onImageUpload?.(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    readFile(e.target.files?.[0]);
    e.target.value = ""; // so picking the same file again after removing it still fires
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    readFile(e.dataTransfer.files[0]);
  };

  const fileInput = (
    <input
      ref={fileInputRef}
      type="file"
      accept="image/jpg,image/jpeg,image/png,image/webp"
      onChange={handleFileChange}
      className="hidden"
    />
  );

  // ── Empty slot ──
  if (!previewImage) {
    // The hidden input sits outside the button so its click doesn't bubble back into the button.
    return (
      <>
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`h-full min-h-[240px] md:min-h-[355px] flex flex-col items-center justify-center gap-4 p-4 rounded-xl border-[1.5px] border-dashed transition-all duration-200
          ${isDragging
            ? "border-light-primary bg-light-primary/10"
            : dimmed
              ? "border-light-primary/20 bg-white/20 opacity-50 hover:opacity-100"
              : "border-light-primary/30 bg-[#FDFBF7] hover:border-light-primary/60"
          }
        `}
      >
        <span className="w-12 h-12 rounded-full bg-light-primary/10 flex items-center justify-center text-light-primary">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
            <path d="M12 18v-6M9 15l3-3 3 3"/>
          </svg>
        </span>
        <span className="flex flex-col items-center gap-1.5 text-center">
          <span className="font-body text-sm font-bold text-light-primary">Upload Photo</span>
          <span className="font-body text-[10px] leading-tight text-light-outline">
            Supported formats: JPG, PNG, WEBP<br />(Max 10MB)
          </span>
        </span>
      </button>
      {fileInput}
      </>
    );
  }

  // ── Filled card ──
  return (
    <div className="flex flex-col gap-2 p-2 rounded-3xl bg-white border border-slate-100 shadow-sm">

      {/* ── IMAGE ── */}
      <div className="group relative w-full aspect-square rounded-2xl overflow-hidden shadow-[inset_0_2px_4px_rgba(0,0,0,0.06)]">
        <img
          src={previewImage}
          alt={characterName ? `Photo of ${characterName}` : "Uploaded photo"}
          className="w-full h-full object-cover"
        />

        {/* Hover: replace or remove */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity flex items-end justify-center pb-3">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="px-2.5 py-1 rounded-md bg-white/20 backdrop-blur-sm font-body text-xs font-medium text-white hover:bg-white/30"
          >
            Replace
          </button>
        </div>
        {onRemove && (
          <button
            type="button"
            onClick={onRemove}
            aria-label="Remove photo"
            className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/30 md:bg-white/20 backdrop-blur-sm text-white flex items-center justify-center md:opacity-0 group-hover:opacity-100 focus:opacity-100 hover:bg-black/50 transition-opacity"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 6 5 6 21 6"/>
              <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6M10 11v6M14 11v6M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
            </svg>
          </button>
        )}

        {/* ✅ Blue checkmark badge */}
        <div className="absolute top-2 left-2 w-6 h-6 rounded-full bg-light-primary flex items-center justify-center shadow-md">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </div>
        {fileInput}
      </div>

      {/* ── WHO IS THIS ── */}
      <label className="block rounded-xl bg-slate-50 px-3 py-2 font-body text-[11px] font-semibold text-light-outline">
        Who is this? <span className="text-red-600">*</span>
        <input
          type="text"
          value={characterName || ""}
          onChange={(e) => onNameChange?.(e.target.value.slice(0, 80))}
          list={nameListId}
          required
          placeholder="e.g. Arjun"
          aria-invalid={!characterName?.trim()}
          className={`mt-0.5 w-full bg-transparent font-body text-sm font-normal text-light-text placeholder:text-light-outline-secondary focus:outline-none border-b ${characterName?.trim() ? "border-transparent focus:border-light-primary" : "border-red-400"}`}
        />
      </label>
      <datalist id={nameListId}>
        {nameOptions.map((name: string) => <option key={name} value={name} />)}
      </datalist>

      {/* ── DESCRIPTION ── */}
      <div className="relative rounded-xl bg-slate-50 px-3 pt-2 pb-5">
        <textarea
          value={description}
          onChange={(e) => onDescriptionChange?.(e.target.value.slice(0, charLimit))}
          placeholder="Add description..."
          aria-label="Photo description"
          rows={3}
          className="w-full font-body text-xs text-light-outline placeholder:text-light-outline bg-transparent resize-none focus:outline-none leading-snug"
        />
        <span className="absolute bottom-1.5 right-3 font-body text-[10px] text-light-outline/50">
          {description?.length || 0}/{charLimit}
        </span>
      </div>

    </div>
  );
};

export default ImageUploadCard;

import { useState, useRef } from "react";

const ImageUploadCard = ({ 
    onImageUpload, 
    previewImage, 
    description, 
    onDescriptionChange 
}: any) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const charLimit = 20;

  const handleFileChange = (e: any) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onImageUpload?.(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: any) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleDrop = (e: any) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onImageUpload?.(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex flex-col rounded-2xl overflow-hidden border border-light-outline-secondary dark:border-dark-primary-30
     bg-light-on-primary dark:bg-dark-bg">

      {/* ── IMAGE AREA ── */}
      <div
        className={`relative w-full aspect-square cursor-pointer transition-all duration-200
          ${isDragging ? "bg-dark-primary-10" : "bg-light-bg dark:bg-dark-primary-10"}
          ${!previewImage ? "border-b border-dashed border-light-outline-secondary dark:border-dark-primary-30" : ""}
        `}
        onClick={() => fileInputRef.current?.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {previewImage ? (
          <>
            {/* Uploaded Image */}
            <img
              src={previewImage}
              alt="Uploaded"
              className="w-full h-full object-cover"
            />

            {/* ✅ Blue checkmark badge */}
            <div className="absolute top-2 left-2 w-6 h-6 rounded-full bg-light-primary dark:bg-dark-primary flex items-center justify-center shadow-sm">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            </div>
          </>
        ) : (
          /* Upload Placeholder */
          <div className="w-full h-full flex flex-col items-center justify-center gap-5 p-4">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-light-primary dark:text-dark-primary">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
              <line x1="12" y1="18" x2="12" y2="12"/>
              <line x1="9" y1="15" x2="15" y2="15"/>
            </svg>
            <p className="font-body text-sm font-semibold text-light-primary dark:text-dark-primary">
              Upload Photo
            </p>
            <p className="font-body text-[10px] text-light-outline dark:text-dark-text opacity-50 text-center leading-snug">
              Supported formats: JPG, PNG, WEBP{"\n"}(Max 10MB)
            </p>
          </div>
        )}

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpg,image/jpeg,image/png,image/webp"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      {/* ── DESCRIPTION AREA ── */}
      {previewImage && (
        <div className="p-3 relative">
          <textarea
            value={description}
            onChange={(e: any) => onDescriptionChange?.(e.target.value.slice(0, charLimit))}
            placeholder="Add description..."
            rows={3}
            className="w-full font-body text-xs text-light-text dark:text-dark-text placeholder:text-light-outline-secondary bg-transparent resize-none focus:outline-none leading-relaxed"
          />
          {/* Char count */}
          <span className="absolute bottom-2 right-3 font-body text-[10px] text-light-outline-secondary dark:text-dark-text opacity-40">
            {description?.length || 0}/{charLimit}
          </span>
        </div>
      )}

    </div>
  );
};

export default ImageUploadCard;

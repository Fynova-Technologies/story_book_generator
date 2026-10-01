import { useState } from "react";

const TemplateCard = ({
  image,
  title,
  description,
  likes = "",
  views = "",
  onUseTemplate,
  onLike,
  isSelected,
  onClick,
}: {
  image?: string;
  title: string;
  description: string;
  likes?: string;
  views?: string;
  onUseTemplate?: () => void;
  onLike?: () => void;
  isSelected?: boolean;
  onClick?: () => void;
}) => {
  const [isLiked, setIsLiked] = useState(false);

  const handleLike = () => {
    setIsLiked(!isLiked);
    onLike?.();
  };

  // The wizard card (no likes) is a selectable tile; the Templates page card has stats and a button.
  const selectable = likes === "";

  return (
    <div
    onClick={onClick}
    role={selectable ? "button" : undefined}
    tabIndex={selectable ? 0 : undefined}
    aria-pressed={selectable ? !!isSelected : undefined}
    onKeyDown={selectable ? (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onClick?.(); } } : undefined}
    className={`flex flex-col p-2.5 bg-white rounded-[18px] overflow-hidden border-2 transition-all duration-300
      ${isSelected ? "border-light-primary" : "border-transparent hover:shadow-[0_4px_13px_rgba(0,0,0,0.25)]"}
      ${selectable ? "cursor-pointer focus-visible:outline-2 focus-visible:outline-light-primary" : ""}`}>

      {/* ── IMAGE ── */}
      <div className="relative w-full aspect-[265/188] overflow-hidden rounded-[15px]">
        {image ? (
          <img
            src={image}
            alt={title}
            className={`w-full h-full object-cover transition-all duration-500 ${isSelected ? "opacity-50" : "hover:scale-105"}`}
          />
        ) : null
         }
         {/* ✅ Selected check badge */}
        {isSelected && (
          <div className="absolute top-1.5 right-1.5 w-7 h-7 rounded-full bg-light-primary ring-2 ring-white flex items-center justify-center shadow-md">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          </div>
        )}

        {/* ── Heart Like Button ── */}
        {likes && (
          <button
            onClick={handleLike}
            className="absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center hover:scale-110 transition-all 
            duration-200 glass-dark"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill={isLiked ? "#E53E3E" : "none"}
              stroke={isLiked ? "#E53E3E" : "currentColor"}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-white"
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
          </button>
        )}
      </div>

      {/* ── CONTENT ── */}
      <div className="flex flex-col flex-1 px-1 pt-3 pb-1 gap-3">

        {/* Title */}
        <h4 className="font-body font-bold text-base text-light-text leading-snug">
          {title}
        </h4>

        {/* Description */}
        <p className="font-body text-sm text-[#7A7A8C] leading-snug flex-1">
          {description}
        </p>

        {/* ── Footer — Stats + Button (Templates page only; the wizard card has no likes) ── */}
        {likes && (
        <div className="flex items-center justify-between pt-3 border-t border-light-outline-secondary/30">

          {/* Stats */}
          <div className="flex items-center gap-3">
            {/* Likes */}
            <div className="flex items-center gap-1">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="#E53E3E" stroke="#E53E3E" strokeWidth="1">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
              <span className="font-body text-xs text-light-outline opacity-60">{likes}</span>
            </div>

            {/* Views */}
            <div className="flex items-center gap-1">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-light-outline opacity-60">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                <circle cx="12" cy="12" r="3"/>
              </svg>
              <span className="font-body text-xs text-light-outline opacity-60">{views}</span>
            </div>
          </div>

          {/* Use Template Button */}
          <button
            onClick={onUseTemplate}
            className="flex items-center gap-1.5 px-1 py-1.5 rounded-full border border-light-primary
 text-xs font-body  text-light-primary
              hover:bg-light-primary hover:text-light-on-primary hover:border-light-primary
 transition-all duration-200"
          >
            Use Template
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </button>
        </div>
        )}
      </div>
    </div>
  );
};

export default TemplateCard;

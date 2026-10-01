// 📁 src/components/FeaturedStoryCard/FeaturedStoryCard.tsx

import { useState } from "react";

const FeaturedStoryCard = ({
  image,
  title,
  description,
  author,
  authorAvatar,
  likes = "2.4k",
  views = "10k",
  onReadStory,
  onLike,
}: {
  image?: string;
  title: string;
  description: string;
  author?: string;
  authorAvatar?: string | null;
  likes?: string;
  views?: string;
  onReadStory?: () => void;
  onLike?: () => void;
}) => {
  const [isLiked, setIsLiked] = useState(false);

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsLiked(!isLiked);
    onLike?.();
  };

  return (
    <div className="flex flex-col gap-3 p-2.5 bg-white rounded-[18px] overflow-hidden hover:shadow-lg transition-all duration-300">

      {/* ── IMAGE ── */}
      <div className="relative w-full aspect-[281/210] overflow-hidden rounded-[15px]">
        {image ? (
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          />
        ) : null}

        {/* ── Heart Button ── */}
        <button
          onClick={handleLike}
          aria-label={isLiked ? "Unlike" : "Like"}
          className="absolute top-3 right-3 w-[30px] h-[30px] rounded-full flex items-center justify-center hover:scale-110 transition-all
            duration-200 bg-white/10 backdrop-blur-sm border border-white/30"
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
      </div>

      {/* ── AUTHOR ── */}
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded-full overflow-hidden bg-light-text flex-shrink-0 flex items-center justify-center">
          {authorAvatar ? (
            <img src={authorAvatar} alt={author} className="w-full h-full object-cover" />
          ) : (
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white" aria-hidden="true">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
          )}
        </div>
        <span className="font-body text-[13px] text-light-outline">
          By {author || "Jaydon Botosh"}
        </span>
      </div>

      {/* ── CONTENT ── */}
      <div className="flex flex-col flex-1 gap-3 px-1">
        <h4 className="font-body font-bold text-base text-light-text leading-snug">
          {title}
        </h4>
        <p className="font-body text-xs text-[#858585] leading-[15px] flex-1 line-clamp-2">
          {description}
        </p>
      </div>

      {/* ── Footer ── */}
      <div className="flex items-center justify-between px-1 py-2">

        {/* Stats */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="#E53E3E" stroke="#E53E3E" strokeWidth="1" aria-hidden="true">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
            <span className="font-body text-xs font-semibold text-light-outline">{likes}</span>
          </div>
          <div className="flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-light-text" aria-hidden="true">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
              <circle cx="12" cy="12" r="3"/>
            </svg>
            <span className="font-body text-xs font-semibold text-light-outline">{views}</span>
          </div>
        </div>

        {/* Read Story Button */}
        <button
          onClick={onReadStory}
          className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-dark-primary-10 text-[11px] font-body font-semibold text-light-primary hover:bg-light-primary hover:text-white transition-all duration-200"
        >
          Read Story
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </button>

      </div>
    </div>
  );
};

export default FeaturedStoryCard;

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
}: any) => {
  const [isLiked, setIsLiked] = useState(false);

  const handleLike = (e: any) => {
    e.stopPropagation();
    setIsLiked(!isLiked);
    onLike?.();
  };

  return (
    <div className="flex flex-col p-3  bg-light-on-primary dark:bg-dark-bg rounded-2xl overflow-hidden border-light-outline-secondary dark:border-dark-primary-30 hover:shadow-lg hover:scale-[1.02] transition-all duration-300 cursor-pointer">

      {/* ── IMAGE ── */}
      <div className="relative w-full aspect-4/3 overflow-hidden rounded-2xl">
        {image ? (
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          />
        ) : 
         
         null}

        {/* ── Heart Button ── */}
        <button
          onClick={handleLike}
          className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/80 dark:bg-dark-bg/80 backdrop-blur-sm flex items-center justify-center hover:scale-110 transition-all duration-200 shadow-sm"
        >
          <svg
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill={isLiked ? "#E53E3E" : "none"}
            stroke={isLiked ? "#E53E3E" : "currentColor"}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-light-outline dark:text-dark-text"
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
        </button>

        {/* ── Author Badge (bottom left over image) ── */}
        <div className="absolute bottom-2 left-2 flex items-center gap-1.5 px-2 py-1 rounded-full bg-dark-bg/70 backdrop-blur-sm">
          {/* Author Avatar */}
          <div className="w-5 h-5 rounded-full overflow-hidden bg-dark-primary-10 border border-white/20 flex-shrink-0">
            {authorAvatar ? (
              <img src={authorAvatar} alt={author} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-dark-primary-30 flex items-center justify-center">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-dark-text">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
              </div>
            )}
          </div>
          <span className="font-body text-[10px] text-white/90">
            By {author || "Jaydon Botosh"}
          </span>
        </div>

      </div>

      {/* ── CONTENT ── */}
      <div className="flex flex-col flex-1 p-4 gap-2">

        {/* Title */}
        <h4 className="font-heading font-bold text-sm text-light-text dark:text-dark-text leading-snug">
          {title}
        </h4>

        {/* Description */}
        <p className="font-body text-xs text-light-outline dark:text-dark-text opacity-60 leading-relaxed flex-1 line-clamp-3">
          {description}
        </p>

        {/* ── Footer ── */}
        <div className="flex items-center justify-between mt-1 pt-3 border-t border-light-outline-secondary dark:border-dark-primary-30">

          {/* Stats */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="#E53E3E" stroke="#E53E3E" strokeWidth="1">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
              <span className="font-body text-xs text-light-outline dark:text-dark-text opacity-60">{likes}</span>
            </div>
            <div className="flex items-center gap-1">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-light-outline dark:text-dark-text opacity-60">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                <circle cx="12" cy="12" r="3"/>
              </svg>
              <span className="font-body text-xs text-light-outline dark:text-dark-text opacity-60">{views}</span>
            </div>
          </div>

          {/* Read Story Button */}
          <button
            onClick={onReadStory}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-light-outline-secondary dark:border-dark-primary-30 text-xs font-body font-medium text-light-text dark:text-dark-text hover:bg-light-primary hover:text-light-on-primary hover:border-light-primary dark:hover:bg-dark-primary dark:hover:border-dark-primary transition-all duration-200"
          >
            Read Story
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </button>

        </div>
      </div>
    </div>
  );
};

export default FeaturedStoryCard;

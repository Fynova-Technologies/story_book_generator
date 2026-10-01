interface StoryCardProps {
  image: string;
  title: string;
  description: string;
  author: string;
  authorAvatar?: string;
  authorInitial?: string;
  onViewStory?: () => void;
  onLike?: () => void;
  isLiked?: boolean;
}

const StoryCard = ({
  image,
  title,
  description,
  author,
  authorAvatar,
  authorInitial,
  onViewStory,
  onLike,
  isLiked = false,
}: StoryCardProps) => {
  return (
    <div className="flex flex-col gap-2.5 bg-white rounded-[17px] p-2.5 shadow-sm hover:shadow-md transition-shadow duration-300">

      {/* ── IMAGE SECTION ── */}
      <div className="relative w-full aspect-[230/186] overflow-hidden rounded-[13px]">

        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover object-center transition-transform duration-500 hover:scale-105"
        />

        {/* ── LIKE BUTTON (only where liking does something) ── */}
        {onLike && <button
          onClick={onLike}
          aria-label={isLiked ? "Unlike" : "Like"}
          className="absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center hover:scale-110 transition-all 
            duration-200 glass-dark"
        >
          <svg
            width="16"
            height="16"
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
        </button>}

      </div>

      {/* ── CONTENT ── */}
      <div className="flex flex-col flex-1 gap-2.5 px-1.5">
        <h3 className="font-body font-bold text-[13px] leading-5 text-light-text truncate">
          {title}
        </h3>
        <p className="font-body text-[10px] leading-[13px] text-light-outline/80 line-clamp-2 flex-1 min-h-[26px]">
          {description}
        </p>
      </div>

      {/* ── FOOTER — Author + Button ── */}
      <div className="flex items-center justify-between gap-2 px-1.5 py-3 border-t border-[#DFD4C3]/50">

        {/* Author */}
        <div className="flex items-center gap-1 min-w-0">
          <div className="w-4 h-4 shrink-0 rounded-full bg-dark-primary-10 overflow-hidden flex items-center justify-center">
            {authorAvatar ? (
              <img src={authorAvatar} alt={author} className="w-full h-full object-cover" />
            ) : authorInitial ? (
              <span className="text-[8px] font-bold text-light-primary">{authorInitial}</span>
            ) : (
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-light-primary">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
            )}
          </div>
          <span className="font-body text-[10px] text-light-outline truncate">
            {author}
          </span>
        </div>

        <button
          onClick={onViewStory}
          className="shrink-0 flex items-center gap-1 px-3.5 py-1.5 rounded-full bg-dark-primary-10 font-body text-[11px] text-light-text
 hover:bg-light-primary hover:text-white transition-colors duration-200"
        >
          View Story
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </button>

      </div>
    </div>
  );
};

export default StoryCard;


interface DraftCardProps {
  image: string;
  title: string;
  authorAvatar?: string;
  editedAt:string;
  onContinue?: () => void;
  onDelete?: () => void;
}

const DraftCard = ({
  image,
  title,
  authorAvatar,
  editedAt,
  onContinue,
  onDelete
}: DraftCardProps) => {
  return (
    <div className="flex flex-col bg-light-on-primary dark:bg-dark-bg rounded-2xl overflow-hidden 
    shadow-2xl hover:shadow-md transition-all duration-300 p-3">

      {/* ── IMAGE SECTION ── */}
      <div className="relative w-full h-48 overflow-hidden rounded-2xl">

        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover object-center transition-transform duration-500 hover:scale-105"
        />

        {/* Delete button */}
        {onDelete && (
          <button
            onClick={onDelete}
            className="absolute top-2 right-2 w-8 h-8 rounded-full bg-red-500/80 hover:bg-red-600 flex items-center justify-center transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
        )}

      </div>

      {/* ── CONTENT SECTION ── */}
      <div className="flex flex-col flex-1 p-4 gap-2">

        {/* Title */}
        <h3 className="font-display font-bold text-base text-light-text dark:text-dark-text leading-snug">
          {title}
        </h3>

        {/* ── FOOTER — Author + Button ── */}
        <div className="flex items-center justify-between mt-2 pt-3 border-t border-light-outline-secondary dark:border-dark-primary-30">

          {/* Author */}
          <div className="flex items-center gap-2">
            {/* Avatar */}
            <div className="w-6 h-6 rounded-full bg-dark-primary-30 overflow-hidden flex items-center justify-center">
              {authorAvatar ? (
                <img
                  src={authorAvatar}
                  alt=""
                  className="w-full h-full object-cover"
                />
              ) : (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-light-primary dark:text-dark-primary">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
              )}
            </div>
            <span className="font-body text-xs text-light-outline dark:text-dark-text">
              {editedAt}
            </span>
          </div>

          {/* View Story Button */}
          <button
            onClick={onContinue}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-light-bg dark:bg-dark-primary-10
             border-light-outline-secondary dark:border-dark-primary-30 text-xs font-body font-medium text-light-text
              dark:text-dark-text hover:bg-light-primary hover:text-light-on-primary dark:hover:bg-dark-primary dark:hover:text-dark-text transition-all duration-200"
          >
            Continue
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </button>

        </div>
      </div>
    </div>
  );
};

export default DraftCard;

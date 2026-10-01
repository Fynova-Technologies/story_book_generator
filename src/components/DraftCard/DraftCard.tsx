
interface DraftCardProps {
  image: string;
  title: string;
  authorAvatar?: string;
  authorInitial?: string;
  editedAt:string;
  onContinue?: () => void;
  onDelete?: () => void;
}

const DraftCard = ({
  image,
  title,
  authorAvatar,
  authorInitial,
  editedAt,
  onContinue,
  onDelete
}: DraftCardProps) => {
  return (
    <div className="flex flex-col gap-2.5 bg-white rounded-[17px] p-2.5 shadow-sm hover:shadow-md transition-shadow duration-300">

      {/* ── IMAGE SECTION ── */}
      <div className="relative w-full aspect-[230/186] overflow-hidden rounded-[13px]">

        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover object-center transition-transform duration-500 hover:scale-105"
        />

        {/* Delete button */}
        {onDelete && (
          <button
            onClick={onDelete}
            aria-label="Delete draft"
            className="absolute top-2 right-2 w-8 h-8 rounded-full bg-red-500/80 hover:bg-red-600 flex items-center justify-center transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
        )}

      </div>

      {/* Title */}
      <h3 className="px-1.5 font-body font-bold text-[13px] leading-5 text-light-text truncate">
        {title}
      </h3>

      {/* ── FOOTER — Author + Button ── */}
      <div className="flex items-center justify-between gap-2 px-1.5 py-3 border-t border-[#DFD4C3]/50">

        {/* Author */}
        <div className="flex items-center gap-1 min-w-0">
          <div className="w-4 h-4 shrink-0 rounded-full bg-dark-primary-10 overflow-hidden flex items-center justify-center">
            {authorAvatar ? (
              <img src={authorAvatar} alt="" className="w-full h-full object-cover" />
            ) : (
              <span className="text-[8px] font-bold text-light-primary">{authorInitial}</span>
            )}
          </div>
          <span className="font-body text-[10px] text-light-outline truncate">
            {editedAt}
          </span>
        </div>

        <button
          onClick={onContinue}
          className="shrink-0 flex items-center gap-1 px-3.5 py-1.5 rounded-full bg-dark-primary-10 font-body text-[11px] text-light-text
 hover:bg-light-primary hover:text-white transition-colors duration-200"
        >
          Continue
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </button>

      </div>
    </div>
  );
};

export default DraftCard;

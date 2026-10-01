const AdventureCard = ({
  icon,
  title,
  description,
  buttonLabel,
  onButtonClick,
  isPopular = false,
}: {
  icon?: string;
  title: string;
  description: string;
  buttonLabel: string;
  onButtonClick?: () => void;
  isPopular?: boolean;
}) => {
  return (
    <div className="relative flex flex-col items-center text-center gap-3 px-6 py-9 rounded-[20px]
         bg-white transition-all duration-300 hover:shadow-lg">

      {/* ── MOST POPULAR BADGE ── */}
      {isPopular && (
        <div className="absolute -top-2.5 left-1/2 -translate-x-1/2">
          <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-dark-primary-10 text-light-primary text-[10px] font-body font-semibold whitespace-nowrap">
            {/* Sparkle icon */}
            <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 2l2.4 7.6L22 12l-7.6 2.4L12 22l-2.4-7.6L2 12l7.6-2.4z"/>
            </svg>
            MOST POPULAR
          </span>
        </div>
      )}

      {/* ── ICON ── */}
      <div className="w-[66px] h-[66px] rounded-full bg-dark-primary-10 flex items-center justify-center mb-3">
        {icon ? (
          <img src={icon} alt="" className="w-10 h-10" />
        ) : (
          <div className="w-8 h-8 rounded bg-light-primary opacity-20" />
        )}
      </div>

      {/* ── TITLE ── */}
      <h3 className="font-heading font-bold text-xl text-light-text">
        {title}
      </h3>

      {/* ── DESCRIPTION ── */}
      <p className="font-body text-base leading-[22px] text-light-outline max-w-[320px] mb-5">
        {description}
      </p>

      {/* ── BUTTON ── */}
      <button
        onClick={onButtonClick}
        className="flex items-center gap-3 px-10 py-3 rounded-full border border-light-primary text-light-primary text-base font-body font-semibold transition-all duration-200 mt-auto
          hover:bg-light-primary hover:text-white"
      >
        {buttonLabel}
        <svg
          width="16"
          height="16"
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
  );
};

export default AdventureCard;

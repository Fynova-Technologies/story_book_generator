const AdventureCard = ({
  icon,
  title,
  description,
  buttonLabel,
  onButtonClick,
  isPopular = false,
}: any) => {
  return (
    <div className={`relative flex flex-col items-center text-center gap-5 p-8 rounded-2xl
         bg-light-on-primary dark:bg-dark-bg transition-all duration-300
    `}>

      {/* ── MOST POPULAR BADGE ── */}
      {isPopular && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
          <span className="flex items-center gap-1.5 px-4 py-1 rounded-full bg-light-on-primary dark:bg-dark-bg border border-light-primary dark:border-dark-primary text-light-primary dark:text-dark-primary text-xs font-body font-semibold whitespace-nowrap">
            {/* Flame icon */}
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C12 2 7 7 7 12C7 14.76 9.24 17 12 17C14.76 17 17 14.76 17 12C17 10 15 8 15 8C15 8 14 11 12 11C10 11 10 8 10 8C10 8 8 10 8 12"/>
            </svg>
            MOST POPULAR
          </span>
        </div>
      )}

      {/* ── ICON PLACEHOLDER ── */}
      <div className="w-16 h-16 rounded-full bg-dark-primary-30 dark:bg-dark-primary-10 border border-dark-primary-30 flex items-center justify-center">
        {icon ? (
          <img src={icon} alt={title} className="w-12 h-12" />
        ) : (
          <div className="w-8 h-8 rounded bg-light-primary dark:bg-dark-primary opacity-20" />
        )}
      </div>

      {/* ── TITLE ── */}
      <h3 className="font-heading font-bold text-xl text-light-text dark:text-dark-text">
        {title}
      </h3>

      {/* ── DESCRIPTION ── */}
      <p className="font-body text-sm text-light-outline dark:text-dark-text leading-relaxed">
        {description}
      </p>

      {/* ── BUTTON ── */}
      <button
        onClick={onButtonClick}
        className={`flex items-center gap-2 px-6 py-3 rounded-full border text-sm font-body font-medium transition-all duration-200 mt-auto
          ${isPopular
            ? "border-light-primary dark:border-dark-primary text-light-primary dark:text-dark-primary hover:bg-light-primary hover:text-light-on-primary dark:hover:bg-dark-primary dark:hover:text-dark-text"
            : "border-light-outline dark:border-dark-primary-30 text-light-text dark:text-dark-text hover:border-light-primary hover:text-light-primary dark:hover:border-dark-primary dark:hover:text-dark-primary"
          }
        `}
      >
        {buttonLabel}
        <svg
          width="14"
          height="14"
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

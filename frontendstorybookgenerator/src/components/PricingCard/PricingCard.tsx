const PricingCard = ({
  planName,
  price,
  description,
  features,
  buttonLabel,
  onButtonClick,
  isPopular = false,
  isFree = false,
}: any) => {
  return (
    <div
      className={`relative flex flex-col gap-5 p-6 rounded-3xl transition-all duration-300 cursor-pointer h-120
        ${isPopular
          ? "border-2 border-light-primary dark:border-dark-primary bg-dark-primary-10 dark:bg-dark-primary-10 shadow-md hover:shadow-xl hover:scale-[1.03]"
          : " border-light-outline-secondary dark:border-dark-primary-30 bg-light-on-primary dark:bg-dark-bg shadow-sm hover:shadow-xl hover:scale-[1.03] hover:border-light-primary dark:hover:border-dark-primary"
        }
      `}
    >

      {/* ── PLAN NAME ── */}
      <p className="font-body text-sm text-light-outline dark:text-dark-text">
        {planName}
      </p>

      {/* ── PRICE ── */}
      <div>
        <h3 className={`font-heading font-bold leading-tight
          ${isFree
            ? "text-4xl text-light-text dark:text-dark-text"
            : "text-4xl text-light-text dark:text-dark-text"
          }
        `}>
          {isFree ? "Free" : price}
        </h3>
      </div>

      {/* ── DESCRIPTION ── */}
      <p className="font-body text-xs text-light-outline dark:text-dark-text">
        {description}
      </p>

      {/* ── DIVIDER ── */}
      <div className="w-full h-px bg-light-outline-secondary dark:bg-dark-primary-30 opacity-40" />

      {/* ── FEATURES LIST ── */}
      <ul className="flex flex-col gap-3 flex-1">
        {features.map((feature: string, index: number) => (
          <li key={index} className="flex items-center gap-3">
            {/* Checkmark */}
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-light-primary dark:text-dark-primary shrink-0"
            >
              <polyline points="20 6 9 17 4 12"/>
            </svg>
            <span className="font-body text-sm text-light-text dark:text-dark-text">
              {feature}
            </span>
          </li>
        ))}
      </ul>

      {/* ── BUTTON ── */}
      <button
        onClick={onButtonClick}
        className={`w-full py-3.5 rounded-3xl font-body font-semibold text-sm transition-all duration-200 hover:opacity-90 active:scale-[0.99] mt-2
          ${isPopular
            ? "bg-light-primary dark:bg-dark-primary text-light-on-primary"
            : "bg-transparent border border-light-outline dark:border-dark-primary-30 text-light-text dark:text-dark-text hover:border-light-primary hover:text-light-primary dark:hover:border-dark-primary dark:hover:text-dark-primary"
          }
        `}
      >
        {buttonLabel}
      </button>

    </div>
  );
};

export default PricingCard;

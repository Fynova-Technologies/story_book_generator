const PricingCard = ({
  planName,
  price,
  description,
  features,
  buttonLabel,
  onButtonClick,
  isPopular = false,
  isFree = false,
}: {
  planName: string;
  price: string;
  description: string;
  features: string[];
  buttonLabel: string;
  onButtonClick?: () => void;
  isPopular?: boolean;
  isFree?: boolean;
}) => {
  return (
    <div
      className={`relative flex flex-col gap-7 p-6 rounded-[32px] transition-all duration-300
        ${isPopular
          ? "border-2 border-dark-primary bg-linear-to-b from-[#B8D2FF]/50 to-[#F2F2F2]"
          : "bg-[#FEFEFD] hover:shadow-lg"
        }
      `}
    >

      <div className="flex flex-col gap-3">
        {/* ── PLAN NAME ── */}
        <p className="font-body text-[17px] leading-5 text-[#050B0A]">
          {planName}
        </p>

        {/* ── PRICE ── */}
        <h3 className={`font-heading font-bold leading-tight text-[#050B0A] ${isPopular ? "text-[34px] md:text-4xl" : "text-[34px]"}`}>
          {isFree ? "Free" : price}
        </h3>

        {/* ── DESCRIPTION ── */}
        <p className="font-body text-[15px] leading-[18px] text-[#050B0A]">
          {description}
        </p>

        {/* ── FEATURES LIST ── */}
        <ul className="flex flex-col gap-3.5 py-2 mt-1">
          {features.map((feature: string, index: number) => (
            <li key={index} className="flex items-center gap-3.5">
              {/* Checkmark */}
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={`shrink-0 ${isPopular ? "text-light-primary" : "text-[#050B0A]"}`}
              >
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              <span className="font-body text-[15px] leading-6 text-[#050B0A]">
                {feature}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* ── BUTTON ── */}
      <button
        onClick={onButtonClick}
        className={`w-full py-2 rounded-full font-body text-[15px] leading-6 transition-all duration-200 hover:opacity-90 active:scale-[0.99] mt-auto border border-b-[3px]
          ${isPopular
            ? "bg-light-primary text-white border-[#2050A3]"
            : "bg-[#F4F1EE] border-light-outline text-light-text hover:border-light-primary hover:text-light-primary"
          }
        `}
      >
        {buttonLabel}
      </button>

    </div>
  );
};

export default PricingCard;

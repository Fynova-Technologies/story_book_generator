const FAQItem = ({ 
    question, 
    answer, 
    isOpen, 
    onToggle
 }: { question: string; answer: string; isOpen: boolean; onToggle: () => void }) => {
  return (
    <div className="border-b border-light-outline last:border-b-0">

      {/* ── QUESTION ROW ── */}
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-0 md:px-5 py-4 md:py-[17px] text-left gap-4 group"
      >
        {/* Question Text */}
        <span className="font-heading font-bold text-base leading-[26px] text-light-text">
          {question}
        </span>

        {/* Icon — X when open, chevron when closed */}
        <span className="flex-shrink-0 text-light-text group-hover:text-light-primary transition-colors duration-200">
          {isOpen ? (
            // X icon when open
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          ) : (
            // Chevron down when closed
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          )}
        </span>
      </button>

      {/* ── ANSWER — shows/hides on click ── */}
      <div
        className={`overflow-hidden transition-all duration-500 ease-in-out
          ${isOpen
            ? "max-h-96 opacity-100 pb-6"
            : "max-h-0 opacity-0 pb-0"
          }
        `}
      >
        <p className="font-body text-base leading-[26px] text-light-text md:px-5">
          {answer}
        </p>
      </div>

    </div>
  );
};

export default FAQItem;

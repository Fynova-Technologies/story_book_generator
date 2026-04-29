const StyleCard = ({
  id,
  name,
  description,
  previewImage,
  isSelected,
  onSelect,
}: any) => {
  return (
    <div
      onClick={() => onSelect(id)}
     className={`flex flex-col rounded-2xl overflow-hidden cursor-pointer transition-all duration-200 border-2 p-3 bg-light-bg
        ${isSelected
          ? "border-light-primary dark:border-dark-primary shadow-lg shadow-light-primary/20 dark:shadow-dark-primary/20 scale-[1.02]"
          : "border-transparent hover:border-light-primary/40 dark:hover:border-dark-primary/40 hover:scale-[1.01]"
        }
      `}
    >
      {/* Preview Image */}
      <div className="relative w-full overflow-hidden" style={{ height: "220px" }}>
        <img
          src={previewImage}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Hover overlay */}
        <div className={`
          absolute inset-0 transition-opacity duration-300
          bg-black/10 group-hover:bg-black/0
          ${isSelected ? "bg-black/0" : ""}
        `} />

        {/* Selected checkmark */}
        {isSelected && (
          <div className="absolute top-3 left-3 w-7 h-7 rounded-full bg-light-primary dark:bg-dark-primary flex items-center justify-center shadow-md">
            <svg
              width="14" height="14" viewBox="0 0 24 24"
              fill="none" stroke="white" strokeWidth="3"
              strokeLinecap="round" strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
        )}

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-linear-to-t from-light-on-primary dark:from-dark-bg to-transparent pointer-events-none" />
      </div>

      {/* Card info */}
      <div className="px-4 py-4">
        <h3 className={`
          font-heading text-base font-bold mb-1 transition-colors duration-200
          ${isSelected
            ? "text-light-primary dark:text-dark-primary"
            : "text-light-text dark:text-dark-text"
          }
        `}>
          {name}
        </h3>
        <p className="font-body text-xs text-light-outline dark:text-dark-text opacity-70 leading-relaxed">
          {description}
        </p>
      </div>

      {/* Selected bottom accent */}
      {isSelected && (
        <div
          className="absolute bottom-0 left-0 right-0 h-0.75"
          style={{ background: "linear-gradient(90deg, #8B3A2A, #C47C5A)" }}
        />
      )}
    </div>
  );
};

export default StyleCard;

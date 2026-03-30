// 📁 src/components/ArtStyleCard/ArtStyleCard.tsx

const ArtStyleCard = ({ 
  name, 
  description, 
  image, 
  isSelected, 
  onSelect 
}: any) => {
  return (
    <div
      onClick={onSelect}
      className={`flex flex-col rounded-2xl overflow-hidden cursor-pointer transition-all duration-200 border-2 p-3 bg-light-bg
        ${isSelected
          ? "border-light-primary dark:border-dark-primary shadow-lg shadow-light-primary/20 dark:shadow-dark-primary/20 scale-[1.02]"
          : "border-transparent hover:border-light-primary/40 dark:hover:border-dark-primary/40 hover:scale-[1.01]"
        }
      `}
    >

      {/* ── IMAGE AREA ── */}
      <div className="relative w-full aspect-video overflow-hidden rounded-xl">
        {image ? (
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
        ) : null   
        }

        {/* ✅ Selected checkmark badge */}
        {isSelected && (
          <div className="absolute top-2 right-2 w-7 h-7 rounded-full bg-light-primary dark:bg-dark-primary flex items-center justify-center shadow-md">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          </div>
        )}
      </div>

      {/* ── TEXT AREA ── */}
      <div className="pt-3 pb-1 px-1">
        <h4 className="font-display font-bold text-sm text-light-text dark:text-dark-text mb-1">
          {name}
        </h4>
        <p className="font-body text-xs text-light-outline dark:text-dark-text leading-relaxed">
          {description}
        </p>
      </div>

    </div>
  );
};

export default ArtStyleCard;

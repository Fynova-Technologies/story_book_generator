// Figma "card" (story style / art style): white, 16px radius, inset image, 2px blue border + check when selected.
const StyleCard = ({
  id = "",
  name,
  description,
  previewImage,
  isSelected,
  onSelect,
  imageAspect = "aspect-[3/2]",
}: {
  id?: string;
  name: string;
  description: string;
  previewImage: string;
  isSelected: boolean;
  onSelect: (id: string) => void;
  imageAspect?: string;
}) => {
  return (
    <button
      type="button"
      onClick={() => onSelect(id)}
      aria-pressed={!!isSelected}
      className={`flex flex-col gap-4 p-1 pb-5 text-left rounded-2xl bg-white border-2 shadow-[0_3px_8px_rgba(0,0,0,0.24)] transition-all duration-200
        ${isSelected
          ? "border-light-primary"
          : "border-transparent hover:-translate-y-0.5 hover:shadow-[0_6px_14px_rgba(0,0,0,0.24)]"
        }
      `}
    >
      {/* Preview Image */}
      <div className={`relative w-full ${imageAspect} overflow-hidden rounded-2xl`}>
        <img
          src={previewImage}
          alt=""
          className="w-full h-full object-cover"
        />

        {/* Selected check */}
        {isSelected && (
          <div className="absolute top-3 right-3 w-7 h-7 rounded-full bg-light-primary ring-2 ring-white flex items-center justify-center shadow-md">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
        )}
      </div>

      {/* Card info */}
      <div className="px-4 space-y-1.5">
        <h3 className="font-body text-base font-bold text-light-text">
          {name}
        </h3>
        <p className="font-body text-xs text-light-text leading-5">
          {description}
        </p>
      </div>
    </button>
  );
};

export default StyleCard;

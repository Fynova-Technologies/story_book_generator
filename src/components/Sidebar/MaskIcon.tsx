// Paints a one-colour PNG icon in the current text colour, so active/inactive items can tint it.
const MaskIcon = ({ src, className = "w-4 h-4" }: { src: string; className?: string }) => (
  <span
    aria-hidden
    className={`shrink-0 bg-current ${className}`}
    style={{ mask: `url(${src}) center / contain no-repeat`, WebkitMask: `url(${src}) center / contain no-repeat` }}
  />
);

export default MaskIcon;

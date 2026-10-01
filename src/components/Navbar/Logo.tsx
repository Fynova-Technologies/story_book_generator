import { Link } from "react-router-dom";

// Brand mark until the real logo exists (D7): a book icon plus the dashboard's brand name.
const Logo = ({ className = "", to = "/" }: { className?: string; to?: string }) => (
  <Link to={to} className={`flex items-center gap-2 font-heading font-bold text-lg md:text-xl whitespace-nowrap ${className}`}>
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M2 4h6a4 4 0 0 1 4 4v13a3 3 0 0 0-3-3H2z" />
      <path d="M22 4h-6a4 4 0 0 0-4 4v13a3 3 0 0 1 3-3h7z" />
    </svg>
    Story book AI
  </Link>
);

export default Logo;

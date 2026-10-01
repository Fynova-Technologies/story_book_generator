import { useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import Logo from "./Logo";

const navLinks = [
  { name: "Templates", path: "/templates" },
  { name: "How it Works", path: "/how-it-works" },
  { name: "Samples", path: "/samples" },
  { name: "Pricing", path: "/pricing" },
  { name: "Contact", path: "/contact" },
];

const Navbar = ({
  bglight = false,
}: { bglight?: boolean }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const loggedIn = useSelector((state: RootState) => state.auth.status);
  const startNowClass = `font-body font-medium text-[15px] text-light-text bg-light-bg px-4 py-1.5 rounded-[10px] border shadow-sm transition-all duration-200 hover:opacity-90 ${bglight ? "border-light-text" : "border-white"}`;

  return (
    <nav
      className={`left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-7xl rounded-[40px] ${bglight?"absolute top-0":"fixed top-4 md:top-8 glass-dark shadow-lg"} `}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-[74px]">

          {/* ── LOGO ── */}
          <Logo className={bglight ? "text-light-text" : "text-white"} />

          {/* ── NAV LINKS (Desktop) ── */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`font-body font-semibold px-2 lg:px-3 py-1 text-sm rounded-md transition-colors duration-200 ${bglight?"text-light-text hover:bg-black/5"
                  :"text-white hover:bg-white/10"}`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* ── RIGHT BUTTONS (Desktop) ── */}
          <div className="hidden md:flex items-center gap-3">
            {loggedIn ? (
            <Link
              to="/dashboard"
              className={startNowClass}
            >
              Dashboard
            </Link>
            ) : (
            <>
            <Link
              to="/signup"
              className={`font-body font-medium text-[15px] px-4 py-1.5 rounded-[10px] border border-black/20 transition-colors duration-200 ${bglight?"text-light-text hover:bg-black/5":"text-white hover:bg-white/10"}`}
            >
              Sign up
            </Link>

            <Link
              to="/signup"
              className={startNowClass}
            >
              Start now
            </Link>
            </>
            )}
          </div>

          {/* ── HAMBURGER (Mobile) ── */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menu"
            className={`md:hidden ${bglight?"text-light-text":"text-white"} p-2 rounded-md hover:bg-white/10 transition-colors`}
          >
            {menuOpen ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="6" x2="21" y2="6"/>
                <line x1="3" y1="12" x2="21" y2="12"/>
                <line x1="3" y1="18" x2="21" y2="18"/>
              </svg>
            )}
          </button>

        </div>
      </div>

      {/* ── MOBILE MENU ── */}
      {menuOpen && (
        <div
          className="md:hidden px-4 pb-4 pt-2 flex flex-col gap-1 rounded-b-[32px]"
          style={{
            background: "rgba(10, 15, 30, 0.95)",
            borderTop: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              onClick={() => setMenuOpen(false)}
              className="text-sm text-white/80 hover:text-white px-3 py-2 rounded-md hover:bg-white/10 transition-colors"
            >
              {link.name}
            </Link>
          ))}

          <div className="flex gap-3 mt-3 pt-3 border-t border-white/10">
            {loggedIn ? (
            <Link
              to="/dashboard"
              className="flex-1 font-body text-center text-sm font-semibold text-dark-bg bg-white px-4 py-2 rounded-lg hover:opacity-90 transition-colors"
            >
              Dashboard
            </Link>
            ) : (
            <>
            <Link
              to="/signup"
              className="flex-1 font-body font-bold text-center text-sm text-white border-white/20 px-4 py-2 rounded-lg hover:bg-white/10 transition-colors"
            >
              Sign up
            </Link>
            <Link
              to="/signup"
              className="flex-1 font-body text-center text-sm font-semibold text-dark-bg bg-white px-4 py-2 rounded-lg hover:opacity-90 transition-colors"
            >
              Start now
            </Link>
            </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

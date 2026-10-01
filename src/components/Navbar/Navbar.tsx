import { useState, type PointerEvent } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import Logo from "./Logo";
import LiquidGlass from "./LiquidGlass";

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
  // True once the WebGPU glass is drawing; the CSS rim and sheen then step aside.
  const [gpu, setGpu] = useState(false);
  const loggedIn = useSelector((state: RootState) => state.auth.status);
  const startNowClass = "liquid-chip font-body font-semibold text-[15px] text-light-text px-4 py-1.5 rounded-full transition-transform duration-200 hover:scale-[1.04] active:scale-[0.98]";
  const text = bglight ? "text-light-text" : "text-white";
  const hover = bglight ? "hover:bg-white/50" : "hover:bg-white/15";

  // The glass sheen follows the pointer.
  const moveSheen = (e: PointerEvent<HTMLElement>) => {
    const box = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--mx", `${((e.clientX - box.left) / box.width) * 100}%`);
    e.currentTarget.style.setProperty("--my", `${((e.clientY - box.top) / box.height) * 100}%`);
  };

  return (
    <nav
      onPointerMove={moveSheen}
      className={`liquid-glass ${gpu ? "liquid-glass-gpu" : ""} left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-7xl rounded-[40px] ${bglight ? "liquid-glass-light absolute top-3" : "fixed top-4 md:top-6"}`}
    >
      <LiquidGlass tone={bglight ? "light" : "dark"} onActive={setGpu} />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-[74px]">

          {/* ── LOGO ── */}
          <Logo className={bglight ? "text-light-text" : "text-white"} />

          {/* ── NAV LINKS (Desktop) ── */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`font-body font-semibold px-2 lg:px-3 py-1.5 text-sm rounded-full transition-colors duration-200 ${text} ${hover}`}
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
              className={`font-body font-medium text-[15px] px-4 py-1.5 rounded-full border transition-colors duration-200 ${text} ${hover} ${bglight ? "border-black/15" : "border-white/40"}`}
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
            className={`md:hidden ${text} ${hover} p-2 rounded-full transition-colors`}
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
          className={`relative md:hidden px-4 pb-4 pt-2 flex flex-col gap-1 border-t ${bglight ? "border-black/10" : "border-white/20"}`}
        >
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              onClick={() => setMenuOpen(false)}
              className={`text-sm font-semibold ${text} px-3 py-2 rounded-full ${hover} transition-colors`}
            >
              {link.name}
            </Link>
          ))}

          <div className={`flex gap-3 mt-3 pt-3 border-t ${bglight ? "border-black/10" : "border-white/20"}`}>
            {loggedIn ? (
            <Link
              to="/dashboard"
              className="liquid-chip flex-1 font-body text-center text-sm font-semibold text-light-text px-4 py-2 rounded-full"
            >
              Dashboard
            </Link>
            ) : (
            <>
            <Link
              to="/signup"
              className={`flex-1 font-body font-bold text-center text-sm ${text} border ${bglight ? "border-black/15" : "border-white/40"} px-4 py-2 rounded-full ${hover} transition-colors`}
            >
              Sign up
            </Link>
            <Link
              to="/signup"
              className="liquid-chip flex-1 font-body text-center text-sm font-semibold text-light-text px-4 py-2 rounded-full"
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

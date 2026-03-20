import { useState } from "react";
import { Link } from "react-router-dom";

const navLinks = [
  { name: "Templates", path: "/templates" },
  { name: "How it Works", path: "/how-it-works" },
  { name: "Samples", path: "/samples" },
  { name: "Pricing", path: "/pricing" },
  { name: "About", path: "/about" },
  { name: "Contact", path: "/contact" },
];

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav
      className="fixed top-7 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-6xl rounded-4xl"
      style={{
        background: "rgba(10, 15, 30, 0.45)",
        backdropFilter: "blur(5px)",
        WebkitBackdropFilter: "blur(5px)",
        border: "1px solid rgba(255,255,255,0.08)",
      }}
>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">

          {/* ── LOGO ── */}
          <div
            className="font-hading flex items-center gap-2 text-white font-bold text-lg tracking-tight"
          >
            Logo
          </div>

          {/* ── NAV LINKS (Desktop) ── */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="font-body px-3 py-1.5 text-sm text-white hover:text-white transition-colors duration-200 rounded-md hover:bg-white/10"
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* ── RIGHT BUTTONS (Desktop) ── */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              to="/signup"
              className="text-sm text-white hover:text-white transition-colors duration-200 px-3 py-1.5"
            >
              Sign up
            </Link>

            <Link
              to="/start"
              className="text-sm font-semibold text-dark-bg px-4 py-1.5 rounded-lg transition-all duration-200 hover:opacity-90 hover:shadow-lg"
              style={{ background: "#FFFFFF" }}
            >
              Start now
            </Link>
          </div>

          {/* ── HAMBURGER (Mobile) ── */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden text-white p-2 rounded-md hover:bg-white/10 transition-colors"
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
          className="md:hidden px-4 pb-4 pt-2 flex flex-col gap-1"
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
            <Link
              to="/signup"
              className="flex-1 text-center text-sm text-white/80 border border-white/20 px-4 py-2 rounded-lg hover:bg-white/10 transition-colors"
            >
              Sign up
            </Link>
            <Link
              to="/start"
              className="flex-1 text-center text-sm font-semibold text-dark-bg bg-white px-4 py-2 rounded-lg hover:opacity-90 transition-colors"
            >
              Start now
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

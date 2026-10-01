import { useState } from "react";
import { Link, Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar/Sidebar";

const DashboardLayout: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const close = () => setMenuOpen(false);

  return (
    <div className="min-h-screen">
      <Sidebar open={menuOpen} onClose={close} />

      {/* Below lg the sidebar is a drawer */}
      {menuOpen && <div className="fixed inset-0 z-40 bg-black/30 lg:hidden" onClick={close} aria-hidden />}
      <header className="lg:hidden sticky top-0 z-30 bg-paper flex items-center gap-3 px-4 h-14 border-b border-black/5">
        <button
          onClick={() => setMenuOpen(true)}
          aria-label="Open menu"
          aria-expanded={menuOpen}
          className="w-10 h-10 -ml-2 rounded-full flex items-center justify-center text-light-text hover:bg-light-panel"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M3 6h18M3 12h18M3 18h18" />
          </svg>
        </button>
        <Link to="/dashboard" className="font-heading text-base font-bold text-light-primary">Story book AI</Link>
      </header>

      <main className="min-w-0 lg:pl-[300px]">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;

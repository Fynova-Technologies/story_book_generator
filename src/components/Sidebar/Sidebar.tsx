import { NavLink, Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { STORY_COST, useCredits } from "../../services/credits";
import { userInitial, userName } from "./user";
import MaskIcon from "./MaskIcon";
const bookImg = "/assets/icons/Sidebar/book.png";
const dashboardImg = "/assets/icons/Sidebar/Dashboard.png";
const heart = "/assets/icons/Sidebar/Heart.png";
const templete = "/assets/icons/Sidebar/Templete.png";
const user = "/assets/icons/Sidebar/User.png";
const diamond = "/assets/icons/Sidebar/Diamond.png";
const setting = "/assets/icons/Sidebar/Setting.png";

interface NavItem {
  label: string;
  path: string;
  icon: string
}

const navItems: NavItem[] = [
  { label: "Dashboard", path: "/dashboard", icon: dashboardImg },
  { label: "My Collection", path: "/dashboard/collection", icon: heart },
  { label: "Templates", path: "/dashboard/templates", icon: templete },
  { label: "Sample Gallery", path: "/dashboard/sample-gallery", icon: user },
  { label: "How it Works", path: "/dashboard/how-it-works", icon: user },
];

interface SidebarProps {
  open?: boolean;
  onClose?: () => void;
}

const Sidebar = ({ open = false, onClose }: SidebarProps) => {
  const navigate = useNavigate()
  const user = useSelector((state: RootState) => state.auth.userData);
  const { credits } = useCredits();
  return (
    <aside
      className={`bg-paper fixed top-0 left-0 h-dvh w-[300px] max-w-[85vw] border-r border-black/5 flex flex-col gap-3 px-5 py-6 overflow-y-auto z-50
        transition-transform duration-200 lg:translate-x-0 ${open ? "translate-x-0 shadow-2xl lg:shadow-none" : "-translate-x-full"}`}
    >

      {/* Brand */}
      <Link to="/dashboard" onClick={onClose} className="flex items-center gap-2.5">
        <span className="w-10 h-10 rounded-full bg-dark-primary-10 flex items-center justify-center">
          <img src={bookImg} alt="" className="w-6" />
        </span>
        <span className="font-heading text-base font-bold text-light-primary leading-tight">Story book AI</span>
      </Link>

      {/* Navigation */}
      <nav className="flex-1 py-5 flex flex-col gap-1.5">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end
            onClick={onClose}
            className={({ isActive }: { isActive: boolean }) =>
              `flex items-center gap-3 h-10 px-3.5 rounded-full font-body text-[13px] font-semibold transition-colors ${
                isActive
                  ? "bg-dark-primary-10 text-light-primary"
                  : "text-light-outline hover:bg-light-panel hover:text-light-text"
              }`
            }
          >
            <MaskIcon src={item.icon} />
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* Credits Card */}
      <div className="rounded-2xl bg-blue-50 border border-blue-100 p-4">
        <p className="font-body text-[10px] font-semibold text-black uppercase tracking-wide">Credits</p>
        <p className="font-body text-xl font-semibold text-slate-800 mt-1">{credits ?? "…"}</p>
        <p className="font-body text-[11px] font-semibold text-gray-600 leading-snug mt-1">
          {credits === null ? "Checking your credits…" : `≈ ${Math.floor(credits / STORY_COST)} ${Math.floor(credits / STORY_COST) === 1 ? "story" : "stories"}`}
          <br />
          {STORY_COST} credits per story
        </p>
      </div>

      {/* Premium Upgrade Card */}
      <div className="relative overflow-hidden rounded-[13px] bg-blue-50 p-4">
        <span aria-hidden className="absolute -top-4 -right-4 w-16 h-16 rounded-full bg-light-primary/20 blur-lg" />
        <div className="relative flex items-center gap-2 mb-1.5">
          <img src={diamond} alt="" className="w-4 h-4" />
          <p className="font-heading text-xs font-bold text-light-primary">Premium Plan</p>
        </div>
        <p className="relative font-body text-xs text-gray-600 leading-snug mb-3">
          Get more credits to make more stories.
        </p>
        <button
          onClick={() => { onClose?.(); navigate("/pricing"); }}
          className="relative w-full h-8 rounded-[13px] bg-light-primary text-white font-body text-[11px] font-bold shadow-md hover:opacity-90 transition-opacity">
          Upgrade Now
        </button>
      </div>

      {/* User Profile Row */}
      <div className="flex items-center gap-2 px-1.5 py-3">
        <div className="w-8 h-8 rounded-full bg-dark-primary-10 border-2 border-white shadow flex-shrink-0 flex items-center justify-center font-body text-xs font-bold text-light-primary">
          {userInitial(user)}
        </div>
        <div className="flex-1 min-w-0 font-body">
          <p className="text-xs font-bold text-light-text truncate">{userName(user)}</p>
          <p className="text-[10px] text-light-outline truncate">{user?.email}</p>
        </div>
        <Link to="/account" onClick={onClose} aria-label="Account settings" className="flex-shrink-0 p-1 hover:opacity-70 transition-opacity">
          <img src={setting} alt="" className="w-4 h-4"/>
        </Link>
      </div>
    </aside>
  );
};

export default Sidebar;

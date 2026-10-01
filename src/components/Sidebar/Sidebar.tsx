import { NavLink,Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { STORY_COST, useCredits } from "../../services/credits";
import { userInitial, userName } from "./user";
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
  {
    label: "Dashboard",
    path: "/dashboard",
    icon: dashboardImg
  },
  {
    label: "My Collection",
    path: "/dashboard/collection",
    icon: heart
  },
  {
    label: "Templates",
    path: "/dashboard/templates",
    icon: templete
  },
  {
    label: "Sample Gallery",
    path: "/dashboard/sample-gallery",
    icon: user
  },
  {
    label: "How it Works",
    path: "/dashboard/how-it-works",
    icon:user
  },
];

const Sidebar = () => {
  const navigate = useNavigate()
  const user = useSelector((state: RootState) => state.auth.userData);
  const { credits } = useCredits();
  return (
    <aside className="fixed top-0 left-0 h-screen w-[300px] bg-light-bg border-r border-[#E2DDD5] flex flex-col z-50">

      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 py-5 border-b border-[#E2DDD5]">
        
        <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold">
          <img src={bookImg} alt="" />
        </div>
        <p className="font-heading text-sm font-semibold text-light-primary leading-tight">Story book AI</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 flex flex-col gap-0.5 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }: { isActive: boolean }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-3xl text-sm font-medium transition-all duration-150 group ${
                isActive
                  ? "bg-[#EAE8FF] text-[#4F6AF5]"
                  : "text-[#5C5449] hover:bg-[#ECEAE4] hover:text-[#1A1A2E]"
              }`
            }
          >
            {({ isActive }: { isActive: boolean }) => (
              <>
                <span
                  className={`flex-shrink-0 ${
                    isActive
                      ? "text-light-primary font-body"
                      : "text-light-text group-hover:text-[#5C5449] font-body"
                  }`}
                >
                  <div className="w-4 h-4 rounded">
                    <img src={item.icon} alt="" />
                  </div>
                </span>
                {item.label}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Credits Card */}
      <div className="mx-3 mb-3 rounded-xl bg-light-on-primary border border-[#E2DDD5] p-4">
        <p className="font-body text-[10px] text-light-text uppercase tracking-widest mb-1">Credits</p>
        <p className="font-heading text-2xl font-bold text-light-primary leading-tight">{credits ?? "…"}</p>
        {credits !== null && (
          <p className="font-body text-xs text-light-text">≈ {Math.floor(credits / STORY_COST)} stories</p>
        )}
      </div>

      {/* Premium Upgrade Card */}
      <div className="mx-3 mb-3 rounded-xl bg-gradient-to-br from-[#E8F3FF] to-[#7C3AED] p-4">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-4 h-4 rounded">
            <img src={diamond} alt="" />
          </div>
          <p className="text-md text-light-primary font-heading font-semibold">Premium Plan</p>
        </div>
        <p className="font-body text-sm text-light-text mb-3 leading-snug">
          Get more credits to make more stories.
        </p>
        <button 
          onClick={()=>navigate("/pricing")}
          className="w-full bg-white text-[#4F6AF5] text-xs font-semibold py-2 rounded-lg hover:bg-white/90 transition-colors">
          Upgrade Now
        </button>
      </div>

      {/* User Profile Row */}
      <div className="flex items-center gap-2.5 px-4 py-3 border-t border-[#E2DDD5]">
        <div className="w-8 h-8 rounded-full bg-[#D4C5A9] flex-shrink-0 flex items-center justify-center text-xs font-semibold text-[#1A1A2E]">
          {userInitial(user)}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-[#1A1A2E] truncate">{userName(user)}</p>
          <p className="text-[10px] text-[#9E9587] truncate">{user?.email}</p>
        </div>
        <Link to="/account" aria-label="Account settings" className="flex-shrink-0 hover:opacity-80 transition-opacity">
          <img src={setting} alt="" className="w-4 h-4"/>
        </Link>
      </div>
    </aside>
  );
};

export default Sidebar;

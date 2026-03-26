import { NavLink } from "react-router-dom";
import bookImg from "../../assets/icons/Sidebar/book.png"
import dashboardImg from "../../assets/icons/Sidebar/Dashboard.png"
import heart from "../../assets/icons/Sidebar/Heart.png"
import templete from "../../assets/icons/Sidebar/Templete.png"
import user from "../../assets/icons/Sidebar/User.png"
import diamond from "../../assets/icons/Sidebar/Diamond.png"
import setting from "../../assets/icons/Sidebar/Setting.png"

interface NavItem {
  label: string;
  path: string;
  icon:any
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
    path: "/templates",
    icon: templete
  },
  {
    label: "Sample Gallery",
    path: "/dashboard/sample-gallery",
    icon: user
  },
  {
    label: "How it Works",
    path: "/dashboard/videosection",
    icon:user
  },
];

const Sidebar = () => {
  return (
    <aside className="fixed top-0 left-0 h-screen w-[300px] bg-light-bg border-r border-[#E2DDD5] flex flex-col z-50">

      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 py-5 border-b border-[#E2DDD5]">
        
        <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold">
          <img src={bookImg} alt="" />
        </div>
        <div>
          <p className="font-heading text-sm font-semibold text-light-primary leading-tight">Story book AI</p>
          <p className="font-body text-[10px] text-light-text uppercase tracking-widest">Free Plan</p>
        </div>
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

      {/* Premium Upgrade Card */}
      <div className="mx-3 mb-3 rounded-xl bg-gradient-to-br from-[#E8F3FF] to-[#7C3AED] p-4">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-4 h-4 rounded">
            <img src={diamond} alt="" />
          </div>
          <p className="text-md text-light-primary font-heading font-semibold">Premium Plan</p>
        </div>
        <p className="font-body text-sm text-light-text mb-3 leading-snug">
          Unlock unlimited stories and magical AI voices.
        </p>
        <button className="w-full bg-white text-[#4F6AF5] text-xs font-semibold py-2 rounded-lg hover:bg-white/90 transition-colors">
          Upgrade Now
        </button>
      </div>

      {/* User Profile Row */}
      <div className="flex items-center gap-2.5 px-4 py-3 border-t border-[#E2DDD5]">
        {/* Avatar — replace inner div with <img src={avatarUrl} alt="avatar" /> */}
        <div className="w-8 h-8 rounded-full bg-[#D4C5A9] flex-shrink-0 overflow-hidden" />
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-[#1A1A2E] truncate">Sarah Storyteller</p>
          <p className="text-[10px] text-[#9E9587] truncate">sarah@example.com</p>
        </div>
        <button className="text-[#9E9587] hover:text-[#5C5449] transition-colors flex-shrink-0">
          <div className="w-4 h-4 rounded-full">
            <img src={setting} alt="S" />
          </div>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;

import MaskIcon from "../Sidebar/MaskIcon";
const ProfileIcon = "/assets/icons/Account/Profile.png";
const SecurityIcon = "/assets/icons/Account/Security.png";
const NotificationIcon = "/assets/icons/Account/Notification.png";
const UsageIcon = "/assets/icons/Account/Usage.png";
const SubscriptionIcon = "/assets/icons/Account/Subscription.png";
const LogoutIcon = "/assets/icons/Account/Logout.png";

export type Section = "profile" | "password" | "notifications" | "usage" | "billing" | "logout";

type NavItem = {
  id: Section;
  label: string;
  icon: string;
  danger?: boolean;
};

const navItems: NavItem[] = [
  {
    id: "profile",
    label: "Profile Information",
    icon: ProfileIcon,
  },
  {
    id: "password",
    label: "Password & Security",
    icon: SecurityIcon,
  },
  {
    id: "notifications",
    label: "Notifications",
    icon: NotificationIcon,
  },
  {
    id: "usage",
    label: "Usage",
    icon: UsageIcon,
  },
  {
    id: "billing",
    label: "Credits & Billing",
    icon: SubscriptionIcon,
  },
  {
    id: "logout",
    label: "Log Out",
    danger: true,
    icon: LogoutIcon,
  },
];

const AccountNav = ({ 
  activeSection, 
  onSectionChange 
}: { activeSection: Section; onSectionChange: (id: Section) => void }) => {
  return (
    <aside className="w-full lg:w-[316px] flex-shrink-0">
      <div className="bg-white rounded-3xl border border-[#F2F0F4] shadow-sm overflow-hidden">

        {/* Title */}
        <div className="px-6 py-6 border-b border-[#F2F0F4]">
          <h2 className="font-heading font-bold text-xl text-light-text">
            Settings
          </h2>
          <p className="font-body text-sm text-light-outline mt-1">
            Manage your personal account
          </p>
        </div>

        {/* Nav Items */}
        <nav className="flex flex-col gap-3 p-2">
          {navItems.map((item) => (
            <div key={item.id} className="contents">
              {item.danger && <div className="h-px bg-[#F2F0F4]" />}
              <button
                onClick={() => onSectionChange(item.id)}
                aria-current={activeSection === item.id ? "page" : undefined}
                className={`flex items-center gap-3 h-12 px-4 rounded-lg text-left font-body text-sm transition-colors w-full
                  ${item.danger
                    ? "text-red-500 font-medium hover:bg-red-50"
                    : activeSection === item.id
                      ? "bg-dark-primary-10 text-dark-primary font-semibold"
                      : "text-light-outline hover:bg-light-panel hover:text-light-text"
                  }
                `}
              >
                <MaskIcon src={item.icon} className="w-[18px] h-[18px]" />
                {item.label}
              </button>
            </div>
          ))}
        </nav>

      </div>
    </aside>
  );
};

export default AccountNav;

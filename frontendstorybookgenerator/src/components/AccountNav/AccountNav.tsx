import ProfileIcon from "../../assets/icons/Account/Profile.png"
import SecurityIcon from "../../assets/icons/Account/Security.png"
import NotificationIcon from "../../assets/icons/Account/Notification.png"
import UsageIcon from "../../assets/icons/Account/Usage.png"
import SubscriptionIcon from "../../assets/icons/Account/Subscription.png"
import LogoutIcon from "../../assets/icons/Account/Logout.png"

type NavItem = {
  id: string;
  label: string;
  icon: any;
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
    label: "Subscription & Billing",
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
}: any) => {
  return (
    <aside className="w-full  lg:w-80 flex-shrink-0">
      <div className="bg-light-on-primary dark:bg-dark-bg rounded-3xl p-4  border-light-outline-secondary
       dark:border-dark-primary-30">

        {/* Title */}
        <div className="mb-4 px-2">
          <h2 className="font-heading font-bold text-xl text-light-text dark:text-dark-text">
            Settings
          </h2>
          <p className="font-body text-xs text-light-text dark:text-dark-text opacity-60 mt-0.5">
            Manage your personal account
          </p>
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-light-outline-secondary dark:bg-dark-primary-30 opacity-40 my-8" />

        {/* Nav Items */}
        <nav className="flex flex-col gap-5">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onSectionChange(item.id)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all duration-200 w-full
                ${item.danger
                  ? "text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10"
                  : activeSection === item.id
                    ? "bg-dark-primary-10 dark:bg-dark-primary-10 text-light-primary dark:text-dark-primary font-semibold"
                    : "text-light-outline dark:text-dark-text hover:bg-light-bg dark:hover:bg-dark-primary-10 hover:text-light-text dark:hover:text-dark-text"
                }
              `}
            >
              <span className="shrink-0">
                <img src={item.icon} alt="" className="w-4 h-4"/>
              </span>
              <span className="font-body text-sm">{item.label}</span>
            </button>
          ))}
        </nav>

      </div>
    </aside>
  );
};

export default AccountNav;

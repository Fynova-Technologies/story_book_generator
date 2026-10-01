import { useState } from "react";
import AccountNav, { Section } from "../components/AccountNav/AccountNav";
import ProfileInfoSection from "../section/AccountSettings/ProfileInfoSection";
import PasswordSecuritySection from "../section/AccountSettings/PasswordSecuritySection";
import NotificationSection from "../section/AccountSettings/NotificationSection";
import UsageSection from "../section/AccountSettings/UsageSection";
import SubscriptionSection from "../section/AccountSettings/SubscriptionSection";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { clearAuth } from "../store/slices/authSlice";
import { resetWizard } from "../store/slices/storyWizardSlice";
import { RootState } from "../store/store";
import { userInitial } from "../components/Sidebar/user";
import { logout } from "../services/authService";



const AccountSettings = () => {
  const [activeSection, setActiveSection] = useState<Section>("profile");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.auth.userData);

  const renderSection = () => {
    switch (activeSection) {
      case "profile":       
        return <ProfileInfoSection />;
      case "password":      
        return <PasswordSecuritySection />;
      case "notifications": 
        return <NotificationSection />;
      case "usage":         
        return <UsageSection />;
      case "billing":       
        return <SubscriptionSection />;
      default:              
        return <ProfileInfoSection />;
    }
  };

  return (
    <div className="min-h-screen bg-light-bg dark:bg-dark-bg">
      <header className="max-w-8xl mx-auto bg-light-bg dark:bg-dark-bg border-b border-light-outline-secondary dark:border-dark-primary-30">
      <div className="w-full px-6 md:px-10 h-14 flex items-center justify-between">
 
        {/* ── LEFT — Logo ── */}
        <div className="flex items-center gap-2">
          {/* Logo Text */}
          <Link to="/dashboard" className="relative">
            <span
              className="text-xl font-bold text-light-text dark:text-dark-text"
              style={{ fontFamily: "'Pacifico', cursive" }}
            >
              Logo
            </span>

          </Link>
        </div>
 
        {/* ── RIGHT — Create Story + Avatar ── */}
        <div className="flex items-center gap-3">
 
          {/* Create Story Button */}
          <button
            onClick={() => { dispatch(resetWizard()); navigate("/create-story"); }}
            className="px-4 py-2 rounded-lg bg-light-primary dark:bg-dark-primary text-light-on-primary font-body font-semibold text-sm hover:opacity-90 active:scale-[0.99] transition-all duration-200">
            Create Story
          </button>
 
          {/* Avatar */}
          <div className="w-8 h-8 rounded-full border-2 border-light-outline-secondary dark:border-dark-primary-30 bg-dark-primary-10 flex items-center justify-center font-body text-sm font-semibold text-light-primary dark:text-dark-primary">
            {userInitial(user)}
          </div>

        </div>
      </div>
    </header>
      <div className="max-w-8xl mx-auto px-6 md:px-10 py-10">
        <div className="flex flex-col lg:flex-row gap-6 items-start">

          {/* ── LEFT — Account Nav ── */}
          <AccountNav
            activeSection={activeSection}
            onSectionChange={async (id: Section) => {
              if (id === "logout") {
                try {
                  await logout();
                } catch (error) {
                  console.error("Logout failed:", error);
                }
                navigate("/")
                dispatch(clearAuth());
                return
              }
              setActiveSection(id)
            }}
          />

          {/* ── RIGHT — Active Section ── */}
          <div className="flex-1 w-full">
            {renderSection()}
          </div>

        </div>
      </div>
    </div>
  );
};

export default AccountSettings;

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
    <div className="min-h-screen px-4 sm:px-10 pb-20">
      <header className="flex items-center justify-between gap-4 h-[74px] px-1 sm:px-5 border-b border-light-outline/50">

        {/* ── LEFT — Brand (real logo pending, D7) ── */}
        <Link to="/dashboard" className="flex items-center gap-2.5">
          <span className="w-10 h-10 rounded-full bg-dark-primary-10 flex items-center justify-center">
            <img src="/assets/icons/Sidebar/book.png" alt="" className="w-6" />
          </span>
          <span className="hidden sm:inline font-heading text-base font-bold text-light-primary leading-tight">Story book AI</span>
        </Link>

        {/* ── RIGHT — Create Story + Avatar ── */}
        <div className="flex items-center gap-4 sm:gap-8">
          <button
            onClick={() => { dispatch(resetWizard()); navigate("/create-story"); }}
            className="h-[42px] px-5 rounded-lg bg-light-primary text-white font-body font-bold text-sm shadow-md hover:opacity-90 active:scale-[0.99] transition-all duration-200">
            Create Story
          </button>
          <div className="w-[41px] h-[41px] rounded-full border-2 border-white shadow bg-dark-primary-10 flex items-center justify-center font-body text-sm font-bold text-light-primary">
            {userInitial(user)}
          </div>
        </div>
      </header>

      <div className="pt-8 sm:pt-12">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start">

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
          <div className="flex-1 min-w-0 w-full">
            {renderSection()}
          </div>

        </div>
      </div>
    </div>
  );
};

export default AccountSettings;

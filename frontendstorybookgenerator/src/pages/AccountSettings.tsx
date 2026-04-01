import { useState } from "react";
import AccountNav from "../components/AccountNav/AccountNav";
import ProfileInfoSection from "../section/AccountSettings/ProfileInfoSection";
import PasswordSecuritySection from "../section/AccountSettings/PasswordSecuritySection";
import NotificationSection from "../section/AccountSettings/NotificationSection";
import UsageSection from "../section/AccountSettings/UsageSection";
import SubscriptionSection from "../section/AccountSettings/SubscriptionSection";
import userAvatar from "../assets/images/sampleavatar.png"
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../store/slices/authSlice";


type Section = "profile" | "password" | "notifications" | "usage" | "billing" | "logout";

const AccountSettings = () => {
  const [activeSection, setActiveSection] = useState<Section>("profile");
  const dispatch = useDispatch();
  const navigate = useNavigate();

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
          <div className="relative">
            <span
              className="text-xl font-bold text-light-text dark:text-dark-text"
              style={{ fontFamily: "'Pacifico', cursive" }}
            >
              Logo
            </span>

          </div>
        </div>
 
        {/* ── RIGHT — Create Story + Avatar ── */}
        <div className="flex items-center gap-3">
 
          {/* Create Story Button */}
          <button className="px-4 py-2 rounded-lg bg-light-primary dark:bg-dark-primary text-light-on-primary font-body font-semibold text-sm hover:opacity-90 active:scale-[0.99] transition-all duration-200">
            Create Story
          </button>
 
          {/* Avatar + Dropdown Arrow */}
          <button className="flex items-center gap-1.5 hover:opacity-80 transition-all duration-200">
 
            {/* Avatar */}
            <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-light-outline-secondary dark:border-dark-primary-30">
              {userAvatar ? (
                <img
                  src={userAvatar}
                  alt="User avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                // Placeholder avatar
                <div className="w-full h-full bg-dark-primary-10 flex items-center justify-center">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-light-primary dark:text-dark-primary">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                </div>
              )}
            </div>
 
            {/* Dropdown chevron */}
            {/* <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-light-outline dark:text-dark-text"
            >
              <polyline points="6 9 12 15 18 9"/>
            </svg>
  */}
          </button>
 
        </div>
      </div>
    </header>
      <div className="max-w-8xl mx-auto px-6 md:px-10 py-10">
        <div className="flex flex-col lg:flex-row gap-6 items-start">

          {/* ── LEFT — Account Nav ── */}
          <AccountNav
            activeSection={activeSection}
            onSectionChange={(id: Section) => {
              if (id === "logout") {
                dispatch(logout())
                navigate("/")
                console.log("Logout clicked")
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

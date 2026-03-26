// 📁 src/pages/AccountSettings/sections/NotificationPreferences.tsx

import { useState } from "react";

const notifications = [
  {
    id: "story_generated",
    title: "New Story Generated",
    description: "Receive an email when your AI story is ready.",
    defaultChecked: true,
  },
  {
    id: "product_updates",
    title: "Product Updates",
    description: "News about new features and improvements.",
    defaultChecked: true,
  },
  {
    id: "marketing",
    title: "Marketing & Offers",
    description: "Tips, promotions, and special offers.",
    defaultChecked: false,
  },
  {
    id: "security_alerts",
    title: "Security Alerts",
    description: "Notifications about suspicious activity.",
    defaultChecked: true,
  },
];

const NotificationSection = () => {
  const [prefs, setPrefs] = useState<Record<string, boolean>>(
    Object.fromEntries(notifications.map((n) => [n.id, n.defaultChecked]))
  );

  const handleToggle = (id: string) => {
    setPrefs((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSave = () => {
    console.log("Notification prefs saved:", prefs);
  };

  return (
    <div className="bg-light-on-primary dark:bg-dark-bg rounded-3xl p-6  border-light-outline-secondary dark:border-dark-primary-30">

      {/* Header */}
      <div className="mb-6">
        <h3 className="font-heading font-bold text-lg text-light-text dark:text-dark-text">
          Notification Preferences
        </h3>
        <p className="font-body text-xs text-light-outline dark:text-dark-text opacity-60 mt-1">
          Choose what we get in touch with you about.
        </p>
      </div>

      {/* Notification Items */}
      <div className="space-y-1">
        {notifications.map((item, index) => (
          <div
            key={item.id}
            className={`flex items-center justify-between py-4 ${
              index !== notifications.length - 1
                ? "border-b border-light-outline-secondary dark:border-dark-primary-30 opacity-90"
                : ""
            }`}
          >
            {/* Text */}
            <div>
              <p className="font-body text-sm font-semibold text-light-text dark:text-dark-text">
                {item.title}
              </p>
              <p className="font-body text-xs text-light-outline dark:text-dark-text opacity-60 mt-0.5">
                {item.description}
              </p>
            </div>

            {/* Checkbox */}
            <div
              onClick={() => handleToggle(item.id)}
              className={`w-5 h-5 rounded border-2 flex items-center justify-center cursor-pointer transition-all duration-200 flex-shrink-0
                ${prefs[item.id]
                  ? "bg-light-primary dark:bg-dark-primary border-light-primary dark:border-dark-primary"
                  : "bg-transparent border-light-outline-secondary dark:border-dark-primary-30"
                }
              `}
            >
              {prefs[item.id] && (
                <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                  <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Save Button */}
      <div className="flex justify-end mt-6 pt-4 border-t border-light-outline-secondary dark:border-dark-primary-30 opacity-100">
        <button
          onClick={handleSave}
          className="font-body text-sm font-semibold text-light-on-primary px-5 py-2 rounded-lg bg-light-primary dark:bg-dark-primary hover:opacity-90 transition-all"
        >
          Save Preferences
        </button>
      </div>

    </div>
  );
};

export default NotificationSection;

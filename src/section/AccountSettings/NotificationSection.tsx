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

// ponytail: no backend for notification settings yet, so they live in this browser only.
const PREFS_KEY = "storybook_notification_prefs";

const loadPrefs = (): Record<string, boolean> => {
  const defaults = Object.fromEntries(notifications.map((n) => [n.id, n.defaultChecked]));
  try {
    return { ...defaults, ...JSON.parse(localStorage.getItem(PREFS_KEY) || "{}") };
  } catch {
    return defaults;
  }
};

const NotificationSection = () => {
  const [prefs, setPrefs] = useState<Record<string, boolean>>(loadPrefs);
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);

  const handleToggle = (id: string) => {
    setPrefs((prev) => ({ ...prev, [id]: !prev[id] }));
    setMessage(null);
  };

  const handleSave = () => {
    try {
      localStorage.setItem(PREFS_KEY, JSON.stringify(prefs));
      setMessage({ ok: true, text: "Saved on this device." });
    } catch (error) {
      console.error("Could not save notification preferences:", error);
      setMessage({ ok: false, text: "We couldn't save your preferences on this device." });
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#F2F0F4] shadow-sm">

      {/* Header */}
      <div className="mb-6">
        <h3 className="font-heading font-bold text-xl text-light-text">
          Notification Preferences
        </h3>
        <p className="font-body text-sm text-light-outline mt-1">
          Choose what we get in touch with you about.
        </p>
      </div>

      {/* Notification Items */}
      <div>
        {notifications.map((item) => (
          <label
            key={item.id}
            className="flex items-center justify-between gap-4 py-3 mb-2 border-b border-[#F2F0F4] last:border-b-0 cursor-pointer"
          >
            <span>
              <span className="block font-body text-sm font-semibold text-light-text">
                {item.title}
              </span>
              <span className="block font-body text-xs text-light-outline mt-0.5">
                {item.description}
              </span>
            </span>
            <input
              type="checkbox"
              checked={!!prefs[item.id]}
              onChange={() => handleToggle(item.id)}
              className="w-5 h-5 shrink-0 rounded accent-light-primary cursor-pointer"
            />
          </label>
        ))}
      </div>

      {/* Save Button */}
      <div className="flex items-center justify-end gap-3 mt-8 pt-4 border-t border-[#F2F0F4]">
        {message && (
          <p className={`font-body text-sm mr-auto ${message.ok ? "text-green-600" : "text-red-500"}`}>{message.text}</p>
        )}
        <button
          onClick={handleSave}
          className="h-[42px] px-5 rounded-lg bg-light-primary text-white font-body text-sm font-bold shadow-md hover:opacity-90 transition-all disabled:opacity-60"
        >
          Save Preferences
        </button>
      </div>

    </div>
  );
};

export default NotificationSection;

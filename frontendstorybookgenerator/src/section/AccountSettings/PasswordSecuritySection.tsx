import { useState } from "react";

const PasswordSecuritySection = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleUpdate = () => {
    console.log("Password update:", { currentPassword, newPassword, confirmPassword });
  };

  return (
    <div className="bg-light-on-primary dark:bg-dark-bg rounded-2xl p-6  border-light-outline-secondary dark:border-dark-primary-30">

      {/* Header */}
      <div className="mb-6">
        <h3 className="font-heading font-bold text-lg text-light-text dark:text-dark-text">
          Password & Security
        </h3>
        <p className="font-body text-xs text-light-outline dark:text-dark-text opacity-60 mt-1">
          Manage your password and 2-factor authentication.
        </p>
      </div>

      <div className="space-y-4">

        {/* Current Password */}
        <div className="space-y-1.5">
          <label className="font-body text-sm font-medium text-light-text dark:text-dark-text">
            Current Password
          </label>
          <input
            type="password"
            value={currentPassword}
            onChange={(e: any) => setCurrentPassword(e.target.value)}
            className="w-full px-4 py-2.5 rounded-lg bg-light-bg dark:bg-dark-primary-10 border border-light-outline-secondary dark:border-dark-primary-30 text-light-text dark:text-dark-text font-body text-sm focus:outline-none focus:border-light-primary dark:focus:border-dark-primary focus:ring-2 focus:ring-dark-primary-10 transition-all"
          />
        </div>

        {/* New + Confirm Password */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="font-body text-sm font-medium text-light-text dark:text-dark-text">
              New Password
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e: any) => setNewPassword(e.target.value)}
              placeholder="New password"
              className="w-full px-4 py-2.5 rounded-lg bg-light-bg dark:bg-dark-primary-10 border border-light-outline-secondary dark:border-dark-primary-30 text-light-text dark:text-dark-text placeholder:text-light-outline-secondary font-body text-sm focus:outline-none focus:border-light-primary dark:focus:border-dark-primary focus:ring-2 focus:ring-dark-primary-10 transition-all"
            />
          </div>
          <div className="space-y-1.5">
            <label className="font-body text-sm font-medium text-light-text dark:text-dark-text">
              Confirm New Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e: any) => setConfirmPassword(e.target.value)}
              placeholder="Confirm password"
              className="w-full px-4 py-2.5 rounded-lg bg-light-bg dark:bg-dark-primary-10 border border-light-outline-secondary dark:border-dark-primary-30 text-light-text dark:text-dark-text placeholder:text-light-outline-secondary font-body text-sm focus:outline-none focus:border-light-primary dark:focus:border-dark-primary focus:ring-2 focus:ring-dark-primary-10 transition-all"
            />
          </div>
        </div>

      </div>

      {/* Footer */}
      <div className="flex items-center justify-between mt-6 pt-4 border-t border-light-outline-secondary dark:border-dark-primary-30 opacity-100">
        <button className="font-body text-sm font-medium text-red-500 hover:underline underline-offset-2 transition-all">
          Delete Account
        </button>
        <button
          onClick={handleUpdate}
          className="font-body text-sm font-semibold text-light-on-primary px-5 py-2 rounded-lg bg-light-primary dark:bg-dark-primary hover:opacity-90 transition-all"
        >
          Update Password
        </button>
      </div>

    </div>
  );
};

export default PasswordSecuritySection;

import { useState } from "react";
import { useSelector } from "react-redux";
import { supabase } from "../../lib/supabase";
import { RootState } from "../../store/store";

const PasswordSecuritySection = () => {
  const email = useSelector((state: RootState) => state.auth.userData?.email);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);

  const handleUpdate = async () => {
    if (!email) return;
    if (!currentPassword) return setMessage({ ok: false, text: "Please enter your current password." });
    if (newPassword.length < 8) return setMessage({ ok: false, text: "Your new password must be at least 8 characters." });
    if (newPassword !== confirmPassword) return setMessage({ ok: false, text: "The new passwords don't match." });
    setSaving(true);
    setMessage(null);
    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({ email, password: currentPassword });
      if (signInError) {
        console.error("Current password check failed:", signInError);
        return setMessage({ ok: false, text: "Your current password is incorrect." });
      }
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setMessage({ ok: true, text: "Your password has been updated." });
    } catch (error) {
      console.error("Could not update password:", error);
      setMessage({ ok: false, text: "We couldn't update your password. Please try again." });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-light-on-primary dark:bg-dark-bg rounded-2xl p-6  border-light-outline-secondary dark:border-dark-primary-30">

      {/* Header */}
      <div className="mb-6">
        <h3 className="font-heading font-bold text-lg text-light-text dark:text-dark-text">
          Password & Security
        </h3>
        <p className="font-body text-xs text-light-outline dark:text-dark-text opacity-60 mt-1">
          Change the password you use to log in.
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
            onChange={(e) => setCurrentPassword(e.target.value)}
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
              onChange={(e) => setNewPassword(e.target.value)}
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
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm password"
              className="w-full px-4 py-2.5 rounded-lg bg-light-bg dark:bg-dark-primary-10 border border-light-outline-secondary dark:border-dark-primary-30 text-light-text dark:text-dark-text placeholder:text-light-outline-secondary font-body text-sm focus:outline-none focus:border-light-primary dark:focus:border-dark-primary focus:ring-2 focus:ring-dark-primary-10 transition-all"
            />
          </div>
        </div>

      </div>

      {/* Footer */}
      <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-light-outline-secondary dark:border-dark-primary-30 opacity-100">
        {message && (
          <p className={`font-body text-sm mr-auto ${message.ok ? "text-green-600" : "text-red-500"}`}>{message.text}</p>
        )}
        <button
          onClick={handleUpdate}
          disabled={saving}
          className="font-body text-sm font-semibold text-light-on-primary px-5 py-2 rounded-lg bg-light-primary dark:bg-dark-primary hover:opacity-90 transition-all disabled:opacity-60"
        >
          {saving ? "Updating…" : "Update Password"}
        </button>
      </div>

    </div>
  );
};

export default PasswordSecuritySection;

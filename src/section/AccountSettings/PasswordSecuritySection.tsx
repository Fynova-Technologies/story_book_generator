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
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#F2F0F4] shadow-sm">

      {/* Header */}
      <div className="mb-6">
        <h3 className="font-heading font-bold text-xl text-light-text">
          Password & Security
        </h3>
        <p className="font-body text-sm text-light-outline mt-1">
          Change the password you use to log in.
        </p>
      </div>

      <div className="space-y-6">

        {/* Current Password */}
        <div className="space-y-2">
          <label className="font-body text-sm font-semibold text-light-text">
            Current Password
          </label>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="w-full h-[42px] px-4 rounded-lg bg-gray-50 border border-gray-200 text-light-text placeholder:text-gray-400 font-body text-sm focus:outline-none focus:border-light-primary focus:ring-2 focus:ring-dark-primary-10 transition-all"
          />
        </div>

        {/* New + Confirm Password */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="font-body text-sm font-semibold text-light-text">
              New Password
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="New password"
              className="w-full h-[42px] px-4 rounded-lg bg-gray-50 border border-gray-200 text-light-text placeholder:text-gray-400 font-body text-sm focus:outline-none focus:border-light-primary focus:ring-2 focus:ring-dark-primary-10 transition-all"
            />
          </div>
          <div className="space-y-2">
            <label className="font-body text-sm font-semibold text-light-text">
              Confirm New Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm password"
              className="w-full h-[42px] px-4 rounded-lg bg-gray-50 border border-gray-200 text-light-text placeholder:text-gray-400 font-body text-sm focus:outline-none focus:border-light-primary focus:ring-2 focus:ring-dark-primary-10 transition-all"
            />
          </div>
        </div>

      </div>

      {/* Footer */}
      <div className="flex items-center justify-end gap-3 mt-8 pt-4 border-t border-[#F2F0F4]">
        {message && (
          <p className={`font-body text-sm mr-auto ${message.ok ? "text-green-600" : "text-red-500"}`}>{message.text}</p>
        )}
        <button
          onClick={handleUpdate}
          disabled={saving}
          className="h-[42px] px-5 rounded-lg bg-light-primary text-white font-body text-sm font-bold shadow-md hover:opacity-90 transition-all disabled:opacity-60"
        >
          {saving ? "Updating…" : "Update Password"}
        </button>
      </div>

    </div>
  );
};

export default PasswordSecuritySection;

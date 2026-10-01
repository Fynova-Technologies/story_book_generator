import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { supabase } from "../../lib/supabase";
import { login } from "../../store/slices/authSlice";
import { RootState } from "../../store/store";
import { userInitial } from "../../components/Sidebar/user";

const ProfileInfoSection = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.userData);
  const [name, setName] = useState(user?.displayName ?? "");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);

  const handleSave = async () => {
    const display_name = name.trim();
    if (!user || !display_name) return setMessage({ ok: false, text: "Please enter your name." });
    setSaving(true);
    setMessage(null);
    try {
      const { error } = await supabase.auth.updateUser({ data: { display_name } });
      if (error) throw error;
      const { error: profileError } = await supabase.from("profiles").update({ display_name }).eq("id", user.uid);
      if (profileError) throw profileError;
      dispatch(login({ userData: { ...user, displayName: display_name } }));
      setMessage({ ok: true, text: "Your changes have been saved." });
    } catch (error) {
      console.error("Could not update profile:", error);
      setMessage({ ok: false, text: "We couldn't save your changes. Please try again." });
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setName(user?.displayName ?? "");
    setMessage(null);
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#F2F0F4] shadow-sm">

      {/* Header */}
      <div className="mb-6">
        <h3 className="font-heading font-bold text-xl text-light-text">
          Personal Information
        </h3>
        <p className="font-body text-sm text-light-outline mt-1">
          Update your personal details.
        </p>
      </div>

      {/* Avatar + Fields */}
      <div className="flex flex-col sm:flex-row items-start gap-8">

        {/* Avatar (photo upload comes with avatar storage) */}
        <div className="w-24 h-24 flex-shrink-0 rounded-full bg-dark-primary-10 border-4 border-white shadow-md flex items-center justify-center font-heading text-4xl font-bold text-light-primary">
          {userInitial(user)}
        </div>

        {/* Fields */}
        <div className="flex-1 w-full space-y-6">

          {/* Name */}
          <div className="space-y-2">
            <label htmlFor="profile-name" className="font-body text-sm font-semibold text-light-text">
              Name
            </label>
            <input
              id="profile-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full h-[42px] px-4 rounded-lg bg-gray-50 border border-gray-200 text-light-text placeholder:text-gray-400 font-body text-sm focus:outline-none focus:border-light-primary focus:ring-2 focus:ring-dark-primary-10 transition-all"
            />
          </div>

          {/* Email — read only */}
          <div className="space-y-2">
            <label className="font-body text-sm font-semibold text-light-text">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
              </div>
              <input
                type="email"
                value={user?.email ?? ""}
                disabled
                className="w-full h-[42px] pl-10 pr-4 rounded-lg bg-gray-50 border border-gray-200 text-light-text font-body text-sm cursor-not-allowed"
              />
            </div>
            <p className="font-body text-xs text-light-outline">
              Email cannot be changed
            </p>
          </div>

        </div>
      </div>

      {/* Buttons */}
      <div className="flex items-center justify-end gap-3 mt-8 pt-4 border-t border-[#F2F0F4]">
        {message && (
          <p className={`font-body text-sm mr-auto ${message.ok ? "text-green-600" : "text-red-500"}`}>{message.text}</p>
        )}
        <button
          onClick={handleCancel}
          disabled={saving}
          className="h-[42px] px-5 rounded-lg border border-gray-200 font-body text-sm font-bold text-light-outline hover:bg-gray-50 transition-all">
          Cancel
        </button>
        <button
          onClick={handleSave}
          disabled={saving}
          className="h-[42px] px-5 rounded-lg bg-light-primary text-white font-body text-sm font-bold shadow-md hover:opacity-90 transition-all disabled:opacity-60"
        >
          {saving ? "Saving…" : "Save Changes"}
        </button>
      </div>

    </div>
  );
};

export default ProfileInfoSection;

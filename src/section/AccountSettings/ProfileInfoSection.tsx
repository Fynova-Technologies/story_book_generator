import { useState, useRef } from "react";
import {useForm, SubmitHandler } from "react-hook-form"

const ProfileInfoSection = () => {
  type data ={
    firstName:string,
    lastName:string,
    avatar:any,
  }
  const {register,handleSubmit} = useForm<data>()
  const [avatar, setAvatar] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ✅ Handle avatar change when pencil clicked
  const handleAvatarChange = (e: any) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave:SubmitHandler<data> = (data) => {
    console.log("Saved:", data);
  };

  return (
    <div className="bg-light-on-primary dark:bg-dark-bg rounded-3xl p-6 border-light-outline-secondary
     dark:border-dark-primary-30">

      {/* Header */}
      <div className="mb-6">
        <h3 className="font-heading font-bold text-lg text-light-text dark:text-dark-text">
          Personal Information
        </h3>
        <p className="font-body text-xs text-light-outline dark:text-dark-text opacity-60 mt-1">
          Update your photo and personal details.
        </p>
      </div>

      {/* Avatar + Fields */}
      <div className="flex flex-col sm:flex-row items-start gap-6">

        {/* ── AVATAR with pencil icon ── */}
        <div className="relative flex-shrink-0">
          <div className="w-16 h-16 rounded-full overflow-hidden bg-dark-primary-10 border-2 border-light-outline-secondary dark:border-dark-primary-30">
            {avatar ? (
              <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              // Placeholder avatar
              <div className="w-full h-full flex items-center justify-center bg-dark-primary-10">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-light-primary dark:text-dark-primary">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
              </div>
            )}
          </div>

          {/* ✅ Pencil icon — click to change avatar */}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-light-primary dark:bg-dark-primary flex items-center justify-center hover:opacity-90 transition-all shadow-sm"
          >
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
          </button>

          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
            className="hidden"
          />
        </div>

        {/* Fields */}
        <div className="flex-1 w-full space-y-4">

          {/* First + Last Name */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="font-body text-sm font-medium text-light-text dark:text-dark-text">
                First Name
              </label>
              <input
                type="text"
                {...register("firstName",{
                  required:true
                }
                )}
                className="w-full px-4 py-2.5 rounded-lg bg-light-bg dark:bg-dark-primary-10 border border-light-outline-secondary dark:border-dark-primary-30 text-light-text dark:text-dark-text font-body text-sm focus:outline-none focus:border-light-primary dark:focus:border-dark-primary focus:ring-2 focus:ring-dark-primary-10 transition-all"
              />
            </div>
            <div className="space-y-1.5">
              <label className="font-body text-sm font-medium text-light-text dark:text-dark-text">
                Last Name
              </label>
              <input
                type="text"
                {...register("lastName",{
                  required:true
                })}
                className="w-full px-4 py-2.5 rounded-lg bg-light-bg dark:bg-dark-primary-10 border border-light-outline-secondary dark:border-dark-primary-30 text-light-text dark:text-dark-text font-body text-sm focus:outline-none focus:border-light-primary dark:focus:border-dark-primary focus:ring-2 focus:ring-dark-primary-10 transition-all"
              />
            </div>
          </div>

          {/* Email — read only */}
          <div className="space-y-1.5">
            <label className="font-body text-sm font-medium text-light-text dark:text-dark-text">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-light-outline-secondary">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
              </div>
              <input
                type="email"
                value="janedoe@example.com"
                disabled
                className="w-full pl-9 pr-4 py-2.5 rounded-lg bg-light-bg dark:bg-dark-primary-10 border border-light-outline-secondary dark:border-dark-primary-30 text-light-outline dark:text-dark-text font-body text-sm opacity-60 cursor-not-allowed"
              />
            </div>
            <p className="font-body text-xs text-light-outline dark:text-dark-text opacity-50">
              Email cannot be changed
            </p>
          </div>

        </div>
      </div>

      {/* Buttons */}
      <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-light-outline-secondary dark:border-dark-primary-30 opacity-100">
        <button className="font-body text-sm font-medium text-light-text dark:text-dark-text px-5 py-2 rounded-lg border border-light-outline-secondary dark:border-dark-primary-30 hover:bg-light-bg dark:hover:bg-dark-primary-10 transition-all">
          Cancel
        </button>
        <button
          onClick={handleSubmit(handleSave)}
          className="font-body text-sm font-semibold text-light-on-primary px-5 py-2 rounded-lg bg-light-primary dark:bg-dark-primary hover:opacity-90 transition-all"
        >
          Save Changes
        </button>
      </div>

    </div>
  );
};

export default ProfileInfoSection;

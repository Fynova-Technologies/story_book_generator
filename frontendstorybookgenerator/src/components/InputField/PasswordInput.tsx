import { useState } from "react";

const PasswordInput = ({
  label = "Password",
  value,
  onChange,
  placeholder = "",
  required = false,
  showAsterisk = false,
  disabled = false,
  error,
}: any) => {

  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="space-y-1.5">

      {/* Label */}
      <label className="text-sm font-medium text-light-text dark:text-dark-text">
        {label}
        {showAsterisk && (
          <span className="text-light-accent dark:text-dark-accent">*</span>
        )}
      </label>

      {/* Input Wrapper */}
      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          className={`w-full px-4 py-3 rounded-lg
            bg-light-outline-secondary dark:bg-dark-primary-10
            border text-light-text dark:text-dark-text
            placeholder:text-light-outline-secondary
            focus:outline-none focus:ring-2 focus:ring-dark-primary-10
            transition-all text-sm pr-11
            disabled:opacity-50 disabled:cursor-not-allowed
            ${error
              ? "border-red-500 focus:border-red-500"
              : "border-light-outline-secondary dark:border-dark-primary-30 focus:border-light-primary dark:focus:border-dark-primary"
            }
          `}
        />

        {/* Show / Hide Toggle Button */}
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-light-outline-secondary dark:text-dark-text hover:text-light-text dark:hover:text-dark-primary transition-colors"
        >
          {showPassword ? (
            // Eye Off Icon
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/>
              <line x1="1" y1="1" x2="23" y2="23"/>
            </svg>
          ) : (
            // Eye Icon
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
              <circle cx="12" cy="12" r="3"/>
            </svg>
          )}
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <p className="text-xs text-red-500 mt-1">{error}</p>
      )}

    </div>
  );
};

export default PasswordInput;
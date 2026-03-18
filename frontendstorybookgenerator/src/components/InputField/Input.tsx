const InputField = ({
  label,
  type = "text",
  value,
  onChange,
  placeholder = "",
  required = false,
  showAsterisk = false,
  disabled = false,
  error,
}: any) => {
  return (
    <div className="space-y-1.5">

      {/* Label */}
      <label className="text-sm font-medium text-light-text dark:text-dark-text">
        {label}
        {showAsterisk && (
          <span className="text-light-accent dark:text-dark-accent">*</span>
        )}
      </label>

      {/* Input */}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        className={`w-full px-4 py-3 rounded-lg 
          bg-light-on-primary dark:bg-dark-primary-10 
          border text-light-text dark:text-dark-text 
          placeholder:text-light-outline-secondary 
          focus:outline-none focus:ring-2 focus:ring-dark-primary-10 
          transition-all text-sm
          disabled:opacity-50 disabled:cursor-not-allowed
          ${error
            ? "border-red-500 focus:border-red-500"
            : "border-light-outline-secondary dark:border-dark-primary-30 focus:border-light-primary dark:focus:border-dark-primary"
          }
        `}
      />

      {/* Error Message */}
      {error && (
        <p className="text-xs text-red-500 mt-1">{error}</p>
      )}

    </div>
  );
};

export default InputField;
import React, { useId, InputHTMLAttributes } from "react";

interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

const InputField = React.forwardRef<HTMLInputElement, InputFieldProps>(
  function InputField({ label, type = "text", placeholder = "", error, ...rest }, ref) {
    const id = useId();

    return (
      <div className="space-y-1.5">

        {/* Label */}
        <label
          htmlFor={id}
          className="text-sm font-medium text-light-text dark:text-dark-text"
        >
          {label}
          <span className="text-light-text dark:text-dark-text">*</span>
        </label>

        {/* Input */}
        <input
          {...rest}
          type={type}
          placeholder={placeholder}
          ref={ref}
          id={id}
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
  }
);

InputField.displayName = "InputField";
export default InputField;
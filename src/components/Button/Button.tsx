import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "name"> & {
  name: ReactNode;
  icon?: ReactNode;
};

const Button = ({
  type = "submit",
  name,
  disabled = false,
  icon,
  ...props
  
}: ButtonProps) =>{
  return (
    <div>
       <button
              type={type}
              disabled={disabled}
              className="w-full py-2.5 rounded-lg bg-light-primary dark:bg-dark-primary hover:opacity-90 text-light-on-primary 
              font-semibold text-sm transition-all duration-200 hover:shadow-lg active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed"
              {...props}
            >
              {icon}
              {name}
            </button>
    </div>
  )
}

export default Button

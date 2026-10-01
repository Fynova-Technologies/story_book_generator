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
              className="w-full py-2.5 rounded-xl bg-light-primary hover:opacity-90 text-white
              font-body text-base md:text-lg leading-7 transition-all duration-200 hover:shadow-lg active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed"
              {...props}
            >
              {icon}
              {name}
            </button>
    </div>
  )
}

export default Button

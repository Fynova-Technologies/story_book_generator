import React from 'react'

const Button = ({
  type,
  name,
  ...props
  
}: any) =>{
  return (
    <div>
       <button
              type={type}
              className="w-full py-3.5 rounded-lg bg-light-primary dark:bg-dark-primary hover:opacity-90 text-light-on-primary font-semibold text-sm transition-all duration-200 hover:shadow-lg active:scale-[0.99]"
            >
              {props?.icon}
              {name}
            </button>
    </div>
  )
}

export default Button

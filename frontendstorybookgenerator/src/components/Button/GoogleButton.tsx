import React from 'react'
import GoogleIcon from '../../assets/icons/GoogleIcon'

function GoogleButton() {
  return (
    <div>
      <button
        type="button"
        className="w-full py-3.5 rounded-lg bg-transparent border border-light-outline dark:border-dark-primary-30 hover:bg-dark-primary-10 text-light-text dark:text-dark-text font-medium text-sm transition-all duration-200 flex items-center justify-center gap-3"
      >
              <GoogleIcon/>
              Log in with Google
            </button>

    </div>
  )
}

export default GoogleButton

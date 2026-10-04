import { useState } from 'react'
import GoogleIcon from '../GoogleIcon'
import { signInWithGoogle } from '../../services/authService'

function GoogleButton({
  label = "Log in with Google",
}: {
  label?: string;
}) {
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleClick = async () => {
    setBusy(true)
    setError(null)
    try {
      await signInWithGoogle()
    } catch (err) {
      console.error("Google sign-in failed", err)
      setError("Couldn't start Google sign-in. Please try again.")
      setBusy(false)
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={handleClick}
        disabled={busy}
        className="w-full py-2.5 rounded-xl bg-transparent border-[1.5px] border-b-4 border-[#050B0A]/15
         text-light-text font-body text-base md:text-lg leading-7 flex items-center justify-center gap-3 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
      >
              <GoogleIcon width={24} height={24} />
              {label}
            </button>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  )
}

export default GoogleButton

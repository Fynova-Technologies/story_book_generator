import GoogleIcon from '../GoogleIcon'

// ponytail: Google needs an OAuth client in the Supabase dashboard; then wire an onClick to
// supabase.auth.signInWithOAuth({ provider: 'google' }). Until then it's shown disabled.
function GoogleButton({
  label = "Google sign-in coming soon",
}: {
  label?: string;
}) {
  return (
    <div>
      <button
        type="button"
        disabled
        title="Google sign-in coming soon"
        className="w-full py-2.5 rounded-xl bg-transparent border border-[#050B0A]/15 border-b-[3px]
         text-light-text font-body text-base md:text-lg leading-7 flex items-center justify-center gap-3 opacity-50 cursor-not-allowed"
      >
              <GoogleIcon/>
              {label}
            </button>

    </div>
  )
}

export default GoogleButton

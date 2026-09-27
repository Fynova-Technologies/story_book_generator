import { useNavigate } from "react-router"

function CTAButton({
    name="Create",
    className
}:any) {

   const navigate = useNavigate()
  return (
    <div>
      <button
          onClick={() => navigate("/login")}
          className={`${className} flex items-center gap-3 px-6 py-3.5 rounded-xl font-semibold text-sm text-white w-fit 
          transition-all duration-200 hover:opacity-90 hover:shadow-lg hover:shadow-dark-primary/30 active:scale-[0.99] `}
          style={{ background: "#2E73EA" }}
        >
         {name}
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </button>
    </div>
  )
}

export default CTAButton

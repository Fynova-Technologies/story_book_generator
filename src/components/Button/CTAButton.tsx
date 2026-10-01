import { useNavigate } from "react-router"

function CTAButton({
    name="Create",
    className
}: { name?: string; className?: string }) {

   const navigate = useNavigate()
  return (
    <div>
      <button
          onClick={() => navigate("/signup")}
          className={`${className ?? ""} flex items-center gap-2.5 px-5 py-2 rounded-[10px] border border-[#2050A3] bg-dark-primary font-body font-medium text-[15px] text-white w-fit
          transition-all duration-200 hover:opacity-90 hover:shadow-lg hover:shadow-dark-primary/30 active:scale-[0.99] `}
        >
         {name}
          <svg
            width="20"
            height="20"
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

import { useNavigate } from "react-router-dom";
const CTABgImage = "/assets/images/CTAbg.png";

const CTASection = () => {
  const navigate = useNavigate();
  return (
    <section
      data-bg="dark"
      className="w-full"
    >
      <div>

        {/* ── CTA CARD ── */}
        <div
          className="relative w-full rounded-[19px] overflow-hidden py-12 md:py-16 px-6 md:px-16 flex flex-col items-center justify-center
           text-center shadow-[0_5px_12px_rgba(0,0,0,0.15)]"
          style={{
            background: "linear-gradient(160deg, #3554C7 0%, #2E3F8F 60%, #4A5578 100%)",
          }}
        >

          {/* ── BACKGROUND IMAGE OVERLAY ── */}
          <img
            src={CTABgImage}
            alt="CTA background"
            className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-40"
          />
         
          {/* ── CONTENT ── */}
          <div className="relative z-10 flex flex-col items-center gap-10">

            {/* Heading */}
            <h2
              className="font-heading text-3xl md:text-[47px] font-bold text-dark-text leading-tight md:leading-[57px] max-w-2xl"
            >
              Ready to create <br /> your perfect storybook?
            </h2>

            {/* CTA Button */}
            {/* <CTAButton 
                name="Start for free"
                className= "bg-white "
            /> */}
            <button
              onClick={() => navigate("/signup")}
              className="px-5 py-2 rounded-full bg-light-on-primary text-light-primary font-body font-semibold text-sm
               hover:bg-white transition-all duration-300"
            >
              Start for free
            </button>

          </div>
        </div>

      </div>
    </section>
  );
};

export default CTASection;

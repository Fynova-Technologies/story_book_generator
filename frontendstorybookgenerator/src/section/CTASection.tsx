import CTABgImage from "../assets/images/CTAbg.png"
import CTAButton from "../components/Button/CTAButton";

const CTASection = () => {
  return (
    <section
      data-bg="dark"
      className="w-full py-10 px-6 md:px-12 xl:px-20 bg-light-bg dark:bg-dark-bg"
    >
      <div className="max-w-6xl mx-auto">

        {/* ── CTA CARD ── */}
        <div
          className="relative w-full rounded-3xl overflow-hidden py-16 px-8 flex flex-col items-center justify-center
           text-center border-white/20"
          style={{
            background: "linear-gradient(to right, #2E4BA3, #4B6FD4, #6B8FE8)",
          }}
        >

          {/* ── BACKGROUND IMAGE OVERLAY ── */}
          <img
            src={CTABgImage}
            alt="CTA background"
            className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-40"
          />
         
          {/* ── CONTENT ── */}
          <div className="relative z-10 flex flex-col items-center gap-6">

            {/* Heading */}
            <h2
              className="font-heading text-3xl md:text-4xl xl:text-4xl font-bold text-white leading-tight max-w-xl"
            >
              Ready to create <br /> your perfect storybook?
            </h2>

            {/* CTA Button */}
            {/* <CTAButton 
                name="Start for free"
                className= "bg-white "
            /> */}
            <button
              className="px-8 py-3 rounded-full bg-white border border-white/40 text-black font-body font-medium text-sm
               hover:bg-white hover:text-dark-primary transition-all duration-300 backdrop-blur-sm"
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

import HeroImage from "../assets/images/heroImg.png";
import CTAButton from "../components/Button/CTAButton";
import Navbar from "../components/Navbar/Navbar";

const HeroSection = () => {
  return (
    <section className="relative w-full h-screen overflow-hidden bg-light-bg dark:bg-dark-bg">
        <Navbar/>

      {/* ── BACKGROUND IMAGE (right side) ── */}
      <div className="absolute inset-0">
        <img
          src={HeroImage}
          alt="Magical forest background"
          className="w-full h-full object-cover object-top"
        />
      </div>

      {/* ── CONTENT ── */}
      <div className="relative z-10 flex flex-col justify-end h-full pb-20 px-10 md:py-30 xl:py-20 max-w-[580px]">

        {/* Heading */}
         <h1
          className="text-2xl md:text-4xl xl:text-4xl font-bold text-light-text dark:text-dark-text leading-tight mb-4"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Turn Your <br /> Memories Into
        </h1>
        <h1
          className="text-2xl md:text-4xl xl:text-4xl font-bold text-dark-primary dark:text-dark-primary leading-tight mb-4"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Magical <br /> Storybooks
        </h1>

        {/* Subtitle */}
        <p 
         style={{ fontFamily: "var(--font-body)" }}
        className="text-sm md:text-base text-light-text dark:text-dark-text leading-relaxed mb-8 max-w-105">
          Create personalized storybooks in minutes. Answer simple
          questions, add your photos, and watch as AI brings your
          tale to life with beautiful illustrations and narration.
        </p>

        {/* CTA Button */}
        <CTAButton name="Create Your First Story Book"/>

      </div>

    </section>
  );
};

export default HeroSection;

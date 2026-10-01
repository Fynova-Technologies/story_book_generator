const HeroImage = "/assets/images/heroImg.png";
import CTAButton from "../components/Button/CTAButton";
import Navbar from "../components/Navbar/Navbar";

const HeroSection = () => {
  return (
    <section className="relative w-full min-h-[720px] md:min-h-[930px] overflow-hidden">
        <Navbar/>

      {/* ── BACKGROUND IMAGE (transparent on the left, so the paper shows through) ── */}
      <div className="absolute inset-x-0 top-0 h-80 md:h-auto md:bottom-0">
        <img
          src={HeroImage}
          alt="Magical forest background"
          className="w-full h-full object-cover object-top-right"
        />
      </div>

      {/* ── CONTENT ── */}
      <div className="relative z-10 flex flex-col justify-end min-h-[720px] md:min-h-[930px] pb-16 md:pb-[140px] px-4 sm:px-10 md:px-20 max-w-[685px]">

        {/* Heading */}
        <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl font-bold text-black leading-[1.1] mb-5">
          Turn Your <br /> Memories Into <br />
          <span className="text-dark-primary">Magical <br /> Storybooks</span>
        </h1>

        {/* Subtitle */}
        <p className="font-body text-base md:text-xl text-light-outline leading-relaxed md:leading-8 mb-7 max-w-[525px]">
          Create personalized storybooks in minutes. Answer simple
          questions, add your photos, and watch as AI brings your
          tale to life with beautiful illustrations and narration.
        </p>

        {/* CTA Button */}
        <CTAButton name="Create Your First Storybook"/>

      </div>

    </section>
  );
};

export default HeroSection;

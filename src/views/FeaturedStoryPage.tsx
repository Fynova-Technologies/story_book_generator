import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";
import FeaturedStoriesSection from "../section/FeaturedStorySection";
const TemplateHeroBg = "/assets/images/contactbg.png";
import { useState } from "react";




const FeaturedStoryPage = () => {

  // The list filters as you type, so GO has nothing extra to do.
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="min-h-screen overflow-x-hidden">

      
      <Navbar />

      {/* ── HERO SECTION ── */}
      <div className="relative w-full min-h-[400px] md:min-h-[464px] mb-12">

        {/* ── BACKGROUND IMAGE ── */}
        <img
          src={TemplateHeroBg}
          alt=""
          data-glass-backdrop
          data-glass-dim="0.7"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/70" />

        {/* ── CONTENT ── */}
        <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 pt-32 md:pt-[200px] pb-16 gap-2 drop-shadow-[0_4px_14px_rgba(0,0,0,0.5)]">
          <h1 className="font-heading text-3xl sm:text-5xl md:text-6xl font-bold leading-tight text-dark-text max-w-4xl">
            Welcome to the Story Gallery
          </h1>
          <p className="font-heading text-xl sm:text-3xl md:text-[40px] font-bold leading-tight text-dark-text max-w-4xl">
            Enjoy stories created by kids around the world!
          </p>
        </div>

        {/* ── SEARCH BOX (sits on the hero's bottom edge) ── */}
        <div className="absolute left-1/2 bottom-0 -translate-x-1/2 translate-y-1/2 z-20 w-[calc(100%-2rem)] max-w-[700px] flex items-center gap-2 bg-light-on-primary rounded-full shadow-lg p-2.5 pl-6 md:pl-8">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for stories about..."
            aria-label="Search stories"
            className="flex-1 min-w-0 bg-transparent text-light-text placeholder:text-[#8A8A8A] placeholder:italic font-heading text-lg md:text-2xl focus:outline-none"
          />
          <button
            type="button"
            className="px-5 md:px-6 py-2.5 md:py-3 rounded-full bg-light-primary text-white font-heading text-lg hover:opacity-90 transition-all duration-200"
          >
            GO
          </button>
        </div>
      </div>

      {/* ── FEATURED TEMPLATES ── */}
      <FeaturedStoriesSection searchQuery={searchQuery} />

      <Footer />

    </div>
  );
};

export default FeaturedStoryPage;

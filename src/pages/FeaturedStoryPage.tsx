import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";
import FeaturedStoriesSection from "../section/FeaturedStorySection";
import TemplateHeroBg from "../assets/images/contactbg.png";
import { useState } from "react";




const FeaturedStoryPage = ({ onSearch }: any) => {

  const [searchQuery, setSearchQuery] = useState("");
  
    const handleSearch = () => {
      onSearch?.(searchQuery);
      console.log("Searching for:", searchQuery);
    };
  
    const handleKeyDown = (e: any) => {
      if (e.key === "Enter") handleSearch();
    };

  return (
    <div className="min-h-screen bg-light-bg dark:bg-dark-bg">

      
      <Navbar />

      {/* ── HERO SECTION ── */}
      <div >
       <div className="relative w-full mx-auto pt-20" style={{ minHeight: "340px" }}>

      {/* ── BACKGROUND IMAGE ── */}
      👉 Uncomment when image is ready:
      <img
        src={TemplateHeroBg}
        alt="Template Hero Background"
        className="absolute inset-0 w-full h-full object-cover"
      />
     
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/60" />

      {/* ── CONTENT ── */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-6 pt-40 pb-0 gap-5">

        {/* Heading */}
        <h1 className="font-heading text-4xl md:text-5xl xl:text-5xl font-bold leading-tight max-w-3xl">
          <span className="text-white">Welcome to the Story Gallery</span>
        </h1>
        <h1 className="font-heading text-3xl md:text-4xl xl:text-4xl font-bold leading-tight max-w-4xl">
          <span className="text-white">Enjoy stories created by kids around the world</span>
        </h1>


        {/* ── SEARCH BOX ── */}
        <div className="flex items-center w-full max-w-xl mt-2 -mb-7 bg-white dark:bg-dark-bg/90 rounded-full shadow-lg p-1">
          <input
            type="text"
            value={searchQuery}
            onChange={(e: any) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search for stories about...."
            className="flex-1 px-5 py-3.5 rounded-l-full bg-white dark:bg-dark-bg text-light-text dark:text-dark-text placeholder:text-light-outline-secondary font-body text-sm focus:outline-none"
          />
          <button
            onClick={handleSearch}
            className="px-6 py-3.5 rounded-3xl bg-light-primary dark:bg-dark-primary text-white font-body font-bold text-sm hover:opacity-90 transition-all duration-200"
          >
            GO
          </button>
        </div>

      </div>
    </div>
      </div>

      {/* ── FEATURED TEMPLATES ── */}
      <FeaturedStoriesSection />

      <Footer />

    </div>
  );
};

export default FeaturedStoryPage;

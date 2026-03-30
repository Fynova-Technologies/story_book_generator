import { useState } from "react";
import TemplateHeroBg from "../../assets/images/contactbg.png"


const TemplateHero = ({ onSearch }: any) => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = () => {
    onSearch?.(searchQuery);
    console.log("Searching for:", searchQuery);
  };

  const handleKeyDown = (e: any) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <div className="relative w-full overflow-hidden  mx-auto" style={{ minHeight: "340px" }}>

      {/* ── BACKGROUND IMAGE ── */}
      👉 Uncomment when image is ready:
      <img
        src={TemplateHeroBg}
        alt="Template Hero Background"
        className="absolute inset-0 w-full h-full object-cover"
      />
     
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/40" />

      {/* ── CONTENT ── */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-6 py-16 gap-5">

        {/* Top badge */}
        <div className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-light-accent dark:text-dark-accent">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
          </svg>
          <span className="font-body text-xs font-semibold text-white/90 uppercase tracking-wider">
            12 Story Templates
          </span>
        </div>

        {/* Heading */}
        <h1 className="font-heading text-4xl md:text-5xl xl:text-5xl font-bold leading-tight max-w-3xl">
          <span className="text-white">Choose Your </span>
          <span className="text-light-accent dark:text-dark-accent italic">Story Template</span>
        </h1>

        {/* Subtitle */}
        <p className="font-body text-sm md:text-base text-white/70 leading-relaxed max-w-lg">
          Every great story starts with the right canvas. Pick a template, add your memories, and let the magic begin.
        </p>

        {/* ── SEARCH BOX ── */}
        <div className="flex items-center w-full max-w-xl mt-2">
          <input
            type="text"
            value={searchQuery}
            onChange={(e: any) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search for a template...."
            className="flex-1 px-5 py-3.5 rounded-l-full bg-white dark:bg-dark-bg text-light-text dark:text-dark-text placeholder:text-light-outline-secondary font-body text-sm focus:outline-none"
          />
          <button
            onClick={handleSearch}
            className="px-6 py-3.5 rounded-r-full bg-light-primary dark:bg-dark-primary text-white font-body font-bold text-sm hover:opacity-90 transition-all duration-200"
          >
            GO
          </button>
        </div>

      </div>
    </div>
  );
};

export default TemplateHero;

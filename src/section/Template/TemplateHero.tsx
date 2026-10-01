import { useState } from "react";
const TemplateHeroBg = "/assets/images/contactbg.png";


const TemplateHero = ({ onSearch }: { onSearch?: (query: string) => void }) => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = () => {
    onSearch?.(searchQuery);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <div className="relative w-full min-h-[420px] md:min-h-[464px] mb-12">

      {/* ── BACKGROUND IMAGE ── */}
      <img
        src={TemplateHeroBg}
        alt=""
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black/70" />

      {/* ── CONTENT ── */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 pt-28 md:pt-[136px] pb-16 gap-6">

        {/* Top badge */}
        <div className="flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 border border-white/20">
          <span className="text-white/75 text-xs" aria-hidden="true">✦</span>
          <span className="font-body text-xs font-semibold text-white/75 uppercase tracking-wider">
            12 Story Templates
          </span>
        </div>

        {/* Heading */}
        <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl font-bold leading-tight max-w-4xl">
          <span className="text-white">Choose Your </span>
          <span className="text-light-accent italic">Story Template</span>
        </h1>

        {/* Subtitle */}
        <p className="font-body text-base md:text-2xl md:leading-7 text-white/70 max-w-3xl">
          Every great story starts with the right canvas. Pick a template, add your memories, and let the magic begin.
        </p>
      </div>

      {/* ── SEARCH BOX (sits on the hero's bottom edge) ── */}
      <div className="absolute left-1/2 bottom-0 -translate-x-1/2 translate-y-1/2 z-20 w-[calc(100%-2rem)] max-w-[700px] flex items-center gap-2 bg-white rounded-full shadow-lg p-2.5 pl-6 md:pl-8">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => { setSearchQuery(e.target.value); onSearch?.(e.target.value); }}
          onKeyDown={handleKeyDown}
          placeholder="Search for a template...."
          aria-label="Search templates"
          className="flex-1 min-w-0 bg-transparent text-light-text placeholder:text-[#8A8A8A] placeholder:italic font-heading text-lg md:text-2xl focus:outline-none"
        />
        <button
          onClick={handleSearch}
          className="px-5 md:px-6 py-2.5 md:py-3 rounded-full bg-light-primary text-white font-heading text-lg hover:opacity-90 transition-all duration-200"
        >
          GO
        </button>
      </div>
    </div>
  );
};

export default TemplateHero;

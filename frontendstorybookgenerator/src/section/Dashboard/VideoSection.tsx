import playbutton from "../../assets/icons/Dashboard/PlayButton.png"

const VideoSection= () => {
  return (
    <section
      data-bg="light"
      className="w-full py-5 px-6 md:px-12 xl:px-20 bg-light-bg dark:bg-dark-bg"
    >
      <div className="max-w-5xl mx-auto">

        {/* ── TOP BADGE ── */}
        <div className="flex justify-center mb-4">
          <span className="font-body text-xs font-bold tracking-[0.2em] uppercase text-light-primary dark:text-dark-primary">
            The Secret Recipe
          </span>
        </div>

        {/* ── HEADING ── */}
        <div className="text-center mb-4">
          <h2 className="font-heading text-4xl md:text-4xl font-bold text-light-text dark:text-dark-text leading-tight">
            Making Magic is
          </h2>
          <h2 className="font-heading text-4xl md:text-4xl font-bold italic text-light-primary dark:text-dark-primary leading-tight">
            Easier Than You Think
          </h2>
        </div>

        {/* ── SUBTITLE ── */}
        <p className="font-body text-sm md:text-base text-light-outline dark:text-dark-text text-center leading-relaxed max-w-lg mx-auto mb-10">
          Ever wondered how your personal memories turn into enchanted tales? Step into
          our workshop and see the magic behind the scenes.
        </p>

        {/* ── VIDEO / IMAGE CARD ── */}
        <div className="relative w-full rounded-3xl overflow-hidden shadow-xl aspect-video">


          {/* Gradient placeholder — remove when image is ready */}
          <div
            className="absolute inset-0 w-full h-full"
            style={{
              background: "linear-gradient(135deg, #C4B5FD, #DDA0DD, #FFB6A3)",
            }}
          />

          {/* ── PLAY BUTTON PLACEHOLDER ── */}
          {/* 👉 Replace this with your actual play button / video logic */}
          <div className="absolute inset-0 flex items-center justify-center">
           
              {/* Play icon */}
              <img src={playbutton} alt="" className="w-20 h-20"/>
    
          </div>

          {/* ── WATCH VIDEO BUTTON (bottom left) ── */}
          <div className="absolute bottom-5 left-5">
            <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-white/40 text-light-text font-body text-xs font-semibold hover:bg-white transition-all duration-200 shadow-sm">
              {/* Sparkle icon */}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-light-primary">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
              </svg>
              Watch the explainer video
            </button>
          </div>

        </div>
      </div>
    </section>
  );
};

export default VideoSection;

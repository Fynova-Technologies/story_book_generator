const playbutton = "/assets/icons/Dashboard/PlayButton.png";
const bokeh = "/assets/images/CTAbg.png";

const VideoSection= () => {
  return (
    <section data-bg="light" className="w-full px-4 sm:px-7 py-6 sm:py-7">

      {/* ── HEADING ── */}
      <div className="max-w-[654px] mx-auto text-center mb-8">
        <p className="font-body text-sm font-bold tracking-[0.1em] uppercase text-light-primary mb-4">
          The Secret Recipe
        </p>
        <h2 className="font-heading text-4xl sm:text-5xl font-bold leading-tight text-light-text">
          Making Magic is{" "}
          <span className="block italic text-light-primary">Easier Than You Think</span>
        </h2>
        <p className="font-body text-base sm:text-lg leading-relaxed text-light-outline mt-4">
          Ever wondered how your personal memories turn into enchanted tales? Step into
          our workshop and see the magic behind the scenes.
        </p>
      </div>

      {/* ── VIDEO / IMAGE CARD ── */}
      {/* ponytail: placeholder until the explainer video exists (D7) */}
      <div className="relative w-full rounded-3xl overflow-hidden border-4 sm:border-8 border-white shadow-xl aspect-video bg-gray-200">
        <img src={bokeh} alt="" className="absolute inset-0 w-full h-full object-cover" />

        <div className="absolute inset-0 flex items-center justify-center">
          <img src={playbutton} alt="" className="w-16 h-16 sm:w-24 sm:h-24 drop-shadow-xl"/>
        </div>

        <span className="absolute bottom-3 left-3 sm:bottom-6 sm:left-6 flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur border border-white/30 text-white font-body text-xs sm:text-sm font-bold">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <path d="M10 4l1.6 4.4L16 10l-4.4 1.6L10 16l-1.6-4.4L4 10l4.4-1.6z" />
            <path d="M18 2l.8 2.2L21 5l-2.2.8L18 8l-.8-2.2L15 5l2.2-.8z" />
          </svg>
          Watch the explainer video
        </span>
      </div>
    </section>
  );
};

export default VideoSection;

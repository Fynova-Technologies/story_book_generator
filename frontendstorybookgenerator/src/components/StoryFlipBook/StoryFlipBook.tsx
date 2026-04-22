import HTMLFlipBook from 'react-pageflip';
import { useRef,useState,useEffect }   from 'react';


interface StoryPage {
  page:               number;
  text:               string;
  imageUrl:           string;
}

interface GeneratedStory {
  title:    string;
  subtitle: string;
  pages:    StoryPage[];
}

interface Props {
  story: GeneratedStory;
  // onClose?: () => void;
}

const StoryFlipBook = ({ story }: Props) => {
  
  const bookRef = useRef<any>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [isPlaying,   setIsPlaying]   = useState(false);
  const [playSpeed,   setPlaySpeed]   = useState(1);

  const totalPages = story.pages.length + 2;

  const goNext = () => bookRef.current?.pageFlip()?.flipNext();
  const goPrev = () => bookRef.current?.pageFlip()?.flipPrev();
  const onFlip = (e: any) => setCurrentPage(e.data);

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      if (currentPage >= totalPages - 1) { setIsPlaying(false); return; }
      goNext();
    }, 5000 / playSpeed);
    return () => clearInterval(interval);
  }, [isPlaying, currentPage, playSpeed]);

  const cycleSpeed = () => setPlaySpeed(s => s === 1 ? 1.5 : s === 1.5 ? 2 : 1);

  return (
    <div className="bg-light-bg flex flex-col items-center gap-3 py-10">

      <div className="flex items-center gap-3 mb-0 bg-light-on-primary p-2 rounded-full">

        <button
          onClick={() => window.print()}
          className="w-11 h-11 rounded-full bg-white backdrop-blur-md border border-white/90 shadow-md flex items-center 
          justify-center text-[#5C3D2E] hover:bg-white/90 hover:scale-105 transition-all duration-200"
          title="Download"
        >
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" 
          strokeLinejoin="round">
            <path d="M12 2v13M7 10l5 5 5-5"/>
            <path d="M20 17v2a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-2"/>
          </svg>
        </button>

        <button
          onClick={() => navigator.share?.({ title: story.title, text: story.subtitle })}
          className="w-11 h-11 rounded-full bg-white/70 backdrop-blur-md border border-white/90 shadow-md flex items-center justify-center text-[#5C3D2E] hover:bg-white/90 hover:scale-105 transition-all duration-200"
          title="Share"
        >
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="18" cy="5"  r="3"/>
            <circle cx="6"  cy="12" r="3"/>
            <circle cx="18" cy="19" r="3"/>
            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
            <line x1="15.41" y1="6.51"  x2="8.59"  y2="10.49"/>
          </svg>
        </button>

        {/* {onClose && (
          <button
            onClick={onClose}
            className="w-11 h-11 rounded-full bg-white/70 backdrop-blur-md border border-white/90 shadow-md flex items-center justify-center text-[#5C3D2E] hover:bg-white/90 hover:scale-105 transition-all duration-200"
            title="Close"
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6"  x2="6"  y2="18"/>
              <line x1="6"  y1="6"  x2="18" y2="18"/>
            </svg>
          </button>
        )} */}

      </div>

      {/* Book Title */}
      {/* <div className="text-center">
        <h1 className="text-3xl font-bold text-light-text dark:text-dark-text">
          {story.title}
        </h1>
        <p className="text-sm text-light-outline dark:text-dark-text mt-1">
          {story.subtitle}
        </p>
      </div> */}

      {/* The Flipbook */}
      <div className=' rounded-2xl'>
      <HTMLFlipBook
        ref={bookRef}
        width={450}
        height={530}
        size="fixed"
        minWidth={300}
        maxWidth={500}
        minHeight={400}
        maxHeight={600}
        showCover={true}
        flippingTime={700}
        className="shadow-2xl"
        style={{}}
        startPage={0}
        drawShadow={true}
        usePortrait={false}
        startZIndex={0}
        autoSize={false}
        maxShadowOpacity={0.5}
        mobileScrollSupport={true}
        clickEventForward={true}
        useMouseEvents={true}
        swipeDistance={20}
        showPageCorners={true}
        disableFlipByClick={false}
        onFlip={onFlip}
      >

        {/* Cover Page */}
        <div className="w-full h-full bg-light-primary dark:bg-dark-primary flex flex-col items-center justify-center 
        p-8 text-center rounded-2xl">
          <h1 className="font-heading text-2xl font-bold text-white leading-tight mb-4">
            {story.title}
          </h1>
          <p className="font-body text-sm text-white/80">
            {story.subtitle}
          </p>
          <p className="font-body text-xs text-white/60 mt-8">
            Tap or drag to turn pages
          </p>
        </div>

        {/* Story Pages */}
        {story.pages.map((page) => (
          <div
            key={page.page}
            className="w-full h-full bg-white dark:bg-dark-bg flex flex-col overflow-hidden rounded-2xl"
          >
            {/* Image - full height if no text, 70% if text exists */}
            <div className={`w-full overflow-hidden ${page.text ? 'h-[70%]' : 'h-full'}`}>
              <img
                src={page.imageUrl}
                alt={`Page ${page.page}`}
                className="w-full h-full object-center"
              />
            </div>

            {/* Text - only show if text exists */}
            {page.text && (
              <div className="flex-1 p-5 flex flex-col justify-between">
                <p className="font-body text-sm text-light-text dark:text-dark-text leading-relaxed">
                  {page.text}
                </p>
                <span className="text-xs text-light-outline dark:text-dark-text opacity-50 self-end">
                  {page.page} / {story.pages.length}
                </span>
              </div>
            )}

            {/* Page number when no text */}
            {!page.text && (
              <span className="absolute bottom-4 right-4 text-xs text-light-outline dark:text-dark-text opacity-50">
                {page.page} / {story.pages.length}
              </span>
            )}
          </div>

          
          
        ))}

        {/* Back Cover */}
        <div className="w-full h-full bg-light-primary dark:bg-dark-primary flex flex-col items-center justify-center
         p-8 text-center rounded-2xl">
          <p className="text-white text-lg font-semibold">The End</p>
          <p className="text-white/70 text-sm mt-4">
            Created with StoryBook Generator
          </p>
        </div>

      </HTMLFlipBook>
      </div>

      {/* Navigation Buttons */}
      {/* <div className="flex items-center gap-6">
        <button
          onClick={goPrev}
          className="px-6 py-2.5 rounded-xl border border-light-outline-secondary dark:border-dark-primary-30 text-light-text dark:text-dark-text font-body text-sm hover:bg-light-bg dark:hover:bg-dark-primary-10 transition-all"
        >
          ← Previous
        </button>
        <button
          onClick={goNext}
          className="px-6 py-2.5 rounded-xl bg-light-primary dark:bg-dark-primary text-white font-body text-sm hover:opacity-90 transition-all"
        >
          Next →
        </button>
      </div> */}
      {/* ── Bottom Controls ── */}
      <div className="flex items-center gap-2 mt-0 bg-white/65 backdrop-blur-md rounded-full px-4 py-2.5 shadow-lg border border-white/80">

        {/* Play/Pause */}
        <button
          onClick={() => setIsPlaying(p => !p)}
          className="w-8 h-8 rounded-full flex items-center justify-center text-[#5C3D2E] hover:bg-[rgba(92,61,46,0.08)] transition-all"
        >
          {isPlaying ? (
            <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
              <rect x="6" y="4" width="4" height="16"/>
              <rect x="14" y="4" width="4" height="16"/>
            </svg>
          ) : (
            <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="5 3 19 12 5 21 5 3"/>
            </svg>
          )}
        </button>

        <div className="w-px h-5 bg-[rgba(92,61,46,0.2)]" />

        {/* Prev */}
        <button
          onClick={goPrev}
          className="w-8 h-8 rounded-full flex items-center justify-center text-[#5C3D2E] hover:bg-[rgba(92,61,46,0.08)] transition-all"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
        </button>

        {/* Counter */}
        <span className="font-serif text-xs text-[#5C3D2E] min-w-[40px] text-center tracking-wide select-none">
          {currentPage + 1}/{totalPages}
        </span>

        {/* Next */}
        <button
          onClick={goNext}
          className="w-8 h-8 rounded-full flex items-center justify-center text-[#5C3D2E] hover:bg-[rgba(92,61,46,0.08)] transition-all"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6"/>
          </svg>
        </button>

        <div className="w-px h-5 bg-[rgba(92,61,46,0.2)]" />

        {/* Fullscreen */}
        <button
          onClick={() => document.documentElement.requestFullscreen?.()}
          className="w-8 h-8 rounded-full flex items-center justify-center text-[#5C3D2E] hover:bg-[rgba(92,61,46,0.08)] transition-all"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 3 21 3 21 9"/>
            <polyline points="9 21 3 21 3 15"/>
            <line x1="21" y1="3"  x2="14" y2="10"/>
            <line x1="3"  y1="21" x2="10" y2="14"/>
          </svg>
        </button>

        {/* Audio */}
        <button className="w-8 h-8 rounded-full flex items-center justify-center text-[#5C3D2E] opacity-50 cursor-not-allowed">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>
            <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
          </svg>
        </button>

        {/* Speed */}
        <button
          onClick={cycleSpeed}
          className="w-8 h-8 rounded-full flex items-center justify-center text-[#5C3D2E] font-serif text-[11px] hover:bg-[rgba(92,61,46,0.08)] transition-all"
        >
          {playSpeed}x
        </button>

        <div className="w-px h-5 bg-[rgba(92,61,46,0.2)]" />

        {/* Edit */}
        <button className="w-8 h-8 rounded-full flex items-center justify-center text-[#5C3D2E] hover:bg-[rgba(92,61,46,0.08)] transition-all">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
          </svg>
        </button>

      </div>

    </div>
  );
};

export default StoryFlipBook;
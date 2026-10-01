import HTMLFlipBook from 'react-pageflip';
import { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';


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
}

// Figma 798:2607: white pill bars with dark round buttons.
const darkBtn = 'rounded-full bg-light-outline text-white flex items-center justify-center hover:opacity-90 active:scale-95 transition-all disabled:opacity-40';
const Divider = () => <div className="hidden sm:block w-px h-10 bg-light-outline/60" />;

const StoryFlipBook = ({ story }: Props) => {
  
  // react-pageflip's ref exposes pageFlip(); typed loosely, as the library doesn't export it.
  const bookRef = useRef<{ pageFlip: () => { flipNext: () => void; flipPrev: () => void } | undefined }>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [isPlaying,   setIsPlaying]   = useState(false);
  const [playSpeed,   setPlaySpeed]   = useState(1);
  const [copied,      setCopied]      = useState(false);

  const totalPages = story.pages.length + 2;

  const goNext = () => bookRef.current?.pageFlip()?.flipNext();
  const goPrev = () => bookRef.current?.pageFlip()?.flipPrev();
  const onFlip = (e: { data: number }) => setCurrentPage(e.data);

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      if (currentPage >= totalPages - 1) { setIsPlaying(false); return; }
      bookRef.current?.pageFlip()?.flipNext();
    }, 5000 / playSpeed);
    return () => clearInterval(interval);
  }, [isPlaying, currentPage, playSpeed, totalPages]);

  const cycleSpeed = () => setPlaySpeed(s => s === 1 ? 1.5 : s === 1.5 ? 2 : 1);

  // Native share sheet where there is one, otherwise copy the link.
  const share = async () => {
    const url = window.location.href;
    if (navigator.share) {
      await navigator.share({ title: story.title, text: story.subtitle, url }).catch(() => {});
      return;
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt('Copy this link', url);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center gap-6 px-4 pt-6 pb-10 md:pt-10">

      {/* ── Header ── */}
      <div className="w-full max-w-5xl flex flex-col gap-6">
        <Link to="/dashboard" className="flex items-center gap-1.5 w-fit font-body text-sm text-light-outline hover:text-light-primary transition-colors">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
          Back to dashboard
        </Link>
        <div className="text-center">
          <h1 className="font-heading text-3xl md:text-5xl font-bold text-light-text leading-tight">
            {story.title}
          </h1>
          {story.subtitle && (
            <p className="font-body text-base text-light-outline mt-2">
              {story.subtitle}
            </p>
          )}
        </div>
      </div>

      {/* ── Top bar: download + share ── */}
      <div className="relative flex items-center gap-4 bg-white p-3 md:p-4 rounded-full shadow-sm">
        <button onClick={() => window.print()} className={`${darkBtn} w-12 h-12`} title="Download (print)" aria-label="Download">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 3v12M7 10l5 5 5-5"/>
            <path d="M5 21h14"/>
          </svg>
        </button>
        <button onClick={share} className={`${darkBtn} w-10 h-10`} title="Share" aria-label="Share">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="18" cy="5"  r="3"/>
            <circle cx="6"  cy="12" r="3"/>
            <circle cx="18" cy="19" r="3"/>
            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
            <line x1="15.41" y1="6.51"  x2="8.59"  y2="10.49"/>
          </svg>
        </button>
        {copied && (
          <span role="status" className="absolute left-1/2 -translate-x-1/2 top-full mt-2 whitespace-nowrap px-3 py-1 rounded-full bg-light-outline text-white font-body text-xs">
            Link copied
          </span>
        )}
      </div>

      {/* The Flipbook: two-page spread on wide screens, one page (portrait) when the screen is narrower than two pages */}
      <div className="w-full max-w-[900px]">
      <HTMLFlipBook
        ref={bookRef}
        width={450}
        height={530}
        size="stretch"
        minWidth={300}
        maxWidth={450}
        minHeight={350}
        maxHeight={530}
        showCover={true}
        flippingTime={700}
        className="shadow-2xl"
        style={{}}
        startPage={0}
        drawShadow={true}
        usePortrait={true}
        startZIndex={0}
        autoSize={true}
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
      <div className="w-full h-full relative rounded-2xl overflow-hidden">

        {/* Background Cover Image */}
        {story.pages?.[0]?.imageUrl ? (
          <img
            src={story.pages[0].imageUrl}
            alt="Comic Cover"
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-light-primary" />
        )}

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/40" />

        {/* Title & Subtitle on top */}
        <div className="absolute inset-0 flex flex-col items-center justify-between p-6 text-center">
          
          {/* Top: Title & Subtitle */}
          <div className="flex flex-col items-center gap-1">
            <h1 className="font-heading text-2xl font-bold text-white leading-tight drop-shadow-lg">
              {story.title}
            </h1>
            <p className="font-body text-sm text-white/90 drop-shadow-md">
              {story.subtitle}
            </p>
          </div>

          {/* Bottom: hint */}
          <p className="font-body text-xs text-white/60">
            Tap or drag to turn pages
          </p>

        </div>

      </div>

        {/* Story Pages */}
        {story.pages.map((page) => (
          <div
            key={page.page}
            className="w-full h-full bg-white flex flex-col overflow-hidden rounded-2xl"
          >
            {/* Image - full height if no text, 70% if text exists */}
            <div className={`w-full overflow-hidden ${page.text ? 'h-[70%]' : 'h-full'}`}>
              <img
                src={page.imageUrl}
                alt={`Page ${page.page}`}
                className="w-full h-full object-contain"
              />
            </div>

            {/* Text - only show if text exists */}
            {page.text && (
              <div className="flex-1 p-5 flex flex-col justify-between">
                <p className="font-body text-sm text-light-text leading-relaxed">
                  {page.text}
                </p>
                <span className="text-xs text-light-outline opacity-50 self-end">
                  {page.page} / {story.pages.length}
                </span>
              </div>
            )}

            {/* Page number when no text */}
            {!page.text && (
              <span className="absolute bottom-4 right-4 text-xs text-light-outline opacity-50">
                {page.page} / {story.pages.length}
              </span>
            )}
          </div>

          
          
        ))}

        {/* Back Cover */}
        <div className="w-full h-full bg-light-primary flex flex-col items-center justify-center
         p-8 text-center rounded-2xl">
          <p className="text-white text-lg font-semibold">The End</p>
          <p className="text-white/70 text-sm mt-4">
            Created with StoryBook Generator
          </p>
        </div>

      </HTMLFlipBook>
      </div>

      {/* ── Bottom Controls ── */}
      <div className="flex items-center gap-3 md:gap-6 bg-white rounded-full p-3 md:p-4 shadow-sm max-w-full">

        {/* Play/Pause */}
        <button onClick={() => setIsPlaying(p => !p)} className={`${darkBtn} w-12 h-12 shrink-0`} aria-label={isPlaying ? 'Pause' : 'Play'}>
          {isPlaying ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <rect x="6" y="4" width="4" height="16"/>
              <rect x="14" y="4" width="4" height="16"/>
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="6 4 20 12 6 20 6 4"/>
            </svg>
          )}
        </button>

        <Divider />

        {/* Prev / counter / next */}
        <div className="flex items-center gap-2 md:gap-4 h-10 px-2 md:px-4 rounded-full bg-light-outline text-white shrink-0">
          <button onClick={goPrev} disabled={currentPage === 0} className="w-6 h-6 flex items-center justify-center disabled:opacity-40" aria-label="Previous page">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
          </button>
          <span className="font-body text-sm font-semibold min-w-[40px] text-center select-none" aria-live="polite">
            {currentPage + 1}/{totalPages}
          </span>
          <button onClick={goNext} disabled={currentPage >= totalPages - 1} className="w-6 h-6 flex items-center justify-center disabled:opacity-40" aria-label="Next page">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
          </button>
        </div>

        <Divider />

        {/* Fullscreen */}
        <button onClick={() => document.documentElement.requestFullscreen?.()} className={`${darkBtn} w-10 h-10 shrink-0`} aria-label="Full screen">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/>
          </svg>
        </button>

        {/* Auto-play speed. Audio and Edit come back once narration audio and editing exist. */}
        <button onClick={cycleSpeed} className={`${darkBtn} h-9 px-3 font-body text-sm font-semibold shrink-0`} aria-label={`Auto-play speed ${playSpeed}x`}>
          {playSpeed}x
        </button>

      </div>

    </div>
  );
};

export default StoryFlipBook;

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
  back?: { to: string; label: string };
}

// Figma 798:2607: white pill bars with dark round buttons.
const darkBtn = 'rounded-full bg-light-outline text-white flex items-center justify-center hover:opacity-90 active:scale-95 transition-all disabled:opacity-40';
// Storage images are WebP, which jsPDF can't embed: redraw them as JPEG.
const toJpeg = async (url: string) => {
  const bitmap = await createImageBitmap(await (await fetch(url)).blob());
  const canvas = document.createElement('canvas');
  canvas.width = bitmap.width;
  canvas.height = bitmap.height;
  canvas.getContext('2d')!.drawImage(bitmap, 0, 0);
  return canvas.toDataURL('image/jpeg', 0.9);
};

const Divider = () => <div className="hidden sm:block w-px h-10 bg-light-outline/60" />;

const StoryFlipBook = ({ story, back = { to: '/dashboard', label: 'Back to dashboard' } }: Props) => {
  
  // react-pageflip's ref exposes pageFlip(); typed loosely, as the library doesn't export it.
  const bookRef = useRef<{ pageFlip: () => {
    flipNext: () => void;
    flipPrev: () => void;
    getBoundsRect: () => { left: number };
    getFlipController: () => { flip: (point: { x: number; y: number }) => void };
  } | undefined }>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [isPlaying,   setIsPlaying]   = useState(false);
  const [playSpeed,   setPlaySpeed]   = useState(1);
  const [notice,      setNotice]      = useState('');
  const flash = (message: string) => { setNotice(message); setTimeout(() => setNotice(''), 2500); };

  const totalPages = story.pages.length + 2;

  const goNext = () => bookRef.current?.pageFlip()?.flipNext();
  // page-flip's flipPrev starts at x=10 regardless of where the book sits. In single-page mode
  // that is the spine, so the page grew out of the spine instead of turning back. Start from
  // the book's real left edge, mirroring flipNext (which does use it).
  const goPrev = () => {
    const flip = bookRef.current?.pageFlip();
    if (!flip) return;
    if (landscape) flip.flipPrev();
    else flip.getFlipController().flip({ x: flip.getBoundsRect().left + 10, y: 1 });
  };
  const onFlip = (e: { data: number }) => setCurrentPage(e.data);

  // Two-page spreads only in landscape; portrait shows one page, so nothing to recentre.
  const [landscape, setLandscape] = useState(true);
  const onOrientation = (e: { data: string }) => setLandscape(e.data === 'landscape');
  const onInit = (e: { data: { mode: string } }) => setLandscape(e.data.mode === 'landscape');

  // Intro: the closed book slides in from the left, grows and settles with a tilt; opening straightens it.
  const [entered, setEntered] = useState(false);
  useEffect(() => { const t = setTimeout(() => setEntered(true), 50); return () => clearTimeout(t); }, []);
  const closedFront = currentPage === 0;
  const closedBack  = currentPage >= totalPages - 1;
  // A closed book is one page wide: shift it by half a page so the cover sits centred.
  const bookTransform = !entered ? 'translateX(calc(-50vw - 50%)) scale(0.5) rotate(-10deg)'
    : closedFront ? `translateX(${landscape ? '-25%' : '0'}) rotate(-3deg)`
    : closedBack  ? `translateX(${landscape ? '25%' : '0'}) rotate(3deg)`
    : 'none';

  // Page-edge stacks either side, as thick as the pages left on that side (up to 10px).
  const edge = (pages: number) => Math.round(Math.min(pages, totalPages) / totalPages * 10);
  // Portrait shows one page with the spine on its left, so only the right-hand stack is drawn.
  const leftEdge  = closedFront || !landscape ? 0 : edge(currentPage);
  const rightEdge = closedBack  ? 0 : edge(totalPages - 1 - currentPage);

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      if (currentPage >= totalPages - 1) { setIsPlaying(false); return; }
      bookRef.current?.pageFlip()?.flipNext();
    }, 5000 / playSpeed);
    return () => clearInterval(interval);
  }, [isPlaying, currentPage, playSpeed, totalPages]);

  const cycleSpeed = () => setPlaySpeed(s => s === 1 ? 1.5 : s === 1.5 ? 2 : 1);

  // A real PDF of the book: title page, one page per story page. jsPDF only loads on click.
  const [downloading, setDownloading] = useState(false);
  const download = async () => {
    setDownloading(true);
    try {
      const { jsPDF } = await import('jspdf');
      const W = 600, M = 36;
      const pdf = new jsPDF({ unit: 'pt', format: [W, W] });
      pdf.setFontSize(28).text(story.title, W / 2, W / 2 - 10, { align: 'center', maxWidth: W - 2 * M });
      if (story.subtitle) pdf.setFontSize(14).text(story.subtitle, W / 2, W / 2 + 30, { align: 'center', maxWidth: W - 2 * M });
      for (const page of story.pages) {
        const lines: string[] = page.text ? pdf.setFontSize(12).splitTextToSize(page.text, W - 2 * M) : [];
        pdf.addPage([W, lines.length ? W + 2 * M + lines.length * 16 : W]);
        if (page.imageUrl) pdf.addImage(await toJpeg(page.imageUrl), 'JPEG', 0, 0, W, W);
        if (lines.length) pdf.setFontSize(12).text(lines, M, W + M + 12);
      }
      pdf.save(`${story.title || 'story'}.pdf`);
    } catch (error) {
      console.error(error);
      flash('Could not create the PDF');
    } finally {
      setDownloading(false);
    }
  };

  // Native share sheet where there is one, otherwise copy the link.
  const share = async () => {
    const url = window.location.href;
    if (navigator.share) {
      await navigator.share({ title: story.title, text: story.subtitle, url }).catch(() => {});
      return;
    }
    try {
      await navigator.clipboard.writeText(url);
      flash('Link copied');
    } catch {
      window.prompt('Copy this link', url);
    }
  };

  return (
    // overflow-clip: the corner peel briefly draws the next page outside the book, which added page scrollbars.
    <div className="min-h-screen flex flex-col items-center gap-6 px-4 pt-6 pb-10 md:pt-10 overflow-clip">

      {/* ── Header ── */}
      <div className="w-full max-w-5xl flex flex-col gap-6">
        <Link to={back.to} className="flex items-center gap-1.5 w-fit font-body text-sm text-light-outline hover:text-light-primary transition-colors">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
          {back.label}
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
        <button onClick={download} disabled={downloading} className={`${darkBtn} w-12 h-12`} title="Download PDF" aria-label="Download PDF">
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
        {notice && (
          <span role="status" className="absolute left-1/2 -translate-x-1/2 top-full mt-2 whitespace-nowrap px-3 py-1 rounded-full bg-light-outline text-white font-body text-xs">
            {notice}
          </span>
        )}
      </div>

      {/* The Flipbook: two-page spread on wide screens, one page (portrait) when the screen is narrower than two pages */}
      <div
        className={`relative w-full ${landscape ? 'max-w-[900px]' : 'max-w-[450px]'} transition-transform duration-1000 ease-[cubic-bezier(.2,.8,.2,1)] motion-reduce:transition-none [filter:drop-shadow(0_20px_25px_rgb(0_0_0/0.25))]`}
        style={{ transform: bookTransform }}
      >
      {leftEdge > 0 && <div aria-hidden className="absolute top-[3px] bottom-[3px] right-[calc(100%-6px)] rounded-l-md page-edges" style={{ width: leftEdge + 6 }} />}
      {rightEdge > 0 && <div aria-hidden className="absolute top-[3px] bottom-[3px] left-[calc(100%-6px)] rounded-r-md page-edges" style={{ width: rightEdge + 6 }} />}
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
        className=""
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
        onInit={onInit}
        onChangeOrientation={onOrientation}
      >

      {/* Cover Page */}
      <div className="w-full h-full relative overflow-hidden rounded-r-md">

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

        {/* Story Pages: odd pages sit on the left of a spread, so their outer edge is the left one. */}
        {story.pages.map((page) => {
          const left = landscape && page.page % 2 === 1;
          return (
          <div
            key={page.page}
            className={`relative w-full h-full bg-[#fdfbf6] flex flex-col overflow-hidden ${left ? 'rounded-l-md' : 'rounded-r-md'}`}
          >
            {/* Image - full height if no text, 70% if text exists */}
            <div className={`w-full overflow-hidden ${page.text ? 'h-[70%]' : 'h-full'}`}>
              <img
                src={page.imageUrl}
                alt={`Page ${page.page}`}
                className="w-full h-full object-contain"
              />
            </div>

            {page.text && (
              <p className="flex-1 px-5 pt-5 pb-8 font-body text-sm text-light-text leading-relaxed">
                {page.text}
              </p>
            )}

            {/* Page number on the outer corner */}
            <span className={`absolute bottom-3 ${left ? 'left-4' : 'right-4'} text-xs text-light-outline opacity-60`}>
              {page.page}
            </span>

            {/* Shading where the page curves into the spine */}
            <div aria-hidden className={`pointer-events-none absolute inset-y-0 w-10 ${left
              ? 'right-0 bg-gradient-to-l from-black/15 via-black/5 to-transparent'
              : 'left-0 bg-gradient-to-r from-black/15 via-black/5 to-transparent'}`} />
          </div>
          );
        })}

        {/* Back Cover */}
        <div className={`w-full h-full ${landscape ? 'rounded-l-md' : 'rounded-r-md'} bg-light-primary flex flex-col items-center justify-center
         p-8 text-center`}>
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

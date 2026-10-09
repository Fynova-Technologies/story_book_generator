import { useCallback, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import StoryFlipBook from '../components/StoryFlipBook/StoryFlipBook';
import { storyCost } from '../services/credits';
import {
  BookPage, generateStory, loadBook, loadSharedBook, retryPage, SharedBook, StoryRow, UserFacingError, watchBook,
} from '../services/storyService';
import { RootState } from '../store/store';

const MAX_ATTEMPTS = 3;

// No Figma frame for these states: the wizard's panel, Georgia heading and primary buttons on the paper background.
const Message = ({ title, wide, children }: { title: string; wide?: boolean; children?: React.ReactNode }) => (
  <div className="min-h-screen flex items-center justify-center px-4 py-10">
    <div className={`w-full ${wide ? 'max-w-5xl' : 'max-w-xl'} rounded-[32px] bg-light-panel p-6 md:p-10 text-center flex flex-col items-center gap-4`}>
      <h1 className="font-heading text-3xl md:text-4xl font-bold text-light-text leading-tight">{title}</h1>
      {children}
    </div>
  </div>
);

const muted = 'font-body text-base text-light-outline';
const link = 'font-body text-sm font-semibold text-light-primary hover:underline underline-offset-2';
const primaryBtn = 'px-6 py-3 rounded-xl bg-light-primary text-white font-body text-base font-bold hover:opacity-90 active:scale-[0.99] transition-all disabled:opacity-50 disabled:cursor-not-allowed';
const errorText = 'font-body text-sm text-red-600';

// One tile per page: the picture once it's done, a soft placeholder while it's drawn, retry when it failed.
const PageGrid = ({ pages, onRetry, retrying }: { pages: BookPage[]; onRetry?: (page: number) => void; retrying: number | null }) => (
  <ul className="w-full grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 mt-2">
    {pages.map(page => {
      const triesLeft = MAX_ATTEMPTS - page.attempts;
      return (
        <li key={page.page} className="relative aspect-[45/53] rounded-2xl overflow-hidden bg-white shadow-sm">
          {page.status === 'done' && page.imageUrl ? (
            <img src={page.imageUrl} alt={`Page ${page.page}`} className="w-full h-full object-cover" />
          ) : page.status === 'failed' ? (
            <div className="w-full h-full flex flex-col items-center justify-center gap-2 p-3 bg-red-50 border border-red-200 rounded-2xl">
              <p className="font-body text-xs text-red-700">{triesLeft > 0 ? `${triesLeft} ${triesLeft === 1 ? 'try' : 'tries'} left` : 'No tries left'}</p>
              {onRetry && triesLeft > 0 && (
                <button
                  onClick={() => onRetry(page.page)}
                  disabled={retrying !== null}
                  className="px-3 py-1.5 rounded-lg bg-light-primary text-white font-body text-xs font-bold hover:opacity-90 disabled:opacity-50"
                >
                  {retrying === page.page ? 'Retrying…' : 'Retry page'}
                </button>
              )}
            </div>
          ) : (
            <div className="w-full h-full animate-pulse bg-linear-to-b from-white to-light-primary/10" />
          )}
          <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-white/80 backdrop-blur-sm font-body text-[11px] font-bold text-light-outline">
            Page {page.page}
          </span>
        </li>
      );
    })}
  </ul>
);

// Opened from a shared link (?ref=…): who made the book, and how to make your own. A native
// <dialog> brings focus handling, Escape and the backdrop.
const MadeByDialog = ({ creator, loggedIn }: { creator: string | null; loggedIn: boolean }) => {
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => { dialog.current?.showModal(); }, []);
  return (
    <dialog
      ref={dialog}
      aria-labelledby="made-by-title"
      onClick={e => { if (e.target === e.currentTarget) e.currentTarget.close(); }}
      className="m-auto w-[calc(100%-2rem)] max-w-md rounded-[32px] bg-white p-0 shadow-xl backdrop:bg-black/40 backdrop:backdrop-blur-sm"
    >
      <div className="flex flex-col items-center gap-4 p-6 md:p-8 text-center">
        <span className="w-14 h-14 rounded-full bg-light-primary/10 flex items-center justify-center text-light-primary" aria-hidden>
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2 4h7a3 3 0 0 1 3 3v13a2 2 0 0 0-2-2H2z"/>
            <path d="M22 4h-7a3 3 0 0 0-3 3v13a2 2 0 0 1 2-2h8z"/>
          </svg>
        </span>
        <h2 id="made-by-title" className="font-heading text-2xl md:text-3xl font-bold text-light-text leading-tight">
          {creator || 'Someone'} made this storybook
        </h2>
        <p className={muted}>Turn your own photos into an illustrated storybook in minutes.</p>
        <Link to={loggedIn ? '/create-story' : '/signup'} className={`${primaryBtn} w-full`}>
          {loggedIn ? 'Make your own' : 'Sign up to make your own'}
        </Link>
        {!loggedIn && <p className="font-body text-sm text-light-outline">Have an account? <Link className={link} to="/login">Log in</Link></p>}
        <form method="dialog">
          <button className={link}>Read the story</button>
        </form>
      </div>
    </dialog>
  );
};

const FlipBookPage = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const { status: loggedIn, userData, authInitialized } = useSelector((state: RootState) => state.auth);
  const [book, setBook] = useState<{ story: StoryRow; pages: BookPage[] } | null>(null);
  // Someone else's finished book, opened from its link.
  const [shared, setShared] = useState<SharedBook | null>(null);
  const [loadError, setLoadError] = useState(false);
  const [retryError, setRetryError] = useState<string | null>(null);
  const [retrying, setRetrying] = useState<number | null>(null); // page being retried, 0 = whole book

  const refresh = useCallback(() => {
    if (!id || !authInitialized) return;
    // Owners see every state of their book; everyone else only a finished book (RLS hides the rest).
    (loggedIn ? loadBook(id).then(setBook) : Promise.reject())
      .catch(() => loadSharedBook(id).then(setShared))
      .catch(error => { console.error('Could not load book:', error); setLoadError(true); });
  }, [id, loggedIn, authInitialized]);

  // Pages land one by one while the book is being made.
  useEffect(() => {
    refresh();
    return id && loggedIn ? watchBook(id, refresh) : undefined;
  }, [id, loggedIn, refresh]);

  // page undefined = make the whole book again (a new run, charged again).
  const retry = async (page?: number) => {
    setRetryError(null);
    setRetrying(page ?? 0);
    try {
      await (page === undefined ? generateStory(id!) : retryPage(id!, page));
      refresh();
    } catch (error) {
      setRetryError(error instanceof UserFacingError ? error.message : 'Could not retry this page. Please try again.');
    } finally {
      setRetrying(null);
    }
  };

  const home = loggedIn ? { to: '/dashboard', label: 'Back to dashboard' } : { to: '/', label: 'Home' };
  if (loadError) return <Message title="We couldn't open this book"><Link className={link} to={home.to}>{home.label}</Link></Message>;

  if (shared) {
    return (
      <>
        <StoryFlipBook story={shared} back={home} />
        <Link to={loggedIn ? '/create-story' : '/signup'} className="fixed top-4 right-4 z-30 px-4 py-2 rounded-full bg-light-primary text-white font-body text-sm font-bold shadow-lg hover:opacity-90">
          Make your own
        </Link>
        {searchParams.has('ref') && <MadeByDialog creator={shared.creator} loggedIn={loggedIn} />}
      </>
    );
  }

  if (!book) return <Message title="Opening your book…"><div className="w-10 h-10 rounded-full border-4 border-light-primary border-t-transparent animate-spin" role="status" aria-label="Loading" /></Message>;

  const { story, pages } = book;
  const done = pages.filter(page => page.status === 'done').length;

  if (story.status === 'completed') {
    // The ref tells whoever opens the link who made the book (MadeByDialog).
    const shareUrl = `${window.location.origin}/flipbook/${story.id}?ref=${userData?.uid}`;
    return <StoryFlipBook story={{ title: story.title || '', subtitle: story.subtitle || '', pages }} shareUrl={shareUrl} />;
  }

  if (story.status === 'generating') {
    return (
      <Message wide={pages.length > 0} title={pages.length ? 'Illustrating your book…' : 'Writing your story…'}>
        <p className={muted} aria-live="polite">
          {pages.length ? `${done} of ${pages.length} pages ready.` : 'This takes a minute or two.'} You can leave this page; we'll keep going.
        </p>
        {pages.length > 0 ? (
          <>
            <div className="w-full max-w-md h-2 rounded-full bg-light-primary/10 overflow-hidden">
              <div className="h-full rounded-full bg-light-primary transition-all duration-500" style={{ width: `${(done / pages.length) * 100}%` }} />
            </div>
            <PageGrid pages={pages} retrying={retrying} />
          </>
        ) : (
          <div className="w-10 h-10 rounded-full border-4 border-light-primary border-t-transparent animate-spin" aria-hidden />
        )}
        <Link className={link} to="/dashboard">Back to dashboard</Link>
      </Message>
    );
  }

  if (story.status === 'incomplete') {
    return (
      <Message wide title="A few pages need another try">
        <p className={muted}>{done} of {pages.length} pages are ready. Retrying a page is free.</p>
        {retryError && <p role="alert" className={errorText}>{retryError}</p>}
        <PageGrid pages={pages} onRetry={retry} retrying={retrying} />
        <Link className={link} to="/dashboard">Back to dashboard</Link>
      </Message>
    );
  }

  if (story.status === 'failed') {
    return (
      <Message title="We couldn't finish this book">
        <p className={muted}>{story.error || 'Something went wrong on our side.'} Your credits were refunded.</p>
        {retryError && <p role="alert" className={errorText}>{retryError}</p>}
        <button onClick={() => retry()} disabled={retrying !== null} className={primaryBtn}>
          {retrying !== null ? 'Starting…' : `Try again (${storyCost(story.story_length, !!story.narration)} credits)`}
        </button>
        <Link className={link} to="/dashboard">Back to dashboard</Link>
      </Message>
    );
  }

  return (
    <Message title="This story hasn't been generated yet">
      <p className={muted}>Finish the steps and press Generate to make your book.</p>
      <Link className={primaryBtn} to="/create-story">Continue creating</Link>
    </Message>
  );
};

export default FlipBookPage;

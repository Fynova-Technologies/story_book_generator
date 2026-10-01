import { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import StoryFlipBook from '../components/StoryFlipBook/StoryFlipBook';
import { STORY_COST } from '../services/credits';
import { BookPage, generateStory, loadBook, retryPage, StoryRow, UserFacingError, watchBook } from '../services/storyService';

const MAX_ATTEMPTS = 3;

const Message = ({ title, children }: { title: string; children?: React.ReactNode }) => (
  <div className="min-h-screen flex items-center justify-center bg-light-bg dark:bg-dark-bg px-6">
    <div className="max-w-md w-full text-center space-y-3">
      <h1 className="font-heading text-2xl font-bold text-light-text dark:text-dark-text">{title}</h1>
      {children}
    </div>
  </div>
);

const muted = 'font-body text-sm text-light-outline dark:text-dark-text';

const FlipBookPage = () => {
  const { id } = useParams<{ id: string }>();
  const [book, setBook] = useState<{ story: StoryRow; pages: BookPage[] } | null>(null);
  const [loadError, setLoadError] = useState(false);
  const [retryError, setRetryError] = useState<string | null>(null);

  const refresh = useCallback(() => {
    if (!id) return;
    loadBook(id).then(setBook).catch(error => { console.error('Could not load book:', error); setLoadError(true); });
  }, [id]);

  // Pages land one by one while the book is being made.
  useEffect(() => {
    refresh();
    return id ? watchBook(id, refresh) : undefined;
  }, [id, refresh]);

  // page undefined = make the whole book again (a new run, charged again).
  const retry = async (page?: number) => {
    setRetryError(null);
    try {
      await (page === undefined ? generateStory(id!) : retryPage(id!, page));
      refresh();
    } catch (error) {
      setRetryError(error instanceof UserFacingError ? error.message : 'Could not retry this page. Please try again.');
    }
  };

  if (loadError) return <Message title="We couldn't open this book"><Link className={muted} to="/dashboard">Back to dashboard</Link></Message>;
  if (!book) return <Message title="Loading..." />;

  const { story, pages } = book;
  const done = pages.filter(page => page.status === 'done').length;

  if (story.status === 'completed') {
    return (
      <div className='bg-light-bg'>
        <StoryFlipBook story={{ title: story.title || '', subtitle: story.subtitle || '', pages }} />
      </div>
    );
  }

  if (story.status === 'generating') {
    return (
      <Message title={pages.length ? 'Illustrating your book...' : 'Writing your story...'}>
        <p className={muted} aria-live="polite">
          {pages.length ? `${done} of ${pages.length} pages ready.` : 'This takes a minute or two.'} You can leave this page; we'll keep going.
        </p>
      </Message>
    );
  }

  if (story.status === 'incomplete') {
    const failed = pages.filter(page => page.status === 'failed');
    return (
      <Message title="A few pages need another try">
        <p className={muted}>{done} of {pages.length} pages are ready. Retrying a page is free.</p>
        {retryError && <p role="alert" className="text-red-500 text-sm">{retryError}</p>}
        <ul className="space-y-2">
          {failed.map(page => (
            <li key={page.page} className="flex items-center justify-between gap-3 p-3 rounded-xl border border-light-outline-secondary dark:border-dark-primary-30">
              <span className={muted}>Page {page.page} · {MAX_ATTEMPTS - page.attempts} {MAX_ATTEMPTS - page.attempts === 1 ? 'try' : 'tries'} left</span>
              <button
                onClick={() => retry(page.page)}
                className="px-4 py-1.5 rounded-lg bg-light-primary dark:bg-dark-primary text-light-on-primary font-body text-sm font-semibold hover:opacity-90"
              >
                Retry page
              </button>
            </li>
          ))}
        </ul>
      </Message>
    );
  }

  if (story.status === 'failed') {
    return (
      <Message title="We couldn't finish this book">
        <p className={muted}>{story.error || 'Something went wrong on our side.'} Your credits were refunded.</p>
        {retryError && <p role="alert" className="text-red-500 text-sm">{retryError}</p>}
        <button
          onClick={() => retry()}
          className="px-4 py-2 rounded-lg bg-light-primary dark:bg-dark-primary text-light-on-primary font-body text-sm font-semibold hover:opacity-90"
        >
          Try again ({STORY_COST} credits)
        </button>
        <br />
        <Link className={muted} to="/dashboard">Back to dashboard</Link>
      </Message>
    );
  }

  return <Message title="This story hasn't been generated yet"><Link className={muted} to="/create-story">Continue creating</Link></Message>;
};

export default FlipBookPage;

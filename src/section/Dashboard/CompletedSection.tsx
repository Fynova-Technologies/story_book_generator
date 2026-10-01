import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import StoryCard from '../../components/StoryCard/StoryCard';
import { coverUrls, listStories, searchAndSort, StoryRow, StorySort, StoryStatus } from '../../services/storyService';
import { resetWizard } from '../../store/slices/storyWizardSlice';
import { RootState } from '../../store/store';
import { userInitial } from '../../components/Sidebar/user';
const storyimg1 = "/assets/images/storyimg1.png";
const completed = "/assets/icons/Dashboard/Completed.png";

// Every book past the draft stage, so in-progress and failed ones can be opened too.
const BOOK_STATUSES: StoryStatus[] = ['generating', 'incomplete', 'completed', 'failed'];
const STATUS_LABEL: Partial<Record<StoryStatus, string>> = {
  generating: 'Being created...',
  incomplete: 'Some pages need a retry',
  failed:     "Couldn't be finished",
};

const bookTitle = (row: StoryRow) => row.title || row.template || 'Untitled story';

interface CompletedSectionProps {
  query?: string;
  sort?: StorySort;
  hideViewAll?: boolean;
}

function CompletedSection({ query = '', sort = 'newest', hideViewAll = false }: CompletedSectionProps) {
    const [stories, setStories] = useState<StoryRow[]>([]);
    const [covers, setCovers] = useState(new Map<string, string>());
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const user = useSelector((state: RootState) => state.auth.userData);
    const shown = searchAndSort(stories, query, sort, bookTitle);

    useEffect(() => {
      listStories(BOOK_STATUSES)
        .then(async rows => { setStories(rows); setCovers(await coverUrls(rows.map(row => row.id))); })
        .catch(error => { console.error('Could not load stories:', error); setError(true); })
        .finally(() => setLoading(false));
    }, []);
  return (
     <section className="pb-8">
          <div className="flex items-center justify-between gap-4 mb-3.5">
            <div className="flex items-center gap-2.5">
              <img src={completed} alt="completed" className="w-5 h-5 object-contain" />
              <h2 className="font-body text-xl font-bold text-light-text">
                Completed Stories
              </h2>
            </div>

            {!hideViewAll && <button
              onClick={() => navigate('/dashboard/collection')}
              className="font-body flex items-center gap-1 text-xs text-light-primary font-bold hover:underline underline-offset-2 transition-all">
              View all
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </button>}
          </div>

          {loading ? (
            <p className="font-body text-sm text-light-outline">Loading your stories…</p>
          ) : error ? (
            <p className="font-body text-sm text-red-500">We couldn't load your stories. Please refresh the page to try again.</p>
          ) : !shown.length && (
            query.trim() ? (
              <p className="font-body text-sm text-light-outline">No stories match your search.</p>
            ) : (
              <div className="flex items-center gap-4">
                <p className="font-body text-sm text-light-outline">No stories yet.</p>
                <button
                  onClick={() => { dispatch(resetWizard()); navigate('/create-story'); }}
                  className="font-body text-sm font-semibold text-light-on-primary px-4 py-2 rounded-lg bg-light-primary hover:opacity-90 transition-all">
                  Create a story
                </button>
              </div>
            )
          )}

          
          <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-5">
            {shown.map((story) => (
              <StoryCard
                key={story.id}
                image={covers.get(story.id) || storyimg1}
                title={bookTitle(story)}
                description={STATUS_LABEL[story.status] || story.subtitle || ''}
                author="You"
                authorInitial={userInitial(user)}
                onViewStory={() => navigate(`/flipbook/${story.id}`)}
              />
            ))}
          </div>

        </section>

  )
}

export default CompletedSection

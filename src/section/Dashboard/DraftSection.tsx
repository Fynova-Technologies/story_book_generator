const storyimg1 = "/assets/images/storyimg1.png";
const draft = "/assets/icons/Dashboard/Draft.png";
import DraftCard from '../../components/DraftCard/DraftCard';
import { useDraftRestore } from '../../hooks/useDraftRestore';
import { formatLastSaved, searchAndSort, StoryRow, StorySort } from '../../services/storyService';
import { useDispatch, useSelector } from 'react-redux';
import { resetWizard, setCurrentDraftId } from '../../store/slices/storyWizardSlice';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../../store/store';
import { userInitial } from '../../components/Sidebar/user';

// Same images as the template picker (section/CreateStory/TemplateSelection.tsx).
const TEMPLATE_IMAGES: Record<string, string> = {
  "Birthday & Celebrations":      "/assets/images/templete/Birthday.png",
  "Love & Romance":               "/assets/images/templete/LoveRomance.png",
  "Heartfelt Apologies":          "/assets/images/templete/Apology.png",
  "Wedding Memories":             "/assets/images/templete/Weeding.png",
  "Long Distance Relations":      "/assets/images/templete/Longdistance.png",
  "Pet Memorial Tributes":        "/assets/images/templete/Petmemorial.png",
  "Graduation Milestones":        "/assets/images/templete/Graduation.png",
  "Family Heritage & History":    "/assets/images/templete/Familyheritage.png",
  "Travel Adventures":            "/assets/images/templete/Travel.png",
  "Retirement Celebrations":      "/assets/images/templete/Retirement.png",
  "Educational Stories for Kids": "/assets/images/templete/Educational.png",
  "Thank You & Gratitude":        "/assets/images/templete/Thankyou.png",
};

const draftTitle = (row: StoryRow) => row.template || 'My own story';

interface DraftSectionProps {
  query?: string;
  sort?: StorySort;
  hideViewAll?: boolean;
}

function DraftSection({ query = '', sort = 'newest', hideViewAll = false }: DraftSectionProps) {
  const navigate = useNavigate();
  const { drafts, loading, error, restoreDraftById, deleteDraftById } = useDraftRestore();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.userData);
  const shown = searchAndSort(drafts, query, sort, draftTitle);

  const handleNewDraft = () => {
    dispatch(resetWizard());
    dispatch(setCurrentDraftId(null)); // New draft
    navigate('/create-story');
  };

  return (
    <section>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <img src={draft} alt="drafts" className="w-4 h-4" />
              <h2 className="font-display text-base font-bold text-light-text dark:text-dark-text">
                Your Drafts
              </h2>
            </div>
            {!hideViewAll && <button
              onClick={() => navigate('/dashboard/collection')}
              className="font-body flex items-center gap-1 text-sm text-light-primary dark:text-dark-primary font-medium hover:underline underline-offset-2 transition-all">
              View all →
            </button>}
          </div>

          {loading ? (
            <p className="font-body text-sm text-light-outline mb-4">Loading your drafts…</p>
          ) : error ? (
            <p className="font-body text-sm text-red-500 mb-4">We couldn't load your drafts. Please refresh the page to try again.</p>
          ) : !shown.length && (
            <p className="font-body text-sm text-light-outline mb-4">
              {query.trim() ? 'No drafts match your search.' : 'No drafts yet.'}
            </p>
          )}

          {/* ✅ Same width cards using grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4">

            {/* Draft Cards */}
            {shown.map((draft) => (
              <DraftCard
                key={draft.id}
                image={TEMPLATE_IMAGES[draft.template] || storyimg1}
                title={draftTitle(draft)}
                authorInitial={userInitial(user)}
                editedAt={formatLastSaved(draft.updated_at)}
                onContinue={() => {
                  restoreDraftById(draft.id)
                    .then(() => navigate('/create-story'))
                    .catch(error => { console.error('Could not open draft:', error); alert("We couldn't open this draft. Please try again."); });
                }}
                onDelete={() => {
                  deleteDraftById(draft.id).catch(error => { console.error('Could not delete draft:', error); alert("We couldn't delete this draft. Please try again."); });
                }}
              />
            ))}

            {/* New Draft Card — same size as DraftCard */}
            <div 
            className="rounded-xl border-2 border-dashed border-light-outline-secondary dark:border-dark-primary-30
             bg-light-on-primary/50 dark:bg-dark-primary-10 flex flex-col items-center justify-center
              gap-2 cursor-pointer hover:border-light-primary dark:hover:border-dark-primary
            hover:bg-dark-primary-10 transition-all group aspect-3/4" 
            onClick={handleNewDraft}>
              <div className="w-10 h-10 rounded-full bg-dark-primary-10 flex items-center justify-center group-hover:bg-light-primary/20 transition-colors">
                <span className="text-light-primary dark:text-dark-primary text-2xl font-light leading-none">+</span>
              </div>
              <p className="font-body text-sm font-semibold text-light-primary dark:text-dark-primary">
                New Draft
              </p>
              <p className="font-body text-[11px] text-light-outline dark:text-dark-text text-center px-3 leading-snug">
                Start a fresh adventure from scratch
              </p>
            </div>

          </div>
        </section>
  )
}

export default DraftSection

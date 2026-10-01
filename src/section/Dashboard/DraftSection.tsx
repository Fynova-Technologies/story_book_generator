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
          <div className="flex items-center justify-between gap-4 mb-3.5">
            <div className="flex items-center gap-2.5">
              <img src={draft} alt="drafts" className="w-5 h-5 object-contain" />
              <h2 className="font-body text-xl font-bold text-light-text">
                Your Drafts
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
            <p className="font-body text-sm text-light-outline mb-4">Loading your drafts…</p>
          ) : error ? (
            <p className="font-body text-sm text-red-500 mb-4">We couldn't load your drafts. Please refresh the page to try again.</p>
          ) : !shown.length && (
            <p className="font-body text-sm text-light-outline mb-4">
              {query.trim() ? 'No drafts match your search.' : 'No drafts yet.'}
            </p>
          )}

          
          <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-5">

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

            {/* New Draft Card */}
            <button
              type="button"
              onClick={handleNewDraft}
              className="min-h-[240px] rounded-[13px] border-2 border-dashed border-light-primary/30 bg-[#FDFBF7]
                flex flex-col items-center justify-center gap-2 p-5 hover:border-light-primary transition-colors group">
              <span className="w-[53px] h-[53px] mb-2 rounded-full bg-dark-primary-10 flex items-center justify-center group-hover:bg-light-primary/20 transition-colors">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="text-light-primary"><path d="M12 5v14M5 12h14"/></svg>
              </span>
              <span className="font-body text-[15px] font-bold text-light-primary">
                New Draft
              </span>
              <span className="font-body text-[10px] text-light-outline text-center leading-snug">
                Start a fresh adventure from scratch
              </span>
            </button>

          </div>
        </section>
  )
}

export default DraftSection

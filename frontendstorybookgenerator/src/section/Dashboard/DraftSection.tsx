import storyimg1 from "../../assets/images/storyimg1.png"
import draft from "../../assets/icons/Dashboard/Draft.png"
import DraftCard from '../../components/DraftCard/DraftCard';
import avatar from "../../assets/images/sampleavatar.png"
import { useDraftRestore } from '../../hooks/useDraftRestore';
import { formatLastSaved } from '../../services/draftService';
import { useDispatch } from 'react-redux';
import { resetWizard, setCurrentDraftId } from '../../store/slices/storyWizardSlice';
import { useNavigate } from 'react-router-dom';


function DraftSection() {
  const navigate = useNavigate();
  const { drafts, restoreDraftById, deleteDraftById } = useDraftRestore();
  const dispatch = useDispatch();

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
            <button className="font-body flex items-center gap-1 text-sm text-light-primary dark:text-dark-primary font-medium hover:underline underline-offset-2 transition-all">
              View all →
            </button>
          </div>

          {/* ✅ Same width cards using grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4">

            {/* Draft Cards */}
            {drafts.map((draft) => (
              <DraftCard
                key={draft.id}
                image={storyimg1} // Placeholder, maybe use a default or generate based on draft
                title={draft.template || 'Untitled Draft'}
                authorAvatar={avatar}
                editedAt={formatLastSaved(draft.lastSavedAt)}
                onContinue={() => {
                  restoreDraftById(draft.id);
                  navigate('/create-story');
                }}
                onDelete={() => deleteDraftById(draft.id)}
              />
            ))}

            {/* New Draft Card — same size as DraftCard */}
            <div 
            className="rounded-xl border-2 border-dashed border-light-outline-secondary dark:border-dark-primary-30
             bg-light-on-primary/50 dark:bg-dark-primary-10 flex flex-col items-center justify-center
              gap-2 cursor-pointer hover:border-light-primary dark:hover:border-dark-primary
            hover:bg-dark-primary-10 transition-all group aspect-[3/4]" 
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

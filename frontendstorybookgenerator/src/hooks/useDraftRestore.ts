import { useEffect, useState }    from 'react';
import { useDispatch,useSelector }   from 'react-redux';
import { resetWizard, restoreDraft }           from '../store/slices/storyWizardSlice';
import {
  loadDraftFromLocal,
  hasDraft,
  formatLastSaved,
  Draft,
} from '../services/draftService';
import { RootState } from '../store/store';

interface UseDraftRestoreReturn {
  draftExists:     boolean;
  draft:           Draft | null;
  lastSavedText:   string;
  restoreConfirmed: () => void;    // user clicked "Continue"
  discardDraft:    () => void;     // user clicked "Start Fresh"
}

export const useDraftRestore = (): UseDraftRestoreReturn => {
  const dispatch = useDispatch();
  const user     = useSelector((state: RootState) => state.auth.userData);

  const [draftExists,   setDraftExists]   = useState(false);
  const [draft,         setDraft]         = useState<Draft | null>(null);
  const [lastSavedText, setLastSavedText] = useState('');

  useEffect(() => {
    if (!user?.uid) return;

    // check LocalStorage for existing draft
    if (hasDraft(user.uid)) {
      const savedDraft = loadDraftFromLocal(user.uid);

      if (savedDraft) {
        setDraft(savedDraft);
        setDraftExists(true);
        setLastSavedText(formatLastSaved(savedDraft.lastSavedAt));
      }
    }
  }, [user?.uid]);

  // user clicked "Continue Story"
  const restoreConfirmed = () => {
    if (!draft) return;

    // restore all wizard fields to Redux
    dispatch(restoreDraft({
      template:      draft.template,
      questionnaire: draft.questionnaire,
      artStyle:      draft.artStyle,
      narration:     draft.narration,
      story:         draft.story,
    }));

    setDraftExists(false);
    console.log('Draft restored to Redux successfully');
  };

  // user clicked "Start Fresh"
  const discardDraft = () => {
    if (!user?.uid) return;

    // remove from localStorage
    localStorage.removeItem(`storybook_draft_${user.uid}`);
    localStorage.removeItem(`step_${user.uid}`);
    dispatch(resetWizard());

    setDraftExists(false);
    setDraft(null);
    console.log('Draft discarded');
  };

  return {
    draftExists,
    draft,
    lastSavedText,
    restoreConfirmed,
    discardDraft,
  };
};
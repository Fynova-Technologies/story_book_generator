import { useEffect, useState }    from 'react';
import { useDispatch,useSelector }   from 'react-redux';
import { restoreDraft, setCurrentDraftId }           from '../store/slices/storyWizardSlice';
import {
  loadAllDraftsFromLocal,
  loadDraftFromLocal,
  hasDrafts,
  deleteDraftFromLocal,
  Draft,
} from '../services/draftService';
import { RootState } from '../store/store';

interface UseDraftRestoreReturn {
  drafts:           Draft[];
  draftsExist:      boolean;
  restoreDraftById: (draftId: string) => void;
  deleteDraftById:  (draftId: string) => void;
}

export const useDraftRestore = (): UseDraftRestoreReturn => {
  const dispatch = useDispatch();
  const user     = useSelector((state: RootState) => state.auth.userData);

  const [drafts,     setDrafts]     = useState<Draft[]>([]);
  const [draftsExist, setDraftsExist] = useState(false);

  useEffect(() => {
    if (!user?.uid) return;

    // check LocalStorage for existing drafts
    if (hasDrafts(user.uid)) {
      const savedDrafts = loadAllDraftsFromLocal(user.uid);
      setDrafts(savedDrafts);
      setDraftsExist(true);
    }
  }, [user?.uid]);

  // restore draft by ID
  const restoreDraftById = (draftId: string) => {
    if (!user?.uid) return;

    const draft = loadDraftFromLocal(user.uid, draftId);
    if (!draft) return;

    // restore all wizard fields to Redux
    dispatch(restoreDraft({
      template:      draft.template,
      questionnaire: draft.questionnaire,
      artStyle:      draft.artStyle,
      storyStyle:    draft.storyStyle,
      narration:     draft.narration,
      story:         draft.story,
    }));
    dispatch(setCurrentDraftId(draftId));

    console.log('Draft restored to Redux successfully');
  };

  // delete draft by ID
  const deleteDraftById = (draftId: string) => {
    if (!user?.uid) return;

    deleteDraftFromLocal(user.uid, draftId);

    // Update local state
    setDrafts(prev => prev.filter(d => d.id !== draftId));
    if (drafts.length === 1) {
      setDraftsExist(false);
    }

    console.log('Draft deleted');
  };

  return {
    drafts,
    draftsExist,
    restoreDraftById,
    deleteDraftById,
  };
};
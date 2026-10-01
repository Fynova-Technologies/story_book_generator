import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { restoreDraft, resetWizard, setCurrentDraftId } from '../store/slices/storyWizardSlice';
import { deleteStory, listStories, loadDraft, StoryRow } from '../services/storyService';
import { RootState } from '../store/store';

export const useDraftRestore = () => {
  const dispatch = useDispatch();
  const user     = useSelector((state: RootState) => state.auth.userData);
  const [drafts, setDrafts] = useState<StoryRow[]>([]);

  useEffect(() => {
    if (!user?.uid) return;
    listStories(['draft']).then(setDrafts).catch(error => console.error('Could not load drafts:', error));
  }, [user?.uid]);

  // Loads the draft, photos included, into the wizard.
  const restoreDraftById = async (draftId: string) => {
    const { story, images } = await loadDraft(draftId);
    dispatch(resetWizard());
    dispatch(restoreDraft({
      template:      story.template,
      questionnaire: story.questionnaire,
      artStyle:      story.art_style,
      storyStyle:    story.story_style,
      narration:     story.narration,
      story:         story.custom_story,
      images,
      wizardStep:    story.wizard_step,
    }));
    dispatch(setCurrentDraftId(draftId));
  };

  const deleteDraftById = async (draftId: string) => {
    await deleteStory(draftId);
    setDrafts(prev => prev.filter(draft => draft.id !== draftId));
  };

  return { drafts, draftsExist: drafts.length > 0, restoreDraftById, deleteDraftById };
};

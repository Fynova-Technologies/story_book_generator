import {configureStore} from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import storyWizardReducer, { setCurrentDraftId } from './slices/storyWizardSlice'
import generatedStoryReducer from './slices/generatedStorySlice'
import { saveDraftToLocal } from '../services/draftService';


// actions that trigger a draft save
const WIZARD_ACTIONS = [
  'storyWizard/setTemplate',
  'storyWizard/setQuestionnaire',
  'storyWizard/setArtStyle',
  'storyWizard/setNarration',
];

const draftMiddleware = (storeAPI: any) => (next: any) => (action: any) => {
  const result = next(action);  // run reducer first

  if (WIZARD_ACTIONS.includes(action.type)) {
    const state  = storeAPI.getState();
    const userId = state.auth.userData?.uid;

    if (userId) {
      // get currentStepIndex from localStorage if available
      const currentStep = parseInt(
        localStorage.getItem(`step_${userId}`) || '0'
      );
      const savedDraftId = saveDraftToLocal(userId, state.story, currentStep);
      if (savedDraftId && !state.story.currentDraftId) {
        storeAPI.dispatch(setCurrentDraftId(savedDraftId));
      }
    }
  }

  return result;
};

export const store = configureStore({
    reducer: {
        auth: authReducer,
        story: storyWizardReducer,
        generatedStory: generatedStoryReducer,
    },
    middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(draftMiddleware),

})
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
import { StoryWizardState } from '../store/slices/storyWizardSlice';

// ── Types ──────────────────────────────────────────────────
export interface Draft {
  userId:           string;
  template:         string;
  questionnaire:    Record<string, string>;
  story:            string;
  artStyle:         string;
  narration:        string;
  currentStepIndex: number;
  lastSavedAt:      string;
  status:           'draft' | 'completed';
}

// ── Key generator — unique per user ───────────────────────
const getDraftKey = (userId: string) => `storybook_draft_${userId}`;

// ── Save draft ─────────────────────────────────────────────
export const saveDraftToLocal = (
  userId:           string,
  wizardState:      StoryWizardState | undefined,
  currentStepIndex: number
): void => {
  if (!wizardState) {
    console.warn('Skipping draft save because wizard state is undefined');
    return;
  }

  try {
    const draft: Draft = {
      userId,
      template:         wizardState.template,
      questionnaire:    wizardState.questionnaire,
      artStyle:         wizardState.artStyle,
      narration:        wizardState.narration,
      story:            wizardState.story,
      currentStepIndex,
      lastSavedAt:      new Date().toISOString(),
      status:           'draft',
      // images not saved here — base64 too large for LocalStorage
    };

    localStorage.setItem(getDraftKey(userId), JSON.stringify(draft));
    console.log('Draft saved to LocalStorage');

  } catch (error) {
    // LocalStorage might be full
    console.warn('Failed to save draft to LocalStorage:', error);
  }
};

// ── Load draft ─────────────────────────────────────────────
export const loadDraftFromLocal = (userId: string): Draft | null => {
  try {
    const raw = localStorage.getItem(getDraftKey(userId));
    if (!raw) return null;
    return JSON.parse(raw) as Draft;
  } catch {
    return null;
  }
};

// ── Delete draft ───────────────────────────────────────────
export const deleteDraftFromLocal = (userId: string): void => {
  localStorage.removeItem(getDraftKey(userId));
  console.log('Draft deleted from LocalStorage');
};

// ── Check if draft exists ──────────────────────────────────
export const hasDraft = (userId: string): boolean => {
  return localStorage.getItem(getDraftKey(userId)) !== null;
};

// ── Format last saved time for display ────────────────────
export const formatLastSaved = (isoString: string): string => {
  const saved = new Date(isoString);
  const now   = new Date();
  const diff  = Math.floor((now.getTime() - saved.getTime()) / 1000);

  if (diff < 60)   return 'Just now';
  if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
  return `${Math.floor(diff / 86400)} days ago`;
};
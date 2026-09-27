import { StoryWizardState } from '../store/slices/storyWizardSlice';

// ── Types ──────────────────────────────────────────────────
export interface Draft {
  id:              string;
  userId:          string;
  template:        string;
  questionnaire:   Record<string, string>;
  story:           string;
  artStyle:        string;
  storyStyle:      string;
  narration:       string;
  currentStepIndex: number;
  lastSavedAt:     string;
  status:          'draft' | 'completed';
}

// ── Key generator — unique per user ───────────────────────
const getDraftsKey = (userId: string) => `storybook_drafts_${userId}`;

// ── Save draft ─────────────────────────────────────────────
export const saveDraftToLocal = (
  userId:           string,
  wizardState:      StoryWizardState | undefined,
  currentStepIndex: number
): string | null => {
  if (!wizardState) {
    console.warn('Skipping draft save because wizard state is undefined');
    return null;
  }

  try {
    const draftsKey = getDraftsKey(userId);
    const existingDrafts: Draft[] = JSON.parse(localStorage.getItem(draftsKey) || '[]');

    const draftId = wizardState.currentDraftId || Date.now().toString();

    const draft: Draft = {
      id: draftId,
      userId,
      template:         wizardState.template,
      questionnaire:    wizardState.questionnaire,
      artStyle:         wizardState.artStyle,
      storyStyle:       wizardState.storyStyle,
      narration:        wizardState.narration,
      story:            wizardState.story,
      currentStepIndex,
      lastSavedAt:      new Date().toISOString(),
      status:           'draft',
      // images not saved here — base64 too large for LocalStorage
    };

    // Remove existing draft with same ID if exists
    const filteredDrafts = existingDrafts.filter(d => d.id !== draftId);
    filteredDrafts.push(draft);

    localStorage.setItem(draftsKey, JSON.stringify(filteredDrafts));
    console.log('Draft saved to LocalStorage');

    return draftId;

  } catch (error) {
    // LocalStorage might be full
    console.warn('Failed to save draft to LocalStorage:', error);
    return null;
  }
};

// ── Load draft by ID ───────────────────────────────────────
export const loadDraftFromLocal = (userId: string, draftId: string): Draft | null => {
  try {
    const draftsKey = getDraftsKey(userId);
    const drafts: Draft[] = JSON.parse(localStorage.getItem(draftsKey) || '[]');
    return drafts.find(d => d.id === draftId) || null;
  } catch {
    return null;
  }
};

// ── Load all drafts ─────────────────────────────────────────
export const loadAllDraftsFromLocal = (userId: string): Draft[] => {
  try {
    const draftsKey = getDraftsKey(userId);
    return JSON.parse(localStorage.getItem(draftsKey) || '[]');
  } catch {
    return [];
  }
};

// ── Delete draft by ID ─────────────────────────────────────
export const deleteDraftFromLocal = (userId: string, draftId: string): void => {
  try {
    const draftsKey = getDraftsKey(userId);
    const drafts: Draft[] = JSON.parse(localStorage.getItem(draftsKey) || '[]');
    const filteredDrafts = drafts.filter(d => d.id !== draftId);
    localStorage.setItem(draftsKey, JSON.stringify(filteredDrafts));
    console.log('Draft deleted from LocalStorage');
  } catch (error) {
    console.warn('Failed to delete draft from LocalStorage:', error);
  }
};

// ── Check if any drafts exist ──────────────────────────────
export const hasDrafts = (userId: string): boolean => {
  const drafts = loadAllDraftsFromLocal(userId);
  return drafts.length > 0;
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
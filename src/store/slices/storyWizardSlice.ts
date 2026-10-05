import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface StoryImage {
  image: string | null;
  description: string;
  // Who is in the photo. Photos with the same name are treated as one character.
  characterName: string;
  // Set once the photo is uploaded to Storage; image is then a signed URL or the original data URL.
  path?: string;
}
export interface StoryWizardState {
  template:      string;
  images:        StoryImage[];
  story:         string;
  questionnaire: Record<string, string>;
  storyStyle:    string;
  narration:     string;
  currentDraftId: string | null;
  wizardStep:    number;
  // The user picked "Write my own story" instead of a template.
  customStory:   boolean;
}

const initialState: StoryWizardState = {
  template:      '',
  images:        [],
  story:         '',
  questionnaire: {},
  storyStyle:    '',
  narration:     '',
  currentDraftId: null,
  wizardStep:    0, // starts at "Select Template"
  customStory:   false,
};

const storyWizardSlice = createSlice({
  name: 'storyWizard',
  initialState,
  reducers: {
    setTemplate: (state, action: PayloadAction<string>) => { 
        state.template = action.payload; 
        state.customStory = false;
    },
    // Template answers win over the custom story when generating, so drop both.
    chooseCustomStory: (state) => {
        state.customStory   = true;
        state.template      = '';
        state.questionnaire = {};
    },
    setImages:(state, action: PayloadAction<StoryImage[]>)=> {
        state.images = action.payload;
    },
    setCustomStory:(state, action: PayloadAction<string>) => { 
        state.story = action.payload; 
    },
    setQuestionnaire: (state, action: PayloadAction<Record<string,string>>) => {
         state.questionnaire = action.payload; 
    },
    setStoryStyle:(state, action: PayloadAction<string>) => { 
        state.storyStyle    = action.payload; 
    },
    setNarration:(state, action: PayloadAction<string>) => { 
        state.narration     = action.payload; 
    },
    setCurrentDraftId: (state, action: PayloadAction<string | null>) => {
        state.currentDraftId = action.payload;
    },
    resetWizard:() => initialState,

    restoreDraft: (state, action: PayloadAction<Partial<StoryWizardState>>) => {
    const draft = action.payload;
    if (draft.template)      state.template      = draft.template;
    if (draft.questionnaire) state.questionnaire = draft.questionnaire;
    if (draft.story)         state.story         = draft.story;
    if (draft.storyStyle)    state.storyStyle    = draft.storyStyle;
    if (draft.narration)     state.narration     = draft.narration;
    if (draft.images)        state.images        = draft.images;
    if (draft.wizardStep !== undefined) state.wizardStep = draft.wizardStep;
    state.customStory = !state.template && !!state.story.trim();
  },
  },
});

export const {
  setTemplate,
  chooseCustomStory,
  setImages,
  setCustomStory,
  setQuestionnaire,
  setStoryStyle,
  setNarration,
  setCurrentDraftId,
  resetWizard,
  restoreDraft,
} = storyWizardSlice.actions;

export default storyWizardSlice.reducer;
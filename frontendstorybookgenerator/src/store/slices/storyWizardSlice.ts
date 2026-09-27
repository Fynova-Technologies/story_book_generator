import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface StoryImage {
  image: string | null;
  description: string;
}
interface StoryWizardState {
  template:      string;
  images:        StoryImage[];
  questionnaire: Record<string, string>;
  artStyle:      string;
  narration:     string;
}

const initialState: StoryWizardState = {
  template:      '',
  images:        [],
  questionnaire: {},
  artStyle:      '',
  narration:     '',
};

const storyWizardSlice = createSlice({
  name: 'storyWizard',
  initialState,
  reducers: {
    setTemplate: (state, action: PayloadAction<string>) => { 
        state.template = action.payload; 
    },
    setImages:(state, action: PayloadAction<StoryImage[]>)=> {
        state.images = action.payload;
    },
    setQuestionnaire: (state, action: PayloadAction<Record<string,string>>) => {
         state.questionnaire = action.payload; 
    },
    setArtStyle:(state, action: PayloadAction<string>) => { 
        state.artStyle      = action.payload; 
    },
    setNarration:(state, action: PayloadAction<string>) => { 
        state.narration     = action.payload; 
    },
    resetWizard:() => initialState,
  },
});

export const {
  setTemplate,
  setImages,
  setQuestionnaire,
  setArtStyle,
  setNarration,
  resetWizard,
} = storyWizardSlice.actions;

export default storyWizardSlice.reducer;
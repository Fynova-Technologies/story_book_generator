import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface StoryPage {
  page:               number;
  text:               string;
  imageUrl:           string;
}

interface GeneratedStory {
  title:    string;
  subtitle: string;
  pages:    StoryPage[];
}

interface GeneratedStoryState {
  story: GeneratedStory | null;
}

const initialState: GeneratedStoryState = {
  story: null,
};

const generatedStorySlice = createSlice({
  name: 'generatedStory',
  initialState,
  reducers: {
    setGeneratedStory: (state, action: PayloadAction<GeneratedStory>) => {
      state.story = action.payload;
    },
    clearGeneratedStory: (state) => {
      state.story = null;
    },
  },
});

export const { setGeneratedStory, clearGeneratedStory } = generatedStorySlice.actions;
export default generatedStorySlice.reducer;
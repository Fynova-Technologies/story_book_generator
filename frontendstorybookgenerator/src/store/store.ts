import {configureStore} from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import storyWizardReducer from './slices/storyWizardSlice'
import generatedStoryReducer from './slices/generatedStorySlice'

export const store = configureStore({
    reducer: {
        auth: authReducer,
        story: storyWizardReducer,
        generatedStory: generatedStoryReducer,
    }
    
})
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
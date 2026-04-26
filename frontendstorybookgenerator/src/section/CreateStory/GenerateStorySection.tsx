import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { useEffect, useState } from "react";
import { setGeneratedStory } from "../../store/slices/generatedStorySlice";
import { useNavigate } from "react-router-dom";
import { hasDraft, loadDraftFromLocal, deleteDraftFromLocal } from "../../services/draftService";


const GenerateStorySection = ({ 
    storyData, 
    credits = 12, 
    storyCost = 1 
}: any) => {
  const template = useSelector((state: RootState) => state.story.template);
  const images = useSelector((state: RootState) => state.story.images);
  const questionnaire = useSelector((state: RootState) => state.story.questionnaire);
  const artStyle = useSelector((state: RootState) => state.story.artStyle);
  const narration = useSelector((state: RootState) => state.story.narration);
  const story = useSelector((state: RootState) => state.story.story);

  const dispatch = useDispatch();
  const navigate = useNavigate(); 
  // const [story, setStory] = useState<any>(null);
  const [loading,setloading]= useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);



  const user = useSelector((state: RootState) => state.auth.userData);

  useEffect(() => {
  if (user?.uid) {
    console.log('Has draft:', hasDraft(user.uid));
    console.log('Draft data:', loadDraftFromLocal(user.uid));
  }
}, [user]);
 
  // Helper function to extract first sentence from error message
  const extractFirstSentence = (message: string): string => {
    if (!message) return 'An error occurred.';
    
    // Try to parse if it's a JSON error response
    try {
      const parsed = JSON.parse(message);
      if (parsed.error && parsed.error.message) {
        message = parsed.error.message;
      }
    } catch (e) {
      // Not JSON, use as is
    }
    
    // Extract first sentence (up to first period, question mark, or exclamation mark)
    const sentenceEnd = message.search(/[.!?]/);
    if (sentenceEnd !== -1) {
      return message.substring(0, sentenceEnd + 1).trim();
    }
    
    // If no sentence end found, return first 100 characters
    return message.length > 100 ? message.substring(0, 100) + '...' : message;
  };
 
  
  const remaining = credits - storyCost;
  // const [image, setImage]= useState<any>(null)

  const handleGenerate = async() => {
  // console.log(import.meta.env.VITE_BACKEND_URL);
  
  console.log("generating story.....");
  setErrorMessage(null);
  setloading(true);
  // const story="Group of school friends enjoying in a picnic ,talking about their past and creating memories";
  
  try {
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/story/generate`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        template,
        artStyle,
        narration,
        images,
        story,
        questionnaire,
        // questionnaire: {
        //   "Couple names":          "Sarbin and Sangita",
        //   "How long together":     "8 years",
        //   "Where they met":        "Computer lab in class 10",
        //   "Favorite activity":     "Cooking and bike rides",
        //   "Memorable moment":      "Sangita cooked for family on Maghi",
        // }
      })
    });

    const data = await response.json();
    console.log(data.message);

    if (!response.ok) {
      setErrorMessage(extractFirstSentence(data.message) || 'Something went wrong while generating the story.');
      return;
    }
    
    if (data.success && data.story) {
      setloading(false);
      // Delete draft when story generation is successful
      if (user?.uid) {
        deleteDraftFromLocal(user.uid);
      }
      dispatch(setGeneratedStory(data.story));
      navigate('/flipbook');
    } else {
      setErrorMessage(extractFirstSentence(data.message) || 'Failed to generate the story.');
    }
  } catch (error: any) {
    console.error("Failed to generate story:", error);
    setErrorMessage(extractFirstSentence(error?.message) || 'Unable to generate story. Please try again.');
  } finally {
    setloading(false);
  }
  
    
  };

  const handleEditDetails = () => {
    setloading(true)
    setTimeout(() => {
      console.log("Edit details clicked");
      setloading(false)
    }, 4000);
  };

  const handleGetMoreCredits = () => {
    console.log("Get more credits clicked");
  };

  const clearErrorMessage = () => {
    setErrorMessage(null);
  };

  return (
    <div className={`relative bg-light-on-primary dark:bg-dark-bg rounded-3xl p-6 md:p-8 border-light-outline-secondary dark:border-dark-primary-30 ${loading ? 'pointer-events-none' : ''}`}> 

      {errorMessage && (
        <div role="alert" aria-live="assertive" className="absolute inset-x-6 top-6 z-10 mx-auto w-auto max-w-xl rounded-2xl border border-red-200 bg-red-50 dark:border-red-700 dark:bg-red-950/40 px-4 py-3 text-sm text-red-900 dark:text-red-200 shadow-lg shadow-red-200/50 transition-all duration-300 ease-out transform opacity-100 translate-y-0">
          <div className="flex items-start gap-3">
            <span className="mt-0.5 text-red-600 dark:text-red-300">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-600 dark:text-red-300">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                <line x1="12" y1="9" x2="12" y2="13"/>
                <line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
            </span>
            <div className="flex-1 leading-relaxed">
              <p className="font-semibold">Alert</p>
              <p>{errorMessage}</p>
            </div>
            <button onClick={clearErrorMessage} className="ml-2 rounded-full p-1 text-red-600 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors">
              <span className="sr-only">Close alert</span>
              ×
            </button>
          </div>
        </div>
      )}

      {/* Loading Overlay */}
      {loading && (
        <div className="absolute inset-0 z-20 bg-white/80 dark:bg-black/60 backdrop-blur-sm rounded-3xl flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-light-primary dark:border-dark-primary border-t-transparent mb-4"></div>
            <p className="font-body text-lg font-semibold text-light-text dark:text-dark-text">Weaving your magical story...</p>
            <p className="font-body text-sm text-light-outline dark:text-dark-text opacity-70 mt-2">This usually takes 1-2 minutes</p>
          </div>
        </div>
      )}

      {/* ── HEADING ── */}
      <div className="text-center mb-8">
        <h2 className="font-display text-3xl md:text-4xl font-bold text-light-text dark:text-dark-text mb-3">
          Ready to weave your magic?
        </h2>
        <p className="font-body text-sm text-light-outline dark:text-dark-text opacity-70 max-w-sm mx-auto leading-relaxed">
          Review your story details and credit balance below to bring your adventure to life.
        </p>
      </div>

      {/* ── MAIN GRID — Story Preview + Payment Summary ── */}
      <div className="flex flex-col lg:flex-row gap-5">

        {/* ── LEFT — Story Preview ── */}
        <div className="flex-1 flex flex-col gap-4 p-5 rounded-2xl  border-light-outline-secondary dark:border-dark-primary-30 bg-light-bg dark:bg-dark-primary-10">

          {/* Preview Header */}
          <div className="flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-light-primary dark:text-dark-primary">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
              <circle cx="12" cy="12" r="3"/>
            </svg>
            <span className="font-body text-sm font-bold text-light-text dark:text-dark-text">
              Story Preview
            </span>
          </div>

          {/* Story Title + Author */}
          <div>
            <h3 className="font-display text-2xl font-bold text-light-text dark:text-dark-text">
              {storyData?.title || "The Adventures of Leo"}
            </h3>
            <p className="font-body text-xs text-light-outline dark:text-dark-text opacity-60 mt-1">
              Created by {storyData?.author || "Mom"}
            </p>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-3">

            {/* Template */}
            <div className="p-3 rounded-xl bg-light-on-primary dark:bg-dark-bg  border-light-outline-secondary dark:border-dark-primary-30">
              <p className="font-body text-[10px] font-bold text-light-outline dark:text-dark-text opacity-50 uppercase tracking-widest mb-1">
                Template
              </p>
              <p className="font-body text-sm font-medium text-light-text dark:text-dark-text">
                {storyData?.template || "Magical Forest"}
              </p>
            </div>

            {/* Hero */}
            <div className="p-3 rounded-xl bg-light-on-primary dark:bg-dark-bg  border-light-outline-secondary dark:border-dark-primary-30">
              <p className="font-body text-[10px] font-bold text-light-outline dark:text-dark-text opacity-50 uppercase tracking-widest mb-1">
                Hero
              </p>
              <p className="font-body text-sm font-medium text-light-text dark:text-dark-text">
                {storyData?.hero || "Leo (Bear)"}
              </p>
            </div>

            {/* Length */}
            <div className="p-3 rounded-xl bg-light-on-primary dark:bg-dark-bg  border-light-outline-secondary dark:border-dark-primary-30">
              <p className="font-body text-[10px] font-bold text-light-outline dark:text-dark-text opacity-50 uppercase tracking-widest mb-1">
                Length
              </p>
              <p className="font-body text-sm font-medium text-light-text dark:text-dark-text">
                {storyData?.length || "12 Pages"}
              </p>
            </div>

            {/* Art Style */}
            <div className="p-3 rounded-xl bg-light-on-primary dark:bg-dark-bg  border-light-outline-secondary dark:border-dark-primary-30">
              <p className="font-body text-[10px] font-bold text-light-outline dark:text-dark-text opacity-50 uppercase tracking-widest mb-1">
                Art Style
              </p>
              <p className="font-body text-sm font-medium text-light-text dark:text-dark-text">
                {storyData?.artStyle || "Watercolor"}
              </p>
            </div>

          </div>

          {/* Edit Details Link */}
          <button
            onClick={handleEditDetails}
            className="flex items-center gap-1.5 font-body text-sm font-semibold text-light-primary dark:text-dark-primary hover:opacity-80 transition-all w-fit"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
            Edit Details
          </button>

          {/* Info Note */}
          <div className="flex items-start gap-3 p-3 rounded-xl bg-dark-primary-10 dark:bg-dark-primary-10 border border-dark-primary-30">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-light-primary dark:text-dark-primary flex-shrink-0 mt-0.5">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            <p className="font-body text-xs text-light-primary dark:text-dark-primary leading-relaxed">
              Generating a story typically takes about 1-2 minutes. We'll notify you once the magic is complete! Your draft has been auto-saved.
            </p>
          </div>

        </div>

        {/* ── RIGHT — Payment Summary ── */}
        <div className="lg:w-72 flex flex-col gap-4 p-5 rounded-2xl  border-light-outline-secondary dark:border-dark-primary-30 bg-light-bg dark:bg-dark-primary-10">

          {/* Payment Header */}
          <div className="flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-light-primary dark:text-dark-primary">
              <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
              <line x1="1" y1="10" x2="23" y2="10"/>
            </svg>
            <span className="font-body text-sm font-bold text-light-text dark:text-dark-text">
              Payment Summary
            </span>
          </div>

          {/* Divider */}
          <div className="w-full h-px bg-light-outline-secondary dark:bg-dark-primary-30 opacity-40" />

          {/* Balance Row */}
          <div className="flex items-center justify-between">
            <span className="font-body text-sm text-light-outline dark:text-dark-text opacity-70">
              Your Balance
            </span>
            <span className="font-body text-sm font-bold text-light-text dark:text-dark-text">
              {credits} Credits
            </span>
          </div>

          {/* Story Cost Row */}
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="font-body text-sm text-light-outline dark:text-dark-text opacity-70">
                Story Cost
              </p>
              <p className="font-body text-[10px] text-light-outline dark:text-dark-text opacity-40 mt-0.5">
                Includes 12 high-res illustrations
              </p>
            </div>
            <span className="font-body text-sm font-bold text-light-accent dark:text-dark-accent shrink-0">
              - {storyCost} Credit
            </span>
          </div>

          {/* Divider */}
          <div className="w-full h-px bg-light-outline-secondary dark:bg-dark-primary-30 opacity-40" />

          {/* Remaining Row */}
          <div className="flex items-center justify-between">
            <span className="font-body text-sm text-light-outline dark:text-dark-text opacity-70">
              Remaining
            </span>
            <span className="font-body text-sm font-bold text-green-500">
              {remaining} Credits
            </span>
          </div>

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={loading}
            className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-body font-semibold text-sm transition-all duration-200 ${
              loading 
                ? 'bg-light-primary/80 dark:bg-dark-primary/80 cursor-not-allowed animate-pulse' 
                : 'bg-light-primary dark:bg-dark-primary text-light-on-primary hover:opacity-90 active:scale-[0.99]'
            }`}
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Weaving your story...
              </>
            ) : (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                </svg>
                Generate Story
              </>
            )}
          </button>

          {/* Disclaimer */}
          <p className="font-body text-[10px] text-light-outline dark:text-dark-text opacity-40 text-center leading-relaxed">
            By clicking Generate, 1 credit will be deducted from your account.
          </p>

          {/* Get More Credits */}
          <button
            onClick={handleGetMoreCredits}
            className="flex items-center justify-center gap-1 font-body text-xs font-medium text-light-outline dark:text-dark-text opacity-60 hover:opacity-100 hover:text-light-primary dark:hover:text-dark-primary transition-all duration-200"
          >
            Running low? Get more credits
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </button>

        </div>
      </div>
    </div>
  );
};

export default GenerateStorySection;

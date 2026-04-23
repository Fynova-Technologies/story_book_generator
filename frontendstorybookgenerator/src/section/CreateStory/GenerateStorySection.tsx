import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { useState } from "react";
import { setGeneratedStory } from "../../store/slices/generatedStorySlice";
import { useNavigate } from "react-router-dom";


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
  // const story1 = useSelector((state:RootState)=>state.generatedStory.story);

  const dispatch = useDispatch();
  const navigate = useNavigate(); 
  // const [story, setStory] = useState<any>(null);
  const [loading,setloading]= useState(false);
 
  
  const remaining = credits - storyCost;
  // const [image, setImage]= useState<any>(null)

  const handleGenerate = async() => {
  console.log("generating story.....");
  
  setloading(true);
  // const story="Group of school friends enjoying in a picnic ,talking about their past and creating memories";
  try {
    const response = await fetch(`${import.meta.env.REACT_APP_API_URL}/api/story/generate`, {
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
    // console.log(data);
    
  if (data.success && data.story) {
      setloading(false);
      dispatch(setGeneratedStory(data.story));
      navigate('/flipbook');
    }
  }catch (error) {
   console.error("Failed to generate story:", error);
  }finally{
    setloading(false);
  }
  
    
  };

  const handleEditDetails = () => {
    console.log("Edit details clicked");
  };

  const handleGetMoreCredits = () => {
    console.log("Get more credits clicked");
  };


  return (
    <div className="bg-light-on-primary dark:bg-dark-bg rounded-3xl p-6 md:p-8  border-light-outline-secondary dark:border-dark-primary-30"> 

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
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-light-primary dark:bg-dark-primary
             text-light-on-primary font-body font-semibold text-sm hover:opacity-90 active:scale-[0.99] transition-all duration-200"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
            </svg>
            {loading?"Generating...": "Generate Story"}
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

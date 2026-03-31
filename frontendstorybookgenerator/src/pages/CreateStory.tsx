import { useState } from "react";
import StoryStepperNav from "../components/StoryStepperNav/StoryStepperNav";
import UploadPhotoSection from "../section/CreateStory/UploadPhotoSection";
import userAvatar from "../assets/images/sampleavatar.png"
import CustomQuestionnaireSection from "../section/CreateStory/CustomQuestionnaireSection";
import ArtStyleSection from "../section/CreateStory/ArtStyleSection";
import VoiceNarrationSection from "../section/CreateStory/VoiceNarrationSection";
import GenerateStorySection from "../section/CreateStory/GenerateStorySection";
import TemplateSelection from "../section/CreateStory/TemplateSelection";

// ✅ Steps defined in order
const STEPS = [
  { id: "templete",      label: "Select Template" },
  { id: "photo",         label: "Upload Photo" },
  { id: "questionnaire", label: "Questionnaire" },
  { id: "art",           label: "Art Style Selection" },
  { id: "voice",         label: "Voice Narration" },
  { id: "generate",      label: "Generate" },
];

type Section = "templete" | "photo" | "questionnaire" | "art" | "voice" | "generate";

const CreateStory = () => {

  // ✅ Track step using index
  const [currentStepIndex, setCurrentStepIndex] = useState(1); // starts at "photo"

  const credits = 12;

  // ✅ Current section derived from index — single source of truth
  const activeSection = STEPS[currentStepIndex].id as Section;

  // ✅ Back — go to previous step
  const handleBack = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  // ✅ Next — go to next step
  const handleNext = () => {
    if (currentStepIndex < STEPS.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    }
  };

  // ✅ Stepper click — jump to any step
  const handleSectionChange = (id: Section) => {
    const index = STEPS.findIndex((step) => step.id === id);
    if (index !== -1) setCurrentStepIndex(index);
  };

  const renderSection = () => {
    switch (activeSection) {
      case "templete":       return <TemplateSelection />;
      case "photo":          return <UploadPhotoSection />;
      case "questionnaire":  return <CustomQuestionnaireSection />;
      case "art":            return <ArtStyleSection />;
      case "voice":          return <VoiceNarrationSection />;
      case "generate":       return <GenerateStorySection />;
      default:               return <UploadPhotoSection />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-light-bg dark:bg-dark-bg">

      {/* ── TOP ROW — Logo + Credits + Avatar ── */}
      <div className="w-full px-6 md:px-10 h-14 flex items-center justify-between border-b border-light-outline-secondary dark:border-dark-primary-30">

        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <span className="text-xl font-bold text-light-text dark:text-dark-text" style={{ fontFamily: "'Pacifico', cursive" }}>
              Logo
            </span>
          </div>
        </div>

        {/* Credits + Avatar */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-light-primary/10 dark:bg-dark-primary-10 border border-light-primary/20 dark:border-dark-primary-30">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-light-primary dark:text-dark-primary">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
            </svg>
            <span className="font-body text-sm font-semibold text-light-primary dark:text-dark-primary">
              {credits} Credits
            </span>
          </div>

          <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-light-outline-secondary dark:border-dark-primary-30">
            {userAvatar ? (
              <img src={userAvatar} alt="User" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-dark-primary-10 flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-light-primary dark:text-dark-primary">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── STEPPER NAV ── */}
      <StoryStepperNav
        activeSection={activeSection}
        currentStep={currentStepIndex + 1}
        onSectionChange={handleSectionChange}
      />

      {/* ── MAIN CONTENT ── */}
      <div className="flex-1 w-full max-w-7xl mx-auto px-6 md:px-10 py-8">
        {renderSection()}
      </div>

      {/* ── BOTTOM NAV — Back + Next ── */}
      <div className="w-full border-t border-light-outline-secondary dark:border-dark-primary-30 bg-light-on-primary dark:bg-dark-bg">
        <div className="max-w-6xl mx-auto px-6 md:px-10 h-16 flex items-center justify-between">

          {/* ✅ Back — hidden on first step */}
          {currentStepIndex > 0 ? (
            <button
              onClick={handleBack}
              className="flex items-center gap-2 font-body text-sm font-medium text-light-text dark:text-dark-text hover:text-light-primary dark:hover:text-dark-primary transition-all duration-200"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5M12 19l-7-7 7-7"/>
              </svg>
              Back
            </button>
          ) : (
            <div /> // keeps Next button right aligned
          )}

          {/* ✅ Next — shows "Generate Story" on last step */}
          {currentStepIndex < STEPS.length - 1 ? (
            <button
              onClick={handleNext}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-light-primary dark:bg-dark-primary text-light-on-primary font-body font-semibold text-sm hover:opacity-90 active:scale-[0.99] transition-all duration-200"
            >
              Next
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </button>
          ) : (
            <button
              onClick={() => console.log("Generating story!")}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-light-primary dark:bg-dark-primary text-light-on-primary font-body font-semibold text-sm hover:opacity-90 active:scale-[0.99] transition-all duration-200"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
              </svg>
              Generate Story
            </button>
          )}

        </div>
      </div>

    </div>
  );
};

export default CreateStory;

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../components/Navbar/Logo";
import StoryStepperNav, { STEPS, Section } from "../components/StoryStepperNav/StoryStepperNav";
import UploadPhotoSection from "../section/CreateStory/UploadPhotoSection";
import CustomQuestionnaireSection from "../section/CreateStory/CustomQuestionnaireSection";
import VoiceNarrationSection from "../section/CreateStory/VoiceNarrationSection";
import GenerateStorySection from "../section/CreateStory/GenerateStorySection";
import TemplateSelection from "../section/CreateStory/TemplateSelection";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store";
import { saveDraft } from "../services/storyService";
import { useCredits } from "../services/credits";
import { setCurrentDraftId, setImages } from "../store/slices/storyWizardSlice";
import TemplateQuestionnaireSection from "../section/CreateStory/TemplateQuestionnaireSection";
import StoryStyleSection from "../section/CreateStory/StoryStyleSection";
import { SaveState, SaveStateContext } from "../section/CreateStory/StepPanel";
import { userInitial } from "../components/Sidebar/user";

const QUESTIONNAIRE_STEP = STEPS.findIndex((step) => step.id === "questionnaire");

const CreateStory = () => {
  // const {
  //   draftExists,
  //   draft,
  //   lastSavedText,
  //   restoreConfirmed,
  //   discardDraft,
  // } = useDraftRestore();
  const [isValid, setIsValid] = useState(false);
  const template = useSelector((state: RootState) => state.story.template);
  const wizard = useSelector((state: RootState) => state.story);
  const user = useSelector((state: RootState) => state.auth.userData);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // ✅ Track step using index (a restored draft resumes where it was left)
  const [currentStepIndex, setCurrentStepIndex] = useState(Math.min(wizard.wizardStep, STEPS.length - 1));
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const saving = saveState === "saving";

  const { credits } = useCredits();

  // ✅ Current section derived from index — single source of truth
  const activeSection: Section = STEPS[currentStepIndex].id;

  // ✅ Back — previous step, or the dashboard from the first step
  const handleBack = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    } else {
      navigate("/dashboard");
    }
  };

  // ✅ Next — save the draft, then go to next step
  const handleNext = async () => {
    if (currentStepIndex >= STEPS.length - 1 || !user) return;
    setSaveState("saving");
    try {
      const { id, images } = await saveDraft(user.uid, wizard, currentStepIndex + 1);
      dispatch(setCurrentDraftId(id));
      dispatch(setImages(images));
      setSaveState("saved");
    } catch (error) {
      // The wizard still works from memory; the draft catches up on the next save.
      console.error("Could not save draft:", error);
      setSaveState("error");
    }
    setCurrentStepIndex((prev) => prev + 1);
    setIsValid(false); // reset validity for next step
  };

  // ✅ Stepper click — only back to earlier steps; moving forward goes through Next
  const handleStepClick = (index: number) => {
    if (index < currentStepIndex) {
      setCurrentStepIndex(index);
    }
  };

  // ✅ Handle step validation changes
  const handleStepValidChange = setIsValid; // stable, so steps' effects don't re-run every render

  const renderSection = () => {
    switch (activeSection) {
      case "templete":       return <TemplateSelection onValidChange={handleStepValidChange} />;
      case "photo":          return <UploadPhotoSection onValidChange={handleStepValidChange} />;
      case "questionnaire": 

          if(template) return <TemplateQuestionnaireSection onValidChange={handleStepValidChange} />;

          return <CustomQuestionnaireSection onValidChange={handleStepValidChange} />;

      case "voice":          return <VoiceNarrationSection onValidChange={handleStepValidChange} />;
      case "generate":       return <GenerateStorySection onEditDetails={() => setCurrentStepIndex(QUESTIONNAIRE_STEP)} />;
      case "storystyle":     return <StoryStyleSection onValidChange={handleStepValidChange} />;
      default:               return <UploadPhotoSection onValidChange={handleStepValidChange} />;
    }
  };

  return (
    <SaveStateContext.Provider value={saveState}>
    <div className="min-h-screen flex flex-col">

      {/* ── TOP ROW — Brand + Credits + Avatar ── */}
      <header className="w-full px-4 md:px-8 h-[79px] flex items-center justify-between border-b border-light-outline-secondary">
        <Logo to="/dashboard" className="text-light-text" />

        <div className="flex items-center gap-3 md:gap-6">
          <div className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-2xl bg-dark-primary-30 border border-dark-primary-30">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-light-primary">
              <path d="M13 2L4 14h7l-1 8 9-12h-7z"/>
            </svg>
            <span className="font-body text-sm font-bold text-light-primary whitespace-nowrap">
              {credits ?? "…"} Credits
            </span>
          </div>

          <div role="img" aria-label="Your account" className="w-10 h-10 rounded-full bg-light-primary text-white flex items-center justify-center font-body font-bold shadow-sm">
            {userInitial(user)}
          </div>
        </div>
      </header>

      {/* ── STEPPER NAV ── */}
      <div className="pt-8">
        <StoryStepperNav
          currentStep={currentStepIndex}
          onStepClick={handleStepClick}
        />
      </div>

      {/* ── MAIN CONTENT ── */}
      <main className="flex-1 w-full px-4 md:px-10 xl:px-20 py-8 md:py-10">
        {renderSection()}
      </main>

      {/* ── BOTTOM NAV — Back + Next ── */}
      <div className="sticky bottom-0 z-10 w-full border-t border-slate-200 bg-white/80 backdrop-blur-md">
        <div className="max-w-[1200px] mx-auto px-4 md:px-10 h-20 flex items-center justify-between">

          {/* ✅ Back — goes to the dashboard from the first step */}
          <button
            onClick={handleBack}
            className="flex items-center gap-2 px-2 py-2.5 font-body text-base font-bold text-light-text hover:text-light-primary transition-all duration-200"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            Back
          </button>

          {/* ✅ Next — the last step has its own Generate button */}
          {currentStepIndex < STEPS.length - 1 && (
            <button
              onClick={handleNext}
              disabled={!isValid || saving} // disable Next if current step is not valid
              className={`flex items-center gap-2 px-6 py-3 rounded-xl ${!isValid || saving ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90 active:scale-[0.99]'} bg-light-primary text-white
               font-body font-bold text-base transition-all duration-200`}
            >
              Next
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </button>
          )}

        </div>
      </div>

    </div>
    </SaveStateContext.Provider>
  );
};

export default CreateStory;

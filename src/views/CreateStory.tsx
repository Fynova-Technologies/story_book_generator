import { useState } from "react";
import { useNavigate } from "react-router-dom";
import StoryStepperNav, { STEPS, Section } from "../components/StoryStepperNav/StoryStepperNav";
import UploadPhotoSection from "../section/CreateStory/UploadPhotoSection";
const userAvatar = "/assets/images/sampleavatar.png";
import CustomQuestionnaireSection from "../section/CreateStory/CustomQuestionnaireSection";
import ArtStyleSection from "../section/CreateStory/ArtStyleSection";
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

const QUESTIONNAIRE_STEP = STEPS.findIndex((step) => step.id === "questionnaire");

type SaveState = "idle" | "saving" | "saved" | "error";

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

      case "art":            return <ArtStyleSection onValidChange={handleStepValidChange} />;
      case "voice":          return <VoiceNarrationSection onValidChange={handleStepValidChange} />;
      case "generate":       return <GenerateStorySection onEditDetails={() => setCurrentStepIndex(QUESTIONNAIRE_STEP)} />;
      case "storystyle":     return <StoryStyleSection onValidChange={handleStepValidChange} />;
      default:               return <UploadPhotoSection onValidChange={handleStepValidChange} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-light-bg dark:bg-dark-bg">
        {/* ── Draft Restore Banner ── */}
      {/* {draftExists && draft && (
        <div className="w-full bg-light-primary/10 dark:bg-dark-primary-10 border-b border-light-primary/20 dark:border-dark-primary-30 px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-light-primary dark:text-dark-primary">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
            </svg>
            <div>
              <p className="font-body text-sm font-semibold text-light-text dark:text-dark-text">
                You have an unfinished story
              </p>
              <p className="font-body text-xs text-light-outline dark:text-dark-text opacity-60">
                Last saved {lastSavedText}
                {draft.template && ` · Template: ${draft.template}`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={discardDraft}
              className="font-body text-xs text-light-outline dark:text-dark-text hover:text-light-text transition-all"
            >
              Start Fresh
            </button>
            <button
              onClick={() => {
                restoreConfirmed();
                // also restore step
                if (user?.uid) {
                  const savedStep = localStorage.getItem(`step_${user.uid}`);
                  if (savedStep) setCurrentStepIndex(parseInt(savedStep));
                }
              }}
              className="px-4 py-1.5 rounded-lg bg-light-primary dark:bg-dark-primary text-white font-body text-xs font-semibold hover:opacity-90 transition-all"
            >
              Continue Story
            </button>
          </div>
        </div>
      )} */}

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
              {credits ?? "…"} Credits
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
        currentStep={currentStepIndex}
        onStepClick={handleStepClick}
      />

      {/* ── DRAFT SAVE STATUS ── */}
      {saveState !== "idle" && (
        <div className="w-full max-w-7xl mx-auto px-6 md:px-10 pt-4 flex justify-end">
          <div role="status" className="flex items-center gap-1.5 px-4 py-1.5 rounded-full border-light-outline-secondary dark:border-dark-primary-30 bg-light-bg dark:bg-dark-primary-10">
            <div className={`w-2 h-2 rounded-full ${saveState === "saved" ? "bg-green-500" : saveState === "error" ? "bg-red-500" : "bg-light-outline-secondary animate-pulse"}`} />
            <span className={`font-body text-xs ${saveState === "error" ? "text-red-600 dark:text-red-400" : "text-light-primary dark:text-dark-text"}`}>
              {saveState === "saving" ? "Saving…" : saveState === "saved" ? "Draft saved" : "Couldn't save draft"}
            </span>
          </div>
        </div>
      )}

      {/* ── MAIN CONTENT ── */}
      <div className="flex-1 w-full max-w-7xl mx-auto px-6 md:px-10 py-8">
        {renderSection()}
      </div>

      {/* ── BOTTOM NAV — Back + Next ── */}
      <div className="w-full border-t border-light-outline-secondary dark:border-dark-primary-30 bg-light-on-primary dark:bg-dark-bg">
        <div className="max-w-6xl mx-auto px-6 md:px-10 h-16 flex items-center justify-between">

          {/* ✅ Back — goes to the dashboard from the first step */}
          <button
            onClick={handleBack}
            className="flex items-center gap-2 font-body text-sm font-medium text-light-text dark:text-dark-text hover:text-light-primary dark:hover:text-dark-primary transition-all duration-200"
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
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl ${!isValid || saving ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90'} bg-light-primary dark:bg-dark-primary text-light-on-primary
               font-body font-semibold text-sm hover:opacity-90 active:scale-[0.99] transition-all duration-200`}
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
  );
};

export default CreateStory;

import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { generateStory, saveDraft, UserFacingError } from "../../services/storyService";
import { STORY_COST, useCredits } from "../../services/credits";
import { setCurrentDraftId, setImages } from "../../store/slices/storyWizardSlice";
import { STEPS } from "../../components/StoryStepperNav/StoryStepperNav";
import StepPanel from "./StepPanel";

const GENERATE_STEP = STEPS.length - 1;

const plural = (n: number, word: string) => `${n} ${word}${n === 1 ? "" : "s"}`;

interface Props {
  onEditDetails: () => void;
}

const GenerateStorySection = ({ onEditDetails }: Props) => {
  const wizard = useSelector((state: RootState) => state.story);
  const user = useSelector((state: RootState) => state.auth.userData);
  const { credits } = useCredits();
  const storyCost = STORY_COST;
  // Only block when the balance is known to be short; the server checks again anyway.
  const notEnoughCredits = credits !== null && credits < storyCost;
  const characters = [...new Set(wizard.images.filter((p) => p.image).map((p) => p.characterName.trim()).filter(Boolean))];

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading,setloading]= useState(false);
  const [storyLength, setStoryLength] = useState<number>(6);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const remaining = credits === null ? null : credits - storyCost;

  // Saves the draft (photos included), then starts generation. The book page shows progress.
  // Error messages come from our functions and are already written for the user.
  const handleGenerate = async () => {
    if (!user || notEnoughCredits) return;
    setErrorMessage(null);
    setloading(true);
    try {
      const { id, images } = await saveDraft(user.uid, wizard, GENERATE_STEP, storyLength);
      dispatch(setCurrentDraftId(id));
      dispatch(setImages(images));
      await generateStory(id);
      navigate(`/flipbook/${id}`);
    } catch (error) {
      console.error("Failed to generate story:", error);
      setErrorMessage(error instanceof UserFacingError ? error.message : 'Could not save your story. Please try again.');
    } finally {
      setloading(false);
    }
  };

  // /pricing for now; point at a credit packs page once there is one.
  const handleGetMoreCredits = () => navigate("/pricing");

  const clearErrorMessage = () => {
    setErrorMessage(null);
  };

  const detailCls = "p-3 rounded-2xl bg-dark-primary-10";
  const labelCls = "font-body text-xs font-bold text-light-text uppercase tracking-wide mb-2";
  const valueCls = "font-body text-base text-light-outline";

  return (
    <StepPanel
      centered
      small
      title="Ready to weave your magic?"
      subtitle="Review your story details and credit balance below to bring your adventure to life."
      className={loading ? "pointer-events-none" : ""}
    >

      {errorMessage && (
        <div role="alert" aria-live="assertive" className="mb-6 mx-auto max-w-xl rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900 shadow-sm">
          <div className="flex items-start gap-3">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 shrink-0 text-red-600">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
              <line x1="12" y1="9" x2="12" y2="13"/>
              <line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
            <div className="flex-1 font-body leading-relaxed">
              <p className="font-bold">We couldn't start your story</p>
              <p>{errorMessage}</p>
            </div>
            <button onClick={clearErrorMessage} aria-label="Close alert" className="rounded-full w-7 h-7 shrink-0 text-red-600 hover:bg-red-100 transition-colors">
              ×
            </button>
          </div>
        </div>
      )}

      {/* Loading Overlay */}
      {loading && (
        <div className="absolute inset-0 z-20 bg-white/80 backdrop-blur-sm rounded-[32px] flex items-center justify-center p-6">
          <div className="text-center" role="status">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-light-primary border-t-transparent mb-4"></div>
            <p className="font-heading text-2xl font-bold text-light-text">Weaving your magical story...</p>
            <p className="font-body text-sm text-light-outline mt-2">This usually takes 1-2 minutes</p>
          </div>
        </div>
      )}

      {/* ── MAIN GRID — Story Preview + Payment Summary ── */}
      <div className="flex flex-col lg:flex-row gap-6">

        {/* ── LEFT — Story Preview ── */}
        <div className="flex-1 flex flex-col gap-6 min-w-0">
          <div className="flex flex-col gap-6 p-6 rounded-3xl bg-white shadow-sm">

            {/* Preview Header */}
            <div className="flex items-center gap-2">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-light-primary">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                <circle cx="12" cy="12" r="3"/>
              </svg>
              <span className="font-body text-lg font-bold text-light-text">
                Story Preview
              </span>
            </div>

            {/* Story Title + Author */}
            <div>
              <h3 className="font-body text-2xl font-bold text-light-text">
                {wizard.template || "Your own story"}
              </h3>
              {user?.displayName && (
                <p className="font-body text-base text-light-outline mt-1">
                  Created by {user.displayName}
                </p>
              )}
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className={detailCls}>
                <p className={labelCls}>Story Style</p>
                <p className={valueCls}>{wizard.storyStyle || "—"}</p>
              </div>
              <div className={detailCls}>
                <p className={labelCls}>{characters.length === 1 ? "Hero" : "Characters"}</p>
                <p className={valueCls}>{characters.join(", ") || "—"}</p>
              </div>
              <div className={detailCls}>
                <label htmlFor="story-length" className={`block ${labelCls}`}>Length (in pages)</label>
                <input
                  id="story-length"
                  type="number"
                  min={1}
                  max={20}
                  value={storyLength}
                  onChange={(e) => setStoryLength(Math.min(20, Math.max(1, Number(e.target.value) || 1)))}
                  className={`w-full bg-white/70 rounded-lg px-2 py-0.5 -mx-0.5 focus:outline-none focus:ring-2 focus:ring-light-primary/40 ${valueCls}`}
                />
              </div>
              <div className={detailCls}>
                <p className={labelCls}>Art Style</p>
                <p className={valueCls}>{wizard.artStyle || "—"}</p>
              </div>
            </div>

            {/* Edit Details Link */}
            <button
              onClick={onEditDetails}
              className="flex items-center gap-1 font-body text-sm font-semibold text-light-primary hover:opacity-80 transition-all w-fit"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 20h9"/>
                <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4z"/>
              </svg>
              Edit Details
            </button>
          </div>

          {/* Info Note */}
          <div className="flex items-center gap-3 p-4 rounded-2xl bg-[#EFF6FF]">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-light-primary flex-shrink-0">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="16" x2="12" y2="12"/>
              <line x1="12" y1="8" x2="12.01" y2="8"/>
            </svg>
            <p className="font-body text-sm text-light-primary leading-5">
              Generating a story typically takes about 1-2 minutes. We'll notify you once the magic is complete! Your draft has been auto-saved.
            </p>
          </div>
        </div>

        {/* ── RIGHT — Payment Summary ── */}
        <div className="lg:w-[355px] flex flex-col gap-6">
          <div className="rounded-3xl bg-white shadow-md overflow-hidden">

            {/* Payment Header */}
            <div className="flex items-center gap-2 p-5 bg-dark-primary-10">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-light-primary">
                <rect x="2" y="6" width="20" height="12" rx="2"/>
                <circle cx="12" cy="12" r="2.5"/>
                <path d="M6 12h.01M18 12h.01"/>
              </svg>
              <span className="font-body text-lg font-bold text-light-text">
                Payment Summary
              </span>
            </div>

            <div className="px-6 pt-6 pb-6 flex flex-col gap-6">
              {/* Balance Row */}
              <div className="flex items-center justify-between">
                <span className="font-body text-base text-light-outline">Your Balance</span>
                <span className="font-body text-base font-bold text-light-text">
                  {credits ?? "…"} Credits
                </span>
              </div>

              {/* Story Cost Row */}
              <div className="flex items-center justify-between gap-2 py-4 border-y border-dashed border-[#E5E5E5]">
                <div>
                  <p className="font-body text-base font-bold text-light-text">Story Cost</p>
                  <p className="font-body text-xs text-light-outline">
                    Includes {plural(storyLength, "illustrated page")}
                  </p>
                </div>
                <span className="font-body text-base font-bold text-light-accent shrink-0">
                  - {plural(storyCost, "Credit")}
                </span>
              </div>

              {/* Remaining Row */}
              <div className="flex items-center justify-between">
                <span className="font-body text-base text-light-outline">Remaining</span>
                <span className={`font-body text-base font-bold ${notEnoughCredits ? "text-red-600" : "text-green-600"}`}>
                  {remaining === null ? "…" : notEnoughCredits ? "Not enough" : plural(remaining, "Credit")}
                </span>
              </div>

              <div className="flex flex-col gap-4">
                {/* Generate Button */}
                <button
                  onClick={handleGenerate}
                  disabled={loading || notEnoughCredits}
                  className={`w-full flex items-center justify-center gap-3 h-14 rounded-2xl bg-light-primary text-white font-body font-bold text-base transition-all duration-200 ${
                    loading
                      ? "opacity-80 cursor-not-allowed animate-pulse"
                      : notEnoughCredits
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:opacity-90 active:scale-[0.99]"
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
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M10 3l1.9 5.1L17 10l-5.1 1.9L10 17l-1.9-5.1L3 10l5.1-1.9z"/>
                        <path d="M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8z"/>
                      </svg>
                      Generate Story
                    </>
                  )}
                </button>

                {notEnoughCredits && (
                  <p className="font-body text-xs font-semibold text-red-600 text-center">
                    You need {plural(storyCost, "credit")} to generate a story.
                  </p>
                )}

                {/* Disclaimer */}
                <p className="font-body text-xs text-light-outline text-center leading-4">
                  By clicking Generate, {plural(storyCost, "credit")} will be deducted from your account.
                </p>
              </div>
            </div>
          </div>

          {/* Get More Credits */}
          <button
            onClick={handleGetMoreCredits}
            className={`flex items-center justify-center gap-2 font-body text-sm transition-all duration-200 hover:text-light-primary ${notEnoughCredits ? "font-bold text-light-primary" : "text-light-outline"}`}
          >
            {notEnoughCredits ? "Get more credits" : "Running low? Get more credits"}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </button>
        </div>
      </div>
    </StepPanel>
  );
};

export default GenerateStorySection;

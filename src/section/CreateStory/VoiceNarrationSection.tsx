import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setNarration } from "../../store/slices/storyWizardSlice";
import { RootState } from "../../store/store";
import StepPanel from "./StepPanel";

const voiceOptions = [
  {
    id: "storyteller",
    name: "Storyteller (F)",
    description: "Warm & Soothing",
  },
  {
    id: "adventurer",
    name: "Adventurer (M)",
    description: "Energetic & Fun",
  },
  {
    id: "cinematic",
    name: "Cinematic",
    description: "Deep, dramatic, powerful",
  },
  {
    id: "conversational",
    name: "Conversational",
    description: "Casual, cheerful, modern",
  },
];

interface props{
  onValidChange:(valid:boolean)=>void;
}
const VoiceNarrationSection = ({ onValidChange }: props) => {
  const dispatch = useDispatch();
  // The stored narration is the voice id, or '' when narration is off.
  const selectedVoice = useSelector((state: RootState) => state.story.narration);
  const isEnabled = selectedVoice !== "";

  useEffect(() => {
    onValidChange(true); // Voice narration is optional, so we consider it valid even if not enabled
  }, [onValidChange]);

  return (
    <StepPanel
      narrow
      centered
      title="Voice Narration"
      subtitle="Enable audio to have the story read aloud in a generated voice."
    >
      <div className="flex flex-col gap-6">

      {/* ── ENABLE VOICE NARRATION CARD ── */}
      <div className="flex items-center justify-between gap-4 md:gap-16 p-5 md:p-6 rounded-2xl bg-white shadow-sm">

        {/* Left — Icon + Text */}
        <div className="flex items-center gap-4 md:gap-6">

          {/* Icon */}
          <div className="hidden sm:flex w-16 h-16 rounded-full bg-light-primary/10 items-center justify-center flex-shrink-0">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-light-primary">
              <line x1="8" y1="17" x2="8" y2="7"/>
              <line x1="12" y1="20" x2="12" y2="4"/>
              <line x1="16" y1="17" x2="16" y2="7"/>
              <line x1="4" y1="14" x2="4" y2="10"/>
              <line x1="20" y1="14" x2="20" y2="10"/>
            </svg>
          </div>

          {/* Text */}
          <div>
            <p className="font-body text-lg font-bold text-light-text mb-1">
              Enable Voice Narration
            </p>
            <p className="font-body text-sm text-light-outline leading-relaxed">
              Turn this on to automatically generate an audio narration for your storybook. Perfect for bedtime listening.
            </p>
          </div>

        </div>

        {/* ── TOGGLE ── */}
        <button
          onClick={() => dispatch(setNarration(isEnabled ? "" : voiceOptions[0].id))}
          role="switch"
          aria-checked={isEnabled}
          aria-label="Enable voice narration"
          className={`relative w-14 h-7 rounded-full transition-all duration-300 flex-shrink-0
            ${isEnabled
              ? "bg-light-primary"
              : "bg-light-outline-secondary"
            }
          `}
        >
          <span className={`absolute top-0.5 w-6 h-6 rounded-full bg-white shadow-sm transition-all duration-300
            ${isEnabled ? "left-[30px]" : "left-0.5"}
          `} />
        </button>

      </div>

      {/* ── VOICE SETTINGS ── */}
      {isEnabled && (
        <div className="p-5 md:p-6 rounded-2xl bg-white text-left">

          {/* Section Label */}
          <div className="flex items-center gap-2 mb-4">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-light-text">
              <line x1="4" y1="21" x2="4" y2="14"/>
              <line x1="4" y1="10" x2="4" y2="3"/>
              <line x1="12" y1="21" x2="12" y2="12"/>
              <line x1="12" y1="8" x2="12" y2="3"/>
              <line x1="20" y1="21" x2="20" y2="16"/>
              <line x1="20" y1="12" x2="20" y2="3"/>
              <line x1="1" y1="14" x2="7" y2="14"/>
              <line x1="9" y1="8" x2="15" y2="8"/>
              <line x1="17" y1="16" x2="23" y2="16"/>
            </svg>
            <span className="font-body text-sm font-semibold text-light-text">
              Voice Settings
            </span>
          </div>

          {/* ── VOICE OPTIONS GRID ── */}
          <div role="radiogroup" aria-label="Voice" className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {voiceOptions.map((voice) => {
              const isSelected = selectedVoice === voice.id;

              return (
                <button
                  key={voice.id}
                  role="radio"
                  aria-checked={isSelected}
                  onClick={() => dispatch(setNarration(voice.id))}
                  className={`flex items-center justify-between gap-3 px-4 py-4 rounded-3xl text-left transition-all duration-200
                    ${isSelected
                      ? "border-2 border-light-primary"
                      : "border border-light-outline-secondary hover:border-light-primary"
                    }
                  `}
                >
                  <div className="flex items-center gap-3">
                    {/* Voice glyph (no voice previews yet) */}
                    <span className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${isSelected ? "bg-light-primary text-white" : "bg-dark-primary-30 text-light-text"}`}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z"/>
                        <path d="M19 10v2a7 7 0 0 1-14 0v-2M12 19v3"/>
                      </svg>
                    </span>

                    {/* Voice Name + Description */}
                    <div>
                      <p className={`font-body text-sm font-semibold ${isSelected ? "text-light-primary" : "text-light-text"}`}>
                        {voice.name}
                      </p>
                      <p className="font-body text-xs text-light-outline">
                        {voice.description}
                      </p>
                    </div>
                  </div>

                  {/* Right — Selected checkmark */}
                  {isSelected && (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-light-primary flex-shrink-0 self-start">
                      <circle cx="12" cy="12" r="9"/>
                      <polyline points="8 12.5 11 15 16 9.5"/>
                    </svg>
                  )}
                </button>
              );
            })}
          </div>

        </div>
      )}

      </div>
    </StepPanel>
  );
};

export default VoiceNarrationSection;

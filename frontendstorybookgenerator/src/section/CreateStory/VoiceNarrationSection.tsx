// 📁 src/pages/CreateStory/VoiceNarration.tsx

import { useState } from "react";

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

const VoiceNarrationSection = () => {
  const [isEnabled, setIsEnabled] = useState(true);
  const [selectedVoice, setSelectedVoice] = useState("storyteller");

  return (
    <div className="bg-light-on-primary dark:bg-dark-bg rounded-3xl p-6 md:p-8 border-light-outline-secondary dark:border-dark-primary-30">

      {/* ── HEADING ── */}
      <div className="text-center mb-8">
        <h2 className="font-heading text-3xl md:text-4xl font-bold text-light-text dark:text-dark-text mb-2">
          Voice Narration
        </h2>
        <p className="font-body text-sm text-light-outline dark:text-dark-text opacity-70">
          Enable audio to have the story read aloud in a generated voice.
        </p>
      </div>

      {/* ── ENABLE VOICE NARRATION CARD ── */}
      <div className="flex items-start justify-between gap-4 p-5 rounded-2xl border-light-outline-secondary dark:border-dark-primary-30 bg-light-bg dark:bg-dark-primary-10 mb-5">

        {/* Left — Icon + Text */}
        <div className="flex items-start gap-4">

          {/* Icon */}
          <div className="w-10 h-10 rounded-full bg-dark-primary-10 border border-dark-primary-30 flex items-center justify-center flex-shrink-0">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-light-primary dark:text-dark-primary">
              <line x1="8" y1="18" x2="8" y2="6"/>
              <line x1="12" y1="20" x2="12" y2="4"/>
              <line x1="16" y1="18" x2="16" y2="6"/>
              <line x1="4" y1="16" x2="4" y2="8"/>
              <line x1="20" y1="16" x2="20" y2="8"/>
            </svg>
          </div>

          {/* Text */}
          <div>
            <p className="font-body text-sm font-bold text-light-text dark:text-dark-text mb-1">
              Enable Voice Narration
            </p>
            <p className="font-body text-xs text-light-outline dark:text-dark-text opacity-60 leading-relaxed max-w-sm">
              Turn this on to automatically generate an audio narration for your storybook. Perfect for bedtime listening.
            </p>
          </div>

        </div>

        {/* ── TOGGLE ── */}
        <button
          onClick={() => setIsEnabled(!isEnabled)}
          className={`relative w-12 h-6 rounded-full transition-all duration-300 flex-shrink-0 mt-1
            ${isEnabled
              ? "bg-light-primary dark:bg-dark-primary"
              : "bg-light-outline-secondary dark:bg-dark-primary-30"
            }
          `}
        >
          <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-all duration-300
            ${isEnabled ? "left-6" : "left-0.5"}
          `} />
        </button>

      </div>

      {/* ── VOICE SETTINGS ── */}
      {isEnabled && (
        <div>

          {/* Section Label */}
          <div className="flex items-center gap-2 mb-4">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-light-outline dark:text-dark-text opacity-60">
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
            <span className="font-body text-sm font-semibold text-light-text dark:text-dark-text">
              Voice Settings
            </span>
          </div>

          {/* ── VOICE OPTIONS GRID ── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {voiceOptions.map((voice) => {
              const isSelected = selectedVoice === voice.id;

              return (
                <button
                  key={voice.id}
                  onClick={() => setSelectedVoice(voice.id)}
                  className={`flex items-center justify-between gap-3 p-4 rounded-2xl border text-left transition-all duration-200
                    ${isSelected
                      ? "border-light-primary dark:border-dark-primary bg-dark-primary-10 dark:bg-dark-primary-10"
                      : "border-light-outline-secondary dark:border-dark-primary-30 bg-light-bg dark:bg-dark-primary-10 hover:border-light-primary dark:hover:border-dark-primary"
                    }
                  `}
                >
                  {/* Left — Play icon + Text */}
                  <div className="flex items-center gap-3">

                    {/* Play Button */}
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-200
                      ${isSelected
                        ? "bg-light-primary dark:bg-dark-primary"
                        : "bg-dark-primary-10 dark:bg-dark-primary-10 border border-dark-primary-30"
                      }
                    `}>
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" className={isSelected ? "text-white ml-0.5" : "text-light-primary dark:text-dark-primary ml-0.5"}>
                        <path d="M6 4l14 8-14 8V4z"/>
                      </svg>
                    </div>

                    {/* Voice Name + Description */}
                    <div>
                      <p className={`font-body text-sm font-semibold transition-all duration-200
                        ${isSelected
                          ? "text-light-primary dark:text-dark-primary"
                          : "text-light-text dark:text-dark-text"
                        }
                      `}>
                        {voice.name}
                      </p>
                      <p className="font-body text-xs text-light-outline dark:text-dark-text opacity-60">
                        {voice.description}
                      </p>
                    </div>

                  </div>

                  {/* Right — Selected checkmark */}
                  {isSelected && (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-light-primary dark:text-dark-primary flex-shrink-0">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  )}

                </button>
              );
            })}
          </div>

        </div>
      )}

    </div>
  );
};

export default VoiceNarrationSection;

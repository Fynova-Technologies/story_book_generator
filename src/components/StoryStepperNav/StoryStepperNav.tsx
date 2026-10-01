// The wizard's steps, in order. A draft's wizard_step is an index into this list.
export const STEPS = [
  { id: "templete",      label: "Select Template" },
  { id: "photo",         label: "Upload Photo" },
  { id: "questionnaire", label: "Questionnaire" },
  { id: "storystyle",    label: "Story Style Selection" },
  { id: "art",           label: "Art Style Selection" },
  { id: "voice",         label: "Voice Narration" },
  { id: "generate",      label: "Generate" },
] as const;

export type Section = (typeof STEPS)[number]["id"];

interface Props {
  currentStep: number; // index into STEPS
  onStepClick: (index: number) => void;
}

// Only earlier steps are clickable: moving forward goes through Next, which validates and saves.
const StoryStepperNav = ({ currentStep, onStepClick }: Props) => {
  return (
    <div className="w-full bg-light-bg dark:bg-dark-bg border-light-outline-secondary dark:border-dark-primary-30">

      {/* ── BOTTOM ROW — Steps ── */}
      <div className="max-w-7xl mx-auto px-6 md:px-10 h-12 flex items-center justify-center gap-2 md:gap-0 overflow-x-auto">
        {STEPS.map((step, index) => {
          const isActive = index === currentStep;
          const isAhead = index > currentStep;
          return (
            <button
              key={step.id}
              onClick={() => onStepClick(index)}
              disabled={isAhead}
              aria-current={isActive ? "step" : undefined}
              className={`flex items-center gap-1 px-3 py-2.5 rounded-xl text-left transition-all duration-200 w-full
                ${
                  isActive
                    ? "bg-dark-primary-10 dark:bg-dark-primary-10 text-light-primary dark:text-dark-primary font-semibold underline"
                    : isAhead
                      ? "text-light-outline dark:text-dark-text opacity-50 cursor-not-allowed"
                      : "text-light-outline dark:text-dark-text hover:bg-light-bg dark:hover:bg-dark-primary-10 hover:text-light-text dark:hover:text-dark-text"
                }
              `}
            >
              <span className="font-body text-xs font-bold">{index + 1}. {step.label}</span>
            </button>
          );
        })}
      </div>

    </div>
  );
};

export default StoryStepperNav;

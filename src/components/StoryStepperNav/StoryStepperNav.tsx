import { useEffect, useRef } from "react";

// The wizard's steps, in order. A draft's wizard_step is an index into this list.
export const STEPS = [
  { id: "templete",      label: "Select Template" },
  { id: "photo",         label: "Upload Photo" },
  { id: "questionnaire", label: "Questionnaire" },
  { id: "storystyle",    label: "Story Style Selection" },
  { id: "voice",         label: "Voice Narration" },
  { id: "generate",      label: "Generate" },
] as const;

export type Section = (typeof STEPS)[number]["id"];

interface Props {
  currentStep: number; // index into STEPS
  onStepClick: (index: number) => void;
}

const StepIcon = ({ id }: { id: Section }) => {
  const common = { width: 16, height: 16, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, className: "shrink-0" };
  if (id === "voice") {
    return (
      <svg {...common}>
        <circle cx="9" cy="8" r="4" />
        <path d="M2 21v-1a6 6 0 0 1 12 0v1" />
        <path d="M17 5a5 5 0 0 1 0 7M20 2a9 9 0 0 1 0 13" />
      </svg>
    );
  }
  if (id === "generate") {
    return (
      <svg {...common}>
        <path d="M10 3l1.9 5.1L17 10l-5.1 1.9L10 17l-1.9-5.1L3 10l5.1-1.9z" />
        <path d="M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8z" />
      </svg>
    );
  }
  return (
    <svg {...common}>
      <circle cx="12" cy="12" r="9" />
      <polyline points="8 12.5 11 15 16 9.5" />
    </svg>
  );
};

// Only earlier steps are clickable: moving forward goes through Next, which validates and saves.
const StoryStepperNav = ({ currentStep, onStepClick }: Props) => {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef<HTMLButtonElement>(null);

  // On narrow screens the steps scroll sideways; keep the active one in view.
  useEffect(() => {
    const scroller = scrollerRef.current;
    const active = activeRef.current;
    if (!scroller || !active) return;
    scroller.scrollTo({ left: active.offsetLeft - (scroller.clientWidth - active.offsetWidth) / 2, behavior: "smooth" });
  }, [currentStep]);

  return (
    <nav aria-label="Story steps" ref={scrollerRef} className="relative w-full overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <ol className="flex w-max mx-auto gap-4 md:gap-8 px-4">
        {STEPS.map((step, index) => {
          const isActive = index === currentStep;
          const isDone = index < currentStep;
          return (
            <li key={step.id}>
              <button
                ref={isActive ? activeRef : undefined}
                onClick={() => onStepClick(index)}
                disabled={index > currentStep}
                aria-current={isActive ? "step" : undefined}
                className={`flex items-center gap-2 px-2 pt-0.5 pb-2.5 border-b-2 whitespace-nowrap font-body text-sm font-semibold transition-colors duration-200
                  ${isActive
                    ? "border-light-primary text-light-primary"
                    : isDone
                      ? "border-transparent text-light-outline hover:text-light-primary"
                      : "border-transparent text-light-outline/70 cursor-default"
                  }
                `}
              >
                <span className={isActive || isDone ? "text-light-primary" : ""}>
                  <StepIcon id={step.id} />
                </span>
                {index + 1}. {step.label}
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default StoryStepperNav;

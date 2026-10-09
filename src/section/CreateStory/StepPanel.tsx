import { createContext, ReactNode, useContext } from "react";

export type SaveState = "idle" | "saving" | "saved" | "error";

// CreateStory owns the draft save; each step's panel shows its status in the header.
export const SaveStateContext = createContext<SaveState>("idle");

// A step with its own pages (the questionnaire's parts) takes over the footer's Next and Back:
// they return true while they move within the step. optional parts offer "Skip this part".
export interface PartNav {
  next: () => boolean;
  back: () => boolean;
  optional: boolean;
  nextTitle: string;
}

const SaveStatusPill = () => {
  const saveState = useContext(SaveStateContext);
  if (saveState === "idle") return null;
  return (
    <div role="status" className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-light-primary/10 bg-white/50 shrink-0 w-fit">
      <span className={`w-2.5 h-2.5 rounded-full ${saveState === "saved" ? "bg-green-500" : saveState === "error" ? "bg-red-500" : "bg-light-outline-secondary animate-pulse"}`} />
      <span className={`font-body text-xs ${saveState === "error" ? "text-red-600" : "text-light-primary"}`}>
        {saveState === "saving" ? "Saving…" : saveState === "saved" ? "Draft saved automatically" : "Couldn't save draft"}
      </span>
    </div>
  );
};

// "Birthday & Celebrations selected" — the current choice on selection steps.
export const SelectedPill = ({ label }: { label: string }) => (
  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-light-primary/10 shrink-0">
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-light-primary">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
    <span className="font-body text-xs font-bold text-light-primary">{label} selected</span>
  </div>
);

interface Props {
  title: string;
  subtitle?: ReactNode;
  centered?: boolean;
  narrow?: boolean; // 900px panel (questionnaire, voice) instead of 1280px
  small?: boolean;  // 36px title instead of 48px
  aside?: ReactNode; // extra header content next to the title (e.g. a badge)
  className?: string;
  children: ReactNode;
}

// The big rounded panel every wizard step sits in (Figma "Main": black at 5%, 32px radius, 40px padding).
const StepPanel = ({ title, subtitle, centered, narrow, small, aside, className = "", children }: Props) => {
  const pills = (
    <div className={`flex flex-wrap items-center gap-2 ${centered ? "justify-center mt-4" : "sm:pt-2"}`}>
      {aside}
      <SaveStatusPill />
    </div>
  );
  return (
  <section className={`relative w-full mx-auto rounded-[32px] bg-light-panel p-5 md:p-10 ${narrow ? "max-w-[900px]" : "max-w-7xl"} ${className}`}>
    <header className={`mb-8 md:mb-10 ${centered ? "text-center" : ""}`}>
      <div className={centered ? "" : "flex flex-col-reverse gap-3 sm:flex-row sm:items-start sm:justify-between"}>
        <h2 className={`font-heading font-bold text-light-text leading-tight ${small ? "text-3xl md:text-4xl" : "text-3xl md:text-5xl"}`}>
          {title}
        </h2>
        {!centered && pills}
      </div>
      {subtitle && (
        <p className={`font-body text-base text-light-outline mt-3 leading-relaxed ${centered ? "max-w-2xl mx-auto" : ""}`}>
          {subtitle}
        </p>
      )}
      {/* Centered titles keep their status pills below, so nothing overlaps the title */}
      {centered && pills}
    </header>
    {children}
  </section>
  );
};

export default StepPanel;

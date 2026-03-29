// 📁 src/components/StoryStepperNav/StoryStepperNav.tsx

// 👉 Import your logo here
// import Logo from "../../assets/logo/logo.svg"

const steps = [
  { id: "templete", label: "Select Template" },
  { id: "photo", label: "Upload Photo" },
  { id: "questionnaire", label: "Questionnaire" },
  { id: "art", label: "Art Style Selection" },
  { id: "voice", label: "Voice Narration" },
  { id: "generate", label: "Generate" },
];

const StoryStepperNav = ({
    activeSection,
    onSectionChange
}: any) => {
  return (
    <div className="w-full bg-light-bg dark:bg-dark-bg border-light-outline-secondary dark:border-dark-primary-30">

      {/* ── BOTTOM ROW — Steps ── */}
      <div className="max-w-6xl mx-auto px-6 md:px-10 h-12 flex items-center justify-center gap-2 md:gap-6 overflow-x-auto">
        {steps.map((step) => {
          return (
            // <div key={step.id} className="flex items-center gap-1.5 flex-shrink-0">

            <button
              key={step.id}
              onClick={() => onSectionChange(step.id)}
              className={`flex items-center gap-1 px-3 py-2.5 rounded-xl text-left transition-all duration-200 w-full
                ${
                  activeSection === step.id
                    ? "bg-dark-primary-10 dark:bg-dark-primary-10 text-light-primary dark:text-dark-primary font-semibold underline"
                    : "text-light-outline dark:text-dark-text hover:bg-light-bg dark:hover:bg-dark-primary-10 hover:text-light-text dark:hover:text-dark-text"
                }
              `}
            >
              <span className="shrink-0">
                {/* <img src={step.icon} alt="" className="w-4 h-4"/> */}
              </span>
              <span className="font-body text-xs font-bold">{step.label}</span>
            </button>

            
          );
        })}
      </div>

    </div>
  );
};

export default StoryStepperNav;

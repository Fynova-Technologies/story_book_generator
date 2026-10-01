import { ChangeEvent, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCustomStory } from "../../store/slices/storyWizardSlice";
import { RootState } from "../../store/store";
import StepPanel from "./StepPanel";


const CHAR_LIMIT = 500;
const MIN_CHARS = 100; // the story needs more than this many characters

interface props{
  onValidChange:(valid:boolean)=>void;
}
const CustomQuestionnaireSection = ({
  onValidChange,
}:props) => {
  const dispatch = useDispatch();
  // Redux is the source of truth, so Next always saves what is on screen.
  const story = useSelector((state: RootState) => state.story.story);

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    dispatch(setCustomStory(e.target.value.slice(0, CHAR_LIMIT)));
  };

  useEffect(() => {
    onValidChange(story.trim().length > MIN_CHARS);
  }, [story, onValidChange]);

  const handleInspireMe = () => {
    const inspirations = [
      "A brave young girl discovers a hidden world beneath her grandmother's garden, where magical creatures need her help to save their kingdom from darkness.",
      "A curious boy finds an old map in his attic that leads him on an adventure through time, meeting historical heroes along the way.",
      "Twin siblings stumble upon a mysterious lighthouse that grants wishes, but they must learn that true magic comes from the heart.",
    ];
    const random = inspirations[Math.floor(Math.random() * inspirations.length)];
    dispatch(setCustomStory(random.slice(0, CHAR_LIMIT)));
  };

  const progressPercent = (story.length / CHAR_LIMIT) * 100;
  const isNearLimit = story.length > CHAR_LIMIT * 0.8;
  const isAtLimit = story.length === CHAR_LIMIT;

  return (
    <StepPanel
      narrow
      small
      title="Tell us about your adventure"
      subtitle="Describe the main events, characters, or the lesson you want to teach."
    >

      {/* ── STORY INPUT CARD ── */}
      <div className="p-5 md:p-8 rounded-3xl border border-[#F3EDE7] bg-white shadow-[0_4px_20px_-2px_rgba(0,0,0,0.08)]">

        {/* Card Header */}
        <div className="flex items-center justify-between gap-3 mb-3">
          <label htmlFor="custom-story" className="font-body text-base font-bold text-light-text">
            What is your story about?
          </label>

          {/* Inspire Me Button */}
          <button
            onClick={handleInspireMe}
            className="flex items-center gap-1.5 font-body text-sm text-light-primary hover:opacity-80 transition-all duration-200 shrink-0"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="16 3 21 3 21 8"/>
              <line x1="4" y1="20" x2="21" y2="3"/>
              <polyline points="21 16 21 21 16 21"/>
              <line x1="15" y1="15" x2="21" y2="21"/>
              <line x1="4" y1="4" x2="9" y2="9"/>
            </svg>
            Inspire me
          </button>
        </div>

        {/* Textarea */}
        <div className="relative bg-[#F8F7F6] rounded-3xl border-2 border-transparent focus-within:border-light-primary/30 shadow-[inset_0_2px_4px_rgba(0,0,0,0.05)]">
          <textarea
            id="custom-story"
            value={story}
            onChange={handleChange}
            placeholder=""
            rows={12}
            className="block w-full px-5 pt-4 pb-14 bg-transparent font-body text-sm text-light-text
             placeholder:text-light-outline-secondary resize-none focus:outline-none leading-relaxed"
          />

          {/* ── CHARACTER COUNT badge ── */}
          <div className="absolute bottom-3 right-3">
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all duration-200
              ${isAtLimit
                ? "bg-red-50 border-red-300"
                : isNearLimit
                  ? "bg-light-accent/10 border-light-accent/30"
                  : "bg-white/80 backdrop-blur-sm border-[#F3EDE7]"
              }
            `}>
              {/* Mini progress circle */}
              <svg width="14" height="14" viewBox="0 0 14 14">
                <circle
                  cx="7"
                  cy="7"
                  r="5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="text-light-outline-secondary opacity-30"
                />
                <circle
                  cx="7"
                  cy="7"
                  r="5"
                  fill="none"
                  strokeWidth="2"
                  strokeDasharray={`${2 * Math.PI * 5}`}
                  strokeDashoffset={`${2 * Math.PI * 5 * (1 - progressPercent / 100)}`}
                  strokeLinecap="round"
                  transform="rotate(-90 7 7)"
                  className={`transition-all duration-300
                    ${isAtLimit
                      ? "stroke-red-500"
                      : isNearLimit
                        ? "stroke-light-accent"
                        : "stroke-light-primary"
                    }
                  `}
                />
              </svg>

              {/* Count text */}
              <span className={`font-body text-xs font-medium transition-all duration-200
                ${isAtLimit
                  ? "text-red-500"
                  : isNearLimit
                    ? "text-light-accent"
                    : "text-light-outline/50 font-semibold"
                }
              `}>
                {story.length}/{CHAR_LIMIT} characters
              </span>
            </div>
          </div>
        </div>

        {/* Minimum length hint */}
        <p className={`font-body text-xs mt-2 px-1 ${story.trim().length > MIN_CHARS ? "text-light-outline opacity-60" : "text-light-accent"}`}>
          {story.trim().length > MIN_CHARS
            ? "Great, that's enough to work with."
            : `Write at least ${MIN_CHARS + 1} characters (${Math.max(0, MIN_CHARS + 1 - story.trim().length)} to go).`}
        </p>

      </div>

    </StepPanel>
  );
};

export default CustomQuestionnaireSection;

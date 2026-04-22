import { useEffect, useState, useCallback, useRef } from "react";
import { useDispatch } from "react-redux";
import { setCustomStory } from "../../store/slices/storyWizardSlice";


const CHAR_LIMIT = 500;

interface props{
  onValidChange:(valid:boolean)=>void;
}
const CustomQuestionnaireSection = ({
  onValidChange,
}:props) => {
  // const selectedTemplate = useSelector((state: RootState) => state.story.template);
  // console.log(selectedTemplate);
  const dispatch = useDispatch();
  const [story, setStory] = useState("");

  // Debounce ref for the dispatch function
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const handleChange = (e: any) => {
    const value = e.target.value;
    if (value.length <= CHAR_LIMIT) {
      setStory(value);
    }
    onValidChange(value.length > 0);
  };

  // Debounced dispatch function
  const debouncedDispatch = useCallback(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    debounceRef.current = setTimeout(() => {
      if(story.length > 100){
        dispatch(setCustomStory(story));
        onValidChange(true);
      }else{
        onValidChange(false);
      }
    }, 500); // 500ms debounce delay
  }, [story, dispatch, onValidChange]);

 useEffect(() => {
  debouncedDispatch();
  return () => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
  };
},[story, debouncedDispatch]);
  

  const handleInspireMe = () => {
    const inspirations = [
      "A brave young girl discovers a hidden world beneath her grandmother's garden, where magical creatures need her help to save their kingdom from darkness.",
      "A curious boy finds an old map in his attic that leads him on an adventure through time, meeting historical heroes along the way.",
      "Twin siblings stumble upon a mysterious lighthouse that grants wishes, but they must learn that true magic comes from the heart.",
    ];
    const random = inspirations[Math.floor(Math.random() * inspirations.length)];
    setStory(random.slice(0, CHAR_LIMIT));
  };

  const progressPercent = (story.length / CHAR_LIMIT) * 100;
  const isNearLimit = story.length > CHAR_LIMIT * 0.8;
  const isAtLimit = story.length === CHAR_LIMIT;

  return (
    <div className="bg-light-on-primary dark:bg-dark-bg rounded-3xl p-6 md:p-8  border-light-outline-secondary dark:border-dark-primary-30">

      {/* ── HEADING ── */}
      <div className="mb-6">
        <h2 className="font-heading text-3xl font-bold text-light-text dark:text-dark-text mb-2">
          Tell us about your adventure
        </h2>
        <p className="font-body text-sm text-light-outline dark:text-dark-text">
          Describe the main events, characters, or the lesson you want to teach.
        </p>
      </div>

      {/* ── STORY INPUT CARD ── */}
      <div className="p-4 rounded-3xl  border-light-outline-secondary dark:border-dark-primary-30 bg-light-bg dark:bg-dark-primary-10 overflow-hidden">

        {/* Card Header */}
        <div className="flex items-center justify-between px-5 py-3  border-light-outline-secondary dark:border-dark-primary-30">
          <h3 className="font-body text-sm font-bold text-light-text dark:text-dark-text">
            What is your story about?
          </h3>

          {/* Inspire Me Button */}
          <button
            onClick={handleInspireMe}
            className="flex items-center gap-1.5 font-body text-sm font-medium text-light-primary dark:text-dark-primary hover:opacity-80 transition-all duration-200"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
            </svg>
            Inspire me
          </button>
        </div>

        {/* Textarea */}
        <div className="relative bg-light-on-accent rounded-3xl">
          <textarea
            value={story}
            onChange={handleChange}
            placeholder=""
            rows={10}
            className="w-full px-5 py-4 bg-transparent font-body text-sm text-light-text dark:text-dark-text
             placeholder:text-light-outline-secondary resize-none focus:outline-none leading-relaxed"
          />

          {/* ── CHARACTER COUNT badge ── */}
          <div className="absolute bottom-3 right-3">
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all duration-200
              ${isAtLimit
                ? "bg-red-50 dark:bg-red-500/10 border-red-300 dark:border-red-500/30"
                : isNearLimit
                  ? "bg-light-accent/10 dark:bg-dark-accent/10 border-light-accent/30 dark:border-dark-accent/30"
                  : "bg-light-on-primary dark:bg-dark-bg border-light-outline-secondary dark:border-dark-primary-30"
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
                  className="text-light-outline-secondary dark:text-dark-primary-30 opacity-30"
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
                        ? "stroke-light-accent dark:stroke-dark-accent"
                        : "stroke-light-primary dark:stroke-dark-primary"
                    }
                  `}
                />
              </svg>

              {/* Count text */}
              <span className={`font-body text-xs font-medium transition-all duration-200
                ${isAtLimit
                  ? "text-red-500"
                  : isNearLimit
                    ? "text-light-accent dark:text-dark-accent"
                    : "text-light-outline dark:text-dark-text opacity-60"
                }
              `}>
                {story.length}/{CHAR_LIMIT} characters
              </span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};

export default CustomQuestionnaireSection;

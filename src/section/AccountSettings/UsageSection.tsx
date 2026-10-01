import { useEffect, useState } from "react";
import { STORY_COST, useCredits } from "../../services/credits";
import { listStories } from "../../services/storyService";

const UsageSection = () => {
  const { credits } = useCredits();
  const [storiesCreated, setStoriesCreated] = useState<number | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    listStories(["completed", "incomplete", "generating", "failed"])
      .then((rows) => setStoriesCreated(rows.length))
      .catch((error) => { console.error("Could not load stories:", error); setError(true); });
  }, []);

  const stats = [
    { label: "Credits", value: credits, note: `${STORY_COST} credits make one story` },
    { label: "Stories Created", value: storiesCreated, note: "Every book you've generated" },
    { label: "Stories You Can Make", value: credits === null ? null : Math.floor(credits / STORY_COST), note: "With your current credits" },
  ];

  return (
    <div className="bg-light-on-primary dark:bg-dark-bg rounded-3xl p-6  border-light-outline-secondary dark:border-dark-primary-30">

      {/* Header */}
      <div className="mb-5">
        <h3 className="font-heading font-bold text-lg text-light-text dark:text-dark-text">
          Usage Details
        </h3>
        <p className="font-body text-xs text-light-text dark:text-dark-text opacity-80 mt-3">
          Track your credits and stories
        </p>
      </div>

      <div className="space-y-4 mt-6">
        {stats.map((stat) => (
          <div key={stat.label} className="p-4 rounded-xl  border-light-outline-secondary dark:border-dark-primary-30 bg-light-bg dark:bg-dark-primary-10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Icon */}
              <div className="w-9 h-9 rounded-full bg-dark-primary-10 border border-dark-primary-30 flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-light-primary dark:text-dark-primary">
                  <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
                  <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
                </svg>
              </div>
              <div>
                <p className="font-body text-sm font-semibold text-light-text dark:text-dark-text">
                  {stat.label}
                </p>
                <p className="font-body text-xs text-light-outline dark:text-dark-text opacity-60">
                  {stat.note}
                </p>
              </div>
            </div>
            <p className="font-display font-bold text-lg text-light-text dark:text-dark-text">
              {stat.value ?? (error && stat.label === "Stories Created" ? "–" : "…")}
            </p>
          </div>
        ))}
        {error && (
          <p className="font-body text-xs text-red-500">We couldn't load your stories. Please refresh the page to try again.</p>
        )}
      </div>
    </div>
  );
};

export default UsageSection;

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
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#F2F0F4] shadow-sm">

      {/* Header */}
      <div className="mb-6">
        <h3 className="font-heading font-bold text-xl text-light-text">
          Usage Details
        </h3>
        <p className="font-body text-sm text-light-outline mt-1">
          Track your credits and stories
        </p>
      </div>

      <div className="space-y-4">
        {stats.map((stat) => (
          <div key={stat.label} className="p-4 rounded-2xl border border-gray-200 bg-gray-50 flex items-center justify-between gap-4">
            <div className="flex items-center gap-4 min-w-0">
              {/* Icon */}
              <div className="w-12 h-12 shrink-0 rounded-full bg-white border border-gray-200 flex items-center justify-center">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-light-primary">
                  <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
                  <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
                </svg>
              </div>
              <div>
                <p className="font-body text-base sm:text-lg font-semibold text-light-text">
                  {stat.label}
                </p>
                <p className="font-body text-sm sm:text-base text-light-outline">
                  {stat.note}
                </p>
              </div>
            </div>
            <p className="font-body font-bold text-xl shrink-0 text-light-text">
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

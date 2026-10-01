import { useNavigate } from "react-router-dom";
import { STORY_COST, useCredits } from "../../services/credits";

const SubscriptionSection = () => {
  const navigate = useNavigate();
  const { credits } = useCredits();

  return (
    <div className="bg-light-on-primary dark:bg-dark-bg rounded-3xl p-6 border-light-outline-secondary dark:border-dark-primary-30">

      {/* Header */}
      <div className="mb-6">
        <h3 className="font-heading font-bold text-lg text-light-text dark:text-dark-text">
          Credits & Billing
        </h3>
        <p className="font-body text-xs text-light-outline dark:text-dark-text opacity-60 mt-1">
          Each story uses {STORY_COST} credits.
        </p>
      </div>

      <div className="space-y-5">

        {/* Credit balance */}
        <div
          className="p-4 rounded-xl flex items-center justify-between"
          style={{ background: "linear-gradient(135deg, #3D52C4, #4F6AF5)" }}
        >
          <div>
            <p className="font-body text-[10px] text-white/60 uppercase tracking-widest font-semibold mb-1">
              Credit Balance
            </p>
            <p className="font-display text-xl font-bold text-white">
              {credits ?? "…"}
            </p>
            {credits !== null && (
              <p className="font-body text-xs text-white/70 mt-0.5">
                Enough for {Math.floor(credits / STORY_COST)} {Math.floor(credits / STORY_COST) === 1 ? "story" : "stories"}
              </p>
            )}
          </div>
          <button
            onClick={() => navigate("/pricing")}
            className="px-4 py-2 rounded-lg bg-white/20 border border-white/30 text-white font-body text-xs font-semibold hover:bg-white/30 transition-all">
            Buy credits
          </button>
        </div>

        {/* Purchase history */}
        <div>
          <p className="font-body text-xs font-bold text-light-outline dark:text-dark-text opacity-80 uppercase tracking-widest mb-3">
            Purchase History
          </p>
          <p className="font-body text-sm text-light-outline dark:text-dark-text">
            Your credit purchases will appear here.
          </p>
        </div>

      </div>
    </div>
  );
};

export default SubscriptionSection;

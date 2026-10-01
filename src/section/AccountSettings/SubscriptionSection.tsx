import { useNavigate } from "react-router-dom";
import { STORY_COST, useCredits } from "../../services/credits";

const SubscriptionSection = () => {
  const navigate = useNavigate();
  const { credits } = useCredits();

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#F2F0F4] shadow-sm">

      {/* Header */}
      <div className="mb-6">
        <h3 className="font-heading font-bold text-xl text-light-text">
          Credits & Billing
        </h3>
        <p className="font-body text-sm text-light-outline mt-1">
          Each story uses {STORY_COST} credits.
        </p>
      </div>

      <div className="space-y-8">

        {/* Credit balance */}
        <div className="p-6 rounded-xl flex flex-wrap items-center justify-between gap-4 bg-gradient-to-br from-[#3D82F6] to-[#1F51D8]">
          <div>
            <p className="font-body text-xs font-bold text-white/90 uppercase">
              Credit Balance
            </p>
            <p className="font-heading text-2xl font-bold text-white mt-1">
              {credits ?? "…"}
            </p>
            {credits !== null && (
              <p className="font-body text-sm text-white/90 mt-1">
                Enough for {Math.floor(credits / STORY_COST)} {Math.floor(credits / STORY_COST) === 1 ? "story" : "stories"}
              </p>
            )}
          </div>
          <button
            onClick={() => navigate("/pricing")}
            className="px-4 py-2 rounded-full bg-white border border-gray-200 shadow-sm text-light-primary font-body text-sm font-semibold hover:opacity-90 transition-all">
            Buy credits
          </button>
        </div>

        {/* Purchase history */}
        <div>
          <p className="font-body text-xs font-bold text-light-text uppercase tracking-wide mb-3">
            Purchase History
          </p>
          <p className="font-body text-sm text-light-outline">
            Your credit purchases will appear here.
          </p>
        </div>

      </div>
    </div>
  );
};

export default SubscriptionSection;

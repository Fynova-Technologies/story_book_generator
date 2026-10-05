import { useNavigate } from "react-router-dom";
import { BASE_COST, PAGE_COST, productCredits, TYPICAL_STORY_COST, useCredits, usePurchaseHistory } from "../../services/credits";

const SubscriptionSection = () => {
  const navigate = useNavigate();
  const { credits } = useCredits();
  const purchases = usePurchaseHistory();

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#F2F0F4] shadow-sm">

      {/* Header */}
      <div className="mb-6">
        <h3 className="font-heading font-bold text-xl text-light-text">
          Credits & Billing
        </h3>
        <p className="font-body text-sm text-light-outline mt-1">
          Each book uses {BASE_COST} credits plus {PAGE_COST} per page.
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
                Enough for {Math.floor(credits / TYPICAL_STORY_COST)} six-page {Math.floor(credits / TYPICAL_STORY_COST) === 1 ? "story" : "stories"}
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
          {purchases === null ? (
            <p className="font-body text-sm text-light-outline">Loading…</p>
          ) : purchases.length === 0 ? (
            <p className="font-body text-sm text-light-outline">No purchases yet.</p>
          ) : (
            <ul className="divide-y divide-[#F2F0F4]">
              {purchases.map(purchase => (
                <li key={purchase.transactionIdentifier} className="flex justify-between py-2.5 font-body text-sm">
                  <span className="font-semibold text-light-text">{productCredits(purchase.productIdentifier)} credits</span>
                  <span className="text-light-outline">{purchase.purchaseDate.toLocaleDateString()}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

      </div>
    </div>
  );
};

export default SubscriptionSection;

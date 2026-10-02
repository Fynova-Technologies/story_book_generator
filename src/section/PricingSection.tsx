import { useState } from "react";
import type { Package } from "@revenuecat/purchases-js";
import PricingCard from "../components/PricingCard/PricingCard";
import { buyPack, packCredits, STORY_COST, useCreditPacks } from "../services/credits";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";

const PricingSection = () => {
  const navigate = useNavigate();
  const { status: loggedIn, authInitialized, userData } = useSelector((state: RootState) => state.auth);
  const packs = useCreditPacks(loggedIn, authInitialized);
  const [buying, setBuying] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const buy = async (pack: Package) => {
    if (!loggedIn) return navigate("/signup");
    setError(null);
    setBuying(pack.identifier);
    try {
      if (await buyPack(pack, userData?.email ?? null)) navigate("/dashboard");
    } catch (error) {
      console.error("Purchase failed:", error);
      setError("The payment didn't go through. Please try again.");
    } finally {
      setBuying(null);
    }
  };

  return (
    <section
      data-bg="light"
      className="max-w-7xl mx-auto py-8 px-4 sm:px-8 bg-light-panel rounded-[36px]"
    >
      <div className="max-w-[1066px] mx-auto">

        {/* ── TOP BADGE ── */}
        <div className="flex justify-center mb-4">
          <span className="font-body px-8 py-2 rounded-full text-base font-semibold text-black bg-white">
            Pricing
          </span>
        </div>

        {/* ── HEADING ── */}
        <div className="text-center mb-8">
          <h2 className="font-heading text-3xl sm:text-4xl md:text-[50px] font-bold text-black leading-tight md:leading-[60px]">
            Buy Credits, <br /> Make Stories
          </h2>
        </div>

        {error && <p className="mb-6 text-center font-body text-red-600">{error}</p>}

        {/* ── PRICING CARDS ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-7 items-center">
          {packs === null && <p className="md:col-span-3 text-center font-body text-light-outline">Loading credit packs…</p>}
          {packs?.length === 0 && <p className="md:col-span-3 text-center font-body text-light-outline">Credit packs are unavailable right now. Please try again later.</p>}
          {packs?.map((pack, i) => {
            const credits = packCredits(pack);
            const stories = credits / STORY_COST;
            return (
              <PricingCard
                key={pack.identifier}
                planName={pack.webBillingProduct.title}
                price={pack.webBillingProduct.currentPrice.formattedPrice}
                description={`${stories} storybooks, one-time payment.`}
                features={[
                  `${credits} credits (${STORY_COST} per story)`,
                  "All art and story styles",
                  "Credits never expire",
                  "No subscription",
                ]}
                buttonLabel={!loggedIn ? "Sign up to buy" : buying === pack.identifier ? "Opening checkout…" : "Buy credits"}
                isPopular={i === 1}
                onButtonClick={() => { if (!buying) buy(pack); }}
              />
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default PricingSection;

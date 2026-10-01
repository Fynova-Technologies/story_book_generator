import { useState } from "react";
import PricingCard from "../components/PricingCard/PricingCard";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";

const pricingData = {
  annually: [
    {
      id: 1,
      planName: "Storybook Basic",
      price: "$0/mo",
      description: "For team use with light needs.",
      isFree: true,
      isPopular: false,
      buttonLabel: "Try Free",
      features: [
        "Unlimited story generation",
        "All art styles",
        "Voice narration included",
        "Voice narration included",
        "Share unlimited stories",
        "Share unlimited stories",
      ],
    },
    {
      id: 2,
      planName: "Storybook Lifetime",
      price: "$189/mo",
      description: "For pro use with light needs.",
      isFree: false,
      isPopular: true,
      buttonLabel: "Get started",
      features: [
        "Unlimited story generation",
        "All art styles",
        "Voice narration included",
        "Voice narration included",
        "Share unlimited stories",
        "Share unlimited stories",
      ],
    },
    {
      id: 3,
      planName: "Storybook Lifetime",
      price: "$189/mo",
      description: "For team use with light needs.",
      isFree: false,
      isPopular: false,
      buttonLabel: "Get started",
      features: [
        "Unlimited story generation",
        "All art styles",
        "Voice narration included",
        "Voice narration included",
        "Share unlimited stories",
        "Share unlimited stories",
      ],
    },
  ],
  monthly: [
    {
      id: 1,
      planName: "Storybook Basic",
      price: "$0/mo",
      description: "For team use with light needs.",
      isFree: true,
      isPopular: false,
      buttonLabel: "Try Free",
      features: [
        "Unlimited story generation",
        "All art styles",
        "Voice narration included",
        "Share unlimited stories",
      ],
    },
    {
      id: 2,
      planName: "Storybook Pro",
      price: "$29/mo",
      description: "For pro use with light needs.",
      isFree: false,
      isPopular: true,
      buttonLabel: "Get started",
      features: [
        "Unlimited story generation",
        "All art styles",
        "Voice narration included",
        "Voice narration included",
        "Share unlimited stories",
        "Share unlimited stories",
      ],
    },
    {
      id: 3,
      planName: "Storybook Business",
      price: "$49/mo",
      description: "For team use with light needs.",
      isFree: false,
      isPopular: false,
      buttonLabel: "Get started",
      features: [
        "Unlimited story generation",
        "All art styles",
        "Voice narration included",
        "Voice narration included",
        "Share unlimited stories",
        "Share unlimited stories",
      ],
    },
  ],
};

const PricingSection = () => {
  const [billing, setBilling] = useState<"annually" | "monthly">("annually");
  const navigate = useNavigate();
  const loggedIn = useSelector((state: RootState) => state.auth.status);

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
            Simple Plans <br /> For Serious Work
          </h2>
        </div>

        {/* ── TOGGLE — Annually / Monthly ── */}
        <div className="flex justify-center mb-12">
          <div className="flex items-center gap-3 p-1 rounded-[26px] bg-light-bg">

            {/* Annually */}
            <button
              onClick={() => setBilling("annually")}
              className={`w-[129px] py-1.5 rounded-full text-[15px] font-body font-medium transition-all duration-200
                ${billing === "annually"
                  ? "bg-light-primary text-light-on-primary shadow-sm"
                  : "text-black hover:text-light-primary"
                }
              `}
            >
              Annually
            </button>

            {/* Monthly */}
            <button
              onClick={() => setBilling("monthly")}
              className={`w-[129px] py-1.5 rounded-full text-[15px] font-body font-medium transition-all duration-200
                ${billing === "monthly"
                  ? "bg-light-primary text-light-on-primary shadow-sm"
                  : "text-black hover:text-light-primary"
                }
              `}
            >
              Monthly
            </button>

          </div>
        </div>

        {/* ── PRICING CARDS ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-7 items-center">
          {pricingData[billing].map((plan) => (
            <PricingCard
              key={plan.id}
              planName={plan.planName}
              price={plan.price}
              description={plan.description}
              features={plan.features}
              buttonLabel={plan.buttonLabel}
              isPopular={plan.isPopular}
              isFree={plan.isFree}
              onButtonClick={() => navigate(loggedIn ? "/dashboard" : "/signup")}
            />
          ))}
        </div>

      </div>
    </section>
  );
};

export default PricingSection;

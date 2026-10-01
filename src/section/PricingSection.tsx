import { useState } from "react";
import PricingCard from "../components/PricingCard/PricingCard";

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

  return (
    <section
      data-bg="light"
      className="w-full py-16 px-6 md:px-12 xl:px-20 bg-dark-primary-10 dark:bg-dark-bg rounded-3xl"
    >
      <div className="max-w-6xl mx-auto">

        {/* ── TOP BADGE ── */}
        <div className="flex justify-center mb-6">
          <span className="font-body px-5 py-2 rounded-full  border-light-outline-secondary dark:border-dark-primary-30 text-sm 
          font-medium text-light-text dark:text-dark-text bg-light-on-primary dark:bg-dark-primary-10">
            Pricing
          </span>
        </div>

        {/* ── HEADING ── */}
        <div className="text-center mb-8">
          <h2 className="font-heading text-4xl md:text-4xl font-bold text-light-text dark:text-dark-text leading-tight">
            Simple Plans <br /> For Serious Work
          </h2>
        </div>

        {/* ── TOGGLE — Annually / Monthly ── */}
        <div className="flex justify-center mb-12">
          <div className="flex items-center p-1 rounded-full bg-light-on-primary dark:bg-dark-primary-10 border-light-outline-secondary dark:border-dark-primary-30">

            {/* Annually */}
            <button
              onClick={() => setBilling("annually")}
              className={`px-6 py-2 rounded-full text-sm font-body font-medium transition-all duration-200
                ${billing === "annually"
                  ? "bg-light-primary dark:bg-dark-primary text-light-on-primary shadow-sm"
                  : "text-light-outline dark:text-dark-text hover:text-light-text"
                }
              `}
            >
              Annually
            </button>

            {/* Monthly */}
            <button
              onClick={() => setBilling("monthly")}
              className={`px-6 py-2 rounded-full text-sm font-body font-medium transition-all duration-200
                ${billing === "monthly"
                  ? "bg-light-primary dark:bg-dark-primary text-light-on-primary shadow-sm"
                  : "text-light-outline dark:text-dark-text hover:text-light-text"
                }
              `}
            >
              Monthly
            </button>

          </div>
        </div>

        {/* ── PRICING CARDS ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
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
              onButtonClick={() => console.log(`${plan.planName} clicked`)}
            />
          ))}
        </div>

      </div>
    </section>
  );
};

export default PricingSection;

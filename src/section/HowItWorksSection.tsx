const chat = "/assets/icons/chat.png";
const laptop = "/assets/icons/laptop.png";
const paint = "/assets/icons/paint.png";
const share = "/assets/icons/share.png";
const template = "/assets/icons/template.png";
const steps = [
  {
    id: 1,
    title: "Choose your template",
    description:
      "Select a story type tailored to your occasion, mood, and purpose for a perfect storytelling experience.",
    icon: template,
  },
  {
    id: 2,
    title: "Add your details",
    description:
      "Answer simple guided questions to help shape your ideas into a personalized and meaningful story.",
    icon: chat,
  },
  {
    id: 3,
    title: "Ai creates magic",
    description:
      "Our AI transforms your story into a beautifully illustrated storybook, ready to read and share.",
    icon: paint,
  },
  {
    id: 4,
    title: "Share & print",
    description:
      "Download your story, share it online, or order a beautifully printed copy anytime you like.",
    icon: share,
  },
];

const HowItWorksSection = () => {
  return (
    <section
        className="max-w-7xl mx-auto px-5 py-8 md:p-10 bg-light-panel overflow-hidden rounded-[36px]"
    >
        {/* ── TOP BADGE ── */}
        <div className="flex justify-center mb-4">
          <span className="font-body px-8 py-2 rounded-full text-base font-semibold text-black bg-white">
            How it works
          </span>
        </div>

        {/* ── HEADING ── */}
        <h2
          className="font-heading text-3xl sm:text-4xl md:text-[50px] font-bold text-center text-light-text mb-12 md:mb-20 leading-tight md:leading-[60px]"
        >
          How Our Story <br /> Generator Works
        </h2>

        {/* ── MAIN CONTENT ── */}
        <div className="flex flex-col lg:flex-row items-stretch gap-10 lg:gap-14">

            {/* ── LEFT — 4 Steps in 2x2 Grid ── */}
            <div className="w-full lg:w-[45%] grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-10 content-start">
                {steps.map((step) => (
                <div key={step.id} className="flex flex-col gap-4">

                    {/* Icon Box */}
                    <div className="w-16 h-16 rounded-[11px] bg-dark-primary-10 flex items-center justify-center">
                    <img
                        src={step.icon}
                        alt=""
                        className="w-8 h-8 object-contain"
                    />
                    </div>

                    <div className="flex flex-col gap-2">
                    {/* Title */}
                    <h3 className="font-body text-base font-semibold text-light-text">
                    {step.title}
                    </h3>

                    {/* Description */}
                    <p className="font-body text-sm text-light-outline leading-5">
                    {step.description}
                    </p>
                    </div>

                </div>
                ))}
            </div>

            {/* ── RIGHT — Laptop Mockup ── */}
            <div className="w-full lg:w-[55%] flex items-center justify-center rounded-[15px] bg-black/10 p-6 md:p-16">
                <img
                    src={laptop}
                    alt="Story Generator App"
                    className="w-full max-w-[505px] h-auto object-contain"
                />
            </div>

        </div>
    </section>
  );
};

export default HowItWorksSection;

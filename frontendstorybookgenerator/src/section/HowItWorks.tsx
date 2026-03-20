import chat from "../assets/icons/chat.png";
import laptop from "../assets/icons/laptop.png";
import paint from "../assets/icons/paint.png";
import share from "../assets/icons/share.png";
import template from "../assets/icons/template.png";
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

const HowItWorks = () => {
  return (
    <section
        className="max-h-screen px-5 pt-3 pb-15 md:px-12 xl:px-20 bg-dark-primary-10 dark:bg-dark-bg overflow-hidden rounded-3xl"
    >
      <div className="max-w-7xl mx-auto">

        {/* ── TOP BADGE ── */}
        <div className="flex justify-center mb-6">
          <span className="font-body px-5 py-2 rounded-full border-b-light-bg dark:border-dark-primary-30 text-sm font-medium text-light-text dark:text-dark-text bg-light-on-primary dark:bg-dark-primary-10">
            How it works
          </span>
        </div>

        {/* ── HEADING ── */}
        <h2
          className="font-heading text-4xl md:text-5xl font-bold text-center text-light-text dark:text-dark-text mb-16 leading-tight font-display"
        >
          How Our Story <br /> Generator Works
        </h2>

        {/* ── MAIN CONTENT — Steps + Laptop ── */}
        {/* ── MAIN CONTENT ── */}
            <div className="flex flex-col lg:flex-row items-start gap-12 mb-5">

            {/* ── LEFT — 4 Steps in 2x2 Grid ── */}
            <div className="w-full lg:w-[45%] grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-10">
                {steps.map((step) => (
                <div key={step.id} className="flex flex-col gap-4">

                    {/* Icon Box */}
                    <div className="w-14 h-14 rounded-2xl bg-dark-primary-10 border border-dark-primary-30 flex items-center justify-center">
                    <img
                        src={step.icon}
                        alt={`${step.title} icon`}
                        className="w-6 h-6 object-contain"
                    />
                    </div>

                    {/* Title */}
                    <h3 className="text-base font-semibold text-light-text dark:text-dark-text font-display">
                    {step.title}
                    </h3>

                    {/* Description */}
                    <p className="text-sm text-light-outline dark:text-dark-text leading-relaxed font-body">
                    {step.description}
                    </p>

                </div>
                ))}
            </div>

            {/* ── RIGHT — Laptop Mockup ── */}
            <div className="w-full lg:w-[55%] flex items-center justify-center">
                <div className="w-full p-4 rounded-3xl overflow-hidden bg-dark-primary-30 dark:bg-dark-primary-10 shadow-xl">
                <img
                    src={laptop}
                    alt="Story Generator App"
                    className="w-full h-auto object-cover rounded-2xl"
                />
                </div>
            </div>

            </div>

        </div>
    </section>
  );
};

export default HowItWorks;

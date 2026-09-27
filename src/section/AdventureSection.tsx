import AdventureCard from "../components/AdventureCard/AdventureCard";

import BrowseIcon from "../assets/icons/browseicon.png"
import CreateIcon from "../assets/icons/createicon.png"
import EditorIcon from "../assets/icons/editoricon.png"

const adventureData = [
  {
    id: 1,
    icon: BrowseIcon,
    title: "Browse Templates",
    description:
      "Start with a pre-made theme like Sci-Fi, Fantasy, or Bedtime. Perfect for quick inspiration.",
    buttonLabel: "Explore themes",
    isPopular: false,
    onButtonClick: () => console.log("Explore themes clicked"),
  },
  {
    id: 2,
    icon: CreateIcon,
    title: "Create Custom Story",
    description:
      "Start from scratch with your own unique idea. Full creative control with AI magic.",
    buttonLabel: "Start Creation",
    isPopular: true,   // ← shows "MOST POPULAR" badge
    onButtonClick: () => console.log("Start Creation clicked"),
  },
  {
    id: 3,
    icon: EditorIcon,
    title: "Manual editor",
    description:
      "Build your story page by page with our visual editor. Drag, drop, and design freely.",
    buttonLabel: "Open Editor",
    isPopular: false,
    onButtonClick: () => console.log("Open Editor clicked"),
  },
];

const StartAdventure = () => {
  return (
    <section
      data-bg="light"
      className="w-full py-16 px-6 md:px-12 xl:px-20 bg-light-bg dark:bg-dark-bg"
    >
      <div className="max-w-6xl mx-auto">

        {/* ── HEADING ── */}
        <div className="text-center mb-12">
          <h2 className="font-heading text-4xl md:text-5xl font-bold text-light-text dark:text-dark-text leading-tight mb-4">
            Start Your Adventure
          </h2>
          <p className="font-body text-sm text-light-outline dark:text-dark-text font-bold">
            Choose how you want to create your magical storybook
          </p>
        </div>

        {/* ── CARDS GRID ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          {adventureData.map((card) => (
            <AdventureCard
              key={card.id}
              icon={card.icon}
              title={card.title}
              description={card.description}
              buttonLabel={card.buttonLabel}
              isPopular={card.isPopular}
              onButtonClick={card.onButtonClick}
            />
          ))}
        </div>

      </div>
    </section>
  );
};

export default StartAdventure;

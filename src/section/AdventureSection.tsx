import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { chooseCustomStory, resetWizard } from "../store/slices/storyWizardSlice";
import AdventureCard from "../components/AdventureCard/AdventureCard";

const BrowseIcon = "/assets/icons/browseicon.png";
const CreateIcon = "/assets/icons/createicon.png";
const EditorIcon = "/assets/icons/editoricon.png";

const adventureData = [
  {
    id: 1,
    icon: BrowseIcon,
    title: "Browse Templates",
    description:
      "Start with a pre-made theme like Sci-Fi, Fantasy, or Bedtime. Perfect for quick inspiration.",
    buttonLabel: "Explore themes",
    isPopular: false,
    path: "/templates",
  },
  {
    id: 2,
    icon: CreateIcon,
    title: "Create Custom Story",
    description:
      "Start from scratch with your own unique idea. Full creative control with AI magic.",
    buttonLabel: "Start Creation",
    isPopular: true,   // ← shows "MOST POPULAR" badge
    path: "/create-story",
    custom: true,      // skips the template: "Write my own story"
  },
  {
    id: 3,
    icon: EditorIcon,
    title: "Manual editor",
    description:
      "Build your story page by page with our visual editor. Drag, drop, and design freely.",
    buttonLabel: "Open Editor",
    isPopular: false,
    path: "/create-story",
  },
];

const StartAdventure = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Starting a story always starts a fresh wizard.
  const open = (card: (typeof adventureData)[number]) => {
    if (card.path === "/create-story") {
      dispatch(resetWizard());
      if ("custom" in card) dispatch(chooseCustomStory());
    }
    navigate(card.path);
  };
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
              onButtonClick={() => open(card)}
            />
          ))}
        </div>

      </div>
    </section>
  );
};

export default StartAdventure;

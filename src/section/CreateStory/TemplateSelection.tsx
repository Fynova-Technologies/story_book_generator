import { useEffect, useState } from "react";
import TemplateCard from "../../components/TempleteCard/TemplateCard";
import StepPanel, { SelectedPill } from "./StepPanel";

// 👉 Import your template images here
const Birthday = "/assets/images/templete/Birthday.png";
const love = "/assets/images/templete/LoveRomance.png";
const apology = "/assets/images/templete/Apology.png";
const wedding = "/assets/images/templete/Weeding.png";
const longdistance = "/assets/images/templete/Longdistance.png";
const pet = "/assets/images/templete/Petmemorial.png";
const graduation = "/assets/images/templete/Graduation.png";
const family = "/assets/images/templete/Familyheritage.png";
const travel = "/assets/images/templete/Travel.png";
const retirement = "/assets/images/templete/Retirement.png";
const educational = "/assets/images/templete/Educational.png";
const gratitude = "/assets/images/templete/Thankyou.png";
import { useDispatch, useSelector } from "react-redux";
import { chooseCustomStory, setTemplate } from "../../store/slices/storyWizardSlice";
import { RootState } from "../../store/store";



const templatesData = [
  {
    id: 1,
    title: "Birthday & Celebrations",
    description: "Capture the joy of birthdays with vibrant, festive stories your loved ones will treasure forever.",
    image: Birthday, // 👉 replace with: img1
    category: "Birthday",
    likes: "2.4k",
    views: "10k",
  },
  {
    id: 2,
    title: "Love & Romance",
    description: "Weave a timeless love story with warmth, prose, and illustrations that feel like a fairytale.",
    image: love, // 👉 replace with: img2
    category: "Love",
    likes: "2.4k",
    views: "10k",
  },
  {
    id: 3,
    title: "Heartfelt Apologies",
    description: "Sometimes the right words heal everything. Let your sincerity shine through a heartfelt story.",
    image: apology,
    category: "Apology",
    likes: "2.4k",
    views: "10k",
  },
  {
    id: 4,
    title: "Wedding Memories",
    description: "Relive the magic of your wedding day with elegant layouts, golden accents, and cherished photos.",
    image: wedding,
    category: "Wedding",
    likes: "2.4k",
    views: "10k",
  },
  {
    id: 5,
    title: "Long Distance Relations",
    description: "Miles apart, hearts connected. Tell the story of love across continents and time zones.",
    image: longdistance,
    category: "LongDistance",
    likes: "2.4k",
    views: "10k",
  },
  {
    id: 6,
    title: "Pet Memorial Tributes",
    description: "Honor your furry companion with a touching tribute — their paws leave forever prints on your heart.",
    image: pet,
    category: "Memorial",
    likes: "2.4k",
    views: "10k",
  },
  {
    id: 7,
    title: "Graduation Milestones",
    description: "Cap and gown, a whole new world ahead. Celebrate the journey and the brilliant future waiting.",
    image: graduation,
    category: "Milestones",
    likes: "2.4k",
    views: "10k",
  },
  {
    id: 8,
    title: "Family Heritage & History",
    description: "Roots run deep. Chronicle your family's legacy across generations in a beautifully illustrated saga.",
    image: family,
    category: "Family",
    likes: "2.4k",
    views: "10k",
  },
  {
    id: 9,
    title: "Travel Adventures",
    description: "From cobblestone alleys to mountain peaks — turn your wanderlust into a storybook odyssey.",
    image: travel,
    category: "Adventures",
    likes: "2.4k",
    views: "10k",
  },
  {
    id: 10,
    title: "Retirement Celebrations",
    description: "A lifetime of dedication deserves a legendary story. Raise a glass to the next great chapter.",
    image: retirement,
    category: "Retirement",
    likes: "2.4k",
    views: "10k",
  },
  {
    id: 11,
    title: "Educational Stories for Kids",
    description: "Spark curiosity and imagination with whimsical, colorful stories that make learning an adventure.",
    image: educational,
    category: "Kids",
    likes: "2.4k",
    views: "10k",
  },
  {
    id: 12,
    title: "Thank You & Gratitude",
    description: "Express your deepest thanks in a story that says so much more than words ever could on their own.",
    image: gratitude,
    category: "Gratitude",
    likes: "2.4k",
    views: "10k",
  },
];

interface props{
  onValidChange:(valid:boolean)=>void;
}

const TemplateSelection = ({
  onValidChange,
}:props) => {
  const dispatch = useDispatch();
  const [activeFilter, setActiveFilter] = useState("All Templates");
  const selectedTemplate = useSelector((state: RootState) => state.story.template || null);
  const customStory = useSelector((state: RootState) => state.story.customStory);

  const handleSelect = (templateTitle: string) => {
    dispatch(setTemplate(templateTitle));
  };

  // Valid once a template or "Write my own story" is chosen
  useEffect(() => {
    onValidChange(selectedTemplate !== null || customStory);
  }, [selectedTemplate, customStory, onValidChange]);

  return (
    <StepPanel
      title="Select Template"
      subtitle="Choose a story theme to begin your personalized storybook."
      aside={(selectedTemplate || customStory) && <SelectedPill label={selectedTemplate ?? "Your own story"} />}
    >

        {/* ── WRITE MY OWN STORY ── */}
        <button
          onClick={() => dispatch(chooseCustomStory())}
          aria-pressed={customStory}
          className={`w-full mb-6 flex items-center justify-between gap-4 p-5 rounded-[18px] border-2 text-left transition-all duration-200 bg-white
            ${customStory
              ? "border-light-primary"
              : "border-transparent hover:shadow-[0_4px_13px_rgba(0,0,0,0.25)]"
            }
          `}
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-light-primary/10 flex items-center justify-center shrink-0 text-light-primary">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 20h9"/>
                <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4z"/>
              </svg>
            </div>
            <div>
              <h4 className="font-body font-bold text-base text-light-text">
                Write my own story
              </h4>
              <p className="font-body text-sm text-[#7A7A8C] leading-snug mt-1">
                Skip the templates and describe your story in your own words.
              </p>
            </div>
          </div>
          {customStory && (
            <div className="w-7 h-7 rounded-full bg-light-primary flex items-center justify-center shadow-md flex-shrink-0">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            </div>
          )}
        </button>

        {/* ── TEMPLATE CARDS GRID ── */}
        {templatesData.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {templatesData.map((template) => (
              <TemplateCard
                key={template.id}
                image={template.image}
                title={template.title}
                description={template.description}
                isSelected={selectedTemplate === template.title}
                onClick={() => handleSelect(template.title)}
              />
            ))}
          </div>
        ) : (
          // Empty state
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-light-outline-secondary">
              <circle cx="11" cy="11" r="8"/>
              <line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <p className="font-body text-sm text-light-outline opacity-50">
              No templates found for "{activeFilter}"
            </p>
            <button
              onClick={() => setActiveFilter("All Templates")}
              className="font-body text-sm font-medium text-light-primary hover:underline underline-offset-2"
            >
              View all templates
            </button>
          </div>
        )}

    </StepPanel>
  );
};

export default TemplateSelection;

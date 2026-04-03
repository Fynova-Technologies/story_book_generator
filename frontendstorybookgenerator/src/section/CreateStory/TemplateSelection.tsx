import { useEffect, useState } from "react";
import TemplateCard from "../../components/TempleteCard/TemplateCard";

// 👉 Import your template images here
import Birthday from "../../assets/images/templete/Birthday.png"
import love from "../../assets/images/templete/LoveRomance.png"
import apology from "../../assets/images/templete/Apology.png"
import wedding from "../../assets/images/templete/Weeding.png"
import longdistance from "../../assets/images/templete/Longdistance.png"
import pet from "../../assets/images/templete/Petmemorial.png"
import graduation from "../../assets/images/templete/Graduation.png"
import family from "../../assets/images/templete/Familyheritage.png"
import travel from "../../assets/images/templete/Travel.png"
import retirement from "../../assets/images/templete/Retirement.png"
import educational from "../../assets/images/templete/Educational.png"
import gratitude from "../../assets/images/templete/Thankyou.png"
import { useDispatch } from "react-redux";
import { setTemplate } from "../../store/slices/storyWizardSlice";



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
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const handleSelect = ( templateCategory: string) => {
    setSelectedTemplate(templateCategory);
    dispatch(setTemplate(templateCategory));
  };
  useEffect(() => {
    // Mark this step as valid when a template is selected
    
      onValidChange(selectedTemplate !== null);
    

},[selectedTemplate]);
  // console.log(selectedTemplate);
  



  return (
    <section className="w-full py-10 px-6 md:px-10 xl:px-10 bg-light-on-primary dark:bg-dark-bg rounded-3xl">
      <div className="max-w-7xl mx-auto">

        

        {/* ── SECTION HEADING ── */}
        <div className="mb-6">
          <h2 className="font-heading text-2xl font-bold text-light-text dark:text-dark-text">
            Select Template
          </h2>
          <p className="font-body text-xs text-light-outline dark:text-dark-text opacity-50 mt-1">
            Choose a story them to begin your personalized storybook.
          </p>
        </div>

         {/* ✅ Selected art style display */}
          {selectedTemplate && (
            <div className="flex items-center justify-center gap-2 mb-6">
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-dark-primary-10 dark:bg-dark-primary-10 border border-dark-primary-30">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-light-primary dark:text-dark-primary">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                <span className="font-body text-sm font-semibold text-light-primary dark:text-dark-primary">
                  {templatesData.find((s) => s.category === selectedTemplate)?.title} selected
                </span>
              </div>
            </div>
          )}

        {/* ── TEMPLATE CARDS GRID ── */}
        {templatesData.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {templatesData.map((template) => (
              <TemplateCard
                key={template.id}
                image={template.image}
                title={template.title}
                description={template.description}
                isSelected={selectedTemplate === template.category}
                onClick={() => handleSelect(template.category)}
              />
            ))}
          </div>
        ) : (
          // Empty state
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-light-outline-secondary dark:text-dark-primary-30">
              <circle cx="11" cy="11" r="8"/>
              <line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <p className="font-body text-sm text-light-outline dark:text-dark-text opacity-50">
              No templates found for "{activeFilter}"
            </p>
            <button
              onClick={() => setActiveFilter("All Templates")}
              className="font-body text-sm font-medium text-light-primary dark:text-dark-primary hover:underline underline-offset-2"
            >
              View all templates
            </button>
          </div>
        )}

      </div>
    </section>
  );
};

export default TemplateSelection;

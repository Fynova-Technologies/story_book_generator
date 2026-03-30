import { useState } from "react";
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




const filterTabs = [
  "All Templates",
  "Celebrations",
  "Love & Family",
  "Milestones",
  "Memorial",
  "Adventures",
  "Kids",
  "Gratitude",
];

const templatesData = [
  {
    id: 1,
    title: "Birthday & Celebrations",
    description: "Capture the joy of birthdays with vibrant, festive stories your loved ones will treasure forever.",
    image: Birthday, // 👉 replace with: img1
    category: "Celebrations",
    likes: "2.4k",
    views: "10k",
  },
  {
    id: 2,
    title: "Love & Romance",
    description: "Weave a timeless love story with warmth, prose, and illustrations that feel like a fairytale.",
    image: love, // 👉 replace with: img2
    category: "Love & Family",
    likes: "2.4k",
    views: "10k",
  },
  {
    id: 3,
    title: "Heartfelt Apologies",
    description: "Sometimes the right words heal everything. Let your sincerity shine through a heartfelt story.",
    image: apology,
    category: "Love & Family",
    likes: "2.4k",
    views: "10k",
  },
  {
    id: 4,
    title: "Wedding Memories",
    description: "Relive the magic of your wedding day with elegant layouts, golden accents, and cherished photos.",
    image: wedding,
    category: "Milestones",
    likes: "2.4k",
    views: "10k",
  },
  {
    id: 5,
    title: "Long Distance Relations",
    description: "Miles apart, hearts connected. Tell the story of love across continents and time zones.",
    image: longdistance,
    category: "Love & Family",
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
    category: "Love & Family",
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
    category: "Celebrations",
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

const TemplateSection = () => {
  const [activeFilter, setActiveFilter] = useState("All Templates");
  const [searchQuery] = useState("");

  // ✅ Filter templates by category
  const filteredTemplates = templatesData.filter((template) => {
    const matchesFilter = activeFilter === "All Templates" || template.category === activeFilter;
    const matchesSearch = template.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <section className="w-full py-10 px-6 md:px-12 xl:px-20 bg-light-bg dark:bg-dark-bg">
      <div className="max-w-7xl mx-auto">

        {/* ── FILTER TABS ── */}
        <div className="flex items-center gap-2 flex-wrap mb-10">
          {filterTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveFilter(tab)}
              className={`px-4 py-2 rounded-full font-body text-sm font-medium transition-all duration-200
                ${activeFilter === tab
                  ? "bg-light-primary dark:bg-dark-primary text-light-on-primary shadow-sm"
                  : "bg-light-on-primary dark:bg-dark-primary-10 border border-light-outline-secondary dark:border-dark-primary-30 text-light-text dark:text-dark-text hover:border-light-primary dark:hover:border-dark-primary hover:text-light-primary dark:hover:text-dark-primary"
                }
              `}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* ── SECTION HEADING ── */}
        <div className="mb-6">
          <h2 className="font-display text-2xl font-bold text-light-text dark:text-dark-text">
            Featured Templates
          </h2>
          <p className="font-body text-xs text-light-outline dark:text-dark-text opacity-50 mt-1">
            Crafted by our community — ready for your story
          </p>
        </div>

        {/* ── TEMPLATE CARDS GRID ── */}
        {filteredTemplates.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredTemplates.map((template) => (
              <TemplateCard
                key={template.id}
                image={template.image}
                title={template.title}
                description={template.description}
                likes={template.likes}
                views={template.views}
                onUseTemplate={() => console.log("Using template:", template.title)}
                onLike={() => console.log("Liked:", template.title)}
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

export default TemplateSection;

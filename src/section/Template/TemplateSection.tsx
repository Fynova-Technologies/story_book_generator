import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { resetWizard, setTemplate } from "../../store/slices/storyWizardSlice";
import TemplateCard from "../../components/TempleteCard/TemplateCard";

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

// `inDashboard`: the dashboard's Templates screen (Figma 1172:3574) has only a search pill above the
// grid; the public page gets its search from the hero and shows category tabs and a heading.
const TemplateSection = ({ searchQuery, inDashboard = false }: { searchQuery?: string; inDashboard?: boolean }) => {
  const [activeFilter, setActiveFilter] = useState("All Templates");
  const [ownQuery, setOwnQuery] = useState("");
  searchQuery ??= ownQuery;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const startWithTemplate = (title: string) => {
    dispatch(resetWizard());
    dispatch(setTemplate(title));
    navigate("/create-story");
  };

  // ✅ Filter templates by category
  const query = searchQuery.trim().toLowerCase();
  const filteredTemplates = templatesData.filter((template) => {
    const matchesFilter = activeFilter === "All Templates" || template.category === activeFilter;
    const matchesSearch = template.title.toLowerCase().includes(query);
    return matchesFilter && matchesSearch;
  });

  return (
    <section className={inDashboard ? "w-full px-4 sm:px-7 py-6 sm:py-7" : "w-full pt-8 pb-14 md:pb-20 px-4 sm:px-10 lg:px-20"}>
      <div className="max-w-7xl mx-auto">

        {inDashboard && (
          <label className="flex items-center gap-3 w-full sm:max-w-[507px] h-11 px-4 mb-8 rounded-full bg-white focus-within:ring-2 focus-within:ring-light-primary/40">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="shrink-0 text-light-outline" aria-hidden>
              <circle cx="11" cy="11" r="7" /><path d="M20 20l-4-4" />
            </svg>
            <input
              type="search"
              placeholder="Search by template"
              aria-label="Search templates"
              value={ownQuery}
              onChange={(e) => setOwnQuery(e.target.value)}
              className="w-full bg-transparent outline-none font-body text-sm text-light-text placeholder:text-light-outline"
            />
          </label>
        )}

        {/* ── FILTER TABS ── */}
        {!inDashboard && <>
        <div className="flex items-center gap-2.5 flex-wrap mb-8">
          {filterTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveFilter(tab)}
              className={`px-[18px] py-1.5 rounded-full border font-body text-[13px] font-bold transition-all duration-200
                ${activeFilter === tab
                  ? "bg-dark-primary border-dark-primary text-white"
                  : "bg-white border-[#DDDDDD] text-[#555555] hover:border-light-primary hover:text-light-primary"
                }
              `}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* ── SECTION HEADING ── */}
        <div className="mb-6">
          <h2 className="font-heading text-2xl md:text-[32px] md:leading-[38px] font-bold text-light-text">
            Featured Templates
          </h2>
          <p className="font-body text-base text-light-text mt-2">
            Crafted by our community — ready for your story.
          </p>
        </div>
        </>}

        {/* ── TEMPLATE CARDS GRID ── */}
        {filteredTemplates.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 xl:gap-7">
            {filteredTemplates.map((template) => (
              <TemplateCard
                key={template.id}
                image={template.image}
                title={template.title}
                description={template.description}
                likes={template.likes}
                views={template.views}
                onUseTemplate={() => startWithTemplate(template.title)}
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
              No templates found{query ? ` for "${searchQuery.trim()}"` : ""} in "{activeFilter}"
            </p>
            <button
              onClick={() => setActiveFilter("All Templates")}
              className="font-body text-sm font-medium text-light-primary hover:underline underline-offset-2"
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

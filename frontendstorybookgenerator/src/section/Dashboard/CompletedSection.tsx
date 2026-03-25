import {useState} from 'react'
import StoryCard from '../../components/StoryCard/StoryCard';
import storyimg1 from "../../assets/images/storyimg1.png"
import completed from "../../assets/icons/Dashboard/Completed.png"
import avatar from "../../assets/images/sampleavatar.png"

type FilterTab = "All" | "Favorites" | "Shared";

const FILTER_TABS: FilterTab[] = ["All", "Favorites", "Shared"];
const storiesData = [
  {
    id: 1,
    image: storyimg1,
    title: "A divine place in cosmos",
    description:
      "A scientist's unwavering faith leads him on an extraordinary voyage through the cosmos, wher...",
    author: "Anonymouse",
  },
  {
    id: 2,
    image: storyimg1,
    title: "A divine place in cosmos",
    description:
      "A scientist's unwavering faith leads him on an extraordinary voyage through the cosmos, wher...",
    author: "Anonymouse",
  },
  {
    id: 3,
    image: storyimg1,
    title: "A divine place in cosmos",
    description:
      "A scientist's unwavering faith leads him on an extraordinary voyage through the cosmos, wher...",
    author: "Anonymouse",
  },
]

function CompletedSection() {
    const [activeTab, setActiveTab] = useState<FilterTab>("All");
  return (
     <section className="pb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <img src={completed} alt="completed" className="w-4 h-4" />
              <h2 className="font-display text-base font-bold text-light-text dark:text-dark-text">
                Completed Stories
              </h2>
            </div>

            {/* Filter tabs */}
            <div className="flex items-center gap-1 bg-dark-text dark:bg-dark-primary-10 border-light-outline-secondary
             dark:border-dark-primary-30 rounded-2xl p-1">
              {FILTER_TABS.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`font-body text-xs font-medium px-3 py-1 rounded-2xl transition-all
                    ${activeTab === tab
                      ? "bg-light-on-primary dark:bg-dark-bg text-light-primary dark:text-dark-text shadow-sm"
                      : "text-light-outline dark:text-dark-text hover:text-light-text dark:hover:text-dark-primary"
                    }
                  `}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* ✅ Same width as draft cards using same grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4">
            {storiesData.map((story) => (
              <StoryCard
                key={story.id}
                image={story.image}
                title={story.title}
                description={story.description}
                author={story.author}
                authorAvatar={avatar}
              />
            ))}
          </div>

        </section>

  )
}

export default CompletedSection

import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import StoryCard from '../../components/StoryCard/StoryCard';
import { coverUrls, listStories, StoryRow, StoryStatus } from '../../services/storyService';
const storyimg1 = "/assets/images/storyimg1.png";
const completed = "/assets/icons/Dashboard/Completed.png";
const avatar = "/assets/images/sampleavatar.png";

type FilterTab = "All" | "Favorites" | "Shared";

const FILTER_TABS: FilterTab[] = ["All", "Favorites", "Shared"];

// Every book past the draft stage, so in-progress and failed ones can be opened too.
const BOOK_STATUSES: StoryStatus[] = ['generating', 'incomplete', 'completed', 'failed'];
const STATUS_LABEL: Partial<Record<StoryStatus, string>> = {
  generating: 'Being created...',
  incomplete: 'Some pages need a retry',
  failed:     "Couldn't be finished",
};

function CompletedSection() {
    const [activeTab, setActiveTab] = useState<FilterTab>("All");
    const [stories, setStories] = useState<StoryRow[]>([]);
    const [covers, setCovers] = useState(new Map<string, string>());
    const navigate = useNavigate();

    useEffect(() => {
      listStories(BOOK_STATUSES)
        .then(async rows => { setStories(rows); setCovers(await coverUrls(rows.map(row => row.id))); })
        .catch(error => console.error('Could not load stories:', error));
    }, []);
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
            {stories.map((story) => (
              <StoryCard
                key={story.id}
                image={covers.get(story.id) || storyimg1}
                title={story.title || 'Untitled story'}
                description={STATUS_LABEL[story.status] || story.subtitle || ''}
                author="You"
                authorAvatar={avatar}
                onViewStory={() => navigate(`/flipbook/${story.id}`)}
              />
            ))}
          </div>

        </section>

  )
}

export default CompletedSection

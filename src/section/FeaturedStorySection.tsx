import FeaturedStoryCard from "../components/FeaturedStoryCard/FeaturedStoryCard";

// 👉 Import your story images here
const story1 = "/assets/images/storyimg1.png";
import { useNavigate } from "react-router";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";



const storiesData = [
  {
    id: 1,
    title: "A divine place in cosmos",
    description: "A scientist's unwavering faith leads him on an extraordinary voyage through the cosmos, wher...",
    author: "Jaydon Botosh",
    authorAvatar: null,
    image: story1, // 👉 replace with: story1
    likes: "2.4k",
    views: "10k",
  },
  {
    id: 2,
    title: "A divine place in cosmos",
    description: "A scientist's unwavering faith leads him on an extraordinary voyage through the cosmos, wher...",
    author: "Jaydon Botosh",
    authorAvatar: null,
    image: story1, // 👉 replace with: story2
    likes: "2.4k",
    views: "10k",
  },
  {
    id: 3,
    title: "A divine place in cosmos",
    description: "A scientist's unwavering faith leads him on an extraordinary voyage through the cosmos, wher...",
    author: "Jaydon Botosh",
    authorAvatar: null,
    image: story1, // 👉 replace with: story3
    likes: "2.4k",
    views: "10k",
  },
  {
    id: 4,
    title: "A divine place in cosmos",
    description: "A scientist's unwavering faith leads him on an extraordinary voyage through the cosmos, wher...",
    author: "Jaydon Botosh",
    authorAvatar: null,
    image: story1,
    likes: "2.4k",
    views: "10k",
  },
  {
    id: 5,
    title: "A divine place in cosmos",
    description: "A scientist's unwavering faith leads him on an extraordinary voyage through the cosmos, wher...",
    author: "Jaydon Botosh",
    authorAvatar: null,
    image: story1,
    likes: "2.4k",
    views: "10k",
  },
  {
    id: 6,
    title: "A divine place in cosmos",
    description: "A scientist's unwavering faith leads him on an extraordinary voyage through the cosmos, wher...",
    author: "Jaydon Botosh",
    authorAvatar: null,
    image: story1,
    likes: "2.4k",
    views: "10k",
  },
  {
    id: 7,
    title: "A divine place in cosmos",
    description: "A scientist's unwavering faith leads him on an extraordinary voyage through the cosmos, wher...",
    author: "Jaydon Botosh",
    authorAvatar: null,
    image: story1,
    likes: "2.4k",
    views: "10k",
  },
  {
    id: 8,
    title: "A divine place in cosmos",
    description: "A scientist's unwavering faith leads him on an extraordinary voyage through the cosmos, wher...",
    author: "Jaydon Botosh",
    authorAvatar: null,
    image: story1,
    likes: "2.4k",
    views: "10k",
  },
];

const FeaturedStoriesSection = ({ searchQuery = "" }: { searchQuery?: string }) => {
  const navigate = useNavigate();
  const loggedIn = useSelector((state: RootState) => state.auth.status);
  // ponytail: these are static samples with no real book behind them, so "Read" sends people to make their own.
  const readStory = () => navigate(loggedIn ? "/create-story" : "/signup");
  const query = searchQuery.trim().toLowerCase();
  const stories = storiesData.filter((story) => story.title.toLowerCase().includes(query));
  return (
    <section
      data-bg="light"
      className="w-full pt-8 pb-14 md:pb-20 px-4 sm:px-10 lg:px-20"
    >
      <div className="max-w-7xl mx-auto">

        {/* ── HEADER ROW ── */}
        <div className="flex items-center justify-between gap-4 mb-3">

          {/* Left — Title + Subtitle */}
          <div>
            <h2 className="font-heading text-3xl sm:text-4xl md:text-[50px] font-bold text-light-text leading-tight md:leading-[60px]">
              Featured Stories
            </h2>
            <p className="font-body text-base text-light-text mt-3">
              Dive into the most popular stories created by our community.
            </p>
          </div>

          {/* Right — Create your own button */}
          <button
            onClick={() => navigate("/create-story")}
            className="hidden md:flex items-center gap-3 px-10 py-3.5 rounded-full bg-light-primary text-light-on-primary font-body font-semibold text-base md:text-[17px] hover:opacity-90 active:scale-[0.99] transition-all duration-200 flex-shrink-0"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9z"/><path d="M19 15l.9 2.1L22 18l-2.1.9L19 21l-.9-2.1L16 18l2.1-.9z"/>
            </svg>
            Create your own
          </button>

        </div>

        {/* ── STORY CARDS GRID ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 xl:gap-7 mt-8">
          {stories.map((story) => (
            <FeaturedStoryCard
              key={story.id}
              image={story.image}
              title={story.title}
              description={story.description}
              author={story.author}
              authorAvatar={story.authorAvatar}
              likes={story.likes}
              views={story.views}
              onReadStory={readStory}
            />
          ))}
        </div>

        {stories.length === 0 && (
          <p className="font-body text-sm text-light-outline opacity-60 text-center py-12">
            No stories found for "{searchQuery.trim()}"
          </p>
        )}

        {/* ── Create your own (Mobile) ── */}
        <div className="flex justify-center mt-8 md:hidden">
          <button onClick={() => navigate("/create-story")} className="flex items-center gap-3 px-8 py-3 rounded-full bg-light-primary text-light-on-primary font-body font-semibold text-base hover:opacity-90 transition-all duration-200">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9z"/><path d="M19 15l.9 2.1L22 18l-2.1.9L19 21l-.9-2.1L16 18l2.1-.9z"/>
            </svg>
            Create your own
          </button>
        </div>

      </div>
    </section>
  );
};

export default FeaturedStoriesSection;

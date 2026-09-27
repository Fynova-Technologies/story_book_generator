import FeaturedStoryCard from "../components/FeaturedStoryCard/FeaturedStoryCard";

// 👉 Import your story images here
import story1 from "../assets/images/storyimg1.png"
import { useNavigate } from "react-router";



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

const FeaturedStoriesSection = () => {
  const navigate = useNavigate();
  return (
    <section
      data-bg="light"
      className="w-full py-12 px-6 md:px-12 xl:px-20 bg-light-bg dark:bg-dark-bg"
    >
      <div className="max-w-7xl mx-auto">

        {/* ── HEADER ROW ── */}
        <div className="flex items-start justify-between mb-3">

          {/* Left — Title + Subtitle */}
          <div>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-light-text dark:text-dark-text leading-tight">
              Featured Stories
            </h2>
            <p className="font-body text-sm text-light-outline dark:text-dark-text opacity-60 mt-2">
              Dive into the most popular stories created by our community.
            </p>
          </div>

          {/* Right — Create your own button */}
          <button
            onClick={() => navigate("/login")}
            className="hidden md:flex items-center gap-2 px-5 py-2.5 rounded-full bg-light-primary dark:bg-dark-primary text-light-on-primary font-body font-semibold text-sm hover:opacity-90 active:scale-[0.99] transition-all duration-200 flex-shrink-0"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
            </svg>
            Create your own
          </button>

        </div>

        {/* ── STORY CARDS GRID ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 mt-8">
          {storiesData.map((story) => (
            <FeaturedStoryCard
              key={story.id}
              image={story.image}
              title={story.title}
              description={story.description}
              author={story.author}
              authorAvatar={story.authorAvatar}
              likes={story.likes}
              views={story.views}
              onReadStory={() => console.log("Read story:", story.id)}
              onLike={() => console.log("Liked story:", story.id)}
            />
          ))}
        </div>

        {/* ── Create your own (Mobile) ── */}
        <div className="flex justify-center mt-8 md:hidden">
          <button className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-light-primary dark:bg-dark-primary text-light-on-primary font-body font-semibold text-sm hover:opacity-90 transition-all duration-200">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
            </svg>
            Create your own
          </button>
        </div>

      </div>
    </section>
  );
};

export default FeaturedStoriesSection;

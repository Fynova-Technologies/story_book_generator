import { useState } from "react";
import StoryCard from "../components/StoryCard/StoryCard";
import Story1 from "../assets/images/storyimg1.png";
import Story2 from "../assets/images/storyimg2.png";
import Story3 from "../assets/images/storyimg3.png";
import Story4 from "../assets/images/storyimg4.png";
import { useNavigate } from "react-router-dom";

const storiesData = [
  {
    id: 1,
    image: Story1,
    title: "A divine place in cosmos",
    description:
      "A scientist's unwavering faith leads him on an extraordinary voyage through the cosmos, wher...",
    author: "Anonymouse",
  },
  {
    id: 2,
    image: Story2,
    title: "A divine place in cosmos",
    description:
      "A scientist's unwavering faith leads him on an extraordinary voyage through the cosmos, wher...",
    author: "Anonymouse",
  },
  {
    id: 3,
    image: Story3,
    title: "A divine place in cosmos",
    description:
      "A scientist's unwavering faith leads him on an extraordinary voyage through the cosmos, wher...",
    author: "Anonymouse",
  },
  {
    id: 4,
    image: Story4,
    title: "A divine place in cosmos",
    description:
      "A scientist's unwavering faith leads him on an extraordinary voyage through the cosmos, wher...",
    author: "Anonymouse",
  },
];

const FeatureSection = () => {
  const navigate = useNavigate();
  const [likedCards, setLikedCards] = useState<number[]>([]);

  const handleLike = (id: number) => {
    setLikedCards((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  return (
    <section
      data-bg="light"
      className="w-full py-14 px-6 md:px-12 lg:px-16 xl:px-20 bg-light-bg dark:bg-dark-bg"
    >
      <div className="max-w-7xl mx-auto">

        {/* ── TOP BADGE ── */}
        <div className="mb-4">
          <span className="font-body px-5 py-2 rounded-full text-sm font-medium text-light-text dark:text-dark-text bg-light-on-primary dark:bg-dark-primary-10">
            Samples
          </span>
        </div>

        {/* ── HEADING ROW ── */}
        <div className="flex items-start justify-between mb-3">

          {/* Left — Title + Subtitle */}
          <div>
            <h2 className="font-heading text-4xl md:text-5xl font-bold text-light-text dark:text-dark-text leading-tight mb-3">
              Featured Stories
            </h2>
            <p className="font-body text-sm text-light-outline dark:text-dark-text">
              Dive into the most popular stories created by our community.
            </p>
          </div>

          {/* Right — View All Button */}
          <button 
          onClick={()=>navigate("/stories")}
          className="hidden md:flex items-center gap-2 px-6 py-3 rounded-full border border-light-primary dark:border-dark-primary text-light-primary dark:text-dark-primary font-body font-medium text-sm hover:bg-light-primary hover:text-light-on-primary dark:hover:bg-dark-primary dark:hover:text-dark-text transition-all duration-200 whitespace-nowrap">
            View All Stories
          </button>

        </div>

        {/* ── STORY CARDS GRID ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-8">
          {storiesData.map((story) => (
            <StoryCard
              key={story.id}
              image={story.image}
              title={story.title}
              description={story.description}
              author={story.author}
              isLiked={likedCards.includes(story.id)}
              onLike={() => handleLike(story.id)}
              onViewStory={() => console.log(`View story ${story.id}`)}
            />
          ))}
        </div>

        {/* ── View All Button (Mobile) ── */}
        <div className="flex justify-center mt-8 md:hidden">
          <button className="flex items-center gap-2 px-6 py-3 rounded-full border border-light-primary dark:border-dark-primary text-light-primary dark:text-dark-primary font-body font-medium text-sm hover:bg-light-primary hover:text-light-on-primary transition-all duration-200">
            View All Stories
          </button>
        </div>

      </div>
    </section>
  );
};

export default FeatureSection;

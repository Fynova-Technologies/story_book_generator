import { useState } from "react";
import StoryCard from "../components/StoryCard/StoryCard";
import { useNavigate } from "react-router-dom";
import { sampleStories } from "../Data/sampleStories";

const FeatureSection = () => {
  const navigate = useNavigate();
  const [likedCards, setLikedCards] = useState<string[]>([]);

  const handleLike = (id: string) => {
    setLikedCards((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  return (
    <section
      data-bg="light"
      className="w-full py-10 md:py-20 px-4 sm:px-10 lg:px-20"
    >
      <div className="max-w-7xl mx-auto">

        {/* ── TOP BADGE ── */}
        <div className="mb-4">
          <span className="inline-block font-body px-8 py-2 rounded-full text-base font-semibold text-black bg-white">
            Samples
          </span>
        </div>

        {/* ── HEADING ROW ── */}
        <div className="flex items-center justify-between gap-4 mb-3">

          {/* Left — Title + Subtitle */}
          <div>
            <h2 className="font-heading text-3xl sm:text-4xl md:text-[50px] font-bold text-light-text leading-tight md:leading-[60px] mb-3">
              Featured Stories
            </h2>
            <p className="font-body text-base text-light-text">
              Dive into the most popular stories created by our community.
            </p>
          </div>

          {/* Right — View All Button */}
          <button 
          onClick={()=>navigate("/stories")}
          className="hidden md:flex items-center gap-2 px-10 py-3.5 rounded-full border-[1.67px] border-light-primary text-light-primary font-body font-semibold text-base hover:bg-light-primary hover:text-light-on-primary transition-all duration-200 whitespace-nowrap">
            View All Stories
          </button>

        </div>

        {/* ── STORY CARDS GRID ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 xl:gap-7 mt-8">
          {sampleStories.map((story) => (
            <StoryCard
              key={story.slug}
              image={story.pages[0].imageUrl}
              title={story.title}
              description={story.subtitle}
              author="Storyboard"
              isLiked={likedCards.includes(story.slug)}
              onLike={() => handleLike(story.slug)}
              onViewStory={() => navigate(`/samples/${story.slug}`)}
            />
          ))}
        </div>

        {/* ── View All Button (Mobile) ── */}
        <div className="flex justify-center mt-8 md:hidden">
          <button onClick={() => navigate("/stories")} className="flex items-center gap-2 px-8 py-3 rounded-full border-[1.67px] border-light-primary text-light-primary font-body font-semibold text-base hover:bg-light-primary hover:text-light-on-primary transition-all duration-200">
            View All Stories
          </button>
        </div>

      </div>
    </section>
  );
};

export default FeatureSection;

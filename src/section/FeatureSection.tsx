import { useState } from "react";
import StoryCard from "../components/StoryCard/StoryCard";
const Story1 = "/assets/images/storyimg1.png";
const Story2 = "/assets/images/storyimg2.png";
const Story3 = "/assets/images/storyimg3.png";
const Story4 = "/assets/images/storyimg4.png";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";

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
  const loggedIn = useSelector((state: RootState) => state.auth.status);
  const [likedCards, setLikedCards] = useState<number[]>([]);

  const handleLike = (id: number) => {
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
          {storiesData.map((story) => (
            <StoryCard
              key={story.id}
              image={story.image}
              title={story.title}
              description={story.description}
              author={story.author}
              isLiked={likedCards.includes(story.id)}
              onLike={() => handleLike(story.id)}
              onViewStory={() => navigate(loggedIn ? "/create-story" : "/signup")}
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

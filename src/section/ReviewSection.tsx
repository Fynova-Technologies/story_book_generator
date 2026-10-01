import ReviewCard from "../components/ReviewCard/ReviewCard";
const sampleAvatar = "/assets/images/sampleavatar.png";

const reviewsData = [
  {
    id: 1,
    username: "Sarah Johnson",
    avatar: sampleAvatar, // 👉 replace with: Avatar1
    stars: 5,
    date: "Mar 12, 2025",
    message:
      "Absolutely magical experience! The AI created a storybook for my daughter that brought her to tears of joy. Every detail was perfect.",
  },
  {
    id: 2,
    username: "Mark Williams",
    avatar: sampleAvatar, // 👉 replace with: Avatar2
    stars: 4,
    date: "Feb 28, 2025",
    message:
      "Great platform for creating personalized stories. The illustrations were beautiful and my son loved every page of his adventure.",
  },
  {
    id: 3,
    username: "Emily Chen",
    avatar: sampleAvatar,
    stars: 5,
    date: "Jan 15, 2025",
    message:
      "I made a storybook for my grandparents anniversary. They were so moved. The quality of the printed copy was outstanding!",
  },
  {
    id: 4,
    username: "David Brown",
    avatar: sampleAvatar,
    stars: 4,
    date: "Dec 20, 2024",
    message:
      "Super easy to use and the results are stunning. Created 3 books already for my kids. Each one unique and special.",
  },
  {
    id: 5,
    username: "Lisa Anderson",
    avatar: sampleAvatar,
    stars: 5,
    date: "Nov 5, 2024",
    message:
      "The best gift I have ever given. My niece still reads her storybook every night. Worth every penny!",
  },
  {
    id: 6,
    username: "James Wilson",
    avatar: sampleAvatar,
    stars: 4,
    date: "Oct 18, 2024",
    message:
      "Incredible tool that makes storytelling accessible to everyone. The AI understands exactly what you want.",
  },
];

// ponytail: CSS-only marquee (duplicated list, translate -50%); swap for a carousel if the reviews need controls.
const marqueeKeyframes = `@keyframes review-marquee { from { transform: translateX(0) } to { transform: translateX(-50%) } }`;

const ReviewRow = ({ reverse = false }: { reverse?: boolean }) => (
  <div className="flex w-max gap-7 animate-[review-marquee_60s_linear_infinite] motion-reduce:animate-none hover:[animation-play-state:paused]"
    style={reverse ? { animationDirection: "reverse" } : undefined}
  >
    {[...reviewsData, ...reviewsData].map((review, i) => (
      <div key={i} className="w-[300px] sm:w-[393px] shrink-0" aria-hidden={i >= reviewsData.length}>
        <ReviewCard
          username={review.username}
          avatar={review.avatar}
          stars={review.stars}
          date={review.date}
          message={review.message}
        />
      </div>
    ))}
  </div>
);

const ReviewsSection = () => {
  return (
    <section
      data-bg="light"
      className="max-w-7xl mx-auto py-8 md:py-10 bg-light-panel rounded-[36px] overflow-hidden"
    >
      <style>{marqueeKeyframes}</style>
      <div className="px-5 md:px-10">

        {/* ── TOP BADGE ── */}
        <div className="flex justify-center mb-4">
          <span className="px-8 py-2 rounded-full text-base font-body font-semibold text-black bg-white">
            Reviews
          </span>
        </div>

        {/* ── HEADING ── */}
        <div className="text-center mb-4">
          <h2 className="font-heading text-3xl sm:text-4xl md:text-[50px] font-bold text-light-text leading-tight md:leading-[60px] mb-3">
            Real Stories
          </h2>
          <p className="font-body text-base md:text-[17px] text-light-text max-w-md mx-auto">
            Hear from people who've created something meaningful
          </p>
        </div>

        {/* ── OVERALL RATING (kept per D8) ── */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <svg
                key={star}
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="text-light-accent"
              >
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
              </svg>
            ))}
          </div>
          <span className="font-heading font-bold text-2xl text-light-text">
            4.9
          </span>
          <span className="font-body text-sm text-light-outline">
            from 2,400+ reviews
          </span>
        </div>
      </div>

      {/* ── REVIEW CARDS — two offset rows scrolling in opposite directions ── */}
      <div className="relative flex flex-col gap-7 overflow-hidden">
        <ReviewRow />
        <div className="-ml-[200px]">
          <ReviewRow reverse />
        </div>
        <div className="pointer-events-none absolute inset-y-0 left-0 w-8 md:w-16 bg-white/5 backdrop-blur-[4px]" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-8 md:w-16 bg-white/5 backdrop-blur-[4px]" />
      </div>
    </section>
  );
};

export default ReviewsSection;

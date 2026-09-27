import ReviewCard from "../components/ReviewCard/ReviewCard";
import sampleAvatar from "../assets/images/sampleavatar.png"

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
    stars: 2,
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

const ReviewsSection = () => {
  return (
    <section
      data-bg="light"
      className="w-full py-14 px-6 md:px-12 xl:px-20 bg-dark-primary-10 dark:bg-dark-bg rounded-3xl"
    >
      <div className="max-w-7xl mx-auto">

        {/* ── TOP BADGE ── */}
        <div className="flex justify-center mb-4">
          <span className="px-5 py-2 rounded-full border-light-outline-secondary dark:border-dark-primary-30 text-sm 
          font-body font-medium text-light-text dark:text-dark-text bg-light-on-primary dark:bg-dark-primary-10">
            Reviews
          </span>
        </div>

        {/* ── HEADING ── */}
        <div className="text-center mb-4">
          <h2 className="font-heading text-4xl md:text-5xl font-bold text-light-text dark:text-dark-text leading-tight mb-3">
            Real Stories
          </h2>
          <p className="font-body text-sm text-light-outline dark:text-dark-text max-w-md mx-auto">
            Hear from people who've created something meaningful.
          </p>
        </div>

        {/* ── OVERALL RATING ── */}
        <div className="flex items-center justify-center gap-3 mb-10">
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <svg
                key={star}
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="text-light-accent dark:text-dark-accent"
              >
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
              </svg>
            ))}
          </div>
          <span className="font-display font-bold text-2xl text-light-text dark:text-dark-text">
            4.9
          </span>
          <span className="font-body text-sm text-light-outline dark:text-dark-text">
            from 2,400+ reviews
          </span>
        </div>

        {/* ── REVIEW CARDS GRID ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {reviewsData.map((review) => (
            <ReviewCard
              key={review.id}
              username={review.username}
              avatar={review.avatar}
              stars={review.stars}
              date={review.date}
              message={review.message}
            />
          ))}
        </div>

      </div>
    </section>
  );
};

export default ReviewsSection;

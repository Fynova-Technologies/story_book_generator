const ReviewCard = ({
  username,
  avatar,
  message,
  stars,
  date,
}: any) => {

  return (
    <div className="flex flex-col gap-4 bg-light-on-primary dark:bg-dark-bg rounded-2xl p-5 shadow-md hover:shadow-xl transition-all duration-300
     border-light-outline-secondary dark:border-dark-primary-30">

      {/* ── STARS ── */}
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill={star <= stars ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth="2"
            className={star <= stars
              ? "text-light-accent dark:text-dark-accent"
              : "text-light-outline-secondary dark:text-dark-primary-30"
            }
          >
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
          </svg>
        ))}
      </div>

      {/* ── MESSAGE ── */}
      <p className="font-body text-sm text-light-outline dark:text-dark-text leading-relaxed flex-1">
        "{message}"
      </p>

      {/* ── AUTHOR ── */}
      <div className="flex items-center justify-between pt-3  border-light-outline-secondary dark:border-dark-primary-30">

        {/* Avatar + Name */}
        <div className="flex items-center gap-3">

          {/* Avatar */}
          <div className="w-9 h-9 rounded-full overflow-hidden bg-dark-primary-10 border border-dark-primary-30 flex items-center justify-center flex-shrink-0">
            {avatar ? (
              <img
                src={avatar}
                alt={username}
                className="w-full h-full object-cover"
              />
            ) : (
              // Default avatar placeholder
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-light-primary dark:text-dark-primary">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
            )}
          </div>

          {/* Name */}
          <span className="font-body font-semibold text-sm text-light-text dark:text-dark-text">
            {username}
          </span>

        </div>

        {/* Date */}
        {date && (
          <span className="font-body text-xs text-light-outline-secondary dark:text-dark-text opacity-60">
            {date}
          </span>
        )}

      </div>
    </div>
  );
};

export default ReviewCard;

const ReviewCard = ({
  username,
  avatar,
  message,
  stars,
  date,
}: {
  username: string;
  avatar?: string;
  message: string;
  stars: number;
  date?: string;
}) => {

  return (
    <div className="flex flex-col gap-5 h-full bg-white rounded-[13px] p-6 md:p-7 border border-[#050B0A]/15">

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
              ? "text-light-accent"
              : "text-light-outline-secondary"
            }
          >
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
          </svg>
        ))}
      </div>

      {/* ── MESSAGE ── */}
      <p className="font-body text-base md:text-[17px] leading-7 text-[#0F172A] flex-1">
        "{message}"
      </p>

      {/* ── AUTHOR ── */}
      <div className="flex items-center gap-3">

          {/* Avatar */}
          <div className="w-10 h-10 rounded-full overflow-hidden bg-dark-primary-10 flex items-center justify-center flex-shrink-0">
            {avatar ? (
              <img
                src={avatar}
                alt={username}
                className="w-full h-full object-cover"
              />
            ) : (
              // Default avatar placeholder
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-light-primary">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
            )}
          </div>

          {/* Name + date */}
          <div className="flex flex-col">
            <span className="font-body font-semibold text-[15px] leading-6 text-[#0F172A]">
              {username}
            </span>
            {date && (
              <span className="font-body text-[13px] leading-5 text-[#0F172A]">
                {date}
              </span>
            )}
          </div>

      </div>
    </div>
  );
};

export default ReviewCard;

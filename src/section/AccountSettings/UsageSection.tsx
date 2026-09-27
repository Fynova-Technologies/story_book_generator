const UsageSection = () => {
  const storiesUsed = 1;
  const storiesTotal = 2;
  const progressPercent = (storiesUsed / storiesTotal) * 100;

  return (
    <div className="bg-light-on-primary dark:bg-dark-bg rounded-3xl p-6  border-light-outline-secondary dark:border-dark-primary-30">

      {/* Header */}
      <div className="mb-5">
        <h3 className="font-heading font-bold text-lg text-light-text dark:text-dark-text">
          Usage Details
        </h3>
        <p className="font-body text-xs text-light-text dark:text-dark-text opacity-80 mt-3">
          Track your tokens and monthly consumptions
        </p>
        <p className="font-body text-xs text-light-text dark:text-dark-text opacity-80 mt-2">
          Billing period: Dec 27, 2025 - Jan 26, 2026
        </p>
      </div>

      <div className="space-y-4 mt-6">

        {/* Stories Created */}
        <div className="p-4 rounded-xl  border-light-outline-secondary dark:border-dark-primary-30 bg-light-bg dark:bg-dark-primary-10">

          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              {/* Icon */}
              <div className="w-9 h-9 rounded-full bg-dark-primary-10 border border-dark-primary-30 flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-light-primary dark:text-dark-primary">
                  <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
                  <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
                </svg>
              </div>
              <div>
                <p className="font-body text-sm font-semibold text-light-text dark:text-dark-text">
                  Stories Created
                </p>
                <p className="font-body text-xs text-light-outline dark:text-dark-text opacity-60">
                  {storiesUsed} of {storiesTotal} used
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-display font-bold text-lg text-light-text dark:text-dark-text">
                {storiesTotal - storiesUsed}
              </p>
              <p className="font-body text-xs text-light-outline dark:text-dark-text opacity-90">
                Remaining
              </p>
            </div>
          </div>

          {/* Progress bar */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-body text-xs text-light-outline dark:text-dark-text opacity-60">
                Progress
              </span>
              <span className="font-body text-xs font-semibold text-light-text dark:text-dark-text">
                {progressPercent}%
              </span>
            </div>
            <div className="h-2 rounded-full bg-light-outline-secondary/20 dark:bg-dark-primary-30 overflow-hidden">
              <div
                className="h-full rounded-full bg-light-primary dark:bg-dark-primary transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <p className="font-body text-xs text-light-outline dark:text-dark-text opacity-80 mt-1">
              You are close to your monthly limit. Consider upgrading for more stories.
            </p>
          </div>

        </div>

        {/* Usage Reset */}
        <div className="p-4 rounded-xl  border-light-outline-secondary dark:border-dark-primary-30 bg-light-bg dark:bg-dark-primary-10 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-dark-primary-10 border border-dark-primary-30 flex items-center justify-center flex-shrink-0">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-light-primary dark:text-dark-primary">
              <path d="M23 4v6h-6"/>
              <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
            </svg>
          </div>
          <div>
            <p className="font-body text-sm font-semibold text-light-text dark:text-dark-text">
              Usage Reset
            </p>
            <p className="font-body text-xs text-light-outline dark:text-dark-text opacity-60">
              Your usage will reset on Feb 26, 2026
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default UsageSection;

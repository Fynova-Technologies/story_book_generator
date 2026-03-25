import { useState } from "react";
import CTABgImage from "../assets/images/CTAbg.png"
import DraftCard from "../components/DraftCard/DraftCard";
import StoryCard from "../components/StoryCard/StoryCard";
import avatar from "../assets/images/sampleavatar.png"
import storyimg1 from "../assets/images/storyimg1.png"
import draft from "../assets/icons/Dashboard/Draft.png"
import completed from "../assets/icons/Dashboard/Completed.png"



type FilterTab = "All" | "Favorites" | "Shared";

const FILTER_TABS: FilterTab[] = ["All", "Favorites", "Shared"];

const drafts= [
  {
    id: 1,
    image: storyimg1,
    title: "A divine place in cosmos",
    editedAt: "2 hours ago",
  },
];
const storiesData = [
  {
    id: 1,
    image: storyimg1,
    title: "A divine place in cosmos",
    description:
      "A scientist's unwavering faith leads him on an extraordinary voyage through the cosmos, wher...",
    author: "Anonymouse",
  },
  {
    id: 2,
    image: storyimg1,
    title: "A divine place in cosmos",
    description:
      "A scientist's unwavering faith leads him on an extraordinary voyage through the cosmos, wher...",
    author: "Anonymouse",
  },
  {
    id: 3,
    image: storyimg1,
    title: "A divine place in cosmos",
    description:
      "A scientist's unwavering faith leads him on an extraordinary voyage through the cosmos, wher...",
    author: "Anonymouse",
  },
]


const Dashboard = () => {
    const [activeTab, setActiveTab] = useState<FilterTab>("All");
  return (
   <div className=" min-h-screen bg-light-bg dark:bg-dark-bg overflow-y-auto">
      <div className="w-full px-6 md:px-8 py-8 space-y-8">

        {/*  Hero Banner */}
         <div className="relative rounded-2xl overflow-hidden p-6 md:p-8"
          style={{
            background: "linear-gradient(135deg, #3D52C4, #4F6AF5, #6366F1)",
          }}
        >
          {/* Background image */}
          <img
            src={CTABgImage}
            alt="CTA background"
            className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-40"
          />

          <div className="relative flex flex-col lg:flex-row items-start justify-between gap-6">

            {/* Left — Text */}
            <div className="flex-1">
              {/* Badge */}
              <div className="inline-flex items-center gap-1.5 bg-white/15 border border-white/20 rounded-full px-3 py-1 mb-4">
                <span className="text-white text-[11px] font-semibold uppercase tracking-wider">
                  ✦ Weekly Inspiration
                </span>
              </div>

              <h1 className="font-heading text-white text-2xl md:text-3xl font-bold leading-tight mb-2">
                Ready to weave a new tale, Sarah?
              </h1>
              <p className="font-body text-white/75 text-sm">
                You have{" "}
                <span className="text-white font-semibold underline underline-offset-2">
                  3 free stories
                </span>{" "}
                left this month. Let's make some magic!
              </p>
            </div>

            {/* Right — Usage Card */}
            <div className="w-full lg:w-[320px] flex-shrink-0 bg-dark-bg/50 backdrop-blur-sm border border-white/10 rounded-xl p-4 space-y-3">

              {/* Plan label */}
              <div className="flex items-center justify-between">
                <span className="font-body text-white/60 text-[11px] uppercase tracking-widest font-medium">
                  Free Plan Usage
                </span>
                <span className="bg-white/10 border border-white/20 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full">
                  FREE
                </span>
              </div>

              {/* Progress bar */}
              <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: "40%",
                    background: "linear-gradient(to right, #FCD34D, #F59E0B)",
                  }}
                />
              </div>

              {/* Credits */}
              <div className="flex items-center justify-between">
                <span className="font-body text-white/50 text-[11px] uppercase tracking-widest">
                  Monthly Credits
                </span>
                <span className="font-body text-white/70 text-[11px] font-medium">
                  2/5 Used
                </span>
              </div>

              {/* CTA Button */}
              <button className="w-full flex items-center justify-center gap-2 bg-light-on-primary text-light-primary font-body text-sm font-semibold py-2.5 rounded-xl hover:opacity-90 active:scale-[0.98] transition-all">
                ✦ Create New Story
              </button>

            </div>
          </div>
        </div>

        {/*  Your Drafts  */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <img src={draft} alt="drafts" className="w-4 h-4" />
              <h2 className="font-display text-base font-bold text-light-text dark:text-dark-text">
                Your Drafts
              </h2>
            </div>
            <button className="font-body flex items-center gap-1 text-sm text-light-primary dark:text-dark-primary font-medium hover:underline underline-offset-2 transition-all">
              View all →
            </button>
          </div>

          {/* ✅ Same width cards using grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4">

            {/* Draft Cards */}
            {drafts.map((item) => (
              <DraftCard
                key={item.id}
                image={item.image}
                title={item.title}
                authorAvatar={avatar}
                editedAt={item.editedAt}
              />
            ))}

            {/* New Draft Card — same size as DraftCard */}
            <div className="rounded-xl border-2 border-dashed border-light-outline-secondary dark:border-dark-primary-30 bg-light-on-primary/50 dark:bg-dark-primary-10 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-light-primary dark:hover:border-dark-primary hover:bg-dark-primary-10 transition-all group aspect-[3/4]">
              <div className="w-10 h-10 rounded-full bg-dark-primary-10 flex items-center justify-center group-hover:bg-light-primary/20 transition-colors">
                <span className="text-light-primary dark:text-dark-primary text-2xl font-light leading-none">+</span>
              </div>
              <p className="font-body text-sm font-semibold text-light-primary dark:text-dark-primary">
                New Draft
              </p>
              <p className="font-body text-[11px] text-light-outline dark:text-dark-text text-center px-3 leading-snug">
                Start a fresh adventure from scratch
              </p>
            </div>

          </div>
        </section>

        {/*Completed Stories */}
         <section className="pb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <img src={completed} alt="completed" className="w-4 h-4" />
              <h2 className="font-display text-base font-bold text-light-text dark:text-dark-text">
                Completed Stories
              </h2>
            </div>

            {/* Filter tabs */}
            <div className="flex items-center gap-1 bg-dark-text dark:bg-dark-primary-10 border-light-outline-secondary
             dark:border-dark-primary-30 rounded-2xl p-1">
              {FILTER_TABS.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`font-body text-xs font-medium px-3 py-1 rounded-2xl transition-all
                    ${activeTab === tab
                      ? "bg-light-on-primary dark:bg-dark-bg text-light-primary dark:text-dark-text shadow-sm"
                      : "text-light-outline dark:text-dark-text hover:text-light-text dark:hover:text-dark-primary"
                    }
                  `}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* ✅ Same width as draft cards using same grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4">
            {storiesData.map((story) => (
              <StoryCard
                key={story.id}
                image={story.image}
                title={story.title}
                description={story.description}
                author={story.author}
                authorAvatar={avatar}
              />
            ))}
          </div>

        </section>


      </div>
    </div>
  );
};

export default Dashboard;

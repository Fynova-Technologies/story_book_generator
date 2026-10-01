const CTABgImage = "/assets/images/CTAbg.png";
import DraftSection from "../section/Dashboard/DraftSection";
import CompletedSection from "../section/Dashboard/CompletedSection";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store";
import { resetWizard } from "../store/slices/storyWizardSlice";
import { STORY_COST, useCredits } from "../services/credits";
import { userName } from "../components/Sidebar/user";

const Dashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.userData);
  const { credits } = useCredits();
  const storiesLeft = credits === null ? null : Math.floor(credits / STORY_COST);
  const name = userName(user);

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
                Ready to weave a new tale{name && `, ${name}`}?
              </h1>
              <p className="font-body text-white/75 text-sm">
                {storiesLeft === null ? "Checking your credits…" : storiesLeft > 0 ? (
                  <>
                    You have enough credits for{" "}
                    <span className="text-white font-semibold underline underline-offset-2">
                      {storiesLeft} {storiesLeft === 1 ? "story" : "stories"}
                    </span>
                    . Let's make some magic!
                  </>
                ) : "You're out of credits. Get more to create your next story."}
              </p>
            </div>

            {/* Right — Usage Card */}
            <div className="w-full lg:w-[320px] flex-shrink-0 bg-dark-bg/50 backdrop-blur-sm border border-white/10 rounded-xl p-4 space-y-3">

              {/* Credits */}
              <div className="flex items-center justify-between">
                <span className="font-body text-white/60 text-[11px] uppercase tracking-widest font-medium">
                  Credits
                </span>
                <span className="font-body text-white text-sm font-semibold">
                  {credits ?? "…"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-body text-white/50 text-[11px] uppercase tracking-widest">
                  {STORY_COST} credits per story
                </span>
                <span className="font-body text-white/70 text-[11px] font-medium">
                  {storiesLeft === null ? "…" : `≈ ${storiesLeft} ${storiesLeft === 1 ? "story" : "stories"}`}
                </span>
              </div>

              {/* CTA Button */}
              <button 
                onClick={() => { dispatch(resetWizard()); navigate("/create-story"); }}
                className="w-full flex items-center justify-center gap-2 bg-light-on-primary text-light-primary font-body text-sm font-semibold py-2.5 rounded-xl hover:opacity-90 active:scale-[0.98] transition-all">
                ✦ Create New Story
              </button>

            </div>
          </div>
        </div>

        {/*  Your Drafts  */}
        <DraftSection/>

        {/*Completed Stories */}
         <CompletedSection/>


      </div>
    </div>
  );
};

export default Dashboard;

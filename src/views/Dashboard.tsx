const CTABgImage = "/assets/images/CTAbg.png";
import DraftSection from "../section/Dashboard/DraftSection";
import CompletedSection from "../section/Dashboard/CompletedSection";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store";
import { resetWizard } from "../store/slices/storyWizardSlice";
import { BASE_COST, PAGE_COST, TYPICAL_STORY_COST, useCredits } from "../services/credits";
import { userName } from "../components/Sidebar/user";
import CreditsPopup from "../components/CreditsPopup/CreditsPopup";

const Dashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.userData);
  const { credits } = useCredits();
  const storiesLeft = credits === null ? null : Math.floor(credits / TYPICAL_STORY_COST);
  const name = userName(user);

  return (
    <div className="w-full px-4 sm:px-7 py-6 sm:py-7 space-y-8">
      <CreditsPopup credits={credits} />

      {/*  Hero Banner */}
      <div className="relative rounded-[20px] overflow-hidden shadow-lg px-6 py-6 sm:px-8 sm:py-6">
        <img src={CTABgImage} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#2060DF]/80 to-[#2060DF]/60" />

        <div className="relative flex flex-col xl:flex-row xl:items-center justify-between gap-6">

          {/* Left — Text */}
          <div className="flex-1 max-w-[554px]">
            <span className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur rounded-full px-3 py-1 mb-3">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="#FDE047" aria-hidden><path d="M12 2l3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1z"/></svg>
              <span className="font-body text-dark-text text-[10px] font-bold uppercase tracking-wide">Weekly Inspiration</span>
            </span>

            <h1 className="font-heading text-white text-3xl sm:text-[40px] font-bold leading-tight sm:leading-[46px] mb-3">
              Ready to weave a new tale{name && `, ${name}`}?
            </h1>
            <p className="font-body text-white/90 text-base sm:text-[17px] font-medium leading-snug">
              {storiesLeft === null ? "Checking your credits…" : storiesLeft > 0 ? (
                <>
                  You have enough credits for{" "}
                  <span className="font-bold underline underline-offset-2">
                    {storiesLeft} {storiesLeft === 1 ? "story" : "stories"}
                  </span>
                  . Let's make some magic!
                </>
              ) : "You're out of credits. Get more to create your next story."}
            </p>
          </div>

          {/* Right — Usage box + CTA */}
          <div className="w-full xl:w-[358px] flex-shrink-0 flex flex-col gap-4">
            <div className="bg-black/40 backdrop-blur border border-white/10 rounded-[20px] p-4 space-y-4 font-body">
              <div className="flex items-center justify-between gap-3">
                <span className="text-white text-xs font-bold uppercase">Credits</span>
                <span className="bg-white/10 rounded-lg px-2 py-1 text-white text-[10px] font-bold">
                  {BASE_COST} + {PAGE_COST}/page
                </span>
              </div>
              <p className="text-white text-2xl font-semibold leading-none">{credits ?? "…"}</p>
              <div className="flex items-center justify-between text-white/80 text-[10px] font-bold uppercase">
                <span>Enough for</span>
                <span>{storiesLeft === null ? "…" : `≈ ${storiesLeft} ${storiesLeft === 1 ? "story" : "stories"}`}</span>
              </div>
            </div>

            <button
              onClick={() => { dispatch(resetWizard()); navigate("/create-story"); }}
              className="w-full h-[43px] flex items-center justify-center gap-1.5 bg-white rounded-[20px] shadow-md font-body text-[13px] font-bold text-light-primary hover:opacity-90 active:scale-[0.98] transition-all">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M10 4l1.6 4.4L16 10l-4.4 1.6L10 16l-1.6-4.4L4 10l4.4-1.6z" />
                <path d="M18 2l.8 2.2L21 5l-2.2.8L18 8l-.8-2.2L15 5l2.2-.8zM18 15l.6 1.4L20 17l-1.4.6L18 19l-.6-1.4L16 17l1.4-.6z" />
              </svg>
              Create New Story
            </button>
          </div>
        </div>
      </div>

      <DraftSection/>
      <CompletedSection/>
    </div>
  );
};

export default Dashboard;

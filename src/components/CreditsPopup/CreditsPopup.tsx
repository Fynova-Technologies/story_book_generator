import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

export const LOW_CREDITS = 10;

// Nudges the user to buy credits when they hit zero or drop under LOW_CREDITS.
// Shown once per browser session per state, so "low" can still escalate to "empty".
const CreditsPopup = ({ credits }: { credits: number | null }) => {
  const dialog = useRef<HTMLDialogElement>(null);
  const navigate = useNavigate();
  const state = credits === null || credits >= LOW_CREDITS ? null : credits <= 0 ? "empty" : "low";

  useEffect(() => {
    if (!state) return;
    try {
      if (sessionStorage.getItem("creditsPopup") === state) return;
      sessionStorage.setItem("creditsPopup", state);
    } catch { /* storage blocked: show it anyway */ }
    dialog.current?.showModal();
  }, [state]);

  const close = () => dialog.current?.close();

  return (
    <dialog
      ref={dialog}
      onClick={e => e.target === e.currentTarget && close()}
      className="bg-paper m-auto w-[calc(100%-32px)] max-w-[400px] rounded-[20px] p-6 shadow-2xl backdrop:bg-black/40 text-center"
    >
      <h2 className="font-heading text-2xl font-bold text-light-text">
        {state === "empty" ? "You're out of credits" : "Running low on credits"}
      </h2>
      <p className="font-body text-sm text-light-outline mt-2">
        {state === "empty"
          ? "Get more credits to create your next story."
          : `You have ${credits} ${credits === 1 ? "credit" : "credits"} left. Top up so your next story isn't cut short.`}
      </p>
      <div className="flex flex-col gap-2 mt-6">
        <button
          onClick={() => { close(); navigate("/pricing"); }}
          className="h-11 rounded-[20px] bg-light-primary text-white font-body text-sm font-bold shadow-md hover:opacity-90 transition-opacity">
          Buy credits
        </button>
        <button onClick={close} className="h-10 font-body text-sm font-semibold text-light-outline hover:text-light-text">
          Maybe later
        </button>
      </div>
    </dialog>
  );
};

export default CreditsPopup;

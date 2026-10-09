import { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { TemplateQuestion } from "../../Data/templateQuestions";
import { templateFlow } from "../../Data/templateParts";
import { applyPrefill, setQuestionnaire } from "../../store/slices/storyWizardSlice";
import { prefillQuestionnaire } from "../../services/storyService";
import StepPanel, { PartNav } from "./StepPanel";

// Free-form answer for anything the questions don't cover; sent to the story like any other answer.
const EXTRA = "Anything else to include";
const ANSWER_LIMIT = 150;
const EXTRA_LIMIT = 500;

// "n/limit" under a field, like the photo notes. Questions only show it close to the limit.
const Counter = ({ value, limit, always }: { value: string; limit: number; always?: boolean }) =>
  always || value.length >= limit * 0.8
    ? <p className="text-right font-body text-[11px] text-light-outline/60" aria-live="polite">{value.length}/{limit}</p>
    : null;

// Figma 1489:1577 (Questionaire, PART n OF 5).
const fieldCls = "w-full px-4 rounded-xl border border-[#DCD3C4] bg-[#FAF8F5] font-body text-sm text-light-text placeholder:text-[#6B7C93] focus:outline-none focus:border-light-primary focus:ring-2 focus:ring-light-primary/15 transition-all";
const labelCls = "flex items-start gap-1 font-body text-sm font-semibold text-[#1F2937]";
const chipCls = (on: boolean) =>
  `px-4 py-2 rounded-full border font-body text-sm transition-all ${on ? "bg-light-primary border-light-primary text-white" : "bg-white border-[#DCD3C4] text-light-text hover:border-light-primary/50"}`;
const starterCls = (on: boolean) =>
  `text-left p-4 rounded-2xl border border-dashed font-body text-[13px] leading-snug text-[#2D3748] transition-all ${on ? "border-light-primary bg-light-primary/5" : "border-[#D5CCBD] bg-[#FAF8F5] hover:border-light-primary/60"}`;

// Adds or removes one name in a comma-separated answer like "Maya, Leo".
const toggleName = (value: string, name: string) => {
  const names = value.split(/,\s*/).map((n) => n.trim()).filter(Boolean);
  return (names.includes(name) ? names.filter((n) => n !== name) : [...names, name]).join(", ");
};

interface props {
  onValidChange: (valid: boolean) => void;
  // Lets the wizard's Next and Back move between parts (null when this step closes).
  onPartNav?: (nav: PartNav | null) => void;
}

const TemplateQuestionnaireSection = ({ onValidChange, onPartNav }: props) => {
  const dispatch = useDispatch();
  const selectedTemplate = useSelector((state: RootState) => state.story?.template || "templete");
  const answers = useSelector((state: RootState) => state.story?.questionnaire || {});
  const images = useSelector((state: RootState) => state.story?.images || []);
  const prefill = useSelector((state: RootState) => state.story?.prefill);

  const { category, questions, parts } = useMemo(() => templateFlow(selectedTemplate), [selectedTemplate]);
  const [part, setPart] = useState(0);
  const current = parts[Math.min(part, parts.length - 1)];
  const last = part >= parts.length - 1;

  // One entry per character: their role and notes from every photo of them, for the prefill.
  const notes = new Map<string, string[]>();
  images.filter((p) => p.image).forEach((p) => {
    const name = p.characterName.trim();
    if (name) notes.set(name, [...new Set([...(notes.get(name) || []), p.role || "", p.description.trim()])].filter(Boolean));
  });
  const characters = [...notes].map(([name, d]) => ({ name, description: d.join("; ") }));
  const names = characters.map((c) => c.name);
  const prefillKey = JSON.stringify([category, characters]);

  // Answer what the character notes already cover, once per template + notes.
  useEffect(() => {
    if (prefill?.key === prefillKey) return;
    if (!characters.some((c) => c.description)) {
      dispatch(applyPrefill({ key: prefillKey, answers: {}, suggestions: {} }));
      return;
    }
    let cancelled = false;
    prefillQuestionnaire({
      template: category,
      questions: questions.map(({ id, question, type }) => ({ id, question, type })),
      characters,
    })
      .then((result) => {
        if (cancelled) return;
        const byId = new Map(questions.map((q) => [q.id, q.question]));
        const filled: Record<string, string> = {};
        const suggestions: Record<string, string[]> = {};
        result.forEach(({ id, answer, suggestions: s }) => {
          const q = byId.get(id);
          if (!q) return;
          if (answer) filled[q] = answer.slice(0, ANSWER_LIMIT);
          if (s.length) suggestions[q] = s;
        });
        dispatch(applyPrefill({ key: prefillKey, answers: filled, suggestions }));
      })
      // Not worth bothering the user: mark it done so every question shows, to answer by hand.
      .catch((error) => {
        if (cancelled) return;
        console.error("Questionnaire prefill failed:", error);
        dispatch(applyPrefill({ key: prefillKey, answers: {}, suggestions: {} }));
      });
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- prefillKey covers template and notes
  }, [prefillKey, prefill?.key, dispatch]);

  // Questions wait for the prefill, so they don't jump around when its answers land.
  const prefilling = prefill?.key !== prefillKey;
  const isAnswered = (q: TemplateQuestion) => !!answers[q.question]?.trim();
  const partValid = current.questions.every((q) => !q.required || isAnswered(q));
  const optional = !prefilling && !current.questions.some((q) => q.required);

  const setAnswer = (question: string, value: string) => dispatch(setQuestionnaire({ ...answers, [question]: value }));

  useEffect(() => {
    onValidChange(partValid && !prefilling);
  }, [partValid, prefilling, onValidChange]);

  // The footer's Next and Back page through the parts first, then leave the step.
  useEffect(() => {
    onPartNav?.({
      next: () => !last && (setPart(part + 1), true),
      back: () => part > 0 && (setPart(part - 1), true),
      optional,
      nextTitle: last ? "Story style" : parts[part + 1].title,
    });
  }, [onPartNav, part, last, optional, parts]);
  useEffect(() => () => onPartNav?.(null), [onPartNav]);

  // A new part starts at the top, with focus on its heading for screen readers.
  const heading = useRef<HTMLHeadingElement>(null);
  const moved = useRef(false);
  useEffect(() => {
    if (!moved.current) { moved.current = true; return; }
    window.scrollTo({ top: 0, behavior: "smooth" });
    heading.current?.focus({ preventScroll: true });
  }, [part]);

  const renderQuestion = (q: TemplateQuestion & { label: string }) => {
    const value = answers[q.question] || "";
    const id = `q-${q.id}`;
    const short = q.type === "number" || q.type === "date";
    const chips = q.type === "character" ? names : (prefill?.suggestions[q.question] || []);
    const label = (
      <label htmlFor={id} className={labelCls}>
        {q.label}
        {q.required && <span className="text-red-600" aria-label="required">*</span>}
      </label>
    );
    return (
      <div key={q.id} className={`space-y-3 ${short ? "" : "sm:col-span-2"}`}>
        {label}
        {q.type === "textarea" ? (
          <>
            {chips.length > 0 && (
              <>
                <p className="font-body text-sm text-light-text">Tap a starter to use it, or write your own.</p>
                <div className="grid sm:grid-cols-3 gap-3">
                  {chips.map((chip) => (
                    <button key={chip} type="button" aria-pressed={value === chip} className={starterCls(value === chip)} onClick={() => setAnswer(q.question, chip.slice(0, ANSWER_LIMIT))}>
                      {chip}
                    </button>
                  ))}
                </div>
              </>
            )}
            <textarea id={id} value={value} onChange={(e) => setAnswer(q.question, e.target.value)} maxLength={ANSWER_LIMIT}
              placeholder={q.placeholder} rows={5} className={`${fieldCls} py-3 rounded-2xl resize-none leading-relaxed`} />
          </>
        ) : (
          <>
            {chips.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {chips.map((chip) => {
                  const on = q.type === "character" ? value.split(/,\s*/).includes(chip) : value === chip;
                  return (
                    <button key={chip} type="button" aria-pressed={on} className={chipCls(on)}
                      onClick={() => setAnswer(q.question, q.type === "character" ? toggleName(value, chip) : chip.slice(0, ANSWER_LIMIT))}>
                      {chip}
                    </button>
                  );
                })}
              </div>
            )}
            <input id={id} type={short ? q.type : "text"} min={q.type === "number" ? 0 : undefined}
              value={value} onChange={(e) => setAnswer(q.question, e.target.value)} maxLength={ANSWER_LIMIT}
              placeholder={chips.length ? (q.type === "character" ? "Or type someone else…" : "Or type your own…") : q.placeholder}
              className={`${fieldCls} h-12`} />
          </>
        )}
        <Counter value={value} limit={ANSWER_LIMIT} />
      </div>
    );
  };

  return (
    <StepPanel
      narrow
      small
      title="Tell us about your adventure"
      subtitle="Describe the main events, characters, or the lesson you want to teach."
      aside={
        <span className="px-3 py-1.5 rounded-full bg-light-primary/10 font-body text-xs font-bold text-light-primary">
          {selectedTemplate} Template
        </span>
      }
    >
      <div className="rounded-[26px] border border-[#EEE8DB] bg-white shadow-[0_4px_20px_-2px_rgba(0,0,0,0.08)] px-5 py-7 md:px-9 md:py-8">
        {prefilling ? (
          <div role="status" className="py-16 flex flex-col items-center gap-4">
            <div className="w-10 h-10 rounded-full border-4 border-light-primary/20 border-t-light-primary animate-spin" aria-hidden="true" />
            <p className="font-body text-sm font-semibold text-light-outline">Reading your character notes...</p>
          </div>
        ) : (
          <>
            {/* ── PROGRESS: one segment per part ── */}
            <div className="flex gap-2" aria-hidden="true">
              {parts.map((p, i) => (
                <span key={p.title} className={`h-[5px] flex-1 rounded-full transition-colors duration-300 ${i <= part ? "bg-light-primary" : "bg-light-primary/15"}`} />
              ))}
            </div>

            <p className="mt-7 font-body text-[11px] font-bold uppercase tracking-[0.16em] text-light-primary">
              Part {part + 1} of {parts.length}
            </p>
            <h3 ref={heading} tabIndex={-1} className="mt-2 font-heading text-3xl md:text-[34px] font-bold text-[#171717] tracking-[-0.025em] leading-tight focus:outline-none">
              {current.title}
            </h3>

            <div className="mt-7 grid sm:grid-cols-2 gap-x-4 gap-y-6">
              {current.questions.map(renderQuestion)}

              {/* Anything the questions didn't ask about, on the last part */}
              {last && (
                <div className="space-y-3 sm:col-span-2">
                  <label htmlFor="q-extra" className={labelCls}>Anything else we should know?</label>
                  <textarea
                    id="q-extra"
                    value={answers[EXTRA] || ""}
                    onChange={(e) => setAnswer(EXTRA, e.target.value)}
                    maxLength={EXTRA_LIMIT}
                    placeholder="e.g. Maya's dog Bolt should be in every scene, and end with the family singing together."
                    rows={4}
                    className={`${fieldCls} py-3 rounded-2xl resize-none leading-relaxed`}
                  />
                  <Counter value={answers[EXTRA] || ""} limit={EXTRA_LIMIT} always />
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </StepPanel>
  );
};

export default TemplateQuestionnaireSection;

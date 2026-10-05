import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { templateQuestions, TemplateQuestion } from "../../Data/templateQuestions";
import { applyPrefill, setQuestionnaire } from "../../store/slices/storyWizardSlice";
import { prefillQuestionnaire } from "../../services/storyService";
import StepPanel from "./StepPanel";

// Mapping of template titles to their category keys
const titleToCategoryMap: Record<string, string> = {
  "Birthday & Celebrations": "Birthday",
  "Love & Romance": "Love",
  "Heartfelt Apologies": "Apology",
  "Wedding Memories": "Wedding",
  "Long Distance Relations": "LongDistance",
  "Pet Memorial Tributes": "Memorial",
  "Graduation Milestones": "Milestones",
  "Family Heritage & History": "Family",
  "Travel Adventures": "Adventures",
  "Retirement Celebrations": "Retirement",
  "Educational Stories for Kids": "Kids",
  "Thank You & Gratitude": "Gratitude",
};

// Default fallback questions
const defaultQuestions = templateQuestions["templete"];
const numberOfQuestions = 10; // Set the number of questions to display
// Free-form answer for anything the questions don't cover; sent to the story like any other answer.
const EXTRA = "Anything else to include";

const fieldCls = "w-full px-4 py-3 rounded-2xl bg-[#F8F7F6] border-2 border-transparent text-light-text placeholder:text-light-outline/50 font-body text-sm shadow-[inset_0_2px_4px_rgba(0,0,0,0.05)] focus:outline-none focus:border-light-primary/30 transition-all";
const chipCls = (on: boolean) =>
  `px-3 py-1.5 rounded-full border font-body text-xs font-semibold transition-all ${on ? "bg-light-primary text-white border-light-primary" : "bg-white text-light-text border-[#F3EDE7] hover:border-light-primary/40"}`;

// Adds or removes one name in a comma-separated answer like "Maya, Leo".
const toggleName = (value: string, name: string) => {
  const names = value.split(/,\s*/).map((n) => n.trim()).filter(Boolean);
  return (names.includes(name) ? names.filter((n) => n !== name) : [...names, name]).join(", ");
};

interface props{
  onValidChange:(valid:boolean)=>void;
}

const TemplateQuestionnaireSection = ({ onValidChange }: props) => {
  const dispatch = useDispatch();
  const selectedTemplate = useSelector((state: RootState) => state.story?.template || "templete");
  const answers = useSelector((state: RootState) => state.story?.questionnaire || {});
  const images = useSelector((state: RootState) => state.story?.images || []);
  const prefill = useSelector((state: RootState) => state.story?.prefill);

  const templateCategory = titleToCategoryMap[selectedTemplate] || selectedTemplate;
  const questions = (templateQuestions[templateCategory] || defaultQuestions).slice(0, numberOfQuestions);

  // One entry per character; notes from several photos of one person are joined.
  const notes = new Map<string, string[]>();
  images.filter((p) => p.image).forEach((p) => {
    const name = p.characterName.trim();
    if (name) notes.set(name, [...(notes.get(name) || []), p.description.trim()].filter(Boolean));
  });
  const characters = [...notes].map(([name, d]) => ({ name, description: d.join("; ") }));
  const names = characters.map((c) => c.name);
  const prefillKey = JSON.stringify([templateCategory, characters]);

  // Answer what the character notes already cover, once per template + notes.
  useEffect(() => {
    if (prefill?.key === prefillKey) return;
    if (!characters.some((c) => c.description)) {
      dispatch(applyPrefill({ key: prefillKey, answers: {}, suggestions: {} }));
      return;
    }
    let cancelled = false;
    prefillQuestionnaire({
      template: templateCategory,
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
          if (answer) filled[q] = answer;
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
  const answeredCount = questions.filter(isAnswered).length;
  const currentProgress = Math.round((answeredCount / questions.length) * 100);
  const isValid = questions.every((q) => !q.required || isAnswered(q));

  const fromNotes = questions.filter((q) => !prefilling && prefill!.filled.includes(q.question));
  const toAsk = questions.filter((q) => !fromNotes.includes(q));

  const setAnswer = (question: string, value: string) => dispatch(setQuestionnaire({ ...answers, [question]: value }));

  useEffect(() => {
    onValidChange(isValid && !prefilling);
  }, [isValid, prefilling, onValidChange]);

  const renderInput = (q: TemplateQuestion) => {
    const value = answers[q.question] || "";
    const id = `q-${q.id}`;
    const chips = q.type === "character" ? names : (prefill?.suggestions[q.question] || []);
    return (
      <>
        {chips.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {chips.map((chip) => {
              const on = q.type === "character" ? value.split(/,\s*/).includes(chip) : value === chip;
              return (
                <button key={chip} type="button" aria-pressed={on} className={chipCls(on)}
                  onClick={() => setAnswer(q.question, q.type === "character" ? toggleName(value, chip) : chip)}>
                  {chip}
                </button>
              );
            })}
          </div>
        )}
        {q.type === "textarea" ? (
          <textarea id={id} value={value} onChange={(e) => setAnswer(q.question, e.target.value)}
            placeholder={q.placeholder} rows={3} className={`${fieldCls} resize-none leading-relaxed`} />
        ) : (
          <input id={id} type={q.type === "number" || q.type === "date" ? q.type : "text"} min={q.type === "number" ? 0 : undefined}
            value={value} onChange={(e) => setAnswer(q.question, e.target.value)}
            placeholder={q.type === "character" && names.length ? "Or type someone else..." : q.placeholder} className={fieldCls} />
        )}
      </>
    );
  };

  const renderQuestion = (q: TemplateQuestion) => (
    <div key={q.id} className="space-y-2">
      <label htmlFor={`q-${q.id}`} className="flex items-start gap-2 font-body text-base font-bold text-light-text">
        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-light-primary/10 flex items-center justify-center text-xs font-bold text-light-primary">
          {questions.indexOf(q) + 1}
        </span>
        <span>
          {q.question}
          {q.required && <span className="text-light-primary" aria-label="required"> *</span>}
        </span>
      </label>
      {renderInput(q)}
    </div>
  );

  return (
    <StepPanel
      narrow
      small
      title="Tell us about your story"
      subtitle="Answer what you like; only questions marked * are needed. We've filled in what your character notes already tell us."
      aside={
        <span className="px-3 py-1.5 rounded-full bg-light-primary/10 font-body text-xs font-bold text-light-primary">
          {selectedTemplate} Template
        </span>
      }
    >
      {prefilling ? (
        <div role="status" className="rounded-3xl border border-[#F3EDE7] bg-white shadow-[0_4px_20px_-2px_rgba(0,0,0,0.08)] px-5 py-16 flex flex-col items-center gap-4">
          <div className="w-10 h-10 rounded-full border-4 border-light-primary/20 border-t-light-primary animate-spin" aria-hidden="true" />
          <p className="font-body text-sm font-semibold text-light-outline">Reading your character notes...</p>
        </div>
      ) : (
      <div className="rounded-3xl border border-[#F3EDE7] bg-white shadow-[0_4px_20px_-2px_rgba(0,0,0,0.08)]">

        {/* ── PROGRESS ── */}
        <div className="px-5 md:px-8 pt-6 pb-5 border-b border-[#F3EDE7] space-y-2">
          <div className="flex justify-between items-center">
            <span className="font-body text-sm font-semibold text-light-text">
              Progress
            </span>
            <span className="font-body text-xs font-bold text-light-primary">
              {answeredCount} of {questions.length} answered
            </span>
          </div>
          <div className="h-2 rounded-full bg-light-primary/10 overflow-hidden">
            <div
              className="h-full rounded-full bg-light-primary transition-all duration-500"
              style={{ width: `${currentProgress}%` }}
            />
          </div>
        </div>

        {/* ── QUESTIONS ── */}
        <div className="px-5 md:px-8 py-6 space-y-6">
          {fromNotes.length > 0 && (
            <details className="rounded-2xl border border-[#F3EDE7] px-4 py-3">
              <summary className="cursor-pointer font-body text-sm font-bold text-light-primary">
                Filled from your character notes ({fromNotes.length})
              </summary>
              <div className="mt-4 space-y-6">
                {fromNotes.map(renderQuestion)}
              </div>
            </details>
          )}

          {toAsk.map(renderQuestion)}

          {/* Anything the questions didn't ask about */}
          <div className="space-y-2">
            <label htmlFor="q-extra" className="font-body text-base font-bold text-light-text">
              Anything else we should know?
            </label>
            <textarea
              id="q-extra"
              value={answers[EXTRA] || ""}
              onChange={(e) => setAnswer(EXTRA, e.target.value)}
              placeholder="e.g. Maya's dog Bolt should be in every scene, and end with the family singing together."
              rows={3}
              className={`${fieldCls} resize-none leading-relaxed`}
            />
          </div>
        </div>

      </div>
      )}
    </StepPanel>
  );
};

export default TemplateQuestionnaireSection;

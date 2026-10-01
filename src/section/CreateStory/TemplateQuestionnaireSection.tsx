import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { templateQuestions } from "../../Data/templateQuestions";
import { setQuestionnaire } from "../../store/slices/storyWizardSlice";
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
interface props{
  onValidChange:(valid:boolean)=>void;
}

const TemplateQuestionnaireSection = ({ onValidChange }: props) => {
  const dispatch = useDispatch();
  // ✅ Get selected template from Redux store
  const selectedTemplate = useSelector((state: RootState) => state.story?.template || "templete");
  const storedQuestionnaire = useSelector((state: RootState) => state.story?.questionnaire || {});

  // ✅ Convert title to category and get questions based on selected template
  const templateCategory = titleToCategoryMap[selectedTemplate] || selectedTemplate;
  const questions = (templateQuestions[templateCategory] || defaultQuestions).slice(0, numberOfQuestions);

  // Counts answers to this template's questions only (answers from another template don't count).
  const countAnswered = (a: Record<string, string>) => questions.filter((q) => a[q.question]?.trim()).length;

  // ✅ Store answers - initialize from Redux, so saved answers keep their progress
  const [answers, setAnswers] = useState<Record<string, string>>(storedQuestionnaire);
  // Already saved if every answer came back from Redux; editing an answer needs another save.
  const [isSubmitted, setIsSubmitted] = useState(() => countAnswered(storedQuestionnaire) === questions.length);

  const answeredCount = countAnswered(answers);
  const isFilled = answeredCount === questions.length;
  const currentProgress = Math.round((answeredCount / questions.length) * 100);

  const handleAnswerChange = (question: string, value: string) => {
    setAnswers({ ...answers, [question]: value });
    setIsSubmitted(false);
  };

  const handleSubmit = () => {
    dispatch(setQuestionnaire(answers));
    setIsSubmitted(true);
  };

  useEffect(() => {
    // Valid once every question is answered and saved
    onValidChange(isFilled && isSubmitted);
  }, [isFilled, isSubmitted, onValidChange]);

  return (
    <StepPanel
      narrow
      small
      title="Tell us about your adventure"
      subtitle="Answer the questions below to help our AI craft your perfect story."
      aside={
        <span className="px-3 py-1.5 rounded-full bg-light-primary/10 font-body text-xs font-bold text-light-primary">
          {selectedTemplate} Template
        </span>
      }
    >
      <div className="rounded-3xl border border-[#F3EDE7] bg-white shadow-[0_4px_20px_-2px_rgba(0,0,0,0.08)]">

        {/* ── PROGRESS ── */}
        <div className="px-5 md:px-8 pt-6 pb-5 border-b border-[#F3EDE7] space-y-2">
          <div className="flex justify-between items-center">
            <span className="font-body text-sm font-semibold text-light-text">
              Progress
            </span>
            <span className="font-body text-xs font-bold text-light-primary">
              {currentProgress}% complete
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
          {questions.map((q, index) => (
            <div key={q.id} className="space-y-2">

              {/* Question label */}
              <label htmlFor={`q-${q.id}`} className="flex items-start gap-2 font-body text-base font-bold text-light-text">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-light-primary/10 flex items-center justify-center text-xs font-bold text-light-primary">
                  {index + 1}
                </span>
                {q.question}
              </label>

              {/* Input or Textarea */}
              {q.type === "textarea" ? (
                <textarea
                  id={`q-${q.id}`}
                  value={answers[q.question] || ""}
                  onChange={(e) => handleAnswerChange(q.question, e.target.value)}
                  placeholder={q.placeholder}
                  rows={3}
                  className="w-full px-4 py-3 rounded-2xl bg-[#F8F7F6] border-2 border-transparent text-light-text placeholder:text-light-outline/50 font-body text-sm shadow-[inset_0_2px_4px_rgba(0,0,0,0.05)] focus:outline-none focus:border-light-primary/30 transition-all resize-none leading-relaxed"
                />
              ) : (
                <input
                  id={`q-${q.id}`}
                  type="text"
                  value={answers[q.question] || ""}
                  onChange={(e) => handleAnswerChange(q.question, e.target.value)}
                  placeholder={q.placeholder}
                  className="w-full px-4 py-3 rounded-2xl bg-[#F8F7F6] border-2 border-transparent text-light-text placeholder:text-light-outline/50 font-body text-sm shadow-[inset_0_2px_4px_rgba(0,0,0,0.05)] focus:outline-none focus:border-light-primary/30 transition-all"
                />
              )}

            </div>
          ))}
        </div>

        {/* ── SAVE ── */}
        <div className="px-5 md:px-8 py-4 border-t border-[#F3EDE7] flex items-center justify-between gap-3">
          <p className="font-body text-sm text-light-outline">
            {answeredCount} of {questions.length} answered
          </p>
          <button
            onClick={handleSubmit}
            disabled={!isFilled}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl bg-light-primary text-white font-body font-bold text-sm transition-all duration-200
              ${isFilled ? "hover:opacity-90 active:scale-[0.99]" : "opacity-50 cursor-not-allowed"}`}
          >
            {isSubmitted ? "Answers saved" : "Save Answers"}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          </button>
        </div>

      </div>
    </StepPanel>
  );
};

export default TemplateQuestionnaireSection;

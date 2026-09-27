import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { templateQuestions } from "../../Data/templateQuestions";
import { setQuestionnaire } from "../../store/slices/storyWizardSlice";



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

  // ✅ Get questions based on selected template
  const questions = templateQuestions[selectedTemplate] || defaultQuestions;
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isFilled, setIsFilled] = useState(false);

  // ✅ Store answers
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [currentProgress, setCurrentProgress] = useState(0);

  const handleAnswerChange = (question: string, value: string) => {
    const updated = { ...answers, [question]: value };
    setAnswers(updated);
    const answered = Object.values(updated).filter((v) => v.trim() !== "").length;
    setCurrentProgress(Math.round((answered /numberOfQuestions) * 100));
  };



  const handleSubmit = () => {
    // console.log("Answers submitted:", answers);
    // 👉 Dispatch to Redux or pass to parent
    dispatch(setQuestionnaire( answers ));
    setIsSubmitted(true);
    // console.log(answers);
    

  };
 useEffect(() => {
    // Mark this step as valid when all questions are answered
    if(Object.values(answers).filter((v) => v.trim() !== "").length === numberOfQuestions){
      setIsFilled(true);
    }
    onValidChange(Object.values(answers).filter((v) => v.trim() !== "").length === numberOfQuestions && isSubmitted);
  },[answers, questions.length, isSubmitted]);

  return (
    <div className="bg-light-on-primary dark:bg-dark-bg rounded-3xl  border-light-outline-secondary dark:border-dark-primary-30 overflow-hidden flex flex-col"
      style={{ maxHeight: "calc(100vh - 180px)" }}
    >

      {/* ── FIXED HEADER ── */}
      <div className="flex-shrink-0 px-6 md:px-8 pt-6 pb-4 border-b border-light-outline-secondary dark:border-dark-primary-30">

        {/* Title + Template badge */}
        <div className="flex items-start justify-between gap-4 mb-1">
          <div>
            <h2 className="font-heading text-2xl md:text-3xl font-bold text-light-text dark:text-dark-text">
              Tell us about your adventure
            </h2>
            <p className="font-body text-sm text-light-outline dark:text-dark-text  mt-1">
              Answer the questions below to help our AI craft your perfect story.
            </p>
          </div>

          {/* Template badge */}
          <div className="flex-shrink-0 px-3 py-1.5 rounded-full bg-dark-primary-10 border border-dark-primary-30">
            <span className="font-body text-xs font-semibold text-light-primary dark:text-dark-primary capitalize">
              {selectedTemplate} Template
            </span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-4 space-y-1">
          <div className="flex justify-between items-center">
            <span className="font-body text-xs text-light-outline dark:text-dark-text ">
              Progress
            </span>
            <span className="font-body text-xs font-semibold text-light-primary dark:text-dark-primary">
              {currentProgress}% complete
            </span>
          </div>
          <div className="h-1.5 rounded-full bg-light-outline-secondary/20 dark:bg-dark-primary-30 overflow-hidden">
            <div
              className="h-full rounded-full bg-light-primary dark:bg-dark-primary transition-all duration-500"
              style={{ width: `${currentProgress}%` }}
            />
          </div>
        </div>

      </div>

      {/* ── SCROLLABLE QUESTIONS AREA ── */}
      <div className="flex-1 overflow-y-auto px-6 md:px-8 py-6 space-y-6">
        {questions.slice(0, numberOfQuestions).map((q, index) => (
          <div key={q.id} className="space-y-2">

            {/* Question label */}
            <label className="flex items-start gap-2 font-body text-sm font-semibold text-light-text dark:text-dark-text">
              <span className="flex-shrink-0 w-5 h-5 rounded-full bg-dark-primary-10 border border-dark-primary-30 flex items-center justify-center text-[10px] font-bold text-light-primary dark:text-dark-primary mt-0.5">
                {index + 1}
              </span>
              {q.question}
            </label>

            {/* Input or Textarea */}
            {q.type === "textarea" ? (
              <textarea
                value={answers[q.question] || ""}
                onChange={(e: any) => handleAnswerChange(q.question, e.target.value)}
                placeholder={q.placeholder}
                rows={3}
                className="w-full px-4 py-3 rounded-xl bg-light-bg dark:bg-dark-primary-10 border border-light-outline-secondary dark:border-dark-primary-30 text-light-text dark:text-dark-text placeholder:text-light-outline-secondary font-body text-sm focus:outline-none focus:border-light-primary dark:focus:border-dark-primary focus:ring-2 focus:ring-dark-primary-10 transition-all resize-none leading-relaxed"
              />
            ) : (
              <input
                type="text"
                value={answers[q.question] || ""}
                onChange={(e: any) => handleAnswerChange(q.question, e.target.value)}
                placeholder={q.placeholder}
                className="w-full px-4 py-3 rounded-xl bg-light-bg dark:bg-dark-primary-10 border border-light-outline-secondary dark:border-dark-primary-30 text-light-text dark:text-dark-text placeholder:text-light-outline-secondary font-body text-sm focus:outline-none focus:border-light-primary dark:focus:border-dark-primary focus:ring-2 focus:ring-dark-primary-10 transition-all"
              />
            )}

          </div>
        ))}
      </div>

      {/* ── FIXED FOOTER ── */}
      <div className="flex-shrink-0 px-6 md:px-8 py-4 border-t border-light-outline-secondary dark:border-dark-primary-30 flex items-center justify-between bg-light-on-primary dark:bg-dark-bg">
        <p className="font-body text-xs text-light-outline dark:text-dark-text opacity-80">
          {Object.values(answers).filter((v) => v.trim() !== "").length} of {numberOfQuestions} answered
        </p>
        <button
          onClick={handleSubmit}
          disabled={!isFilled}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl ${isFilled ? 'bg-light-primary dark:bg-dark-primary' : 'bg-light-outline-secondary dark:bg-dark-primary-30'} text-light-on-primary 
            font-body font-semibold text-sm hover:opacity-90 active:scale-[0.99] transition-all duration-200`}
        >
          Save Answers
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </button>
      </div>

    </div>
  );
};

export default TemplateQuestionnaireSection;

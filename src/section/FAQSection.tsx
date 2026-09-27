import { useState } from "react";
import FAQItem from "../components/FAQItem/FAQItem";
import CTASection from "./CTASection";

const faqData = [
  {
    id: 1,
    question: "How does AI write my story?",
    answer:
      "You answer guided questions about your characters, setting, and emotions. Our AI reads your answers and writes a complete narrative that feels personal and genuine. Then you choose your illustration style and we generate matching artwork for every page.",
  },
  {
    id: 2,
    question: "Can I edit the story after?",
    answer:
      "Yes! After the AI generates your story, you have full editing access. You can modify the text, swap illustrations, rearrange pages, and customize every detail until it's exactly how you want it.",
  },
  {
    id: 3,
    question: "How long does it take to generate a story?",
    answer:
      "Most stories are generated within 2-5 minutes. The AI works quickly to craft your narrative and illustrations simultaneously. Complex stories with many characters may take slightly longer.",
  },
  {
    id: 4,
    question: "What happens to my photos?",
    answer:
      "Your photos are stored securely and used only to personalize your storybook. We never share your images with third parties. You can delete your photos from our servers at any time from your account settings.",
  },
  {
    id: 5,
    question: "Can I print my storybook?",
    answer:
      "Absolutely! We offer high-quality printed copies delivered straight to your door. Choose from softcover or hardcover options. Digital downloads are also available in PDF format.",
  },
  {
    id: 6,
    question: "Is my data and photos secure?",
    answer:
      "We take security very seriously. All data is encrypted in transit and at rest. We use industry-standard security practices and never sell your personal information to third parties.",
  },
];

const FAQSection = () => {
  const [openId, setOpenId] = useState<number | null>(1);

  const handleToggle = (id: number) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section
      data-bg="light"
      className="w-full py-16 px-6 md:px-12 xl:px-20 bg-light-bg dark:bg-dark-bg"
    >
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-16">

          {/* ── LEFT — Heading ── */}
          <div className="lg:w-[35%] shrink-0">
            <h2 className="font-heading text-4xl md:text-4xl font-bold text-light-text dark:text-dark-text leading-tight">
              Frequently <br /> Asked Questions
            </h2>
          </div>

          {/* ── RIGHT — FAQ Items ── */}
          <div className="flex-1 flex flex-col">
            {faqData.map((faq) => (
              <FAQItem
                key={faq.id}
                question={faq.question}
                answer={faq.answer}
                isOpen={openId === faq.id}
                onToggle={() => handleToggle(faq.id)}
              />
            ))}
          </div>

        </div>
      </div>
      <div>
        <CTASection/>
      </div>
    </section>
  );
};

export default FAQSection;

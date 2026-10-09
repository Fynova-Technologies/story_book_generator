// How each template's questionnaire is paged (Figma "Tell us about your adventure": PART n OF 5),
// the short label shown for each question, and the role chips offered for each photo.
// Answers stay keyed by the full question text in templateQuestions.ts: that is what the story writer reads.
import { TemplateQuestion, templateQuestions } from "./templateQuestions";

export interface TemplatePart { title: string; questions: [id: number, label: string][] }
interface TemplateFlow { roles: string[]; parts: TemplatePart[] }

// Template titles (TemplateSelection) to their question sets.
const CATEGORY: Record<string, string> = {
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

const FLOWS: Record<string, TemplateFlow> = {
  templete: {
    roles: ["Hero", "Sidekick", "Family", "Friend", "Pet"],
    parts: [
      { title: "Who's the star?", questions: [[1, "Main character"], [2, "Age"]] },
      { title: "Setting the scene", questions: [[3, "Where it takes place"], [4, "Main theme"], [9, "Mood"]] },
      { title: "Who comes along", questions: [[5, "Supporting character"]] },
      { title: "The challenge", questions: [[6, "The challenge they face"], [7, "How they overcome it"]] },
      { title: "The lesson", questions: [[8, "What the story teaches"]] },
    ],
  },
  Birthday: {
    roles: ["Birthday star", "Parent", "Sibling", "Friend", "Pet"],
    parts: [
      { title: "Who's the star?", questions: [[1, "Name of the birthday person"], [2, "Turning"], [3, "Birthday"]] },
      { title: "Where & with whom", questions: [[4, "Where is the celebration?"], [5, "Family and friends in the story"]] },
      { title: "A favorite memory", questions: [[9, "Describe a funny childhood memory"]] },
      { title: "What they love", questions: [[6, "Favorite color"], [7, "Hobbies and interests"], [8, "Favorite foods"]] },
      { title: "Their year", questions: [[10, "What they achieved this year"]] },
    ],
  },
  Love: {
    roles: ["Partner", "Me", "Family", "Friend", "Pet"],
    parts: [
      { title: "The couple", questions: [[1, "Names of the couple"], [2, "Together for"], [4, "Their ages"]] },
      { title: "How it started", questions: [[3, "Where they first met"], [7, "Pet names for each other"]] },
      { title: "Their favorite things", questions: [[6, "Favorite things to do together"], [8, "Favorite song or movie"], [5, "How they look, briefly"]] },
      { title: "A date to remember", questions: [[9, "Their most memorable date"]] },
      { title: "Through it all", questions: [[10, "Challenges they faced together"]] },
    ],
  },
  Adventures: {
    roles: ["Adventurer", "Sidekick", "Family", "Friend", "Pet"],
    parts: [
      { title: "The adventurers", questions: [[1, "Who is the adventurer?"], [4, "Who comes along"]] },
      { title: "The quest", questions: [[2, "Where the adventure happens"], [3, "The quest or mission"], [6, "Tools they carry"]] },
      { title: "Danger ahead", questions: [[5, "Dangers they face"], [7, "The biggest obstacle"]] },
      { title: "The victory", questions: [[8, "How they succeed"], [9, "What they discover at the end"]] },
      { title: "The lesson", questions: [[10, "What the adventure teaches"]] },
    ],
  },
  Memorial: {
    roles: ["Beloved pet", "Owner", "Family", "Friend"],
    parts: [
      { title: "Who we remember", questions: [[1, "Pet's name and what animal"], [2, "Age, and years with the family"], [3, "When they passed"]] },
      { title: "Home & family", questions: [[4, "Home and favorite places"], [5, "People closest to them"]] },
      { title: "What they loved", questions: [[6, "Favorite color, toy or features"], [7, "Favorite activities and habits"], [8, "Favorite treats"]] },
      { title: "A funny memory", questions: [[9, "A funny or mischievous memory"]] },
      { title: "Special moments", questions: [[10, "Special moments and tricks"]] },
    ],
  },
  Apology: {
    roles: ["Me", "Apologizing to", "Family", "Friend"],
    parts: [
      { title: "Who's involved", questions: [[1, "Who is apologizing, and to whom"], [5, "The apologizer's personality"], [7, "Anyone else involved"]] },
      { title: "What happened", questions: [[6, "What led up to it"], [2, "What happened"], [3, "When and where"]] },
      { title: "The aftermath", questions: [[8, "What happened right after"], [4, "How it strained the relationship"]] },
      { title: "How they feel", questions: [[9, "How the apologizer felt"], [10, "How the other person felt"]] },
    ],
  },
  Wedding: {
    roles: ["Bride", "Groom", "Partner", "Family", "Friend"],
    parts: [
      { title: "The couple", questions: [[1, "Names of the couple"], [2, "Wedding date and place"], [3, "Years since the wedding"]] },
      { title: "The proposal", questions: [[9, "How the proposal happened"]] },
      { title: "The look", questions: [[4, "Theme or style"], [6, "Favorite colors or flowers"], [8, "Dress code and outfits"]] },
      { title: "Who was there", questions: [[5, "Family and friends there"], [7, "Traditions included"]] },
      { title: "Big moments", questions: [[10, "Memorable moments from the day"]] },
    ],
  },
  LongDistance: {
    roles: ["Me", "My person", "Family", "Friend", "Pet"],
    parts: [
      { title: "The couple", questions: [[1, "Names or nicknames"], [5, "Ages and jobs"]] },
      { title: "How it started", questions: [[4, "How they met"], [3, "Together for"]] },
      { title: "The distance", questions: [[2, "How far apart"], [8, "Time zones and routines"]] },
      { title: "Staying close", questions: [[6, "How they keep in touch"], [7, "Shared interests"]] },
      { title: "The hard parts", questions: [[9, "Biggest difficulties"], [10, "Low points or doubts"]] },
    ],
  },
  Milestones: {
    roles: ["Graduate", "Parent", "Sibling", "Friend", "Mentor"],
    parts: [
      { title: "The graduate", questions: [[1, "Graduate's name"], [2, "Level of graduation"], [3, "Ceremony date"]] },
      { title: "School & supporters", questions: [[4, "School and ceremony place"], [5, "Family and friends cheering them on"]] },
      { title: "Their studies", questions: [[7, "Field of study"], [6, "Favorite or school colors"], [8, "Honors and awards"]] },
      { title: "A school-days memory", questions: [[9, "A funny or challenging moment"]] },
      { title: "Achievements", questions: [[10, "Biggest achievements"]] },
    ],
  },
  Family: {
    roles: ["Grandparent", "Parent", "Child", "Sibling", "Pet"],
    parts: [
      { title: "The family", questions: [[2, "Family members across generations"], [1, "Family surname and its meaning"]] },
      { title: "Roots", questions: [[3, "Where the family comes from"], [4, "Key eras or years"], [7, "Common occupations"]] },
      { title: "Notable ancestors", questions: [[5, "Ancestors with unique stories"]] },
      { title: "Family treasures", questions: [[6, "Heirlooms and symbols"], [8, "Crests or mottos"]] },
      { title: "The journey", questions: [[9, "A significant journey"], [10, "Family achievements"]] },
    ],
  },
  Retirement: {
    roles: ["Retiree", "Partner", "Family", "Colleague", "Friend"],
    parts: [
      { title: "The retiree", questions: [[1, "Retiree's name"], [2, "Profession"], [3, "Years worked"]] },
      { title: "The career", questions: [[4, "Major accomplishments"], [6, "Favorite parts of the job"]] },
      { title: "People along the way", questions: [[5, "Colleagues and mentors"], [10, "How family supported them"]] },
      { title: "Stories from work", questions: [[7, "A funny or memorable moment"], [8, "Challenges they overcame"]] },
      { title: "What's next", questions: [[9, "Plans for retirement"]] },
    ],
  },
  Kids: {
    roles: ["Star", "Parent", "Sibling", "Friend", "Pet"],
    parts: [
      { title: "Who's the star?", questions: [[1, "Main character"], [2, "Age and personality"]] },
      { title: "Their world", questions: [[3, "Where the story happens"], [5, "Supporting characters"]] },
      { title: "The problem", questions: [[4, "The problem to solve"], [7, "Fun or magical elements"]] },
      { title: "The message", questions: [[6, "Lesson or moral"], [8, "Tone"], [9, "Educational content"]] },
      { title: "The ending", questions: [[10, "How it should end"]] },
    ],
  },
  Gratitude: {
    roles: ["Me", "Being thanked", "Family", "Friend", "Mentor"],
    parts: [
      { title: "Who's who", questions: [[1, "Who is saying thank you"], [2, "Who is being thanked"]] },
      { title: "Why you're grateful", questions: [[3, "What you're grateful for"], [7, "Qualities you admire"]] },
      { title: "A moment to remember", questions: [[4, "A memorable moment"]] },
      { title: "The difference they made", questions: [[5, "How they changed your life"], [6, "Lessons learned from them"]] },
      { title: "The message", questions: [[8, "Tone"], [9, "Messages or quotes to include"], [10, "How it should end"]] },
    ],
  },
};

// "Write my own story" has no template.
export const CUSTOM_ROLES = ["Main character", "Family", "Friend", "Pet"];

const QUESTIONS_SHOWN = 10;

// The questions, parts and roles for a template title. Parts only list questions that exist; a
// question no part lists (data drift) joins the last part rather than vanishing.
export function templateFlow(title: string) {
  const known = CATEGORY[title] || title;
  const category = templateQuestions[known] ? known : "templete";
  const flow = FLOWS[category] || FLOWS.templete;
  const questions = templateQuestions[category].slice(0, QUESTIONS_SHOWN);
  const byId = new Map(questions.map((q) => [q.id, q]));
  const parts = flow.parts
    .map((part) => ({ title: part.title, questions: part.questions.flatMap(([id, label]) => byId.has(id) ? [{ ...byId.get(id)!, label }] : []) }))
    .filter((part) => part.questions.length);
  const placed = new Set(parts.flatMap((part) => part.questions.map((q) => q.id)));
  const missing = questions.filter((q) => !placed.has(q.id)).map((q) => ({ ...q, label: q.question }));
  if (!parts.length) parts.push({ title: "Your story", questions: [] });
  parts[parts.length - 1].questions.push(...missing);
  return { category, questions, parts: parts as { title: string; questions: (TemplateQuestion & { label: string })[] }[], roles: flow.roles };
}

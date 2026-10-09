// Demo books for the public samples pages, made with test/story/cases/demo-*.json (no real faces).
// Images live in public/samples/<slug>/.
export interface SampleStory {
  slug:     string;
  title:    string;
  subtitle: string;
  style:    string;
  pages:    { page: number; text: string; imageUrl: string }[];
}

export const sampleStories: SampleStory[] = [
  {
    "slug": "robot-rivals",
    "title": "The Spare Wheel",
    "subtitle": "A fierce final becomes the start of a friendship",
    "style": "manga",
    "pages": [
      {
        "page": 1,
        "text": "",
        "imageUrl": "/samples/robot-rivals/page-1.webp"
      },
      {
        "page": 2,
        "text": "",
        "imageUrl": "/samples/robot-rivals/page-2.webp"
      },
      {
        "page": 3,
        "text": "",
        "imageUrl": "/samples/robot-rivals/page-3.webp"
      },
      {
        "page": 4,
        "text": "",
        "imageUrl": "/samples/robot-rivals/page-4.webp"
      }
    ]
  }
];

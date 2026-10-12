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
  },
  {
    "slug": "paper-boat",
    "title": "The Little Boat That Carried Love",
    "subtitle": "A rainy-day adventure with Maya and Biscuit",
    "style": "storybook",
    "pages": [
      {
        "page": 1,
        "text": "Rain stitched silver lines across the seaside town, and the gutters hurried like tiny rivers toward the harbour. Maya folded a paper boat around a birthday note for Grandma. Biscuit watched closely as she set it afloat. Then a sudden rush of rain whisked the boat away.",
        "imageUrl": "/samples/paper-boat/page-1.webp"
      },
      {
        "page": 2,
        "text": "Maya and Biscuit dashed after the boat, splashing through puddles as it bobbed down the sloping street. The harbour glittered ahead beneath the grey sky. Maya’s heart thumped, but she remembered her birthday wish for Grandma: a message full of love. She called to a nearby fisherman for help.",
        "imageUrl": "/samples/paper-boat/page-2.webp"
      },
      {
        "page": 3,
        "text": "The fisherman stretched his net as Maya reached toward the water. Biscuit barked, and together they guided the little boat into the net just before it met the harbour. Maya lifted it carefully. The note was soggy and smudged, but still tucked inside, safe from the sea.",
        "imageUrl": "/samples/paper-boat/page-3.webp"
      },
      {
        "page": 4,
        "text": "That evening, Maya gave Grandma the damp note, its words blurred into little blue clouds. Grandma laughed, then cried happy tears, and hugged Maya close. Biscuit curled at their feet while rain tapped softly at the window. Love, they learned, can arrive imperfectly and still find its way home.",
        "imageUrl": "/samples/paper-boat/page-4.webp"
      }
    ]
  },
  {
    "slug": "lost-suitcase",
    "title": "The Great Suitcase Switch",
    "subtitle": "A snowy railway adventure about sticking together",
    "style": "comic",
    "pages": [
      {
        "page": 1,
        "text": "",
        "imageUrl": "/samples/lost-suitcase/page-1.webp"
      },
      {
        "page": 2,
        "text": "",
        "imageUrl": "/samples/lost-suitcase/page-2.webp"
      },
      {
        "page": 3,
        "text": "",
        "imageUrl": "/samples/lost-suitcase/page-3.webp"
      },
      {
        "page": 4,
        "text": "",
        "imageUrl": "/samples/lost-suitcase/page-4.webp"
      }
    ]
  },
  {
    "slug": "lantern-night",
    "title": "The Lantern We Made Together",
    "subtitle": "A rooftop story for Noor and Amir",
    "style": "storybook",
    "pages": [
      {
        "page": 1,
        "text": "Night settled over the old city, where rooftops glimmered beneath the coming lantern festival. Noor carried her homemade lantern up the steps with Amir beside her. Each year, their family welcomed the festival together. Tonight, Noor hoped her little lantern would add its own bright hello.",
        "imageUrl": "/samples/lantern-night/page-1.webp"
      },
      {
        "page": 2,
        "text": "But when Noor touched the little flame to its wick, the lantern stayed dark. The first festival lights were appearing across the rooftops, and the evening seemed to hurry past. Noor's shoulders drooped. Amir sat beside her, patient as the quiet sky, and asked her to show him how she had made it.",
        "imageUrl": "/samples/lantern-night/page-2.webp"
      },
      {
        "page": 3,
        "text": "Amir told Noor about his first lantern, which had refused to shine when he was a boy. He showed her how he had carefully straightened its little frame and made space for the wick. Together they tried again. A tiny flame caught, and Noor's lantern bloomed with golden light.",
        "imageUrl": "/samples/lantern-night/page-3.webp"
      },
      {
        "page": 4,
        "text": "Noor and Amir lifted their lantern together as the whole sky filled with drifting lights. Across the rooftops, families welcomed the festival, carrying old traditions into a new night. Noor felt her lantern glow warmly between them. Some things, she knew, shine brightest when we make them together.",
        "imageUrl": "/samples/lantern-night/page-4.webp"
      }
    ]
  }
];

/**
 * Every word on the site lives here. Edit this file to update the portfolio —
 * no component needs touching for a content change.
 */

export const site = {
  name: "Sasha Sutton",
  role: "Data science & AI",
  location: "Paris",
  description:
    "Sasha Sutton — M1 in Data, Knowledge & Hybrid AI at Université Paris-Saclay. NLP and computer vision. Formerly a sound engineer in London.",
  intro: "I'm doing a master's in AI. Before that I spent four years working in sound in London.",
  email: "sashasuttons3@gmail.com",
  links: {
    github: "https://github.com/sashsutton",
    linkedin: "https://www.linkedin.com/in/sashasutton4",
    scholar: "https://scholar.google.com/citations?hl=en&user=6fiOkWgAAAAJ",
    soundcloud: "https://soundcloud.com/sasha-sutton-974644697",
    youtube: "https://www.youtube.com/watch?v=bTA1Srxxnmc&t=10s",
    cv: "/cv/sasha-sutton-cv.pdf",
  },
};

export type Project = {
  title: string;
  year: string;
  blurb: string;
  stack: string[];
  repo: string;
  demo?: string;
};

export type Publication = {
  title: string;
  venue: string;
  meta: string;
  blurb: string;
  url: string;
  urlLabel: string;
  repo?: string;
};

/** Newest first. Add a paper by adding an entry here. */
export const publications: Publication[] = [
  {
    // Published in French; the title is a citation, so it stays verbatim.
    title:
      "De la propagation avant à la rétropropagation : une analyse des mécanismes d'apprentissage dans les réseaux de neurones multicouches",
    venue: "HAL · 2026",
    meta: "S. Sutton · Aix-Marseille Université",
    blurb:
      "A walk through the mathematics of learning in multilayer networks, from Rosenblatt's perceptron to backpropagation. Written in French; my first published paper.",
    url: "https://hal.science/hal-05628568",
    urlLabel: "Read on HAL",
    repo: "https://github.com/sashsutton/MLP-article-en",
  },
];

export const projects: Project[] = [
  {
    title: "neural-network-numbers",
    year: "2026",
    blurb:
      "A neural network built from scratch that reads hand drawn digits, wired to a 3D visualisation. You draw a number and watch the activations move through the layers.",
    stack: ["TypeScript", "Python", "MNIST"],
    repo: "https://github.com/sashsutton/neural-network-numbers",
    demo: "https://neural-network-numbers.vercel.app",
  },
  {
    title: "air-harp",
    year: "2025",
    blurb:
      "An instrument you play in the air. MediaPipe tracks your fingertip through the webcam, virtual strings hang in the frame, and crossing one plucks it.",
    stack: ["Python", "MediaPipe", "OpenCV", "pygame"],
    repo: "https://github.com/sashsutton/computer_vision_air_harp",
  },
  {
    title: "ML_library",
    year: "2026",
    blurb:
      "A machine learning and matrix library in pure C. Matrix operations, activations, dense layers, forward propagation and MSE loss — nothing underneath but the language.",
    stack: ["C", "CMake", "no deps"],
    repo: "https://github.com/sashsutton/ML_library",
  },
  {
    title: "vector-search-engine",
    year: "2025",
    blurb:
      "A semantic search engine written from the linear algebra up. 384-dimensional BERT embeddings, normalised so retrieval is one matrix multiply, behind a FastAPI service.",
    stack: ["Python", "FastAPI", "BERT", "NumPy"],
    repo: "https://github.com/sashsutton/vector-search-engine",
    demo: "https://vector-search-engine-frontend.vercel.app/",
  },
  {
    title: "omni-analyst",
    year: "2026",
    blurb:
      "An agentic analyst on the Mistral SDK. It takes a question, searches the live web, writes and runs its own Python to chart what it finds, then writes the report.",
    stack: ["Python", "Mistral AI", "Pandas"],
    repo: "https://github.com/sashsutton/omni-analyst",
  },
];

export const about = {
  lead: "I get curious about something, take it apart, and end up studying it properly.",
  paragraphs: [
    "I was born in Udon Thani, in Thailand, and grew up between Laos, the French countryside, Senegal and Bordeaux. I live in Paris now.",
    "Music came first. Two years at Point Blank training as a sound engineer, two years on the sound team at Fabric, and a two-year accelerated degree at Middlesex. What kept nagging at me was that I knew how to use the tools and not how any of them worked.",
    "So I went back and studied maths and computer science to find out. Now I'm in the first year of a master's in Data, Knowledge and Hybrid AI at Paris-Saclay, working on NLP and computer vision. I still DJ and produce.",
  ],
  quote: "If I use something, I want to know why it works. Otherwise I'm just trusting it.",
};

export const science = [
  {
    years: "2026 — 27",
    place: "Université Paris-Saclay",
    title: "M1 — Data, Knowledge & Hybrid AI",
    url: "https://www.universite-paris-saclay.fr/en/education/masters-degree/computer-science/m1-data-knowledge-and-hybrid-artificial-intelligence-dkai",
  },
  {
    years: "2026 — 27",
    place: "Aix-Marseille Université",
    title: "BSc — Mathematics",
    url: "https://sciences.univ-amu.fr/fr/formation/licences/licence-mathematiques/parcours-mathematiques",
  },
  {
    years: "2023 — 26",
    place: "Aix-Marseille Université",
    title: "BSc — Mathematics & Computer Science",
    url: "https://sciences.univ-amu.fr/fr/formation/licences/licence-informatique/parcours-mathematiques-informatique",
  },
];

export const sound = [
  { years: "2 yrs", place: "Fabric London", title: "Sound-engineering team — live sound, every night" },
  { years: "2 yrs", place: "Point Blank", title: "Sound engineering training, DJing & production" },
  { years: "2021 — 23", place: "Middlesex University", title: "BA (Hons) Music Production & Sound Engineering" },
];

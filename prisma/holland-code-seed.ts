/**
 * Holland Code (RIASEC) Questions Seeding Script
 *
 * This script seeds the 155 career interest questions (based on Holland Code model)
 * into the database.
 *
 * Run with: npx tsx prisma/holland-code-seed.ts
 */

import { PrismaClient } from "@prisma/client";
import type { HollandQuestion } from "./holland-code-questions/interest-questions";

const prisma = new PrismaClient();

// Group A: Class 8th - 10th (30 Questions) - Interests and Hobbies
const GROUP_A_QUESTIONS: HollandQuestion[] = [
  { id: 1, text: "I like to build things with my hands (LEGO, models).", type: "R", classMin: 8, classMax: 10 },
  { id: 2, text: "I enjoy solving math puzzles and brain teasers.", type: "I", classMin: 8, classMax: 10 },
  { id: 3, text: "I love drawing, painting, or sketching in my free time.", type: "A", classMin: 8, classMax: 10 },
  { id: 4, text: "I like helping my friends with their personal problems.", type: "S", classMin: 8, classMax: 10 },
  { id: 5, text: "I enjoy leading a team in school sports or projects.", type: "E", classMin: 8, classMax: 10 },
  { id: 6, text: "I like keeping my school bags and notebooks organized.", type: "C", classMin: 8, classMax: 10 },
  { id: 7, text: "I am interested in learning how machines or engines work.", type: "R", classMin: 8, classMax: 10 },
  { id: 8, text: "I like to conduct small science experiments at home.", type: "I", classMin: 8, classMax: 10 },
  { id: 9, text: "I enjoy writing stories or poems.", type: "A", classMin: 8, classMax: 10 },
  { id: 10, text: "I like teaching others what I have learned.", type: "S", classMin: 8, classMax: 10 },
  { id: 11, text: "I am good at convincing people to see my point of view.", type: "E", classMin: 8, classMax: 10 },
  { id: 12, text: "I prefer following a daily routine for my studies.", type: "C", classMin: 8, classMax: 10 },
  { id: 13, text: "I like working outdoors rather than sitting in a classroom.", type: "R", classMin: 8, classMax: 10 },
  { id: 14, text: "I enjoy reading about space, nature, or technology.", type: "I", classMin: 8, classMax: 10 },
  { id: 15, text: "I love playing musical instruments or singing.", type: "A", classMin: 8, classMax: 10 },
  { id: 16, text: "I feel happy when I volunteer for social work.", type: "S", classMin: 8, classMax: 10 },
  { id: 17, text: "I like to start new clubs or activities in school.", type: "E", classMin: 8, classMax: 10 },
  { id: 18, text: "I enjoy collecting and sorting things (stamps, coins, cards).", type: "C", classMin: 8, classMax: 10 },
  { id: 19, text: "I like to fix broken toys or electrical items.", type: "R", classMin: 8, classMax: 10 },
  { id: 20, text: "I wonder why things happen the way they do in nature.", type: "I", classMin: 8, classMax: 10 },
  { id: 21, text: "I like to decorate my room with creative ideas.", type: "A", classMin: 8, classMax: 10 },
  { id: 22, text: "I am a good listener when people are upset.", type: "S", classMin: 8, classMax: 10 },
  { id: 23, text: "I like to be the 'captain' during group activities.", type: "E", classMin: 8, classMax: 10 },
  { id: 24, text: "I pay a lot of attention to details in my homework.", type: "C", classMin: 8, classMax: 10 },
  { id: 25, text: "I enjoy gardening or taking care of pets.", type: "R", classMin: 8, classMax: 10 },
  { id: 26, text: "I like to use a microscope or magnifying glass to see things.", type: "I", classMin: 8, classMax: 10 },
  { id: 27, text: "I enjoy acting in plays or performing on stage.", type: "A", classMin: 8, classMax: 10 },
  { id: 28, text: "I like to work in a team rather than alone.", type: "S", classMin: 8, classMax: 10 },
  { id: 29, text: "I enjoy selling things at school fests (stalls).", type: "E", classMin: 8, classMax: 10 },
  { id: 30, text: "I like to keep a record of my daily expenses or pocket money.", type: "C", classMin: 8, classMax: 10 },
];

// Group B: Class 11th - 12th (50 Questions) - Stream Alignment and Professional Inclination
const GROUP_B_QUESTIONS: HollandQuestion[] = [
  { id: 31, text: "I enjoy taking apart gadgets to see how they function.", type: "R", classMin: 11, classMax: 12 },
  { id: 32, text: "I like analyzing data or graphs to find a pattern.", type: "I", classMin: 11, classMax: 12 },
  { id: 33, text: "I prefer expressing myself through art, music, or design.", type: "A", classMin: 11, classMax: 12 },
  { id: 34, text: "I want a career where I can help people improve their lives.", type: "S", classMin: 11, classMax: 12 },
  { id: 35, text: "I am interested in starting my own business one day.", type: "E", classMin: 11, classMax: 12 },
  { id: 36, text: "I am very comfortable working with spreadsheets and tables.", type: "C", classMin: 11, classMax: 12 },
  { id: 37, text: "I like working with tools and heavy machinery.", type: "R", classMin: 11, classMax: 12 },
  { id: 38, text: "I enjoy researching topics in depth before making a decision.", type: "I", classMin: 11, classMax: 12 },
  { id: 39, text: "I like to create unique digital art or graphics.", type: "A", classMin: 11, classMax: 12 },
  { id: 40, text: "I am interested in studying psychology or human behavior.", type: "S", classMin: 11, classMax: 12 },
  { id: 41, text: "I enjoy debating and public speaking.", type: "E", classMin: 11, classMax: 12 },
  { id: 42, text: "I like to keep my computer files neatly categorized.", type: "C", classMin: 11, classMax: 12 },
  { id: 43, text: "I prefer hands-on technical work over office desk jobs.", type: "R", classMin: 11, classMax: 12 },
  { id: 44, text: "I am fascinated by how biological systems work.", type: "I", classMin: 11, classMax: 12 },
  { id: 45, text: "I like to experiment with new fashion or interior styles.", type: "A", classMin: 11, classMax: 12 },
  { id: 46, text: "I enjoy participating in community service or charity events.", type: "S", classMin: 11, classMax: 12 },
  { id: 47, text: "I like to take risks if there is a chance of big success.", type: "E", classMin: 11, classMax: 12 },
  { id: 48, text: "I am good at checking documents for errors.", type: "C", classMin: 11, classMax: 12 },
  { id: 49, text: "I enjoy outdoor activities like farming or construction.", type: "R", classMin: 11, classMax: 12 },
  { id: 50, text: "I like to solve complex chemistry or physics problems.", type: "I", classMin: 11, classMax: 12 },
  { id: 51, text: "I love photography and capturing creative shots.", type: "A", classMin: 11, classMax: 12 },
  { id: 52, text: "I find it easy to talk to strangers and make them feel comfortable.", type: "S", classMin: 11, classMax: 12 },
  { id: 53, text: "I enjoy managing people to achieve a common goal.", type: "E", classMin: 11, classMax: 12 },
  { id: 54, text: "I prefer clear instructions and a fixed set of rules at work.", type: "C", classMin: 11, classMax: 12 },
  { id: 55, text: "I would like to work as an engineer or a technician.", type: "R", classMin: 11, classMax: 12 },
  { id: 56, text: "I spend a lot of time reading scientific journals or tech news.", type: "I", classMin: 11, classMax: 12 },
  { id: 57, text: "I am interested in filmmaking or video editing.", type: "A", classMin: 11, classMax: 12 },
  { id: 58, text: "I would like to be a teacher, counselor, or nurse.", type: "S", classMin: 11, classMax: 12 },
  { id: 59, text: "I am interested in marketing and sales strategies.", type: "E", classMin: 11, classMax: 12 },
  { id: 60, text: "I like managing office records and databases.", type: "C", classMin: 11, classMax: 12 },
  { id: 61, text: "I enjoy repairing bikes, cars, or computers.", type: "R", classMin: 11, classMax: 12 },
  { id: 62, text: "I like to investigate 'why' something isn't working logically.", type: "I", classMin: 11, classMax: 12 },
  { id: 63, text: "I love visiting art galleries and museums.", type: "A", classMin: 11, classMax: 12 },
  { id: 64, text: "I feel responsible for the well-being of my friends.", type: "S", classMin: 11, classMax: 12 },
  { id: 65, text: "I enjoy pitching ideas to an audience.", type: "E", classMin: 11, classMax: 12 },
  { id: 66, text: "I am very methodical when it comes to planning my day.", type: "C", classMin: 11, classMax: 12 },
  { id: 67, text: "I prefer working in a workshop or laboratory.", type: "R", classMin: 11, classMax: 12 },
  { id: 68, text: "I like to perform laboratory experiments.", type: "I", classMin: 11, classMax: 12 },
  { id: 69, text: "I am interested in copywriting or creative writing.", type: "A", classMin: 11, classMax: 12 },
  { id: 70, text: "I like to help people develop their skills.", type: "S", classMin: 11, classMax: 12 },
  { id: 71, text: "I want to be in a position of power and leadership.", type: "E", classMin: 11, classMax: 12 },
  { id: 72, text: "I like to maintain a budget for my projects.", type: "C", classMin: 11, classMax: 12 },
  { id: 73, text: "I am interested in learning about sustainable architecture.", type: "R", classMin: 11, classMax: 12 },
  { id: 74, text: "I like to analyze social or economic trends.", type: "I", classMin: 11, classMax: 12 },
  { id: 75, text: "I enjoy designing websites or mobile app layouts.", type: "A", classMin: 11, classMax: 12 },
  { id: 76, text: "I would enjoy working for a non-profit organization (NGO).", type: "S", classMin: 11, classMax: 12 },
  { id: 77, text: "I am interested in law or political leadership.", type: "E", classMin: 11, classMax: 12 },
  { id: 78, text: "I like keeping a systematic record of everything I do.", type: "C", classMin: 11, classMax: 12 },
  { id: 79, text: "I enjoy physical work that produces a tangible result.", type: "R", classMin: 11, classMax: 12 },
  { id: 80, text: "I like to use logic to solve every-day problems.", type: "I", classMin: 11, classMax: 12 },
];

// Group C: College & Graduates (75 Questions) - Professional Fit and Specialized Roles
const GROUP_C_QUESTIONS: HollandQuestion[] = [
  { id: 81, text: "I am comfortable working with high-tech equipment in a factory setting.", type: "R", classMin: 13, classMax: 100 },
  { id: 82, text: "I enjoy performing statistical analysis to predict future outcomes.", type: "I", classMin: 13, classMax: 100 },
  { id: 83, text: "I prefer a job that allows for maximum creative freedom.", type: "A", classMin: 13, classMax: 100 },
  { id: 84, text: "I find professional satisfaction in mentoring juniors.", type: "S", classMin: 13, classMax: 100 },
  { id: 85, text: "I am motivated by financial rewards and business growth.", type: "E", classMin: 13, classMax: 100 },
  { id: 86, text: "I enjoy auditing financial statements for accuracy.", type: "C", classMin: 13, classMax: 100 },
  { id: 87, text: "I prefer working in the field (on-site) rather than in a corporate office.", type: "R", classMin: 13, classMax: 100 },
  { id: 88, text: "I would like to work in a Research and Development (R&D) department.", type: "I", classMin: 13, classMax: 100 },
  { id: 89, text: "I enjoy conceptualizing visual identities for brands.", type: "A", classMin: 13, classMax: 100 },
  { id: 90, text: "I am interested in healthcare or social welfare professions.", type: "S", classMin: 13, classMax: 100 },
  { id: 91, text: "I am confident in negotiating contracts with clients.", type: "E", classMin: 13, classMax: 100 },
  { id: 92, text: "I enjoy optimizing administrative workflows for efficiency.", type: "C", classMin: 13, classMax: 100 },
  { id: 93, text: "I like operating heavy machinery or specialized tools.", type: "R", classMin: 13, classMax: 100 },
  { id: 94, text: "I am interested in data science and machine learning.", type: "I", classMin: 13, classMax: 100 },
  { id: 95, text: "I love the challenge of designing a user experience (UX) from scratch.", type: "A", classMin: 13, classMax: 100 },
  { id: 96, text: "I enjoy training others on how to use new software or tools.", type: "S", classMin: 13, classMax: 100 },
  { id: 97, text: "I like to develop marketing strategies to beat competitors.", type: "E", classMin: 13, classMax: 100 },
  { id: 98, text: "I am comfortable managing large databases or archives.", type: "C", classMin: 13, classMax: 100 },
  { id: 99, text: "I enjoy hands-on work like electrical wiring or hardware assembly.", type: "R", classMin: 13, classMax: 100 },
  { id: 100, text: "I like to write white papers or technical reports based on research.", type: "I", classMin: 13, classMax: 100 },
  { id: 101, text: "I enjoy creating motion graphics or 3D animations.", type: "A", classMin: 13, classMax: 100 },
  { id: 102, text: "I would like to work as a HR manager or a mediator.", type: "S", classMin: 13, classMax: 100 },
  { id: 103, text: "I enjoy presenting business pitches to potential investors.", type: "E", classMin: 13, classMax: 100 },
  { id: 104, text: "I prefer a job where the duties are clearly defined and structured.", type: "C", classMin: 13, classMax: 100 },
  { id: 105, text: "I like working with specialized software like AutoCAD or SolidWorks.", type: "R", classMin: 13, classMax: 100 },
  { id: 106, text: "I am interested in solving environmental issues through science.", type: "I", classMin: 13, classMax: 100 },
  { id: 107, text: "I love writing scripts for films, advertisements, or plays.", type: "A", classMin: 13, classMax: 100 },
  { id: 108, text: "I am motivated by the idea of making a social impact.", type: "S", classMin: 13, classMax: 100 },
  { id: 109, text: "I enjoy supervising a team to meet tight deadlines.", type: "E", classMin: 13, classMax: 100 },
  { id: 110, text: "I like to perform quality control checks on products or services.", type: "C", classMin: 13, classMax: 100 },
  { id: 111, text: "I would enjoy a job that involves traveling to remote sites.", type: "R", classMin: 13, classMax: 100 },
  { id: 112, text: "I like to study market trends using complex algorithms.", type: "I", classMin: 13, classMax: 100 },
  { id: 113, text: "I enjoy experimenting with different lighting and camera angles.", type: "A", classMin: 13, classMax: 100 },
  { id: 114, text: "I like to help people navigate their career paths (Counseling).", type: "S", classMin: 13, classMax: 100 },
  { id: 115, text: "I am interested in international trade and global business.", type: "E", classMin: 13, classMax: 100 },
  { id: 116, text: "I enjoy organizing events down to the last logistical detail.", type: "C", classMin: 13, classMax: 100 },
  { id: 117, text: "I like to maintain and repair mechanical equipment.", type: "R", classMin: 13, classMax: 100 },
  { id: 118, text: "I enjoy diagnosing problems in a system using logic.", type: "I", classMin: 13, classMax: 100 },
  { id: 119, text: "I am interested in UI design for web and mobile platforms.", type: "A", classMin: 13, classMax: 100 },
  { id: 120, text: "I find it fulfilling to work in a hospital or healthcare setting.", type: "S", classMin: 13, classMax: 100 },
  { id: 121, text: "I enjoy the challenge of convincing a client to sign a deal.", type: "E", classMin: 13, classMax: 100 },
  { id: 122, text: "I like to manage payroll and financial records for a company.", type: "C", classMin: 13, classMax: 100 },
  { id: 123, text: "I would like to work in construction or civil engineering projects.", type: "R", classMin: 13, classMax: 100 },
  { id: 124, text: "I enjoy reading academic papers on new technology.", type: "I", classMin: 13, classMax: 100 },
  { id: 125, text: "I like to design layouts for magazines or digital publications.", type: "A", classMin: 13, classMax: 100 },
  { id: 126, text: "I would enjoy working as a speech therapist or social worker.", type: "S", classMin: 13, classMax: 100 },
  { id: 127, text: "I am interested in political campaigning or public relations.", type: "E", classMin: 13, classMax: 100 },
  { id: 128, text: "I am very careful about following legal and compliance guidelines.", type: "C", classMin: 13, classMax: 100 },
  { id: 129, text: "I enjoy physical labor that involves precision and skill.", type: "R", classMin: 13, classMax: 100 },
  { id: 130, text: "I like to figure out the 'Root Cause' of a failure.", type: "I", classMin: 13, classMax: 100 },
  { id: 131, text: "I enjoy creating sound effects or music for digital media.", type: "A", classMin: 13, classMax: 100 },
  { id: 132, text: "I like to coordinate volunteer programs for a community.", type: "S", classMin: 13, classMax: 100 },
  { id: 133, text: "I enjoy taking the lead in a crisis situation.", type: "E", classMin: 13, classMax: 100 },
  { id: 134, text: "I like to use a system to file and retrieve information quickly.", type: "C", classMin: 13, classMax: 100 },
  { id: 135, text: "I would like to work with renewable energy systems (Solar/Wind).", type: "R", classMin: 13, classMax: 100 },
  { id: 136, text: "I am interested in exploring theories about the universe.", type: "I", classMin: 13, classMax: 100 },
  { id: 137, text: "I enjoy coming up with creative 'out-of-the-box' solutions.", type: "A", classMin: 13, classMax: 100 },
  { id: 138, text: "I like to help people solve their interpersonal conflicts.", type: "S", classMin: 13, classMax: 100 },
  { id: 139, text: "I would enjoy working as a real estate developer.", type: "E", classMin: 13, classMax: 100 },
  { id: 140, text: "I prefer working with numbers and hard data over abstract ideas.", type: "C", classMin: 13, classMax: 100 },
  { id: 141, text: "I like to work with landscape design or large-scale farming.", type: "R", classMin: 13, classMax: 100 },
  { id: 142, text: "I enjoy analyzing the chemical composition of substances.", type: "I", classMin: 13, classMax: 100 },
  { id: 143, text: "I like to storyboard ideas for visual storytelling.", type: "A", classMin: 13, classMax: 100 },
  { id: 144, text: "I would enjoy being a teacher or a corporate trainer.", type: "S", classMin: 13, classMax: 100 },
  { id: 145, text: "I enjoy managing a retail store or a sales team.", type: "E", classMin: 13, classMax: 100 },
  { id: 146, text: "I like to prepare detailed financial reports and balance sheets.", type: "C", classMin: 13, classMax: 100 },
  { id: 147, text: "I am interested in aviation and working with aircraft.", type: "R", classMin: 13, classMax: 100 },
  { id: 148, text: "I like to conduct surveys and analyze the social data.", type: "I", classMin: 13, classMax: 100 },
  { id: 149, text: "I enjoy creating prototypes for new products.", type: "A", classMin: 13, classMax: 100 },
  { id: 150, text: "I find it easy to empathize with people from different backgrounds.", type: "S", classMin: 13, classMax: 100 },
  { id: 151, text: "I would enjoy working as an executive in a large corporation.", type: "E", classMin: 13, classMax: 100 },
  { id: 152, text: "I like to ensure that all business operations follow the SOPs.", type: "C", classMin: 13, classMax: 100 },
  { id: 153, text: "I enjoy working in a workshop environment with diverse tools.", type: "R", classMin: 13, classMax: 100 },
  { id: 154, text: "I like to explore the history and evolution of ideas.", type: "I", classMin: 13, classMax: 100 },
  { id: 155, text: "I enjoy the process of branding and visual communication.", type: "A", classMin: 13, classMax: 100 },
];

// All Holland Code Questions
const HOLLAND_CODE_QUESTIONS = [
  ...GROUP_A_QUESTIONS,
  ...GROUP_B_QUESTIONS,
  ...GROUP_C_QUESTIONS,
];

// Helper function to get questions for a specific class level
function getQuestionsForClassLevel(classLevel: number): HollandQuestion[] {
  return HOLLAND_CODE_QUESTIONS.filter(
    (q) => q.classMin <= classLevel && q.classMax >= classLevel
  );
}

// Helper function to get questions by type (RIASEC)
function getQuestionsByType(type: "R" | "I" | "A" | "S" | "E" | "C"): HollandQuestion[] {
  return HOLLAND_CODE_QUESTIONS.filter((q) => q.type === type);
}

// Holland Code descriptions
const HOLLAND_CODES = {
  R: {
    code: "R",
    title: "Realistic",
    description: "Practical, hands-on, mechanical, and outdoor work. Prefers working with objects, tools, machines, and animals rather than people.",
    keywords: ["hands-on", "mechanical", "outdoor", "practical", "tangible", "physical"],
    typicalCareers: [
      "Engineer", "Technician", "Mechanic", "Architect", "Farmer",
      "Construction Worker", "Electrician", "Plumber", "Pilot", "Tradesperson",
      "Wildlife Biologist", "Geologist", "Carpenter"
    ]
  },
  I: {
    code: "I",
    title: "Investigative",
    description: "Analytical, scientific, and research-oriented. Enjoys solving problems, investigating mysteries, and working with ideas and concepts.",
    keywords: ["analytical", "scientific", "research", "technical", "logical", "curious"],
    typicalCareers: [
      "Scientist", "Researcher", "Data Analyst", "Engineer", "Mathematician",
      "Software Developer", "Physicist", "Chemist", "Biologist", "Academic",
      "Laboratory Technician", "Data Scientist", "AI/ML Engineer"
    ]
  },
  A: {
    code: "A",
    title: "Artistic",
    description: "Creative, expressive, and design-focused. Prefers unstructured work that allows for self-expression through art, music, writing, or design.",
    keywords: ["creative", "expressive", "design", "original", "imagination", "visual"],
    typicalCareers: [
      "Artist", "Designer", "Writer", "Musician", "Actor",
      "Photographer", "Architect", "Graphic Designer", "Film Director", "Fashion Designer",
      "Creative Director", "UI/UX Designer", "Copywriter", "Journalist"
    ]
  },
  S: {
    code: "S",
    title: "Social",
    description: "Helping, teaching, and serving others. Enjoys working with people to inform, train, heal, or lead them.",
    keywords: ["helping", "teaching", "serving", "empathetic", "communicative", "caring"],
    typicalCareers: [
      "Teacher", "Counselor", "Nurse", "Social Worker", "Psychologist",
      "Doctor", "HR Manager", "Trainer", "Librarian", "Non-profit Manager",
      "Speech Therapist", "Community Organizer", "Educator"
    ]
  },
  E: {
    code: "E",
    title: "Enterprising",
    description: "Leadership, business, and influencing others. Enjoys leading, selling, persuading, and achieving organizational goals.",
    keywords: ["leadership", "business", "influencing", "competitive", "ambitious", "strategic"],
    typicalCareers: [
      "Business Owner", "Manager", "Entrepreneur", "Sales Manager", "Marketer",
      "Executive", "Politician", "Real Estate Developer", "Consultant", "Lawyer",
      "Investor", "HR Director", "CEO"
    ]
  },
  C: {
    code: "C",
    title: "Conventional",
    description: "Organized, detail-oriented, and structured tasks. Prefers working with data, numbers, and systems following established procedures.",
    keywords: ["organized", "detail-oriented", "structured", "accurate", "systematic", "efficient"],
    typicalCareers: [
      "Accountant", "Auditor", "Administrator", "Analyst", "Finance Manager",
      "Office Manager", "Archivist", "Compliance Officer", "Financial Analyst", "Data Clerk",
      "Operations Manager", "Executive Assistant", "Records Manager"
    ]
  }
};

// Career Clusters mapped to Holland Codes
const CLUSTER_HOLLAND_CODE_MAPPING: Record<string, string[]> = {
  "Engineering": ["R", "I"],
  "Medical & Healthcare": ["S", "I"],
  "Business & Commerce": ["E", "C"],
  "Arts & Humanities": ["A", "S"],
  "Law & Legal": ["E", "C"],
  "Education & Teaching": ["S", "E"],
  "Government & Civil Services": ["C", "S"],
  "Defence & Security": ["R", "E"],
  "Technology & IT": ["I", "C"],
  "Science & Research": ["I", "R"]
};

async function seedHollandCodeQuestions() {
  console.log("🚀 Seeding Holland Code (RIASEC) questions...");

  let created = 0;
  let skipped = 0;

  // Get all career clusters from database
  const clusters = await prisma.careerCluster.findMany({ where: { isActive: true } });
  const clusterMap = Object.fromEntries(clusters.map(c => [c.name, c]));

  console.log(`Found ${clusters.length} career clusters:`);
  clusters.forEach(c => console.log(`  - ${c.name}`));

  for (const q of HOLLAND_CODE_QUESTIONS) {
    // Check if question already exists
    const existing = await prisma.question.findFirst({
      where: {
        text: q.text,
        hollandCode: q.type,
        classMin: q.classMin,
        classMax: q.classMax,
      },
    });

    if (existing) {
      skipped++;
      console.log(`  ⚠️  Skipping existing question: "${q.text.substring(0, 40)}..."`);
      continue;
    }

    // Get cluster IDs for Holland code mapping
    const clustersWithCode = clusters.filter(cluster => {
      const codes = CLUSTER_HOLLAND_CODE_MAPPING[cluster.name] || [];
      return codes.includes(q.type);
    });

    // Determine question type based on Holland code
    let questionType: "REALISTIC" | "INVESTIGATIVE" | "ARTISTIC" | "SOCIAL" | "ENTERPRISING" | "CONVENTIONAL";

    switch (q.type) {
      case "R": questionType = "REALISTIC"; break;
      case "I": questionType = "INVESTIGATIVE"; break;
      case "A": questionType = "ARTISTIC"; break;
      case "S": questionType = "SOCIAL"; break;
      case "E": questionType = "ENTERPRISING"; break;
      case "C": questionType = "CONVENTIONAL"; break;
    }

    // Create the question with options
    const question = await prisma.question.create({
      data: {
        text: q.text,
        type: "INTEREST",
        hollandCode: q.type,
        classMin: q.classMin,
        classMax: q.classMax,
        forAssessment: "CLUSTER",
        sortOrder: q.id,
        isActive: true,
        options: {
          create: [
          {
            text: "Yes, I strongly agree",
            sortOrder: 1,
            weights: {
              create: clusters.map(cluster => ({
                clusterId: cluster.id,
                weight: clustersWithCode.some(c => c.name === cluster.name) ? 3 : 0
              }))
            }
          },
          {
            text: "Yes, I somewhat agree",
            sortOrder: 2,
            weights: {
              create: clusters.map(cluster => ({
                clusterId: cluster.id,
                weight: clustersWithCode.some(c => c.name === cluster.name) ? 2 : 0
              }))
            }
          },
          {
            text: "No, I somewhat disagree",
            sortOrder: 3,
            weights: {
              create: clusters.map(cluster => ({
                clusterId: cluster.id,
                weight: 1 // Small weight for any agreement
              }))
            }
          },
          {
            text: "No, I strongly disagree",
            sortOrder: 4,
            weights: {
              create: clusters.map(cluster => ({
                clusterId: cluster.id,
                weight: 0
              }))
            }
          },
          ],
        },
      },
    });

    created++;
    console.log(`  ✅ Created [${q.type}] "${question.text.substring(0, 40)}..." (ID: ${question.id})`);
  }

  console.log(`\n✅ Seeding complete: ${created} created, ${skipped} skipped`);
  console.log(`\n📊 Question breakdown by type:`);
  console.log(`   R (Realistic): ${getQuestionsByType("R").length}`);
  console.log(`   I (Investigative): ${getQuestionsByType("I").length}`);
  console.log(`   A (Artistic): ${getQuestionsByType("A").length}`);
  console.log(`   S (Social): ${getQuestionsByType("S").length}`);
  console.log(`   E (Enterprising): ${getQuestionsByType("E").length}`);
  console.log(`   C (Conventional): ${getQuestionsByType("C").length}`);
}

// Run the seeding
seedHollandCodeQuestions()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error("❌ Error seeding questions:", e);
    await prisma.$disconnect();
    process.exit(1);
  });

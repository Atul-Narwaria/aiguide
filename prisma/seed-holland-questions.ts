/**
 * Seed script: drops ALL existing questions and replaces them with the
 * Holland-Code (RIASEC) questions from Questions.docx.
 *
 * Groups:
 *   A – Class 8–10 interest questions  (classMin=6,  classMax=10)
 *   B – Class 11–12 career questions   (classMin=11, classMax=12)
 *   C – College/grad professional qs   (classMin=11, classMax=12)
 *
 * Run: npx tsx prisma/seed-holland-questions.ts
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Standard 4-option agreement scale (scoring uses question hollandCode, not the option)
const AGREE_OPTIONS = [
  { text: "Yes, absolutely!", sortOrder: 0 },
  { text: "Mostly yes", sortOrder: 1 },
  { text: "Not really", sortOrder: 2 },
  { text: "No, not for me", sortOrder: 3 },
];

interface RawQ {
  text: string;
  code: "R" | "I" | "A" | "S" | "E" | "C";
  classMin: number;
  classMax: number;
}

// ─────────────────────────────────────────────────────────────────
// GROUP A: Class 8–10  (30 questions)
// ─────────────────────────────────────────────────────────────────
const GROUP_A: RawQ[] = [
  { text: "I like to build things with my hands (LEGO, models).", code: "R", classMin: 6, classMax: 10 },
  { text: "I enjoy solving math puzzles and brain teasers.", code: "I", classMin: 6, classMax: 10 },
  { text: "I love drawing, painting, or sketching in my free time.", code: "A", classMin: 6, classMax: 10 },
  { text: "I like helping my friends with their personal problems.", code: "S", classMin: 6, classMax: 10 },
  { text: "I enjoy leading a team in school sports or projects.", code: "E", classMin: 6, classMax: 10 },
  { text: "I like keeping my school bags and notebooks organized.", code: "C", classMin: 6, classMax: 10 },
  { text: "I am interested in learning how machines or engines work.", code: "R", classMin: 6, classMax: 10 },
  { text: "I like to conduct small science experiments at home.", code: "I", classMin: 6, classMax: 10 },
  { text: "I enjoy writing stories or poems.", code: "A", classMin: 6, classMax: 10 },
  { text: "I like teaching others what I have learned.", code: "S", classMin: 6, classMax: 10 },
  { text: "I am good at convincing people to see my point of view.", code: "E", classMin: 6, classMax: 10 },
  { text: "I prefer following a daily routine for my studies.", code: "C", classMin: 6, classMax: 10 },
  { text: "I like working outdoors rather than sitting in a classroom.", code: "R", classMin: 6, classMax: 10 },
  { text: "I enjoy reading about space, nature, or technology.", code: "I", classMin: 6, classMax: 10 },
  { text: "I love playing musical instruments or singing.", code: "A", classMin: 6, classMax: 10 },
  { text: "I feel happy when I volunteer for social work.", code: "S", classMin: 6, classMax: 10 },
  { text: "I like to start new clubs or activities in school.", code: "E", classMin: 6, classMax: 10 },
  { text: "I enjoy collecting and sorting things (stamps, coins, cards).", code: "C", classMin: 6, classMax: 10 },
  { text: "I like to fix broken toys or electrical items.", code: "R", classMin: 6, classMax: 10 },
  { text: "I wonder why things happen the way they do in nature.", code: "I", classMin: 6, classMax: 10 },
  { text: "I like to decorate my room with creative ideas.", code: "A", classMin: 6, classMax: 10 },
  { text: "I am a good listener when people are upset.", code: "S", classMin: 6, classMax: 10 },
  { text: 'I like to be the "captain" during group activities.', code: "E", classMin: 6, classMax: 10 },
  { text: "I pay a lot of attention to details in my homework.", code: "C", classMin: 6, classMax: 10 },
  { text: "I enjoy gardening or taking care of pets.", code: "R", classMin: 6, classMax: 10 },
  { text: "I like to use a microscope or magnifying glass to see things.", code: "I", classMin: 6, classMax: 10 },
  { text: "I enjoy acting in plays or performing on stage.", code: "A", classMin: 6, classMax: 10 },
  { text: "I like to work in a team rather than alone.", code: "S", classMin: 6, classMax: 10 },
  { text: "I enjoy selling things at school fests (stalls).", code: "E", classMin: 6, classMax: 10 },
  { text: "I like to keep a record of my daily expenses or pocket money.", code: "C", classMin: 6, classMax: 10 },
];

// ─────────────────────────────────────────────────────────────────
// GROUP B: Class 11–12  (50 questions)
// ─────────────────────────────────────────────────────────────────
const GROUP_B: RawQ[] = [
  { text: "I enjoy taking apart gadgets to see how they function.", code: "R", classMin: 11, classMax: 12 },
  { text: "I like analyzing data or graphs to find a pattern.", code: "I", classMin: 11, classMax: 12 },
  { text: "I prefer expressing myself through art, music, or design.", code: "A", classMin: 11, classMax: 12 },
  { text: "I want a career where I can help people improve their lives.", code: "S", classMin: 11, classMax: 12 },
  { text: "I am interested in starting my own business one day.", code: "E", classMin: 11, classMax: 12 },
  { text: "I am very comfortable working with spreadsheets and tables.", code: "C", classMin: 11, classMax: 12 },
  { text: "I like working with tools and heavy machinery.", code: "R", classMin: 11, classMax: 12 },
  { text: "I enjoy researching topics in depth before making a decision.", code: "I", classMin: 11, classMax: 12 },
  { text: "I like to create unique digital art or graphics.", code: "A", classMin: 11, classMax: 12 },
  { text: "I am interested in studying psychology or human behavior.", code: "S", classMin: 11, classMax: 12 },
  { text: "I enjoy debating and public speaking.", code: "E", classMin: 11, classMax: 12 },
  { text: "I like to keep my computer files neatly categorized.", code: "C", classMin: 11, classMax: 12 },
  { text: "I prefer hands-on technical work over office desk jobs.", code: "R", classMin: 11, classMax: 12 },
  { text: "I am fascinated by how biological systems work.", code: "I", classMin: 11, classMax: 12 },
  { text: "I like to experiment with new fashion or interior styles.", code: "A", classMin: 11, classMax: 12 },
  { text: "I enjoy participating in community service or charity events.", code: "S", classMin: 11, classMax: 12 },
  { text: "I like to take risks if there is a chance of big success.", code: "E", classMin: 11, classMax: 12 },
  { text: "I am good at checking documents for errors.", code: "C", classMin: 11, classMax: 12 },
  { text: "I enjoy outdoor activities like farming or construction.", code: "R", classMin: 11, classMax: 12 },
  { text: "I like to solve complex chemistry or physics problems.", code: "I", classMin: 11, classMax: 12 },
  { text: "I love photography and capturing creative shots.", code: "A", classMin: 11, classMax: 12 },
  { text: "I find it easy to talk to strangers and make them feel comfortable.", code: "S", classMin: 11, classMax: 12 },
  { text: "I enjoy managing people to achieve a common goal.", code: "E", classMin: 11, classMax: 12 },
  { text: "I prefer clear instructions and a fixed set of rules at work.", code: "C", classMin: 11, classMax: 12 },
  { text: "I would like to work as an engineer or a technician.", code: "R", classMin: 11, classMax: 12 },
  { text: "I spend a lot of time reading scientific journals or tech news.", code: "I", classMin: 11, classMax: 12 },
  { text: "I am interested in filmmaking or video editing.", code: "A", classMin: 11, classMax: 12 },
  { text: "I would like to be a teacher, counselor, or nurse.", code: "S", classMin: 11, classMax: 12 },
  { text: "I am interested in marketing and sales strategies.", code: "E", classMin: 11, classMax: 12 },
  { text: "I like managing office records and databases.", code: "C", classMin: 11, classMax: 12 },
  { text: "I enjoy repairing bikes, cars, or computers.", code: "R", classMin: 11, classMax: 12 },
  { text: 'I like to investigate "why" something isn\'t working logically.', code: "I", classMin: 11, classMax: 12 },
  { text: "I love visiting art galleries and museums.", code: "A", classMin: 11, classMax: 12 },
  { text: "I feel responsible for the well-being of my friends.", code: "S", classMin: 11, classMax: 12 },
  { text: "I enjoy pitching ideas to an audience.", code: "E", classMin: 11, classMax: 12 },
  { text: "I am very methodical when it comes to planning my day.", code: "C", classMin: 11, classMax: 12 },
  { text: "I prefer working in a workshop or laboratory.", code: "R", classMin: 11, classMax: 12 },
  { text: "I like to perform laboratory experiments.", code: "I", classMin: 11, classMax: 12 },
  { text: "I am interested in copywriting or creative writing.", code: "A", classMin: 11, classMax: 12 },
  { text: "I like to help people develop their skills.", code: "S", classMin: 11, classMax: 12 },
  { text: "I want to be in a position of power and leadership.", code: "E", classMin: 11, classMax: 12 },
  { text: "I like to maintain a budget for my projects.", code: "C", classMin: 11, classMax: 12 },
  { text: "I am interested in learning about sustainable architecture.", code: "R", classMin: 11, classMax: 12 },
  { text: "I like to analyze social or economic trends.", code: "I", classMin: 11, classMax: 12 },
  { text: "I enjoy designing websites or mobile app layouts.", code: "A", classMin: 11, classMax: 12 },
  { text: "I would enjoy working for a non-profit organization (NGO).", code: "S", classMin: 11, classMax: 12 },
  { text: "I am interested in law or political leadership.", code: "E", classMin: 11, classMax: 12 },
  { text: "I like keeping a systematic record of everything I do.", code: "C", classMin: 11, classMax: 12 },
  { text: "I enjoy physical work that produces a tangible result.", code: "R", classMin: 11, classMax: 12 },
  { text: "I like to use logic to solve every-day problems.", code: "I", classMin: 11, classMax: 12 },
];

// ─────────────────────────────────────────────────────────────────
// GROUP C: College & Graduates mapped to Class 11–12  (75 questions)
// ─────────────────────────────────────────────────────────────────
const GROUP_C: RawQ[] = [
  { text: "I am comfortable working with high-tech equipment in a factory setting.", code: "R", classMin: 11, classMax: 12 },
  { text: "I enjoy performing statistical analysis to predict future outcomes.", code: "I", classMin: 11, classMax: 12 },
  { text: "I prefer a job that allows for maximum creative freedom.", code: "A", classMin: 11, classMax: 12 },
  { text: "I find professional satisfaction in mentoring juniors.", code: "S", classMin: 11, classMax: 12 },
  { text: "I am motivated by financial rewards and business growth.", code: "E", classMin: 11, classMax: 12 },
  { text: "I enjoy auditing financial statements for accuracy.", code: "C", classMin: 11, classMax: 12 },
  { text: "I prefer working in the field (on-site) rather than in a corporate office.", code: "R", classMin: 11, classMax: 12 },
  { text: "I would like to work in a Research and Development (R&D) department.", code: "I", classMin: 11, classMax: 12 },
  { text: "I enjoy conceptualizing visual identities for brands.", code: "A", classMin: 11, classMax: 12 },
  { text: "I am interested in healthcare or social welfare professions.", code: "S", classMin: 11, classMax: 12 },
  { text: "I am confident in negotiating contracts with clients.", code: "E", classMin: 11, classMax: 12 },
  { text: "I enjoy optimizing administrative workflows for efficiency.", code: "C", classMin: 11, classMax: 12 },
  { text: "I like operating heavy machinery or specialized tools.", code: "R", classMin: 11, classMax: 12 },
  { text: "I am interested in data science and machine learning.", code: "I", classMin: 11, classMax: 12 },
  { text: "I love the challenge of designing a user experience (UX) from scratch.", code: "A", classMin: 11, classMax: 12 },
  { text: "I enjoy training others on how to use new software or tools.", code: "S", classMin: 11, classMax: 12 },
  { text: "I like to develop marketing strategies to beat competitors.", code: "E", classMin: 11, classMax: 12 },
  { text: "I am comfortable managing large databases or archives.", code: "C", classMin: 11, classMax: 12 },
  { text: "I enjoy hands-on work like electrical wiring or hardware assembly.", code: "R", classMin: 11, classMax: 12 },
  { text: "I like to write white papers or technical reports based on research.", code: "I", classMin: 11, classMax: 12 },
  { text: "I enjoy creating motion graphics or 3D animations.", code: "A", classMin: 11, classMax: 12 },
  { text: "I would like to work as a HR manager or a mediator.", code: "S", classMin: 11, classMax: 12 },
  { text: "I enjoy presenting business pitches to potential investors.", code: "E", classMin: 11, classMax: 12 },
  { text: "I prefer a job where the duties are clearly defined and structured.", code: "C", classMin: 11, classMax: 12 },
  { text: "I like working with specialized software like AutoCAD or SolidWorks.", code: "R", classMin: 11, classMax: 12 },
  { text: "I am interested in solving environmental issues through science.", code: "I", classMin: 11, classMax: 12 },
  { text: "I love writing scripts for films, advertisements, or plays.", code: "A", classMin: 11, classMax: 12 },
  { text: "I am motivated by the idea of making a social impact.", code: "S", classMin: 11, classMax: 12 },
  { text: "I enjoy supervising a team to meet tight deadlines.", code: "E", classMin: 11, classMax: 12 },
  { text: "I like to perform quality control checks on products or services.", code: "C", classMin: 11, classMax: 12 },
  { text: "I would enjoy a job that involves traveling to remote sites.", code: "R", classMin: 11, classMax: 12 },
  { text: "I like to study market trends using complex algorithms.", code: "I", classMin: 11, classMax: 12 },
  { text: "I enjoy experimenting with different lighting and camera angles.", code: "A", classMin: 11, classMax: 12 },
  { text: "I like to help people navigate their career paths (Counseling).", code: "S", classMin: 11, classMax: 12 },
  { text: "I am interested in international trade and global business.", code: "E", classMin: 11, classMax: 12 },
  { text: "I enjoy organizing events down to the last logistical detail.", code: "C", classMin: 11, classMax: 12 },
  { text: "I like to maintain and repair mechanical equipment.", code: "R", classMin: 11, classMax: 12 },
  { text: "I enjoy diagnosing problems in a system using logic.", code: "I", classMin: 11, classMax: 12 },
  { text: "I am interested in UI design for web and mobile platforms.", code: "A", classMin: 11, classMax: 12 },
  { text: "I find it fulfilling to work in a hospital or healthcare setting.", code: "S", classMin: 11, classMax: 12 },
  { text: "I enjoy the challenge of convincing a client to sign a deal.", code: "E", classMin: 11, classMax: 12 },
  { text: "I like to manage payroll and financial records for a company.", code: "C", classMin: 11, classMax: 12 },
  { text: "I would like to work in construction or civil engineering projects.", code: "R", classMin: 11, classMax: 12 },
  { text: "I enjoy reading academic papers on new technology.", code: "I", classMin: 11, classMax: 12 },
  { text: "I like to design layouts for magazines or digital publications.", code: "A", classMin: 11, classMax: 12 },
  { text: "I would enjoy working as a speech therapist or social worker.", code: "S", classMin: 11, classMax: 12 },
  { text: "I am interested in political campaigning or public relations.", code: "E", classMin: 11, classMax: 12 },
  { text: "I am very careful about following legal and compliance guidelines.", code: "C", classMin: 11, classMax: 12 },
  { text: "I enjoy physical labor that involves precision and skill.", code: "R", classMin: 11, classMax: 12 },
  { text: 'I like to figure out the "Root Cause" of a failure.', code: "I", classMin: 11, classMax: 12 },
  { text: "I enjoy creating sound effects or music for digital media.", code: "A", classMin: 11, classMax: 12 },
  { text: "I like to coordinate volunteer programs for a community.", code: "S", classMin: 11, classMax: 12 },
  { text: "I enjoy taking the lead in a crisis situation.", code: "E", classMin: 11, classMax: 12 },
  { text: "I like to use a system to file and retrieve information quickly.", code: "C", classMin: 11, classMax: 12 },
  { text: "I would like to work with renewable energy systems (Solar/Wind).", code: "R", classMin: 11, classMax: 12 },
  { text: "I am interested in exploring theories about the universe.", code: "I", classMin: 11, classMax: 12 },
  { text: 'I enjoy coming up with creative "out-of-the-box" solutions.', code: "A", classMin: 11, classMax: 12 },
  { text: "I like to help people solve their interpersonal conflicts.", code: "S", classMin: 11, classMax: 12 },
  { text: "I would enjoy working as a real estate developer.", code: "E", classMin: 11, classMax: 12 },
  { text: "I prefer working with numbers and hard data over abstract ideas.", code: "C", classMin: 11, classMax: 12 },
  { text: "I like to work with landscape design or large-scale farming.", code: "R", classMin: 11, classMax: 12 },
  { text: "I enjoy analyzing the chemical composition of substances.", code: "I", classMin: 11, classMax: 12 },
  { text: "I like to storyboard ideas for visual storytelling.", code: "A", classMin: 11, classMax: 12 },
  { text: "I would enjoy being a teacher or a corporate trainer.", code: "S", classMin: 11, classMax: 12 },
  { text: "I enjoy managing a retail store or a sales team.", code: "E", classMin: 11, classMax: 12 },
  { text: "I like to prepare detailed financial reports and balance sheets.", code: "C", classMin: 11, classMax: 12 },
  { text: "I am interested in aviation and working with aircraft.", code: "R", classMin: 11, classMax: 12 },
  { text: "I like to conduct surveys and analyze the social data.", code: "I", classMin: 11, classMax: 12 },
  { text: "I enjoy creating prototypes for new products.", code: "A", classMin: 11, classMax: 12 },
  { text: "I find it easy to empathize with people from different backgrounds.", code: "S", classMin: 11, classMax: 12 },
  { text: "I would enjoy working as an executive in a large corporation.", code: "E", classMin: 11, classMax: 12 },
  { text: "I like to ensure that all business operations follow the SOPs.", code: "C", classMin: 11, classMax: 12 },
  { text: "I enjoy working in a workshop environment with diverse tools.", code: "R", classMin: 11, classMax: 12 },
  { text: "I like to explore the history and evolution of ideas.", code: "I", classMin: 11, classMax: 12 },
  { text: "I enjoy the process of branding and visual communication.", code: "A", classMin: 11, classMax: 12 },
];

const ALL_QUESTIONS: RawQ[] = [...GROUP_A, ...GROUP_B, ...GROUP_C];

async function main() {
  console.log("🗑️  Deleting all existing questions...");
  // Delete answers first (FK), then options, then questions
  await prisma.assessmentAnswer.deleteMany({});
  await prisma.questionOption.deleteMany({});
  await prisma.question.deleteMany({});
  console.log("✅  All questions cleared.");

  console.log(`📝  Inserting ${ALL_QUESTIONS.length} Holland Code questions...`);
  let count = 0;
  for (let i = 0; i < ALL_QUESTIONS.length; i++) {
    const q = ALL_QUESTIONS[i];
    await prisma.question.create({
      data: {
        text: q.text,
        type: "INTEREST",
        hollandCode: q.code,
        classMin: q.classMin,
        classMax: q.classMax,
        forAssessment: "CLUSTER",
        isActive: true,
        sortOrder: i,
        options: {
          create: AGREE_OPTIONS.map((opt) => ({
            text: opt.text,
            sortOrder: opt.sortOrder,
          })),
        },
      },
    });
    count++;
    if (count % 20 === 0) console.log(`   ${count}/${ALL_QUESTIONS.length} done...`);
  }

  console.log(`\n✅  Seeded ${count} questions successfully!`);
  console.log("   Group A (Class 6-10)  : 30 questions");
  console.log("   Group B (Class 11-12) : 50 questions");
  console.log("   Group C (Class 11-12) : 75 questions");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

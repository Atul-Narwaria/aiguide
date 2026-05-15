/**
 * Seed branch-level questions for all career clusters.
 * These questions help narrow down which specific career branch
 * within a cluster suits the student best.
 *
 * Run: npx ts-node --project tsconfig.json prisma/seed-branch-questions.ts
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// ─── Question template ────────────────────────────────────────────────────────

interface BranchWeight {
  branchName: string;
  weight: number;
}
interface OptionTemplate {
  text: string;
  sortOrder: number;
  branchWeights: BranchWeight[];
}
interface QuestionTemplate {
  text: string;
  options: OptionTemplate[];
}
interface ClusterQuestions {
  clusterName: string;
  questions: QuestionTemplate[];
}

// ─── Questions data ───────────────────────────────────────────────────────────

const DATA: ClusterQuestions[] = [
  // ── Engineering ──────────────────────────────────────────────────────────────
  {
    clusterName: "Engineering",
    questions: [
      {
        text: "Which kind of project would you find most exciting?",
        options: [
          { text: "Writing code for an app or software product", sortOrder: 1, branchWeights: [{ branchName: "Computer Science", weight: 5 }, { branchName: "Electronics & Communication", weight: 1 }] },
          { text: "Designing a bridge or large structure", sortOrder: 2, branchWeights: [{ branchName: "Civil Engineering", weight: 5 }, { branchName: "Architecture", weight: 3 }] },
          { text: "Building circuits and electronic devices", sortOrder: 3, branchWeights: [{ branchName: "Electrical Engineering", weight: 4 }, { branchName: "Electronics & Communication", weight: 4 }] },
          { text: "Designing aircraft or rocket engines", sortOrder: 4, branchWeights: [{ branchName: "Aerospace Engineering", weight: 5 }, { branchName: "Mechanical Engineering", weight: 2 }] },
        ],
      },
      {
        text: "Which subject do you enjoy the most?",
        options: [
          { text: "Mathematics and programming logic", sortOrder: 1, branchWeights: [{ branchName: "Computer Science", weight: 5 }] },
          { text: "Chemistry and material science", sortOrder: 2, branchWeights: [{ branchName: "Chemical Engineering", weight: 5 }, { branchName: "Biotechnology", weight: 3 }] },
          { text: "Physics and mechanics", sortOrder: 3, branchWeights: [{ branchName: "Mechanical Engineering", weight: 5 }, { branchName: "Electrical Engineering", weight: 2 }] },
          { text: "Environmental science and sustainability", sortOrder: 4, branchWeights: [{ branchName: "Environmental Engineering", weight: 5 }, { branchName: "Civil Engineering", weight: 2 }] },
        ],
      },
      {
        text: "Where would you most like to work?",
        options: [
          { text: "Tech company or startup building digital products", sortOrder: 1, branchWeights: [{ branchName: "Computer Science", weight: 5 }] },
          { text: "Construction site or infrastructure project", sortOrder: 2, branchWeights: [{ branchName: "Civil Engineering", weight: 5 }, { branchName: "Architecture", weight: 3 }] },
          { text: "Factory or manufacturing plant", sortOrder: 3, branchWeights: [{ branchName: "Mechanical Engineering", weight: 5 }, { branchName: "Chemical Engineering", weight: 2 }] },
          { text: "Hospital, pharmaceutical or biotech lab", sortOrder: 4, branchWeights: [{ branchName: "Biotechnology", weight: 5 }, { branchName: "Chemical Engineering", weight: 2 }] },
        ],
      },
      {
        text: "Which problem would you most like to solve?",
        options: [
          { text: "Making cities smarter and more efficient", sortOrder: 1, branchWeights: [{ branchName: "Civil Engineering", weight: 4 }, { branchName: "Computer Science", weight: 3 }] },
          { text: "Making aircraft safer and more fuel-efficient", sortOrder: 2, branchWeights: [{ branchName: "Aerospace Engineering", weight: 5 }, { branchName: "Mechanical Engineering", weight: 2 }] },
          { text: "Reducing pollution and environmental damage", sortOrder: 3, branchWeights: [{ branchName: "Environmental Engineering", weight: 5 }, { branchName: "Chemical Engineering", weight: 2 }] },
          { text: "Creating faster and more secure internet", sortOrder: 4, branchWeights: [{ branchName: "Electronics & Communication", weight: 5 }, { branchName: "Electrical Engineering", weight: 3 }] },
        ],
      },
      {
        text: "Which word best describes your ideal work style?",
        options: [
          { text: "Analytical — I love solving complex logic problems", sortOrder: 1, branchWeights: [{ branchName: "Computer Science", weight: 4 }, { branchName: "Electrical Engineering", weight: 3 }] },
          { text: "Hands-on — I love building and fixing physical things", sortOrder: 2, branchWeights: [{ branchName: "Mechanical Engineering", weight: 5 }, { branchName: "Civil Engineering", weight: 3 }] },
          { text: "Creative — I love designing structures and spaces", sortOrder: 3, branchWeights: [{ branchName: "Architecture", weight: 5 }, { branchName: "Civil Engineering", weight: 2 }] },
          { text: "Scientific — I love experiments and discovery", sortOrder: 4, branchWeights: [{ branchName: "Biotechnology", weight: 4 }, { branchName: "Chemical Engineering", weight: 4 }] },
        ],
      },
    ],
  },

  // ── Technology & IT ──────────────────────────────────────────────────────────
  {
    clusterName: "Technology & IT",
    questions: [
      {
        text: "Which area of technology excites you the most?",
        options: [
          { text: "Building websites and mobile apps", sortOrder: 1, branchWeights: [{ branchName: "Software Development", weight: 5 }] },
          { text: "Protecting systems from hackers and cyber threats", sortOrder: 2, branchWeights: [{ branchName: "Cybersecurity", weight: 5 }] },
          { text: "Working with data to find patterns and predictions", sortOrder: 3, branchWeights: [{ branchName: "Data Science & AI/ML", weight: 5 }] },
          { text: "Managing cloud servers and deployment pipelines", sortOrder: 4, branchWeights: [{ branchName: "Cloud & DevOps", weight: 5 }] },
        ],
      },
      {
        text: "What kind of tech challenge sounds most interesting?",
        options: [
          { text: "Building a recommendation engine like Netflix uses", sortOrder: 1, branchWeights: [{ branchName: "Data Science & AI/ML", weight: 5 }, { branchName: "Software Development", weight: 2 }] },
          { text: "Finding security holes in a banking app", sortOrder: 2, branchWeights: [{ branchName: "Cybersecurity", weight: 5 }] },
          { text: "Designing a strategy for a new digital product", sortOrder: 3, branchWeights: [{ branchName: "Product Management", weight: 5 }] },
          { text: "Setting up auto-scaling for millions of users", sortOrder: 4, branchWeights: [{ branchName: "Cloud & DevOps", weight: 5 }] },
        ],
      },
      {
        text: "Which daily task sounds most appealing?",
        options: [
          { text: "Writing and reviewing code for new features", sortOrder: 1, branchWeights: [{ branchName: "Software Development", weight: 5 }] },
          { text: "Analysing dashboards and business metrics", sortOrder: 2, branchWeights: [{ branchName: "Data Science & AI/ML", weight: 4 }, { branchName: "Product Management", weight: 3 }] },
          { text: "Running security audits and penetration tests", sortOrder: 3, branchWeights: [{ branchName: "Cybersecurity", weight: 5 }] },
          { text: "Talking to users to understand their problems", sortOrder: 4, branchWeights: [{ branchName: "Product Management", weight: 5 }] },
        ],
      },
      {
        text: "Which programming or technical area do you enjoy?",
        options: [
          { text: "Frontend or backend web development", sortOrder: 1, branchWeights: [{ branchName: "Software Development", weight: 5 }] },
          { text: "Python, data analysis, machine learning", sortOrder: 2, branchWeights: [{ branchName: "Data Science & AI/ML", weight: 5 }] },
          { text: "Linux, networking, and security tools", sortOrder: 3, branchWeights: [{ branchName: "Cybersecurity", weight: 4 }, { branchName: "Cloud & DevOps", weight: 3 }] },
          { text: "AWS, Docker, Kubernetes, CI/CD pipelines", sortOrder: 4, branchWeights: [{ branchName: "Cloud & DevOps", weight: 5 }] },
        ],
      },
      {
        text: "What is your biggest career goal in technology?",
        options: [
          { text: "Build a product used by millions of people", sortOrder: 1, branchWeights: [{ branchName: "Software Development", weight: 3 }, { branchName: "Product Management", weight: 4 }] },
          { text: "Keep critical systems safe from cyberattacks", sortOrder: 2, branchWeights: [{ branchName: "Cybersecurity", weight: 5 }] },
          { text: "Train AI that solves real-world problems", sortOrder: 3, branchWeights: [{ branchName: "Data Science & AI/ML", weight: 5 }] },
          { text: "Build reliable infrastructure at massive scale", sortOrder: 4, branchWeights: [{ branchName: "Cloud & DevOps", weight: 5 }] },
        ],
      },
    ],
  },

  // ── Technology (duplicate cluster) ───────────────────────────────────────────
  {
    clusterName: "Technology",
    questions: [
      {
        text: "Which area of technology excites you most?",
        options: [
          { text: "Building AI models and intelligent systems", sortOrder: 1, branchWeights: [{ branchName: "Artificial Intelligence & ML", weight: 5 }] },
          { text: "Developing secure and ethical cybersecurity tools", sortOrder: 2, branchWeights: [{ branchName: "Cybersecurity", weight: 5 }] },
          { text: "Writing code for web or mobile applications", sortOrder: 3, branchWeights: [{ branchName: "Full Stack Development", weight: 4 }, { branchName: "Mobile App Development", weight: 4 }] },
          { text: "Working with data to find insights and patterns", sortOrder: 4, branchWeights: [{ branchName: "Data Science & Analytics", weight: 5 }] },
        ],
      },
      {
        text: "Which future technology excites you most?",
        options: [
          { text: "AI that can understand and generate human language", sortOrder: 1, branchWeights: [{ branchName: "Artificial Intelligence & ML", weight: 5 }] },
          { text: "Blockchain and decentralised finance (DeFi)", sortOrder: 2, branchWeights: [{ branchName: "Blockchain & Web3", weight: 5 }] },
          { text: "Smart devices that connect everything (IoT)", sortOrder: 3, branchWeights: [{ branchName: "IoT & Embedded Systems", weight: 5 }] },
          { text: "Immersive games with virtual reality", sortOrder: 4, branchWeights: [{ branchName: "Game Development", weight: 5 }] },
        ],
      },
      {
        text: "Which skill do you want to develop most?",
        options: [
          { text: "Machine learning and neural networks", sortOrder: 1, branchWeights: [{ branchName: "Artificial Intelligence & ML", weight: 5 }] },
          { text: "Cloud architecture and DevOps", sortOrder: 2, branchWeights: [{ branchName: "Cloud Computing & DevOps", weight: 5 }] },
          { text: "Mobile UI/UX and app performance", sortOrder: 3, branchWeights: [{ branchName: "Mobile App Development", weight: 5 }] },
          { text: "Full stack web development", sortOrder: 4, branchWeights: [{ branchName: "Full Stack Development", weight: 5 }] },
        ],
      },
      {
        text: "Which project sounds most fun to work on?",
        options: [
          { text: "Building a crypto exchange or NFT marketplace", sortOrder: 1, branchWeights: [{ branchName: "Blockchain & Web3", weight: 5 }] },
          { text: "Deploying a smart home automation system", sortOrder: 2, branchWeights: [{ branchName: "IoT & Embedded Systems", weight: 5 }] },
          { text: "Creating a multiplayer online game", sortOrder: 3, branchWeights: [{ branchName: "Game Development", weight: 5 }] },
          { text: "Building a data dashboard for a business", sortOrder: 4, branchWeights: [{ branchName: "Data Science & Analytics", weight: 5 }] },
        ],
      },
      {
        text: "What kind of tech career goal inspires you?",
        options: [
          { text: "Become an AI researcher or ML engineer", sortOrder: 1, branchWeights: [{ branchName: "Artificial Intelligence & ML", weight: 5 }] },
          { text: "Protect companies from hackers and data breaches", sortOrder: 2, branchWeights: [{ branchName: "Cybersecurity", weight: 5 }] },
          { text: "Build apps downloaded by millions worldwide", sortOrder: 3, branchWeights: [{ branchName: "Full Stack Development", weight: 3 }, { branchName: "Mobile App Development", weight: 4 }] },
          { text: "Run cloud infrastructure for major enterprises", sortOrder: 4, branchWeights: [{ branchName: "Cloud Computing & DevOps", weight: 5 }] },
        ],
      },
    ],
  },

  // ── Science & Research ────────────────────────────────────────────────────────
  {
    clusterName: "Science & Research",
    questions: [
      {
        text: "Which area of science fascinates you most?",
        options: [
          { text: "How living organisms work at the molecular level", sortOrder: 1, branchWeights: [{ branchName: "Biology & Biotechnology", weight: 5 }] },
          { text: "The laws of physics and the nature of the universe", sortOrder: 2, branchWeights: [{ branchName: "Physics Research", weight: 5 }, { branchName: "Space & Astronomy (ISRO)", weight: 3 }] },
          { text: "Chemical reactions and new materials", sortOrder: 3, branchWeights: [{ branchName: "Chemistry & Materials", weight: 5 }] },
          { text: "Climate change and natural ecosystems", sortOrder: 4, branchWeights: [{ branchName: "Environmental Science", weight: 5 }] },
        ],
      },
      {
        text: "Where would you most like to work?",
        options: [
          { text: "ISRO or a space research centre", sortOrder: 1, branchWeights: [{ branchName: "Space & Astronomy (ISRO)", weight: 5 }, { branchName: "Physics Research", weight: 2 }] },
          { text: "A biotech company or genetics lab", sortOrder: 2, branchWeights: [{ branchName: "Biology & Biotechnology", weight: 5 }] },
          { text: "A chemical engineering or materials lab", sortOrder: 3, branchWeights: [{ branchName: "Chemistry & Materials", weight: 5 }] },
          { text: "An environmental research institute or wildlife conservation", sortOrder: 4, branchWeights: [{ branchName: "Environmental Science", weight: 5 }] },
        ],
      },
      {
        text: "Which science question excites you most?",
        options: [
          { text: "Is there life on other planets?", sortOrder: 1, branchWeights: [{ branchName: "Space & Astronomy (ISRO)", weight: 5 }, { branchName: "Physics Research", weight: 2 }] },
          { text: "Can we cure genetic diseases using CRISPR?", sortOrder: 2, branchWeights: [{ branchName: "Biology & Biotechnology", weight: 5 }] },
          { text: "How can we create better batteries for EVs?", sortOrder: 3, branchWeights: [{ branchName: "Chemistry & Materials", weight: 5 }] },
          { text: "How do we stop plastic from polluting the oceans?", sortOrder: 4, branchWeights: [{ branchName: "Environmental Science", weight: 5 }] },
        ],
      },
      {
        text: "Which type of research project appeals to you?",
        options: [
          { text: "Studying gravitational waves and black holes", sortOrder: 1, branchWeights: [{ branchName: "Physics Research", weight: 5 }] },
          { text: "Developing new vaccines or antibiotics", sortOrder: 2, branchWeights: [{ branchName: "Biology & Biotechnology", weight: 5 }] },
          { text: "Creating eco-friendly packaging materials", sortOrder: 3, branchWeights: [{ branchName: "Chemistry & Materials", weight: 5 }] },
          { text: "Tracking deforestation using satellite data", sortOrder: 4, branchWeights: [{ branchName: "Environmental Science", weight: 4 }, { branchName: "Space & Astronomy (ISRO)", weight: 2 }] },
        ],
      },
      {
        text: "Which science subject do you find most interesting in school?",
        options: [
          { text: "Physics — mechanics, optics, quantum theory", sortOrder: 1, branchWeights: [{ branchName: "Physics Research", weight: 4 }, { branchName: "Space & Astronomy (ISRO)", weight: 3 }] },
          { text: "Biology — cells, genetics, evolution", sortOrder: 2, branchWeights: [{ branchName: "Biology & Biotechnology", weight: 5 }] },
          { text: "Chemistry — periodic table, reactions, polymers", sortOrder: 3, branchWeights: [{ branchName: "Chemistry & Materials", weight: 5 }] },
          { text: "Environmental Studies — ecosystems, climate", sortOrder: 4, branchWeights: [{ branchName: "Environmental Science", weight: 5 }] },
        ],
      },
    ],
  },

  // ── Medical & Healthcare ──────────────────────────────────────────────────────
  {
    clusterName: "Medical & Healthcare",
    questions: [
      {
        text: "Which medical career role appeals to you most?",
        options: [
          { text: "Diagnosing and treating patients as a doctor", sortOrder: 1, branchWeights: [{ branchName: "MBBS / Doctor", weight: 5 }] },
          { text: "Caring for patients through nursing and daily treatment", sortOrder: 2, branchWeights: [{ branchName: "Nursing", weight: 5 }] },
          { text: "Working with medicines and drug formulations", sortOrder: 3, branchWeights: [{ branchName: "Pharmacy", weight: 5 }] },
          { text: "Treating dental problems and oral health", sortOrder: 4, branchWeights: [{ branchName: "Dental (BDS)", weight: 5 }] },
        ],
      },
      {
        text: "Which healthcare skill do you want to develop?",
        options: [
          { text: "Performing surgeries and procedures", sortOrder: 1, branchWeights: [{ branchName: "MBBS / Doctor", weight: 5 }] },
          { text: "Running medical lab tests and diagnostics", sortOrder: 2, branchWeights: [{ branchName: "Allied Health Sciences", weight: 5 }] },
          { text: "Helping patients recover through therapy", sortOrder: 3, branchWeights: [{ branchName: "Allied Health Sciences", weight: 4 }, { branchName: "Nursing", weight: 2 }] },
          { text: "Compounding and dispensing medications accurately", sortOrder: 4, branchWeights: [{ branchName: "Pharmacy", weight: 5 }] },
        ],
      },
      {
        text: "Which medical challenge inspires you most?",
        options: [
          { text: "Curing complex diseases like cancer or diabetes", sortOrder: 1, branchWeights: [{ branchName: "MBBS / Doctor", weight: 4 }, { branchName: "Pharmacy", weight: 3 }] },
          { text: "Improving dental care for rural communities", sortOrder: 2, branchWeights: [{ branchName: "Dental (BDS)", weight: 5 }] },
          { text: "Developing better nursing care systems in hospitals", sortOrder: 3, branchWeights: [{ branchName: "Nursing", weight: 5 }] },
          { text: "Creating new lab diagnostic tools", sortOrder: 4, branchWeights: [{ branchName: "Allied Health Sciences", weight: 5 }] },
        ],
      },
      {
        text: "How much patient interaction do you prefer?",
        options: [
          { text: "Lots — I want to be the main point of care", sortOrder: 1, branchWeights: [{ branchName: "MBBS / Doctor", weight: 4 }, { branchName: "Nursing", weight: 4 }] },
          { text: "Moderate — working with patients but also with technology", sortOrder: 2, branchWeights: [{ branchName: "Allied Health Sciences", weight: 5 }, { branchName: "Dental (BDS)", weight: 3 }] },
          { text: "Some — counselling on medications and health", sortOrder: 3, branchWeights: [{ branchName: "Pharmacy", weight: 5 }] },
          { text: "Specialised — working directly in the mouth/oral area", sortOrder: 4, branchWeights: [{ branchName: "Dental (BDS)", weight: 5 }] },
        ],
      },
      {
        text: "Which subject do you enjoy studying most?",
        options: [
          { text: "Biology and human anatomy", sortOrder: 1, branchWeights: [{ branchName: "MBBS / Doctor", weight: 4 }, { branchName: "Nursing", weight: 3 }] },
          { text: "Chemistry and pharmacology", sortOrder: 2, branchWeights: [{ branchName: "Pharmacy", weight: 5 }] },
          { text: "Physiology and pathology", sortOrder: 3, branchWeights: [{ branchName: "Allied Health Sciences", weight: 4 }, { branchName: "MBBS / Doctor", weight: 3 }] },
          { text: "Oral biology and dentistry sciences", sortOrder: 4, branchWeights: [{ branchName: "Dental (BDS)", weight: 5 }] },
        ],
      },
    ],
  },

  // ── Medical (duplicate cluster) ───────────────────────────────────────────────
  {
    clusterName: "Medical",
    questions: [
      {
        text: "Which branch of medicine appeals to you most?",
        options: [
          { text: "Becoming a doctor and diagnosing diseases", sortOrder: 1, branchWeights: [{ branchName: "MBBS", weight: 5 }] },
          { text: "Working with traditional Ayurvedic treatments", sortOrder: 2, branchWeights: [{ branchName: "BAMS (Ayurveda)", weight: 5 }] },
          { text: "Helping animals through veterinary medicine", sortOrder: 3, branchWeights: [{ branchName: "Veterinary Science (BVSc)", weight: 5 }] },
          { text: "Public health and community medicine", sortOrder: 4, branchWeights: [{ branchName: "Public Health (MPH)", weight: 5 }] },
        ],
      },
      {
        text: "Which medical field do you want to specialise in?",
        options: [
          { text: "Conventional modern medicine (allopathy)", sortOrder: 1, branchWeights: [{ branchName: "MBBS", weight: 5 }, { branchName: "BDS (Dentistry)", weight: 2 }] },
          { text: "Holistic healing — homeopathy or Ayurveda", sortOrder: 2, branchWeights: [{ branchName: "BHMS (Homeopathy)", weight: 5 }, { branchName: "BAMS (Ayurveda)", weight: 4 }] },
          { text: "Rehabilitation through physiotherapy", sortOrder: 3, branchWeights: [{ branchName: "Physiotherapy (BPT)", weight: 5 }] },
          { text: "Medical research and biomedical innovation", sortOrder: 4, branchWeights: [{ branchName: "Biomedical Science", weight: 5 }] },
        ],
      },
      {
        text: "Where would you most like to work?",
        options: [
          { text: "A large government or private hospital", sortOrder: 1, branchWeights: [{ branchName: "MBBS", weight: 5 }, { branchName: "Nursing (BSc)", weight: 3 }] },
          { text: "A pharmacy or drug research company", sortOrder: 2, branchWeights: [{ branchName: "Pharmacy (B.Pharm)", weight: 5 }] },
          { text: "A veterinary clinic or animal hospital", sortOrder: 3, branchWeights: [{ branchName: "Veterinary Science (BVSc)", weight: 5 }] },
          { text: "A research lab working on new treatments", sortOrder: 4, branchWeights: [{ branchName: "Biomedical Science", weight: 5 }, { branchName: "Pharmacy (B.Pharm)", weight: 2 }] },
        ],
      },
      {
        text: "Which type of patient care motivates you?",
        options: [
          { text: "Emergency care and treating critical patients", sortOrder: 1, branchWeights: [{ branchName: "MBBS", weight: 5 }] },
          { text: "Post-surgery recovery and movement rehabilitation", sortOrder: 2, branchWeights: [{ branchName: "Physiotherapy (BPT)", weight: 5 }] },
          { text: "Nursing patients daily and monitoring vitals", sortOrder: 3, branchWeights: [{ branchName: "Nursing (BSc)", weight: 5 }] },
          { text: "Community-level health and preventive care", sortOrder: 4, branchWeights: [{ branchName: "Public Health (MPH)", weight: 5 }] },
        ],
      },
      {
        text: "Which subject do you find most interesting?",
        options: [
          { text: "Human anatomy, physiology, and biochemistry", sortOrder: 1, branchWeights: [{ branchName: "MBBS", weight: 4 }, { branchName: "Biomedical Science", weight: 3 }] },
          { text: "Herbal medicines and traditional health systems", sortOrder: 2, branchWeights: [{ branchName: "BAMS (Ayurveda)", weight: 5 }, { branchName: "BHMS (Homeopathy)", weight: 3 }] },
          { text: "Pharmacology and drug chemistry", sortOrder: 3, branchWeights: [{ branchName: "Pharmacy (B.Pharm)", weight: 5 }] },
          { text: "Zoology and animal biology", sortOrder: 4, branchWeights: [{ branchName: "Veterinary Science (BVSc)", weight: 5 }] },
        ],
      },
    ],
  },

  // ── Business & Commerce ───────────────────────────────────────────────────────
  {
    clusterName: "Business & Commerce",
    questions: [
      {
        text: "Which business role most appeals to you?",
        options: [
          { text: "Managing company finances and audits", sortOrder: 1, branchWeights: [{ branchName: "Chartered Accountant (CA)", weight: 5 }] },
          { text: "Starting my own company from scratch", sortOrder: 2, branchWeights: [{ branchName: "Entrepreneurship", weight: 5 }] },
          { text: "Selling products and growing brand value", sortOrder: 3, branchWeights: [{ branchName: "Marketing & Sales", weight: 5 }] },
          { text: "Managing people and operations in a company", sortOrder: 4, branchWeights: [{ branchName: "MBA / Management", weight: 5 }] },
        ],
      },
      {
        text: "Which financial activity interests you most?",
        options: [
          { text: "Auditing company accounts and finding errors", sortOrder: 1, branchWeights: [{ branchName: "Chartered Accountant (CA)", weight: 5 }] },
          { text: "Trading stocks and managing investment portfolios", sortOrder: 2, branchWeights: [{ branchName: "Finance & Banking", weight: 5 }] },
          { text: "Funding startups and growing businesses", sortOrder: 3, branchWeights: [{ branchName: "Entrepreneurship", weight: 4 }, { branchName: "MBA / Management", weight: 3 }] },
          { text: "Creating advertising campaigns and brand strategies", sortOrder: 4, branchWeights: [{ branchName: "Marketing & Sales", weight: 5 }] },
        ],
      },
      {
        text: "What kind of leader do you want to be?",
        options: [
          { text: "A founder who builds something from nothing", sortOrder: 1, branchWeights: [{ branchName: "Entrepreneurship", weight: 5 }] },
          { text: "A CFO or financial director of a large company", sortOrder: 2, branchWeights: [{ branchName: "Finance & Banking", weight: 4 }, { branchName: "Chartered Accountant (CA)", weight: 3 }] },
          { text: "A CMO who grows brands and customer bases", sortOrder: 3, branchWeights: [{ branchName: "Marketing & Sales", weight: 5 }] },
          { text: "A CEO who runs operations across departments", sortOrder: 4, branchWeights: [{ branchName: "MBA / Management", weight: 5 }] },
        ],
      },
      {
        text: "Which skill do you want to develop most?",
        options: [
          { text: "Tax laws, financial statements, and compliance", sortOrder: 1, branchWeights: [{ branchName: "Chartered Accountant (CA)", weight: 5 }] },
          { text: "Digital marketing and social media strategy", sortOrder: 2, branchWeights: [{ branchName: "Marketing & Sales", weight: 5 }] },
          { text: "Investment analysis and risk assessment", sortOrder: 3, branchWeights: [{ branchName: "Finance & Banking", weight: 5 }] },
          { text: "Strategy, leadership, and business operations", sortOrder: 4, branchWeights: [{ branchName: "MBA / Management", weight: 5 }] },
        ],
      },
      {
        text: "What motivates you most in business?",
        options: [
          { text: "Making a new product and watching it grow", sortOrder: 1, branchWeights: [{ branchName: "Entrepreneurship", weight: 5 }] },
          { text: "Ensuring companies follow financial regulations", sortOrder: 2, branchWeights: [{ branchName: "Chartered Accountant (CA)", weight: 5 }] },
          { text: "Persuading customers and closing deals", sortOrder: 3, branchWeights: [{ branchName: "Marketing & Sales", weight: 5 }] },
          { text: "Maximising returns on investments and assets", sortOrder: 4, branchWeights: [{ branchName: "Finance & Banking", weight: 5 }] },
        ],
      },
    ],
  },

  // ── Business (duplicate cluster) ──────────────────────────────────────────────
  {
    clusterName: "Business",
    questions: [
      {
        text: "Which career goal inspires you most?",
        options: [
          { text: "Become a Chartered Accountant and manage large company accounts", sortOrder: 1, branchWeights: [{ branchName: "Chartered Accountancy (CA)", weight: 5 }] },
          { text: "Launch my own startup or business", sortOrder: 2, branchWeights: [{ branchName: "Entrepreneurship", weight: 5 }] },
          { text: "Work in international trade and global markets", sortOrder: 3, branchWeights: [{ branchName: "International Business", weight: 5 }] },
          { text: "Manage people and company culture as an HR leader", sortOrder: 4, branchWeights: [{ branchName: "Human Resources (HR)", weight: 5 }] },
        ],
      },
      {
        text: "Which professional qualification interests you most?",
        options: [
          { text: "CA — to master finance, tax, and audit", sortOrder: 1, branchWeights: [{ branchName: "Chartered Accountancy (CA)", weight: 5 }] },
          { text: "CS — to handle company law and governance", sortOrder: 2, branchWeights: [{ branchName: "Company Secretary (CS)", weight: 5 }] },
          { text: "CMA — to focus on cost management", sortOrder: 3, branchWeights: [{ branchName: "Cost & Management Accountant (CMA)", weight: 5 }] },
          { text: "MBA — to lead teams and business strategy", sortOrder: 4, branchWeights: [{ branchName: "MBA", weight: 5 }] },
        ],
      },
      {
        text: "Which aspect of business do you enjoy most?",
        options: [
          { text: "Advertising, branding, and reaching customers", sortOrder: 1, branchWeights: [{ branchName: "Marketing & Advertising", weight: 5 }] },
          { text: "Managing budgets, payroll, and costs", sortOrder: 2, branchWeights: [{ branchName: "Finance & Banking", weight: 4 }, { branchName: "Cost & Management Accountant (CMA)", weight: 3 }] },
          { text: "Recruiting, training, and managing employees", sortOrder: 3, branchWeights: [{ branchName: "Human Resources (HR)", weight: 5 }] },
          { text: "Growing a business across international borders", sortOrder: 4, branchWeights: [{ branchName: "International Business", weight: 5 }] },
        ],
      },
      {
        text: "What kind of company would you most like to work for?",
        options: [
          { text: "A Big-4 accounting firm (Deloitte, PwC, EY, KPMG)", sortOrder: 1, branchWeights: [{ branchName: "Chartered Accountancy (CA)", weight: 5 }] },
          { text: "A startup or my own business", sortOrder: 2, branchWeights: [{ branchName: "Entrepreneurship", weight: 5 }] },
          { text: "A multinational corporation with global offices", sortOrder: 3, branchWeights: [{ branchName: "International Business", weight: 4 }, { branchName: "MBA", weight: 3 }] },
          { text: "A company where I can grow and lead teams", sortOrder: 4, branchWeights: [{ branchName: "Human Resources (HR)", weight: 4 }, { branchName: "MBA", weight: 3 }] },
        ],
      },
      {
        text: "Which daily task sounds most motivating?",
        options: [
          { text: "Reviewing financial statements and finding errors", sortOrder: 1, branchWeights: [{ branchName: "Chartered Accountancy (CA)", weight: 4 }, { branchName: "Finance & Banking", weight: 3 }] },
          { text: "Planning a marketing campaign or product launch", sortOrder: 2, branchWeights: [{ branchName: "Marketing & Advertising", weight: 5 }] },
          { text: "Negotiating contracts with international partners", sortOrder: 3, branchWeights: [{ branchName: "International Business", weight: 5 }] },
          { text: "Setting company policy and resolving employee issues", sortOrder: 4, branchWeights: [{ branchName: "Human Resources (HR)", weight: 4 }, { branchName: "Company Secretary (CS)", weight: 3 }] },
        ],
      },
    ],
  },

  // ── Arts & Humanities ─────────────────────────────────────────────────────────
  {
    clusterName: "Arts & Humanities",
    questions: [
      {
        text: "Which creative career appeals to you most?",
        options: [
          { text: "Acting in films, TV shows, or theatre", sortOrder: 1, branchWeights: [{ branchName: "Music & Performing Arts", weight: 4 }, { branchName: "Film & Media", weight: 4 }] },
          { text: "Creating paintings, sculptures, or visual art", sortOrder: 2, branchWeights: [{ branchName: "Fine Arts & Design", weight: 5 }] },
          { text: "Writing news stories and reporting from the field", sortOrder: 3, branchWeights: [{ branchName: "Journalism & Mass Communication", weight: 5 }] },
          { text: "Writing novels, poetry, or screenplays", sortOrder: 4, branchWeights: [{ branchName: "Literature & Writing", weight: 5 }] },
        ],
      },
      {
        text: "Where would you most like to work?",
        options: [
          { text: "A film studio or television production house", sortOrder: 1, branchWeights: [{ branchName: "Film & Media", weight: 5 }] },
          { text: "An art gallery or design studio", sortOrder: 2, branchWeights: [{ branchName: "Fine Arts & Design", weight: 5 }] },
          { text: "A music band or performing arts theatre", sortOrder: 3, branchWeights: [{ branchName: "Music & Performing Arts", weight: 5 }] },
          { text: "A publishing house or media newspaper", sortOrder: 4, branchWeights: [{ branchName: "Literature & Writing", weight: 4 }, { branchName: "Journalism & Mass Communication", weight: 3 }] },
        ],
      },
      {
        text: "Which creative skill do you enjoy most?",
        options: [
          { text: "Writing compelling stories and characters", sortOrder: 1, branchWeights: [{ branchName: "Literature & Writing", weight: 5 }] },
          { text: "Painting, drawing, or digital design", sortOrder: 2, branchWeights: [{ branchName: "Fine Arts & Design", weight: 5 }] },
          { text: "Interviewing people and investigating stories", sortOrder: 3, branchWeights: [{ branchName: "Journalism & Mass Communication", weight: 5 }] },
          { text: "Playing instruments or singing on stage", sortOrder: 4, branchWeights: [{ branchName: "Music & Performing Arts", weight: 5 }] },
        ],
      },
      {
        text: "Which type of project excites you most?",
        options: [
          { text: "Directing a short film or documentary", sortOrder: 1, branchWeights: [{ branchName: "Film & Media", weight: 5 }] },
          { text: "Producing a podcast or radio show", sortOrder: 2, branchWeights: [{ branchName: "Journalism & Mass Communication", weight: 4 }, { branchName: "Music & Performing Arts", weight: 2 }] },
          { text: "Writing a book or publishing a story", sortOrder: 3, branchWeights: [{ branchName: "Literature & Writing", weight: 5 }] },
          { text: "Creating an art installation or exhibition", sortOrder: 4, branchWeights: [{ branchName: "Fine Arts & Design", weight: 5 }] },
        ],
      },
      {
        text: "Which describes your creative style?",
        options: [
          { text: "Visual — I communicate through images and design", sortOrder: 1, branchWeights: [{ branchName: "Fine Arts & Design", weight: 5 }] },
          { text: "Verbal — I communicate through words and writing", sortOrder: 2, branchWeights: [{ branchName: "Literature & Writing", weight: 4 }, { branchName: "Journalism & Mass Communication", weight: 3 }] },
          { text: "Performative — I communicate through movement and voice", sortOrder: 3, branchWeights: [{ branchName: "Music & Performing Arts", weight: 5 }] },
          { text: "Digital — I communicate through screens and storytelling", sortOrder: 4, branchWeights: [{ branchName: "Film & Media", weight: 5 }] },
        ],
      },
    ],
  },

  // ── Arts & Design (duplicate cluster) ────────────────────────────────────────
  {
    clusterName: "Arts & Design",
    questions: [
      {
        text: "Which design career excites you most?",
        options: [
          { text: "Designing logos, posters, and visual identities", sortOrder: 1, branchWeights: [{ branchName: "Graphic Design", weight: 5 }] },
          { text: "Creating animated characters and visual effects for films", sortOrder: 2, branchWeights: [{ branchName: "Animation & VFX", weight: 5 }] },
          { text: "Designing apps and websites for better user experience", sortOrder: 3, branchWeights: [{ branchName: "UX/UI Design", weight: 5 }] },
          { text: "Designing furniture, buildings, and interior spaces", sortOrder: 4, branchWeights: [{ branchName: "Interior Design", weight: 4 }, { branchName: "Product & Industrial Design", weight: 3 }] },
        ],
      },
      {
        text: "Which creative tool would you most like to master?",
        options: [
          { text: "Adobe Photoshop and Illustrator for graphics", sortOrder: 1, branchWeights: [{ branchName: "Graphic Design", weight: 5 }] },
          { text: "Maya, Blender, or After Effects for 3D/VFX", sortOrder: 2, branchWeights: [{ branchName: "Animation & VFX", weight: 5 }] },
          { text: "Figma or Sketch for digital product design", sortOrder: 3, branchWeights: [{ branchName: "UX/UI Design", weight: 5 }] },
          { text: "A camera for professional photography", sortOrder: 4, branchWeights: [{ branchName: "Photography", weight: 5 }] },
        ],
      },
      {
        text: "Where would you most like to work?",
        options: [
          { text: "A fashion house or clothing brand", sortOrder: 1, branchWeights: [{ branchName: "Fashion Design", weight: 5 }] },
          { text: "A visual effects company for Bollywood or Hollywood", sortOrder: 2, branchWeights: [{ branchName: "Animation & VFX", weight: 5 }] },
          { text: "A tech startup designing the user experience", sortOrder: 3, branchWeights: [{ branchName: "UX/UI Design", weight: 5 }] },
          { text: "A manufacturing company designing physical products", sortOrder: 4, branchWeights: [{ branchName: "Product & Industrial Design", weight: 5 }] },
        ],
      },
      {
        text: "Which creative challenge excites you most?",
        options: [
          { text: "Making an outfit that defines a new fashion trend", sortOrder: 1, branchWeights: [{ branchName: "Fashion Design", weight: 5 }] },
          { text: "Designing a home that feels comfortable and beautiful", sortOrder: 2, branchWeights: [{ branchName: "Interior Design", weight: 5 }] },
          { text: "Capturing the perfect photo that tells a story", sortOrder: 3, branchWeights: [{ branchName: "Photography", weight: 5 }] },
          { text: "Designing a new product that solves an everyday problem", sortOrder: 4, branchWeights: [{ branchName: "Product & Industrial Design", weight: 5 }] },
        ],
      },
      {
        text: "Which type of art or design do you most enjoy?",
        options: [
          { text: "Traditional painting and sculpture", sortOrder: 1, branchWeights: [{ branchName: "Fine Arts", weight: 5 }] },
          { text: "Digital animation and motion graphics", sortOrder: 2, branchWeights: [{ branchName: "Animation & VFX", weight: 5 }] },
          { text: "Photography and visual storytelling", sortOrder: 3, branchWeights: [{ branchName: "Photography", weight: 4 }, { branchName: "Graphic Design", weight: 2 }] },
          { text: "Fashion illustration and textile design", sortOrder: 4, branchWeights: [{ branchName: "Fashion Design", weight: 5 }] },
        ],
      },
    ],
  },

  // ── Creative Arts (duplicate cluster) ────────────────────────────────────────
  {
    clusterName: "Creative Arts",
    questions: [
      {
        text: "Which performing or creative role appeals most?",
        options: [
          { text: "Acting in films, web series, or on stage", sortOrder: 1, branchWeights: [{ branchName: "Acting & Theatre", weight: 5 }] },
          { text: "Directing films and telling visual stories", sortOrder: 2, branchWeights: [{ branchName: "Film Direction", weight: 5 }] },
          { text: "Composing music and producing songs", sortOrder: 3, branchWeights: [{ branchName: "Music & Sound Production", weight: 5 }] },
          { text: "Editing videos and creating post-production effects", sortOrder: 4, branchWeights: [{ branchName: "Video Editing & Post Production", weight: 5 }] },
        ],
      },
      {
        text: "Which type of content do you most like creating?",
        options: [
          { text: "Comedy sketches and stand-up content for social media", sortOrder: 1, branchWeights: [{ branchName: "Stand-up Comedy & Content Creation", weight: 5 }] },
          { text: "Screenplays or scripts for films and web shows", sortOrder: 2, branchWeights: [{ branchName: "Screenwriting & Content Writing", weight: 5 }] },
          { text: "Dance videos — classical or contemporary", sortOrder: 3, branchWeights: [{ branchName: "Dance (Classical/Contemporary)", weight: 5 }] },
          { text: "Behind-the-scenes camera work for films", sortOrder: 4, branchWeights: [{ branchName: "Cinematography", weight: 5 }] },
        ],
      },
      {
        text: "Which creative challenge excites you most?",
        options: [
          { text: "Creating music that millions of people stream", sortOrder: 1, branchWeights: [{ branchName: "Music & Sound Production", weight: 5 }] },
          { text: "Making a film that wins at an international festival", sortOrder: 2, branchWeights: [{ branchName: "Film Direction", weight: 4 }, { branchName: "Cinematography", weight: 3 }] },
          { text: "Writing a viral comedy show or web series", sortOrder: 3, branchWeights: [{ branchName: "Screenwriting & Content Writing", weight: 4 }, { branchName: "Stand-up Comedy & Content Creation", weight: 3 }] },
          { text: "Performing classical dance on a national stage", sortOrder: 4, branchWeights: [{ branchName: "Dance (Classical/Contemporary)", weight: 5 }] },
        ],
      },
      {
        text: "Which work environment suits you best?",
        options: [
          { text: "Live stage — performing in front of audiences", sortOrder: 1, branchWeights: [{ branchName: "Acting & Theatre", weight: 4 }, { branchName: "Dance (Classical/Contemporary)", weight: 4 }] },
          { text: "Recording studio — creating music or podcasts", sortOrder: 2, branchWeights: [{ branchName: "Music & Sound Production", weight: 5 }] },
          { text: "Film set — behind the camera shooting scenes", sortOrder: 3, branchWeights: [{ branchName: "Cinematography", weight: 4 }, { branchName: "Film Direction", weight: 3 }] },
          { text: "Home studio — creating content online", sortOrder: 4, branchWeights: [{ branchName: "Stand-up Comedy & Content Creation", weight: 4 }, { branchName: "Video Editing & Post Production", weight: 3 }] },
        ],
      },
      {
        text: "Which skill do you most want to master?",
        options: [
          { text: "Acting techniques and character development", sortOrder: 1, branchWeights: [{ branchName: "Acting & Theatre", weight: 5 }] },
          { text: "Cinematography and camera techniques", sortOrder: 2, branchWeights: [{ branchName: "Cinematography", weight: 5 }] },
          { text: "Writing scripts and telling compelling stories", sortOrder: 3, branchWeights: [{ branchName: "Screenwriting & Content Writing", weight: 5 }] },
          { text: "Video editing, colour grading, and visual effects", sortOrder: 4, branchWeights: [{ branchName: "Video Editing & Post Production", weight: 5 }] },
        ],
      },
    ],
  },

  // ── Law & Legal ───────────────────────────────────────────────────────────────
  {
    clusterName: "Law & Legal",
    questions: [
      {
        text: "Which area of law interests you most?",
        options: [
          { text: "Defending people accused of crimes in court", sortOrder: 1, branchWeights: [{ branchName: "Criminal Law", weight: 5 }] },
          { text: "Helping companies with mergers and contracts", sortOrder: 2, branchWeights: [{ branchName: "Corporate Law", weight: 5 }] },
          { text: "Protecting the rights of citizens through the constitution", sortOrder: 3, branchWeights: [{ branchName: "Constitutional Law", weight: 5 }] },
          { text: "Handling property disputes and ownership rights", sortOrder: 4, branchWeights: [{ branchName: "Civil Law", weight: 5 }] },
        ],
      },
      {
        text: "Which legal career role inspires you?",
        options: [
          { text: "A criminal defence lawyer fighting for justice", sortOrder: 1, branchWeights: [{ branchName: "Criminal Law", weight: 5 }] },
          { text: "A corporate lawyer for a Fortune 500 company", sortOrder: 2, branchWeights: [{ branchName: "Corporate Law", weight: 5 }] },
          { text: "A public interest lawyer arguing in the Supreme Court", sortOrder: 3, branchWeights: [{ branchName: "Constitutional Law", weight: 5 }] },
          { text: "An IP lawyer protecting inventors and creators", sortOrder: 4, branchWeights: [{ branchName: "Intellectual Property Law", weight: 5 }] },
        ],
      },
      {
        text: "Which type of case would you most like to argue?",
        options: [
          { text: "A murder trial with complex evidence", sortOrder: 1, branchWeights: [{ branchName: "Criminal Law", weight: 5 }] },
          { text: "A copyright infringement case for a musician", sortOrder: 2, branchWeights: [{ branchName: "Intellectual Property Law", weight: 5 }] },
          { text: "A company acquisition deal worth crores", sortOrder: 3, branchWeights: [{ branchName: "Corporate Law", weight: 5 }] },
          { text: "A civil rights case challenging a government policy", sortOrder: 4, branchWeights: [{ branchName: "Constitutional Law", weight: 4 }, { branchName: "Civil Law", weight: 3 }] },
        ],
      },
      {
        text: "Which skill do you want to develop most as a lawyer?",
        options: [
          { text: "Courtroom advocacy and cross-examination", sortOrder: 1, branchWeights: [{ branchName: "Criminal Law", weight: 4 }, { branchName: "Civil Law", weight: 3 }] },
          { text: "Contract drafting and deal negotiation", sortOrder: 2, branchWeights: [{ branchName: "Corporate Law", weight: 5 }] },
          { text: "Constitutional interpretation and legal research", sortOrder: 3, branchWeights: [{ branchName: "Constitutional Law", weight: 5 }] },
          { text: "Patent filing and intellectual property protection", sortOrder: 4, branchWeights: [{ branchName: "Intellectual Property Law", weight: 5 }] },
        ],
      },
      {
        text: "Where do you see yourself working as a lawyer?",
        options: [
          { text: "Inside a courtroom fighting for clients", sortOrder: 1, branchWeights: [{ branchName: "Criminal Law", weight: 4 }, { branchName: "Civil Law", weight: 3 }] },
          { text: "A law firm handling deals for large corporations", sortOrder: 2, branchWeights: [{ branchName: "Corporate Law", weight: 5 }] },
          { text: "The Supreme Court or High Court fighting civil rights cases", sortOrder: 3, branchWeights: [{ branchName: "Constitutional Law", weight: 5 }] },
          { text: "A tech company handling patents and software rights", sortOrder: 4, branchWeights: [{ branchName: "Intellectual Property Law", weight: 5 }] },
        ],
      },
    ],
  },

  // ── Law (duplicate cluster) ───────────────────────────────────────────────────
  {
    clusterName: "Law",
    questions: [
      {
        text: "Which area of law most excites you?",
        options: [
          { text: "Fighting cases in criminal courts", sortOrder: 1, branchWeights: [{ branchName: "Criminal Law", weight: 5 }] },
          { text: "Advising multinational companies on deals", sortOrder: 2, branchWeights: [{ branchName: "Corporate Law", weight: 5 }] },
          { text: "Fighting for rights through the constitution", sortOrder: 3, branchWeights: [{ branchName: "Civil & Constitutional Law", weight: 5 }] },
          { text: "Handling international treaties and trade disputes", sortOrder: 4, branchWeights: [{ branchName: "International Law", weight: 5 }] },
        ],
      },
      {
        text: "Which legal career goal inspires you?",
        options: [
          { text: "Becoming a judge in the High Court or Supreme Court", sortOrder: 1, branchWeights: [{ branchName: "Judiciary (Judge)", weight: 5 }] },
          { text: "Protecting digital data and online rights", sortOrder: 2, branchWeights: [{ branchName: "Cyber Law", weight: 5 }] },
          { text: "Protecting inventions, brands, and creative works", sortOrder: 3, branchWeights: [{ branchName: "Intellectual Property Law", weight: 5 }] },
          { text: "Working on global cases at the UN or WTO", sortOrder: 4, branchWeights: [{ branchName: "International Law", weight: 5 }] },
        ],
      },
      {
        text: "Which type of legal challenge would you enjoy solving?",
        options: [
          { text: "A cybercrime case involving hacking or online fraud", sortOrder: 1, branchWeights: [{ branchName: "Cyber Law", weight: 5 }] },
          { text: "A murder or serious crime trial", sortOrder: 2, branchWeights: [{ branchName: "Criminal Law", weight: 5 }] },
          { text: "A complex corporate merger or acquisition", sortOrder: 3, branchWeights: [{ branchName: "Corporate Law", weight: 5 }] },
          { text: "An international trade or diplomatic dispute", sortOrder: 4, branchWeights: [{ branchName: "International Law", weight: 5 }] },
        ],
      },
      {
        text: "Which daily work motivates you most?",
        options: [
          { text: "Writing legal opinions and research papers", sortOrder: 1, branchWeights: [{ branchName: "Civil & Constitutional Law", weight: 3 }, { branchName: "Judiciary (Judge)", weight: 4 }] },
          { text: "Negotiating contracts and business deals", sortOrder: 2, branchWeights: [{ branchName: "Corporate Law", weight: 5 }] },
          { text: "Arguing cases and cross-examining witnesses", sortOrder: 3, branchWeights: [{ branchName: "Criminal Law", weight: 4 }, { branchName: "Civil & Constitutional Law", weight: 3 }] },
          { text: "Advising companies on data and digital compliance", sortOrder: 4, branchWeights: [{ branchName: "Cyber Law", weight: 4 }, { branchName: "Intellectual Property Law", weight: 3 }] },
        ],
      },
      {
        text: "Where do you see yourself in 10 years?",
        options: [
          { text: "Sitting on the bench as a district judge", sortOrder: 1, branchWeights: [{ branchName: "Judiciary (Judge)", weight: 5 }] },
          { text: "Heading the legal team of a tech unicorn", sortOrder: 2, branchWeights: [{ branchName: "Cyber Law", weight: 3 }, { branchName: "Corporate Law", weight: 4 }] },
          { text: "Representing India at international courts", sortOrder: 3, branchWeights: [{ branchName: "International Law", weight: 5 }] },
          { text: "Running a successful independent law practice", sortOrder: 4, branchWeights: [{ branchName: "Criminal Law", weight: 3 }, { branchName: "Civil & Constitutional Law", weight: 3 }] },
        ],
      },
    ],
  },

  // ── Education & Teaching ──────────────────────────────────────────────────────
  {
    clusterName: "Education & Teaching",
    questions: [
      {
        text: "Which teaching role appeals to you most?",
        options: [
          { text: "Teaching young children in a primary school", sortOrder: 1, branchWeights: [{ branchName: "School Teaching", weight: 5 }] },
          { text: "Coaching students for competitive exams like JEE or NEET", sortOrder: 2, branchWeights: [{ branchName: "Coaching & Mentoring", weight: 5 }] },
          { text: "Lecturing at a university on a specialised subject", sortOrder: 3, branchWeights: [{ branchName: "College Professor", weight: 5 }] },
          { text: "Teaching students with learning disabilities", sortOrder: 4, branchWeights: [{ branchName: "Special Education", weight: 5 }] },
        ],
      },
      {
        text: "Which education challenge excites you?",
        options: [
          { text: "Making learning more fun and engaging for children", sortOrder: 1, branchWeights: [{ branchName: "School Teaching", weight: 4 }, { branchName: "EdTech & Online Education", weight: 3 }] },
          { text: "Building an app or platform that teaches millions online", sortOrder: 2, branchWeights: [{ branchName: "EdTech & Online Education", weight: 5 }] },
          { text: "Helping students who struggle with traditional education", sortOrder: 3, branchWeights: [{ branchName: "Special Education", weight: 5 }] },
          { text: "Guiding students about careers and life choices", sortOrder: 4, branchWeights: [{ branchName: "Coaching & Mentoring", weight: 5 }] },
        ],
      },
      {
        text: "What type of students do you want to teach?",
        options: [
          { text: "Young children — foundation-level learning", sortOrder: 1, branchWeights: [{ branchName: "School Teaching", weight: 5 }] },
          { text: "College students — advanced academic subjects", sortOrder: 2, branchWeights: [{ branchName: "College Professor", weight: 5 }] },
          { text: "Students with special needs who require extra support", sortOrder: 3, branchWeights: [{ branchName: "Special Education", weight: 5 }] },
          { text: "Learners everywhere through an online platform", sortOrder: 4, branchWeights: [{ branchName: "EdTech & Online Education", weight: 5 }] },
        ],
      },
      {
        text: "Which skill best describes you as a future educator?",
        options: [
          { text: "Patient and nurturing with young learners", sortOrder: 1, branchWeights: [{ branchName: "School Teaching", weight: 4 }, { branchName: "Special Education", weight: 4 }] },
          { text: "Innovative — making technology-based learning tools", sortOrder: 2, branchWeights: [{ branchName: "EdTech & Online Education", weight: 5 }] },
          { text: "Expert in a deep academic subject", sortOrder: 3, branchWeights: [{ branchName: "College Professor", weight: 5 }] },
          { text: "Motivational — inspiring students to achieve goals", sortOrder: 4, branchWeights: [{ branchName: "Coaching & Mentoring", weight: 5 }] },
        ],
      },
      {
        text: "Where would you most like to work?",
        options: [
          { text: "A government or private school", sortOrder: 1, branchWeights: [{ branchName: "School Teaching", weight: 5 }] },
          { text: "An edtech startup like BYJU's or Vedantu", sortOrder: 2, branchWeights: [{ branchName: "EdTech & Online Education", weight: 5 }] },
          { text: "A university or research college", sortOrder: 3, branchWeights: [{ branchName: "College Professor", weight: 5 }] },
          { text: "A special needs school or rehabilitation centre", sortOrder: 4, branchWeights: [{ branchName: "Special Education", weight: 5 }] },
        ],
      },
    ],
  },

  // ── Education (duplicate cluster) ─────────────────────────────────────────────
  {
    clusterName: "Education",
    questions: [
      {
        text: "Which education career excites you most?",
        options: [
          { text: "Teaching in a school — primary or secondary", sortOrder: 1, branchWeights: [{ branchName: "School Teaching", weight: 5 }] },
          { text: "Becoming a professor at a top university", sortOrder: 2, branchWeights: [{ branchName: "College/University Professor", weight: 5 }] },
          { text: "Creating edtech products used by millions", sortOrder: 3, branchWeights: [{ branchName: "Educational Technology (EdTech)", weight: 5 }] },
          { text: "Conducting academic research in a specialised field", sortOrder: 4, branchWeights: [{ branchName: "Research & Academia", weight: 5 }] },
        ],
      },
      {
        text: "Which education challenge motivates you?",
        options: [
          { text: "Helping students crack JEE, NEET, or UPSC", sortOrder: 1, branchWeights: [{ branchName: "Coaching & Competitive Exam Prep", weight: 5 }] },
          { text: "Guiding students with career and personal choices", sortOrder: 2, branchWeights: [{ branchName: "Educational Counselling", weight: 5 }] },
          { text: "Supporting children with disabilities in learning", sortOrder: 3, branchWeights: [{ branchName: "Special Education", weight: 5 }] },
          { text: "Getting schoolchildren interested in STEM", sortOrder: 4, branchWeights: [{ branchName: "School Teaching", weight: 3 }, { branchName: "Educational Technology (EdTech)", weight: 4 }] },
        ],
      },
      {
        text: "Where do you see yourself working in education?",
        options: [
          { text: "A government school or Kendriya Vidyalaya (KVS)", sortOrder: 1, branchWeights: [{ branchName: "School Teaching", weight: 5 }] },
          { text: "A research institution or IIT/IIM", sortOrder: 2, branchWeights: [{ branchName: "Research & Academia", weight: 5 }] },
          { text: "An online learning platform or edtech company", sortOrder: 3, branchWeights: [{ branchName: "Educational Technology (EdTech)", weight: 5 }] },
          { text: "A counselling centre helping students with choices", sortOrder: 4, branchWeights: [{ branchName: "Educational Counselling", weight: 5 }] },
        ],
      },
      {
        text: "Which type of work inspires you most?",
        options: [
          { text: "Preparing students for competitive exams through coaching", sortOrder: 1, branchWeights: [{ branchName: "Coaching & Competitive Exam Prep", weight: 5 }] },
          { text: "Doing publishable research in a specialised subject", sortOrder: 2, branchWeights: [{ branchName: "Research & Academia", weight: 5 }] },
          { text: "Counselling students about college and careers", sortOrder: 3, branchWeights: [{ branchName: "Educational Counselling", weight: 5 }] },
          { text: "Teaching children with special learning needs", sortOrder: 4, branchWeights: [{ branchName: "Special Education", weight: 5 }] },
        ],
      },
      {
        text: "Which qualification would you most like to earn?",
        options: [
          { text: "B.Ed — Bachelor of Education (teacher training)", sortOrder: 1, branchWeights: [{ branchName: "School Teaching", weight: 5 }] },
          { text: "PhD — to become a researcher and professor", sortOrder: 2, branchWeights: [{ branchName: "Research & Academia", weight: 4 }, { branchName: "College/University Professor", weight: 4 }] },
          { text: "M.Ed in Special Education", sortOrder: 3, branchWeights: [{ branchName: "Special Education", weight: 5 }] },
          { text: "Counselling psychology or guidance counselling", sortOrder: 4, branchWeights: [{ branchName: "Educational Counselling", weight: 5 }] },
        ],
      },
    ],
  },

  // ── Government & Civil Services ───────────────────────────────────────────────
  {
    clusterName: "Government & Civil Services",
    questions: [
      {
        text: "Which government career role inspires you?",
        options: [
          { text: "Joining IAS or IPS through the UPSC exam", sortOrder: 1, branchWeights: [{ branchName: "IAS / IPS (UPSC)", weight: 5 }] },
          { text: "Working in a government bank like SBI or RBI", sortOrder: 2, branchWeights: [{ branchName: "Government Banking (SBI/RBI)", weight: 5 }] },
          { text: "Researching and shaping government policy", sortOrder: 3, branchWeights: [{ branchName: "Policy & Think Tanks", weight: 5 }] },
          { text: "Working for a Public Sector Undertaking like ONGC or NTPC", sortOrder: 4, branchWeights: [{ branchName: "Public Sector Undertakings", weight: 5 }] },
        ],
      },
      {
        text: "Which type of service motivates you?",
        options: [
          { text: "Serving citizens directly as a district collector", sortOrder: 1, branchWeights: [{ branchName: "IAS / IPS (UPSC)", weight: 5 }] },
          { text: "Setting economic and fiscal policy for the country", sortOrder: 2, branchWeights: [{ branchName: "Policy & Think Tanks", weight: 4 }, { branchName: "Government Banking (SBI/RBI)", weight: 3 }] },
          { text: "State-level administration and public welfare", sortOrder: 3, branchWeights: [{ branchName: "State Civil Services", weight: 5 }] },
          { text: "Running major infrastructure projects for India", sortOrder: 4, branchWeights: [{ branchName: "Public Sector Undertakings", weight: 5 }] },
        ],
      },
      {
        text: "Which exam would you most like to prepare for?",
        options: [
          { text: "UPSC Civil Services (IAS/IPS/IFS)", sortOrder: 1, branchWeights: [{ branchName: "IAS / IPS (UPSC)", weight: 5 }] },
          { text: "IBPS PO or SBI PO (banking exams)", sortOrder: 2, branchWeights: [{ branchName: "Government Banking (SBI/RBI)", weight: 5 }] },
          { text: "State PSC (for state government officer roles)", sortOrder: 3, branchWeights: [{ branchName: "State Civil Services", weight: 5 }] },
          { text: "PSU recruitment (GATE-based for technical posts)", sortOrder: 4, branchWeights: [{ branchName: "Public Sector Undertakings", weight: 5 }] },
        ],
      },
      {
        text: "What kind of work environment do you prefer?",
        options: [
          { text: "On the ground interacting with citizens and communities", sortOrder: 1, branchWeights: [{ branchName: "IAS / IPS (UPSC)", weight: 4 }, { branchName: "State Civil Services", weight: 3 }] },
          { text: "In an office researching and writing policy reports", sortOrder: 2, branchWeights: [{ branchName: "Policy & Think Tanks", weight: 5 }] },
          { text: "In a bank branch or finance department", sortOrder: 3, branchWeights: [{ branchName: "Government Banking (SBI/RBI)", weight: 5 }] },
          { text: "In a major PSU managing projects at scale", sortOrder: 4, branchWeights: [{ branchName: "Public Sector Undertakings", weight: 5 }] },
        ],
      },
      {
        text: "What motivates you about public service?",
        options: [
          { text: "Making a real impact on millions of people's lives", sortOrder: 1, branchWeights: [{ branchName: "IAS / IPS (UPSC)", weight: 4 }, { branchName: "State Civil Services", weight: 3 }] },
          { text: "Driving national economic policy and growth", sortOrder: 2, branchWeights: [{ branchName: "Policy & Think Tanks", weight: 5 }] },
          { text: "Financial stability and a respected banking career", sortOrder: 3, branchWeights: [{ branchName: "Government Banking (SBI/RBI)", weight: 5 }] },
          { text: "Building critical national infrastructure", sortOrder: 4, branchWeights: [{ branchName: "Public Sector Undertakings", weight: 5 }] },
        ],
      },
    ],
  },

  // ── Government (duplicate cluster) ────────────────────────────────────────────
  {
    clusterName: "Government",
    questions: [
      {
        text: "Which government career path excites you most?",
        options: [
          { text: "Becoming an IAS/IPS officer through UPSC", sortOrder: 1, branchWeights: [{ branchName: "UPSC Civil Services (IAS/IPS/IFS)", weight: 5 }] },
          { text: "Joining the State PSC as a state civil servant", sortOrder: 2, branchWeights: [{ branchName: "State PSC", weight: 5 }] },
          { text: "Getting a government banking job (IBPS/SBI)", sortOrder: 3, branchWeights: [{ branchName: "Banking (IBPS/SBI)", weight: 5 }] },
          { text: "Joining a Railway service through RRB exams", sortOrder: 4, branchWeights: [{ branchName: "Railway Services (RRB)", weight: 5 }] },
        ],
      },
      {
        text: "Which type of government work motivates you?",
        options: [
          { text: "Teaching in government schools (KVS/NVS)", sortOrder: 1, branchWeights: [{ branchName: "Teaching (KVS/NVS/DSSSB)", weight: 5 }] },
          { text: "Working for SSC CGL/CHSL in central government offices", sortOrder: 2, branchWeights: [{ branchName: "SSC (CGL/CHSL)", weight: 5 }] },
          { text: "Protecting forests and wildlife as a Forest Officer (IFoS)", sortOrder: 3, branchWeights: [{ branchName: "Indian Forest Service (IFoS)", weight: 5 }] },
          { text: "Working in a Public Sector Undertaking (PSU)", sortOrder: 4, branchWeights: [{ branchName: "Public Sector Undertakings (PSUs)", weight: 5 }] },
        ],
      },
      {
        text: "Which exam sounds most interesting to prepare for?",
        options: [
          { text: "UPSC — one of the toughest exams in India", sortOrder: 1, branchWeights: [{ branchName: "UPSC Civil Services (IAS/IPS/IFS)", weight: 5 }] },
          { text: "IBPS PO or SBI PO — for banking careers", sortOrder: 2, branchWeights: [{ branchName: "Banking (IBPS/SBI)", weight: 5 }] },
          { text: "SSC CGL — for central government group B/C jobs", sortOrder: 3, branchWeights: [{ branchName: "SSC (CGL/CHSL)", weight: 5 }] },
          { text: "RRB NTPC or Group D — for railway services", sortOrder: 4, branchWeights: [{ branchName: "Railway Services (RRB)", weight: 5 }] },
        ],
      },
      {
        text: "What do you most value in a government career?",
        options: [
          { text: "Authority to govern and help millions of citizens", sortOrder: 1, branchWeights: [{ branchName: "UPSC Civil Services (IAS/IPS/IFS)", weight: 4 }, { branchName: "State PSC", weight: 3 }] },
          { text: "Job stability and government benefits", sortOrder: 2, branchWeights: [{ branchName: "SSC (CGL/CHSL)", weight: 4 }, { branchName: "Banking (IBPS/SBI)", weight: 3 }] },
          { text: "Working outdoors, protecting natural resources", sortOrder: 3, branchWeights: [{ branchName: "Indian Forest Service (IFoS)", weight: 5 }] },
          { text: "Technical work in railways or public infrastructure", sortOrder: 4, branchWeights: [{ branchName: "Railway Services (RRB)", weight: 4 }, { branchName: "Public Sector Undertakings (PSUs)", weight: 3 }] },
        ],
      },
      {
        text: "Where would you like to serve as a government employee?",
        options: [
          { text: "As a district collector managing local administration", sortOrder: 1, branchWeights: [{ branchName: "UPSC Civil Services (IAS/IPS/IFS)", weight: 5 }] },
          { text: "As a teacher in a government school nationwide", sortOrder: 2, branchWeights: [{ branchName: "Teaching (KVS/NVS/DSSSB)", weight: 5 }] },
          { text: "In the finance department of a nationalised bank", sortOrder: 3, branchWeights: [{ branchName: "Banking (IBPS/SBI)", weight: 5 }] },
          { text: "At a major PSU engineering India's infrastructure", sortOrder: 4, branchWeights: [{ branchName: "Public Sector Undertakings (PSUs)", weight: 5 }] },
        ],
      },
    ],
  },

  // ── Defence & Security ────────────────────────────────────────────────────────
  {
    clusterName: "Defence & Security",
    questions: [
      {
        text: "Which defence career appeals to you most?",
        options: [
          { text: "Serving as a soldier in the Indian Army", sortOrder: 1, branchWeights: [{ branchName: "Indian Army", weight: 5 }] },
          { text: "Flying fighter jets in the Indian Air Force", sortOrder: 2, branchWeights: [{ branchName: "Indian Air Force", weight: 5 }] },
          { text: "Operating warships in the Indian Navy", sortOrder: 3, branchWeights: [{ branchName: "Indian Navy", weight: 5 }] },
          { text: "Working in intelligence and national security", sortOrder: 4, branchWeights: [{ branchName: "Intelligence & Security", weight: 5 }] },
        ],
      },
      {
        text: "Which environment would you most like to work in?",
        options: [
          { text: "Mountains, jungles, or desert terrain on land", sortOrder: 1, branchWeights: [{ branchName: "Indian Army", weight: 5 }] },
          { text: "In the cockpit of aircraft above the clouds", sortOrder: 2, branchWeights: [{ branchName: "Indian Air Force", weight: 5 }] },
          { text: "On a warship in the deep ocean", sortOrder: 3, branchWeights: [{ branchName: "Indian Navy", weight: 5 }] },
          { text: "Joining the NDA straight after Class 12", sortOrder: 4, branchWeights: [{ branchName: "NDA / CDS", weight: 5 }] },
        ],
      },
      {
        text: "Which type of challenge excites you most?",
        options: [
          { text: "Physical combat readiness and tactical warfare", sortOrder: 1, branchWeights: [{ branchName: "Indian Army", weight: 4 }, { branchName: "NDA / CDS", weight: 3 }] },
          { text: "Aerial combat and strategic air operations", sortOrder: 2, branchWeights: [{ branchName: "Indian Air Force", weight: 5 }] },
          { text: "Cyber intelligence and counter-surveillance", sortOrder: 3, branchWeights: [{ branchName: "Intelligence & Security", weight: 5 }] },
          { text: "Naval operations and maritime protection", sortOrder: 4, branchWeights: [{ branchName: "Indian Navy", weight: 5 }] },
        ],
      },
      {
        text: "Which exam or path would you most like to pursue?",
        options: [
          { text: "NDA (National Defence Academy) exam after Class 12", sortOrder: 1, branchWeights: [{ branchName: "NDA / CDS", weight: 5 }] },
          { text: "Joining the Army as an officer through CDS or SSB", sortOrder: 2, branchWeights: [{ branchName: "Indian Army", weight: 4 }, { branchName: "NDA / CDS", weight: 3 }] },
          { text: "IAF technical or pilot entrance tests", sortOrder: 3, branchWeights: [{ branchName: "Indian Air Force", weight: 5 }] },
          { text: "Intelligence Bureau or R&AW selection", sortOrder: 4, branchWeights: [{ branchName: "Intelligence & Security", weight: 5 }] },
        ],
      },
      {
        text: "What motivates you to serve the nation?",
        options: [
          { text: "Physical courage and protecting the borders of India", sortOrder: 1, branchWeights: [{ branchName: "Indian Army", weight: 4 }, { branchName: "NDA / CDS", weight: 3 }] },
          { text: "Technological power and aerial superiority", sortOrder: 2, branchWeights: [{ branchName: "Indian Air Force", weight: 5 }] },
          { text: "Gathering intelligence and outthinking the enemy", sortOrder: 3, branchWeights: [{ branchName: "Intelligence & Security", weight: 5 }] },
          { text: "Protecting sea lanes and India's coastline", sortOrder: 4, branchWeights: [{ branchName: "Indian Navy", weight: 5 }] },
        ],
      },
    ],
  },

  // ── Defence (duplicate cluster) ───────────────────────────────────────────────
  {
    clusterName: "Defence",
    questions: [
      {
        text: "Which branch of the armed forces excites you most?",
        options: [
          { text: "Indian Army — ground combat and strategy", sortOrder: 1, branchWeights: [{ branchName: "Indian Army", weight: 5 }] },
          { text: "Indian Air Force — aviation and aerial operations", sortOrder: 2, branchWeights: [{ branchName: "Indian Air Force", weight: 5 }] },
          { text: "Indian Navy — naval warfare and sea operations", sortOrder: 3, branchWeights: [{ branchName: "Indian Navy", weight: 5 }] },
          { text: "National Defence Academy (NDA) — officer track from Class 12", sortOrder: 4, branchWeights: [{ branchName: "National Defence Academy (NDA)", weight: 5 }] },
        ],
      },
      {
        text: "Which defence service interests you most?",
        options: [
          { text: "Paramilitary forces like CRPF, BSF, or CISF", sortOrder: 1, branchWeights: [{ branchName: "Paramilitary Forces (CRPF/BSF/CISF)", weight: 5 }] },
          { text: "Defending India through DRDO weapons research", sortOrder: 2, branchWeights: [{ branchName: "Defence Research (DRDO)", weight: 5 }] },
          { text: "Indian Coast Guard — protecting maritime borders", sortOrder: 3, branchWeights: [{ branchName: "Indian Coast Guard", weight: 5 }] },
          { text: "Indian Navy — deep sea warfare operations", sortOrder: 4, branchWeights: [{ branchName: "Indian Navy", weight: 5 }] },
        ],
      },
      {
        text: "Which skill would you most like to develop for defence?",
        options: [
          { text: "Combat tactics and physical fitness", sortOrder: 1, branchWeights: [{ branchName: "Indian Army", weight: 4 }, { branchName: "Paramilitary Forces (CRPF/BSF/CISF)", weight: 3 }] },
          { text: "Aerospace engineering and pilot skills", sortOrder: 2, branchWeights: [{ branchName: "Indian Air Force", weight: 5 }] },
          { text: "Weapons research and advanced technology", sortOrder: 3, branchWeights: [{ branchName: "Defence Research (DRDO)", weight: 5 }] },
          { text: "Maritime navigation and underwater operations", sortOrder: 4, branchWeights: [{ branchName: "Indian Coast Guard", weight: 3 }, { branchName: "Indian Navy", weight: 4 }] },
        ],
      },
      {
        text: "Which exam or selection process interests you?",
        options: [
          { text: "NDA written exam and SSB interview", sortOrder: 1, branchWeights: [{ branchName: "National Defence Academy (NDA)", weight: 5 }] },
          { text: "GATE and DRDO SET for research and technology", sortOrder: 2, branchWeights: [{ branchName: "Defence Research (DRDO)", weight: 5 }] },
          { text: "Paramilitary (CAPF) assistant commandant exam", sortOrder: 3, branchWeights: [{ branchName: "Paramilitary Forces (CRPF/BSF/CISF)", weight: 5 }] },
          { text: "Indian Coast Guard recruitment test", sortOrder: 4, branchWeights: [{ branchName: "Indian Coast Guard", weight: 5 }] },
        ],
      },
      {
        text: "What aspect of national defence motivates you most?",
        options: [
          { text: "Protecting India's land borders", sortOrder: 1, branchWeights: [{ branchName: "Indian Army", weight: 4 }, { branchName: "Paramilitary Forces (CRPF/BSF/CISF)", weight: 3 }] },
          { text: "Advancing India's defence through technology", sortOrder: 2, branchWeights: [{ branchName: "Defence Research (DRDO)", weight: 5 }] },
          { text: "Securing India's coastline and sea trade", sortOrder: 3, branchWeights: [{ branchName: "Indian Coast Guard", weight: 4 }, { branchName: "Indian Navy", weight: 3 }] },
          { text: "Air superiority and aerial strike capability", sortOrder: 4, branchWeights: [{ branchName: "Indian Air Force", weight: 5 }] },
        ],
      },
    ],
  },

  // ── Sports ────────────────────────────────────────────────────────────────────
  {
    clusterName: "Sports",
    questions: [
      {
        text: "Which sports career role appeals to you most?",
        options: [
          { text: "Competing as a professional athlete", sortOrder: 1, branchWeights: [{ branchName: "Professional Athlete", weight: 5 }] },
          { text: "Coaching and training the next generation of players", sortOrder: 2, branchWeights: [{ branchName: "Sports Coaching", weight: 5 }] },
          { text: "Managing athletes and sports organisations", sortOrder: 3, branchWeights: [{ branchName: "Sports Management", weight: 5 }] },
          { text: "Reporting on matches and covering sports events", sortOrder: 4, branchWeights: [{ branchName: "Sports Journalism", weight: 5 }] },
        ],
      },
      {
        text: "Which sports-adjacent career interests you?",
        options: [
          { text: "Keeping athletes fit as a personal trainer", sortOrder: 1, branchWeights: [{ branchName: "Fitness & Personal Training", weight: 5 }] },
          { text: "Treating sports injuries as a physiotherapist", sortOrder: 2, branchWeights: [{ branchName: "Sports Medicine & Physiotherapy", weight: 5 }] },
          { text: "Helping athletes manage pressure and performance", sortOrder: 3, branchWeights: [{ branchName: "Sports Psychology", weight: 5 }] },
          { text: "Organising and running sports events", sortOrder: 4, branchWeights: [{ branchName: "Sports Management", weight: 5 }] },
        ],
      },
      {
        text: "Which skill do you most want to develop in sports?",
        options: [
          { text: "Athletic performance — speed, strength, technique", sortOrder: 1, branchWeights: [{ branchName: "Professional Athlete", weight: 5 }] },
          { text: "Coaching strategy and player development", sortOrder: 2, branchWeights: [{ branchName: "Sports Coaching", weight: 5 }] },
          { text: "Understanding sports psychology and mental performance", sortOrder: 3, branchWeights: [{ branchName: "Sports Psychology", weight: 5 }] },
          { text: "Broadcasting and sports storytelling", sortOrder: 4, branchWeights: [{ branchName: "Sports Journalism", weight: 5 }] },
        ],
      },
      {
        text: "Where do you see yourself in sports in 10 years?",
        options: [
          { text: "Representing India at the Olympics or World Cup", sortOrder: 1, branchWeights: [{ branchName: "Professional Athlete", weight: 5 }] },
          { text: "Coaching a national or international sports team", sortOrder: 2, branchWeights: [{ branchName: "Sports Coaching", weight: 5 }] },
          { text: "Running a sports academy or management firm", sortOrder: 3, branchWeights: [{ branchName: "Sports Management", weight: 4 }, { branchName: "Fitness & Personal Training", weight: 2 }] },
          { text: "As a known sports commentator or journalist", sortOrder: 4, branchWeights: [{ branchName: "Sports Journalism", weight: 5 }] },
        ],
      },
      {
        text: "What motivates you most in sports?",
        options: [
          { text: "The thrill of competition and winning", sortOrder: 1, branchWeights: [{ branchName: "Professional Athlete", weight: 5 }] },
          { text: "Helping people reach peak physical health", sortOrder: 2, branchWeights: [{ branchName: "Fitness & Personal Training", weight: 4 }, { branchName: "Sports Medicine & Physiotherapy", weight: 3 }] },
          { text: "The science behind human performance and recovery", sortOrder: 3, branchWeights: [{ branchName: "Sports Medicine & Physiotherapy", weight: 4 }, { branchName: "Sports Psychology", weight: 3 }] },
          { text: "Sharing the excitement of sports with the world", sortOrder: 4, branchWeights: [{ branchName: "Sports Journalism", weight: 4 }, { branchName: "Sports Management", weight: 3 }] },
        ],
      },
    ],
  },

  // ── Vocational ────────────────────────────────────────────────────────────────
  {
    clusterName: "Vocational",
    questions: [
      {
        text: "Which hands-on career appeals to you most?",
        options: [
          { text: "Growing crops, running a farm, or working in agriculture", sortOrder: 1, branchWeights: [{ branchName: "Agriculture & Farming", weight: 5 }] },
          { text: "Cooking and creating dishes as a professional chef", sortOrder: 2, branchWeights: [{ branchName: "Culinary Arts (Chef)", weight: 5 }] },
          { text: "Working in a hotel and making guests feel welcome", sortOrder: 3, branchWeights: [{ branchName: "Hotel Management & Hospitality", weight: 5 }] },
          { text: "Planning events, weddings, and conferences", sortOrder: 4, branchWeights: [{ branchName: "Event Management", weight: 5 }] },
        ],
      },
      {
        text: "Which technical trade skill interests you most?",
        options: [
          { text: "Repairing and maintaining cars and vehicles", sortOrder: 1, branchWeights: [{ branchName: "Automobile Mechanic & Technician", weight: 5 }] },
          { text: "Installing and repairing electrical systems or plumbing", sortOrder: 2, branchWeights: [{ branchName: "Electrician & Plumbing", weight: 5 }] },
          { text: "Styling hair, beauty, and wellness treatments", sortOrder: 3, branchWeights: [{ branchName: "Beauty & Wellness", weight: 5 }] },
          { text: "Guiding tourists and helping people travel", sortOrder: 4, branchWeights: [{ branchName: "Travel & Tourism", weight: 5 }] },
        ],
      },
      {
        text: "Where would you most like to work?",
        options: [
          { text: "On a farm or in the agricultural sector", sortOrder: 1, branchWeights: [{ branchName: "Agriculture & Farming", weight: 5 }] },
          { text: "A hotel, resort, or restaurant kitchen", sortOrder: 2, branchWeights: [{ branchName: "Hotel Management & Hospitality", weight: 4 }, { branchName: "Culinary Arts (Chef)", weight: 4 }] },
          { text: "A beauty salon or wellness spa", sortOrder: 3, branchWeights: [{ branchName: "Beauty & Wellness", weight: 5 }] },
          { text: "A travel agency or tour operator", sortOrder: 4, branchWeights: [{ branchName: "Travel & Tourism", weight: 5 }] },
        ],
      },
      {
        text: "Which skill do you enjoy practicing most?",
        options: [
          { text: "Cooking and experimenting with new recipes", sortOrder: 1, branchWeights: [{ branchName: "Culinary Arts (Chef)", weight: 5 }] },
          { text: "Fixing machines and understanding how they work", sortOrder: 2, branchWeights: [{ branchName: "Automobile Mechanic & Technician", weight: 4 }, { branchName: "Electrician & Plumbing", weight: 3 }] },
          { text: "Organising and making events run smoothly", sortOrder: 3, branchWeights: [{ branchName: "Event Management", weight: 5 }] },
          { text: "Making people look and feel their best", sortOrder: 4, branchWeights: [{ branchName: "Beauty & Wellness", weight: 5 }] },
        ],
      },
      {
        text: "What kind of career goal motivates you?",
        options: [
          { text: "Opening my own restaurant or food business", sortOrder: 1, branchWeights: [{ branchName: "Culinary Arts (Chef)", weight: 4 }, { branchName: "Hotel Management & Hospitality", weight: 3 }] },
          { text: "Running my own garage or automobile workshop", sortOrder: 2, branchWeights: [{ branchName: "Automobile Mechanic & Technician", weight: 5 }] },
          { text: "Starting a travel and tourism company", sortOrder: 3, branchWeights: [{ branchName: "Travel & Tourism", weight: 5 }] },
          { text: "Growing organic crops or running a modern farm", sortOrder: 4, branchWeights: [{ branchName: "Agriculture & Farming", weight: 5 }] },
        ],
      },
    ],
  },
];

// ─── Main seeder ──────────────────────────────────────────────────────────────

async function main() {
  console.log("Seeding BRANCH questions for all career clusters...\n");

  let totalCreated = 0;

  // First delete any existing branch questions
  const deleted = await prisma.question.deleteMany({
    where: { forAssessment: "BRANCH" },
  });
  console.log(`Deleted ${deleted.count} existing BRANCH questions.\n`);

  for (const clusterData of DATA) {
    // Find the cluster
    const cluster = await prisma.careerCluster.findFirst({
      where: { name: clusterData.clusterName },
      include: { branches: true },
    });

    if (!cluster) {
      console.warn(`⚠ Cluster not found: "${clusterData.clusterName}" — skipping.`);
      continue;
    }

    // Build a map of branch name → branch id
    const branchMap = new Map<string, string>();
    for (const b of cluster.branches) {
      branchMap.set(b.name, b.id);
    }

    let clusterQ = 0;
    for (const q of clusterData.questions) {
      const question = await prisma.question.create({
        data: {
          text: q.text,
          type: "INTEREST",
          classMin: 6,
          classMax: 12,
          forAssessment: "BRANCH",
          isActive: true,
          clusterId: cluster.id,
          options: {
            create: q.options.map((opt) => ({
              text: opt.text,
              sortOrder: opt.sortOrder,
              weights: {
                create: opt.branchWeights
                  .filter((bw) => branchMap.has(bw.branchName))
                  .map((bw) => ({
                    branchId: branchMap.get(bw.branchName)!,
                    weight: bw.weight,
                  })),
              },
            })),
          },
        },
      });

      // Warn if any branch weights were missing
      for (const opt of q.options) {
        for (const bw of opt.branchWeights) {
          if (!branchMap.has(bw.branchName)) {
            console.warn(
              `  ⚠ Branch not found: "${bw.branchName}" in cluster "${clusterData.clusterName}" — weight skipped.`
            );
          }
        }
      }

      clusterQ++;
      totalCreated++;
    }

    console.log(`✔ ${clusterData.clusterName}: ${clusterQ} questions created`);
  }

  console.log(`\nDone! Total BRANCH questions created: ${totalCreated}`);
}

main()
  .catch((e) => {
    console.error("Error:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

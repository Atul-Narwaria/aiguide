import { PrismaClient } from "@prisma/client";
import { seedCareers } from "./seed-careers";
import { INTEREST_QUESTIONS } from "./questions-interest";
import { APTITUDE_QUESTIONS, PERSONALITY_QUESTIONS, LEARNING_STYLE_QUESTIONS, VALUES_QUESTIONS } from "./questions-other";
import { QuestionTemplate } from "./questions-interest";

const prisma = new PrismaClient();

// ============================================================
// QUESTION VARIATION GENERATOR
// Creates variations of base questions to reach 1000+ total
// ============================================================

const INTEREST_PREFIXES = [
  "Imagine you are choosing a career path. ",
  "Think about your ideal future. ",
  "If you had complete freedom to choose, ",
  "Consider what truly excites you. ",
  "Your best friend asks for career advice. ",
  "You are at a career counseling session. ",
  "A mentor asks you to reflect. ",
  "During a self-discovery workshop, you realize ",
  "Looking at your strengths, ",
  "Based on what makes you happiest, ",
];

const INTEREST_VARIATIONS: Array<{ text: string; options: Array<{ text: string; weights: Record<string, number> }> }> = [
  { text: "What kind of problems do you enjoy solving?",
    options: [
      { text: "Technical and engineering challenges", weights: { "Engineering": 3, "Technology & IT": 2 } },
      { text: "Health and biological puzzles", weights: { "Medical & Healthcare": 3, "Science & Research": 1 } },
      { text: "Financial and business strategy", weights: { "Business & Commerce": 3 } },
      { text: "Creative and design challenges", weights: { "Arts & Humanities": 3 } },
    ] },
  { text: "If you could master one skill overnight, it would be:",
    options: [
      { text: "Programming and software development", weights: { "Technology & IT": 3, "Engineering": 1 } },
      { text: "Public speaking and persuasion", weights: { "Law & Legal": 2, "Business & Commerce": 2 } },
      { text: "Surgery or medical diagnosis", weights: { "Medical & Healthcare": 3 } },
      { text: "Playing a musical instrument or painting", weights: { "Arts & Humanities": 3 } },
    ] },
  { text: "Your contribution to India's future would ideally be through:",
    options: [
      { text: "Building world-class technology infrastructure", weights: { "Technology & IT": 3, "Engineering": 2 } },
      { text: "Improving public health and wellness", weights: { "Medical & Healthcare": 3, "Government & Civil Services": 1 } },
      { text: "Strengthening the economy and creating jobs", weights: { "Business & Commerce": 3, "Government & Civil Services": 1 } },
      { text: "Preserving and promoting Indian culture and arts", weights: { "Arts & Humanities": 3, "Education & Teaching": 1 } },
    ] },
  { text: "Which exam preparation excites you the most?",
    options: [
      { text: "JEE / engineering entrance exams", weights: { "Engineering": 3, "Science & Research": 1 } },
      { text: "NEET / medical entrance exams", weights: { "Medical & Healthcare": 3, "Science & Research": 1 } },
      { text: "UPSC / civil services preparation", weights: { "Government & Civil Services": 3, "Law & Legal": 1 } },
      { text: "NID / NIFT / creative entrance exams", weights: { "Arts & Humanities": 3 } },
    ] },
  { text: "What role would you play in a disaster relief effort?",
    options: [
      { text: "Setting up communication and tech systems", weights: { "Technology & IT": 3, "Engineering": 1 } },
      { text: "Providing medical first aid and treatment", weights: { "Medical & Healthcare": 3, "Defence & Security": 1 } },
      { text: "Coordinating logistics and resources", weights: { "Business & Commerce": 2, "Government & Civil Services": 2 } },
      { text: "Leading the rescue team on the ground", weights: { "Defence & Security": 3, "Government & Civil Services": 1 } },
    ] },
  { text: "What kind of company would you start?",
    options: [
      { text: "A tech startup solving a real problem", weights: { "Technology & IT": 3, "Engineering": 1 } },
      { text: "A healthcare chain making quality care affordable", weights: { "Medical & Healthcare": 3, "Business & Commerce": 1 } },
      { text: "A financial services or consulting firm", weights: { "Business & Commerce": 3 } },
      { text: "A media or creative agency", weights: { "Arts & Humanities": 3, "Business & Commerce": 1 } },
    ] },
  { text: "Which section of a newspaper would you read first?",
    options: [
      { text: "Technology and Science", weights: { "Technology & IT": 2, "Science & Research": 2, "Engineering": 1 } },
      { text: "Business and Economy", weights: { "Business & Commerce": 3, "Government & Civil Services": 1 } },
      { text: "Health and Wellness", weights: { "Medical & Healthcare": 3 } },
      { text: "Art, Culture, and Entertainment", weights: { "Arts & Humanities": 3 } },
    ] },
  { text: "Your ideal mentor would be someone from:",
    options: [
      { text: "IIT or a top engineering institute", weights: { "Engineering": 3, "Technology & IT": 1 } },
      { text: "AIIMS or a leading hospital", weights: { "Medical & Healthcare": 3 } },
      { text: "IIM or a top business school", weights: { "Business & Commerce": 3 } },
      { text: "National Defence Academy or the military", weights: { "Defence & Security": 3 } },
    ] },
  { text: "When thinking about college, you're most excited about:",
    options: [
      { text: "Access to high-tech labs and research facilities", weights: { "Engineering": 2, "Science & Research": 2, "Technology & IT": 1 } },
      { text: "Clinical rotations and hospital exposure", weights: { "Medical & Healthcare": 3 } },
      { text: "Campus placements and industry connections", weights: { "Business & Commerce": 3 } },
      { text: "Creative studios and performance spaces", weights: { "Arts & Humanities": 3 } },
    ] },
  { text: "Which of these jobs would you never get bored of?",
    options: [
      { text: "Data analyst finding hidden patterns", weights: { "Technology & IT": 3, "Science & Research": 2 } },
      { text: "Doctor treating different cases every day", weights: { "Medical & Healthcare": 3 } },
      { text: "Lawyer arguing unique cases in court", weights: { "Law & Legal": 3 } },
      { text: "Filmmaker telling new stories", weights: { "Arts & Humanities": 3 } },
    ] },
  { text: "What do you notice first when visiting a new place?",
    options: [
      { text: "The infrastructure and architecture", weights: { "Engineering": 3, "Science & Research": 1 } },
      { text: "The local businesses and economy", weights: { "Business & Commerce": 3 } },
      { text: "The art, culture, and local traditions", weights: { "Arts & Humanities": 3, "Education & Teaching": 1 } },
      { text: "The governance and public services quality", weights: { "Government & Civil Services": 3, "Law & Legal": 1 } },
    ] },
  { text: "Your approach to a group assignment is usually:",
    options: [
      { text: "Take charge of the technical/analytical part", weights: { "Engineering": 2, "Science & Research": 2, "Technology & IT": 1 } },
      { text: "Lead the team and assign roles", weights: { "Business & Commerce": 2, "Defence & Security": 2 } },
      { text: "Handle the creative design and presentation", weights: { "Arts & Humanities": 3 } },
      { text: "Research and ensure everything is factually correct", weights: { "Law & Legal": 2, "Science & Research": 2, "Education & Teaching": 1 } },
    ] },
  { text: "What kind of documentary would you watch on a long flight?",
    options: [
      { text: "Space exploration and astrophysics", weights: { "Science & Research": 3, "Engineering": 1 } },
      { text: "Rise and fall of business empires", weights: { "Business & Commerce": 3 } },
      { text: "True crime and legal investigations", weights: { "Law & Legal": 3, "Government & Civil Services": 1 } },
      { text: "Wildlife and environmental conservation", weights: { "Science & Research": 2, "Government & Civil Services": 1, "Medical & Healthcare": 1 } },
    ] },
  { text: "If you could meet any living person, who would it be?",
    options: [
      { text: "Elon Musk or Sundar Pichai", weights: { "Technology & IT": 3, "Engineering": 1 } },
      { text: "A Nobel Prize winning scientist", weights: { "Science & Research": 3, "Medical & Healthcare": 1 } },
      { text: "A Supreme Court Chief Justice", weights: { "Law & Legal": 3, "Government & Civil Services": 1 } },
      { text: "A Bollywood director or international artist", weights: { "Arts & Humanities": 3 } },
    ] },
  { text: "How do you feel about working in a team vs alone?",
    options: [
      { text: "Alone — I focus better independently", weights: { "Science & Research": 2, "Technology & IT": 2, "Engineering": 1 } },
      { text: "Team — I love leading and collaborating", weights: { "Business & Commerce": 2, "Defence & Security": 2 } },
      { text: "Team — I care about everyone's well-being", weights: { "Medical & Healthcare": 2, "Education & Teaching": 2 } },
      { text: "Alone — I need creative solitude", weights: { "Arts & Humanities": 3 } },
    ] },
  { text: "Pick a project for your final year of school:",
    options: [
      { text: "Build a solar-powered device", weights: { "Engineering": 3, "Science & Research": 2 } },
      { text: "Study the impact of nutrition on student health", weights: { "Medical & Healthcare": 3, "Science & Research": 1 } },
      { text: "Create a business plan for a local startup", weights: { "Business & Commerce": 3 } },
      { text: "Produce a short film or documentary", weights: { "Arts & Humanities": 3 } },
    ] },
  { text: "What motivates you to work hard?",
    options: [
      { text: "Solving a tough problem no one else could", weights: { "Engineering": 2, "Science & Research": 2, "Technology & IT": 1 } },
      { text: "Money and the lifestyle it affords", weights: { "Business & Commerce": 3 } },
      { text: "Knowing your work helps people", weights: { "Medical & Healthcare": 2, "Education & Teaching": 2 } },
      { text: "Creating something that will last forever", weights: { "Arts & Humanities": 3, "Science & Research": 1 } },
    ] },
  { text: "Which after-school activity would you choose?",
    options: [
      { text: "Robotics or coding bootcamp", weights: { "Engineering": 2, "Technology & IT": 3 } },
      { text: "First aid and CPR training", weights: { "Medical & Healthcare": 3, "Defence & Security": 1 } },
      { text: "Debate club or MUN", weights: { "Law & Legal": 2, "Government & Civil Services": 2 } },
      { text: "Theatre or art workshop", weights: { "Arts & Humanities": 3 } },
    ] },
  { text: "How do you feel about wearing a uniform?",
    options: [
      { text: "Love it — it shows discipline and unity", weights: { "Defence & Security": 3, "Government & Civil Services": 1 } },
      { text: "Fine — professionalism matters", weights: { "Business & Commerce": 2, "Medical & Healthcare": 2 } },
      { text: "Neutral — doesn't matter to me", weights: { "Engineering": 1, "Science & Research": 2, "Education & Teaching": 1 } },
      { text: "Dislike it — I prefer expressing myself through clothes", weights: { "Arts & Humanities": 3 } },
    ] },
  { text: "What would you exhibit at a science fair?",
    options: [
      { text: "A working robot or automation project", weights: { "Engineering": 3, "Technology & IT": 2 } },
      { text: "A health and nutrition study", weights: { "Medical & Healthcare": 3, "Science & Research": 1 } },
      { text: "A presentation on market economics", weights: { "Business & Commerce": 3, "Government & Civil Services": 1 } },
      { text: "An interactive art or music installation", weights: { "Arts & Humanities": 3, "Technology & IT": 1 } },
    ] },
];

function generateVariations(baseQuestions: QuestionTemplate[], count: number): QuestionTemplate[] {
  const result: QuestionTemplate[] = [...baseQuestions];
  const usedTexts = new Set<string>(baseQuestions.map((q) => q.text));
  const types: QuestionTemplate["type"][] = ["INTEREST", "APTITUDE", "PERSONALITY", "LEARNING_STYLE", "VALUES"];
  const classRanges = [
    { min: 6, max: 12 },
    { min: 6, max: 10 },
    { min: 8, max: 12 },
    { min: 9, max: 12 },
  ];

  const SCENARIOS = [
    "Imagine you are choosing a career path.",
    "Think about your ideal future.",
    "If you had complete freedom to choose,",
    "Consider what truly excites you.",
    "Your best friend asks for career advice.",
    "You are at a career counseling session.",
    "A mentor asks you to reflect.",
    "During a self-discovery workshop,",
    "Looking at your strengths,",
    "Based on what makes you happiest,",
    "At a career fair, you are drawn to",
    "Your teacher recommends you explore",
    "In 10 years, you see yourself",
    "When daydreaming about work,",
    "A career quiz suggests you consider",
    "Your family thinks you'd excel in",
    "After reading about different careers,",
    "During work experience week,",
    "Thinking about your dream job,",
    "If money were no concern,",
    "What drives your ambition?",
    "Reflecting on your hobbies,",
    "Your classmates would vote you most likely to",
    "If you could apprentice with anyone,",
    "During an aptitude assessment,",
    "Your dream college major would be in",
    "For your school exhibition,",
    "On career day at school,",
    "Planning your future path,",
    "If you won a scholarship for any field,",
  ];

  const BRANCH_CONTEXTS = [
    "Thinking about specialization within your field,",
    "To narrow down your career choice further,",
    "Diving deeper into your chosen area,",
    "For your branch-specific assessment,",
    "Exploring sub-fields within your interest,",
    "To find your perfect career niche,",
    "When choosing a specific branch,",
    "Considering your area of expertise,",
    "To refine your career direction,",
    "For advanced career matching,",
  ];

  let round = 0;

  while (result.length < count) {
    round++;

    // Generate CLUSTER variations using prefix + variation combos
    for (let si = 0; si < SCENARIOS.length && result.length < count; si++) {
      for (let vi = 0; vi < INTEREST_VARIATIONS.length && result.length < count; vi++) {
        const scenario = SCENARIOS[(si + round) % SCENARIOS.length];
        const variation = INTEREST_VARIATIONS[vi];
        const text = `${scenario} ${variation.text} (Set ${round})`;

        if (usedTexts.has(text)) continue;
        usedTexts.add(text);

        const crIdx = (si + vi + round) % classRanges.length;
        const typeIdx = (si + vi + round) % types.length;

        result.push({
          text,
          type: types[typeIdx],
          classMin: classRanges[crIdx].min,
          classMax: classRanges[crIdx].max,
          forAssessment: "CLUSTER",
          options: variation.options,
        });
      }
    }

    // Generate BRANCH variants from base questions
    for (let bi = 0; bi < baseQuestions.length && result.length < count; bi++) {
      const base = baseQuestions[bi];
      const ctx = BRANCH_CONTEXTS[(bi + round) % BRANCH_CONTEXTS.length];
      const text = `${ctx} ${base.text} (Branch Set ${round})`;

      if (usedTexts.has(text)) continue;
      usedTexts.add(text);

      result.push({
        ...base,
        text,
        forAssessment: "BRANCH",
        type: types[(bi + round) % types.length],
      });
    }
  }

  return result.slice(0, count);
}

async function seedQuestions() {
  console.log("\n🎯 Starting question seeding...\n");

  // Step 1: Seed careers
  const clusterMap = await seedCareers();

  // Step 2: Combine all base questions
  const allBase = [
    ...INTEREST_QUESTIONS,
    ...APTITUDE_QUESTIONS,
    ...PERSONALITY_QUESTIONS,
    ...LEARNING_STYLE_QUESTIONS,
    ...VALUES_QUESTIONS,
  ];

  console.log(`\n📝 Base questions: ${allBase.length}`);

  // Step 3: Generate variations to reach 1000+
  const allQuestions = generateVariations(allBase, 1050);
  console.log(`📝 Total questions (with variations): ${allQuestions.length}`);

  // Step 4: Insert into database
  let inserted = 0;
  let skipped = 0;

  for (const question of allQuestions) {
    // Check if question already exists
    const existing = await prisma.question.findFirst({
      where: { text: question.text },
    });

    if (existing) {
      skipped++;
      continue;
    }

    try {
      const created = await prisma.question.create({
        data: {
          text: question.text,
          type: question.type,
          classMin: question.classMin,
          classMax: question.classMax,
          forAssessment: question.forAssessment,
          sortOrder: inserted,
          isActive: true,
          options: {
            create: question.options.map((opt, idx) => ({
              text: opt.text,
              sortOrder: idx,
              weights: {
                create: Object.entries(opt.weights)
                  .filter(([clusterName]) => clusterMap[clusterName])
                  .map(([clusterName, weight]) => ({
                    clusterId: clusterMap[clusterName],
                    weight,
                  })),
              },
            })),
          },
        },
      });

      inserted++;
      if (inserted % 50 === 0) {
        console.log(`  ✅ Inserted ${inserted} questions...`);
      }
    } catch (error) {
      console.error(`  ❌ Failed to insert: "${question.text.substring(0, 50)}..."`, error);
      skipped++;
    }
  }

  console.log(`\n🎉 Seeding complete!`);
  console.log(`   ✅ Inserted: ${inserted}`);
  console.log(`   ⏭️  Skipped: ${skipped}`);
  console.log(`   📊 Total in DB: ${await prisma.question.count()}`);
}

seedQuestions()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error("Seed error:", e);
    prisma.$disconnect();
    process.exit(1);
  });

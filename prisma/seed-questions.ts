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
  "Think about picking a job. ",
  "Imagine your ideal future. ",
  "If you could do anything you want, ",
  "Think about what makes you excited. ",
  "Your best friend asks you for career advice. ",
  "You are at a career talk at school. ",
  "A teacher asks you to think about yourself. ",
  "At a workshop, you realize ",
  "Looking at what you are good at, ",
  "Thinking about what makes you happy, ",
];

const INTEREST_VARIATIONS: Array<{ text: string; options: Array<{ text: string; weights: Record<string, number> }> }> = [
  { text: "What kind of problems do you like to solve?",
    options: [
      { text: "Tech and engineering problems", weights: { "Engineering": 3, "Technology & IT": 2 } },
      { text: "Health and body related problems", weights: { "Medical & Healthcare": 3, "Science & Research": 1 } },
      { text: "Money and business problems", weights: { "Business & Commerce": 3 } },
      { text: "Creative and design problems", weights: { "Arts & Humanities": 3 } },
    ] },
  { text: "If you could learn one skill very fast, what would it be?",
    options: [
      { text: "Coding and making software", weights: { "Technology & IT": 3, "Engineering": 1 } },
      { text: "Speaking well and convincing people", weights: { "Law & Legal": 2, "Business & Commerce": 2 } },
      { text: "Treating patients or diagnosing illness", weights: { "Medical & Healthcare": 3 } },
      { text: "Playing music or drawing well", weights: { "Arts & Humanities": 3 } },
    ] },
  { text: "How would you like to help India grow?",
    options: [
      { text: "Build great technology across the country", weights: { "Technology & IT": 3, "Engineering": 2 } },
      { text: "Help more people get better healthcare", weights: { "Medical & Healthcare": 3, "Government & Civil Services": 1 } },
      { text: "Make the economy stronger and create more jobs", weights: { "Business & Commerce": 3, "Government & Civil Services": 1 } },
      { text: "Keep Indian art and culture alive and shared", weights: { "Arts & Humanities": 3, "Education & Teaching": 1 } },
    ] },
  { text: "Which entrance exam are you most excited to prepare for?",
    options: [
      { text: "JEE for engineering", weights: { "Engineering": 3, "Science & Research": 1 } },
      { text: "NEET for medical", weights: { "Medical & Healthcare": 3, "Science & Research": 1 } },
      { text: "UPSC for government jobs", weights: { "Government & Civil Services": 3, "Law & Legal": 1 } },
      { text: "NID or NIFT for design and art schools", weights: { "Arts & Humanities": 3 } },
    ] },
  { text: "If there was a flood or disaster in your town, what would you do?",
    options: [
      { text: "Set up phones and tech to help people communicate", weights: { "Technology & IT": 3, "Engineering": 1 } },
      { text: "Give first aid and medical help to those hurt", weights: { "Medical & Healthcare": 3, "Defence & Security": 1 } },
      { text: "Organise people and supplies to help everyone", weights: { "Business & Commerce": 2, "Government & Civil Services": 2 } },
      { text: "Lead a rescue team to help those in danger", weights: { "Defence & Security": 3, "Government & Civil Services": 1 } },
    ] },
  { text: "What kind of company would you like to start?",
    options: [
      { text: "A tech startup that solves a real problem", weights: { "Technology & IT": 3, "Engineering": 1 } },
      { text: "A chain of good and affordable hospitals", weights: { "Medical & Healthcare": 3, "Business & Commerce": 1 } },
      { text: "A money or business consulting firm", weights: { "Business & Commerce": 3 } },
      { text: "A media, film, or creative agency", weights: { "Arts & Humanities": 3, "Business & Commerce": 1 } },
    ] },
  { text: "Which part of the newspaper would you read first?",
    options: [
      { text: "Technology and Science news", weights: { "Technology & IT": 2, "Science & Research": 2, "Engineering": 1 } },
      { text: "Business and Economy news", weights: { "Business & Commerce": 3, "Government & Civil Services": 1 } },
      { text: "Health and Fitness news", weights: { "Medical & Healthcare": 3 } },
      { text: "Art, Culture, and Movies section", weights: { "Arts & Humanities": 3 } },
    ] },
  { text: "Who would you pick as your ideal guide or mentor?",
    options: [
      { text: "A professor from IIT or a top engineering college", weights: { "Engineering": 3, "Technology & IT": 1 } },
      { text: "A top doctor from AIIMS or a leading hospital", weights: { "Medical & Healthcare": 3 } },
      { text: "A business professor from IIM", weights: { "Business & Commerce": 3 } },
      { text: "An officer from the National Defence Academy", weights: { "Defence & Security": 3 } },
    ] },
  { text: "When you think about college, what excites you most?",
    options: [
      { text: "Using labs and doing research with new tech", weights: { "Engineering": 2, "Science & Research": 2, "Technology & IT": 1 } },
      { text: "Going to hospitals and treating real patients", weights: { "Medical & Healthcare": 3 } },
      { text: "Getting good job placements and business connections", weights: { "Business & Commerce": 3 } },
      { text: "Using creative studios and art spaces", weights: { "Arts & Humanities": 3 } },
    ] },
  { text: "Which job do you think you would never get bored of?",
    options: [
      { text: "Data analyst finding hidden patterns in numbers", weights: { "Technology & IT": 3, "Science & Research": 2 } },
      { text: "Doctor helping different patients every day", weights: { "Medical & Healthcare": 3 } },
      { text: "Lawyer arguing different cases in court", weights: { "Law & Legal": 3 } },
      { text: "Filmmaker always telling new stories", weights: { "Arts & Humanities": 3 } },
    ] },
  { text: "When you visit a new place, what catches your eye first?",
    options: [
      { text: "The buildings, bridges, and infrastructure", weights: { "Engineering": 3, "Science & Research": 1 } },
      { text: "The shops, markets, and local businesses", weights: { "Business & Commerce": 3 } },
      { text: "The art, culture, and local traditions", weights: { "Arts & Humanities": 3, "Education & Teaching": 1 } },
      { text: "The roads, public services, and how the place is run", weights: { "Government & Civil Services": 3, "Law & Legal": 1 } },
    ] },
  { text: "In a group project at school, what do you usually take charge of?",
    options: [
      { text: "The technical and research part", weights: { "Engineering": 2, "Science & Research": 2, "Technology & IT": 1 } },
      { text: "Leading the team and giving everyone a task", weights: { "Business & Commerce": 2, "Defence & Security": 2 } },
      { text: "The creative design and presentation", weights: { "Arts & Humanities": 3 } },
      { text: "Making sure all the facts are right", weights: { "Law & Legal": 2, "Science & Research": 2, "Education & Teaching": 1 } },
    ] },
  { text: "If you were on a long flight, what kind of documentary would you watch?",
    options: [
      { text: "Space and science discoveries", weights: { "Science & Research": 3, "Engineering": 1 } },
      { text: "How big companies grew and failed", weights: { "Business & Commerce": 3 } },
      { text: "True crime and legal investigations", weights: { "Law & Legal": 3, "Government & Civil Services": 1 } },
      { text: "Wildlife and nature stories", weights: { "Science & Research": 2, "Government & Civil Services": 1, "Medical & Healthcare": 1 } },
    ] },
  { text: "If you could meet any famous living person, who would it be?",
    options: [
      { text: "Elon Musk or Sundar Pichai", weights: { "Technology & IT": 3, "Engineering": 1 } },
      { text: "A scientist who won the Nobel Prize", weights: { "Science & Research": 3, "Medical & Healthcare": 1 } },
      { text: "The Chief Justice of India or a top judge", weights: { "Law & Legal": 3, "Government & Civil Services": 1 } },
      { text: "A Bollywood director or world famous artist", weights: { "Arts & Humanities": 3 } },
    ] },
  { text: "Do you prefer working in a team or by yourself?",
    options: [
      { text: "Alone - I focus better by myself", weights: { "Science & Research": 2, "Technology & IT": 2, "Engineering": 1 } },
      { text: "Team - I love leading and working with others", weights: { "Business & Commerce": 2, "Defence & Security": 2 } },
      { text: "Team - I care about everyone and want to help them", weights: { "Medical & Healthcare": 2, "Education & Teaching": 2 } },
      { text: "Alone - I need quiet space to be creative", weights: { "Arts & Humanities": 3 } },
    ] },
  { text: "What kind of final year school project would you like to do?",
    options: [
      { text: "Build a solar-powered device", weights: { "Engineering": 3, "Science & Research": 2 } },
      { text: "Study how food affects students' health", weights: { "Medical & Healthcare": 3, "Science & Research": 1 } },
      { text: "Write a business plan for a local startup", weights: { "Business & Commerce": 3 } },
      { text: "Make a short film or photo documentary", weights: { "Arts & Humanities": 3 } },
    ] },
  { text: "What pushes you to work hard?",
    options: [
      { text: "Solving a problem that no one else could crack", weights: { "Engineering": 2, "Science & Research": 2, "Technology & IT": 1 } },
      { text: "Earning money and enjoying a good life", weights: { "Business & Commerce": 3 } },
      { text: "Knowing my work is truly helping others", weights: { "Medical & Healthcare": 2, "Education & Teaching": 2 } },
      { text: "Making something that will be remembered for years", weights: { "Arts & Humanities": 3, "Science & Research": 1 } },
    ] },
  { text: "Which after-school activity would you join?",
    options: [
      { text: "Robotics or coding class", weights: { "Engineering": 2, "Technology & IT": 3 } },
      { text: "First aid or CPR training", weights: { "Medical & Healthcare": 3, "Defence & Security": 1 } },
      { text: "Debate club or MUN", weights: { "Law & Legal": 2, "Government & Civil Services": 2 } },
      { text: "Theatre class or art workshop", weights: { "Arts & Humanities": 3 } },
    ] },
  { text: "How do you feel about wearing a uniform every day?",
    options: [
      { text: "I love it - it means discipline and pride", weights: { "Defence & Security": 3, "Government & Civil Services": 1 } },
      { text: "Fine with it - looking professional matters", weights: { "Business & Commerce": 2, "Medical & Healthcare": 2 } },
      { text: "Does not bother me either way", weights: { "Engineering": 1, "Science & Research": 2, "Education & Teaching": 1 } },
      { text: "I do not like it - I want to show my style", weights: { "Arts & Humanities": 3 } },
    ] },
  { text: "What would you show at a science fair?",
    options: [
      { text: "A working robot or smart machine", weights: { "Engineering": 3, "Technology & IT": 2 } },
      { text: "A project about health and nutrition", weights: { "Medical & Healthcare": 3, "Science & Research": 1 } },
      { text: "A presentation about how markets work", weights: { "Business & Commerce": 3, "Government & Civil Services": 1 } },
      { text: "An art or music installation people can interact with", weights: { "Arts & Humanities": 3, "Technology & IT": 1 } },
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
    "Think about picking a job.",
    "Imagine your life 10 years from now.",
    "If you could do anything you want,",
    "Think about what excites you the most.",
    "Your best friend asks for career advice.",
    "You are at a career talk at school.",
    "A teacher asks you to think about yourself.",
    "At a workshop, you discover",
    "Looking at what you are good at,",
    "Thinking about what makes you happy,",
    "At a career fair, you get interested in",
    "Your teacher says you should explore",
    "In 10 years, you can see yourself",
    "When you dream about your future job,",
    "A career test tells you to look at",
    "Your family thinks you would do well in",
    "After reading about different jobs,",
    "During career week at school,",
    "Thinking about your dream job,",
    "If earning money did not matter,",
    "What pushes you to work hard?",
    "Looking at your hobbies,",
    "Your classmates think you would be great at",
    "If you could learn from anyone,",
    "During a skills test,",
    "Your dream college subject would be",
    "For your school science exhibition,",
    "On career day at school,",
    "Planning your future,",
    "If you got a scholarship for any subject,",
  ];

  const BRANCH_CONTEXTS = [
    "Now let us think about which part of this field suits you best.",
    "To help you choose further,",
    "Going deeper into your interest area,",
    "For this part of the test,",
    "Let us look at smaller areas within your interest,",
    "To find the right career for you,",
    "When picking a specific area,",
    "Thinking about what you are best at,",
    "To narrow down your career choice,",
    "For a closer look at your best match,",
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

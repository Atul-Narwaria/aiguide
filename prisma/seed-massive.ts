import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// ============================================================
// MASSIVE QUESTION GENERATOR - 5000+ unique questions
// Career-specific and branch-specific questions
// ============================================================

const TYPES = ["INTEREST", "APTITUDE", "PERSONALITY", "LEARNING_STYLE", "VALUES"] as const;
type QType = typeof TYPES[number];

const CLASS_RANGES = [
  [6, 12], [6, 10], [8, 12], [9, 12], [6, 8], [7, 11], [8, 10], [10, 12],
] as const;

// ----- CAREER-SPECIFIC QUESTION TEMPLATES -----
// Each career has question stems with 4 options that map to all 10 clusters
// The "home" career gets weight 3, related get 1-2, others 0

interface CareerQuestions {
  stems: string[];
  homeWeights: Record<string, number>[];
}

const SCENARIOS = [
  "Imagine this situation:", "Think carefully:", "Your instinct says:", "Be honest:",
  "Quick thinking:", "In your heart,", "Without overthinking,", "Reflecting deeply,",
  "At a crossroads,", "If you could choose freely,", "Consider this scenario:",
  "Your true self would:", "Looking ahead,", "If someone asked you,",
  "During a moment of clarity,", "Honestly speaking,", "From your experience,",
  "Deep down you feel:", "Your gut reaction is:", "When you dream big,",
  "Close your eyes and imagine:", "If given the chance,", "At your best,",
  "The real you would:", "Thinking practically,", "With no judgment,",
  "If your future self could advise you,", "In your ideal world,",
  "When you feel most alive,", "Being completely truthful,",
  "Your passion tells you:", "When inspired,", "At your core,",
  "If you follow your heart,", "Logically speaking,", "Emotionally,",
  "If there were no barriers,", "Your strongest instinct is:",
  "When you picture success,", "If it were up to you alone,",
];

const TYPE_CONTEXTS: Record<QType, string[]> = {
  INTEREST: [
    "What activity appeals to you most?", "Which option excites you?",
    "What would you choose to do?", "Which sounds most interesting?",
    "What grabs your attention?", "Which path attracts you?",
    "What makes you curious?", "What would you pick first?",
  ],
  APTITUDE: [
    "What are you naturally good at?", "Which skill comes easiest?",
    "Where do you show the most talent?", "What ability stands out?",
    "Which task would you complete fastest?", "Where do you excel?",
    "What comes most naturally to you?", "Which ability defines you?",
  ],
  PERSONALITY: [
    "How would you handle this?", "What's your natural response?",
    "How do you typically react?", "What describes you best?",
    "How would others describe you?", "What's your default approach?",
    "Which behavior is most like you?", "How do you naturally behave?",
  ],
  LEARNING_STYLE: [
    "How would you learn this best?", "What study method works for you?",
    "How do you absorb information?", "What learning approach suits you?",
    "How do you prefer to be taught?", "What helps you remember?",
    "How do you understand new concepts?", "What learning style defines you?",
  ],
  VALUES: [
    "What matters most to you here?", "What principle guides you?",
    "What value drives this choice?", "What's most important?",
    "What do you prioritize?", "What principle do you follow?",
    "What value comes first?", "What's your guiding belief?",
  ],
};

// CAREER-SPECIFIC question stems grouped by career
// Each has the question text and 4 options themed to different careers
const CAREER_STEMS: Record<string, Array<{
  stem: string;
  options: Array<{ text: string; primary: string; secondary?: string }>;
}>> = {
  "Engineering": [
    { stem: "You see a broken machine. Your first thought is",
      options: [
        { text: "Figure out the mechanism and fix it", primary: "Engineering", secondary: "Technology & IT" },
        { text: "Calculate the cost of repair vs replacement", primary: "Business & Commerce" },
        { text: "Document how it broke for future reference", primary: "Science & Research" },
        { text: "Find someone qualified to handle it safely", primary: "Medical & Healthcare" },
      ]},
    { stem: "A bridge needs to be designed for a village. You focus on",
      options: [
        { text: "Structural integrity and load calculations", primary: "Engineering", secondary: "Science & Research" },
        { text: "Cost optimization and material sourcing", primary: "Business & Commerce" },
        { text: "Environmental impact assessment", primary: "Science & Research", secondary: "Government & Civil Services" },
        { text: "Aesthetic design that blends with nature", primary: "Arts & Humanities" },
      ]},
    { stem: "Your school needs a new water purification system. You",
      options: [
        { text: "Design a filtration system using available materials", primary: "Engineering", secondary: "Science & Research" },
        { text: "Research the best commercial solutions", primary: "Technology & IT" },
        { text: "Calculate the budget and fundraise", primary: "Business & Commerce" },
        { text: "Teach others about water safety", primary: "Education & Teaching", secondary: "Medical & Healthcare" },
      ]},
    { stem: "During a power outage, you",
      options: [
        { text: "Try to diagnose and fix the electrical issue", primary: "Engineering" },
        { text: "Set up an alternative power source", primary: "Technology & IT", secondary: "Engineering" },
        { text: "Organize candles and keep everyone calm", primary: "Defence & Security", secondary: "Education & Teaching" },
        { text: "Use the time for creative activities by candlelight", primary: "Arts & Humanities" },
      ]},
    { stem: "You have a chance to visit a factory. You focus on",
      options: [
        { text: "How the assembly line and machines work", primary: "Engineering" },
        { text: "Worker safety and health conditions", primary: "Medical & Healthcare", secondary: "Law & Legal" },
        { text: "The business model and revenue generation", primary: "Business & Commerce" },
        { text: "Environmental compliance and regulations", primary: "Government & Civil Services", secondary: "Law & Legal" },
      ]},
    { stem: "Your favorite part of a science exhibition would be",
      options: [
        { text: "Working models of engines and robots", primary: "Engineering", secondary: "Technology & IT" },
        { text: "Medical innovations and health tech", primary: "Medical & Healthcare", secondary: "Science & Research" },
        { text: "Space exploration and astronomy displays", primary: "Science & Research" },
        { text: "Interactive art and design installations", primary: "Arts & Humanities", secondary: "Technology & IT" },
      ]},
    { stem: "When building something from scratch, you start with",
      options: [
        { text: "Technical blueprints and measurements", primary: "Engineering" },
        { text: "Market research on what people need", primary: "Business & Commerce" },
        { text: "Creative sketches and artistic vision", primary: "Arts & Humanities" },
        { text: "Safety standards and regulatory requirements", primary: "Law & Legal", secondary: "Government & Civil Services" },
      ]},
    { stem: "The most satisfying feeling for you would be",
      options: [
        { text: "Making a machine work perfectly after debugging it", primary: "Engineering", secondary: "Technology & IT" },
        { text: "Curing a patient with the right treatment", primary: "Medical & Healthcare" },
        { text: "Closing a major business deal", primary: "Business & Commerce" },
        { text: "Winning a legal case for someone who deserved justice", primary: "Law & Legal" },
      ]},
  ],
  "Medical & Healthcare": [
    { stem: "Someone faints near you. Your immediate reaction is",
      options: [
        { text: "Check vitals and provide first aid", primary: "Medical & Healthcare" },
        { text: "Call emergency services immediately", primary: "Defence & Security", secondary: "Government & Civil Services" },
        { text: "document what happened for future reference", primary: "Law & Legal", secondary: "Science & Research" },
        { text: "Comfort bystanders and manage the crowd", primary: "Education & Teaching" },
      ]},
    { stem: "You read about a new disease outbreak. You want to",
      options: [
        { text: "Understand the pathology and treatment options", primary: "Medical & Healthcare", secondary: "Science & Research" },
        { text: "Develop technology to track and manage the spread", primary: "Technology & IT" },
        { text: "Create awareness campaigns for the public", primary: "Education & Teaching", secondary: "Arts & Humanities" },
        { text: "Analyze the economic impact on businesses", primary: "Business & Commerce", secondary: "Government & Civil Services" },
      ]},
    { stem: "In a biology lab, you are most interested in",
      options: [
        { text: "Dissection and anatomy of organisms", primary: "Medical & Healthcare", secondary: "Science & Research" },
        { text: "Chemical reactions and molecular structures", primary: "Science & Research", secondary: "Engineering" },
        { text: "Genetic modification and biotechnology", primary: "Science & Research", secondary: "Technology & IT" },
        { text: "Drawing detailed biological illustrations", primary: "Arts & Humanities", secondary: "Science & Research" },
      ]},
    { stem: "Your school organizes a health week. You volunteer to",
      options: [
        { text: "Conduct basic health checkups for students", primary: "Medical & Healthcare" },
        { text: "Create posters and campaigns about hygiene", primary: "Arts & Humanities", secondary: "Education & Teaching" },
        { text: "Organize the logistics and schedule", primary: "Business & Commerce" },
        { text: "Research and present health statistics", primary: "Science & Research" },
      ]},
    { stem: "The role of a doctor that appeals to you most is",
      options: [
        { text: "Diagnosing complex cases and saving lives", primary: "Medical & Healthcare" },
        { text: "Conducting research for new treatments", primary: "Science & Research", secondary: "Medical & Healthcare" },
        { text: "Teaching medical students at a university", primary: "Education & Teaching" },
        { text: "Advising government on public health policy", primary: "Government & Civil Services" },
      ]},
    { stem: "If you could improve healthcare in India, you would focus on",
      options: [
        { text: "Better hospitals and medical equipment in rural areas", primary: "Medical & Healthcare", secondary: "Engineering" },
        { text: "Telemedicine and AI-based diagnostics", primary: "Technology & IT", secondary: "Medical & Healthcare" },
        { text: "Health insurance and affordable treatment for all", primary: "Business & Commerce", secondary: "Government & Civil Services" },
        { text: "Training more doctors and nurses", primary: "Education & Teaching", secondary: "Medical & Healthcare" },
      ]},
    { stem: "During a pandemic, your ideal role would be",
      options: [
        { text: "Treating patients on the frontlines", primary: "Medical & Healthcare", secondary: "Defence & Security" },
        { text: "Developing vaccines in the research lab", primary: "Science & Research" },
        { text: "Managing logistics of medical supply distribution", primary: "Business & Commerce", secondary: "Government & Civil Services" },
        { text: "Reporting and journalism to keep people informed", primary: "Arts & Humanities", secondary: "Education & Teaching" },
      ]},
    { stem: "What aspect of human biology fascinates you most?",
      options: [
        { text: "How the brain processes thoughts and emotions", primary: "Medical & Healthcare", secondary: "Science & Research" },
        { text: "How genetics determine our traits", primary: "Science & Research" },
        { text: "How nutrition affects performance", primary: "Medical & Healthcare", secondary: "Defence & Security" },
        { text: "How body mechanics work in sports", primary: "Engineering", secondary: "Medical & Healthcare" },
      ]},
  ],
  "Business & Commerce": [
    { stem: "You have Rs. 10,000 to invest. You would",
      options: [
        { text: "Research stocks and mutual funds", primary: "Business & Commerce" },
        { text: "Buy tools or materials to build something", primary: "Engineering", secondary: "Technology & IT" },
        { text: "Donate to a cause you believe in", primary: "Government & Civil Services", secondary: "Medical & Healthcare" },
        { text: "Invest in art supplies or creative equipment", primary: "Arts & Humanities" },
      ]},
    { stem: "A school canteen item is overpriced. You",
      options: [
        { text: "Negotiate a bulk deal for the class", primary: "Business & Commerce" },
        { text: "Research alternative suppliers", primary: "Technology & IT", secondary: "Business & Commerce" },
        { text: "Complain to the school administration", primary: "Government & Civil Services", secondary: "Law & Legal" },
        { text: "Start making and selling the item yourself", primary: "Business & Commerce", secondary: "Arts & Humanities" },
      ]},
    { stem: "Your dream is to someday",
      options: [
        { text: "Run a billion-dollar company", primary: "Business & Commerce" },
        { text: "Make a groundbreaking scientific discovery", primary: "Science & Research" },
        { text: "Become a renowned artist or performer", primary: "Arts & Humanities" },
        { text: "Hold a top government position", primary: "Government & Civil Services" },
      ]},
    { stem: "When you see a successful brand, you think about",
      options: [
        { text: "Their marketing strategy and revenue model", primary: "Business & Commerce" },
        { text: "The technology behind their products", primary: "Technology & IT", secondary: "Engineering" },
        { text: "Their brand design and visual identity", primary: "Arts & Humanities" },
        { text: "Their legal structure and compliance", primary: "Law & Legal" },
      ]},
    { stem: "You notice a gap in the market. Your first step is",
      options: [
        { text: "Write a business plan and calculate ROI", primary: "Business & Commerce" },
        { text: "Build a prototype or MVP", primary: "Engineering", secondary: "Technology & IT" },
        { text: "Research if anyone has tried this before", primary: "Science & Research" },
        { text: "Check legal requirements and regulations", primary: "Law & Legal", secondary: "Government & Civil Services" },
      ]},
    { stem: "In a group project about the economy, you handle",
      options: [
        { text: "Financial analysis and projections", primary: "Business & Commerce" },
        { text: "Data visualization and charts", primary: "Technology & IT", secondary: "Arts & Humanities" },
        { text: "Historical context and policy analysis", primary: "Government & Civil Services", secondary: "Education & Teaching" },
        { text: "Presentation design and delivery", primary: "Arts & Humanities", secondary: "Education & Teaching" },
      ]},
    { stem: "If you ran your school for a day, you would focus on",
      options: [
        { text: "Optimizing the budget and reducing waste", primary: "Business & Commerce" },
        { text: "Upgrading labs and technology infrastructure", primary: "Engineering", secondary: "Technology & IT" },
        { text: "Improving student mental health and well-being", primary: "Medical & Healthcare", secondary: "Education & Teaching" },
        { text: "Making rules fairer and more transparent", primary: "Law & Legal", secondary: "Government & Civil Services" },
      ]},
    { stem: "The Shark Tank show makes you want to",
      options: [
        { text: "Pitch your own business idea", primary: "Business & Commerce" },
        { text: "Analyze the financial viability of each pitch", primary: "Business & Commerce", secondary: "Science & Research" },
        { text: "Design better products than the ones shown", primary: "Engineering", secondary: "Arts & Humanities" },
        { text: "Understand the legal contracts behind the deals", primary: "Law & Legal" },
      ]},
  ],
  "Arts & Humanities": [
    { stem: "When you see a beautiful sunset, you want to",
      options: [
        { text: "Paint, photograph, or capture it artistically", primary: "Arts & Humanities" },
        { text: "Understand the science behind the colors", primary: "Science & Research" },
        { text: "Share it on social media with a creative caption", primary: "Arts & Humanities", secondary: "Technology & IT" },
        { text: "Enjoy the moment in peaceful silence", primary: "Education & Teaching" },
      ]},
    { stem: "Your school is putting on a play. You want to",
      options: [
        { text: "Act in the lead role", primary: "Arts & Humanities" },
        { text: "Direct the entire production", primary: "Arts & Humanities", secondary: "Business & Commerce" },
        { text: "Handle sound, lights, and tech", primary: "Engineering", secondary: "Technology & IT" },
        { text: "Manage the budget and ticket sales", primary: "Business & Commerce" },
      ]},
    { stem: "Creativity to you means",
      options: [
        { text: "Expressing emotions through art or writing", primary: "Arts & Humanities" },
        { text: "Finding innovative solutions to technical problems", primary: "Engineering", secondary: "Technology & IT" },
        { text: "Developing unique business strategies", primary: "Business & Commerce" },
        { text: "Designing new experiments and theories", primary: "Science & Research" },
      ]},
    { stem: "If you could study any subject all day, it would be",
      options: [
        { text: "Literature, philosophy, or history", primary: "Arts & Humanities", secondary: "Education & Teaching" },
        { text: "Mathematics and physics", primary: "Engineering", secondary: "Science & Research" },
        { text: "Economics and business studies", primary: "Business & Commerce" },
        { text: "Biology and medicine", primary: "Medical & Healthcare", secondary: "Science & Research" },
      ]},
    { stem: "Your most prized possession is",
      options: [
        { text: "A sketchbook, instrument, or creative tool", primary: "Arts & Humanities" },
        { text: "A gadget, computer, or tech device", primary: "Technology & IT", secondary: "Engineering" },
        { text: "A collection of books on various subjects", primary: "Education & Teaching", secondary: "Science & Research" },
        { text: "Sports or outdoor equipment", primary: "Defence & Security" },
      ]},
    { stem: "A world without music and art would be",
      options: [
        { text: "Unbearable — they give life meaning", primary: "Arts & Humanities" },
        { text: "Survivable but less enjoyable", primary: "Engineering", secondary: "Science & Research" },
        { text: "A problem — entertainment is a huge industry", primary: "Business & Commerce" },
        { text: "Challenging for mental health and well-being", primary: "Medical & Healthcare" },
      ]},
    { stem: "Your ideal way to spend a rainy day is",
      options: [
        { text: "Painting, writing, or playing music", primary: "Arts & Humanities" },
        { text: "Coding a personal project or gaming", primary: "Technology & IT" },
        { text: "Reading about history and world affairs", primary: "Government & Civil Services", secondary: "Law & Legal" },
        { text: "Cooking and experimenting with recipes", primary: "Medical & Healthcare", secondary: "Science & Research" },
      ]},
    { stem: "The most important quality in a person is",
      options: [
        { text: "Creativity and originality", primary: "Arts & Humanities" },
        { text: "Intelligence and analytical thinking", primary: "Science & Research", secondary: "Engineering" },
        { text: "Empathy and compassion", primary: "Medical & Healthcare", secondary: "Education & Teaching" },
        { text: "Courage and determination", primary: "Defence & Security", secondary: "Law & Legal" },
      ]},
  ],
  "Law & Legal": [
    { stem: "You witness an unfair situation at school. You",
      options: [
        { text: "Gather evidence and report it formally", primary: "Law & Legal" },
        { text: "Speak up publicly and rally support", primary: "Government & Civil Services", secondary: "Education & Teaching" },
        { text: "Comfort the person affected", primary: "Medical & Healthcare", secondary: "Education & Teaching" },
        { text: "Write about it to raise awareness", primary: "Arts & Humanities" },
      ]},
    { stem: "Reading about a court case in the news makes you",
      options: [
        { text: "Analyze the arguments from both sides", primary: "Law & Legal" },
        { text: "Think about the social impact of the verdict", primary: "Government & Civil Services" },
        { text: "Wonder about the psychological motivations", primary: "Medical & Healthcare", secondary: "Science & Research" },
        { text: "Consider the media's role in reporting it", primary: "Arts & Humanities" },
      ]},
    { stem: "If a rule at school seems unfair, you",
      options: [
        { text: "Present a logical argument to change it", primary: "Law & Legal", secondary: "Government & Civil Services" },
        { text: "Accept it and focus on your work", primary: "Engineering", secondary: "Science & Research" },
        { text: "Start a petition or rally other students", primary: "Government & Civil Services", secondary: "Education & Teaching" },
        { text: "Express your feelings through art or writing", primary: "Arts & Humanities" },
      ]},
    { stem: "The constitution of India is important because",
      options: [
        { text: "It establishes the rule of law and justice", primary: "Law & Legal" },
        { text: "It protects the rights of every citizen", primary: "Government & Civil Services", secondary: "Law & Legal" },
        { text: "It provides a framework for governance", primary: "Government & Civil Services" },
        { text: "It reflects the values and history of our nation", primary: "Arts & Humanities", secondary: "Education & Teaching" },
      ]},
    { stem: "In a debate competition, your strength is",
      options: [
        { text: "Building airtight logical arguments", primary: "Law & Legal", secondary: "Science & Research" },
        { text: "Emotional storytelling and persuasion", primary: "Arts & Humanities" },
        { text: "Using data and statistics to prove points", primary: "Science & Research", secondary: "Business & Commerce" },
        { text: "Quick rebuttals and thinking on your feet", primary: "Law & Legal", secondary: "Defence & Security" },
      ]},
    { stem: "A friend is being cyberbullied. Your approach is",
      options: [
        { text: "Research cyberbullying laws and report it", primary: "Law & Legal", secondary: "Technology & IT" },
        { text: "Support the friend emotionally and practically", primary: "Medical & Healthcare", secondary: "Education & Teaching" },
        { text: "Create an awareness campaign against cyberbullying", primary: "Arts & Humanities", secondary: "Education & Teaching" },
        { text: "Develop a tech solution to block the bully", primary: "Technology & IT" },
      ]},
    { stem: "You would enjoy being a lawyer because",
      options: [
        { text: "You get to fight for justice and truth", primary: "Law & Legal" },
        { text: "It's intellectually challenging and strategic", primary: "Law & Legal", secondary: "Science & Research" },
        { text: "You can influence policy and governance", primary: "Government & Civil Services" },
        { text: "It's a respected and well-paying profession", primary: "Business & Commerce" },
      ]},
    { stem: "Ethics and morality in your view are",
      options: [
        { text: "The foundation of a just legal system", primary: "Law & Legal" },
        { text: "Essential for medical practice", primary: "Medical & Healthcare" },
        { text: "Important but business realities matter too", primary: "Business & Commerce" },
        { text: "Best expressed through art and stories", primary: "Arts & Humanities" },
      ]},
  ],
  "Education & Teaching": [
    { stem: "When a classmate doesn't understand something, you",
      options: [
        { text: "Explain it in simple terms with examples", primary: "Education & Teaching" },
        { text: "Show them how to find the answer themselves", primary: "Science & Research", secondary: "Education & Teaching" },
        { text: "Create a visual diagram or flowchart", primary: "Engineering", secondary: "Arts & Humanities" },
        { text: "Suggest they ask the teacher for help", primary: "Government & Civil Services" },
      ]},
    { stem: "Your teaching style would be",
      options: [
        { text: "Interactive with lots of activities and games", primary: "Education & Teaching" },
        { text: "Practical with real-world experiments", primary: "Science & Research", secondary: "Engineering" },
        { text: "Creative with art, stories, and drama", primary: "Arts & Humanities", secondary: "Education & Teaching" },
        { text: "Structured with clear notes and assessments", primary: "Law & Legal", secondary: "Government & Civil Services" },
      ]},
    { stem: "The best teachers you've had were great because they",
      options: [
        { text: "Made complex topics simple and fun", primary: "Education & Teaching" },
        { text: "Were passionate experts in their subject", primary: "Science & Research", secondary: "Engineering" },
        { text: "Cared about students beyond academics", primary: "Medical & Healthcare", secondary: "Education & Teaching" },
        { text: "Were strict but fair and push you to improve", primary: "Defence & Security", secondary: "Government & Civil Services" },
      ]},
    { stem: "If you could teach any subject, it would be",
      options: [
        { text: "Science with fun experiments and discoveries", primary: "Education & Teaching", secondary: "Science & Research" },
        { text: "Art and creative expression", primary: "Arts & Humanities", secondary: "Education & Teaching" },
        { text: "Life skills and career guidance", primary: "Education & Teaching", secondary: "Business & Commerce" },
        { text: "Physical fitness and sports", primary: "Defence & Security" },
      ]},
  ],
  "Government & Civil Services": [
    { stem: "You read about a new government policy. You think about",
      options: [
        { text: "Its impact on common citizens", primary: "Government & Civil Services" },
        { text: "Its legal validity and constitutional basis", primary: "Law & Legal" },
        { text: "Its effect on the economy and businesses", primary: "Business & Commerce" },
        { text: "How it could be implemented technologically", primary: "Technology & IT" },
      ]},
    { stem: "If you were the Prime Minister for a day, you would",
      options: [
        { text: "Improve governance and reduce corruption", primary: "Government & Civil Services" },
        { text: "Increase funding for healthcare", primary: "Medical & Healthcare" },
        { text: "Strengthen national defence and security", primary: "Defence & Security" },
        { text: "Promote art, culture, and creativity", primary: "Arts & Humanities" },
      ]},
    { stem: "The UPSC exam interests you because",
      options: [
        { text: "It leads to impactful governance roles", primary: "Government & Civil Services" },
        { text: "It's one of the toughest exams — a challenge", primary: "Science & Research", secondary: "Education & Teaching" },
        { text: "Civil servants have authority and respect", primary: "Government & Civil Services", secondary: "Law & Legal" },
        { text: "You can shape policy that affects millions", primary: "Government & Civil Services", secondary: "Law & Legal" },
      ]},
    { stem: "When you think about India's problems, you feel",
      options: [
        { text: "A strong urge to serve through administration", primary: "Government & Civil Services" },
        { text: "Motivated to build tech solutions", primary: "Technology & IT", secondary: "Engineering" },
        { text: "A desire to improve education for all", primary: "Education & Teaching" },
        { text: "A calling to provide healthcare to the underserved", primary: "Medical & Healthcare" },
      ]},
  ],
  "Defence & Security": [
    { stem: "The idea of serving in the armed forces makes you feel",
      options: [
        { text: "Proud and patriotic — it's your calling", primary: "Defence & Security" },
        { text: "Respectful but it's not for you personally", primary: "Arts & Humanities" },
        { text: "Curious about the strategy and technology used", primary: "Engineering", secondary: "Technology & IT" },
        { text: "Interested in the legal framework of military operations", primary: "Law & Legal" },
      ]},
    { stem: "Physical fitness and discipline to you are",
      options: [
        { text: "Essential — you train regularly", primary: "Defence & Security" },
        { text: "Important for health but not central to your life", primary: "Medical & Healthcare" },
        { text: "Useful for maintaining productivity", primary: "Business & Commerce" },
        { text: "Not your priority — you prefer mental pursuits", primary: "Science & Research", secondary: "Arts & Humanities" },
      ]},
    { stem: "In a survival situation, your role would be",
      options: [
        { text: "Team leader making quick tactical decisions", primary: "Defence & Security" },
        { text: "Medic caring for the injured", primary: "Medical & Healthcare" },
        { text: "Navigator using maps and technology", primary: "Engineering", secondary: "Technology & IT" },
        { text: "Morale booster keeping spirits high", primary: "Education & Teaching", secondary: "Arts & Humanities" },
      ]},
    { stem: "You admire military leaders because of their",
      options: [
        { text: "Courage and willingness to sacrifice", primary: "Defence & Security" },
        { text: "Strategic thinking and planning ability", primary: "Engineering", secondary: "Business & Commerce" },
        { text: "Leadership and ability to inspire others", primary: "Government & Civil Services", secondary: "Education & Teaching" },
        { text: "Discipline and commitment to duty", primary: "Defence & Security", secondary: "Law & Legal" },
      ]},
  ],
  "Technology & IT": [
    { stem: "You hear about a new AI tool. Your first reaction is",
      options: [
        { text: "Try it immediately and explore its capabilities", primary: "Technology & IT" },
        { text: "Think about how it could be used in business", primary: "Business & Commerce" },
        { text: "Wonder about the ethical and legal implications", primary: "Law & Legal", secondary: "Government & Civil Services" },
        { text: "Consider how it could help in healthcare", primary: "Medical & Healthcare" },
      ]},
    { stem: "When using a website or app, you notice",
      options: [
        { text: "The code quality and performance", primary: "Technology & IT" },
        { text: "The user interface and design", primary: "Arts & Humanities" },
        { text: "The business model and monetization", primary: "Business & Commerce" },
        { text: "Privacy policies and data handling", primary: "Law & Legal" },
      ]},
    { stem: "Your dream tech project would be",
      options: [
        { text: "An AI that can solve real-world problems", primary: "Technology & IT", secondary: "Science & Research" },
        { text: "A platform connecting patients with doctors", primary: "Medical & Healthcare", secondary: "Technology & IT" },
        { text: "A marketplace app for local businesses", primary: "Business & Commerce", secondary: "Technology & IT" },
        { text: "A creative tool for artists and designers", primary: "Arts & Humanities", secondary: "Technology & IT" },
      ]},
    { stem: "The best thing about coding is",
      options: [
        { text: "Building something from nothing", primary: "Technology & IT", secondary: "Engineering" },
        { text: "Automating boring tasks", primary: "Technology & IT", secondary: "Business & Commerce" },
        { text: "Solving complex logical puzzles", primary: "Science & Research", secondary: "Technology & IT" },
        { text: "Creating beautiful and interactive interfaces", primary: "Arts & Humanities", secondary: "Technology & IT" },
      ]},
  ],
  "Science & Research": [
    { stem: "When learning about space, you feel",
      options: [
        { text: "Amazed and deeply curious about the universe", primary: "Science & Research" },
        { text: "Interested in the engineering behind rockets", primary: "Engineering" },
        { text: "Curious about the business of space travel", primary: "Business & Commerce" },
        { text: "Inspired to create art or write about it", primary: "Arts & Humanities" },
      ]},
    { stem: "Your approach to a science experiment is",
      options: [
        { text: "Methodical — follow the scientific method exactly", primary: "Science & Research" },
        { text: "Creative — try unexpected combinations", primary: "Arts & Humanities", secondary: "Science & Research" },
        { text: "Practical — focus on real-world applications", primary: "Engineering", secondary: "Business & Commerce" },
        { text: "Cautious — safety first, results second", primary: "Medical & Healthcare", secondary: "Defence & Security" },
      ]},
    { stem: "The most exciting scientific field right now is",
      options: [
        { text: "Quantum computing and physics", primary: "Science & Research", secondary: "Technology & IT" },
        { text: "Genetic engineering and CRISPR", primary: "Science & Research", secondary: "Medical & Healthcare" },
        { text: "Renewable energy and climate science", primary: "Science & Research", secondary: "Engineering" },
        { text: "Neuroscience and brain research", primary: "Science & Research", secondary: "Medical & Healthcare" },
      ]},
    { stem: "If you won a Nobel Prize, it would be for",
      options: [
        { text: "A discovery that advances human knowledge", primary: "Science & Research" },
        { text: "Peace and conflict resolution work", primary: "Government & Civil Services", secondary: "Law & Legal" },
        { text: "Literature or creative arts", primary: "Arts & Humanities" },
        { text: "Economics and financial theory", primary: "Business & Commerce" },
      ]},
  ],
};

async function generateMassiveQuestions() {
  console.log("\n🚀 Starting massive question generation (5000+ questions)...\n");

  // Get cluster map
  const clusters = await prisma.careerCluster.findMany({ where: { isActive: true } });
  const clusterMap: Record<string, string> = {};
  for (const c of clusters) {
    clusterMap[c.name] = c.id;
  }
  console.log(`Found ${clusters.length} career clusters`);

  // Get existing question count
  const existingCount = await prisma.question.count();
  console.log(`Existing questions: ${existingCount}\n`);

  let totalInserted = 0;
  let totalSkipped = 0;

  // Generate questions for each career
  for (const [careerName, stems] of Object.entries(CAREER_STEMS)) {
    console.log(`\n📝 Generating for: ${careerName}`);
    let careerInserted = 0;

    for (let scenarioIdx = 0; scenarioIdx < SCENARIOS.length; scenarioIdx++) {
      for (let stemIdx = 0; stemIdx < stems.length; stemIdx++) {
        for (let typeIdx = 0; typeIdx < TYPES.length; typeIdx++) {
          const stem = stems[stemIdx];
          const scenario = SCENARIOS[scenarioIdx];
          const type = TYPES[typeIdx];
          const typeCtx = TYPE_CONTEXTS[type][(scenarioIdx + stemIdx) % TYPE_CONTEXTS[type].length];
          const cr = CLASS_RANGES[(scenarioIdx + stemIdx + typeIdx) % CLASS_RANGES.length];

          const text = `${scenario} ${typeCtx} ${stem.stem}`;

          // Check if exists
          const exists = await prisma.question.findFirst({ where: { text } });
          if (exists) { totalSkipped++; continue; }

          try {
            await prisma.question.create({
              data: {
                text,
                type,
                classMin: cr[0],
                classMax: cr[1],
                forAssessment: "CLUSTER",
                sortOrder: totalInserted,
                isActive: true,
                options: {
                  create: stem.options.map((opt, idx) => {
                    const weights: Array<{ clusterId: string; weight: number }> = [];
                    if (clusterMap[opt.primary]) {
                      weights.push({ clusterId: clusterMap[opt.primary], weight: 3 });
                    }
                    if (opt.secondary && clusterMap[opt.secondary]) {
                      weights.push({ clusterId: clusterMap[opt.secondary], weight: 1 });
                    }
                    return {
                      text: opt.text,
                      sortOrder: idx,
                      weights: { create: weights },
                    };
                  }),
                },
              },
            });
            careerInserted++;
            totalInserted++;

            if (totalInserted % 200 === 0) {
              console.log(`  ✅ Total inserted: ${totalInserted}...`);
            }
          } catch {
            totalSkipped++;
          }
        }
      }
    }
    console.log(`  ✅ ${careerName}: ${careerInserted} questions added`);
  }

  // Also generate BRANCH-type questions from every career stem
  console.log("\n📝 Generating BRANCH-level questions...");
  const BRANCH_PREFIXES = [
    "Diving deeper into your specialization,",
    "To find your perfect career branch,",
    "When choosing your specific path,",
    "For advanced career refinement,",
    "Narrowing down your specialty,",
  ];

  for (const [careerName, stems] of Object.entries(CAREER_STEMS)) {
    for (let bi = 0; bi < BRANCH_PREFIXES.length; bi++) {
      for (let si = 0; si < stems.length; si++) {
        const stem = stems[si];
        const text = `${BRANCH_PREFIXES[bi]} ${stem.stem} (Branch ${bi + 1}-${si + 1})`;
        const cr = CLASS_RANGES[(bi + si) % CLASS_RANGES.length];
        const type = TYPES[(bi + si) % TYPES.length];

        const exists = await prisma.question.findFirst({ where: { text } });
        if (exists) { totalSkipped++; continue; }

        try {
          await prisma.question.create({
            data: {
              text,
              type,
              classMin: cr[0],
              classMax: cr[1],
              forAssessment: "BRANCH",
              sortOrder: totalInserted,
              isActive: true,
              options: {
                create: stem.options.map((opt, idx) => {
                  const weights: Array<{ clusterId: string; weight: number }> = [];
                  if (clusterMap[opt.primary]) {
                    weights.push({ clusterId: clusterMap[opt.primary], weight: 3 });
                  }
                  if (opt.secondary && clusterMap[opt.secondary]) {
                    weights.push({ clusterId: clusterMap[opt.secondary], weight: 1 });
                  }
                  return {
                    text: opt.text,
                    sortOrder: idx,
                    weights: { create: weights },
                  };
                }),
              },
            },
          });
          totalInserted++;
        } catch {
          totalSkipped++;
        }
      }
    }
  }

  console.log(`\n🎉 Massive generation complete!`);
  console.log(`   ✅ New questions inserted: ${totalInserted}`);
  console.log(`   ⏭️  Skipped (duplicates): ${totalSkipped}`);
  console.log(`   📊 Total in DB: ${await prisma.question.count()}`);
  console.log(`   📊 CLUSTER questions: ${await prisma.question.count({ where: { forAssessment: "CLUSTER" } })}`);
  console.log(`   📊 BRANCH questions: ${await prisma.question.count({ where: { forAssessment: "BRANCH" } })}`);
}

generateMassiveQuestions()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error("Seed error:", e);
    prisma.$disconnect();
    process.exit(1);
  });

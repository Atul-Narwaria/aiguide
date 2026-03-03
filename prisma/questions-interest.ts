// Question templates for generating 1000+ career guidance questions
// Each template has: text, type, classRange, forAssessment, options with cluster weights

export interface QuestionTemplate {
  text: string;
  type: "INTEREST" | "APTITUDE" | "PERSONALITY" | "LEARNING_STYLE" | "VALUES";
  classMin: number;
  classMax: number;
  forAssessment: "CLUSTER" | "BRANCH";
  options: Array<{
    text: string;
    weights: Record<string, number>; // clusterName -> weight
  }>;
}

// Helper to create a question with standard 4-option format
function q(
  text: string,
  type: QuestionTemplate["type"],
  classMin: number,
  classMax: number,
  forAssessment: "CLUSTER" | "BRANCH",
  options: Array<{ text: string; weights: Record<string, number> }>
): QuestionTemplate {
  return { text, type, classMin, classMax, forAssessment, options };
}

// ============================================================
// CLUSTER-LEVEL QUESTIONS (Interest Discovery Test)
// ============================================================

const INTEREST_QUESTIONS: QuestionTemplate[] = [
  // --- Block 1: Activity Preferences ---
  q("What kind of weekend project would excite you the most?", "INTEREST", 6, 12, "CLUSTER", [
    { text: "Building a small robot or electronic gadget", weights: { "Engineering": 3, "Technology & IT": 2 } },
    { text: "Volunteering at a health camp or hospital", weights: { "Medical & Healthcare": 3, "Education & Teaching": 1 } },
    { text: "Starting a lemonade stand or small business", weights: { "Business & Commerce": 3, "Law & Legal": 1 } },
    { text: "Writing a story, painting, or making a short film", weights: { "Arts & Humanities": 3, "Education & Teaching": 1 } },
  ]),
  q("Which school club would you join first?", "INTEREST", 6, 12, "CLUSTER", [
    { text: "Science and Robotics Club", weights: { "Engineering": 3, "Science & Research": 2 } },
    { text: "Debate and Model United Nations", weights: { "Law & Legal": 3, "Government & Civil Services": 2 } },
    { text: "Drama, Art, or Music Society", weights: { "Arts & Humanities": 3, "Education & Teaching": 1 } },
    { text: "Coding and Tech Club", weights: { "Technology & IT": 3, "Engineering": 2 } },
  ]),
  q("If you could shadow a professional for a day, who would you pick?", "INTEREST", 6, 12, "CLUSTER", [
    { text: "A surgeon performing a life-saving operation", weights: { "Medical & Healthcare": 3, "Science & Research": 1 } },
    { text: "A CEO running a major corporation", weights: { "Business & Commerce": 3, "Technology & IT": 1 } },
    { text: "A scientist working at ISRO or a research lab", weights: { "Science & Research": 3, "Engineering": 2 } },
    { text: "An IAS officer shaping government policy", weights: { "Government & Civil Services": 3, "Law & Legal": 1 } },
  ]),
  q("What type of YouTube videos do you watch the most?", "INTEREST", 6, 12, "CLUSTER", [
    { text: "Science experiments and DIY tech projects", weights: { "Engineering": 2, "Technology & IT": 2, "Science & Research": 2 } },
    { text: "Business success stories and startup journeys", weights: { "Business & Commerce": 3, "Technology & IT": 1 } },
    { text: "Art tutorials, music covers, or film analysis", weights: { "Arts & Humanities": 3, "Education & Teaching": 1 } },
    { text: "Military documentaries and strategy games", weights: { "Defence & Security": 3, "Government & Civil Services": 1 } },
  ]),
  q("Which book genre appeals to you the most?", "INTEREST", 6, 12, "CLUSTER", [
    { text: "Science fiction and futuristic technology", weights: { "Technology & IT": 3, "Science & Research": 2 } },
    { text: "Biographies of leaders and entrepreneurs", weights: { "Business & Commerce": 2, "Government & Civil Services": 2 } },
    { text: "Medical thrillers and health-related stories", weights: { "Medical & Healthcare": 3, "Science & Research": 1 } },
    { text: "Poetry, novels, and literary classics", weights: { "Arts & Humanities": 3, "Education & Teaching": 1 } },
  ]),
  q("What would you do with a surprise holiday?", "INTEREST", 6, 12, "CLUSTER", [
    { text: "Visit a science museum or tech exhibition", weights: { "Science & Research": 3, "Engineering": 2 } },
    { text: "Explore a new business idea or side hustle", weights: { "Business & Commerce": 3, "Technology & IT": 1 } },
    { text: "Go to an art gallery or attend a live concert", weights: { "Arts & Humanities": 3 } },
    { text: "Visit a courthouse or attend a public debate", weights: { "Law & Legal": 3, "Government & Civil Services": 2 } },
  ]),
  q("If your school project could be about anything, you'd choose:", "INTEREST", 6, 10, "CLUSTER", [
    { text: "How bridges and buildings are engineered", weights: { "Engineering": 3, "Science & Research": 1 } },
    { text: "How the human body fights diseases", weights: { "Medical & Healthcare": 3, "Science & Research": 2 } },
    { text: "How businesses make money and grow", weights: { "Business & Commerce": 3 } },
    { text: "How India's constitution protects its citizens", weights: { "Law & Legal": 3, "Government & Civil Services": 2 } },
  ]),
  q("Which competition would you want to participate in?", "INTEREST", 6, 12, "CLUSTER", [
    { text: "Science Olympiad or Math Olympiad", weights: { "Science & Research": 3, "Engineering": 2 } },
    { text: "Business Plan or Entrepreneurship Challenge", weights: { "Business & Commerce": 3, "Technology & IT": 1 } },
    { text: "Essay Writing or Poetry Recitation", weights: { "Arts & Humanities": 3, "Education & Teaching": 1 } },
    { text: "Quiz Competition on Current Affairs and Law", weights: { "Government & Civil Services": 2, "Law & Legal": 2, "Education & Teaching": 1 } },
  ]),
  q("You discover a new app idea. What do you do?", "INTEREST", 8, 12, "CLUSTER", [
    { text: "Start coding it right away", weights: { "Technology & IT": 3, "Engineering": 2 } },
    { text: "Create a business plan and find investors", weights: { "Business & Commerce": 3 } },
    { text: "Design the user interface and branding", weights: { "Arts & Humanities": 3, "Technology & IT": 1 } },
    { text: "Research if it's legally feasible and patent it", weights: { "Law & Legal": 3, "Business & Commerce": 1 } },
  ]),
  q("Your dream vacation destination would be:", "INTEREST", 6, 12, "CLUSTER", [
    { text: "Silicon Valley to visit tech companies", weights: { "Technology & IT": 3, "Engineering": 1 } },
    { text: "Geneva to visit the WHO or Red Cross HQ", weights: { "Medical & Healthcare": 2, "Government & Civil Services": 2 } },
    { text: "Paris to explore the Louvre and art museums", weights: { "Arts & Humanities": 3 } },
    { text: "Wall Street to understand global finance", weights: { "Business & Commerce": 3, "Law & Legal": 1 } },
  ]),
  q("Which school subject do you find most engaging?", "INTEREST", 6, 12, "CLUSTER", [
    { text: "Physics and Mathematics", weights: { "Engineering": 3, "Science & Research": 2 } },
    { text: "Biology and Chemistry", weights: { "Medical & Healthcare": 3, "Science & Research": 2 } },
    { text: "Economics and Accountancy", weights: { "Business & Commerce": 3, "Government & Civil Services": 1 } },
    { text: "History, Geography, and Civics", weights: { "Government & Civil Services": 2, "Law & Legal": 2, "Arts & Humanities": 1 } },
  ]),
  q("When you hear the word 'innovation', you think of:", "INTEREST", 8, 12, "CLUSTER", [
    { text: "New technologies like AI, blockchain, or VR", weights: { "Technology & IT": 3, "Engineering": 2 } },
    { text: "Breakthrough medical treatments and cures", weights: { "Medical & Healthcare": 3, "Science & Research": 2 } },
    { text: "New business models like Uber, Airbnb", weights: { "Business & Commerce": 3, "Technology & IT": 1 } },
    { text: "Social reforms and policy changes", weights: { "Government & Civil Services": 3, "Law & Legal": 2 } },
  ]),
  q("If you win a large amount of money, your first thought is:", "INTEREST", 6, 12, "CLUSTER", [
    { text: "Invest in stocks or start a business", weights: { "Business & Commerce": 3 } },
    { text: "Donate to a hospital or health NGO", weights: { "Medical & Healthcare": 2, "Education & Teaching": 2 } },
    { text: "Fund a science lab or research project", weights: { "Science & Research": 3, "Engineering": 1 } },
    { text: "Set up an art studio or support artists", weights: { "Arts & Humanities": 3 } },
  ]),
  q("What kind of news grabs your attention?", "INTEREST", 8, 12, "CLUSTER", [
    { text: "Tech launches and startup funding news", weights: { "Technology & IT": 3, "Business & Commerce": 2 } },
    { text: "Supreme Court judgments and legal reforms", weights: { "Law & Legal": 3, "Government & Civil Services": 2 } },
    { text: "Military operations and defence updates", weights: { "Defence & Security": 3, "Government & Civil Services": 1 } },
    { text: "Medical breakthroughs and health discoveries", weights: { "Medical & Healthcare": 3, "Science & Research": 2 } },
  ]),
  q("Your friends would say you are best at:", "INTEREST", 6, 12, "CLUSTER", [
    { text: "Fixing things and solving technical problems", weights: { "Engineering": 3, "Technology & IT": 2 } },
    { text: "Taking care of people when they're unwell", weights: { "Medical & Healthcare": 3, "Education & Teaching": 1 } },
    { text: "Organizing events and managing teams", weights: { "Business & Commerce": 3, "Government & Civil Services": 1 } },
    { text: "Creating beautiful art, music, or stories", weights: { "Arts & Humanities": 3 } },
  ]),
  q("Which of these activities sounds most fun?", "INTEREST", 6, 10, "CLUSTER", [
    { text: "Taking apart a gadget to see how it works", weights: { "Engineering": 3, "Science & Research": 2 } },
    { text: "Teaching younger kids a new concept", weights: { "Education & Teaching": 3, "Medical & Healthcare": 1 } },
    { text: "Watching a courtroom drama and discussing the verdict", weights: { "Law & Legal": 3, "Government & Civil Services": 1 } },
    { text: "Planning and running a mini market at school", weights: { "Business & Commerce": 3, "Arts & Humanities": 1 } },
  ]),
  q("If you could solve one world problem, it would be:", "INTEREST", 8, 12, "CLUSTER", [
    { text: "Climate change through clean energy technology", weights: { "Engineering": 2, "Science & Research": 3 } },
    { text: "Poverty through better economic systems", weights: { "Business & Commerce": 2, "Government & Civil Services": 2 } },
    { text: "Disease through medical research", weights: { "Medical & Healthcare": 3, "Science & Research": 2 } },
    { text: "Injustice through legal and social reforms", weights: { "Law & Legal": 3, "Government & Civil Services": 2 } },
  ]),
  q("Your ideal work environment would be:", "INTEREST", 8, 12, "CLUSTER", [
    { text: "A high-tech lab or engineering workshop", weights: { "Engineering": 3, "Science & Research": 2 } },
    { text: "A hospital or clinic helping patients", weights: { "Medical & Healthcare": 3 } },
    { text: "A corporate office with big-picture strategy", weights: { "Business & Commerce": 3, "Government & Civil Services": 1 } },
    { text: "A creative studio with music and art", weights: { "Arts & Humanities": 3 } },
  ]),
  q("Pick a superpower:", "INTEREST", 6, 10, "CLUSTER", [
    { text: "Super intelligence - solve any math or science problem", weights: { "Science & Research": 3, "Engineering": 2 } },
    { text: "Healing touch - cure any illness instantly", weights: { "Medical & Healthcare": 3 } },
    { text: "Mind reading - know what everyone is thinking", weights: { "Law & Legal": 2, "Business & Commerce": 2 } },
    { text: "Shape-shifting - become anyone for acting/art", weights: { "Arts & Humanities": 3, "Defence & Security": 1 } },
  ]),
  q("Which career achievement would make you proudest?", "INTEREST", 8, 12, "CLUSTER", [
    { text: "Building a product used by millions", weights: { "Technology & IT": 3, "Engineering": 2 } },
    { text: "Saving lives as a top surgeon", weights: { "Medical & Healthcare": 3 } },
    { text: "Getting elected to serve the public", weights: { "Government & Civil Services": 3, "Law & Legal": 1 } },
    { text: "Commanding a military battalion", weights: { "Defence & Security": 3 } },
  ]),
  // More interest questions
  q("What would you build if given unlimited resources?", "INTEREST", 6, 12, "CLUSTER", [
    { text: "A self-driving car or flying drone", weights: { "Engineering": 3, "Technology & IT": 2 } },
    { text: "A state-of-the-art hospital for the poor", weights: { "Medical & Healthcare": 3, "Government & Civil Services": 1 } },
    { text: "A global e-commerce platform", weights: { "Business & Commerce": 3, "Technology & IT": 2 } },
    { text: "A world-class art museum", weights: { "Arts & Humanities": 3, "Education & Teaching": 1 } },
  ]),
  q("You find an interesting insect. What do you do?", "INTEREST", 6, 10, "CLUSTER", [
    { text: "Observe it under a magnifying glass and take notes", weights: { "Science & Research": 3, "Medical & Healthcare": 1 } },
    { text: "Search online to learn about its species", weights: { "Technology & IT": 2, "Science & Research": 2 } },
    { text: "Draw or photograph it artistically", weights: { "Arts & Humanities": 3 } },
    { text: "Think about whether it can be used in medicine", weights: { "Medical & Healthcare": 3, "Science & Research": 2 } },
  ]),
  q("On a school trip, you'd most enjoy visiting:", "INTEREST", 6, 12, "CLUSTER", [
    { text: "A power plant or automobile factory", weights: { "Engineering": 3 } },
    { text: "A high court or parliament building", weights: { "Law & Legal": 3, "Government & Civil Services": 2 } },
    { text: "A military base or defence expo", weights: { "Defence & Security": 3 } },
    { text: "A university research centre or ISRO", weights: { "Science & Research": 3, "Technology & IT": 1 } },
  ]),
  q("Which of these best describes how you spend free time?", "INTEREST", 6, 12, "CLUSTER", [
    { text: "Reading about how things work and experimenting", weights: { "Engineering": 2, "Science & Research": 3 } },
    { text: "Helping others with their problems", weights: { "Medical & Healthcare": 2, "Education & Teaching": 2 } },
    { text: "Planning, organizing, and leading group activities", weights: { "Business & Commerce": 2, "Government & Civil Services": 2 } },
    { text: "Playing sports, fitness training, or outdoor adventures", weights: { "Defence & Security": 3, "Medical & Healthcare": 1 } },
  ]),
  q("Your favorite type of puzzle is:", "INTEREST", 6, 12, "CLUSTER", [
    { text: "Logic puzzles and Sudoku", weights: { "Engineering": 2, "Science & Research": 2, "Technology & IT": 1 } },
    { text: "Word puzzles and crosswords", weights: { "Arts & Humanities": 2, "Law & Legal": 2 } },
    { text: "Strategy and business simulation games", weights: { "Business & Commerce": 3, "Government & Civil Services": 1 } },
    { text: "Jigsaw puzzles and visual patterns", weights: { "Arts & Humanities": 2, "Medical & Healthcare": 1, "Science & Research": 1 } },
  ]),
  q("If you could attend any TED Talk, it would be about:", "INTEREST", 8, 12, "CLUSTER", [
    { text: "The future of artificial intelligence", weights: { "Technology & IT": 3, "Science & Research": 2 } },
    { text: "How to end poverty through entrepreneurship", weights: { "Business & Commerce": 3, "Government & Civil Services": 1 } },
    { text: "Breakthroughs in cancer treatment", weights: { "Medical & Healthcare": 3, "Science & Research": 2 } },
    { text: "The power of storytelling and art in society", weights: { "Arts & Humanities": 3, "Education & Teaching": 1 } },
  ]),
  q("What role do you naturally take in a group project?", "INTEREST", 6, 12, "CLUSTER", [
    { text: "The planner who organizes everything", weights: { "Business & Commerce": 3, "Government & Civil Services": 1 } },
    { text: "The creative who designs and presents", weights: { "Arts & Humanities": 3, "Technology & IT": 1 } },
    { text: "The researcher who digs deep into the topic", weights: { "Science & Research": 3, "Medical & Healthcare": 1 } },
    { text: "The leader who motivates the team", weights: { "Defence & Security": 2, "Business & Commerce": 2, "Education & Teaching": 1 } },
  ]),
  q("Which Indian personality inspires you the most?", "INTEREST", 8, 12, "CLUSTER", [
    { text: "APJ Abdul Kalam (Scientist & President)", weights: { "Science & Research": 3, "Defence & Security": 1, "Engineering": 1 } },
    { text: "Ratan Tata (Industrialist & Philanthropist)", weights: { "Business & Commerce": 3, "Engineering": 1 } },
    { text: "Dr. Devi Shetty (Heart Surgeon)", weights: { "Medical & Healthcare": 3 } },
    { text: "Amitabh Bachchan (Actor & Entertainer)", weights: { "Arts & Humanities": 3 } },
  ]),
  q("Your dream project after college would be:", "INTEREST", 9, 12, "CLUSTER", [
    { text: "Launching a tech startup", weights: { "Technology & IT": 3, "Business & Commerce": 2 } },
    { text: "Working with Doctors Without Borders", weights: { "Medical & Healthcare": 3, "Government & Civil Services": 1 } },
    { text: "Joining an architecture or civil engineering firm", weights: { "Engineering": 3, "Arts & Humanities": 1 } },
    { text: "Starting an NGO for social justice", weights: { "Law & Legal": 2, "Government & Civil Services": 2, "Education & Teaching": 1 } },
  ]),
  q("When watching a movie, you're most interested in:", "INTEREST", 6, 12, "CLUSTER", [
    { text: "The special effects and technology behind it", weights: { "Technology & IT": 3, "Engineering": 2 } },
    { text: "The storyline and character development", weights: { "Arts & Humanities": 3 } },
    { text: "The real-life events and historical accuracy", weights: { "Government & Civil Services": 2, "Law & Legal": 2 } },
    { text: "The business side - how much it earned", weights: { "Business & Commerce": 3 } },
  ]),
  q("If you could live in any era, you'd choose:", "INTEREST", 6, 12, "CLUSTER", [
    { text: "The future - with advanced tech and space travel", weights: { "Technology & IT": 3, "Science & Research": 2, "Engineering": 1 } },
    { text: "The Renaissance - golden age of art and culture", weights: { "Arts & Humanities": 3, "Education & Teaching": 1 } },
    { text: "Ancient India - when Ayurveda and medicine flourished", weights: { "Medical & Healthcare": 3, "Science & Research": 1 } },
    { text: "The freedom struggle era - to fight for justice", weights: { "Law & Legal": 2, "Government & Civil Services": 2, "Defence & Security": 1 } },
  ]),
  q("Your reaction to a math problem is usually:", "INTEREST", 6, 12, "CLUSTER", [
    { text: "Excited - I love solving complex equations", weights: { "Engineering": 3, "Science & Research": 2 } },
    { text: "Curious - I want to know how it applies in real life", weights: { "Technology & IT": 2, "Business & Commerce": 2 } },
    { text: "Neutral - I do it because I need to", weights: { "Medical & Healthcare": 1, "Arts & Humanities": 1, "Law & Legal": 1 } },
    { text: "Creative - I try to find visual or unique solutions", weights: { "Arts & Humanities": 2, "Education & Teaching": 2 } },
  ]),
  q("Which type of volunteer work appeals to you?", "INTEREST", 8, 12, "CLUSTER", [
    { text: "Teaching underprivileged children", weights: { "Education & Teaching": 3, "Government & Civil Services": 1 } },
    { text: "Helping at an old age home or hospital", weights: { "Medical & Healthcare": 3, "Education & Teaching": 1 } },
    { text: "Building websites for small businesses for free", weights: { "Technology & IT": 3, "Business & Commerce": 1 } },
    { text: "Providing free legal aid to the poor", weights: { "Law & Legal": 3, "Government & Civil Services": 1 } },
  ]),
  q("What topic could you talk about for hours?", "INTEREST", 6, 12, "CLUSTER", [
    { text: "Gadgets, coding, and the latest technology", weights: { "Technology & IT": 3, "Engineering": 2 } },
    { text: "Sports strategies, fitness, and discipline", weights: { "Defence & Security": 3, "Medical & Healthcare": 1 } },
    { text: "Movies, music, fashion, and pop culture", weights: { "Arts & Humanities": 3 } },
    { text: "Politics, current affairs, and governance", weights: { "Government & Civil Services": 3, "Law & Legal": 2 } },
  ]),
  q("Pick a workspace:", "INTEREST", 8, 12, "CLUSTER", [
    { text: "A lab with microscopes and chemicals", weights: { "Science & Research": 3, "Medical & Healthcare": 2 } },
    { text: "A trading floor with live stock market data", weights: { "Business & Commerce": 3 } },
    { text: "A courtroom arguing a case", weights: { "Law & Legal": 3 } },
    { text: "A field base camp planning a mission", weights: { "Defence & Security": 3 } },
  ]),
  q("What kind of smartphone app would you create?", "INTEREST", 8, 12, "CLUSTER", [
    { text: "A health tracker that monitors vitals", weights: { "Medical & Healthcare": 3, "Technology & IT": 2 } },
    { text: "A stock market simulator for beginners", weights: { "Business & Commerce": 3, "Technology & IT": 1 } },
    { text: "An AI tutor that teaches students", weights: { "Education & Teaching": 3, "Technology & IT": 2 } },
    { text: "An art creation and sharing platform", weights: { "Arts & Humanities": 3, "Technology & IT": 1 } },
  ]),
  q("If assigned a research project, your topic would be:", "INTEREST", 9, 12, "CLUSTER", [
    { text: "Renewable energy and sustainable engineering", weights: { "Engineering": 3, "Science & Research": 2 } },
    { text: "Gene therapy and modern medicine", weights: { "Medical & Healthcare": 3, "Science & Research": 2 } },
    { text: "Cryptocurrency and digital economics", weights: { "Business & Commerce": 3, "Technology & IT": 2 } },
    { text: "Juvenile justice and child rights law", weights: { "Law & Legal": 3, "Government & Civil Services": 1 } },
  ]),
  q("Which of these awards would mean the most to you?", "INTEREST", 8, 12, "CLUSTER", [
    { text: "Nobel Prize in Physics or Chemistry", weights: { "Science & Research": 3, "Engineering": 1 } },
    { text: "Padma Bhushan for public service", weights: { "Government & Civil Services": 3, "Law & Legal": 1 } },
    { text: "National Film Award for best direction", weights: { "Arts & Humanities": 3 } },
    { text: "Forbes 30 Under 30 in Business", weights: { "Business & Commerce": 3, "Technology & IT": 1 } },
  ]),
  q("Your morning routine ideally includes:", "INTEREST", 6, 12, "CLUSTER", [
    { text: "Reading the newspaper's business section", weights: { "Business & Commerce": 3, "Government & Civil Services": 1 } },
    { text: "Exercising and physical training", weights: { "Defence & Security": 3, "Medical & Healthcare": 1 } },
    { text: "Sketching or playing a musical instrument", weights: { "Arts & Humanities": 3 } },
    { text: "Tinkering with a project or reading about science", weights: { "Engineering": 2, "Science & Research": 2, "Technology & IT": 1 } },
  ]),
  q("What frustrates you the most about society?", "INTEREST", 9, 12, "CLUSTER", [
    { text: "Slow adoption of new technology", weights: { "Technology & IT": 3, "Engineering": 1 } },
    { text: "Poor healthcare access for the poor", weights: { "Medical & Healthcare": 3, "Government & Civil Services": 1 } },
    { text: "Corruption and lack of accountability", weights: { "Government & Civil Services": 3, "Law & Legal": 2 } },
    { text: "Inequality and lack of opportunities for artists", weights: { "Arts & Humanities": 3, "Education & Teaching": 1 } },
  ]),
  q("Your ideal summer internship would be at:", "INTEREST", 9, 12, "CLUSTER", [
    { text: "Google, Microsoft, or a tech company", weights: { "Technology & IT": 3, "Engineering": 1 } },
    { text: "AIIMS, Apollo, or a hospital", weights: { "Medical & Healthcare": 3 } },
    { text: "Deloitte, McKinsey, or a consulting firm", weights: { "Business & Commerce": 3 } },
    { text: "Indian Army, Navy, or Air Force facility", weights: { "Defence & Security": 3 } },
  ]),
  q("Pick a tool you'd love to master:", "INTEREST", 6, 12, "CLUSTER", [
    { text: "3D printer or Arduino board", weights: { "Engineering": 3, "Technology & IT": 2 } },
    { text: "Stethoscope or microscope", weights: { "Medical & Healthcare": 3, "Science & Research": 2 } },
    { text: "Excel spreadsheets and financial models", weights: { "Business & Commerce": 3 } },
    { text: "Camera, paintbrush, or musical instrument", weights: { "Arts & Humanities": 3 } },
  ]),
  q("In a team, you naturally focus on:", "INTEREST", 6, 12, "CLUSTER", [
    { text: "The technical details and how to build it", weights: { "Engineering": 3, "Technology & IT": 2 } },
    { text: "The budget, timeline, and deliverables", weights: { "Business & Commerce": 3, "Government & Civil Services": 1 } },
    { text: "Making sure everyone is heard and healthy", weights: { "Medical & Healthcare": 1, "Education & Teaching": 2, "Law & Legal": 1 } },
    { text: "The presentation and visual appeal", weights: { "Arts & Humanities": 3, "Technology & IT": 1 } },
  ]),
  q("Which board game strategy suits you best?", "INTEREST", 6, 12, "CLUSTER", [
    { text: "Analyzing patterns and calculating probabilities", weights: { "Science & Research": 3, "Engineering": 2 } },
    { text: "Trading resources and building empires", weights: { "Business & Commerce": 3 } },
    { text: "Forming alliances and negotiating deals", weights: { "Law & Legal": 2, "Government & Civil Services": 2 } },
    { text: "Creative tactics and surprise moves", weights: { "Defence & Security": 2, "Arts & Humanities": 2 } },
  ]),
  q("Your favorite way to learn something new:", "INTEREST", 6, 12, "CLUSTER", [
    { text: "Hands-on experiments and lab work", weights: { "Science & Research": 3, "Engineering": 2 } },
    { text: "Watching documentaries and reading case studies", weights: { "Government & Civil Services": 2, "Law & Legal": 2 } },
    { text: "Discussing with experts and mentors", weights: { "Education & Teaching": 3, "Business & Commerce": 1 } },
    { text: "Creating something — a model, sketch, or code", weights: { "Arts & Humanities": 2, "Technology & IT": 2 } },
  ]),
  q("If you could change one thing about your school:", "INTEREST", 6, 10, "CLUSTER", [
    { text: "Get a better science lab and maker space", weights: { "Engineering": 3, "Science & Research": 2 } },
    { text: "Add more real-world business projects", weights: { "Business & Commerce": 3 } },
    { text: "Include art, music, and drama as main subjects", weights: { "Arts & Humanities": 3, "Education & Teaching": 1 } },
    { text: "Teach coding and robotics from early classes", weights: { "Technology & IT": 3, "Engineering": 1 } },
  ]),
  q("What would you do during a power cut at home?", "INTEREST", 6, 10, "CLUSTER", [
    { text: "Try to figure out why the power went off", weights: { "Engineering": 3, "Science & Research": 1 } },
    { text: "Read a book by flashlight", weights: { "Arts & Humanities": 2, "Education & Teaching": 2 } },
    { text: "Play a strategy card game with family", weights: { "Business & Commerce": 2, "Defence & Security": 1 } },
    { text: "Practice first aid or medical knowledge", weights: { "Medical & Healthcare": 3 } },
  ]),
  q("When solving a mystery or puzzle, you:", "INTEREST", 6, 12, "CLUSTER", [
    { text: "Use logic and eliminate possibilities step by step", weights: { "Science & Research": 3, "Engineering": 2 } },
    { text: "Look for patterns in human behavior", weights: { "Law & Legal": 2, "Medical & Healthcare": 2 } },
    { text: "Trust your gut and think creatively", weights: { "Arts & Humanities": 3, "Defence & Security": 1 } },
    { text: "Research similar cases from the past", weights: { "Government & Civil Services": 2, "Law & Legal": 2 } },
  ]),
  q("Which headline would make you stop scrolling?", "INTEREST", 8, 12, "CLUSTER", [
    { text: "'Indian startup valued at $1 billion'", weights: { "Business & Commerce": 3, "Technology & IT": 1 } },
    { text: "'New vaccine developed by Indian scientists'", weights: { "Medical & Healthcare": 3, "Science & Research": 2 } },
    { text: "'India wins at International Science Olympiad'", weights: { "Science & Research": 3, "Education & Teaching": 1 } },
    { text: "'Young lawyer wins landmark Supreme Court case'", weights: { "Law & Legal": 3, "Government & Civil Services": 1 } },
  ]),
  q("If you opened a YouTube channel, it would be about:", "INTEREST", 6, 12, "CLUSTER", [
    { text: "Science experiments and tech reviews", weights: { "Science & Research": 2, "Technology & IT": 2, "Engineering": 1 } },
    { text: "Business tips and money management", weights: { "Business & Commerce": 3 } },
    { text: "Art tutorials and creative projects", weights: { "Arts & Humanities": 3 } },
    { text: "Fitness challenges and adventure vlogs", weights: { "Defence & Security": 3, "Medical & Healthcare": 1 } },
  ]),
  q("Your perfect career gives you:", "INTEREST", 8, 12, "CLUSTER", [
    { text: "Freedom to invent and build new things", weights: { "Engineering": 3, "Technology & IT": 2 } },
    { text: "The satisfaction of healing and helping people", weights: { "Medical & Healthcare": 3, "Education & Teaching": 1 } },
    { text: "Power to make decisions that affect millions", weights: { "Government & Civil Services": 3, "Law & Legal": 1 } },
    { text: "A platform to express yourself creatively", weights: { "Arts & Humanities": 3 } },
  ]),
];

export { INTEREST_QUESTIONS };

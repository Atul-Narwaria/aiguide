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
  q("What weekend project sounds most fun to you?", "INTEREST", 6, 12, "CLUSTER", [
    { text: "Make a small robot or electronic device", weights: { "Engineering": 3, "Technology & IT": 2 } },
    { text: "Help at a health camp or hospital", weights: { "Medical & Healthcare": 3, "Education & Teaching": 1 } },
    { text: "Start a small business and sell something", weights: { "Business & Commerce": 3, "Law & Legal": 1 } },
    { text: "Write a story, draw, or make a short video", weights: { "Arts & Humanities": 3, "Education & Teaching": 1 } },
  ]),
  q("Which school club would you join first?", "INTEREST", 6, 12, "CLUSTER", [
    { text: "Science and Robotics Club", weights: { "Engineering": 3, "Science & Research": 2 } },
    { text: "Debate Club or MUN", weights: { "Law & Legal": 3, "Government & Civil Services": 2 } },
    { text: "Drama, Art, or Music Club", weights: { "Arts & Humanities": 3, "Education & Teaching": 1 } },
    { text: "Coding and Tech Club", weights: { "Technology & IT": 3, "Engineering": 2 } },
  ]),
  q("If you could spend one day with a professional, who would it be?", "INTEREST", 6, 12, "CLUSTER", [
    { text: "A doctor doing surgery to save a life", weights: { "Medical & Healthcare": 3, "Science & Research": 1 } },
    { text: "A company CEO making big decisions", weights: { "Business & Commerce": 3, "Technology & IT": 1 } },
    { text: "A scientist at ISRO or a research lab", weights: { "Science & Research": 3, "Engineering": 2 } },
    { text: "An IAS officer working on government plans", weights: { "Government & Civil Services": 3, "Law & Legal": 1 } },
  ]),
  q("What kind of YouTube videos do you watch A lot?", "INTEREST", 6, 12, "CLUSTER", [
    { text: "Science experiments and tech DIY projects", weights: { "Engineering": 2, "Technology & IT": 2, "Science & Research": 2 } },
    { text: "Business success stories and startup videos", weights: { "Business & Commerce": 3, "Technology & IT": 1 } },
    { text: "Art lessons, music covers, or film reviews", weights: { "Arts & Humanities": 3, "Education & Teaching": 1 } },
    { text: "Army or defence documentaries and strategy games", weights: { "Defence & Security": 3, "Government & Civil Services": 1 } },
  ]),
  q("Which type of book do you like to read?", "INTEREST", 6, 12, "CLUSTER", [
    { text: "Science fiction and future tech stories", weights: { "Technology & IT": 3, "Science & Research": 2 } },
    { text: "Life stories of famous leaders and business people", weights: { "Business & Commerce": 2, "Government & Civil Services": 2 } },
    { text: "Medical stories and health-related books", weights: { "Medical & Healthcare": 3, "Science & Research": 1 } },
    { text: "Poems, novels, and classic stories", weights: { "Arts & Humanities": 3, "Education & Teaching": 1 } },
  ]),
  q("What would you do on a free holiday?", "INTEREST", 6, 12, "CLUSTER", [
    { text: "Go to a science museum or tech show", weights: { "Science & Research": 3, "Engineering": 2 } },
    { text: "Try out a new business idea or small project", weights: { "Business & Commerce": 3, "Technology & IT": 1 } },
    { text: "Visit an art gallery or watch a live show", weights: { "Arts & Humanities": 3 } },
    { text: "Visit a court or attend a debate event", weights: { "Law & Legal": 3, "Government & Civil Services": 2 } },
  ]),
  q("If you could pick any school project topic, you would choose:", "INTEREST", 6, 10, "CLUSTER", [
    { text: "How bridges and buildings are made", weights: { "Engineering": 3, "Science & Research": 1 } },
    { text: "How our body fights sickness", weights: { "Medical & Healthcare": 3, "Science & Research": 2 } },
    { text: "How businesses grow and make money", weights: { "Business & Commerce": 3 } },
    { text: "How India's laws protect people", weights: { "Law & Legal": 3, "Government & Civil Services": 2 } },
  ]),
  q("Which school contest would you enter?", "INTEREST", 6, 12, "CLUSTER", [
    { text: "Science or Math Olympiad", weights: { "Science & Research": 3, "Engineering": 2 } },
    { text: "Business plan or startup challenge", weights: { "Business & Commerce": 3, "Technology & IT": 1 } },
    { text: "Essay writing or poem reading contest", weights: { "Arts & Humanities": 3, "Education & Teaching": 1 } },
    { text: "Quiz on current affairs and legal topics", weights: { "Government & Civil Services": 2, "Law & Legal": 2, "Education & Teaching": 1 } },
  ]),
  q("You come up with a great app idea. What do you do first?", "INTEREST", 8, 12, "CLUSTER", [
    { text: "Start building it by writing code", weights: { "Technology & IT": 3, "Engineering": 2 } },
    { text: "Make a business plan and look for investors", weights: { "Business & Commerce": 3 } },
    { text: "Design how it looks and feels", weights: { "Arts & Humanities": 3, "Technology & IT": 1 } },
    { text: "Check if it is legal and get a patent", weights: { "Law & Legal": 3, "Business & Commerce": 1 } },
  ]),
  q("Where would you love to go on a trip?", "INTEREST", 6, 12, "CLUSTER", [
    { text: "Silicon Valley to see top tech companies", weights: { "Technology & IT": 3, "Engineering": 1 } },
    { text: "Geneva to visit the WHO or Red Cross office", weights: { "Medical & Healthcare": 2, "Government & Civil Services": 2 } },
    { text: "Paris to see the Louvre and art museums", weights: { "Arts & Humanities": 3 } },
    { text: "Wall Street to learn about money and business", weights: { "Business & Commerce": 3, "Law & Legal": 1 } },
  ]),
  q("Which school subject do you enjoy the most?", "INTEREST", 6, 12, "CLUSTER", [
    { text: "Physics and Maths", weights: { "Engineering": 3, "Science & Research": 2 } },
    { text: "Biology and Chemistry", weights: { "Medical & Healthcare": 3, "Science & Research": 2 } },
    { text: "Economics and Accounts", weights: { "Business & Commerce": 3, "Government & Civil Services": 1 } },
    { text: "History, Geography, and Civics", weights: { "Government & Civil Services": 2, "Law & Legal": 2, "Arts & Humanities": 1 } },
  ]),
  q("When you hear the word 'new idea', you think of:", "INTEREST", 8, 12, "CLUSTER", [
    { text: "New tech like AI, apps, or robots", weights: { "Technology & IT": 3, "Engineering": 2 } },
    { text: "A new medicine or treatment for a disease", weights: { "Medical & Healthcare": 3, "Science & Research": 2 } },
    { text: "A new way to run a business, like Uber or Swiggy", weights: { "Business & Commerce": 3, "Technology & IT": 1 } },
    { text: "A new law or change in how the country works", weights: { "Government & Civil Services": 3, "Law & Legal": 2 } },
  ]),
  q("If you got a lot of money suddenly, what would you do first?", "INTEREST", 6, 12, "CLUSTER", [
    { text: "Invest it or start a business", weights: { "Business & Commerce": 3 } },
    { text: "Give it to a hospital or health charity", weights: { "Medical & Healthcare": 2, "Education & Teaching": 2 } },
    { text: "Fund a science lab or research", weights: { "Science & Research": 3, "Engineering": 1 } },
    { text: "Set up an art space or support artists", weights: { "Arts & Humanities": 3 } },
  ]),
  q("What type of news catches your eye?", "INTEREST", 8, 12, "CLUSTER", [
    { text: "New tech products and startup news", weights: { "Technology & IT": 3, "Business & Commerce": 2 } },
    { text: "Court rulings and new laws", weights: { "Law & Legal": 3, "Government & Civil Services": 2 } },
    { text: "Army news and defence updates", weights: { "Defence & Security": 3, "Government & Civil Services": 1 } },
    { text: "New medicines and health discoveries", weights: { "Medical & Healthcare": 3, "Science & Research": 2 } },
  ]),
  q("Your friends say you are best at:", "INTEREST", 6, 12, "CLUSTER", [
    { text: "Fixing things and solving tech problems", weights: { "Engineering": 3, "Technology & IT": 2 } },
    { text: "Taking care of people when they are sick", weights: { "Medical & Healthcare": 3, "Education & Teaching": 1 } },
    { text: "Planning events and leading groups", weights: { "Business & Commerce": 3, "Government & Civil Services": 1 } },
    { text: "Making art, music, or telling good stories", weights: { "Arts & Humanities": 3 } },
  ]),
  q("Which of these sounds most fun to do?", "INTEREST", 6, 10, "CLUSTER", [
    { text: "Opening a gadget to see how it works", weights: { "Engineering": 3, "Science & Research": 2 } },
    { text: "Helping younger kids learn something new", weights: { "Education & Teaching": 3, "Medical & Healthcare": 1 } },
    { text: "Watching a court drama and talking about the case", weights: { "Law & Legal": 3, "Government & Civil Services": 1 } },
    { text: "Running a mini shop at school", weights: { "Business & Commerce": 3, "Arts & Humanities": 1 } },
  ]),
  q("If you could fix one big world problem, what would it be?", "INTEREST", 8, 12, "CLUSTER", [
    { text: "Fix climate change using clean energy", weights: { "Engineering": 2, "Science & Research": 3 } },
    { text: "End poverty by improving the economy", weights: { "Business & Commerce": 2, "Government & Civil Services": 2 } },
    { text: "Find cures for deadly diseases", weights: { "Medical & Healthcare": 3, "Science & Research": 2 } },
    { text: "Make laws fair and end injustice", weights: { "Law & Legal": 3, "Government & Civil Services": 2 } },
  ]),
  q("Where would you love to work?", "INTEREST", 8, 12, "CLUSTER", [
    { text: "A tech lab or engineering workshop", weights: { "Engineering": 3, "Science & Research": 2 } },
    { text: "A hospital or clinic helping sick people", weights: { "Medical & Healthcare": 3 } },
    { text: "A big office handling important plans", weights: { "Business & Commerce": 3, "Government & Civil Services": 1 } },
    { text: "A music or art studio doing creative work", weights: { "Arts & Humanities": 3 } },
  ]),
  q("Pick one superpower you want:", "INTEREST", 6, 10, "CLUSTER", [
    { text: "Super smart brain - solve any science or math problem", weights: { "Science & Research": 3, "Engineering": 2 } },
    { text: "Healing hands - cure any illness instantly", weights: { "Medical & Healthcare": 3 } },
    { text: "Mind reading - know what people are thinking", weights: { "Law & Legal": 2, "Business & Commerce": 2 } },
    { text: "Shape changing - become anyone, great for acting or art", weights: { "Arts & Humanities": 3, "Defence & Security": 1 } },
  ]),
  q("Which work success would make you most proud?", "INTEREST", 8, 12, "CLUSTER", [
    { text: "Building a product used by millions of people", weights: { "Technology & IT": 3, "Engineering": 2 } },
    { text: "Saving lives as a top doctor", weights: { "Medical & Healthcare": 3 } },
    { text: "Getting elected to serve the public", weights: { "Government & Civil Services": 3, "Law & Legal": 1 } },
    { text: "Leading a army unit and keeping people safe", weights: { "Defence & Security": 3 } },
  ]),
  q("If money was not a problem, what would you build?", "INTEREST", 6, 12, "CLUSTER", [
    { text: "A self-driving car or flying drone", weights: { "Engineering": 3, "Technology & IT": 2 } },
    { text: "A top hospital for poor people", weights: { "Medical & Healthcare": 3, "Government & Civil Services": 1 } },
    { text: "A big online shopping platform", weights: { "Business & Commerce": 3, "Technology & IT": 2 } },
    { text: "A world class art museum", weights: { "Arts & Humanities": 3, "Education & Teaching": 1 } },
  ]),
  q("You find a new insect. What do you do?", "INTEREST", 6, 10, "CLUSTER", [
    { text: "Look at it closely and write notes about it", weights: { "Science & Research": 3, "Medical & Healthcare": 1 } },
    { text: "Search online to find out more about it", weights: { "Technology & IT": 2, "Science & Research": 2 } },
    { text: "Draw or take a nice photo of it", weights: { "Arts & Humanities": 3 } },
    { text: "Think if it could be used in any medicine", weights: { "Medical & Healthcare": 3, "Science & Research": 2 } },
  ]),
  q("On a school trip, which place would you enjoy most?", "INTEREST", 6, 12, "CLUSTER", [
    { text: "A power plant or car factory", weights: { "Engineering": 3 } },
    { text: "A court or parliament building", weights: { "Law & Legal": 3, "Government & Civil Services": 2 } },
    { text: "An army base or defence show", weights: { "Defence & Security": 3 } },
    { text: "A university lab or space station like ISRO", weights: { "Science & Research": 3, "Technology & IT": 1 } },
  ]),
  q("How do you usually spend your free time?", "INTEREST", 6, 12, "CLUSTER", [
    { text: "Reading and testing how things work", weights: { "Engineering": 2, "Science & Research": 3 } },
    { text: "Helping people with their problems", weights: { "Medical & Healthcare": 2, "Education & Teaching": 2 } },
    { text: "Planning, organizing, and leading group activities", weights: { "Business & Commerce": 2, "Government & Civil Services": 2 } },
    { text: "Playing sports or doing outdoor activities", weights: { "Defence & Security": 3, "Medical & Healthcare": 1 } },
  ]),
  q("Your favourite type of puzzle is:", "INTEREST", 6, 12, "CLUSTER", [
    { text: "Logic puzzles and Sudoku", weights: { "Engineering": 2, "Science & Research": 2, "Technology & IT": 1 } },
    { text: "Word games and crosswords", weights: { "Arts & Humanities": 2, "Law & Legal": 2 } },
    { text: "Strategy games or business simulations", weights: { "Business & Commerce": 3, "Government & Civil Services": 1 } },
    { text: "Jigsaw puzzles and picture patterns", weights: { "Arts & Humanities": 2, "Medical & Healthcare": 1, "Science & Research": 1 } },
  ]),
  q("Which talk would you most want to attend?", "INTEREST", 8, 12, "CLUSTER", [
    { text: "The future of AI and robots", weights: { "Technology & IT": 3, "Science & Research": 2 } },
    { text: "How to end poverty through business", weights: { "Business & Commerce": 3, "Government & Civil Services": 1 } },
    { text: "New ways to treat cancer", weights: { "Medical & Healthcare": 3, "Science & Research": 2 } },
    { text: "The power of stories and art in changing lives", weights: { "Arts & Humanities": 3, "Education & Teaching": 1 } },
  ]),
  q("What role do you usually take in a group project?", "INTEREST", 6, 12, "CLUSTER", [
    { text: "The planner who keeps everything on track", weights: { "Business & Commerce": 3, "Government & Civil Services": 1 } },
    { text: "The creative one who designs and presents", weights: { "Arts & Humanities": 3, "Technology & IT": 1 } },
    { text: "The researcher who finds all the facts", weights: { "Science & Research": 3, "Medical & Healthcare": 1 } },
    { text: "The leader who keeps the team going", weights: { "Defence & Security": 2, "Business & Commerce": 2, "Education & Teaching": 1 } },
  ]),
  q("Which Indian person do you look up to the most?", "INTEREST", 8, 12, "CLUSTER", [
    { text: "APJ Abdul Kalam (Scientist and President)", weights: { "Science & Research": 3, "Defence & Security": 1, "Engineering": 1 } },
    { text: "Ratan Tata (Businessman and helper of poor)", weights: { "Business & Commerce": 3, "Engineering": 1 } },
    { text: "Dr. Devi Shetty (Famous heart surgeon)", weights: { "Medical & Healthcare": 3 } },
    { text: "Amitabh Bachchan (Actor and entertainer)", weights: { "Arts & Humanities": 3 } },
  ]),
  q("What would be your dream project after finishing college?", "INTEREST", 9, 12, "CLUSTER", [
    { text: "Start a tech company", weights: { "Technology & IT": 3, "Business & Commerce": 2 } },
    { text: "Help people as a doctor in remote areas", weights: { "Medical & Healthcare": 3, "Government & Civil Services": 1 } },
    { text: "Work at a big engineering or building firm", weights: { "Engineering": 3, "Arts & Humanities": 1 } },
    { text: "Start an NGO that helps poor people get justice", weights: { "Law & Legal": 2, "Government & Civil Services": 2, "Education & Teaching": 1 } },
  ]),
  q("When you watch a movie, you care most about:", "INTEREST", 6, 12, "CLUSTER", [
    { text: "The special effects and how they were made", weights: { "Technology & IT": 3, "Engineering": 2 } },
    { text: "The story and how the characters grow", weights: { "Arts & Humanities": 3 } },
    { text: "Whether it is based on real events", weights: { "Government & Civil Services": 2, "Law & Legal": 2 } },
    { text: "How much money the movie made", weights: { "Business & Commerce": 3 } },
  ]),
  q("If you could live in any time period, you would pick:", "INTEREST", 6, 12, "CLUSTER", [
    { text: "The future - with cool tech and space travel", weights: { "Technology & IT": 3, "Science & Research": 2, "Engineering": 1 } },
    { text: "The Renaissance - time of great art and culture", weights: { "Arts & Humanities": 3, "Education & Teaching": 1 } },
    { text: "Old India - when medicine and science were booming", weights: { "Medical & Healthcare": 3, "Science & Research": 1 } },
    { text: "The freedom struggle - to fight for what is right", weights: { "Law & Legal": 2, "Government & Civil Services": 2, "Defence & Security": 1 } },
  ]),
  q("How do you feel when you see a maths problem?", "INTEREST", 6, 12, "CLUSTER", [
    { text: "Excited - I love solving hard sums", weights: { "Engineering": 3, "Science & Research": 2 } },
    { text: "Curious - I want to know how it is useful in real life", weights: { "Technology & IT": 2, "Business & Commerce": 2 } },
    { text: "Okay - I do it because I have to", weights: { "Medical & Healthcare": 1, "Arts & Humanities": 1, "Law & Legal": 1 } },
    { text: "Creative - I try to find a new way to solve it", weights: { "Arts & Humanities": 2, "Education & Teaching": 2 } },
  ]),
  q("What kind of helping work appeals to you?", "INTEREST", 8, 12, "CLUSTER", [
    { text: "Teaching poor kids for free", weights: { "Education & Teaching": 3, "Government & Civil Services": 1 } },
    { text: "Helping sick people at a hospital", weights: { "Medical & Healthcare": 3, "Education & Teaching": 1 } },
    { text: "Making free websites for small shops", weights: { "Technology & IT": 3, "Business & Commerce": 1 } },
    { text: "Giving free legal help to people who need it", weights: { "Law & Legal": 3, "Government & Civil Services": 1 } },
  ]),
  q("What topic can you talk about for hours?", "INTEREST", 6, 12, "CLUSTER", [
    { text: "Gadgets, coding, and new tech", weights: { "Technology & IT": 3, "Engineering": 2 } },
    { text: "Sports, fitness, and being tough", weights: { "Defence & Security": 3, "Medical & Healthcare": 1 } },
    { text: "Movies, music, fashion, and pop culture", weights: { "Arts & Humanities": 3 } },
    { text: "News, politics, and how the government works", weights: { "Government & Civil Services": 3, "Law & Legal": 2 } },
  ]),
  q("Pick your ideal workspace:", "INTEREST", 8, 12, "CLUSTER", [
    { text: "A lab with microscopes and test tubes", weights: { "Science & Research": 3, "Medical & Healthcare": 2 } },
    { text: "A trading room with live stock market screens", weights: { "Business & Commerce": 3 } },
    { text: "A courtroom where you argue a case", weights: { "Law & Legal": 3 } },
    { text: "A field base camp planning a mission", weights: { "Defence & Security": 3 } },
  ]),
  q("What kind of phone app would you make?", "INTEREST", 8, 12, "CLUSTER", [
    { text: "A health tracker that checks your body stats", weights: { "Medical & Healthcare": 3, "Technology & IT": 2 } },
    { text: "A stock market game for beginners", weights: { "Business & Commerce": 3, "Technology & IT": 1 } },
    { text: "An AI teacher that helps students learn", weights: { "Education & Teaching": 3, "Technology & IT": 2 } },
    { text: "A platform to make and share art", weights: { "Arts & Humanities": 3, "Technology & IT": 1 } },
  ]),
  q("If you had to pick a research topic for class, it would be:", "INTEREST", 9, 12, "CLUSTER", [
    { text: "Solar energy and eco-friendly buildings", weights: { "Engineering": 3, "Science & Research": 2 } },
    { text: "Gene therapy and how doctors treat rare diseases", weights: { "Medical & Healthcare": 3, "Science & Research": 2 } },
    { text: "Crypto money and online business", weights: { "Business & Commerce": 3, "Technology & IT": 2 } },
    { text: "Laws that protect children and young people", weights: { "Law & Legal": 3, "Government & Civil Services": 1 } },
  ]),
  q("Which award would make you most happy?", "INTEREST", 8, 12, "CLUSTER", [
    { text: "Nobel Prize in Physics or Chemistry", weights: { "Science & Research": 3, "Engineering": 1 } },
    { text: "Padma Bhushan for serving the country", weights: { "Government & Civil Services": 3, "Law & Legal": 1 } },
    { text: "National Film Award for best film", weights: { "Arts & Humanities": 3 } },
    { text: "Forbes 30 Under 30 for young business stars", weights: { "Business & Commerce": 3, "Technology & IT": 1 } },
  ]),
  q("What do you like to do in the morning?", "INTEREST", 6, 12, "CLUSTER", [
    { text: "Read the business and money news", weights: { "Business & Commerce": 3, "Government & Civil Services": 1 } },
    { text: "Exercise and train physically", weights: { "Defence & Security": 3, "Medical & Healthcare": 1 } },
    { text: "Draw, paint, or play music", weights: { "Arts & Humanities": 3 } },
    { text: "Work on a project or read about science", weights: { "Engineering": 2, "Science & Research": 2, "Technology & IT": 1 } },
  ]),
  q("What problem in society bothers you the most?", "INTEREST", 9, 12, "CLUSTER", [
    { text: "People being slow to use new technology", weights: { "Technology & IT": 3, "Engineering": 1 } },
    { text: "Poor people not being able to get good healthcare", weights: { "Medical & Healthcare": 3, "Government & Civil Services": 1 } },
    { text: "Corruption and dishonest leaders", weights: { "Government & Civil Services": 3, "Law & Legal": 2 } },
    { text: "Artists not getting the support or money they deserve", weights: { "Arts & Humanities": 3, "Education & Teaching": 1 } },
  ]),
  q("Where would your dream internship be?", "INTEREST", 9, 12, "CLUSTER", [
    { text: "Google, Microsoft, or another big tech company", weights: { "Technology & IT": 3, "Engineering": 1 } },
    { text: "AIIMS, Apollo, or a big hospital", weights: { "Medical & Healthcare": 3 } },
    { text: "A top business or consulting firm like McKinsey", weights: { "Business & Commerce": 3 } },
    { text: "The Indian Army, Navy, or Air Force", weights: { "Defence & Security": 3 } },
  ]),
  q("Which tool would you love to learn to use?", "INTEREST", 6, 12, "CLUSTER", [
    { text: "3D printer or Arduino circuit board", weights: { "Engineering": 3, "Technology & IT": 2 } },
    { text: "Doctor's tools like a stethoscope or microscope", weights: { "Medical & Healthcare": 3, "Science & Research": 2 } },
    { text: "Excel and financial planning software", weights: { "Business & Commerce": 3 } },
    { text: "Camera, paintbrush, or guitar", weights: { "Arts & Humanities": 3 } },
  ]),
  q("In a team, what do you usually focus on most?", "INTEREST", 6, 12, "CLUSTER", [
    { text: "The technical stuff and how to build it", weights: { "Engineering": 3, "Technology & IT": 2 } },
    { text: "The budget, deadlines, and goals", weights: { "Business & Commerce": 3, "Government & Civil Services": 1 } },
    { text: "Making sure everyone is okay and happy", weights: { "Medical & Healthcare": 1, "Education & Teaching": 2, "Law & Legal": 1 } },
    { text: "How it looks and whether it is well presented", weights: { "Arts & Humanities": 3, "Technology & IT": 1 } },
  ]),
  q("What game strategy do you use most?", "INTEREST", 6, 12, "CLUSTER", [
    { text: "Calculate chances and find patterns", weights: { "Science & Research": 3, "Engineering": 2 } },
    { text: "Build resources and grow an empire", weights: { "Business & Commerce": 3 } },
    { text: "Make deals and form alliances", weights: { "Law & Legal": 2, "Government & Civil Services": 2 } },
    { text: "Use creative tricks to surprise your opponent", weights: { "Defence & Security": 2, "Arts & Humanities": 2 } },
  ]),
  q("How do you like to learn new things?", "INTEREST", 6, 12, "CLUSTER", [
    { text: "Do experiments and try things with my hands", weights: { "Science & Research": 3, "Engineering": 2 } },
    { text: "Watch videos and read real stories", weights: { "Government & Civil Services": 2, "Law & Legal": 2 } },
    { text: "Talk to experts and people with experience", weights: { "Education & Teaching": 3, "Business & Commerce": 1 } },
    { text: "Make something - a model, sketch, or code", weights: { "Arts & Humanities": 2, "Technology & IT": 2 } },
  ]),
  q("If you could change one thing about your school, it would be:", "INTEREST", 6, 10, "CLUSTER", [
    { text: "Build a better science lab and making space", weights: { "Engineering": 3, "Science & Research": 2 } },
    { text: "Add real business and money projects", weights: { "Business & Commerce": 3 } },
    { text: "Make art, music, and drama main subjects", weights: { "Arts & Humanities": 3, "Education & Teaching": 1 } },
    { text: "Teach coding and robots from class 1", weights: { "Technology & IT": 3, "Engineering": 1 } },
  ]),
  q("What would you do if the power went off at home?", "INTEREST", 6, 10, "CLUSTER", [
    { text: "Try to find out why the power went off", weights: { "Engineering": 3, "Science & Research": 1 } },
    { text: "Read a book by torchlight", weights: { "Arts & Humanities": 2, "Education & Teaching": 2 } },
    { text: "Play a card game with family", weights: { "Business & Commerce": 2, "Defence & Security": 1 } },
    { text: "Practice what you know about first aid", weights: { "Medical & Healthcare": 3 } },
  ]),
  q("How do you try to solve a puzzle or mystery?", "INTEREST", 6, 12, "CLUSTER", [
    { text: "Use logic and test one idea at a time", weights: { "Science & Research": 3, "Engineering": 2 } },
    { text: "Look at how people behave to find clues", weights: { "Law & Legal": 2, "Medical & Healthcare": 2 } },
    { text: "Trust your feeling and try a creative guess", weights: { "Arts & Humanities": 3, "Defence & Security": 1 } },
    { text: "Look at how similar problems were solved before", weights: { "Government & Civil Services": 2, "Law & Legal": 2 } },
  ]),
  q("Which news title would make you stop and read?", "INTEREST", 8, 12, "CLUSTER", [
    { text: "'Indian startup becomes a billion dollar company'", weights: { "Business & Commerce": 3, "Technology & IT": 1 } },
    { text: "'Indian scientists make a new vaccine'", weights: { "Medical & Healthcare": 3, "Science & Research": 2 } },
    { text: "'India wins gold at the Science Olympiad'", weights: { "Science & Research": 3, "Education & Teaching": 1 } },
    { text: "'Young lawyer wins a big Supreme Court case'", weights: { "Law & Legal": 3, "Government & Civil Services": 1 } },
  ]),
  q("If you had a YouTube channel, what would it be about?", "INTEREST", 6, 12, "CLUSTER", [
    { text: "Science tests and tech product reviews", weights: { "Science & Research": 2, "Technology & IT": 2, "Engineering": 1 } },
    { text: "Money tips and business advice", weights: { "Business & Commerce": 3 } },
    { text: "Art lessons and creative projects", weights: { "Arts & Humanities": 3 } },
    { text: "Fitness challenges and outdoor adventures", weights: { "Defence & Security": 3, "Medical & Healthcare": 1 } },
  ]),
  q("Your ideal job will give you:", "INTEREST", 8, 12, "CLUSTER", [
    { text: "Freedom to build and invent new things", weights: { "Engineering": 3, "Technology & IT": 2 } },
    { text: "Joy from helping and healing people", weights: { "Medical & Healthcare": 3, "Education & Teaching": 1 } },
    { text: "Power to make choices that help many people", weights: { "Government & Civil Services": 3, "Law & Legal": 1 } },
    { text: "A way to show your creativity to the world", weights: { "Arts & Humanities": 3 } },
  ]),
  // --- Extra questions for more variety ---
  q("Which game do you enjoy playing the most?", "INTEREST", 6, 10, "CLUSTER", [
    { text: "Chess or strategy board games", weights: { "Engineering": 2, "Science & Research": 2 } },
    { text: "Cricket or other team sports", weights: { "Defence & Security": 2, "Medical & Healthcare": 1, "Education & Teaching": 1 } },
    { text: "Art or music games", weights: { "Arts & Humanities": 3 } },
    { text: "Business or trading games", weights: { "Business & Commerce": 3 } },
  ]),
  q("If your class does a play, which role would you pick?", "INTEREST", 6, 10, "CLUSTER", [
    { text: "The main actor or singer", weights: { "Arts & Humanities": 3, "Education & Teaching": 1 } },
    { text: "The director who tells everyone what to do", weights: { "Business & Commerce": 2, "Government & Civil Services": 2 } },
    { text: "The writer who creates the story", weights: { "Arts & Humanities": 3, "Law & Legal": 1 } },
    { text: "I would rather help with the lights or sound tech", weights: { "Technology & IT": 3, "Engineering": 1 } },
  ]),
  q("What kind of job do you think you would be really good at?", "INTEREST", 6, 10, "CLUSTER", [
    { text: "Doctor or nurse", weights: { "Medical & Healthcare": 3 } },
    { text: "Engineer or builder", weights: { "Engineering": 3, "Technology & IT": 1 } },
    { text: "Businessman or shop owner", weights: { "Business & Commerce": 3 } },
    { text: "Artist, singer, or actor", weights: { "Arts & Humanities": 3 } },
  ]),
  q("If you were asked to help fix a problem in your town, what would you do?", "INTEREST", 6, 10, "CLUSTER", [
    { text: "Make a website or app to help people report issues", weights: { "Technology & IT": 3, "Engineering": 1 } },
    { text: "Set up a health camp for free checkups", weights: { "Medical & Healthcare": 3 } },
    { text: "Talk to the local government and ask for help", weights: { "Government & Civil Services": 3, "Law & Legal": 1 } },
    { text: "Paint a mural or make a video to spread awareness", weights: { "Arts & Humanities": 3 } },
  ]),
  q("If your school had extra money, how should they spend it?", "INTEREST", 6, 10, "CLUSTER", [
    { text: "Buy new computers and robots for the lab", weights: { "Technology & IT": 3, "Engineering": 2 } },
    { text: "Hire better sports coaches and improve the field", weights: { "Defence & Security": 2, "Medical & Healthcare": 1 } },
    { text: "Build a small business centre to teach students about money", weights: { "Business & Commerce": 3 } },
    { text: "Set up an art room with painting and music gear", weights: { "Arts & Humanities": 3 } },
  ]),
  q("What do you want people to say about you when you grow up?", "INTEREST", 8, 12, "CLUSTER", [
    { text: "'This person helped so many sick people get better'", weights: { "Medical & Healthcare": 3, "Education & Teaching": 1 } },
    { text: "'This person built amazing things that changed how we live'", weights: { "Engineering": 2, "Technology & IT": 2 } },
    { text: "'This person was honest and made our country better'", weights: { "Government & Civil Services": 3, "Law & Legal": 1 } },
    { text: "'This person's art and stories touched everyone's heart'", weights: { "Arts & Humanities": 3 } },
  ]),
  q("Which school trip sounds most exciting to you?", "INTEREST", 6, 10, "CLUSTER", [
    { text: "A trip to a space museum or planetarium", weights: { "Science & Research": 3, "Engineering": 1 } },
    { text: "A trip to a hospital to see how doctors work", weights: { "Medical & Healthcare": 3 } },
    { text: "A trip to a big company or business", weights: { "Business & Commerce": 3 } },
    { text: "A trip to a historical place or art gallery", weights: { "Arts & Humanities": 3, "Government & Civil Services": 1 } },
  ]),
  q("Which class activity do you enjoy doing most?", "INTEREST", 6, 10, "CLUSTER", [
    { text: "Science experiments in the lab", weights: { "Science & Research": 3, "Engineering": 2 } },
    { text: "Group discussions and debates", weights: { "Law & Legal": 2, "Government & Civil Services": 2, "Education & Teaching": 1 } },
    { text: "Drawing, painting, or drama activities", weights: { "Arts & Humanities": 3 } },
    { text: "Maths problems and number work", weights: { "Engineering": 2, "Business & Commerce": 2 } },
  ]),
  q("When you help a friend with a problem, you usually:", "INTEREST", 6, 12, "CLUSTER", [
    { text: "Try to find the most logical and correct answer", weights: { "Science & Research": 2, "Engineering": 2 } },
    { text: "Listen carefully and make them feel better", weights: { "Medical & Healthcare": 2, "Education & Teaching": 2 } },
    { text: "Come up with a fun and creative solution", weights: { "Arts & Humanities": 3 } },
    { text: "Give them clear steps and a plan to follow", weights: { "Business & Commerce": 2, "Government & Civil Services": 2 } },
  ]),
  q("If you had to pick a career right now, which would you choose?", "INTEREST", 6, 10, "CLUSTER", [
    { text: "Doctor", weights: { "Medical & Healthcare": 3 } },
    { text: "Engineer or software developer", weights: { "Engineering": 2, "Technology & IT": 2 } },
    { text: "Soldier or police officer", weights: { "Defence & Security": 3, "Government & Civil Services": 1 } },
    { text: "Writer, singer, or dancer", weights: { "Arts & Humanities": 3 } },
  ]),
  q("Which skill would you love to be the best at?", "INTEREST", 6, 12, "CLUSTER", [
    { text: "Coding and building software", weights: { "Technology & IT": 3, "Engineering": 2 } },
    { text: "Treating and helping sick people", weights: { "Medical & Healthcare": 3 } },
    { text: "Running a business and making money", weights: { "Business & Commerce": 3 } },
    { text: "Painting, writing, or making music", weights: { "Arts & Humanities": 3 } },
  ]),
  q("What do you do when a friend is sick or upset?", "INTEREST", 6, 10, "CLUSTER", [
    { text: "Help them feel better and give good advice", weights: { "Medical & Healthcare": 3, "Education & Teaching": 1 } },
    { text: "Distract them with something fun or creative", weights: { "Arts & Humanities": 2, "Education & Teaching": 1 } },
    { text: "Help them find the best solution to their problem", weights: { "Business & Commerce": 2, "Law & Legal": 1 } },
    { text: "Stay calm and take charge to get help", weights: { "Defence & Security": 2, "Government & Civil Services": 2 } },
  ]),
  q("How do you feel about technology?", "INTEREST", 6, 12, "CLUSTER", [
    { text: "I love it - I want to build the next big thing", weights: { "Technology & IT": 3, "Engineering": 2 } },
    { text: "It is useful but I care more about people", weights: { "Medical & Healthcare": 2, "Education & Teaching": 2 } },
    { text: "It can help business grow and make money", weights: { "Business & Commerce": 3 } },
    { text: "It is a great tool for making creative art", weights: { "Arts & Humanities": 3 } },
  ]),
];

export { INTEREST_QUESTIONS };

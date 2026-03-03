import { QuestionTemplate } from "./questions-interest";

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

export const APTITUDE_QUESTIONS: QuestionTemplate[] = [
  q("A machine produces 120 units in 3 hours. How many in 8 hours?", "APTITUDE", 6, 10, "CLUSTER", [
    { text: "320 — I calculated quickly using ratios", weights: { "Engineering": 3, "Science & Research": 2 } },
    { text: "I'd need pen and paper to work it out", weights: { "Arts & Humanities": 1, "Education & Teaching": 2 } },
    { text: "I'd think about the business cost per unit first", weights: { "Business & Commerce": 3 } },
    { text: "I'd skip the math and focus on quality instead", weights: { "Medical & Healthcare": 2, "Law & Legal": 1 } },
  ]),
  q("You notice a pattern in data. What's your first instinct?", "APTITUDE", 8, 12, "CLUSTER", [
    { text: "Analyze it mathematically and find the formula", weights: { "Science & Research": 3, "Engineering": 2 } },
    { text: "Think about how to monetize the insight", weights: { "Business & Commerce": 3, "Technology & IT": 1 } },
    { text: "Visualize it with a creative infographic", weights: { "Arts & Humanities": 3, "Technology & IT": 1 } },
    { text: "Consider its implications for public policy", weights: { "Government & Civil Services": 3, "Law & Legal": 1 } },
  ]),
  q("How do you approach debugging a problem?", "APTITUDE", 8, 12, "CLUSTER", [
    { text: "Break it into smaller parts and test each one", weights: { "Engineering": 3, "Technology & IT": 2 } },
    { text: "Ask others for their perspective first", weights: { "Education & Teaching": 2, "Medical & Healthcare": 2 } },
    { text: "Look for similar solved problems online", weights: { "Technology & IT": 2, "Science & Research": 2 } },
    { text: "Step back and think about the big picture", weights: { "Business & Commerce": 2, "Government & Civil Services": 2 } },
  ]),
  q("If given a map of an unknown territory, you'd first:", "APTITUDE", 6, 12, "CLUSTER", [
    { text: "Study the terrain and plan the safest route", weights: { "Defence & Security": 3, "Science & Research": 1 } },
    { text: "Identify resources and economic opportunities", weights: { "Business & Commerce": 3, "Government & Civil Services": 1 } },
    { text: "Note the geographical features scientifically", weights: { "Science & Research": 3, "Engineering": 1 } },
    { text: "Sketch the landscape artistically", weights: { "Arts & Humanities": 3 } },
  ]),
  q("You are given conflicting information from two sources. You:", "APTITUDE", 8, 12, "CLUSTER", [
    { text: "Cross-reference with data and evidence", weights: { "Science & Research": 3, "Engineering": 1 } },
    { text: "Check the credibility of each source", weights: { "Law & Legal": 3, "Government & Civil Services": 1 } },
    { text: "Ask a subject matter expert", weights: { "Education & Teaching": 2, "Medical & Healthcare": 2 } },
    { text: "Go with whichever feels practically useful", weights: { "Business & Commerce": 2, "Technology & IT": 2 } },
  ]),
  q("Your teacher assigns a complex research paper. You:", "APTITUDE", 8, 12, "CLUSTER", [
    { text: "Create a structured outline before writing anything", weights: { "Engineering": 2, "Science & Research": 2, "Law & Legal": 1 } },
    { text: "Start with the most interesting part and fill in gaps", weights: { "Arts & Humanities": 3, "Education & Teaching": 1 } },
    { text: "Look for real-world case studies to include", weights: { "Business & Commerce": 2, "Government & Civil Services": 2 } },
    { text: "Focus on data collection and statistical analysis", weights: { "Science & Research": 3, "Technology & IT": 1 } },
  ]),
  q("When reading a complex graph, you naturally notice:", "APTITUDE", 8, 12, "CLUSTER", [
    { text: "Trends, patterns, and outliers", weights: { "Science & Research": 3, "Engineering": 2 } },
    { text: "Business opportunities in the data", weights: { "Business & Commerce": 3, "Technology & IT": 1 } },
    { text: "Whether the visual design is effective", weights: { "Arts & Humanities": 3 } },
    { text: "What policy changes the data suggests", weights: { "Government & Civil Services": 3, "Law & Legal": 1 } },
  ]),
  q("You find an error in a textbook. Your reaction:", "APTITUDE", 6, 12, "CLUSTER", [
    { text: "Verify it independently and email the publisher", weights: { "Science & Research": 3, "Education & Teaching": 1 } },
    { text: "Tell your teacher and classmates about it", weights: { "Education & Teaching": 3, "Law & Legal": 1 } },
    { text: "Wonder how much money the error might cost someone", weights: { "Business & Commerce": 3 } },
    { text: "Feel proud you caught something published experts missed", weights: { "Law & Legal": 2, "Government & Civil Services": 2 } },
  ]),
  q("How quickly can you memorize a list of 20 items?", "APTITUDE", 6, 12, "CLUSTER", [
    { text: "Fast — I use memory techniques and mnemonics", weights: { "Medical & Healthcare": 3, "Science & Research": 1 } },
    { text: "Moderate — I group them into categories", weights: { "Business & Commerce": 2, "Engineering": 2 } },
    { text: "I prefer understanding over memorizing", weights: { "Education & Teaching": 2, "Science & Research": 2 } },
    { text: "I'd rather create a visual/song to remember", weights: { "Arts & Humanities": 3, "Education & Teaching": 1 } },
  ]),
  q("Your spatial awareness is best described as:", "APTITUDE", 6, 12, "CLUSTER", [
    { text: "Excellent — I can visualize 3D objects in my head", weights: { "Engineering": 3, "Science & Research": 1 } },
    { text: "Good — I am aware of my surroundings", weights: { "Defence & Security": 3, "Medical & Healthcare": 1 } },
    { text: "Average — I rely more on words than images", weights: { "Law & Legal": 2, "Arts & Humanities": 2 } },
    { text: "Creative — I see things others don't", weights: { "Arts & Humanities": 3, "Technology & IT": 1 } },
  ]),
  q("When explaining something complicated, you prefer to:", "APTITUDE", 6, 12, "CLUSTER", [
    { text: "Draw a diagram or flowchart", weights: { "Engineering": 3, "Science & Research": 2 } },
    { text: "Use a real-world analogy or story", weights: { "Education & Teaching": 3, "Arts & Humanities": 1 } },
    { text: "Break it into numbered steps", weights: { "Technology & IT": 2, "Business & Commerce": 2 } },
    { text: "Show them by doing it yourself", weights: { "Medical & Healthcare": 2, "Defence & Security": 2 } },
  ]),
  q("How well do you handle numbers and calculations?", "APTITUDE", 6, 12, "CLUSTER", [
    { text: "Very well — numbers come naturally to me", weights: { "Engineering": 3, "Science & Research": 2, "Business & Commerce": 1 } },
    { text: "Well enough for practical purposes", weights: { "Business & Commerce": 2, "Technology & IT": 2 } },
    { text: "I struggle a bit, but I manage", weights: { "Arts & Humanities": 2, "Law & Legal": 1 } },
    { text: "I prefer words and language over numbers", weights: { "Arts & Humanities": 3, "Education & Teaching": 1 } },
  ]),
  q("Your reaction time in emergencies is:", "APTITUDE", 6, 12, "CLUSTER", [
    { text: "Quick and decisive — I act immediately", weights: { "Defence & Security": 3, "Medical & Healthcare": 2 } },
    { text: "Calm and analytical — I assess before acting", weights: { "Science & Research": 2, "Engineering": 2 } },
    { text: "I look for help and coordinate with others", weights: { "Government & Civil Services": 2, "Business & Commerce": 2 } },
    { text: "I freeze first but then think creatively", weights: { "Arts & Humanities": 2, "Education & Teaching": 1 } },
  ]),
  q("How good are you at reading people's emotions?", "APTITUDE", 8, 12, "CLUSTER", [
    { text: "Very good — I can tell how someone feels instantly", weights: { "Medical & Healthcare": 2, "Education & Teaching": 2, "Law & Legal": 1 } },
    { text: "Good — I notice body language", weights: { "Defence & Security": 2, "Law & Legal": 2 } },
    { text: "Average — I focus more on facts than feelings", weights: { "Engineering": 2, "Science & Research": 2 } },
    { text: "I understand emotions better through art and expression", weights: { "Arts & Humanities": 3 } },
  ]),
  q("Your ability to work under pressure is:", "APTITUDE", 8, 12, "CLUSTER", [
    { text: "Strong — I thrive when stakes are high", weights: { "Defence & Security": 3, "Medical & Healthcare": 2 } },
    { text: "Decent — I manage with proper planning", weights: { "Business & Commerce": 3, "Engineering": 1 } },
    { text: "I need time and space to do my best work", weights: { "Science & Research": 2, "Arts & Humanities": 2 } },
    { text: "I can lead others through high-pressure situations", weights: { "Government & Civil Services": 3, "Law & Legal": 1 } },
  ]),
];

export const PERSONALITY_QUESTIONS: QuestionTemplate[] = [
  q("When making a major life decision, you rely on:", "PERSONALITY", 8, 12, "CLUSTER", [
    { text: "Data, facts, and logical analysis", weights: { "Engineering": 2, "Science & Research": 2, "Technology & IT": 1 } },
    { text: "Your gut feeling and instinct", weights: { "Arts & Humanities": 2, "Defence & Security": 2 } },
    { text: "Advice from trusted people", weights: { "Education & Teaching": 2, "Medical & Healthcare": 2 } },
    { text: "Weighing pros and cons like a business case", weights: { "Business & Commerce": 3, "Law & Legal": 1 } },
  ]),
  q("How do you handle failure?", "PERSONALITY", 8, 12, "CLUSTER", [
    { text: "Analyze what went wrong and try a different approach", weights: { "Engineering": 3, "Science & Research": 2 } },
    { text: "Get back up quickly — failure makes me stronger", weights: { "Defence & Security": 3, "Business & Commerce": 1 } },
    { text: "Express my feelings through writing or art", weights: { "Arts & Humanities": 3 } },
    { text: "Seek help and support from friends and mentors", weights: { "Education & Teaching": 2, "Medical & Healthcare": 2 } },
  ]),
  q("In a debate, you are most likely to:", "PERSONALITY", 6, 12, "CLUSTER", [
    { text: "Present facts and evidence to win logically", weights: { "Law & Legal": 3, "Science & Research": 2 } },
    { text: "Use emotional stories to persuade", weights: { "Arts & Humanities": 2, "Education & Teaching": 2 } },
    { text: "Find a compromise that works for everyone", weights: { "Government & Civil Services": 3, "Business & Commerce": 1 } },
    { text: "Stand firm and argue passionately for your side", weights: { "Defence & Security": 2, "Law & Legal": 2 } },
  ]),
  q("On a scale of introvert to extrovert, you are:", "PERSONALITY", 6, 12, "CLUSTER", [
    { text: "Introverted — I recharge by being alone", weights: { "Science & Research": 3, "Technology & IT": 2 } },
    { text: "Ambivert — depends on the situation", weights: { "Engineering": 2, "Medical & Healthcare": 2 } },
    { text: "Extroverted — I love being around people", weights: { "Business & Commerce": 2, "Education & Teaching": 2 } },
    { text: "I express myself best through art, not conversation", weights: { "Arts & Humanities": 3 } },
  ]),
  q("When you see someone being treated unfairly, you:", "PERSONALITY", 6, 12, "CLUSTER", [
    { text: "Speak up immediately and confront the situation", weights: { "Law & Legal": 3, "Defence & Security": 2 } },
    { text: "Report it to the appropriate authorities", weights: { "Government & Civil Services": 3, "Education & Teaching": 1 } },
    { text: "Comfort the person and offer support", weights: { "Medical & Healthcare": 3, "Education & Teaching": 1 } },
    { text: "Write about it or create awareness through art", weights: { "Arts & Humanities": 3, "Law & Legal": 1 } },
  ]),
  q("How organized are you?", "PERSONALITY", 6, 12, "CLUSTER", [
    { text: "Very organized — everything has a place", weights: { "Engineering": 2, "Business & Commerce": 2, "Government & Civil Services": 1 } },
    { text: "Organized chaos — I know where everything is", weights: { "Arts & Humanities": 2, "Technology & IT": 2 } },
    { text: "I keep detailed notes and records", weights: { "Law & Legal": 3, "Science & Research": 1 } },
    { text: "I follow strict discipline and routines", weights: { "Defence & Security": 3, "Medical & Healthcare": 1 } },
  ]),
  q("When someone disagrees with you, your typical response is:", "PERSONALITY", 8, 12, "CLUSTER", [
    { text: "Listen carefully and then present counter-evidence", weights: { "Law & Legal": 3, "Science & Research": 1 } },
    { text: "Try to understand their perspective", weights: { "Education & Teaching": 3, "Medical & Healthcare": 1 } },
    { text: "Stay firm if I'm confident in my position", weights: { "Defence & Security": 2, "Government & Civil Services": 2 } },
    { text: "Agree to disagree and move on", weights: { "Arts & Humanities": 2, "Business & Commerce": 2 } },
  ]),
  q("Your risk tolerance is:", "PERSONALITY", 8, 12, "CLUSTER", [
    { text: "High — I love taking bold risks", weights: { "Business & Commerce": 3, "Defence & Security": 2 } },
    { text: "Calculated — I take risks only after research", weights: { "Engineering": 2, "Science & Research": 2, "Technology & IT": 1 } },
    { text: "Low — I prefer safe and steady paths", weights: { "Government & Civil Services": 2, "Education & Teaching": 2 } },
    { text: "Creative — I take unconventional paths others avoid", weights: { "Arts & Humanities": 3 } },
  ]),
  q("When a classmate is sick, your first reaction is:", "PERSONALITY", 6, 10, "CLUSTER", [
    { text: "Offer to help them feel better and give advice", weights: { "Medical & Healthcare": 3, "Education & Teaching": 1 } },
    { text: "Share your notes and help them catch up", weights: { "Education & Teaching": 3 } },
    { text: "Think about what caused the illness scientifically", weights: { "Science & Research": 3, "Medical & Healthcare": 1 } },
    { text: "Feel bad but focus on your own work", weights: { "Engineering": 1, "Business & Commerce": 2, "Technology & IT": 1 } },
  ]),
  q("Your communication style is best described as:", "PERSONALITY", 8, 12, "CLUSTER", [
    { text: "Precise and technical — I value accuracy", weights: { "Engineering": 2, "Science & Research": 2, "Technology & IT": 1 } },
    { text: "Persuasive and charismatic — I influence people", weights: { "Business & Commerce": 3, "Law & Legal": 1 } },
    { text: "Caring and empathetic — I connect emotionally", weights: { "Medical & Healthcare": 2, "Education & Teaching": 2 } },
    { text: "Creative and expressive — I use metaphors and stories", weights: { "Arts & Humanities": 3 } },
  ]),
  q("How do you handle a long queue or waiting time?", "PERSONALITY", 6, 12, "CLUSTER", [
    { text: "Patiently wait — I have good self-control", weights: { "Defence & Security": 3, "Government & Civil Services": 1 } },
    { text: "Use the time to think or plan something", weights: { "Business & Commerce": 2, "Engineering": 2 } },
    { text: "Read or sketch to pass the time", weights: { "Arts & Humanities": 3, "Education & Teaching": 1 } },
    { text: "Start a conversation with the person next to me", weights: { "Medical & Healthcare": 1, "Education & Teaching": 2, "Law & Legal": 1 } },
  ]),
  q("Your approach to rules is:", "PERSONALITY", 6, 12, "CLUSTER", [
    { text: "Follow them strictly — rules keep order", weights: { "Defence & Security": 3, "Government & Civil Services": 2 } },
    { text: "Follow them but question unfair ones", weights: { "Law & Legal": 3, "Education & Teaching": 1 } },
    { text: "Bend them a bit if needed to achieve results", weights: { "Business & Commerce": 3, "Technology & IT": 1 } },
    { text: "Rules can limit creativity — I prefer freedom", weights: { "Arts & Humanities": 3 } },
  ]),
  q("How competitive are you?", "PERSONALITY", 6, 12, "CLUSTER", [
    { text: "Very — I always want to be the best", weights: { "Business & Commerce": 3, "Defence & Security": 2 } },
    { text: "Moderately — I compete but also collaborate", weights: { "Engineering": 2, "Science & Research": 2 } },
    { text: "I compete with myself more than others", weights: { "Arts & Humanities": 2, "Medical & Healthcare": 2 } },
    { text: "I believe in cooperation over competition", weights: { "Education & Teaching": 3, "Government & Civil Services": 1 } },
  ]),
  q("What's your relationship with deadlines?", "PERSONALITY", 8, 12, "CLUSTER", [
    { text: "I always finish early", weights: { "Defence & Security": 2, "Engineering": 2, "Government & Civil Services": 1 } },
    { text: "I finish on time with proper planning", weights: { "Business & Commerce": 3, "Law & Legal": 1 } },
    { text: "I sometimes procrastinate but deliver quality", weights: { "Arts & Humanities": 2, "Science & Research": 2 } },
    { text: "Deadlines stress me — I prefer flexible timelines", weights: { "Education & Teaching": 2, "Medical & Healthcare": 1 } },
  ]),
  q("When you achieve success, you:", "PERSONALITY", 6, 12, "CLUSTER", [
    { text: "Celebrate quietly and set the next goal", weights: { "Science & Research": 2, "Engineering": 2 } },
    { text: "Share it with everyone — I love recognition", weights: { "Business & Commerce": 2, "Arts & Humanities": 2 } },
    { text: "Feel grateful and want to help others succeed too", weights: { "Education & Teaching": 3, "Medical & Healthcare": 1 } },
    { text: "Analyze what worked and create a repeatable process", weights: { "Technology & IT": 2, "Business & Commerce": 2 } },
  ]),
];

export const LEARNING_STYLE_QUESTIONS: QuestionTemplate[] = [
  q("You learn best when:", "LEARNING_STYLE", 6, 12, "CLUSTER", [
    { text: "Doing hands-on experiments or building things", weights: { "Engineering": 3, "Science & Research": 2 } },
    { text: "Reading detailed textbooks and articles", weights: { "Law & Legal": 2, "Science & Research": 2, "Education & Teaching": 1 } },
    { text: "Watching demonstrations and videos", weights: { "Arts & Humanities": 2, "Technology & IT": 2 } },
    { text: "Discussing and debating with peers", weights: { "Business & Commerce": 2, "Government & Civil Services": 2 } },
  ]),
  q("Your ideal study environment is:", "LEARNING_STYLE", 6, 12, "CLUSTER", [
    { text: "Silent library with just books and notes", weights: { "Science & Research": 2, "Law & Legal": 2, "Medical & Healthcare": 1 } },
    { text: "A workshop or lab with tools", weights: { "Engineering": 3, "Technology & IT": 2 } },
    { text: "A café with background music", weights: { "Arts & Humanities": 3, "Business & Commerce": 1 } },
    { text: "Outdoors in nature", weights: { "Defence & Security": 2, "Science & Research": 1, "Arts & Humanities": 1 } },
  ]),
  q("When studying a new topic, your first step is:", "LEARNING_STYLE", 6, 12, "CLUSTER", [
    { text: "Read the introduction and make an outline", weights: { "Science & Research": 2, "Law & Legal": 2, "Engineering": 1 } },
    { text: "Watch a YouTube video explanation", weights: { "Technology & IT": 2, "Arts & Humanities": 2 } },
    { text: "Find a real-world example or case study", weights: { "Business & Commerce": 3, "Government & Civil Services": 1 } },
    { text: "Try it out — learn by doing", weights: { "Engineering": 3, "Defence & Security": 1 } },
  ]),
  q("How do you take notes in class?", "LEARNING_STYLE", 6, 12, "CLUSTER", [
    { text: "Detailed written notes in proper format", weights: { "Law & Legal": 2, "Science & Research": 2, "Government & Civil Services": 1 } },
    { text: "Mind maps and diagrams", weights: { "Engineering": 2, "Technology & IT": 2, "Arts & Humanities": 1 } },
    { text: "Quick shorthand and keywords", weights: { "Business & Commerce": 2, "Medical & Healthcare": 2 } },
    { text: "I mostly listen and remember", weights: { "Defence & Security": 2, "Education & Teaching": 2 } },
  ]),
  q("You remember things best when they are:", "LEARNING_STYLE", 6, 12, "CLUSTER", [
    { text: "Connected to a formula or logical structure", weights: { "Engineering": 3, "Science & Research": 2 } },
    { text: "Part of a story or real-life scenario", weights: { "Arts & Humanities": 2, "Education & Teaching": 2, "Law & Legal": 1 } },
    { text: "Explained with practical examples", weights: { "Business & Commerce": 2, "Medical & Healthcare": 2 } },
    { text: "Accompanied by visuals, colors, or music", weights: { "Arts & Humanities": 3, "Technology & IT": 1 } },
  ]),
  q("When preparing for an exam, you prefer:", "LEARNING_STYLE", 6, 12, "CLUSTER", [
    { text: "Solving past papers and practice problems", weights: { "Engineering": 3, "Science & Research": 2 } },
    { text: "Making summary flashcards", weights: { "Medical & Healthcare": 2, "Law & Legal": 2 } },
    { text: "Group study with discussions", weights: { "Business & Commerce": 2, "Education & Teaching": 2 } },
    { text: "Creating visual notes and color-coded summaries", weights: { "Arts & Humanities": 3, "Technology & IT": 1 } },
  ]),
  q("When instructions are unclear, you:", "LEARNING_STYLE", 6, 12, "CLUSTER", [
    { text: "Re-read carefully and analyze each word", weights: { "Law & Legal": 3, "Science & Research": 1 } },
    { text: "Ask the teacher or someone experienced", weights: { "Education & Teaching": 3, "Medical & Healthcare": 1 } },
    { text: "Try it your own way and adjust as you go", weights: { "Engineering": 2, "Technology & IT": 2 } },
    { text: "Improvise creatively", weights: { "Arts & Humanities": 3, "Business & Commerce": 1 } },
  ]),
  q("Your attention span is best for:", "LEARNING_STYLE", 6, 12, "CLUSTER", [
    { text: "Deep technical reading for hours", weights: { "Science & Research": 3, "Engineering": 2 } },
    { text: "Short, varied tasks switching frequently", weights: { "Business & Commerce": 2, "Technology & IT": 2 } },
    { text: "Physical activities and hands-on work", weights: { "Defence & Security": 3, "Engineering": 1 } },
    { text: "Creative work like writing, drawing, or music", weights: { "Arts & Humanities": 3 } },
  ]),
];

export const VALUES_QUESTIONS: QuestionTemplate[] = [
  q("What matters most to you in a future career?",  "VALUES", 8, 12, "CLUSTER", [
    { text: "High salary and financial stability", weights: { "Business & Commerce": 3, "Technology & IT": 2 } },
    { text: "Making a positive impact on society", weights: { "Government & Civil Services": 2, "Medical & Healthcare": 2, "Education & Teaching": 1 } },
    { text: "Creative freedom and self-expression", weights: { "Arts & Humanities": 3 } },
    { text: "Job security and a respected position", weights: { "Defence & Security": 2, "Government & Civil Services": 2 } },
  ]),
  q("Success to you means:", "VALUES", 8, 12, "CLUSTER", [
    { text: "Building wealth and a comfortable lifestyle", weights: { "Business & Commerce": 3, "Technology & IT": 1 } },
    { text: "Being recognized as an expert in your field", weights: { "Science & Research": 3, "Engineering": 1 } },
    { text: "Helping others and making the world better", weights: { "Medical & Healthcare": 2, "Education & Teaching": 2, "Government & Civil Services": 1 } },
    { text: "Living life on your own terms with creative freedom", weights: { "Arts & Humanities": 3 } },
  ]),
  q("You'd rather have a job that:", "VALUES", 8, 12, "CLUSTER", [
    { text: "Pays extremely well but is very stressful", weights: { "Business & Commerce": 3, "Law & Legal": 1 } },
    { text: "Is meaningful but pays modestly", weights: { "Education & Teaching": 3, "Government & Civil Services": 1 } },
    { text: "Offers adventure and excitement", weights: { "Defence & Security": 3, "Arts & Humanities": 1 } },
    { text: "Allows you to innovate and discover new things", weights: { "Science & Research": 3, "Technology & IT": 2 } },
  ]),
  q("Which motto resonates with you?", "VALUES", 6, 12, "CLUSTER", [
    { text: "'Work hard, earn more, live large'", weights: { "Business & Commerce": 3 } },
    { text: "'Service before self'", weights: { "Defence & Security": 2, "Government & Civil Services": 2, "Medical & Healthcare": 1 } },
    { text: "'Knowledge is the ultimate power'", weights: { "Science & Research": 3, "Education & Teaching": 2 } },
    { text: "'Create beauty in everything you do'", weights: { "Arts & Humanities": 3 } },
  ]),
  q("If you could only achieve one thing in life:", "VALUES", 8, 12, "CLUSTER", [
    { text: "Financial independence and wealth", weights: { "Business & Commerce": 3 } },
    { text: "A major scientific or medical breakthrough", weights: { "Science & Research": 3, "Medical & Healthcare": 2 } },
    { text: "A legacy that inspires future generations", weights: { "Education & Teaching": 2, "Government & Civil Services": 2, "Arts & Humanities": 1 } },
    { text: "Protecting your country and its people", weights: { "Defence & Security": 3, "Law & Legal": 1 } },
  ]),
  q("What would you sacrifice for your career?", "VALUES", 9, 12, "CLUSTER", [
    { text: "Personal time — I'd work 16 hours if the pay is right", weights: { "Business & Commerce": 3, "Technology & IT": 1 } },
    { text: "Comfort — I'd live in tough conditions for a mission", weights: { "Defence & Security": 3, "Medical & Healthcare": 1 } },
    { text: "Nothing — work-life balance is non-negotiable", weights: { "Education & Teaching": 2, "Arts & Humanities": 2 } },
    { text: "Years of study — I'd do a PhD if needed", weights: { "Science & Research": 3, "Medical & Healthcare": 2 } },
  ]),
  q("Your ideal legacy would be:", "VALUES", 8, 12, "CLUSTER", [
    { text: "A company or brand everyone knows", weights: { "Business & Commerce": 3, "Technology & IT": 1 } },
    { text: "A cure or discovery that saves millions", weights: { "Medical & Healthcare": 3, "Science & Research": 2 } },
    { text: "A piece of art, film, or music that endures forever", weights: { "Arts & Humanities": 3 } },
    { text: "A policy or law that changed the nation", weights: { "Government & Civil Services": 3, "Law & Legal": 2 } },
  ]),
  q("What kind of respect do you want?", "VALUES", 8, 12, "CLUSTER", [
    { text: "Respected for intelligence and knowledge", weights: { "Science & Research": 3, "Engineering": 1 } },
    { text: "Respected for wealth and business success", weights: { "Business & Commerce": 3 } },
    { text: "Respected for courage and sacrifice", weights: { "Defence & Security": 3, "Government & Civil Services": 1 } },
    { text: "Respected for creativity and talent", weights: { "Arts & Humanities": 3 } },
  ]),
];

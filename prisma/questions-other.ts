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
  q("A machine makes 120 items in 3 hours. How many will it make in 8 hours?", "APTITUDE", 6, 10, "CLUSTER", [
    { text: "320 - I worked it out quickly using simple ratios", weights: { "Engineering": 3, "Science & Research": 2 } },
    { text: "I would need paper and a pen to work it out", weights: { "Arts & Humanities": 1, "Education & Teaching": 2 } },
    { text: "I would think about the cost per item first", weights: { "Business & Commerce": 3 } },
    { text: "I would skip the maths and focus on quality", weights: { "Medical & Healthcare": 2, "Law & Legal": 1 } },
  ]),
  q("You notice a pattern in some data. What do you do first?", "APTITUDE", 8, 12, "CLUSTER", [
    { text: "Work out the maths behind it and find a rule", weights: { "Science & Research": 3, "Engineering": 2 } },
    { text: "Think about how to use it to make money", weights: { "Business & Commerce": 3, "Technology & IT": 1 } },
    { text: "Draw a picture or chart to show it", weights: { "Arts & Humanities": 3, "Technology & IT": 1 } },
    { text: "Think about what it means for public rules or law", weights: { "Government & Civil Services": 3, "Law & Legal": 1 } },
  ]),
  q("How do you usually fix a problem?", "APTITUDE", 8, 12, "CLUSTER", [
    { text: "Break it into small parts and test each one", weights: { "Engineering": 3, "Technology & IT": 2 } },
    { text: "Ask other people what they think first", weights: { "Education & Teaching": 2, "Medical & Healthcare": 2 } },
    { text: "Search for similar problems and how they were fixed", weights: { "Technology & IT": 2, "Science & Research": 2 } },
    { text: "Step back and think about the big picture", weights: { "Business & Commerce": 2, "Government & Civil Services": 2 } },
  ]),
  q("Someone gives you a map of a place you don't know. What do you do first?", "APTITUDE", 6, 12, "CLUSTER", [
    { text: "Study it and plan the safest way to travel", weights: { "Defence & Security": 3, "Science & Research": 1 } },
    { text: "Look for resources and business chances", weights: { "Business & Commerce": 3, "Government & Civil Services": 1 } },
    { text: "Study the landscape and natural features", weights: { "Science & Research": 3, "Engineering": 1 } },
    { text: "Sketch it out in a creative and artistic way", weights: { "Arts & Humanities": 3 } },
  ]),
  q("Two sources give you different information. What do you do?", "APTITUDE", 8, 12, "CLUSTER", [
    { text: "Check with data and facts to find the truth", weights: { "Science & Research": 3, "Engineering": 1 } },
    { text: "Check which source is more trusted", weights: { "Law & Legal": 3, "Government & Civil Services": 1 } },
    { text: "Ask an expert who knows the topic well", weights: { "Education & Teaching": 2, "Medical & Healthcare": 2 } },
    { text: "Go with whichever one seems more useful right now", weights: { "Business & Commerce": 2, "Technology & IT": 2 } },
  ]),
  q("Your teacher gives you a hard research task. What do you do?", "APTITUDE", 8, 12, "CLUSTER", [
    { text: "Make an outline and plan before I start writing", weights: { "Engineering": 2, "Science & Research": 2, "Law & Legal": 1 } },
    { text: "Start with the part that interests me most", weights: { "Arts & Humanities": 3, "Education & Teaching": 1 } },
    { text: "Find real-world stories and examples to include", weights: { "Business & Commerce": 2, "Government & Civil Services": 2 } },
    { text: "Collect data and do research with numbers", weights: { "Science & Research": 3, "Technology & IT": 1 } },
  ]),
  q("When you look at a graph or chart, you first notice:", "APTITUDE", 8, 12, "CLUSTER", [
    { text: "The trends, patterns, and any odd results", weights: { "Science & Research": 3, "Engineering": 2 } },
    { text: "Business chances hidden in the data", weights: { "Business & Commerce": 3, "Technology & IT": 1 } },
    { text: "Whether the chart is well designed and easy to read", weights: { "Arts & Humanities": 3 } },
    { text: "What changes in rules or policy the data shows", weights: { "Government & Civil Services": 3, "Law & Legal": 1 } },
  ]),
  q("You find a mistake in your textbook. What do you do?", "APTITUDE", 6, 12, "CLUSTER", [
    { text: "Check it myself first, then email the publisher", weights: { "Science & Research": 3, "Education & Teaching": 1 } },
    { text: "Tell my teacher and classmates about it", weights: { "Education & Teaching": 3, "Law & Legal": 1 } },
    { text: "Think about how much money this mistake could cost", weights: { "Business & Commerce": 3 } },
    { text: "Feel proud that I caught what others missed", weights: { "Law & Legal": 2, "Government & Civil Services": 2 } },
  ]),
  q("How fast can you memorise a list of 20 items?", "APTITUDE", 6, 12, "CLUSTER", [
    { text: "Very fast - I use memory tricks to remember them", weights: { "Medical & Healthcare": 3, "Science & Research": 1 } },
    { text: "Fairly fast - I put them into groups", weights: { "Business & Commerce": 2, "Engineering": 2 } },
    { text: "I prefer to understand things rather than memorise them", weights: { "Education & Teaching": 2, "Science & Research": 2 } },
    { text: "I make a song or picture to help me remember", weights: { "Arts & Humanities": 3, "Education & Teaching": 1 } },
  ]),
  q("How good are you at judging spaces and distances?", "APTITUDE", 6, 12, "CLUSTER", [
    { text: "Very good - I can picture 3D shapes in my head", weights: { "Engineering": 3, "Science & Research": 1 } },
    { text: "Good - I notice my surroundings well", weights: { "Defence & Security": 3, "Medical & Healthcare": 1 } },
    { text: "Average - I use words more than pictures", weights: { "Law & Legal": 2, "Arts & Humanities": 2 } },
    { text: "Creative - I see things others do not notice", weights: { "Arts & Humanities": 3, "Technology & IT": 1 } },
  ]),
  q("When you need to explain something hard, you usually:", "APTITUDE", 6, 12, "CLUSTER", [
    { text: "Draw a diagram or flowchart", weights: { "Engineering": 3, "Science & Research": 2 } },
    { text: "Use a real-life example or a story", weights: { "Education & Teaching": 3, "Arts & Humanities": 1 } },
    { text: "Give simple numbered steps", weights: { "Technology & IT": 2, "Business & Commerce": 2 } },
    { text: "Show them by doing it in front of them", weights: { "Medical & Healthcare": 2, "Defence & Security": 2 } },
  ]),
  q("How well do you handle numbers and sums?", "APTITUDE", 6, 12, "CLUSTER", [
    { text: "Very well - numbers feel natural to me", weights: { "Engineering": 3, "Science & Research": 2, "Business & Commerce": 1 } },
    { text: "Well enough for everyday use", weights: { "Business & Commerce": 2, "Technology & IT": 2 } },
    { text: "I find it a bit hard but I manage", weights: { "Arts & Humanities": 2, "Law & Legal": 1 } },
    { text: "I prefer words and writing over numbers", weights: { "Arts & Humanities": 3, "Education & Teaching": 1 } },
  ]),
  q("In an emergency, how do you react?", "APTITUDE", 6, 12, "CLUSTER", [
    { text: "Fast and bold - I act without waiting", weights: { "Defence & Security": 3, "Medical & Healthcare": 2 } },
    { text: "Calm - I think before I act", weights: { "Science & Research": 2, "Engineering": 2 } },
    { text: "I look for help and work with others", weights: { "Government & Civil Services": 2, "Business & Commerce": 2 } },
    { text: "I freeze first, then think of a creative solution", weights: { "Arts & Humanities": 2, "Education & Teaching": 1 } },
  ]),
  q("How good are you at understanding how others feel?", "APTITUDE", 8, 12, "CLUSTER", [
    { text: "Very good - I know how someone feels straight away", weights: { "Medical & Healthcare": 2, "Education & Teaching": 2, "Law & Legal": 1 } },
    { text: "Good - I pay attention to body language", weights: { "Defence & Security": 2, "Law & Legal": 2 } },
    { text: "Average - I care more about facts than feelings", weights: { "Engineering": 2, "Science & Research": 2 } },
    { text: "I understand feelings better through art and music", weights: { "Arts & Humanities": 3 } },
  ]),
  q("How well do you work when things are very stressful?", "APTITUDE", 8, 12, "CLUSTER", [
    { text: "Very well - I do my best when the stakes are high", weights: { "Defence & Security": 3, "Medical & Healthcare": 2 } },
    { text: "Okay - I manage well if I have a good plan", weights: { "Business & Commerce": 3, "Engineering": 1 } },
    { text: "I need quiet time and space to do my best work", weights: { "Science & Research": 2, "Arts & Humanities": 2 } },
    { text: "I can help others stay calm in hard situations", weights: { "Government & Civil Services": 3, "Law & Legal": 1 } },
  ]),
  // Extra aptitude questions
  q("If you see two ways to solve a problem, you:", "APTITUDE", 8, 12, "CLUSTER", [
    { text: "Test both ways and pick the one that works better", weights: { "Science & Research": 3, "Engineering": 2 } },
    { text: "Pick the faster and cheaper one", weights: { "Business & Commerce": 3, "Technology & IT": 1 } },
    { text: "Pick the one that is easiest to explain", weights: { "Education & Teaching": 3, "Law & Legal": 1 } },
    { text: "Pick the one that looks or feels better", weights: { "Arts & Humanities": 3 } },
  ]),
  q("How long can you focus on one hard task without a break?", "APTITUDE", 8, 12, "CLUSTER", [
    { text: "A long time - I go deep and do not get distracted", weights: { "Science & Research": 3, "Engineering": 2 } },
    { text: "A few hours - I take short breaks to keep going", weights: { "Law & Legal": 2, "Medical & Healthcare": 2 } },
    { text: "I switch tasks often to keep my mind fresh", weights: { "Business & Commerce": 2, "Technology & IT": 2 } },
    { text: "I work in short bursts and am most creative under pressure", weights: { "Arts & Humanities": 3 } },
  ]),
  q("When you read instructions, you usually:", "APTITUDE", 6, 12, "CLUSTER", [
    { text: "Read all steps before starting", weights: { "Engineering": 2, "Science & Research": 2 } },
    { text: "Start doing it while reading", weights: { "Defence & Security": 2, "Technology & IT": 2 } },
    { text: "Skim and ask questions if I get stuck", weights: { "Education & Teaching": 3, "Business & Commerce": 1 } },
    { text: "Ignore instructions and figure it out on my own", weights: { "Arts & Humanities": 2, "Engineering": 1 } },
  ]),
  q("How good are you at spotting small mistakes in written work?", "APTITUDE", 6, 12, "CLUSTER", [
    { text: "Very good - I always catch errors others miss", weights: { "Law & Legal": 3, "Science & Research": 2 } },
    { text: "Good - I check carefully before submitting", weights: { "Engineering": 2, "Medical & Healthcare": 2 } },
    { text: "Average - I try but I sometimes miss things", weights: { "Business & Commerce": 2, "Education & Teaching": 2 } },
    { text: "I focus more on ideas than small details", weights: { "Arts & Humanities": 3, "Government & Civil Services": 1 } },
  ]),
  q("When you have to learn a lot of new information quickly, you:", "APTITUDE", 8, 12, "CLUSTER", [
    { text: "Make notes and review them many times", weights: { "Medical & Healthcare": 2, "Law & Legal": 2 } },
    { text: "Build a mind map or visual summary", weights: { "Engineering": 2, "Arts & Humanities": 2 } },
    { text: "Find the most important parts and focus only on those", weights: { "Business & Commerce": 3, "Government & Civil Services": 1 } },
    { text: "Try to use the knowledge right away in a real task", weights: { "Technology & IT": 2, "Defence & Security": 2 } },
  ]),
];

export const PERSONALITY_QUESTIONS: QuestionTemplate[] = [
  q("When you have to make a big decision, you rely most on:", "PERSONALITY", 8, 12, "CLUSTER", [
    { text: "Facts, data, and clear logic", weights: { "Engineering": 2, "Science & Research": 2, "Technology & IT": 1 } },
    { text: "Your gut feeling", weights: { "Arts & Humanities": 2, "Defence & Security": 2 } },
    { text: "Advice from people you trust", weights: { "Education & Teaching": 2, "Medical & Healthcare": 2 } },
    { text: "Listing pros and cons like a business plan", weights: { "Business & Commerce": 3, "Law & Legal": 1 } },
  ]),
  q("When you fail at something, what do you do?", "PERSONALITY", 8, 12, "CLUSTER", [
    { text: "Think about what went wrong and try a new way", weights: { "Engineering": 3, "Science & Research": 2 } },
    { text: "Get back up fast - failure makes me stronger", weights: { "Defence & Security": 3, "Business & Commerce": 1 } },
    { text: "Write or draw to express how I feel", weights: { "Arts & Humanities": 3 } },
    { text: "Talk to a friend or mentor for support", weights: { "Education & Teaching": 2, "Medical & Healthcare": 2 } },
  ]),
  q("In a debate, what do you usually do?", "PERSONALITY", 6, 12, "CLUSTER", [
    { text: "Show facts and proof to win logically", weights: { "Law & Legal": 3, "Science & Research": 2 } },
    { text: "Tell stories that connect with people's feelings", weights: { "Arts & Humanities": 2, "Education & Teaching": 2 } },
    { text: "Look for a middle ground that works for everyone", weights: { "Government & Civil Services": 3, "Business & Commerce": 1 } },
    { text: "Stand my ground and argue strongly for my side", weights: { "Defence & Security": 2, "Law & Legal": 2 } },
  ]),
  q("Would you say you are more of an introvert or an extrovert?", "PERSONALITY", 6, 12, "CLUSTER", [
    { text: "Introvert - I feel better spending time alone", weights: { "Science & Research": 3, "Technology & IT": 2 } },
    { text: "Both - depends on the day and situation", weights: { "Engineering": 2, "Medical & Healthcare": 2 } },
    { text: "Extrovert - I love being with people", weights: { "Business & Commerce": 2, "Education & Teaching": 2 } },
    { text: "I show myself best through art, not words", weights: { "Arts & Humanities": 3 } },
  ]),
  q("When you see someone being treated unfairly, you:", "PERSONALITY", 6, 12, "CLUSTER", [
    { text: "Speak up right away and face the situation", weights: { "Law & Legal": 3, "Defence & Security": 2 } },
    { text: "Tell the right person in charge", weights: { "Government & Civil Services": 3, "Education & Teaching": 1 } },
    { text: "Comfort the person and offer support", weights: { "Medical & Healthcare": 3, "Education & Teaching": 1 } },
    { text: "Write about it or make something to spread the message", weights: { "Arts & Humanities": 3, "Law & Legal": 1 } },
  ]),
  q("How tidy and organised are you?", "PERSONALITY", 6, 12, "CLUSTER", [
    { text: "Very tidy - everything has its own place", weights: { "Engineering": 2, "Business & Commerce": 2, "Government & Civil Services": 1 } },
    { text: "A bit messy but I know where everything is", weights: { "Arts & Humanities": 2, "Technology & IT": 2 } },
    { text: "I keep detailed notes and records", weights: { "Law & Legal": 3, "Science & Research": 1 } },
    { text: "Very strict with my routine and schedule", weights: { "Defence & Security": 3, "Medical & Healthcare": 1 } },
  ]),
  q("When someone disagrees with you, you usually:", "PERSONALITY", 8, 12, "CLUSTER", [
    { text: "Listen and then share facts to explain my view", weights: { "Law & Legal": 3, "Science & Research": 1 } },
    { text: "Try to understand how they see it", weights: { "Education & Teaching": 3, "Medical & Healthcare": 1 } },
    { text: "Hold my ground if I know I am right", weights: { "Defence & Security": 2, "Government & Civil Services": 2 } },
    { text: "Agree to disagree and move on", weights: { "Arts & Humanities": 2, "Business & Commerce": 2 } },
  ]),
  q("How do you feel about taking risks?", "PERSONALITY", 8, 12, "CLUSTER", [
    { text: "I love taking big risks", weights: { "Business & Commerce": 3, "Defence & Security": 2 } },
    { text: "I take risks only after doing research", weights: { "Engineering": 2, "Science & Research": 2, "Technology & IT": 1 } },
    { text: "I prefer safe and steady paths", weights: { "Government & Civil Services": 2, "Education & Teaching": 2 } },
    { text: "I take unusual paths that others are afraid of", weights: { "Arts & Humanities": 3 } },
  ]),
  q("When a classmate is sick, what do you do first?", "PERSONALITY", 6, 10, "CLUSTER", [
    { text: "Help them feel better and give advice", weights: { "Medical & Healthcare": 3, "Education & Teaching": 1 } },
    { text: "Share my notes and help them catch up on class work", weights: { "Education & Teaching": 3 } },
    { text: "Think about what could have caused the illness", weights: { "Science & Research": 3, "Medical & Healthcare": 1 } },
    { text: "Feel bad for them but focus on my own work", weights: { "Engineering": 1, "Business & Commerce": 2, "Technology & IT": 1 } },
  ]),
  q("How would you describe the way you talk to people?", "PERSONALITY", 8, 12, "CLUSTER", [
    { text: "Clear and exact - I say exactly what I mean", weights: { "Engineering": 2, "Science & Research": 2, "Technology & IT": 1 } },
    { text: "Convincing - I know how to make people agree with me", weights: { "Business & Commerce": 3, "Law & Legal": 1 } },
    { text: "Warm and caring - I connect with people emotionally", weights: { "Medical & Healthcare": 2, "Education & Teaching": 2 } },
    { text: "Creative - I use stories, jokes, and images", weights: { "Arts & Humanities": 3 } },
  ]),
  q("How do you handle waiting in a long line?", "PERSONALITY", 6, 12, "CLUSTER", [
    { text: "Wait patiently - I have strong self-control", weights: { "Defence & Security": 3, "Government & Civil Services": 1 } },
    { text: "Use the time to plan or think about something", weights: { "Business & Commerce": 2, "Engineering": 2 } },
    { text: "Read a book or sketch something", weights: { "Arts & Humanities": 3, "Education & Teaching": 1 } },
    { text: "Start chatting with the person next to me", weights: { "Medical & Healthcare": 1, "Education & Teaching": 2, "Law & Legal": 1 } },
  ]),
  q("How do you feel about rules?", "PERSONALITY", 6, 12, "CLUSTER", [
    { text: "I follow them strictly - rules keep order", weights: { "Defence & Security": 3, "Government & Civil Services": 2 } },
    { text: "I follow them but I question unfair ones", weights: { "Law & Legal": 3, "Education & Teaching": 1 } },
    { text: "I bend them a little if the end result is good", weights: { "Business & Commerce": 3, "Technology & IT": 1 } },
    { text: "Rules limit my creativity - I prefer freedom", weights: { "Arts & Humanities": 3 } },
  ]),
  q("How much do you like to compete with others?", "PERSONALITY", 6, 12, "CLUSTER", [
    { text: "A lot - I always want to be the best", weights: { "Business & Commerce": 3, "Defence & Security": 2 } },
    { text: "Somewhat - I compete but also like teamwork", weights: { "Engineering": 2, "Science & Research": 2 } },
    { text: "I mostly compete with myself, not others", weights: { "Arts & Humanities": 2, "Medical & Healthcare": 2 } },
    { text: "I believe in working together, not competing", weights: { "Education & Teaching": 3, "Government & Civil Services": 1 } },
  ]),
  q("How do you handle deadlines?", "PERSONALITY", 8, 12, "CLUSTER", [
    { text: "I always finish before the deadline", weights: { "Defence & Security": 2, "Engineering": 2, "Government & Civil Services": 1 } },
    { text: "I finish on time with good planning", weights: { "Business & Commerce": 3, "Law & Legal": 1 } },
    { text: "I sometimes wait till the last minute but do good work", weights: { "Arts & Humanities": 2, "Science & Research": 2 } },
    { text: "Deadlines stress me - I prefer working at my own pace", weights: { "Education & Teaching": 2, "Medical & Healthcare": 1 } },
  ]),
  q("When you do well at something, you:", "PERSONALITY", 6, 12, "CLUSTER", [
    { text: "Quietly be happy and set a new goal", weights: { "Science & Research": 2, "Engineering": 2 } },
    { text: "Share it with everyone - I enjoy being recognised", weights: { "Business & Commerce": 2, "Arts & Humanities": 2 } },
    { text: "Feel thankful and want to help others do well too", weights: { "Education & Teaching": 3, "Medical & Healthcare": 1 } },
    { text: "Think about what worked and how to repeat it", weights: { "Technology & IT": 2, "Business & Commerce": 2 } },
  ]),
  // Extra personality questions
  q("How do you feel when plans suddenly change?", "PERSONALITY", 6, 12, "CLUSTER", [
    { text: "Fine - I can adapt quickly and find a new way", weights: { "Defence & Security": 3, "Business & Commerce": 2 } },
    { text: "A little upset - I like to know what is coming", weights: { "Engineering": 2, "Government & Civil Services": 2 } },
    { text: "Okay - I trust that things will work out", weights: { "Medical & Healthcare": 2, "Education & Teaching": 2 } },
    { text: "Happy - surprises can lead to new creative ideas", weights: { "Arts & Humanities": 3, "Technology & IT": 1 } },
  ]),
  q("How do you feel about helping others?", "PERSONALITY", 6, 12, "CLUSTER", [
    { text: "It gives me great joy and I do it all the time", weights: { "Medical & Healthcare": 2, "Education & Teaching": 3 } },
    { text: "I help when needed but focus on my own goals too", weights: { "Business & Commerce": 2, "Engineering": 2 } },
    { text: "I help best by doing my job well", weights: { "Science & Research": 2, "Technology & IT": 2 } },
    { text: "I help through art - by inspiring and touching hearts", weights: { "Arts & Humanities": 3 } },
  ]),
  q("Do you prefer to lead or follow in a group?", "PERSONALITY", 6, 12, "CLUSTER", [
    { text: "Lead - I like to be in charge of things", weights: { "Defence & Security": 3, "Business & Commerce": 2 } },
    { text: "Both - I can do either depending on what is needed", weights: { "Government & Civil Services": 2, "Engineering": 2 } },
    { text: "Follow - I do my best work as part of a team", weights: { "Medical & Healthcare": 2, "Education & Teaching": 2 } },
    { text: "I prefer to work alone on my own creative ideas", weights: { "Arts & Humanities": 3, "Science & Research": 1 } },
  ]),
  q("How do you usually handle boredom?", "PERSONALITY", 6, 12, "CLUSTER", [
    { text: "Start a new experiment or project right away", weights: { "Engineering": 2, "Science & Research": 2 } },
    { text: "Look for a way to earn money or learn a skill", weights: { "Business & Commerce": 3, "Technology & IT": 1 } },
    { text: "Create something - draw, write, or play music", weights: { "Arts & Humanities": 3 } },
    { text: "Go for a run, do exercise, or spend time outdoors", weights: { "Defence & Security": 3, "Medical & Healthcare": 1 } },
  ]),
  q("How do you feel about meeting new people?", "PERSONALITY", 6, 12, "CLUSTER", [
    { text: "I love it - every new person is an interesting story", weights: { "Law & Legal": 2, "Education & Teaching": 2, "Medical & Healthcare": 1 } },
    { text: "I like it, especially in a professional setting", weights: { "Business & Commerce": 3, "Government & Civil Services": 1 } },
    { text: "I prefer small groups over large crowds", weights: { "Science & Research": 2, "Engineering": 2 } },
    { text: "I prefer connecting through shared creative interests", weights: { "Arts & Humanities": 3 } },
  ]),
];

export const LEARNING_STYLE_QUESTIONS: QuestionTemplate[] = [
  q("You learn best when you:", "LEARNING_STYLE", 6, 12, "CLUSTER", [
    { text: "Do experiments and build things with your hands", weights: { "Engineering": 3, "Science & Research": 2 } },
    { text: "Read detailed books and articles", weights: { "Law & Legal": 2, "Science & Research": 2, "Education & Teaching": 1 } },
    { text: "Watch someone show you how to do it", weights: { "Arts & Humanities": 2, "Technology & IT": 2 } },
    { text: "Talk and debate ideas with others", weights: { "Business & Commerce": 2, "Government & Civil Services": 2 } },
  ]),
  q("Where do you study best?", "LEARNING_STYLE", 6, 12, "CLUSTER", [
    { text: "A quiet library with just books and notes", weights: { "Science & Research": 2, "Law & Legal": 2, "Medical & Healthcare": 1 } },
    { text: "A workshop or lab with tools to use", weights: { "Engineering": 3, "Technology & IT": 2 } },
    { text: "A cafe or place with some background noise", weights: { "Arts & Humanities": 3, "Business & Commerce": 1 } },
    { text: "Outdoors in nature", weights: { "Defence & Security": 2, "Science & Research": 1, "Arts & Humanities": 1 } },
  ]),
  q("When you start learning a new topic, what do you do first?", "LEARNING_STYLE", 6, 12, "CLUSTER", [
    { text: "Read the intro and make a simple outline", weights: { "Science & Research": 2, "Law & Legal": 2, "Engineering": 1 } },
    { text: "Watch a short video explanation", weights: { "Technology & IT": 2, "Arts & Humanities": 2 } },
    { text: "Look for a real-world example or story", weights: { "Business & Commerce": 3, "Government & Civil Services": 1 } },
    { text: "Just try it and learn from mistakes", weights: { "Engineering": 3, "Defence & Security": 1 } },
  ]),
  q("How do you take notes in class?", "LEARNING_STYLE", 6, 12, "CLUSTER", [
    { text: "Detailed and well-organised written notes", weights: { "Law & Legal": 2, "Science & Research": 2, "Government & Civil Services": 1 } },
    { text: "Mind maps and diagrams", weights: { "Engineering": 2, "Technology & IT": 2, "Arts & Humanities": 1 } },
    { text: "Short key words and phrases", weights: { "Business & Commerce": 2, "Medical & Healthcare": 2 } },
    { text: "I mostly listen and remember", weights: { "Defence & Security": 2, "Education & Teaching": 2 } },
  ]),
  q("What helps you remember things best?", "LEARNING_STYLE", 6, 12, "CLUSTER", [
    { text: "A formula or logical structure", weights: { "Engineering": 3, "Science & Research": 2 } },
    { text: "A story or real-life event", weights: { "Arts & Humanities": 2, "Education & Teaching": 2, "Law & Legal": 1 } },
    { text: "A practical example I can relate to", weights: { "Business & Commerce": 2, "Medical & Healthcare": 2 } },
    { text: "A picture, colour, or song connected to it", weights: { "Arts & Humanities": 3, "Technology & IT": 1 } },
  ]),
  q("How do you prepare for a big exam?", "LEARNING_STYLE", 6, 12, "CLUSTER", [
    { text: "Solve lots of past papers and practice problems", weights: { "Engineering": 3, "Science & Research": 2 } },
    { text: "Make small summary cards to review", weights: { "Medical & Healthcare": 2, "Law & Legal": 2 } },
    { text: "Study with friends and have group discussions", weights: { "Business & Commerce": 2, "Education & Teaching": 2 } },
    { text: "Make colourful notes and visual summaries", weights: { "Arts & Humanities": 3, "Technology & IT": 1 } },
  ]),
  q("When instructions are not clear, you:", "LEARNING_STYLE", 6, 12, "CLUSTER", [
    { text: "Read them again very carefully", weights: { "Law & Legal": 3, "Science & Research": 1 } },
    { text: "Ask your teacher or an expert", weights: { "Education & Teaching": 3, "Medical & Healthcare": 1 } },
    { text: "Try your own way and adjust as you go", weights: { "Engineering": 2, "Technology & IT": 2 } },
    { text: "Make it up and add your own creative touch", weights: { "Arts & Humanities": 3, "Business & Commerce": 1 } },
  ]),
  q("What kind of work keeps you focused the longest?", "LEARNING_STYLE", 6, 12, "CLUSTER", [
    { text: "Deep technical reading or studying for hours", weights: { "Science & Research": 3, "Engineering": 2 } },
    { text: "Short, varied tasks that switch between topics", weights: { "Business & Commerce": 2, "Technology & IT": 2 } },
    { text: "Physical activities and hands-on work", weights: { "Defence & Security": 3, "Engineering": 1 } },
    { text: "Creative work like writing, drawing, or music", weights: { "Arts & Humanities": 3 } },
  ]),
  // Extra learning style questions
  q("After a teacher explains something, what do you do?", "LEARNING_STYLE", 6, 12, "CLUSTER", [
    { text: "Try to solve a practice problem right away", weights: { "Engineering": 3, "Science & Research": 2 } },
    { text: "Read more about the topic on my own", weights: { "Law & Legal": 2, "Medical & Healthcare": 2 } },
    { text: "Explain it to someone else to make sure I understood", weights: { "Education & Teaching": 3, "Business & Commerce": 1 } },
    { text: "Draw or write something creative based on the topic", weights: { "Arts & Humanities": 3, "Technology & IT": 1 } },
  ]),
  q("What kind of school project do you enjoy most?", "LEARNING_STYLE", 6, 12, "CLUSTER", [
    { text: "Building or making something with my hands", weights: { "Engineering": 3, "Technology & IT": 2 } },
    { text: "Writing a report or doing research", weights: { "Science & Research": 2, "Law & Legal": 2 } },
    { text: "Presenting or acting in front of the class", weights: { "Arts & Humanities": 3, "Education & Teaching": 1 } },
    { text: "Planning, budgeting, and managing a team", weights: { "Business & Commerce": 3, "Government & Civil Services": 1 } },
  ]),
];

export const VALUES_QUESTIONS: QuestionTemplate[] = [
  q("What is most important to you in a future job?", "VALUES", 8, 12, "CLUSTER", [
    { text: "A high salary and financial security", weights: { "Business & Commerce": 3, "Technology & IT": 2 } },
    { text: "Making a real difference in people's lives", weights: { "Government & Civil Services": 2, "Medical & Healthcare": 2, "Education & Teaching": 1 } },
    { text: "Freedom to be creative and express yourself", weights: { "Arts & Humanities": 3 } },
    { text: "A stable job with status and respect", weights: { "Defence & Security": 2, "Government & Civil Services": 2 } },
  ]),
  q("What does success mean to you?", "VALUES", 8, 12, "CLUSTER", [
    { text: "Building wealth and living comfortably", weights: { "Business & Commerce": 3, "Technology & IT": 1 } },
    { text: "Being known as an expert in what you do", weights: { "Science & Research": 3, "Engineering": 1 } },
    { text: "Helping others and making the world a better place", weights: { "Medical & Healthcare": 2, "Education & Teaching": 2, "Government & Civil Services": 1 } },
    { text: "Living life the way you want with creative freedom", weights: { "Arts & Humanities": 3 } },
  ]),
  q("What kind of job would you prefer?", "VALUES", 8, 12, "CLUSTER", [
    { text: "One that pays very well, even if it is very stressful", weights: { "Business & Commerce": 3, "Law & Legal": 1 } },
    { text: "One that feels meaningful, even if the pay is low", weights: { "Education & Teaching": 3, "Government & Civil Services": 1 } },
    { text: "One that is exciting and full of adventure", weights: { "Defence & Security": 3, "Arts & Humanities": 1 } },
    { text: "One that lets you discover and invent new things", weights: { "Science & Research": 3, "Technology & IT": 2 } },
  ]),
  q("Which saying do you agree with most?", "VALUES", 6, 12, "CLUSTER", [
    { text: "'Work hard, earn more, live big'", weights: { "Business & Commerce": 3 } },
    { text: "'Others come first - I serve before myself'", weights: { "Defence & Security": 2, "Government & Civil Services": 2, "Medical & Healthcare": 1 } },
    { text: "'Learning is the greatest power you can have'", weights: { "Science & Research": 3, "Education & Teaching": 2 } },
    { text: "'Create beauty in all that you do'", weights: { "Arts & Humanities": 3 } },
  ]),
  q("If you could only achieve one thing in your whole life, what would it be?", "VALUES", 8, 12, "CLUSTER", [
    { text: "Be financially free and wealthy", weights: { "Business & Commerce": 3 } },
    { text: "Make a big discovery in science or medicine", weights: { "Science & Research": 3, "Medical & Healthcare": 2 } },
    { text: "Leave behind something that inspires future generations", weights: { "Education & Teaching": 2, "Government & Civil Services": 2, "Arts & Humanities": 1 } },
    { text: "Protect and serve your country bravely", weights: { "Defence & Security": 3, "Law & Legal": 1 } },
  ]),
  q("What would you give up for your career?", "VALUES", 9, 12, "CLUSTER", [
    { text: "Free time - I would work long hours if the pay is great", weights: { "Business & Commerce": 3, "Technology & IT": 1 } },
    { text: "Comfort - I would live in hard conditions to serve a mission", weights: { "Defence & Security": 3, "Medical & Healthcare": 1 } },
    { text: "Nothing - I believe in keeping work and life in balance", weights: { "Education & Teaching": 2, "Arts & Humanities": 2 } },
    { text: "Years of study - I would do a PhD if I had to", weights: { "Science & Research": 3, "Medical & Healthcare": 2 } },
  ]),
  q("What do you want to be remembered for?", "VALUES", 8, 12, "CLUSTER", [
    { text: "Building a company or brand that everyone knows", weights: { "Business & Commerce": 3, "Technology & IT": 1 } },
    { text: "Finding a cure or discovery that saved millions of lives", weights: { "Medical & Healthcare": 3, "Science & Research": 2 } },
    { text: "Creating a piece of art or music that people never forget", weights: { "Arts & Humanities": 3 } },
    { text: "Making a law or policy that changed the country", weights: { "Government & Civil Services": 3, "Law & Legal": 2 } },
  ]),
  q("How do you want people to respect you?", "VALUES", 8, 12, "CLUSTER", [
    { text: "For your knowledge and intelligence", weights: { "Science & Research": 3, "Engineering": 1 } },
    { text: "For your wealth and business success", weights: { "Business & Commerce": 3 } },
    { text: "For your courage and willingness to sacrifice", weights: { "Defence & Security": 3, "Government & Civil Services": 1 } },
    { text: "For your creativity and talent", weights: { "Arts & Humanities": 3 } },
  ]),
  // Extra values questions
  q("If you could redesign school, what would you add?", "VALUES", 6, 10, "CLUSTER", [
    { text: "More practical science and tech projects", weights: { "Engineering": 2, "Science & Research": 2, "Technology & IT": 1 } },
    { text: "Real business and money management classes", weights: { "Business & Commerce": 3 } },
    { text: "Art, music, and creative expression every day", weights: { "Arts & Humanities": 3, "Education & Teaching": 1 } },
    { text: "Physical fitness and outdoor leadership training", weights: { "Defence & Security": 3, "Medical & Healthcare": 1 } },
  ]),
  q("If you could work anywhere in the world, where would you go?", "VALUES", 8, 12, "CLUSTER", [
    { text: "A top tech company like Google or NASA", weights: { "Technology & IT": 3, "Engineering": 2 } },
    { text: "A hospital or medical research lab", weights: { "Medical & Healthcare": 3, "Science & Research": 1 } },
    { text: "An international business firm or startup", weights: { "Business & Commerce": 3 } },
    { text: "A creative agency, film studio, or music company", weights: { "Arts & Humanities": 3 } },
  ]),
  q("Which thing matters more to you when you grow up?", "VALUES", 8, 12, "CLUSTER", [
    { text: "Earning a lot of money", weights: { "Business & Commerce": 3, "Technology & IT": 1 } },
    { text: "Having a job that helps others", weights: { "Medical & Healthcare": 2, "Education & Teaching": 2, "Government & Civil Services": 1 } },
    { text: "Being free to do creative work you love", weights: { "Arts & Humanities": 3 } },
    { text: "Being known and respected in your field", weights: { "Science & Research": 2, "Engineering": 2, "Law & Legal": 1 } },
  ]),
  q("What kind of change would you most like to bring to India?", "VALUES", 9, 12, "CLUSTER", [
    { text: "Make India a world leader in science and technology", weights: { "Technology & IT": 2, "Engineering": 2, "Science & Research": 1 } },
    { text: "Ensure every Indian has access to good healthcare", weights: { "Medical & Healthcare": 3, "Government & Civil Services": 1 } },
    { text: "Build a strong and honest government", weights: { "Government & Civil Services": 3, "Law & Legal": 2 } },
    { text: "Promote Indian art, culture, and creativity worldwide", weights: { "Arts & Humanities": 3, "Education & Teaching": 1 } },
  ]),
];

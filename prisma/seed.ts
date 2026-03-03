import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Create admin user
  const adminPassword = await bcrypt.hash("admin123", 12);
  const admin = await prisma.user.upsert({
    where: { email: "admin@aiguide.in" },
    update: {},
    create: {
      email: "admin@aiguide.in",
      password: adminPassword,
      name: "Admin User",
      role: "ADMIN",
    },
  });
  console.log("✅ Admin created:", admin.email);

  // Create career clusters
  const clusters = [
    { name: "Engineering", description: "Design, build, and innovate across mechanical, electrical, civil, and software engineering.", icon: "⚙️", color: "#4361ee" },
    { name: "Medical", description: "Heal, research, and care for patients in medicine, dentistry, pharmacy, and allied health.", icon: "🏥", color: "#e63946" },
    { name: "Business", description: "Lead organizations, manage finances, and drive growth in commerce and entrepreneurship.", icon: "💼", color: "#f8961e" },
    { name: "Arts & Design", description: "Create, express, and design through visual arts, media, writing, and performing arts.", icon: "🎨", color: "#7209b7" },
    { name: "Law", description: "Advocate for justice, interpret laws, and protect rights in legal practice.", icon: "⚖️", color: "#457b9d" },
    { name: "Education", description: "Teach, mentor, and shape the future through education and academic research.", icon: "📚", color: "#2a9d8f" },
    { name: "Government", description: "Serve the nation through civil services, administration, and public policy.", icon: "🏛️", color: "#264653" },
    { name: "Defence", description: "Protect the nation through military services, strategic planning, and security.", icon: "🎖️", color: "#606c38" },
    { name: "Sports", description: "Compete, coach, and manage in athletics, fitness, and sports management.", icon: "🏅", color: "#bc6c25" },
    { name: "Technology", description: "Innovate with AI, data science, cybersecurity, and emerging tech.", icon: "💻", color: "#00b4d8" },
    { name: "Creative Arts", description: "Perform, direct, and produce in film, theater, music, and digital media.", icon: "🎭", color: "#e76f51" },
    { name: "Vocational", description: "Build practical skills in trades, craftsmanship, and technical services.", icon: "🔧", color: "#6c757d" },
  ];

  const createdClusters: Record<string, string> = {};
  for (let i = 0; i < clusters.length; i++) {
    const cluster = await prisma.careerCluster.upsert({
      where: { name: clusters[i].name },
      update: {},
      create: { ...clusters[i], sortOrder: i },
    });
    createdClusters[cluster.name] = cluster.id;
  }
  console.log("✅ Career clusters created:", Object.keys(createdClusters).length);

  // Create branches — comprehensive India-relevant career paths
  const branches: Record<string, Array<{ name: string; description: string; eligibility: string; competition: string; effort: string }>> = {
    Engineering: [
      { name: "Computer Science", description: "Software development, algorithms, and computing systems. High demand in IT hubs like Bangalore, Hyderabad, Pune.", eligibility: "10+2 with PCM; JEE Main/Advanced for IITs/NITs", competition: "High", effort: "High" },
      { name: "Mechanical Engineering", description: "Design and manufacture of machines, automobiles, and industrial equipment.", eligibility: "10+2 with PCM; JEE/State CET", competition: "Medium", effort: "High" },
      { name: "Electrical Engineering", description: "Power generation, distribution, electrical systems and renewable energy.", eligibility: "10+2 with PCM; JEE/State CET", competition: "Medium", effort: "High" },
      { name: "Civil Engineering", description: "Construction, infrastructure development, urban planning, and smart cities.", eligibility: "10+2 with PCM; JEE/State CET", competition: "Medium", effort: "Medium" },
      { name: "Electronics & Communication", description: "VLSI, embedded systems, telecom, and semiconductor design.", eligibility: "10+2 with PCM; JEE/State CET", competition: "Medium", effort: "High" },
      { name: "Chemical Engineering", description: "Petrochemicals, pharmaceuticals, food processing, and material science.", eligibility: "10+2 with PCM; JEE/State CET", competition: "Medium", effort: "High" },
      { name: "Aerospace Engineering", description: "Aircraft, spacecraft, and satellite design for ISRO, HAL, DRDO.", eligibility: "10+2 with PCM; JEE Advanced for IITs", competition: "High", effort: "High" },
      { name: "Biotechnology", description: "Genetic engineering, bioinformatics, and biomedical research.", eligibility: "10+2 with PCM/PCB; JEE/State CET", competition: "Medium", effort: "High" },
      { name: "Architecture", description: "Building design, urban planning, sustainable architecture, and interior spaces.", eligibility: "10+2 with Maths; NATA/JEE Paper 2", competition: "Medium", effort: "High" },
      { name: "Environmental Engineering", description: "Pollution control, waste management, water treatment, and sustainability.", eligibility: "10+2 with PCM; JEE/State CET", competition: "Low", effort: "Medium" },
    ],
    Medical: [
      { name: "MBBS", description: "Become a doctor — diagnose, treat, and prevent diseases. India's most prestigious medical degree.", eligibility: "10+2 with PCB (min 50%); NEET UG qualified", competition: "High", effort: "High" },
      { name: "BDS (Dentistry)", description: "Dental surgery, orthodontics, and oral healthcare.", eligibility: "10+2 with PCB; NEET UG qualified", competition: "Medium", effort: "High" },
      { name: "BAMS (Ayurveda)", description: "Traditional Indian medicine — Ayurvedic diagnosis and treatment.", eligibility: "10+2 with PCB; NEET UG qualified", competition: "Medium", effort: "High" },
      { name: "BHMS (Homeopathy)", description: "Homeopathic medicine — alternative healing and patient care.", eligibility: "10+2 with PCB; NEET UG qualified", competition: "Low", effort: "Medium" },
      { name: "Nursing (BSc)", description: "Patient care, hospital management, and community health.", eligibility: "10+2 with PCB (min 45%)", competition: "Low", effort: "Medium" },
      { name: "Pharmacy (B.Pharm)", description: "Drug formulation, pharmaceutical research, and clinical pharmacy.", eligibility: "10+2 with PCM/PCB", competition: "Medium", effort: "Medium" },
      { name: "Physiotherapy (BPT)", description: "Physical rehabilitation, sports injury management, and movement therapy.", eligibility: "10+2 with PCB; Entrance exam", competition: "Low", effort: "Medium" },
      { name: "Veterinary Science (BVSc)", description: "Animal healthcare, livestock management, and veterinary surgery.", eligibility: "10+2 with PCB; NEET UG qualified", competition: "Low", effort: "High" },
      { name: "Biomedical Science", description: "Medical diagnostics, lab technology, and biomedical research.", eligibility: "10+2 with PCB/PCM", competition: "Low", effort: "Medium" },
      { name: "Public Health (MPH)", description: "Epidemiology, health policy, and community wellness programs.", eligibility: "Graduate degree; Entrance exam", competition: "Low", effort: "Medium" },
    ],
    Business: [
      { name: "Chartered Accountancy (CA)", description: "Auditing, taxation, financial reporting — one of India's toughest and most respected qualifications.", eligibility: "10+2 any stream; CA Foundation exam", competition: "High", effort: "High" },
      { name: "Company Secretary (CS)", description: "Corporate governance, compliance, and legal advisory in companies.", eligibility: "10+2 any stream; CS Foundation exam", competition: "High", effort: "High" },
      { name: "MBA", description: "Management, leadership, and business strategy across industries.", eligibility: "Graduate degree; CAT/XAT/MAT for top B-schools", competition: "High", effort: "High" },
      { name: "Entrepreneurship", description: "Start and scale your own business — India's startup ecosystem is booming.", eligibility: "No formal requirement; business acumen essential", competition: "High", effort: "High" },
      { name: "Finance & Banking", description: "Investment banking, wealth management, stock markets, and financial planning.", eligibility: "B.Com/BBA/MBA Finance; CFA optional", competition: "Medium", effort: "Medium" },
      { name: "Marketing & Advertising", description: "Brand management, digital marketing, and advertising strategy.", eligibility: "B.Com/BBA/MBA Marketing", competition: "Medium", effort: "Medium" },
      { name: "Human Resources (HR)", description: "Talent acquisition, employee management, and organizational development.", eligibility: "BBA/MBA HR; SHRM certification optional", competition: "Medium", effort: "Medium" },
      { name: "Cost & Management Accountant (CMA)", description: "Cost accounting, financial management, and strategic planning.", eligibility: "10+2 any stream; CMA Foundation exam", competition: "Medium", effort: "High" },
      { name: "International Business", description: "Import-export, global trade, and cross-border business operations.", eligibility: "B.Com/BBA; MBA International Business", competition: "Medium", effort: "Medium" },
    ],
    "Arts & Design": [
      { name: "Graphic Design", description: "Visual communication, branding, logos, and print/digital design.", eligibility: "10+2 any stream; Portfolio/Entrance exam", competition: "Medium", effort: "Medium" },
      { name: "UX/UI Design", description: "User experience research, interface design, and product design for apps/websites.", eligibility: "Any graduate; Portfolio-based", competition: "Medium", effort: "Medium" },
      { name: "Fashion Design", description: "Apparel design, textile innovation, and fashion merchandising.", eligibility: "10+2 any stream; NIFT/NID entrance", competition: "Medium", effort: "High" },
      { name: "Interior Design", description: "Space planning, residential/commercial interiors, and sustainable design.", eligibility: "10+2 any stream; Entrance exam", competition: "Medium", effort: "Medium" },
      { name: "Product & Industrial Design", description: "Consumer product design, manufacturing, and ergonomics.", eligibility: "10+2 any stream; NID/UCEED entrance", competition: "Medium", effort: "High" },
      { name: "Animation & VFX", description: "3D animation, visual effects for films, gaming, and advertising.", eligibility: "10+2 any stream; Portfolio/Entrance", competition: "Medium", effort: "High" },
      { name: "Fine Arts", description: "Painting, sculpture, printmaking, and contemporary art practice.", eligibility: "10+2 any stream; BFA entrance exam", competition: "Low", effort: "Medium" },
      { name: "Photography", description: "Professional photography — commercial, editorial, wildlife, and documentary.", eligibility: "10+2 any stream; Diploma/Degree courses", competition: "Medium", effort: "Medium" },
    ],
    Law: [
      { name: "Corporate Law", description: "Mergers & acquisitions, corporate compliance, and business law.", eligibility: "5-year LLB (after 12th via CLAT) or 3-year LLB (after graduation)", competition: "High", effort: "High" },
      { name: "Criminal Law", description: "Criminal prosecution/defense, investigation, and court litigation.", eligibility: "CLAT/AILET for NLUs; LLB degree", competition: "High", effort: "High" },
      { name: "Civil & Constitutional Law", description: "Fundamental rights, property disputes, and constitutional matters.", eligibility: "CLAT/AILET for NLUs; LLB degree", competition: "Medium", effort: "High" },
      { name: "Intellectual Property Law", description: "Patents, trademarks, copyrights, and technology law.", eligibility: "LLB + specialization; Technical background preferred", competition: "Medium", effort: "High" },
      { name: "Cyber Law", description: "Data privacy, cybercrime, IT Act compliance, and digital rights.", eligibility: "LLB + tech knowledge; PG diploma in Cyber Law", competition: "Low", effort: "Medium" },
      { name: "International Law", description: "International treaties, diplomacy, human rights, and trade law.", eligibility: "LLB + LLM International Law", competition: "Medium", effort: "High" },
      { name: "Judiciary (Judge)", description: "District/High/Supreme Court judge through judicial services examination.", eligibility: "LLB degree; Judicial Services Exam (State-level)", competition: "High", effort: "High" },
    ],
    Education: [
      { name: "School Teaching", description: "Teach at primary/secondary level in CBSE, ICSE, or state board schools.", eligibility: "B.Ed after graduation; CTET/State TET qualified", competition: "Medium", effort: "Medium" },
      { name: "College/University Professor", description: "Teach and research at higher education institutions.", eligibility: "Master's degree + NET/SET; PhD preferred", competition: "High", effort: "High" },
      { name: "Educational Technology (EdTech)", description: "Build and manage digital learning platforms like BYJU'S, Unacademy.", eligibility: "Any graduate; Tech + pedagogy skills", competition: "Medium", effort: "Medium" },
      { name: "Special Education", description: "Teach children with learning disabilities and special needs.", eligibility: "B.Ed Special Education; RCI registration", competition: "Low", effort: "Medium" },
      { name: "Educational Counselling", description: "Career guidance, student counselling, and academic mentoring.", eligibility: "MA Psychology/Education; PG Diploma in Guidance", competition: "Low", effort: "Medium" },
      { name: "Coaching & Competitive Exam Prep", description: "Teach at coaching institutes for IIT-JEE, NEET, UPSC, CAT etc.", eligibility: "Subject expertise; No formal degree required", competition: "Medium", effort: "Medium" },
      { name: "Research & Academia", description: "Pursue PhD and contribute to academic research in any field.", eligibility: "Master's degree + NET; PhD admission", competition: "High", effort: "High" },
    ],
    Government: [
      { name: "UPSC Civil Services (IAS/IPS/IFS)", description: "India's premier administrative service — District Collector, Police Commissioner, Ambassador.", eligibility: "Any graduate; Age 21-32; UPSC CSE exam", competition: "High", effort: "High" },
      { name: "SSC (CGL/CHSL)", description: "Central government jobs — Income Tax, Auditor, Inspector, DEO, LDC.", eligibility: "Graduate (CGL) / 12th pass (CHSL); SSC exam", competition: "High", effort: "Medium" },
      { name: "State PSC", description: "State-level administrative services — SDM, DSP, BDO.", eligibility: "Graduate; State PSC exam", competition: "High", effort: "High" },
      { name: "Banking (IBPS/SBI)", description: "Bank PO, Clerk, Specialist Officer in public sector banks and RBI.", eligibility: "Graduate; IBPS PO/Clerk/SO exam", competition: "High", effort: "Medium" },
      { name: "Railway Services (RRB)", description: "Indian Railways — ALP, Group D, NTPC, JE positions.", eligibility: "10th/12th/Graduate based on post; RRB exam", competition: "High", effort: "Medium" },
      { name: "Teaching (KVS/NVS/DSSSB)", description: "Government school teaching — Kendriya Vidyalaya, Navodaya, state schools.", eligibility: "B.Ed + graduation; CTET/State TET", competition: "Medium", effort: "Medium" },
      { name: "Public Sector Undertakings (PSUs)", description: "ONGC, BHEL, IOCL, NTPC — technical and management roles.", eligibility: "B.Tech/MBA; GATE score for technical roles", competition: "High", effort: "High" },
      { name: "Indian Forest Service (IFoS)", description: "Conservation, wildlife management, and forest administration.", eligibility: "B.Sc with relevant subjects; UPSC IFoS exam", competition: "Medium", effort: "High" },
    ],
    Defence: [
      { name: "Indian Army", description: "Ground defence, infantry, artillery, and military operations.", eligibility: "10+2/Graduate; NDA/CDS/AFCAT exam; SSB interview", competition: "High", effort: "High" },
      { name: "Indian Navy", description: "Naval warfare, submarine operations, and maritime security.", eligibility: "10+2 with PCM (NDA) or Graduate (CDS); SSB", competition: "High", effort: "High" },
      { name: "Indian Air Force", description: "Fighter pilots, helicopter operations, and air defence.", eligibility: "10+2 with PCM (NDA/AFCAT) or Graduate; SSB", competition: "High", effort: "High" },
      { name: "National Defence Academy (NDA)", description: "Joint training for Army, Navy, Air Force after 12th class.", eligibility: "10+2 (age 16.5-19.5); NDA exam + SSB", competition: "High", effort: "High" },
      { name: "Paramilitary Forces (CRPF/BSF/CISF)", description: "Internal security, border patrol, and VIP protection.", eligibility: "Graduate; UPSC CAPF exam or direct recruitment", competition: "Medium", effort: "High" },
      { name: "Indian Coast Guard", description: "Maritime law enforcement, search & rescue, and coastal security.", eligibility: "10+2 with PCM or Graduate; CGEP exam", competition: "Medium", effort: "High" },
      { name: "Defence Research (DRDO)", description: "Research and development of weapons, missiles, and military tech.", eligibility: "B.Tech/M.Tech/PhD; GATE or DRDO SET exam", competition: "Medium", effort: "High" },
    ],
    Sports: [
      { name: "Professional Athlete", description: "Compete at national/international level in Cricket, Football, Hockey, Badminton, Wrestling etc.", eligibility: "Exceptional talent; Selection through trials/federation", competition: "High", effort: "High" },
      { name: "Sports Coaching", description: "Train athletes and teams in specific sports disciplines.", eligibility: "NIS Patiala diploma; Playing experience preferred", competition: "Medium", effort: "Medium" },
      { name: "Sports Management", description: "Event management, league operations, and sports business.", eligibility: "MBA Sports Management; BBA/B.Com", competition: "Medium", effort: "Medium" },
      { name: "Sports Medicine & Physiotherapy", description: "Injury prevention, rehabilitation, and athlete healthcare.", eligibility: "MBBS/BPT; PG in Sports Medicine", competition: "Low", effort: "High" },
      { name: "Fitness & Personal Training", description: "Gym training, yoga instruction, and wellness coaching.", eligibility: "Certification (ACE/ACSM/NSCA); BSc Sports Science", competition: "Low", effort: "Medium" },
      { name: "Sports Journalism", description: "Sports reporting, commentary, and media coverage.", eligibility: "Mass Communication degree; Sports knowledge", competition: "Medium", effort: "Medium" },
      { name: "Sports Psychology", description: "Mental conditioning, performance psychology, and athlete wellness.", eligibility: "MA Psychology + specialization in Sports Psychology", competition: "Low", effort: "Medium" },
    ],
    Technology: [
      { name: "Artificial Intelligence & ML", description: "Build intelligent systems — NLP, computer vision, deep learning.", eligibility: "B.Tech CS/IT or BSc CS; M.Tech/MS in AI/ML", competition: "High", effort: "High" },
      { name: "Data Science & Analytics", description: "Extract insights from data — big data, statistical modeling, business intelligence.", eligibility: "B.Tech/BSc in CS/Stats/Maths; Python/R skills", competition: "High", effort: "High" },
      { name: "Cybersecurity", description: "Protect systems from cyberattacks — ethical hacking, SOC, penetration testing.", eligibility: "B.Tech CS/IT; CEH/CISSP certifications", competition: "Medium", effort: "High" },
      { name: "Cloud Computing & DevOps", description: "AWS, Azure, GCP infrastructure and CI/CD automation.", eligibility: "B.Tech CS/IT; AWS/Azure certifications", competition: "Medium", effort: "Medium" },
      { name: "Full Stack Development", description: "Build complete web applications — frontend, backend, and databases.", eligibility: "B.Tech CS/IT or self-taught; Portfolio-based", competition: "High", effort: "Medium" },
      { name: "Mobile App Development", description: "Build Android/iOS apps using React Native, Flutter, or native development.", eligibility: "B.Tech CS/IT or self-taught; Published apps", competition: "Medium", effort: "Medium" },
      { name: "Blockchain & Web3", description: "Decentralized apps, smart contracts, and cryptocurrency systems.", eligibility: "B.Tech CS; Blockchain certifications", competition: "Low", effort: "High" },
      { name: "IoT & Embedded Systems", description: "Smart devices, sensor networks, and industrial IoT.", eligibility: "B.Tech ECE/CS; Arduino/Raspberry Pi experience", competition: "Low", effort: "Medium" },
      { name: "Game Development", description: "Design and develop video games using Unity, Unreal Engine.", eligibility: "B.Tech CS/Game Design degree; Portfolio", competition: "Medium", effort: "High" },
    ],
    "Creative Arts": [
      { name: "Film Direction", description: "Direct feature films, documentaries, and web series for Bollywood/OTT.", eligibility: "Diploma/Degree from FTII/Satyajit Ray/SRFTI; Portfolio", competition: "High", effort: "High" },
      { name: "Acting & Theatre", description: "Perform in films, TV, theatre, and digital content.", eligibility: "NSD/FTII acting course; Drama school training", competition: "High", effort: "High" },
      { name: "Music & Sound Production", description: "Compose, produce, and perform music — classical, Bollywood, indie.", eligibility: "Music training/degree; Sound engineering diploma", competition: "Medium", effort: "High" },
      { name: "Screenwriting & Content Writing", description: "Write scripts for films, web series, ads, and digital content.", eligibility: "No formal requirement; Writing portfolio/courses", competition: "Medium", effort: "Medium" },
      { name: "Cinematography", description: "Camera work, lighting, and visual storytelling for films.", eligibility: "FTII/Film school diploma; Apprenticeship", competition: "Medium", effort: "High" },
      { name: "Dance (Classical/Contemporary)", description: "Professional dance performance, choreography, and teaching.", eligibility: "Training under guru/dance academy; BPA Dance", competition: "Medium", effort: "High" },
      { name: "Stand-up Comedy & Content Creation", description: "Perform comedy, create YouTube/Instagram content, and build personal brand.", eligibility: "No formal requirement; Performance skills", competition: "Medium", effort: "Medium" },
      { name: "Video Editing & Post Production", description: "Edit films, ads, and social media content using professional tools.", eligibility: "Diploma in editing; Premiere Pro/DaVinci skills", competition: "Low", effort: "Medium" },
    ],
    Vocational: [
      { name: "Hotel Management & Hospitality", description: "Hotel operations, food & beverage, and tourism management.", eligibility: "10+2 any stream; NCHMCT JEE exam", competition: "Medium", effort: "Medium" },
      { name: "Culinary Arts (Chef)", description: "Professional cooking, food science, and restaurant management.", eligibility: "10+2; Diploma from IHM or culinary school", competition: "Medium", effort: "Medium" },
      { name: "Automobile Mechanic & Technician", description: "Vehicle repair, diagnostics, and EV maintenance.", eligibility: "10th/12th pass; ITI/Diploma in Automobile", competition: "Low", effort: "Medium" },
      { name: "Electrician & Plumbing", description: "Home/commercial electrical wiring, plumbing, and HVAC.", eligibility: "10th pass; ITI certification", competition: "Low", effort: "Low" },
      { name: "Agriculture & Farming", description: "Modern farming, agri-business, organic farming, and food processing.", eligibility: "BSc Agriculture; 10+2 with PCB/PCM", competition: "Low", effort: "Medium" },
      { name: "Beauty & Wellness", description: "Cosmetology, skin care, hair styling, and spa management.", eligibility: "10+2; Diploma in Beauty Culture", competition: "Low", effort: "Low" },
      { name: "Event Management", description: "Plan and execute weddings, corporate events, and exhibitions.", eligibility: "Any graduate; Diploma in Event Management", competition: "Medium", effort: "Medium" },
      { name: "Travel & Tourism", description: "Tour operations, travel consultancy, and airline management.", eligibility: "10+2; Diploma/Degree in Tourism Management", competition: "Medium", effort: "Medium" },
    ],
  };

  const createdBranches: Record<string, string> = {};
  for (const [clusterName, branchList] of Object.entries(branches)) {
    const clusterId = createdClusters[clusterName];
    if (!clusterId) continue;
    for (let i = 0; i < branchList.length; i++) {
      const branch = await prisma.careerBranch.upsert({
        where: { name_clusterId: { name: branchList[i].name, clusterId } },
        update: {
          description: branchList[i].description,
          eligibility: branchList[i].eligibility,
          competition: branchList[i].competition,
          effort: branchList[i].effort,
        },
        create: {
          name: branchList[i].name,
          description: branchList[i].description,
          eligibility: branchList[i].eligibility,
          clusterId,
          competition: branchList[i].competition,
          effort: branchList[i].effort,
          sortOrder: i,
        },
      });
      createdBranches[branch.name] = branch.id;
    }
  }
  console.log("✅ Career branches created:", Object.keys(createdBranches).length);

  // Create cluster-level questions
  const clusterQuestions = [
    {
      text: "When you face a problem, what do you naturally do first?",
      type: "APTITUDE" as const,
      options: [
        { text: "Break it down logically and analyze step by step", weights: { Engineering: 3, Technology: 2 } },
        { text: "Think about how it affects people emotionally", weights: { Medical: 2, Education: 2 } },
        { text: "Look for creative and unconventional solutions", weights: { "Arts & Design": 3, "Creative Arts": 2 } },
        { text: "Consider the financial and strategic implications", weights: { Business: 3 } },
      ],
    },
    {
      text: "Which school subject do you enjoy the most?",
      type: "INTEREST" as const,
      options: [
        { text: "Mathematics and Physics", weights: { Engineering: 3, Technology: 2 } },
        { text: "Biology and Chemistry", weights: { Medical: 3 } },
        { text: "Economics and Business Studies", weights: { Business: 3 } },
        { text: "Art, Music, or Literature", weights: { "Arts & Design": 3, "Creative Arts": 2 } },
      ],
    },
    {
      text: "How do you prefer to spend your free time?",
      type: "INTEREST" as const,
      options: [
        { text: "Building things, coding, or tinkering with gadgets", weights: { Engineering: 3, Technology: 3 } },
        { text: "Reading about health, volunteering at hospitals", weights: { Medical: 3 } },
        { text: "Drawing, painting, or designing things", weights: { "Arts & Design": 3 } },
        { text: "Playing sports or staying physically active", weights: { Sports: 3, Defence: 1 } },
      ],
    },
    {
      text: "What kind of work environment appeals to you most?",
      type: "PERSONALITY" as const,
      options: [
        { text: "A tech office or lab with modern equipment", weights: { Engineering: 2, Technology: 3 } },
        { text: "A hospital or clinic helping patients", weights: { Medical: 3 } },
        { text: "A courtroom or government office serving people", weights: { Law: 3, Government: 2 } },
        { text: "A creative studio or design workspace", weights: { "Arts & Design": 3, "Creative Arts": 2 } },
      ],
    },
    {
      text: "When working in a group, what role do you usually take?",
      type: "PERSONALITY" as const,
      options: [
        { text: "The planner who organizes everything", weights: { Business: 2, Government: 2 } },
        { text: "The problem solver who finds solutions", weights: { Engineering: 3, Technology: 2 } },
        { text: "The creative one who brings new ideas", weights: { "Arts & Design": 3 } },
        { text: "The leader who motivates the team", weights: { Business: 2, Defence: 2 } },
      ],
    },
    {
      text: "How do you feel about taking risks?",
      type: "VALUES" as const,
      options: [
        { text: "I prefer a stable and secure career path", weights: { Government: 3, Education: 2 } },
        { text: "I'm willing to take calculated risks for higher rewards", weights: { Business: 3 } },
        { text: "I love adventure and unpredictable situations", weights: { Defence: 2, Sports: 2 } },
        { text: "I take risks when it involves creative expression", weights: { "Arts & Design": 2, "Creative Arts": 3 } },
      ],
    },
    {
      text: "What do you value most in a career?",
      type: "VALUES" as const,
      options: [
        { text: "Making a difference in people's health and lives", weights: { Medical: 3 } },
        { text: "Innovation and building something new", weights: { Engineering: 2, Technology: 3 } },
        { text: "Financial success and wealth creation", weights: { Business: 3 } },
        { text: "Serving the nation and public welfare", weights: { Government: 3, Defence: 2 } },
      ],
    },
    {
      text: "How do you learn best?",
      type: "LEARNING_STYLE" as const,
      options: [
        { text: "Through hands-on experiments and practice", weights: { Engineering: 2, Vocational: 3 } },
        { text: "Through reading and theoretical understanding", weights: { Law: 2, Education: 2 } },
        { text: "Through visual aids, diagrams, and design", weights: { "Arts & Design": 3 } },
        { text: "Through discussion and debate with others", weights: { Law: 3, Business: 1 } },
      ],
    },
    {
      text: "Which of these achievements would make you proudest?",
      type: "VALUES" as const,
      options: [
        { text: "Inventing a technology that changes the world", weights: { Engineering: 2, Technology: 3 } },
        { text: "Saving someone's life through medical treatment", weights: { Medical: 3 } },
        { text: "Building a successful company from scratch", weights: { Business: 3 } },
        { text: "Creating a beautiful work of art or design", weights: { "Arts & Design": 3, "Creative Arts": 2 } },
      ],
    },
    {
      text: "How do you handle detailed, repetitive work?",
      type: "APTITUDE" as const,
      options: [
        { text: "I enjoy it – precision and accuracy matter to me", weights: { Engineering: 2, Medical: 2 } },
        { text: "I find it boring – I prefer variety and creativity", weights: { "Arts & Design": 2, "Creative Arts": 2 } },
        { text: "I can manage it if there's a clear goal", weights: { Business: 2, Government: 2 } },
        { text: "I try to automate or optimize repetitive tasks", weights: { Technology: 3 } },
      ],
    },
    {
      text: "What type of movies or content do you enjoy most?",
      type: "INTEREST" as const,
      options: [
        { text: "Sci-fi, technology, and futuristic themes", weights: { Technology: 3, Engineering: 2 } },
        { text: "Medical dramas and health documentaries", weights: { Medical: 3 } },
        { text: "Business and entrepreneurship stories", weights: { Business: 3 } },
        { text: "Art films, music, and creative performances", weights: { "Creative Arts": 3, "Arts & Design": 2 } },
      ],
    },
    {
      text: "How important is job security to you?",
      type: "VALUES" as const,
      options: [
        { text: "Extremely important – I need stability", weights: { Government: 3, Education: 2 } },
        { text: "Somewhat important but not my top priority", weights: { Engineering: 2, Medical: 2 } },
        { text: "Not very important – I value growth and opportunity", weights: { Business: 2, Technology: 2 } },
        { text: "Not important – I want freedom and creativity", weights: { "Arts & Design": 2, "Creative Arts": 2 } },
      ],
    },
    {
      text: "How do you feel about physical challenges?",
      type: "PERSONALITY" as const,
      options: [
        { text: "I love physical challenges and fitness", weights: { Sports: 3, Defence: 3 } },
        { text: "I prefer intellectual and mental challenges", weights: { Technology: 2, Law: 2 } },
        { text: "I enjoy a mix of both physical and mental work", weights: { Medical: 2, Engineering: 1 } },
        { text: "I prefer creative expression over physical activity", weights: { "Arts & Design": 2 } },
      ],
    },
    {
      text: "If you could teach a class, what would it be about?",
      type: "INTEREST" as const,
      options: [
        { text: "Science and how things work", weights: { Engineering: 3, Education: 1 } },
        { text: "Human body and health", weights: { Medical: 3 } },
        { text: "Money management and starting a business", weights: { Business: 3 } },
        { text: "Art, design, or creative skills", weights: { "Arts & Design": 3, Education: 1 } },
      ],
    },
    {
      text: "What kind of problems do you enjoy solving?",
      type: "APTITUDE" as const,
      options: [
        { text: "Mathematical and logical puzzles", weights: { Engineering: 3, Technology: 2 } },
        { text: "People's health and emotional problems", weights: { Medical: 2, Education: 2 } },
        { text: "Strategic and business challenges", weights: { Business: 3 } },
        { text: "Legal disputes and ethical dilemmas", weights: { Law: 3 } },
      ],
    },
  ];

  for (let i = 0; i < clusterQuestions.length; i++) {
    const q = clusterQuestions[i];

    const question = await prisma.question.create({
      data: {
        text: q.text,
        type: q.type,
        classMin: 6,
        classMax: 12,
        forAssessment: "CLUSTER",
        sortOrder: i,
        options: {
          create: q.options.map((opt, optIdx) => ({
            text: opt.text,
            sortOrder: optIdx,
            weights: {
              create: Object.entries(opt.weights)
                .filter(([clusterName]) => createdClusters[clusterName])
                .map(([clusterName, weight]) => ({
                  clusterId: createdClusters[clusterName],
                  weight,
                })),
            },
          })),
        },
      },
    });
    console.log(`  📝 Q${i + 1}: ${question.text.substring(0, 50)}...`);
  }
  console.log(`✅ ${clusterQuestions.length} cluster questions created`);

  console.log("\n🎉 Seeding complete!");
  console.log("Admin login: admin@aiguide.in / admin123");
}

main()
  .catch((e) => {
    console.error("Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

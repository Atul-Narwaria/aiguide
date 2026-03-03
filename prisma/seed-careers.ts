import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const CAREER_DATA = [
  {
    name: "Engineering",
    description: "Design, build and innovate across mechanical, civil, electrical and software domains",
    icon: "⚙️",
    color: "#4361ee",
    branches: [
      { name: "Computer Science", competition: "High", effort: "High" },
      { name: "Mechanical Engineering", competition: "Medium", effort: "High" },
      { name: "Civil Engineering", competition: "Medium", effort: "Medium" },
      { name: "Electrical Engineering", competition: "Medium", effort: "High" },
      { name: "Electronics & Communication", competition: "Medium", effort: "High" },
    ],
  },
  {
    name: "Medical & Healthcare",
    description: "Heal, care and advance human health through medicine and allied sciences",
    icon: "🏥",
    color: "#e63946",
    branches: [
      { name: "MBBS / Doctor", competition: "High", effort: "High" },
      { name: "Dental (BDS)", competition: "Medium", effort: "High" },
      { name: "Pharmacy", competition: "Medium", effort: "Medium" },
      { name: "Nursing", competition: "Low", effort: "Medium" },
      { name: "Allied Health Sciences", competition: "Low", effort: "Medium" },
    ],
  },
  {
    name: "Business & Commerce",
    description: "Lead organizations, manage finances and drive economic growth",
    icon: "💼",
    color: "#f4a261",
    branches: [
      { name: "Chartered Accountant (CA)", competition: "High", effort: "High" },
      { name: "MBA / Management", competition: "High", effort: "High" },
      { name: "Marketing & Sales", competition: "Medium", effort: "Medium" },
      { name: "Finance & Banking", competition: "High", effort: "High" },
      { name: "Entrepreneurship", competition: "High", effort: "High" },
    ],
  },
  {
    name: "Arts & Humanities",
    description: "Express creativity and explore human culture through art, literature and media",
    icon: "🎨",
    color: "#cc5de8",
    branches: [
      { name: "Fine Arts & Design", competition: "Medium", effort: "Medium" },
      { name: "Literature & Writing", competition: "Medium", effort: "Medium" },
      { name: "Journalism & Mass Communication", competition: "Medium", effort: "Medium" },
      { name: "Film & Media", competition: "High", effort: "High" },
      { name: "Music & Performing Arts", competition: "High", effort: "High" },
    ],
  },
  {
    name: "Law & Legal",
    description: "Uphold justice, advocate for rights and navigate the legal system",
    icon: "⚖️",
    color: "#2d6a4f",
    branches: [
      { name: "Corporate Law", competition: "High", effort: "High" },
      { name: "Criminal Law", competition: "Medium", effort: "High" },
      { name: "Civil Law", competition: "Medium", effort: "Medium" },
      { name: "Constitutional Law", competition: "High", effort: "High" },
      { name: "Intellectual Property Law", competition: "High", effort: "High" },
    ],
  },
  {
    name: "Education & Teaching",
    description: "Shape young minds and contribute to the future of learning",
    icon: "📚",
    color: "#51cf66",
    branches: [
      { name: "School Teaching", competition: "Low", effort: "Medium" },
      { name: "College Professor", competition: "High", effort: "High" },
      { name: "Special Education", competition: "Low", effort: "Medium" },
      { name: "EdTech & Online Education", competition: "Medium", effort: "Medium" },
      { name: "Coaching & Mentoring", competition: "Medium", effort: "Medium" },
    ],
  },
  {
    name: "Government & Civil Services",
    description: "Serve the nation through administration, policy-making and governance",
    icon: "🏛️",
    color: "#1d3557",
    branches: [
      { name: "IAS / IPS (UPSC)", competition: "High", effort: "High" },
      { name: "State Civil Services", competition: "High", effort: "High" },
      { name: "Public Sector Undertakings", competition: "Medium", effort: "Medium" },
      { name: "Policy & Think Tanks", competition: "High", effort: "High" },
      { name: "Government Banking (SBI/RBI)", competition: "High", effort: "High" },
    ],
  },
  {
    name: "Defence & Security",
    description: "Protect the nation through armed forces, intelligence and strategic services",
    icon: "🎖️",
    color: "#495057",
    branches: [
      { name: "Indian Army", competition: "High", effort: "High" },
      { name: "Indian Navy", competition: "High", effort: "High" },
      { name: "Indian Air Force", competition: "High", effort: "High" },
      { name: "NDA / CDS", competition: "High", effort: "High" },
      { name: "Intelligence & Security", competition: "High", effort: "High" },
    ],
  },
  {
    name: "Technology & IT",
    description: "Build the digital future through software, data and emerging technologies",
    icon: "💻",
    color: "#6b8bff",
    branches: [
      { name: "Software Development", competition: "High", effort: "High" },
      { name: "Data Science & AI/ML", competition: "High", effort: "High" },
      { name: "Cybersecurity", competition: "Medium", effort: "High" },
      { name: "Cloud & DevOps", competition: "Medium", effort: "High" },
      { name: "Product Management", competition: "High", effort: "Medium" },
    ],
  },
  {
    name: "Science & Research",
    description: "Discover, innovate and push the boundaries of human knowledge",
    icon: "🔬",
    color: "#e9c46a",
    branches: [
      { name: "Physics Research", competition: "Medium", effort: "High" },
      { name: "Chemistry & Materials", competition: "Medium", effort: "High" },
      { name: "Biology & Biotechnology", competition: "Medium", effort: "High" },
      { name: "Environmental Science", competition: "Low", effort: "Medium" },
      { name: "Space & Astronomy (ISRO)", competition: "High", effort: "High" },
    ],
  },
];

export async function seedCareers() {
  console.log("🚀 Seeding career clusters and branches...");

  const clusterMap: Record<string, string> = {};

  for (const career of CAREER_DATA) {
    const cluster = await prisma.careerCluster.upsert({
      where: { name: career.name },
      update: {
        description: career.description,
        icon: career.icon,
        color: career.color,
      },
      create: {
        name: career.name,
        description: career.description,
        icon: career.icon,
        color: career.color,
      },
    });

    clusterMap[career.name] = cluster.id;
    console.log(`  ✅ ${career.icon} ${career.name} (${cluster.id})`);

    for (const branch of career.branches) {
      await prisma.careerBranch.upsert({
        where: {
          name_clusterId: { name: branch.name, clusterId: cluster.id },
        },
        update: {
          competition: branch.competition,
          effort: branch.effort,
        },
        create: {
          name: branch.name,
          clusterId: cluster.id,
          competition: branch.competition,
          effort: branch.effort,
        },
      });
    }
  }

  console.log(`\n✅ Created ${CAREER_DATA.length} clusters with branches`);
  return clusterMap;
}

// Run standalone
if (require.main === module) {
  seedCareers()
    .then(() => prisma.$disconnect())
    .catch((e) => {
      console.error(e);
      prisma.$disconnect();
      process.exit(1);
    });
}

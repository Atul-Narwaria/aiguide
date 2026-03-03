/**
 * One-time seed: populate CareerCluster.salary / colleges / education / growth / examKey
 * from what was previously hardcoded in the PDF route.
 *
 * Run with:  npx tsx prisma/seed-career-meta.ts
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const META: Record<string, { salary: string; colleges: string; education: string; growth: string; examKey: string }> = {
  "Engineering": {
    salary:    "₹6–25 LPA (Entry) | ₹25–80 LPA (Senior)",
    colleges:  "IIT Bombay · IIT Delhi · IIT Madras · BITS Pilani · NIT Trichy",
    education: "B.Tech / B.E. (4 yrs)  →  M.Tech / MS (optional)",
    growth:    "High ↑",
    examKey:   "JEE Main · JEE Advanced · BITSAT",
  },
  "Medical & Healthcare": {
    salary:    "₹8–20 LPA (Entry) | ₹20 Cr+ (Senior)",
    colleges:  "AIIMS Delhi · CMC Vellore · JIPMER · KEM Mumbai",
    education: "MBBS (5.5 yrs)  →  MD/MS (3 yrs)",
    growth:    "Very High ↑↑",
    examKey:   "NEET-UG · NEET-PG",
  },
  "Business & Commerce": {
    salary:    "₹5–15 LPA (Entry) | ₹20 Cr+ (Senior)",
    colleges:  "IIM Ahmedabad · IIM Bangalore · SRCC · XLRI · FMS",
    education: "B.Com / BBA  →  MBA / CA",
    growth:    "High ↑",
    examKey:   "CAT · XAT · CLAT · CA Foundation",
  },
  "Arts & Humanities": {
    salary:    "₹3–10 LPA (Entry) | ₹15–50 LPA (Senior)",
    colleges:  "NID · NIFT · FTII Pune · JNU · St. Stephen's",
    education: "BA / BFA / B.Des (3–4 yrs)  →  MA / MFA",
    growth:    "Medium →",
    examKey:   "NID DAT · NIFT Entrance · UCEED",
  },
  "Law & Legal": {
    salary:    "₹5–12 LPA (Entry) | ₹25 Cr+ (Senior)",
    colleges:  "NLSIU Bangalore · NLU Delhi · NALSAR · NUJS Kolkata",
    education: "BA LLB (5 yrs) or LLB (3 yrs)  →  LLM",
    growth:    "High ↑",
    examKey:   "CLAT · AILET · LSAT India",
  },
  "Education & Teaching": {
    salary:    "₹3–8 LPA (Entry) | ₹10–30 LPA (Senior)",
    colleges:  "IGNOU · Lady Shri Ram · TISS · Azim Premji University",
    education: "B.Ed (2 yrs after graduation) or Integrated B.Ed",
    growth:    "Steady →",
    examKey:   "CTET · State TET · NET",
  },
  "Government & Civil Services": {
    salary:    "₹6–15 LPA + Perks",
    colleges:  "LBSNAA Mussoorie · Any top university",
    education: "Any Graduation  →  UPSC / State PSC",
    growth:    "Stable →",
    examKey:   "UPSC CSE · State PSC · SSC CGL",
  },
  "Defence & Security": {
    salary:    "₹6–12 LPA + Perks (Entry)",
    colleges:  "NDA · IMA Dehradun · NA Ezhimala · AFA Dundigal",
    education: "NDA / CDS after 12th or Graduation",
    growth:    "Stable →",
    examKey:   "NDA · CDS · AFCAT · CAPF",
  },
  "Technology & IT": {
    salary:    "₹8–30 LPA (Entry) | ₹30 Cr+ (Senior)",
    colleges:  "IIT Bombay · IIIT Hyderabad · IISc · BITS Pilani · DTU",
    education: "B.Tech CS/IT (4 yrs)  →  M.Tech / MS",
    growth:    "Very High ↑↑",
    examKey:   "JEE · GATE · DSAT",
  },
  "Science & Research": {
    salary:    "₹4–12 LPA (Entry) | ₹15–40 LPA (Senior)",
    colleges:  "IISc Bangalore · TIFR · IISERs · JNU",
    education: "B.Sc  →  M.Sc  →  PhD (5–7 yrs)",
    growth:    "Growing ↑",
    examKey:   "IIT JAM · JEST · ICMR JRF",
  },
};

async function main() {
  let updated = 0;
  let skipped = 0;

  for (const [name, meta] of Object.entries(META)) {
    const cluster = await prisma.careerCluster.findUnique({ where: { name } });
    if (!cluster) {
      console.log(`⚠  Cluster not found in DB: "${name}" — skipped`);
      skipped++;
      continue;
    }
    await prisma.careerCluster.update({
      where: { name },
      data: meta,
    });
    console.log(`✅ Updated: ${name}`);
    updated++;
  }

  console.log(`\nDone — ${updated} updated, ${skipped} not found.`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

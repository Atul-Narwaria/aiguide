const { PrismaClient } = require("@prisma/client");
const p = new PrismaClient();

async function main() {
  try {
    const count = await p.question.count({
      where: { isActive: true, forAssessment: "CLUSTER", hollandCode: { not: null } },
    });
    console.log("Questions matching CLUSTER + hollandCode:", count);

    const sample = await p.question.findFirst({
      where: { isActive: true, forAssessment: "CLUSTER" },
      select: { id: true, text: true, hollandCode: true, classMin: true, classMax: true, forAssessment: true },
    });
    console.log("Sample question:", JSON.stringify(sample, null, 2));

    const totalQ = await p.question.count();
    console.log("Total questions in DB:", totalQ);
  } catch (err) {
    console.error("Error:", err.message);
  } finally {
    await p.$disconnect();
  }
}

main();

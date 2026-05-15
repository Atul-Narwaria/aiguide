const { PrismaClient } = require("@prisma/client");
const p = new PrismaClient();
async function main() {
  const clusters = await p.careerCluster.findMany({ select: { id: true, name: true }, orderBy: { sortOrder: "asc" } });
  clusters.forEach(c => console.log(c.id.slice(-8), c.name));
  const qCount = await p.question.count();
  const branchQ = await p.question.count({ where: { forAssessment: "BRANCH" } });
  const clusterQ = await p.question.count({ where: { forAssessment: "CLUSTER" } });
  console.log("\nQuestions - CLUSTER:", clusterQ, "BRANCH:", branchQ, "TOTAL:", qCount);
}
main().finally(() => p.$disconnect());

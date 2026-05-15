const { PrismaClient } = require("@prisma/client");
const p = new PrismaClient();
async function main() {
  const clusters = await p.careerCluster.findMany({
    select: { id: true, name: true, branches: { select: { id: true, name: true } } },
    orderBy: { sortOrder: "asc" },
  });
  clusters.forEach(c => {
    console.log(`\n[${c.name}]`);
    c.branches.forEach(b => console.log("  -", b.id.slice(-8), b.name));
  });
}
main().finally(() => p.$disconnect());

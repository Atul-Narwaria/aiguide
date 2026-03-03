import { PrismaClient } from "@prisma/client";
import { randomBytes } from "crypto";

const prisma = new PrismaClient();

function generateSlug(name: string): string {
  const base = name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 20)
    .replace(/-$/, "");
  const suffix = randomBytes(3).toString("hex");
  return `${base}-${suffix}`;
}

async function main() {
  const users = await prisma.user.findMany({ where: { slug: null } });
  console.log(`Found ${users.length} users without slugs`);

  for (const user of users) {
    let slug = generateSlug(user.name);
    // Ensure uniqueness
    for (let i = 0; i < 10; i++) {
      const conflict = await prisma.user.findUnique({ where: { slug } });
      if (!conflict) break;
      slug = generateSlug(user.name);
    }
    await prisma.user.update({ where: { id: user.id }, data: { slug } });
    console.log(`  ${user.name} → ${slug}`);
  }

  console.log("Done!");
}

main().catch(console.error).finally(() => prisma.$disconnect());

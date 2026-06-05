import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// A starter catalog so the "add skill" dropdown has options on day one.
// Users can still add new ones (create-or-connect) beyond this list.
const SKILLS = [
  "React", "Vue", "Angular", "TypeScript", "JavaScript", "Node.js", "Express.js",
  "Python", "Django", "FastAPI", "Java", "Spring Boot", "Go", "Rust", "C++",
  "PostgreSQL", "MySQL", "MongoDB", "Redis", "Prisma", "GraphQL", "REST API",
  "Docker", "Kubernetes", "AWS", "CI/CD", "Git",
  "Machine Learning", "Deep Learning", "Data Analysis", "TensorFlow", "PyTorch",
  "Solidity", "Smart Contracts", "Web3",
  "UI/UX", "Figma", "Tailwind CSS", "Product Management", "Project Management",
];

async function main() {
  console.log("🌱 Seeding skills...");
  for (const name of SKILLS) {
    await prisma.skill.upsert({
      where: { name },
      create: { name },
      update: {},
    });
  }
  console.log(`✅ Seeded ${SKILLS.length} skills.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

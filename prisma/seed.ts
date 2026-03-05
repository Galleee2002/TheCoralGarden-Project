import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const categories = [
  {
    name: "Ósmosis Inversa",
    slug: "osmosis-inversa",
    description: "Equipos y membranas de ósmosis inversa",
  },
  {
    name: "Filtros",
    slug: "filtros",
    description: "Filtros de agua para uso doméstico, comercial e industrial",
  },
  {
    name: "Tanques Hidroneumáticos",
    slug: "tanques-hidroneumaticos",
    description: "Tanques presurizados para sistemas de agua",
  },
  {
    name: "Accesorios",
    slug: "accesorios",
    description: "Repuestos, conectores y accesorios para sistemas de agua",
  },
];

async function main() {
  console.log("Seeding categories...");

  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: {},
      create: category,
    });
  }

  console.log(`Seeded ${categories.length} categories.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

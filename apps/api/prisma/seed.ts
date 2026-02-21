import { PrismaClient } from "../src/generated/prisma/client.js";

const prisma = new PrismaClient();

async function main() {
  const existingStoreInfo = await prisma.storeInfo.findFirst({
    where: { deletedAt: null },
  });

  if (!existingStoreInfo) {
    await prisma.storeInfo.create({
      data: {
        name: "AutoServicios Moreno",
        rif: "J-123456789-0",
        address: "Calle Principal, Local 1",
        phone: "+58-414-1234567",
        logoUrl: null,
      },
    });

    console.log("✅ Default StoreInfo record created");
  } else {
    console.log("ℹ️ StoreInfo record already exists, skipping seed");
  }
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
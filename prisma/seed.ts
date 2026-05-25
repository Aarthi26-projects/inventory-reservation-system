import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Products
  const iphone = await prisma.product.create({
    data: {
      name: "iPhone 15",
    },
  });

  const macbook = await prisma.product.create({
    data: {
      name: "MacBook Air",
    },
  });

  // Warehouses
  const chennai = await prisma.warehouse.create({
    data: {
      name: "Chennai Warehouse",
    },
  });

  const bangalore = await prisma.warehouse.create({
    data: {
      name: "Bangalore Warehouse",
    },
  });

  // Inventory
  await prisma.inventory.createMany({
    data: [
      {
        productId: iphone.id,
        warehouseId: chennai.id,
        totalStock: 10,
        reservedStock: 0,
      },
      {
        productId: macbook.id,
        warehouseId: bangalore.id,
        totalStock: 5,
        reservedStock: 0,
      },
    ],
  });

  console.log("Seed data inserted successfully");
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient, ReservationStatus } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {

  try {

    const body = await req.json();

    const { inventoryId, quantity } = body;

    const result = await prisma.$transaction(async (tx) => {

      // Find inventory
      const inventory = await tx.inventory.findUnique({
        where: {
          id: inventoryId,
        },
      });

      // Inventory not found
      if (!inventory) {
        return NextResponse.json(
          { error: "Inventory not found" },
          { status: 404 }
        );
      }

      // Available stock
      const availableStock =
        inventory.totalStock - inventory.reservedStock;

      // Not enough stock
      if (availableStock < quantity) {
        return NextResponse.json(
          { error: "Not enough stock available" },
          { status: 409 }
        );
      }

      // Increase reserved stock
      await tx.inventory.update({
        where: {
          id: inventoryId,
        },
        data: {
          reservedStock: {
            increment: quantity,
          },
        },
      });

      // Create reservation
      const reservation = await tx.reservation.create({
        data: {

          inventoryId,

          productId: inventory.productId,

          warehouseId: inventory.warehouseId,

          quantity,

          status: ReservationStatus.PENDING,

          expiresAt: new Date(
            Date.now() + 10 * 60 * 1000
          ),
        },
      });

      return reservation;
    });

    return NextResponse.json(result);

  } catch (error) {

    console.error(error);

    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
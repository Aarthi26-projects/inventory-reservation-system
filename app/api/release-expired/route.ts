import { NextResponse } from "next/server";
import {
  PrismaClient,
  ReservationStatus,
} from "@prisma/client";

const prisma = new PrismaClient();

export async function POST() {

  try {

    // Find expired reservations
    const expiredReservations =
      await prisma.reservation.findMany({
        where: {
          status: ReservationStatus.PENDING,
          expiresAt: {
            lte: new Date(),
          },
        },
      });

    // Process each expired reservation
    for (const reservation of expiredReservations) {

      await prisma.$transaction(async (tx) => {

        // Reduce reserved stock
        await tx.inventory.update({
          where: {
            id: reservation.inventoryId,
          },
          data: {
            reservedStock: {
              decrement: reservation.quantity,
            },
          },
        });

        // Update reservation status
        await tx.reservation.update({
          where: {
            id: reservation.id,
          },
          data: {
            status: ReservationStatus.RELEASED,
          },
        });
      });
    }

    return NextResponse.json({
      message: "Expired reservations released",
      count: expiredReservations.length,
    });

  } catch (error) {

    console.error(error);

    return NextResponse.json(
      { error: "Failed to release reservations" },
      { status: 500 }
    );
  }
}
import { destinationSchema } from "@/schemas/destination";
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const destinations = await prisma.destination.findMany();
    return NextResponse.json(destinations);
  } catch (error) {
    console.error("Error fetching destinations:", error);
    return NextResponse.json(
      { error: "Failed to fetch destinations" },
      { status: 500 }
    );
  }
}

// POST: Create a new destination
export async function POST(request: Request) {
  try {
    const body = await request.json();

    const validatedData = destinationSchema.parse(body);

    const newDestination = await prisma.destination.create({
      data: {
        name: validatedData.name,
        description: validatedData.description,
        imageUrl: validatedData.imageUrl,
        location: validatedData.location,
      },
    });

    return NextResponse.json(newDestination, { status: 201 });
  } catch (error) {
    console.error("Error creating destination:", error);
    return NextResponse.json(
      { error: "Invalid data or server error", details: error },
      { status: 400 }
    );
  }
}

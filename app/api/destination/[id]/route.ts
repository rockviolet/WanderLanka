import { destinationSchema } from "@/schemas/destination";
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

// GET: Fetch a single destination by ID
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Fetch the destination by ID
    const destination = await prisma.destination.findUnique({
      where: { id },
    });

    if (!destination) {
      return NextResponse.json(
        { error: "Destination not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(destination);
  } catch (error) {
    console.error("Error fetching destination:", error);
    return NextResponse.json(
      { error: "Failed to fetch destination" },
      { status: 500 }
    );
  }
}

// PUT: Update a destination by ID
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    // Validate the incoming data using Zod
    const validatedData = destinationSchema.partial().parse(body); // Partial allows updating only some fields

    // Update the destination in the database
    const updatedDestination = await prisma.destination.update({
      where: { id },
      data: {
        name: validatedData.name,
        description: validatedData.description,
        imageUrl: validatedData.imageUrl,
        location: validatedData.location,
      },
    });

    return NextResponse.json(updatedDestination);
  } catch (error) {
    console.error("Error updating destination:", error);
    return NextResponse.json(
      { error: "Invalid data or server error", details: error },
      { status: 400 }
    );
  }
}

// DELETE: Delete a destination by ID
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Delete the destination from the database
    await prisma.destination.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Destination deleted successfully" });
  } catch (error) {
    console.error("Error deleting destination:", error);
    return NextResponse.json(
      { error: "Failed to delete destination" },
      { status: 500 }
    );
  }
}

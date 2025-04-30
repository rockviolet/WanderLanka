import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { tourGuideUpdateSchema } from "@/schemas/tour-guide";

const prisma = new PrismaClient();

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const tourGuide = await prisma.tourGuide.findUnique({
      where: { id: id, isDeleted: false },
      select: {
        id: true,
        name: true,
        email: true,
        nicNumber: true,
        contactNumber: true,
        username: true,
        isActive: true,
        imageUrl: true,
        createdAt: true,
        updatedAt: true,
        serviceAreas: true,
        languages: true,
      },
    });

    if (!tourGuide) {
      return NextResponse.json(
        { error: "Tour guide not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(tourGuide);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch tour guide" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const body = await request.json();
    const validation = tourGuideUpdateSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.errors },
        { status: 400 }
      );
    }

    // Check if tour guide exists
    const existingGuide = await prisma.tourGuide.findUnique({
      where: { id: id },
    });

    if (!existingGuide) {
      return NextResponse.json(
        { error: "Tour guide not found" },
        { status: 404 }
      );
    }
    const { serviceAreas, languages, ...data } = validation.data;
    // Update tour guide
    const updatedGuide = await prisma.tourGuide.update({
      where: { id: id },
      data: {
        ...data,
        serviceAreas: serviceAreas || existingGuide.serviceAreas,
        languages: languages || existingGuide.languages,
      },
      select: {
        id: true,
        name: true,
        email: true,
        nicNumber: true,
        contactNumber: true,
        username: true,
        isActive: true,
        imageUrl: true,
        updatedAt: true,
        createdAt: true,
      },
    });

    return NextResponse.json(updatedGuide);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to update tour guide" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    // Soft delete by marking as deleted
    const deletedGuide = await prisma.tourGuide.update({
      where: { id: id },
      data: { isDeleted: true },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    if (!deletedGuide) {
      return NextResponse.json(
        { error: "Tour guide not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Tour guide deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to delete tour guide" },
      { status: 500 }
    );
  }
}

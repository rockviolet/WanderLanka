import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { tourPlanSchema } from "@/schemas/tour-plan";

const prisma = new PrismaClient();

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const tourPlan = await prisma.tourPlan.findUnique({
      where: { id: id, isDeleted: false },
      include: { client: true },
    });

    if (!tourPlan) {
      return NextResponse.json(
        { error: "Tour plan not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(tourPlan);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch tour plan" },
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
    const validation = tourPlanSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.errors },
        { status: 400 }
      );
    }

    const updatedTourPlan = await prisma.tourPlan.update({
      where: { id: id },
      data: {
        ...validation.data,
        startDate: new Date(validation.data.startDate),
        endDate: new Date(validation.data.endDate),
      },
      include: { client: true },
    });

    return NextResponse.json(updatedTourPlan);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to update tour plan" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    // Soft delete by setting isDeleted to true
    const deletedTourPlan = await prisma.tourPlan.update({
      where: { id: id },
      data: { isDeleted: true },
      include: { client: true },
    });

    if (!deletedTourPlan) {
      return NextResponse.json(
        { error: "Tour plan not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Tour plan deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to delete tour plan" },
      { status: 500 }
    );
  }
}

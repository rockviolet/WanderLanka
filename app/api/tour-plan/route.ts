import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { tourPlanSchema } from "@/schemas/tour-plan";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const tourPlans = await prisma.tourPlan.findMany({
      where: { isDeleted: false },
      include: { client: true },
    });
    return NextResponse.json(tourPlans);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch tour plans" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validation = tourPlanSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.errors },
        { status: 400 }
      );
    }

    const tourPlan = await prisma.tourPlan.create({
      data: {
        ...validation.data,
        startDate: new Date(validation.data.startDate),
        endDate: new Date(validation.data.endDate),
      },
      include: { client: true },
    });

    return NextResponse.json(tourPlan, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to create tour plan" },
      { status: 500 }
    );
  }
}

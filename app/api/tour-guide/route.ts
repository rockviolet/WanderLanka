import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

import bcrypt from "bcryptjs";
import { tourGuideSchema } from "@/schemas/tour-guide";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const tourGuides = await prisma.tourGuide.findMany({
      where: { isDeleted: false },
      select: {
        id: true,
        name: true,
        email: true,
        contactNumber: true,
        username: true,
        isActive: true,
        imageUrl: true,
        createdAt: true,
        nicNumber: true,
        serviceAreas: true,
        languages: true,
      },
    });
    return NextResponse.json(tourGuides);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch tour guides" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validation = tourGuideSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.errors },
        { status: 400 }
      );
    }

    // Check for existing email or username
    const existingGuide = await prisma.tourGuide.findFirst({
      where: {
        OR: [
          { email: body.email },
          { username: body.username },
          { nicNumber: body.nicNumber },
        ],
      },
    });

    if (existingGuide) {
      return NextResponse.json(
        { error: "Email, username or NIC already exists" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(body.password, 10);

    const { serviceAreas, languages, ...data } = validation.data;

    const tourGuide = await prisma.tourGuide.create({
      data: {
        ...data,
        serviceAreas: serviceAreas || [],
        languages: languages || [],
        password: hashedPassword,
      },
      select: {
        id: true,
        name: true,
        email: true,
        username: true,
        contactNumber: true,
        isActive: true,
        imageUrl: true,
        createdAt: true,
      },
    });

    return NextResponse.json(tourGuide, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to create tour guide" },
      { status: 500 }
    );
  }
}

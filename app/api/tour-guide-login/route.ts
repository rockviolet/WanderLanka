import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { loginSchema } from "@/schemas/client";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validation = loginSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.errors },
        { status: 400 }
      );
    }

    // Find tour guide by email
    const tourGuide = await prisma.tourGuide.findUnique({
      where: { email: body.email, isDeleted: false, isActive: true },
    });

    if (!tourGuide) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Check if account is active
    if (!tourGuide.isActive) {
      return NextResponse.json(
        { error: "Account is inactive. Please contact support." },
        { status: 403 }
      );
    }

    // Compare passwords
    const passwordMatch = await bcrypt.compare(
      body.password,
      tourGuide.password
    );

    if (!passwordMatch) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Return tour guide data without password
    const { password, ...guideData } = tourGuide;
    console.log(password);
    return NextResponse.json(guideData);
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Failed to login" }, { status: 500 });
  }
}

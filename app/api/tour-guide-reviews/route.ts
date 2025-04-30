import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { tourGuideId, numOfStars, comment, clientId } = await request.json();

    // Validate input
    if (!tourGuideId || !numOfStars || !comment) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (numOfStars < 1 || numOfStars > 5) {
      return NextResponse.json(
        { error: "Rating must be between 1 and 5" },
        { status: 400 }
      );
    }

    // Create the review
    const review = await prisma.tourGuideReview.create({
      data: {
        tourGuideId,
        clientId: clientId,
        numOfStars,
        comment,
      },
      include: {
        client: {
          select: {
            name: true,
            imageUrl: true,
          },
        },
      },
    });

    return NextResponse.json(review);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to submit review" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const reviews = await prisma.tourGuideReview.findMany({
      include: {
        client: true,
        tourGuide: true,
      },
    });
    return NextResponse.json(reviews);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to submit review" },
      { status: 500 }
    );
  }
}

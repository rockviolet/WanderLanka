import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();
// GET all reviews
export async function GET() {
  try {
    const reviews = await prisma.review.findMany({
      include: {
        client: {
          select: {
            name: true,
            imageUrl: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(reviews);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch reviews" },
      { status: 500 }
    );
  }
}

// POST a new review
export async function POST(req: Request) {
  try {
    const { review, numOfStars, clientId } = await req.json();

    // Validate input
    if (!review || !numOfStars || !clientId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (numOfStars < 1 || numOfStars > 5) {
      return NextResponse.json(
        { error: "Rating must be between 1 and 5 stars" },
        { status: 400 }
      );
    }

    const newReview = await prisma.review.create({
      data: {
        review,
        numOfStars,
        clientId,
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

    return NextResponse.json(newReview, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to create review" },
      { status: 500 }
    );
  }
}

import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

// GET review by ID
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const review = await prisma.review.findUnique({
      where: { id: id },
      include: {
        client: {
          select: {
            name: true,
            imageUrl: true,
          },
        },
      },
    });

    if (!review) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 });
    }

    return NextResponse.json(review);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch review" },
      { status: 500 }
    );
  }
}

// UPDATE review by ID
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { review, numOfStars } = await req.json();

    // Validate input
    if (!review || !numOfStars) {
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

    const updatedReview = await prisma.review.update({
      where: { id: id },
      data: {
        review,
        numOfStars,
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

    return NextResponse.json(updatedReview);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to update review" },
      { status: 500 }
    );
  }
}

// DELETE review by ID
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.review.delete({
      where: { id: params.id },
    });

    return NextResponse.json(
      { message: "Review deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to delete review" },
      { status: 500 }
    );
  }
}

import { clientSchema } from "@/schemas/client";
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const client = await prisma.client.findUnique({
      where: { id: id },
      select: {
        id: true,
        name: true,
        email: true,
        username: true,
        contactNumber: true,
        country: true,
        imageUrl: true,
        createdAt: true,
        gender: true,
        reviews: {
          select: {
            id: true,
            review: true,
            numOfStars: true,
            createdAt: true,
          },
        },
      },
    });

    if (!client) {
      return NextResponse.json({ error: "Client not found" }, { status: 404 });
    }

    return NextResponse.json(client);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch client" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// UPDATE Client
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const validation = clientSchema.partial().safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.errors },
        { status: 400 }
      );
    }

    // Check if client exists
    const existingClient = await prisma.client.findUnique({
      where: { id: id },
    });

    if (!existingClient) {
      return NextResponse.json({ error: "Client not found" }, { status: 404 });
    }

    // Check for email/username conflicts
    if (body.email || body.username) {
      const conflictClient = await prisma.client.findFirst({
        where: {
          OR: [
            body.email ? { email: body.email } : {},
            body.username ? { username: body.username } : {},
          ],
          NOT: { id: id },
        },
      });

      if (conflictClient) {
        return NextResponse.json(
          { error: "Email or username already exists" },
          { status: 400 }
        );
      }
    }

    // Handle password update separately
    const updateData = { ...body };
    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }

    const updatedClient = await prisma.client.update({
      where: { id: id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        username: true,
        contactNumber: true,
      },
    });

    return NextResponse.json(updatedClient);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to update client" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// DELETE Client
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    // Check if client exists
    const existingClient = await prisma.client.findUnique({
      where: { id: id },
    });

    if (!existingClient) {
      return NextResponse.json({ error: "Client not found" }, { status: 404 });
    }

    // Delete client and associated reviews
    await prisma.review.deleteMany({
      where: { clientId: id },
    });

    await prisma.client.delete({
      where: { id: id },
    });

    return NextResponse.json(
      { message: "Client deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to delete client" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

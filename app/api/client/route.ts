import { clientSchema } from "@/schemas/client";
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// GET ALL Clients
export async function GET() {
  try {
    const clients = await prisma.client.findMany({
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
            numOfStars: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(clients);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch clients" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// CREATE Client
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validation = clientSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.errors },
        { status: 400 }
      );
    }

    const existingClient = await prisma.client.findFirst({
      where: {
        OR: [{ email: body.email }, { username: body.username }],
      },
    });

    if (existingClient) {
      return NextResponse.json(
        { error: "Email or username already exists" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(body.password, 10);

    const client = await prisma.client.create({
      data: {
        ...body,
        password: hashedPassword,
      },
      select: {
        id: true,
        name: true,
        email: true,
        username: true,
        contactNumber: true,
      },
    });

    return NextResponse.json(client, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to create client" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

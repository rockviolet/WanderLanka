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

    const client = await prisma.client.findUnique({
      where: { email: body.email },
    });

    if (!client) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    const passwordMatch = await bcrypt.compare(body.password, client.password);

    if (!passwordMatch) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Return client data without password
    const { password, ...clientData } = client;
    console.log(password);
    return NextResponse.json(clientData);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to login" }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

const excludePassword = (user: any) => {
  if (!user) return null;
  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = parseInt(params.id, 10);
    if (isNaN(userId)) {
      return NextResponse.json({ error: "Invalid ID format" }, { status: 400 });
    }

    console.log("Fetching user with ID:", userId);

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        image: true,
        commandes: {
          include: {
            quantites: {
              include: { produit: true },
            },
          },
        },
        livraisons: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(excludePassword(user), { status: 200 });
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = parseInt(params.id, 10);
    if (isNaN(userId)) {
      return NextResponse.json({ error: "Invalid ID format" }, { status: 400 });
    }

    const body = await req.json();
    const { username, email, role, imageId } = body;

    console.log("Updating user with ID:", userId);

    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!existingUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const sessionUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });

    if (!sessionUser || sessionUser.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { username, email, role, imageId },
    });

    console.log("User updated:", updatedUser);
    return NextResponse.json(excludePassword(updatedUser), { status: 200 });
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = parseInt(params.id, 10);
    if (isNaN(userId)) {
      return NextResponse.json({ error: "Invalid ID format" }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!existingUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const sessionUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });

    if (!sessionUser || sessionUser.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    await prisma.user.delete({ where: { id: userId } });
    return NextResponse.json(
      { message: "User deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

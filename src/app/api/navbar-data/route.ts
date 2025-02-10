import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

const prisma = new PrismaClient();

export async function GET(req: Request) {
  try {
    const session = await getServerSession({ req, ...authOptions });

    console.log("Session in API:", session);

    const categories = await prisma.categorie.findMany({
      where: { parentId: null }, 
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        subcategories: {
          select: {
            id: true,
            name: true,
            slug: true,
            description: true,
          },
        },
      },
    });

    return NextResponse.json({ categories, session });
  } catch (error) {
    console.error("Error fetching navbar data:", error);
    return NextResponse.json(
      { error: "Error fetching navbar data" },
      { status: 500 }
    );
  }
}

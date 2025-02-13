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

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const { id } = params;

  try {
    // 🔥 Récupérer les données envoyées en FormData
    const formData = await req.formData();
    const username = formData.get("name") as string;
    const email = formData.get("email") as string;
    const file = formData.get("file"); // Image (optionnel)

    console.log("Updating user with ID:", id);
    console.log("Received data:", { username, email, file });

    // 🔹 Vérifie que les valeurs existent avant d'exécuter la mise à jour
    if (!username || !email) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // 🔥 Mettre à jour l'utilisateur (sans gérer le fichier pour l'instant)
    const updatedUser = await prisma.user.update({
      where: { id: parseInt(id) },
      data: { username, email },
    });

    // Exclure le mot de passe de la réponse
    const { password, ...userWithoutPassword } = updatedUser;
    console.log("PATCH API/users/" + id + ": user updated:", userWithoutPassword);
    
    return NextResponse.json(userWithoutPassword, { status: 200 });
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
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

import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';

export async function GET() {
  try {
    const categories = await prisma.categorie.findMany({
      where: { parentId: null }, 
      select: {
        id: true,
        name: true,
        slug: true,
      },
    });

    return NextResponse.json(categories);
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

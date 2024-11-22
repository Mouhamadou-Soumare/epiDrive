import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
import { User } from '../../../../types';
import { Role } from '@prisma/client';

export async function GET() {
  try {
    console.log("Fetching all users...");

    const users = await prisma.user.findMany({
      include: {
        image: true,
      },
    });

    console.log("Users found:", users);

    if (users.length === 0) {
      return NextResponse.json({ message: 'No users found' }, { status: 404 });
    }

    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body: User = await request.json();
    const { username, email, password, role, imageId } = body;

    console.log('Received body:', body);
    if (!username || !email || !password || !role) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    console.log('Creating user with body:', body);
    const newUser = await prisma.user.create({
      data: {
      username: username,
      email: email,
      password: password,
      role: role ? (role as unknown as Role) : undefined,
      imageId: imageId || null,
      },
    });

    console.log('User created:', newUser);

    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

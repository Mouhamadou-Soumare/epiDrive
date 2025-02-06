import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function GET() {
  try {
    console.log("Fetching all users...");

    const users = await prisma.user.findMany({
      include: {
        image: true,
        livraisons: true,
      },
    });

    if (users.length === 0) {
      return NextResponse.json({ message: 'No users found' }, { status: 404 });
    }

    // Typage sécurisé sans `any`
    type UserWithoutPassword = Omit<typeof users[number], "password">;

    const usersWithoutPassword = users.map(({ password: _, ...userWithoutPassword }) => userWithoutPassword);

    console.log("GET API/users: users found:", usersWithoutPassword);
    return NextResponse.json(usersWithoutPassword, { status: 200 });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}


export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { username, email, password, role, imagePath } = body;

    if (!username || !email || !password || !role) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    console.log('Creating user with body:', body);

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the new user
    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        role,
      },
    });

    // Create the image if imagePath is provided
    if (imagePath) {
      const newImage = await prisma.image.create({
        data: {
          path: imagePath,
          users: {
            connect: {
              id: newUser.id,
            },
          },
        },
      });

      console.log('Image created:', newImage);
    }

    // Remove the password from the response
    const { password: _, ...userWithoutPassword } = newUser;

    console.log('POST API/users: user created:', userWithoutPassword);
    return NextResponse.json(userWithoutPassword, { status: 201 });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

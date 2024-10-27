import { faker } from '@faker-js/faker';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient();

async function hashPassword(password) {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
}

export async function createUsers() {
  const clientPassword = "test";
  const hashedClientPassword = await hashPassword(clientPassword);
  
  const clientUser = await prisma.user.create({
    data: {
      username: faker.internet.userName(),
      email: faker.internet.email(),
      password: hashedClientPassword,
      role: 'USER',
    },
  });

  console.log('Client User created:', clientUser);
  console.log('Client User plain password (for reference):', clientPassword); // Affiche le mot de passe en clair

  const adminPassword = "admin";
  const hashedAdminPassword = await hashPassword(adminPassword);

  const adminUser = await prisma.user.create({
    data: {
      username: faker.internet.userName(),
      email: faker.internet.email(),
      password: hashedAdminPassword,
      role: 'ADMIN',
    },
  });

  console.log('Admin User created:', adminUser);
  console.log('Admin User plain password (for reference):', adminPassword); // Affiche le mot de passe en clair
}

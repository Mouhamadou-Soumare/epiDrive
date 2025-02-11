import { faker } from '@faker-js/faker';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient();

async function hashPassword(password) {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
}


export async function createUsers() {
  // Création de 10 utilisateurs de type client
  const clientPassword = "test";
  const hashedClientPassword = await hashPassword(clientPassword);
  
  for (let i = 0; i < 10; i++) {
    const username = faker.internet.userName();
    const clientUser = await prisma.user.create({
      data: {
        username: username,
        email: username + '@yopmail.com',
        password: hashedClientPassword,
        role: 'USER',
        livraisons: {
          create: [
            {
              adresse: faker.location.streetAddress(),
              ville: faker.location.city(),
              codePostal: faker.location.zipCode(),
              pays: faker.location.country(),
            },
          ],
        },
      },
    });

    console.log('Client User created:', clientUser);
    console.log('Client User plain password (for reference):', clientPassword);
  }

  // Création d'un utilisateur de type admin
  const adminPassword = "admin";
  const hashedAdminPassword = await hashPassword(adminPassword);

  const adminUser = await prisma.user.create({
    data: {
      username: faker.internet.username(),
      email: faker.internet.email(),
      password: hashedAdminPassword,
      role: 'ADMIN',
      logs: {
        create: [
          {
            action: 'Admin account created',
            metadata: { reason: 'Seed script initialization' },
          },
        ],
      },
    },
  });

  console.log('Admin User created:', adminUser);
  console.log('Admin User plain password (for reference):', adminPassword);

  // Création de 3 utilisateurs de type magasinier
  for (let i = 0; i < 3; i++) {
    const magasinierPassword = "magasinier";
    const hashedMagasinierPassword = await hashPassword(magasinierPassword);

    const magasinierUser = await prisma.user.create({
      data: {
        username: faker.internet.userName(),
        email: faker.internet.email(),
        password: hashedMagasinierPassword,
        role: 'MAGASINIER',
        logs: {
          create: [
            {
              action: 'Magasinier account created',
              metadata: { reason: 'Seed script initialization' },
            },
          ],
        },
      },
    });

    console.log('Magasinier User created:', magasinierUser);
    console.log('Magasinier User plain password (for reference):', magasinierPassword);
  }
}

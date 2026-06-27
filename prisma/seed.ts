import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';
import { MENU_ITEMS, LOCATIONS } from '../src/data';

const prisma = new PrismaClient();

async function main() {
  for (const item of MENU_ITEMS) {
    await prisma.product.upsert({
      where: { id: item.id },
      create: {
        id: item.id, name: item.name, description: item.description,
        priceCents: Math.round(item.price * 100), image: item.image, category: item.category,
        bestSeller: item.isBestSeller ?? false, chefChoice: item.chefChoice ?? false,
        calories: item.calories, tags: item.tags ?? [], thumbnails: item.thumbnails ?? [],
      },
      update: {
        name: item.name, description: item.description, image: item.image, category: item.category,
        bestSeller: item.isBestSeller ?? false, chefChoice: item.chefChoice ?? false,
        calories: item.calories, tags: item.tags ?? [], thumbnails: item.thumbnails ?? [],
      },
    });
  }
  for (const location of LOCATIONS) {
    await prisma.location.upsert({
      where: { id: location.id },
      create: { ...location, status: location.status === 'coming-soon' ? 'coming_soon' : 'open' },
      update: {
        name: location.name, address: location.address, hours: location.hours,
        status: location.status === 'coming-soon' ? 'coming_soon' : 'open',
        statusLabel: location.statusLabel, mapImage: location.mapImage,
      },
    });
  }
  const email = (process.env.ADMIN_EMAIL ?? 'admin@unassuming.local').toLowerCase();
  const password = process.env.ADMIN_TEMP_PASSWORD ?? 'change-this-password';
  await prisma.adminUser.upsert({
    where: { email },
    create: { email, passwordHash: await bcrypt.hash(password, 12), mustChangePassword: true },
    update: {},
  });
}

main().finally(() => prisma.$disconnect()).catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

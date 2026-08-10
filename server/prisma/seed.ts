import { PrismaClient, UserRole, ProductStatus, OrderStatus } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // 1. Create Admin User
  const adminPassword = await bcrypt.hash('AdminPass123!', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@scic.com' },
    update: {},
    create: {
      name: 'System Admin',
      email: 'admin@scic.com',
      password: adminPassword,
      role: UserRole.ADMIN,
    },
  });

  // 2. Create Regular User
  const userPassword = await bcrypt.hash('UserPass123!', 10);
  const user = await prisma.user.upsert({
    where: { email: 'john@example.com' },
    update: {},
    create: {
      name: 'John Doe',
      email: 'john@example.com',
      password: userPassword,
      role: UserRole.USER,
    },
  });

  // 3. Create Categories
  const catElectronics = await prisma.category.upsert({
    where: { name: 'Electronics' },
    update: {},
    create: {
      name: 'Electronics',
      description: 'Gadgets, devices, and accessories',
    },
  });

  const catFashion = await prisma.category.upsert({
    where: { name: 'Fashion' },
    update: {},
    create: {
      name: 'Fashion',
      description: 'Apparel and footwear',
    },
  });

  // 4. Create Products
  const prod1 = await prisma.product.create({
    data: {
      title: 'Wireless Noise-Canceling Headphones',
      description: 'High-fidelity audio with active noise cancellation.',
      price: 199.99,
      stock: 50,
      status: ProductStatus.AVAILABLE,
      categoryId: catElectronics.id,
    },
  });

  const prod2 = await prisma.product.create({
    data: {
      title: 'Ergonomic Leather Chair',
      description: 'Comfortable office chair with lumbar support.',
      price: 299.00,
      stock: 20,
      status: ProductStatus.AVAILABLE,
      categoryId: catFashion.id,
    },
  });

  // 5. Create Review
  await prisma.review.create({
    data: {
      rating: 5,
      comment: 'Exceptional sound quality and quick shipping!',
      userId: user.id,
      productId: prod1.id,
    },
  });

  // 6. Create Order
  await prisma.order.create({
    data: {
      userId: user.id,
      totalAmount: 199.99,
      status: OrderStatus.DELIVERED,
      items: JSON.stringify([{ productId: prod1.id, quantity: 1, price: 199.99 }]),
    },
  });

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

import bcrypt from 'bcrypt';
import prisma from '../../lib/prisma';

export class UserService {
  static async createUser(data: { name: string; email: string; password: string; role?: 'USER' | 'ADMIN' }) {
    const existing = await prisma.user.findFirst({
      where: { email: data.email, isDeleted: false },
    });
    if (existing) {
      throw new Error('User already exists');
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);
    return await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
        role: data.role || 'USER',
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  static async getAllUsers() {
    return await prisma.user.findMany({
      where: { isDeleted: false },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  static async getUserById(id: string) {
    const user = await prisma.user.findFirst({
      where: { id, isDeleted: false },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    if (!user) throw new Error('User not found');
    return user;
  }

  static async updateUser(id: string, data: { name?: string; email?: string; role?: 'USER' | 'ADMIN' }) {
    await this.getUserById(id);
    return await prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  static async softDeleteUser(id: string) {
    await this.getUserById(id);
    return await prisma.user.update({
      where: { id },
      data: { isDeleted: true },
      select: {
        id: true,
        name: true,
        email: true,
        isDeleted: true,
      },
    });
  }
}

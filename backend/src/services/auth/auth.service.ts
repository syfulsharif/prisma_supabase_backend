import bcrypt from 'bcrypt';
import prisma from '../../lib/prisma';
import { generateToken } from '../../lib/jwt';

export class AuthService {
  static async register(data: { name: string; email: string; password: string; role?: 'USER' | 'ADMIN' }) {
    const existingUser = await prisma.user.findFirst({
      where: { email: data.email, isDeleted: false },
    });

    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);
    const user = await prisma.user.create({
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

    const token = generateToken({ userId: user.id, email: user.email, role: user.role });

    return { user, token };
  }

  static async login(data: { email: string; password: string }) {
    const user = await prisma.user.findFirst({
      where: { email: data.email, isDeleted: false },
    });

    if (!user) {
      throw new Error('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(data.password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }

    const token = generateToken({ userId: user.id, email: user.email, role: user.role });

    const { password, ...userWithoutPassword } = user;
    return { user: userWithoutPassword, token };
  }

  static async getProfile(userId: string) {
    const user = await prisma.user.findFirst({
      where: { id: userId, isDeleted: false },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  }
}

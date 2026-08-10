import prisma from '../../lib/prisma';
import { OrderStatus } from '@prisma/client';

export class OrderService {
  static async createOrder(data: { userId: string; items: any[]; totalAmount: number }) {
    const user = await prisma.user.findFirst({
      where: { id: data.userId, isDeleted: false },
    });
    if (!user) throw new Error('User not found');

    return await prisma.order.create({
      data: {
        userId: data.userId,
        totalAmount: data.totalAmount,
        items: JSON.stringify(data.items),
        status: OrderStatus.PENDING,
      },
      include: {
        user: { select: { id: true, name: true, email: true } },
      },
    });
  }

  static async getAllOrders(userId?: string, role?: string) {
    const where: any = { isDeleted: false };
    if (role !== 'ADMIN' && userId) {
      where.userId = userId;
    }

    const orders = await prisma.order.findMany({
      where,
      include: {
        user: { select: { id: true, name: true, email: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return orders.map((order) => ({
      ...order,
      items: JSON.parse(order.items),
    }));
  }

  static async getOrderById(id: string, userId?: string, role?: string) {
    const order = await prisma.order.findFirst({
      where: { id, isDeleted: false },
      include: {
        user: { select: { id: true, name: true, email: true } },
      },
    });
    if (!order) throw new Error('Order not found');

    if (role !== 'ADMIN' && userId && order.userId !== userId) {
      throw new Error('Forbidden. You do not have access to this order.');
    }

    return {
      ...order,
      items: JSON.parse(order.items),
    };
  }

  static async updateOrderStatus(id: string, status: OrderStatus) {
    await prisma.order.findFirst({
      where: { id, isDeleted: false },
    });

    const updatedOrder = await prisma.order.update({
      where: { id },
      data: { status },
      include: {
        user: { select: { id: true, name: true, email: true } },
      },
    });

    return {
      ...updatedOrder,
      items: JSON.parse(updatedOrder.items),
    };
  }

  static async softDeleteOrder(id: string, userId?: string, role?: string) {
    const order = await prisma.order.findFirst({
      where: { id, isDeleted: false },
    });
    if (!order) throw new Error('Order not found');

    if (role !== 'ADMIN' && userId && order.userId !== userId) {
      throw new Error('Forbidden. You do not have permission to delete this order.');
    }

    return await prisma.order.update({
      where: { id },
      data: { isDeleted: true },
    });
  }
}

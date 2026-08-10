"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderService = void 0;
const prisma_1 = __importDefault(require("../../lib/prisma"));
const client_1 = require("@prisma/client");
class OrderService {
    static async createOrder(data) {
        const user = await prisma_1.default.user.findFirst({
            where: { id: data.userId, isDeleted: false },
        });
        if (!user)
            throw new Error('User not found');
        return await prisma_1.default.order.create({
            data: {
                userId: data.userId,
                totalAmount: data.totalAmount,
                items: JSON.stringify(data.items),
                status: client_1.OrderStatus.PENDING,
            },
            include: {
                user: { select: { id: true, name: true, email: true } },
            },
        });
    }
    static async getAllOrders(userId, role) {
        const where = { isDeleted: false };
        if (role !== 'ADMIN' && userId) {
            where.userId = userId;
        }
        const orders = await prisma_1.default.order.findMany({
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
    static async getOrderById(id, userId, role) {
        const order = await prisma_1.default.order.findFirst({
            where: { id, isDeleted: false },
            include: {
                user: { select: { id: true, name: true, email: true } },
            },
        });
        if (!order)
            throw new Error('Order not found');
        if (role !== 'ADMIN' && userId && order.userId !== userId) {
            throw new Error('Forbidden. You do not have access to this order.');
        }
        return {
            ...order,
            items: JSON.parse(order.items),
        };
    }
    static async updateOrderStatus(id, status) {
        await prisma_1.default.order.findFirst({
            where: { id, isDeleted: false },
        });
        const updatedOrder = await prisma_1.default.order.update({
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
    static async softDeleteOrder(id, userId, role) {
        const order = await prisma_1.default.order.findFirst({
            where: { id, isDeleted: false },
        });
        if (!order)
            throw new Error('Order not found');
        if (role !== 'ADMIN' && userId && order.userId !== userId) {
            throw new Error('Forbidden. You do not have permission to delete this order.');
        }
        return await prisma_1.default.order.update({
            where: { id },
            data: { isDeleted: true },
        });
    }
}
exports.OrderService = OrderService;

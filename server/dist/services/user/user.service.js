"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const prisma_1 = __importDefault(require("../../lib/prisma"));
class UserService {
    static async createUser(data) {
        const existing = await prisma_1.default.user.findFirst({
            where: { email: data.email, isDeleted: false },
        });
        if (existing) {
            throw new Error('User already exists');
        }
        const hashedPassword = await bcrypt_1.default.hash(data.password, 10);
        return await prisma_1.default.user.create({
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
        return await prisma_1.default.user.findMany({
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
    static async getUserById(id) {
        const user = await prisma_1.default.user.findFirst({
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
        if (!user)
            throw new Error('User not found');
        return user;
    }
    static async updateUser(id, data) {
        await this.getUserById(id);
        return await prisma_1.default.user.update({
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
    static async softDeleteUser(id) {
        await this.getUserById(id);
        return await prisma_1.default.user.update({
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
exports.UserService = UserService;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const prisma_1 = __importDefault(require("../../lib/prisma"));
const jwt_1 = require("../../lib/jwt");
class AuthService {
    static async register(data) {
        const existingUser = await prisma_1.default.user.findFirst({
            where: { email: data.email, isDeleted: false },
        });
        if (existingUser) {
            throw new Error('User with this email already exists');
        }
        const hashedPassword = await bcrypt_1.default.hash(data.password, 10);
        const user = await prisma_1.default.user.create({
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
        const token = (0, jwt_1.generateToken)({ userId: user.id, email: user.email, role: user.role });
        return { user, token };
    }
    static async login(data) {
        const user = await prisma_1.default.user.findFirst({
            where: { email: data.email, isDeleted: false },
        });
        if (!user) {
            throw new Error('Invalid email or password');
        }
        const isPasswordValid = await bcrypt_1.default.compare(data.password, user.password);
        if (!isPasswordValid) {
            throw new Error('Invalid email or password');
        }
        const token = (0, jwt_1.generateToken)({ userId: user.id, email: user.email, role: user.role });
        const { password, ...userWithoutPassword } = user;
        return { user: userWithoutPassword, token };
    }
    static async getProfile(userId) {
        const user = await prisma_1.default.user.findFirst({
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
exports.AuthService = AuthService;

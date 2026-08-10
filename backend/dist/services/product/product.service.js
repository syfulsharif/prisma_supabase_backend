"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductService = void 0;
const prisma_1 = __importDefault(require("../../lib/prisma"));
const client_1 = require("@prisma/client");
class ProductService {
    static async createProduct(data) {
        const category = await prisma_1.default.category.findFirst({
            where: { id: data.categoryId, isDeleted: false },
        });
        if (!category)
            throw new Error('Category not found');
        return await prisma_1.default.product.create({
            data: {
                title: data.title,
                description: data.description,
                price: data.price,
                stock: data.stock !== undefined ? data.stock : 0,
                status: data.status || client_1.ProductStatus.AVAILABLE,
                categoryId: data.categoryId,
            },
            include: {
                category: true,
            },
        });
    }
    static async getAllProducts(filters) {
        const where = { isDeleted: false };
        if (filters?.categoryId)
            where.categoryId = filters.categoryId;
        if (filters?.status)
            where.status = filters.status;
        if (filters?.search) {
            where.OR = [
                { title: { contains: filters.search, mode: 'insensitive' } },
                { description: { contains: filters.search, mode: 'insensitive' } },
            ];
        }
        return await prisma_1.default.product.findMany({
            where,
            include: {
                category: true,
                reviews: {
                    where: { isDeleted: false },
                    include: {
                        user: { select: { id: true, name: true, email: true } },
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    static async getProductById(id) {
        const product = await prisma_1.default.product.findFirst({
            where: { id, isDeleted: false },
            include: {
                category: true,
                reviews: {
                    where: { isDeleted: false },
                    include: {
                        user: { select: { id: true, name: true, email: true } },
                    },
                },
            },
        });
        if (!product)
            throw new Error('Product not found');
        return product;
    }
    static async updateProduct(id, data) {
        await this.getProductById(id);
        if (data.categoryId) {
            const category = await prisma_1.default.category.findFirst({
                where: { id: data.categoryId, isDeleted: false },
            });
            if (!category)
                throw new Error('Category not found');
        }
        return await prisma_1.default.product.update({
            where: { id },
            data,
            include: {
                category: true,
            },
        });
    }
    static async softDeleteProduct(id) {
        await this.getProductById(id);
        return await prisma_1.default.product.update({
            where: { id },
            data: { isDeleted: true },
        });
    }
}
exports.ProductService = ProductService;

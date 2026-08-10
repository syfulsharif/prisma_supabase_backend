"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryService = void 0;
const prisma_1 = __importDefault(require("../../lib/prisma"));
class CategoryService {
    static async createCategory(data) {
        const existing = await prisma_1.default.category.findFirst({
            where: { name: data.name, isDeleted: false },
        });
        if (existing)
            throw new Error('Category already exists');
        return await prisma_1.default.category.create({
            data,
        });
    }
    static async getAllCategories() {
        return await prisma_1.default.category.findMany({
            where: { isDeleted: false },
            include: {
                _count: {
                    select: { products: { where: { isDeleted: false } } },
                },
            },
        });
    }
    static async getCategoryById(id) {
        const category = await prisma_1.default.category.findFirst({
            where: { id, isDeleted: false },
            include: {
                products: {
                    where: { isDeleted: false },
                },
            },
        });
        if (!category)
            throw new Error('Category not found');
        return category;
    }
    static async updateCategory(id, data) {
        await this.getCategoryById(id);
        return await prisma_1.default.category.update({
            where: { id },
            data,
        });
    }
    static async softDeleteCategory(id) {
        await this.getCategoryById(id);
        return await prisma_1.default.category.update({
            where: { id },
            data: { isDeleted: true },
        });
    }
}
exports.CategoryService = CategoryService;

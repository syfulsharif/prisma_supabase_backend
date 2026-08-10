"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewService = void 0;
const prisma_1 = __importDefault(require("../../lib/prisma"));
class ReviewService {
    static async createReview(data) {
        const product = await prisma_1.default.product.findFirst({
            where: { id: data.productId, isDeleted: false },
        });
        if (!product)
            throw new Error('Product not found');
        return await prisma_1.default.review.create({
            data: {
                rating: data.rating,
                comment: data.comment,
                userId: data.userId,
                productId: data.productId,
            },
            include: {
                user: { select: { id: true, name: true, email: true } },
                product: { select: { id: true, title: true } },
            },
        });
    }
    static async getAllReviews(productId) {
        const where = { isDeleted: false };
        if (productId)
            where.productId = productId;
        return await prisma_1.default.review.findMany({
            where,
            include: {
                user: { select: { id: true, name: true, email: true } },
                product: { select: { id: true, title: true } },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    static async getReviewById(id) {
        const review = await prisma_1.default.review.findFirst({
            where: { id, isDeleted: false },
            include: {
                user: { select: { id: true, name: true, email: true } },
                product: { select: { id: true, title: true } },
            },
        });
        if (!review)
            throw new Error('Review not found');
        return review;
    }
    static async updateReview(id, userId, userRole, data) {
        const review = await this.getReviewById(id);
        if (review.userId !== userId && userRole !== 'ADMIN') {
            throw new Error('Forbidden. You can only update your own reviews.');
        }
        return await prisma_1.default.review.update({
            where: { id },
            data,
            include: {
                user: { select: { id: true, name: true, email: true } },
                product: { select: { id: true, title: true } },
            },
        });
    }
    static async softDeleteReview(id, userId, userRole) {
        const review = await this.getReviewById(id);
        if (review.userId !== userId && userRole !== 'ADMIN') {
            throw new Error('Forbidden. You can only delete your own reviews.');
        }
        return await prisma_1.default.review.update({
            where: { id },
            data: { isDeleted: true },
        });
    }
}
exports.ReviewService = ReviewService;

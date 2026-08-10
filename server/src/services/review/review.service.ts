import prisma from '../../lib/prisma';

export class ReviewService {
  static async createReview(data: { rating: number; comment: string; userId: string; productId: string }) {
    const product = await prisma.product.findFirst({
      where: { id: data.productId, isDeleted: false },
    });
    if (!product) throw new Error('Product not found');

    return await prisma.review.create({
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

  static async getAllReviews(productId?: string) {
    const where: any = { isDeleted: false };
    if (productId) where.productId = productId;

    return await prisma.review.findMany({
      where,
      include: {
        user: { select: { id: true, name: true, email: true } },
        product: { select: { id: true, title: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  static async getReviewById(id: string) {
    const review = await prisma.review.findFirst({
      where: { id, isDeleted: false },
      include: {
        user: { select: { id: true, name: true, email: true } },
        product: { select: { id: true, title: true } },
      },
    });
    if (!review) throw new Error('Review not found');
    return review;
  }

  static async updateReview(
    id: string,
    userId: string,
    userRole: string,
    data: { rating?: number; comment?: string }
  ) {
    const review = await this.getReviewById(id);
    if (review.userId !== userId && userRole !== 'ADMIN') {
      throw new Error('Forbidden. You can only update your own reviews.');
    }

    return await prisma.review.update({
      where: { id },
      data,
      include: {
        user: { select: { id: true, name: true, email: true } },
        product: { select: { id: true, title: true } },
      },
    });
  }

  static async softDeleteReview(id: string, userId: string, userRole: string) {
    const review = await this.getReviewById(id);
    if (review.userId !== userId && userRole !== 'ADMIN') {
      throw new Error('Forbidden. You can only delete your own reviews.');
    }

    return await prisma.review.update({
      where: { id },
      data: { isDeleted: true },
    });
  }
}

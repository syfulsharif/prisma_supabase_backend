import prisma from '../../lib/prisma';
import { ProductStatus } from '@prisma/client';

export class ProductService {
  static async createProduct(data: {
    title: string;
    description: string;
    price: number;
    stock?: number;
    status?: ProductStatus;
    categoryId: string;
  }) {
    const category = await prisma.category.findFirst({
      where: { id: data.categoryId, isDeleted: false },
    });
    if (!category) throw new Error('Category not found');

    return await prisma.product.create({
      data: {
        title: data.title,
        description: data.description,
        price: data.price,
        stock: data.stock !== undefined ? data.stock : 0,
        status: data.status || ProductStatus.AVAILABLE,
        categoryId: data.categoryId,
      },
      include: {
        category: true,
      },
    });
  }

  static async getAllProducts(filters?: { categoryId?: string; status?: ProductStatus; search?: string }) {
    const where: any = { isDeleted: false };
    if (filters?.categoryId) where.categoryId = filters.categoryId;
    if (filters?.status) where.status = filters.status;
    if (filters?.search) {
      where.OR = [
        { title: { contains: filters.search, mode: 'insensitive' } },
        { description: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    return await prisma.product.findMany({
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

  static async getProductById(id: string) {
    const product = await prisma.product.findFirst({
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
    if (!product) throw new Error('Product not found');
    return product;
  }

  static async updateProduct(
    id: string,
    data: {
      title?: string;
      description?: string;
      price?: number;
      stock?: number;
      status?: ProductStatus;
      categoryId?: string;
    }
  ) {
    await this.getProductById(id);
    if (data.categoryId) {
      const category = await prisma.category.findFirst({
        where: { id: data.categoryId, isDeleted: false },
      });
      if (!category) throw new Error('Category not found');
    }

    return await prisma.product.update({
      where: { id },
      data,
      include: {
        category: true,
      },
    });
  }

  static async softDeleteProduct(id: string) {
    await this.getProductById(id);
    return await prisma.product.update({
      where: { id },
      data: { isDeleted: true },
    });
  }
}

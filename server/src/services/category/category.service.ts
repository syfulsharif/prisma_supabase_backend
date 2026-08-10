import prisma from '../../lib/prisma';

export class CategoryService {
  static async createCategory(data: { name: string; description?: string }) {
    const existing = await prisma.category.findFirst({
      where: { name: data.name, isDeleted: false },
    });
    if (existing) throw new Error('Category already exists');

    return await prisma.category.create({
      data,
    });
  }

  static async getAllCategories() {
    return await prisma.category.findMany({
      where: { isDeleted: false },
      include: {
        _count: {
          select: { products: { where: { isDeleted: false } } },
        },
      },
    });
  }

  static async getCategoryById(id: string) {
    const category = await prisma.category.findFirst({
      where: { id, isDeleted: false },
      include: {
        products: {
          where: { isDeleted: false },
        },
      },
    });
    if (!category) throw new Error('Category not found');
    return category;
  }

  static async updateCategory(id: string, data: { name?: string; description?: string }) {
    await this.getCategoryById(id);
    return await prisma.category.update({
      where: { id },
      data,
    });
  }

  static async softDeleteCategory(id: string) {
    await this.getCategoryById(id);
    return await prisma.category.update({
      where: { id },
      data: { isDeleted: true },
    });
  }
}

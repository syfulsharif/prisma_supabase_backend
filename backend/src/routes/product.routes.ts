import { Router, Request, Response, NextFunction } from 'express';
import { ProductService } from '../services/product/product.service';
import { sendResponse } from '../lib/response';
import { authenticate, authorize } from '../middlewares/auth.middleware';
import { ProductStatus } from '@prisma/client';

const router = Router();

// Get all products (Public)
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { categoryId, status, search } = req.query;
    const products = await ProductService.getAllProducts({
      categoryId: (categoryId && categoryId !== 'undefined') ? (categoryId as string) : undefined,
      status: (status && status !== 'undefined') ? (status as ProductStatus) : undefined,
      search: (search && search !== 'undefined') ? (search as string) : undefined,
    });
    sendResponse(res, { statusCode: 200, success: true, message: 'Products retrieved successfully', data: products });
  } catch (error: any) {
    next(error);
  }
});

// Get product by ID (Public)
router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    const product = await ProductService.getProductById(id);
    sendResponse(res, { statusCode: 200, success: true, message: 'Product retrieved successfully', data: product });
  } catch (error: any) {
    next(error);
  }
});

// Create product (Admin only)
router.post('/', authenticate, authorize('ADMIN'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { title, description, price, stock, status, categoryId } = req.body;
    if (!title || !description || price === undefined || !categoryId) {
      sendResponse(res, { statusCode: 400, success: false, message: 'Title, description, price, and categoryId are required' });
      return;
    }
    const product = await ProductService.createProduct({
      title,
      description,
      price: Number(price),
      stock: stock !== undefined ? Number(stock) : undefined,
      status,
      categoryId,
    });
    sendResponse(res, { statusCode: 201, success: true, message: 'Product created successfully', data: product });
  } catch (error: any) {
    next(error);
  }
});

// Update product (Admin only)
router.put('/:id', authenticate, authorize('ADMIN'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    const product = await ProductService.updateProduct(id, req.body);
    sendResponse(res, { statusCode: 200, success: true, message: 'Product updated successfully', data: product });
  } catch (error: any) {
    next(error);
  }
});

// Soft Delete product (Admin only)
router.delete('/:id', authenticate, authorize('ADMIN'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    const product = await ProductService.softDeleteProduct(id);
    sendResponse(res, { statusCode: 200, success: true, message: 'Product deleted successfully', data: product });
  } catch (error: any) {
    next(error);
  }
});

export const productRoutes = router;

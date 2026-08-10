import { Router, Request, Response, NextFunction } from 'express';
import { CategoryService } from '../services/category/category.service';
import { sendResponse } from '../lib/response';
import { authenticate, authorize } from '../middlewares/auth.middleware';

const router = Router();

// Get all categories (Public)
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const categories = await CategoryService.getAllCategories();
    sendResponse(res, { statusCode: 200, success: true, message: 'Categories retrieved successfully', data: categories });
  } catch (error: any) {
    next(error);
  }
});

// Get category by ID (Public)
router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    const category = await CategoryService.getCategoryById(id);
    sendResponse(res, { statusCode: 200, success: true, message: 'Category retrieved successfully', data: category });
  } catch (error: any) {
    next(error);
  }
});

// Create category (Admin only)
router.post('/', authenticate, authorize('ADMIN'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, description } = req.body;
    if (!name) {
      sendResponse(res, { statusCode: 400, success: false, message: 'Category name is required' });
      return;
    }
    const category = await CategoryService.createCategory({ name, description });
    sendResponse(res, { statusCode: 201, success: true, message: 'Category created successfully', data: category });
  } catch (error: any) {
    next(error);
  }
});

// Update category (Admin only)
router.put('/:id', authenticate, authorize('ADMIN'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    const category = await CategoryService.updateCategory(id, req.body);
    sendResponse(res, { statusCode: 200, success: true, message: 'Category updated successfully', data: category });
  } catch (error: any) {
    next(error);
  }
});

// Soft Delete category (Admin only)
router.delete('/:id', authenticate, authorize('ADMIN'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    const category = await CategoryService.softDeleteCategory(id);
    sendResponse(res, { statusCode: 200, success: true, message: 'Category deleted successfully', data: category });
  } catch (error: any) {
    next(error);
  }
});

export const categoryRoutes = router;

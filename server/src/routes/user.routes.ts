import { Router, Request, Response, NextFunction } from 'express';
import { UserService } from '../services/user/user.service';
import { sendResponse } from '../lib/response';
import { authenticate, authorize } from '../middlewares/auth.middleware';

const router = Router();

// Create user (Admin only)
router.post('/', authenticate, authorize('ADMIN'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) {
      sendResponse(res, { statusCode: 400, success: false, message: 'Name, email, and password are required' });
      return;
    }
    const user = await UserService.createUser({ name, email, password, role });
    sendResponse(res, { statusCode: 201, success: true, message: 'User created successfully', data: user });
  } catch (error: any) {
    next(error);
  }
});

// Get all users (Admin only)
router.get('/', authenticate, authorize('ADMIN'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await UserService.getAllUsers();
    sendResponse(res, { statusCode: 200, success: true, message: 'Users retrieved successfully', data: users });
  } catch (error: any) {
    next(error);
  }
});

// Get user by ID
router.get('/:id', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    const user = await UserService.getUserById(id);
    sendResponse(res, { statusCode: 200, success: true, message: 'User retrieved successfully', data: user });
  } catch (error: any) {
    next(error);
  }
});

// Update user
router.put('/:id', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    const user = await UserService.updateUser(id, req.body);
    sendResponse(res, { statusCode: 200, success: true, message: 'User updated successfully', data: user });
  } catch (error: any) {
    next(error);
  }
});

// Soft Delete user
router.delete('/:id', authenticate, authorize('ADMIN'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    const user = await UserService.softDeleteUser(id);
    sendResponse(res, { statusCode: 200, success: true, message: 'User deleted successfully', data: user });
  } catch (error: any) {
    next(error);
  }
});

export const userRoutes = router;

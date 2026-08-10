import { Router, Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth/auth.service';
import { sendResponse } from '../lib/response';
import { authenticate, AuthRequest } from '../middlewares/auth.middleware';

const router = Router();

router.post('/register', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) {
      sendResponse(res, { statusCode: 400, success: false, message: 'Name, email, and password are required' });
      return;
    }
    const result = await AuthService.register({ name, email, password, role });
    sendResponse(res, { statusCode: 201, success: true, message: 'User registered successfully', data: result });
  } catch (error: any) {
    next(error);
  }
});

router.post('/login', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      sendResponse(res, { statusCode: 400, success: false, message: 'Email and password are required' });
      return;
    }
    const result = await AuthService.login({ email, password });
    sendResponse(res, { statusCode: 200, success: true, message: 'Login successful', data: result });
  } catch (error: any) {
    next(error);
  }
});

router.get('/me', authenticate, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const user = await AuthService.getProfile(req.user!.userId);
    sendResponse(res, { statusCode: 200, success: true, message: 'Profile retrieved successfully', data: user });
  } catch (error: any) {
    next(error);
  }
});

export const authRoutes = router;

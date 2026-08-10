import { Router, Request, Response, NextFunction } from 'express';
import { OrderService } from '../services/order/order.service';
import { sendResponse } from '../lib/response';
import { authenticate, authorize, AuthRequest } from '../middlewares/auth.middleware';

const router = Router();

// Create order (Authenticated users)
router.post('/', authenticate, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { items, totalAmount } = req.body;
    if (!items || !Array.isArray(items) || totalAmount === undefined) {
      sendResponse(res, { statusCode: 400, success: false, message: 'Items (array) and totalAmount are required' });
      return;
    }
    const order = await OrderService.createOrder({
      userId: req.user!.userId,
      items,
      totalAmount: Number(totalAmount),
    });
    sendResponse(res, { statusCode: 201, success: true, message: 'Order created successfully', data: order });
  } catch (error: any) {
    next(error);
  }
});

// Get all orders (Admin sees all, User sees own)
router.get('/', authenticate, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const orders = await OrderService.getAllOrders(req.user!.userId, req.user!.role);
    sendResponse(res, { statusCode: 200, success: true, message: 'Orders retrieved successfully', data: orders });
  } catch (error: any) {
    next(error);
  }
});

// Get order by ID
router.get('/:id', authenticate, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    const order = await OrderService.getOrderById(id, req.user!.userId, req.user!.role);
    sendResponse(res, { statusCode: 200, success: true, message: 'Order retrieved successfully', data: order });
  } catch (error: any) {
    next(error);
  }
});

// Update order status (Admin only)
router.put('/:id/status', authenticate, authorize('ADMIN'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    const { status } = req.body;
    if (!status) {
      sendResponse(res, { statusCode: 400, success: false, message: 'Order status is required' });
      return;
    }
    const order = await OrderService.updateOrderStatus(id, status);
    sendResponse(res, { statusCode: 200, success: true, message: 'Order status updated successfully', data: order });
  } catch (error: any) {
    next(error);
  }
});

// Soft Delete order (Owner or Admin)
router.delete('/:id', authenticate, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    const order = await OrderService.softDeleteOrder(id, req.user!.userId, req.user!.role);
    sendResponse(res, { statusCode: 200, success: true, message: 'Order deleted successfully', data: order });
  } catch (error: any) {
    next(error);
  }
});

export const orderRoutes = router;

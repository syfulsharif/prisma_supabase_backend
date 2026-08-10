import { Router, Request, Response, NextFunction } from 'express';
import { ReviewService } from '../services/review/review.service';
import { sendResponse } from '../lib/response';
import { authenticate, AuthRequest } from '../middlewares/auth.middleware';

const router = Router();

// Get all reviews (Public or filtered by productId)
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { productId } = req.query;
    const reviews = await ReviewService.getAllReviews(productId as string);
    sendResponse(res, { statusCode: 200, success: true, message: 'Reviews retrieved successfully', data: reviews });
  } catch (error: any) {
    next(error);
  }
});

// Get review by ID
router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    const review = await ReviewService.getReviewById(id);
    sendResponse(res, { statusCode: 200, success: true, message: 'Review retrieved successfully', data: review });
  } catch (error: any) {
    next(error);
  }
});

// Create review (Authenticated users)
router.post('/', authenticate, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { rating, comment, productId } = req.body;
    if (rating === undefined || !comment || !productId) {
      sendResponse(res, { statusCode: 400, success: false, message: 'Rating, comment, and productId are required' });
      return;
    }
    const review = await ReviewService.createReview({
      rating: Number(rating),
      comment,
      userId: req.user!.userId,
      productId,
    });
    sendResponse(res, { statusCode: 201, success: true, message: 'Review created successfully', data: review });
  } catch (error: any) {
    next(error);
  }
});

// Update review (Owner or Admin)
router.put('/:id', authenticate, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    const review = await ReviewService.updateReview(id, req.user!.userId, req.user!.role, req.body);
    sendResponse(res, { statusCode: 200, success: true, message: 'Review updated successfully', data: review });
  } catch (error: any) {
    next(error);
  }
});

// Soft Delete review (Owner or Admin)
router.delete('/:id', authenticate, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    const review = await ReviewService.softDeleteReview(id, req.user!.userId, req.user!.role);
    sendResponse(res, { statusCode: 200, success: true, message: 'Review deleted successfully', data: review });
  } catch (error: any) {
    next(error);
  }
});

export const reviewRoutes = router;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reviewRoutes = void 0;
const express_1 = require("express");
const review_service_1 = require("../services/review/review.service");
const response_1 = require("../lib/response");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
// Get all reviews (Public or filtered by productId)
router.get('/', async (req, res, next) => {
    try {
        const { productId } = req.query;
        const reviews = await review_service_1.ReviewService.getAllReviews(productId);
        (0, response_1.sendResponse)(res, { statusCode: 200, success: true, message: 'Reviews retrieved successfully', data: reviews });
    }
    catch (error) {
        next(error);
    }
});
// Get review by ID
router.get('/:id', async (req, res, next) => {
    try {
        const id = req.params.id;
        const review = await review_service_1.ReviewService.getReviewById(id);
        (0, response_1.sendResponse)(res, { statusCode: 200, success: true, message: 'Review retrieved successfully', data: review });
    }
    catch (error) {
        next(error);
    }
});
// Create review (Authenticated users)
router.post('/', auth_middleware_1.authenticate, async (req, res, next) => {
    try {
        const { rating, comment, productId } = req.body;
        if (rating === undefined || !comment || !productId) {
            (0, response_1.sendResponse)(res, { statusCode: 400, success: false, message: 'Rating, comment, and productId are required' });
            return;
        }
        const review = await review_service_1.ReviewService.createReview({
            rating: Number(rating),
            comment,
            userId: req.user.userId,
            productId,
        });
        (0, response_1.sendResponse)(res, { statusCode: 201, success: true, message: 'Review created successfully', data: review });
    }
    catch (error) {
        next(error);
    }
});
// Update review (Owner or Admin)
router.put('/:id', auth_middleware_1.authenticate, async (req, res, next) => {
    try {
        const id = req.params.id;
        const review = await review_service_1.ReviewService.updateReview(id, req.user.userId, req.user.role, req.body);
        (0, response_1.sendResponse)(res, { statusCode: 200, success: true, message: 'Review updated successfully', data: review });
    }
    catch (error) {
        next(error);
    }
});
// Soft Delete review (Owner or Admin)
router.delete('/:id', auth_middleware_1.authenticate, async (req, res, next) => {
    try {
        const id = req.params.id;
        const review = await review_service_1.ReviewService.softDeleteReview(id, req.user.userId, req.user.role);
        (0, response_1.sendResponse)(res, { statusCode: 200, success: true, message: 'Review deleted successfully', data: review });
    }
    catch (error) {
        next(error);
    }
});
exports.reviewRoutes = router;

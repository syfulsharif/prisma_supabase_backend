"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderRoutes = void 0;
const express_1 = require("express");
const order_service_1 = require("../services/order/order.service");
const response_1 = require("../lib/response");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
// Create order (Authenticated users)
router.post('/', auth_middleware_1.authenticate, async (req, res, next) => {
    try {
        const { items, totalAmount } = req.body;
        if (!items || !Array.isArray(items) || totalAmount === undefined) {
            (0, response_1.sendResponse)(res, { statusCode: 400, success: false, message: 'Items (array) and totalAmount are required' });
            return;
        }
        const order = await order_service_1.OrderService.createOrder({
            userId: req.user.userId,
            items,
            totalAmount: Number(totalAmount),
        });
        (0, response_1.sendResponse)(res, { statusCode: 201, success: true, message: 'Order created successfully', data: order });
    }
    catch (error) {
        next(error);
    }
});
// Get all orders (Admin sees all, User sees own)
router.get('/', auth_middleware_1.authenticate, async (req, res, next) => {
    try {
        const orders = await order_service_1.OrderService.getAllOrders(req.user.userId, req.user.role);
        (0, response_1.sendResponse)(res, { statusCode: 200, success: true, message: 'Orders retrieved successfully', data: orders });
    }
    catch (error) {
        next(error);
    }
});
// Get order by ID
router.get('/:id', auth_middleware_1.authenticate, async (req, res, next) => {
    try {
        const id = req.params.id;
        const order = await order_service_1.OrderService.getOrderById(id, req.user.userId, req.user.role);
        (0, response_1.sendResponse)(res, { statusCode: 200, success: true, message: 'Order retrieved successfully', data: order });
    }
    catch (error) {
        next(error);
    }
});
// Update order status (Admin only)
router.put('/:id/status', auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)('ADMIN'), async (req, res, next) => {
    try {
        const id = req.params.id;
        const { status } = req.body;
        if (!status) {
            (0, response_1.sendResponse)(res, { statusCode: 400, success: false, message: 'Order status is required' });
            return;
        }
        const order = await order_service_1.OrderService.updateOrderStatus(id, status);
        (0, response_1.sendResponse)(res, { statusCode: 200, success: true, message: 'Order status updated successfully', data: order });
    }
    catch (error) {
        next(error);
    }
});
// Soft Delete order (Owner or Admin)
router.delete('/:id', auth_middleware_1.authenticate, async (req, res, next) => {
    try {
        const id = req.params.id;
        const order = await order_service_1.OrderService.softDeleteOrder(id, req.user.userId, req.user.role);
        (0, response_1.sendResponse)(res, { statusCode: 200, success: true, message: 'Order deleted successfully', data: order });
    }
    catch (error) {
        next(error);
    }
});
exports.orderRoutes = router;

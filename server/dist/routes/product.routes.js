"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productRoutes = void 0;
const express_1 = require("express");
const product_service_1 = require("../services/product/product.service");
const response_1 = require("../lib/response");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
// Get all products (Public)
router.get('/', async (req, res, next) => {
    try {
        const { categoryId, status, search } = req.query;
        const products = await product_service_1.ProductService.getAllProducts({
            categoryId: categoryId,
            status: status,
            search: search,
        });
        (0, response_1.sendResponse)(res, { statusCode: 200, success: true, message: 'Products retrieved successfully', data: products });
    }
    catch (error) {
        next(error);
    }
});
// Get product by ID (Public)
router.get('/:id', async (req, res, next) => {
    try {
        const id = req.params.id;
        const product = await product_service_1.ProductService.getProductById(id);
        (0, response_1.sendResponse)(res, { statusCode: 200, success: true, message: 'Product retrieved successfully', data: product });
    }
    catch (error) {
        next(error);
    }
});
// Create product (Admin only)
router.post('/', auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)('ADMIN'), async (req, res, next) => {
    try {
        const { title, description, price, stock, status, categoryId } = req.body;
        if (!title || !description || price === undefined || !categoryId) {
            (0, response_1.sendResponse)(res, { statusCode: 400, success: false, message: 'Title, description, price, and categoryId are required' });
            return;
        }
        const product = await product_service_1.ProductService.createProduct({
            title,
            description,
            price: Number(price),
            stock: stock !== undefined ? Number(stock) : undefined,
            status,
            categoryId,
        });
        (0, response_1.sendResponse)(res, { statusCode: 201, success: true, message: 'Product created successfully', data: product });
    }
    catch (error) {
        next(error);
    }
});
// Update product (Admin only)
router.put('/:id', auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)('ADMIN'), async (req, res, next) => {
    try {
        const id = req.params.id;
        const product = await product_service_1.ProductService.updateProduct(id, req.body);
        (0, response_1.sendResponse)(res, { statusCode: 200, success: true, message: 'Product updated successfully', data: product });
    }
    catch (error) {
        next(error);
    }
});
// Soft Delete product (Admin only)
router.delete('/:id', auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)('ADMIN'), async (req, res, next) => {
    try {
        const id = req.params.id;
        const product = await product_service_1.ProductService.softDeleteProduct(id);
        (0, response_1.sendResponse)(res, { statusCode: 200, success: true, message: 'Product deleted successfully', data: product });
    }
    catch (error) {
        next(error);
    }
});
exports.productRoutes = router;

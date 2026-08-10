"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.categoryRoutes = void 0;
const express_1 = require("express");
const category_service_1 = require("../services/category/category.service");
const response_1 = require("../lib/response");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
// Get all categories (Public)
router.get('/', async (req, res, next) => {
    try {
        const categories = await category_service_1.CategoryService.getAllCategories();
        (0, response_1.sendResponse)(res, { statusCode: 200, success: true, message: 'Categories retrieved successfully', data: categories });
    }
    catch (error) {
        next(error);
    }
});
// Get category by ID (Public)
router.get('/:id', async (req, res, next) => {
    try {
        const id = req.params.id;
        const category = await category_service_1.CategoryService.getCategoryById(id);
        (0, response_1.sendResponse)(res, { statusCode: 200, success: true, message: 'Category retrieved successfully', data: category });
    }
    catch (error) {
        next(error);
    }
});
// Create category (Admin only)
router.post('/', auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)('ADMIN'), async (req, res, next) => {
    try {
        const { name, description } = req.body;
        if (!name) {
            (0, response_1.sendResponse)(res, { statusCode: 400, success: false, message: 'Category name is required' });
            return;
        }
        const category = await category_service_1.CategoryService.createCategory({ name, description });
        (0, response_1.sendResponse)(res, { statusCode: 201, success: true, message: 'Category created successfully', data: category });
    }
    catch (error) {
        next(error);
    }
});
// Update category (Admin only)
router.put('/:id', auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)('ADMIN'), async (req, res, next) => {
    try {
        const id = req.params.id;
        const category = await category_service_1.CategoryService.updateCategory(id, req.body);
        (0, response_1.sendResponse)(res, { statusCode: 200, success: true, message: 'Category updated successfully', data: category });
    }
    catch (error) {
        next(error);
    }
});
// Soft Delete category (Admin only)
router.delete('/:id', auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)('ADMIN'), async (req, res, next) => {
    try {
        const id = req.params.id;
        const category = await category_service_1.CategoryService.softDeleteCategory(id);
        (0, response_1.sendResponse)(res, { statusCode: 200, success: true, message: 'Category deleted successfully', data: category });
    }
    catch (error) {
        next(error);
    }
});
exports.categoryRoutes = router;

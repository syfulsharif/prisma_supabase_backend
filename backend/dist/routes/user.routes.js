"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRoutes = void 0;
const express_1 = require("express");
const user_service_1 = require("../services/user/user.service");
const response_1 = require("../lib/response");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
// Create user (Admin only)
router.post('/', auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)('ADMIN'), async (req, res, next) => {
    try {
        const { name, email, password, role } = req.body;
        if (!name || !email || !password) {
            (0, response_1.sendResponse)(res, { statusCode: 400, success: false, message: 'Name, email, and password are required' });
            return;
        }
        const user = await user_service_1.UserService.createUser({ name, email, password, role });
        (0, response_1.sendResponse)(res, { statusCode: 201, success: true, message: 'User created successfully', data: user });
    }
    catch (error) {
        next(error);
    }
});
// Get all users (Admin only)
router.get('/', auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)('ADMIN'), async (req, res, next) => {
    try {
        const users = await user_service_1.UserService.getAllUsers();
        (0, response_1.sendResponse)(res, { statusCode: 200, success: true, message: 'Users retrieved successfully', data: users });
    }
    catch (error) {
        next(error);
    }
});
// Get user by ID
router.get('/:id', auth_middleware_1.authenticate, async (req, res, next) => {
    try {
        const id = req.params.id;
        const user = await user_service_1.UserService.getUserById(id);
        (0, response_1.sendResponse)(res, { statusCode: 200, success: true, message: 'User retrieved successfully', data: user });
    }
    catch (error) {
        next(error);
    }
});
// Update user
router.put('/:id', auth_middleware_1.authenticate, async (req, res, next) => {
    try {
        const id = req.params.id;
        const user = await user_service_1.UserService.updateUser(id, req.body);
        (0, response_1.sendResponse)(res, { statusCode: 200, success: true, message: 'User updated successfully', data: user });
    }
    catch (error) {
        next(error);
    }
});
// Soft Delete user
router.delete('/:id', auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)('ADMIN'), async (req, res, next) => {
    try {
        const id = req.params.id;
        const user = await user_service_1.UserService.softDeleteUser(id);
        (0, response_1.sendResponse)(res, { statusCode: 200, success: true, message: 'User deleted successfully', data: user });
    }
    catch (error) {
        next(error);
    }
});
exports.userRoutes = router;

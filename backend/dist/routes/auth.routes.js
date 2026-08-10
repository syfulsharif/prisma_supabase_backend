"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRoutes = void 0;
const express_1 = require("express");
const auth_service_1 = require("../services/auth/auth.service");
const response_1 = require("../lib/response");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
router.post('/register', async (req, res, next) => {
    try {
        const { name, email, password, role } = req.body;
        if (!name || !email || !password) {
            (0, response_1.sendResponse)(res, { statusCode: 400, success: false, message: 'Name, email, and password are required' });
            return;
        }
        const result = await auth_service_1.AuthService.register({ name, email, password, role });
        (0, response_1.sendResponse)(res, { statusCode: 201, success: true, message: 'User registered successfully', data: result });
    }
    catch (error) {
        next(error);
    }
});
router.post('/login', async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            (0, response_1.sendResponse)(res, { statusCode: 400, success: false, message: 'Email and password are required' });
            return;
        }
        const result = await auth_service_1.AuthService.login({ email, password });
        (0, response_1.sendResponse)(res, { statusCode: 200, success: true, message: 'Login successful', data: result });
    }
    catch (error) {
        next(error);
    }
});
router.get('/me', auth_middleware_1.authenticate, async (req, res, next) => {
    try {
        const user = await auth_service_1.AuthService.getProfile(req.user.userId);
        (0, response_1.sendResponse)(res, { statusCode: 200, success: true, message: 'Profile retrieved successfully', data: user });
    }
    catch (error) {
        next(error);
    }
});
exports.authRoutes = router;

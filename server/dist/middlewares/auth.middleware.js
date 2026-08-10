"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorize = exports.authenticate = void 0;
const jwt_1 = require("../lib/jwt");
const response_1 = require("../lib/response");
const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        (0, response_1.sendResponse)(res, {
            statusCode: 401,
            success: false,
            message: 'Unauthorized access. No token provided.',
        });
        return;
    }
    const token = authHeader.split(' ')[1];
    try {
        const decoded = (0, jwt_1.verifyToken)(token);
        req.user = decoded;
        next();
    }
    catch (error) {
        (0, response_1.sendResponse)(res, {
            statusCode: 401,
            success: false,
            message: 'Invalid or expired token.',
        });
        return;
    }
};
exports.authenticate = authenticate;
const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            (0, response_1.sendResponse)(res, {
                statusCode: 401,
                success: false,
                message: 'Unauthorized access.',
            });
            return;
        }
        if (!roles.includes(req.user.role)) {
            (0, response_1.sendResponse)(res, {
                statusCode: 403,
                success: false,
                message: 'Forbidden. You do not have permission to perform this action.',
            });
            return;
        }
        next();
    };
};
exports.authorize = authorize;

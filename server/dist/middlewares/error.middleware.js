"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const response_1 = require("../lib/response");
const errorHandler = (err, req, res, next) => {
    console.error('Error Stack:', err);
    const statusCode = err.statusCode || err.status || 500;
    const message = err.message || 'Internal Server Error';
    (0, response_1.sendResponse)(res, {
        statusCode,
        success: false,
        message,
        data: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    });
};
exports.errorHandler = errorHandler;

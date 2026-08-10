"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendResponse = void 0;
const sendResponse = (res, data) => {
    const statusCode = data.statusCode || 200;
    res.status(statusCode).json({
        success: data.success,
        message: data.message,
        ...(data.data !== undefined && { data: data.data }),
        ...(data.meta !== undefined && { meta: data.meta }),
    });
};
exports.sendResponse = sendResponse;

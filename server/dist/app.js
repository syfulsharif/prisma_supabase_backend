"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const auth_routes_1 = require("./routes/auth.routes");
const user_routes_1 = require("./routes/user.routes");
const category_routes_1 = require("./routes/category.routes");
const product_routes_1 = require("./routes/product.routes");
const review_routes_1 = require("./routes/review.routes");
const order_routes_1 = require("./routes/order.routes");
const error_middleware_1 = require("./middlewares/error.middleware");
const response_1 = require("./lib/response");
dotenv_1.default.config();
const app = (0, express_1.default)();
// Middlewares
app.use((0, cors_1.default)({ origin: process.env.CORS_ORIGIN || '*', credentials: true }));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Health check / Root endpoint
app.get('/', (req, res) => {
    (0, response_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: 'SCIC REST API is running cleanly!',
        data: {
            status: 'OK',
            timestamp: new Date().toISOString(),
        },
    });
});
// API Routes
app.use('/api/auth', auth_routes_1.authRoutes);
app.use('/api/users', user_routes_1.userRoutes);
app.use('/api/categories', category_routes_1.categoryRoutes);
app.use('/api/products', product_routes_1.productRoutes);
app.use('/api/reviews', review_routes_1.reviewRoutes);
app.use('/api/orders', order_routes_1.orderRoutes);
// 404 Route Handler
app.use((req, res) => {
    (0, response_1.sendResponse)(res, {
        statusCode: 404,
        success: false,
        message: `API Route not found: ${req.method} ${req.originalUrl}`,
    });
});
// Global Error Handler
app.use(error_middleware_1.errorHandler);
exports.default = app;

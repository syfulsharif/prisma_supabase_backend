"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const prisma_1 = __importDefault(require("./lib/prisma"));
const PORT = process.env.PORT || 5000;
async function main() {
    try {
        const server = app_1.default.listen(PORT, () => {
            console.log(`🚀 Server running on http://localhost:${PORT}`);
        });
        const shutdown = async () => {
            console.log('Shutting down server...');
            server.close(async () => {
                await prisma_1.default.$disconnect();
                console.log('Prisma disconnected. Server stopped.');
                process.exit(0);
            });
        };
        process.on('SIGTERM', shutdown);
        process.on('SIGINT', shutdown);
    }
    catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
}
main();

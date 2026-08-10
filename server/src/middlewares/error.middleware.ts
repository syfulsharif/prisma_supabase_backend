import { Request, Response, NextFunction } from 'express';
import { sendResponse } from '../lib/response';

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error('Error Stack:', err);
  const statusCode = err.statusCode || err.status || 500;
  const message = err.message || 'Internal Server Error';

  sendResponse(res, {
    statusCode,
    success: false,
    message,
    data: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
};

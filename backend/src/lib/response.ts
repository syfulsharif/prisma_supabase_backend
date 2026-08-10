import { Response } from 'express';

interface ApiResponse<T> {
  statusCode?: number;
  success: boolean;
  message: string;
  data?: T;
  meta?: any;
}

export const sendResponse = <T>(res: Response, data: ApiResponse<T>): void => {
  const statusCode = data.statusCode || 200;
  res.status(statusCode).json({
    success: data.success,
    message: data.message,
    ...(data.data !== undefined && { data: data.data }),
    ...(data.meta !== undefined && { meta: data.meta }),
  });
};

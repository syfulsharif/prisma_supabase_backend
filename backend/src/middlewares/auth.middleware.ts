import { Request, Response, NextFunction } from 'express';
import { verifyToken, JwtPayload } from '../lib/jwt';
import { sendResponse } from '../lib/response';

export interface AuthRequest extends Request {
  user?: JwtPayload;
}

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    sendResponse(res, {
      statusCode: 401,
      success: false,
      message: 'Unauthorized access. No token provided.',
    });
    return;
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    sendResponse(res, {
      statusCode: 401,
      success: false,
      message: 'Invalid or expired token.',
    });
    return;
  }
};

export const authorize = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      sendResponse(res, {
        statusCode: 401,
        success: false,
        message: 'Unauthorized access.',
      });
      return;
    }

    if (!roles.includes(req.user.role)) {
      sendResponse(res, {
        statusCode: 403,
        success: false,
        message: 'Forbidden. You do not have permission to perform this action.',
      });
      return;
    }

    next();
  };
};

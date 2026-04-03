import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';
import { sendError } from '../utils/apiResponse.js';

export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization?.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return sendError(res, 'Not authenticated. Please log in.', 401);
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const admin = await Admin.findById(decoded.id).select('-password -refreshToken');

    if (!admin) {
      return sendError(res, 'Admin account not found.', 401);
    }

    if (!admin.isActive) {
      return sendError(res, 'Your account has been deactivated.', 403);
    }

    req.admin = admin;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return sendError(res, 'Session expired. Please log in again.', 401);
    }
    return sendError(res, 'Invalid token. Please log in again.', 401);
  }
};

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.admin.role)) {
      return sendError(res, `Role '${req.admin.role}' is not authorized for this action.`, 403);
    }
    next();
  };
};

import { supabase } from '../db/index.js';
import { STATUS_CODES, MESSAGES } from '../constants.js';

// Middleware to verify JWT token
export const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
    
    if (!token) {
      return res.status(STATUS_CODES.UNAUTHORIZED).json({
        success: false,
        message: 'Access token is required'
      });
    }
    
    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    if (error || !user) {
      return res.status(STATUS_CODES.UNAUTHORIZED).json({
        success: false,
        message: 'Invalid or expired token'
      });
    }
    
    req.user = user;
    next();
  } catch (error) {
    return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      success: false,
      error: error.message,
      message: MESSAGES.ERROR
    });
  }
};

// Middleware to check if user is admin (optional)
export const requireAdmin = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(STATUS_CODES.UNAUTHORIZED).json({
        success: false,
        message: MESSAGES.UNAUTHORIZED
      });
    }
    
    // Check if user has admin role (you can customize this based on your user structure)
    if (req.user.user_metadata?.role !== 'admin') {
      return res.status(STATUS_CODES.FORBIDDEN).json({
        success: false,
        message: 'Admin access required'
      });
    }
    
    next();
  } catch (error) {
    return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      success: false,
      error: error.message,
      message: MESSAGES.ERROR
    });
  }
};

import express from 'express';
import databaseService from '../utils/database.js';
import { STATUS_CODES, MESSAGES } from '../constants.js';

const router = express.Router();

// POST /api/auth/signup - Register a new user
router.post('/signup', async (req, res) => {
  try {
    const { email, password, ...userData } = req.body;
    
    if (!email || !password) {
      return res.status(STATUS_CODES.BAD_REQUEST).json({
        success: false,
        message: 'Email and password are required'
      });
    }
    
    const result = await databaseService.signUp(email, password, userData);
    
    res.status(STATUS_CODES.CREATED).json({
      success: true,
      data: {
        user: result.user,
        session: result.session
      },
      message: 'User registered successfully'
    });
  } catch (error) {
    res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      success: false,
      error: error.message,
      message: MESSAGES.ERROR
    });
  }
});

// POST /api/auth/signin - Sign in user
router.post('/signin', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(STATUS_CODES.BAD_REQUEST).json({
        success: false,
        message: 'Email and password are required'
      });
    }
    
    const result = await databaseService.signIn(email, password);
    
    res.status(STATUS_CODES.OK).json({
      success: true,
      data: {
        user: result.user,
        session: result.session
      },
      message: 'User signed in successfully'
    });
  } catch (error) {
    res.status(STATUS_CODES.UNAUTHORIZED).json({
      success: false,
      error: error.message,
      message: 'Invalid credentials'
    });
  }
});

// POST /api/auth/signout - Sign out user
router.post('/signout', async (req, res) => {
  try {
    await databaseService.signOut();
    
    res.status(STATUS_CODES.OK).json({
      success: true,
      message: 'User signed out successfully'
    });
  } catch (error) {
    res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      success: false,
      error: error.message,
      message: MESSAGES.ERROR
    });
  }
});

// GET /api/auth/user - Get current user
router.get('/user', async (req, res) => {
  try {
    const user = await databaseService.getCurrentUser();
    
    if (!user) {
      return res.status(STATUS_CODES.UNAUTHORIZED).json({
        success: false,
        message: MESSAGES.UNAUTHORIZED
      });
    }
    
    res.status(STATUS_CODES.OK).json({
      success: true,
      data: user,
      message: MESSAGES.SUCCESS
    });
  } catch (error) {
    res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      success: false,
      error: error.message,
      message: MESSAGES.ERROR
    });
  }
});

export default router;

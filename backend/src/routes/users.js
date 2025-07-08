import express from 'express';
import databaseService from '../utils/database.js';
import { TABLES, STATUS_CODES, MESSAGES } from '../constants.js';

const router = express.Router();

// GET /api/users - Get all users
router.get('/', async (req, res) => {
  try {
    const users = await databaseService.getAll(TABLES.USERS);
    res.status(STATUS_CODES.OK).json({
      success: true,
      data: users,
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

// GET /api/users/:id - Get user by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const user = await databaseService.getById(TABLES.USERS, id);
    
    if (!user) {
      return res.status(STATUS_CODES.NOT_FOUND).json({
        success: false,
        message: MESSAGES.NOT_FOUND
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

// POST /api/users - Create a new user
router.post('/', async (req, res) => {
  try {
    const userData = req.body;
    const newUser = await databaseService.create(TABLES.USERS, userData);
    
    res.status(STATUS_CODES.CREATED).json({
      success: true,
      data: newUser,
      message: 'User created successfully'
    });
  } catch (error) {
    res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      success: false,
      error: error.message,
      message: MESSAGES.ERROR
    });
  }
});

// PUT /api/users/:id - Update user
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    const updatedUser = await databaseService.update(TABLES.USERS, id, updateData);
    
    res.status(STATUS_CODES.OK).json({
      success: true,
      data: updatedUser,
      message: 'User updated successfully'
    });
  } catch (error) {
    res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      success: false,
      error: error.message,
      message: MESSAGES.ERROR
    });
  }
});

// DELETE /api/users/:id - Delete user
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await databaseService.delete(TABLES.USERS, id);
    
    res.status(STATUS_CODES.OK).json({
      success: true,
      message: 'User deleted successfully'
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

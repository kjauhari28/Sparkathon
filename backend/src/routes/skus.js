import express from 'express';
import SkuModel from '../models/SkuModel.js';
import { STATUS_CODES, MESSAGES } from '../constants.js';

const router = express.Router();

// GET /api/skus - Get all SKUs
router.get('/', async (req, res) => {
  try {
    const { limit, offset, search, shelf_life_max, shelf_life_min } = req.query;
    
    let options = {};
    
    if (limit) options.limit = parseInt(limit);
    if (offset) options.offset = parseInt(offset);
    
    let skus;
    
    if (search) {
      skus = await SkuModel.searchByName(search);
    } else if (shelf_life_min || shelf_life_max) {
      const minDays = shelf_life_min ? parseInt(shelf_life_min) : 0;
      const maxDays = shelf_life_max ? parseInt(shelf_life_max) : 999;
      skus = await SkuModel.findByShelfLifeRange(minDays, maxDays);
    } else {
      skus = await SkuModel.findAll(options);
    }
    
    res.status(STATUS_CODES.OK).json({
      success: true,
      data: skus,
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

// GET /api/skus/:id - Get SKU by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const sku = await SkuModel.findById(id);
    
    if (!sku) {
      return res.status(STATUS_CODES.NOT_FOUND).json({
        success: false,
        message: MESSAGES.NOT_FOUND
      });
    }
    
    res.status(STATUS_CODES.OK).json({
      success: true,
      data: sku,
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

// GET /api/skus/name/:name - Get SKU by name
router.get('/name/:name', async (req, res) => {
  try {
    const { name } = req.params;
    const sku = await SkuModel.findByName(name);
    
    if (!sku) {
      return res.status(STATUS_CODES.NOT_FOUND).json({
        success: false,
        message: MESSAGES.NOT_FOUND
      });
    }
    
    res.status(STATUS_CODES.OK).json({
      success: true,
      data: sku,
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

// GET /api/skus/short-shelf-life - Get SKUs with short shelf life
router.get('/filter/short-shelf-life', async (req, res) => {
  try {
    const { max_days = 7 } = req.query;
    const skus = await SkuModel.getShortShelfLifeSkus(parseInt(max_days));
    
    res.status(STATUS_CODES.OK).json({
      success: true,
      data: skus,
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

// POST /api/skus - Create a new SKU
router.post('/', async (req, res) => {
  try {
    const skuData = req.body;
    
    // Validate required fields
    if (!skuData.name) {
      return res.status(STATUS_CODES.BAD_REQUEST).json({
        success: false,
        message: 'Name is required'
      });
    }
    
    const newSku = await SkuModel.create(skuData);
    
    res.status(STATUS_CODES.CREATED).json({
      success: true,
      data: newSku,
      message: 'SKU created successfully'
    });
  } catch (error) {
    res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      success: false,
      error: error.message,
      message: MESSAGES.ERROR
    });
  }
});

// PUT /api/skus/:id - Update SKU
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    const updatedSku = await SkuModel.update(id, updateData);
    
    res.status(STATUS_CODES.OK).json({
      success: true,
      data: updatedSku,
      message: 'SKU updated successfully'
    });
  } catch (error) {
    res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      success: false,
      error: error.message,
      message: MESSAGES.ERROR
    });
  }
});

// DELETE /api/skus/:id - Delete SKU
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await SkuModel.delete(id);
    
    res.status(STATUS_CODES.OK).json({
      success: true,
      message: 'SKU deleted successfully'
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

import express from 'express';
import StoreSkuModel from '../models/StoreSkuModel.js';
import { STATUS_CODES, MESSAGES } from '../constants.js';

const router = express.Router();

// GET /api/store-skus - Get all store-sku relationships
router.get('/', async (req, res) => {
  try {
    const { limit, store_id, sku_id } = req.query;
    
    let options = {};
    
    if (limit) options.limit = parseInt(limit);
    
    if (store_id || sku_id) {
      options.filters = {};
      if (store_id) options.filters.store_id = store_id;
      if (sku_id) options.filters.sku_id = sku_id;
    }
    
    const storeSkus = await StoreSkuModel.findAll(options);
    
    res.status(STATUS_CODES.OK).json({
      success: true,
      data: storeSkus,
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

// GET /api/store-skus/store/:storeId - Get all SKUs for a specific store
router.get('/store/:store_id', async (req, res) => {
  try {
    const { store_id } = req.params;
    const skus = await StoreSkuModel.findSkusByStore(store_id);
    
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

// GET /api/store-skus/sku/:sku_id - Get all stores for a specific SKU
router.get('/sku/:sku_id', async (req, res) => {
  try {
    const { sku_id } = req.params;
    const stores = await StoreSkuModel.findStoresBySku(sku_id);
    
    res.status(STATUS_CODES.OK).json({
      success: true,
      data: stores,
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

// GET /api/store-skus/exists/:store_id/:sku_id - Check if relationship exists
router.get('/exists/:store_id/:sku_id', async (req, res) => {
  try {
    const { store_id, sku_id } = req.params;
    const exists = await StoreSkuModel.exists(store_id, sku_id);
    
    res.status(STATUS_CODES.OK).json({
      success: true,
      data: { exists },
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

// GET /api/store-skus/analytics/sku-count-by-store - Get SKU count per store
router.get('/analytics/sku-count-by-store', async (req, res) => {
  try {
    const skuCounts = await StoreSkuModel.getSkuCountByStore();
    
    res.status(STATUS_CODES.OK).json({
      success: true,
      data: skuCounts,
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

// POST /api/store-skus - Create a new store-sku relationship
router.post('/', async (req, res) => {
  try {
    const { store_id, sku_id } = req.body;
    
    // Validate required fields
    if (!store_id || !sku_id) {
      return res.status(STATUS_CODES.BAD_REQUEST).json({
        success: false,
        message: 'Store ID and SKU ID are required'
      });
    }
    
    // Check if relationship already exists
    const exists = await StoreSkuModel.exists(store_id, sku_id);
    if (exists) {
      return res.status(STATUS_CODES.BAD_REQUEST).json({
        success: false,
        message: 'Store-SKU relationship already exists'
      });
    }
    
    const newRelationship = await StoreSkuModel.create(store_id, sku_id);
    
    res.status(STATUS_CODES.CREATED).json({
      success: true,
      data: newRelationship,
      message: 'Store-SKU relationship created successfully'
    });
  } catch (error) {
    res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      success: false,
      error: error.message,
      message: MESSAGES.ERROR
    });
  }
});

// POST /api/store-skus/batch - Create multiple store-sku relationships
router.post('/batch', async (req, res) => {
  try {
    const { relationships } = req.body;
    
    if (!Array.isArray(relationships) || relationships.length === 0) {
      return res.status(STATUS_CODES.BAD_REQUEST).json({
        success: false,
        message: 'Relationships array is required'
      });
    }
    
    // Validate each relationship
    for (const rel of relationships) {
      if (!rel.store_id || !rel.sku_id) {
        return res.status(STATUS_CODES.BAD_REQUEST).json({
          success: false,
          message: 'Each relationship must have store_id and sku_id'
        });
      }
    }
    
    const newRelationships = await StoreSkuModel.createMany(relationships);
    
    res.status(STATUS_CODES.CREATED).json({
      success: true,
      data: newRelationships,
      message: `${newRelationships.length} store-SKU relationships created successfully`
    });
  } catch (error) {
    res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      success: false,
      error: error.message,
      message: MESSAGES.ERROR
    });
  }
});

// DELETE /api/store-skus/:store_id/:sku_id - Delete store-sku relationship
router.delete('/:store_id/:sku_id', async (req, res) => {
  try {
    const { store_id, sku_id } = req.params;
    
    await StoreSkuModel.delete(store_id, sku_id);
    
    res.status(STATUS_CODES.OK).json({
      success: true,
      message: 'Store-SKU relationship deleted successfully'
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

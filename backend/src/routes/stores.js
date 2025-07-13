import express from 'express';
import StoreModel from '../models/StoreModel.js';
import { STATUS_CODES, MESSAGES } from '../constants.js';

const router = express.Router();

// GET /api/stores - Get all stores
router.get('/', async (req, res) => {
  try {
    const { limit, offset, geo, religion, search } = req.query;
    
    let options = {};
    
    if (limit) options.limit = parseInt(limit);
    if (offset) options.offset = parseInt(offset);
    
    let stores;
    
    if (geo) {
      stores = await StoreModel.findByGeo(geo);
    } else if (religion) {
      stores = await StoreModel.findByReligion(religion);
    } else if (search) {
      stores = await StoreModel.searchByGeo(search);
    } else {
      stores = await StoreModel.findAll(options);
    }
    
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

// GET /api/stores/:store_id - Get store by ID
router.get('/:store_id', async (req, res) => {
  try {
    const { store_id } = req.params;
    const store = await StoreModel.findById(store_id);
    
    if (!store) {
      return res.status(STATUS_CODES.NOT_FOUND).json({
        success: false,
        message: MESSAGES.NOT_FOUND
      });
    }
    
    res.status(STATUS_CODES.OK).json({
      success: true,
      data: store,
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

// GET /api/stores/geo/unique - Get unique geographical locations
router.get('/geo/unique', async (req, res) => {
  try {
    const geoLocations = await StoreModel.getUniqueGeoLocations();
    
    res.status(STATUS_CODES.OK).json({
      success: true,
      data: geoLocations,
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

// GET /api/stores/religion/unique - Get unique religions
router.get('/religion/unique', async (req, res) => {
  try {
    const religions = await StoreModel.getUniqueReligions();
    
    res.status(STATUS_CODES.OK).json({
      success: true,
      data: religions,
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

// GET /api/stores/filter/geo/:geo - Get stores by geo
router.get('/filter/geo/:geo', async (req, res) => {
  try {
    const { geo } = req.params;
    const stores = await StoreModel.findByGeo(geo);
    
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

// GET /api/stores/filter/religion/:religion - Get stores by religion
router.get('/filter/religion/:religion', async (req, res) => {
  try {
    const { religion } = req.params;
    const stores = await StoreModel.findByReligion(religion);
    
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

// POST /api/stores - Create a new store
router.post('/', async (req, res) => {
  try {
    const storeData = req.body;
    // Validate required fields
    const { store_id, geo, religion } = storeData;
    if (!store_id || !geo) {
      return res.status(STATUS_CODES.BAD_REQUEST).json({
        success: false,
        message: 'store_id and geo are required'
      });
    }
    const newStore = await StoreModel.create({ store_id, geo, religion });
    
    res.status(STATUS_CODES.CREATED).json({
      success: true,
      data: newStore,
      message: 'Store created successfully'
    });
  } catch (error) {
    res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      success: false,
      error: error.message,
      message: MESSAGES.ERROR
    });
  }
});

// PUT /api/stores/:store_id - Update store
router.put('/:store_id', async (req, res) => {
  try {
    const { store_id } = req.params;
    const updateData = req.body;
    const updatedStore = await StoreModel.update(store_id, updateData);
    
    res.status(STATUS_CODES.OK).json({
      success: true,
      data: updatedStore,
      message: 'Store updated successfully'
    });
  } catch (error) {
    res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      success: false,
      error: error.message,
      message: MESSAGES.ERROR
    });
  }
});

// DELETE /api/stores/:store_id - Delete store
router.delete('/:store_id', async (req, res) => {
  try {
    const { store_id } = req.params;
    await StoreModel.delete(store_id);
    
    res.status(STATUS_CODES.OK).json({
      success: true,
      message: 'Store deleted successfully'
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

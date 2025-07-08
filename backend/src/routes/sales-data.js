import express from 'express';
import SalesDataModel from '../models/SalesDataModel.js';
import { STATUS_CODES, MESSAGES } from '../constants.js';

const router = express.Router();

// GET /api/sales-data - Get all sales data with filtering
router.get('/', async (req, res) => {
  try {
    const { 
      limit, 
      offset, 
      store_id, 
      sku_id, 
      year, 
      type_of_day,
      start_date,
      end_date
    } = req.query;
    
    let options = {};
    
    if (limit) options.limit = parseInt(limit);
    if (offset) options.offset = parseInt(offset);
    
    if (store_id || sku_id || year || type_of_day) {
      options.filters = {};
      if (store_id) options.filters.store_id = store_id;
      if (sku_id) options.filters.sku_id = sku_id;
      if (year) options.filters.year = parseInt(year);
      if (type_of_day) options.filters.type_of_day = type_of_day;
    }
    
    let salesData;
    
    if (start_date && end_date) {
      const filterOptions = {
        storeId: store_id,
        skuId: sku_id,
        typeOfDay: type_of_day,
        limit: options.limit
      };
      salesData = await SalesDataModel.findByDateRange(start_date, end_date, filterOptions);
    } else {
      salesData = await SalesDataModel.findAll(options);
    }
    
    res.status(STATUS_CODES.OK).json({
      success: true,
      data: salesData,
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

// GET /api/sales-data/:storeId/:skuId/:year/:day - Get specific sales data by primary key
router.get('/:storeId/:skuId/:year/:day', async (req, res) => {
  try {
    const { storeId, skuId, year, day } = req.params;
    
    const salesData = await SalesDataModel.findByPrimaryKey(
      storeId, 
      skuId, 
      parseInt(year), 
      parseInt(day)
    );
    
    if (!salesData) {
      return res.status(STATUS_CODES.NOT_FOUND).json({
        success: false,
        message: MESSAGES.NOT_FOUND
      });
    }
    
    res.status(STATUS_CODES.OK).json({
      success: true,
      data: salesData,
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

// GET /api/sales-data/store/:storeId - Get sales data for a specific store
router.get('/store/:storeId', async (req, res) => {
  try {
    const { storeId } = req.params;
    const { year, start_date, end_date, limit } = req.query;
    
    let options = {};
    
    if (year) options.year = parseInt(year);
    if (start_date && end_date) {
      options.dateRange = { start: start_date, end: end_date };
    }
    if (limit) options.limit = parseInt(limit);
    
    const salesData = await SalesDataModel.findByStore(storeId, options);
    
    res.status(STATUS_CODES.OK).json({
      success: true,
      data: salesData,
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

// GET /api/sales-data/sku/:skuId - Get sales data for a specific SKU
router.get('/sku/:skuId', async (req, res) => {
  try {
    const { skuId } = req.params;
    const { year, start_date, end_date, limit } = req.query;
    
    let options = {};
    
    if (year) options.year = parseInt(year);
    if (start_date && end_date) {
      options.dateRange = { start: start_date, end: end_date };
    }
    if (limit) options.limit = parseInt(limit);
    
    const salesData = await SalesDataModel.findBySku(skuId, options);
    
    res.status(STATUS_CODES.OK).json({
      success: true,
      data: salesData,
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

// GET /api/sales-data/type-of-day/:typeOfDay - Get sales data by type of day
router.get('/type-of-day/:typeOfDay', async (req, res) => {
  try {
    const { typeOfDay } = req.params;
    const { year, store_id, limit } = req.query;
    
    let options = {};
    
    if (year) options.year = parseInt(year);
    if (store_id) options.storeId = store_id;
    if (limit) options.limit = parseInt(limit);
    
    const salesData = await SalesDataModel.findByTypeOfDay(typeOfDay, options);
    
    res.status(STATUS_CODES.OK).json({
      success: true,
      data: salesData,
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

// GET /api/sales-data/analytics/store/:storeId - Get analytics for a specific store
router.get('/analytics/store/:storeId', async (req, res) => {
  try {
    const { storeId } = req.params;
    const { year, start_date, end_date } = req.query;
    
    let options = {};
    
    if (year) options.year = parseInt(year);
    if (start_date && end_date) {
      options.dateRange = { start: start_date, end: end_date };
    }
    
    const analytics = await SalesDataModel.getStoreAnalytics(storeId, options);
    
    res.status(STATUS_CODES.OK).json({
      success: true,
      data: analytics,
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

// POST /api/sales-data - Create new sales data
router.post('/', async (req, res) => {
  try {
    const salesData = req.body;
    
    // Validate required fields
    const requiredFields = ['store_id', 'sku_id', 'year', 'day', 'date'];
    for (const field of requiredFields) {
      if (!salesData[field]) {
        return res.status(STATUS_CODES.BAD_REQUEST).json({
          success: false,
          message: `${field} is required`
        });
      }
    }
    
    // Convert numeric fields
    salesData.year = parseInt(salesData.year);
    salesData.day = parseInt(salesData.day);
    
    // Convert numeric fields to integers (default to 0 if not provided)
    const numericFields = ['initial', 'sold', 'returns', 'donations', 'reroutes_in', 'reroutes_out', 'recycled', 'final'];
    numericFields.forEach(field => {
      salesData[field] = parseInt(salesData[field]) || 0;
    });
    
    const newSalesData = await SalesDataModel.create(salesData);
    
    res.status(STATUS_CODES.CREATED).json({
      success: true,
      data: newSalesData,
      message: 'Sales data created successfully'
    });
  } catch (error) {
    res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      success: false,
      error: error.message,
      message: MESSAGES.ERROR
    });
  }
});

// POST /api/sales-data/batch - Create multiple sales data records
router.post('/batch', async (req, res) => {
  try {
    const { salesDataArray } = req.body;
    
    if (!Array.isArray(salesDataArray) || salesDataArray.length === 0) {
      return res.status(STATUS_CODES.BAD_REQUEST).json({
        success: false,
        message: 'salesDataArray is required'
      });
    }
    
    // Validate and process each record
    const processedData = salesDataArray.map(data => {
      // Validate required fields
      const requiredFields = ['store_id', 'sku_id', 'year', 'day', 'date'];
      for (const field of requiredFields) {
        if (!data[field]) {
          throw new Error(`${field} is required for all records`);
        }
      }
      
      // Convert numeric fields
      data.year = parseInt(data.year);
      data.day = parseInt(data.day);
      
      // Convert numeric fields to integers (default to 0 if not provided)
      const numericFields = ['initial', 'sold', 'returns', 'donations', 'reroutes_in', 'reroutes_out', 'recycled', 'final'];
      numericFields.forEach(field => {
        data[field] = parseInt(data[field]) || 0;
      });
      
      return data;
    });
    
    const newSalesData = await SalesDataModel.createMany(processedData);
    
    res.status(STATUS_CODES.CREATED).json({
      success: true,
      data: newSalesData,
      message: `${newSalesData.length} sales data records created successfully`
    });
  } catch (error) {
    res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      success: false,
      error: error.message,
      message: MESSAGES.ERROR
    });
  }
});

// PUT /api/sales-data/:storeId/:skuId/:year/:day - Update sales data
router.put('/:storeId/:skuId/:year/:day', async (req, res) => {
  try {
    const { storeId, skuId, year, day } = req.params;
    const updateData = req.body;
    
    // Convert numeric fields if they exist
    const numericFields = ['initial', 'sold', 'returns', 'donations', 'reroutes_in', 'reroutes_out', 'recycled', 'final'];
    numericFields.forEach(field => {
      if (updateData[field] !== undefined) {
        updateData[field] = parseInt(updateData[field]) || 0;
      }
    });
    
    const updatedSalesData = await SalesDataModel.update(
      storeId, 
      skuId, 
      parseInt(year), 
      parseInt(day), 
      updateData
    );
    
    res.status(STATUS_CODES.OK).json({
      success: true,
      data: updatedSalesData,
      message: 'Sales data updated successfully'
    });
  } catch (error) {
    res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      success: false,
      error: error.message,
      message: MESSAGES.ERROR
    });
  }
});

// DELETE /api/sales-data/:storeId/:skuId/:year/:day - Delete sales data
router.delete('/:storeId/:skuId/:year/:day', async (req, res) => {
  try {
    const { storeId, skuId, year, day } = req.params;
    
    await SalesDataModel.delete(storeId, skuId, parseInt(year), parseInt(day));
    
    res.status(STATUS_CODES.OK).json({
      success: true,
      message: 'Sales data deleted successfully'
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

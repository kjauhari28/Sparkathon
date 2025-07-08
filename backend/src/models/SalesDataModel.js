import { supabase } from '../db/index.js';

export class SalesDataModel {
  constructor() {
    this.tableName = 'sales_data';
    this.supabase = supabase;
  }

  // Get all sales data with optional filtering
  async findAll(options = {}) {
    try {
      let query = this.supabase.from(this.tableName).select(`
        *,
        stores!inner(*),
        skus!inner(*)
      `);
      
      if (options.filters) {
        Object.entries(options.filters).forEach(([key, value]) => {
          if (Array.isArray(value)) {
            query = query.in(key, value);
          } else {
            query = query.eq(key, value);
          }
        });
      }
      
      if (options.orderBy) {
        query = query.order(options.orderBy.column, { 
          ascending: options.orderBy.ascending ?? true 
        });
      } else {
        query = query.order('date', { ascending: false });
      }
      
      if (options.limit) {
        query = query.limit(options.limit);
      }
      
      if (options.offset) {
        query = query.range(options.offset, options.offset + (options.limit || 10) - 1);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error in SalesDataModel.findAll:', error);
      throw error;
    }
  }

  // Find by composite primary key (store_id, sku_id, year, day)
  async findByPrimaryKey(storeId, skuId, year, day) {
    try {
      const { data, error } = await this.supabase
        .from(this.tableName)
        .select(`
          *,
          stores!inner(*),
          skus!inner(*)
        `)
        .eq('store_id', storeId)
        .eq('sku_id', skuId)
        .eq('year', year)
        .eq('day', day)
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error in SalesDataModel.findByPrimaryKey:', error);
      throw error;
    }
  }

  // Get sales data for a specific store
  async findByStore(storeId, options = {}) {
    try {
      let query = this.supabase
        .from(this.tableName)
        .select(`
          *,
          stores!inner(*),
          skus!inner(*)
        `)
        .eq('store_id', storeId);
      
      if (options.year) {
        query = query.eq('year', options.year);
      }
      
      if (options.dateRange) {
        query = query.gte('date', options.dateRange.start)
                    .lte('date', options.dateRange.end);
      }
      
      query = query.order('date', { ascending: false });
      
      if (options.limit) {
        query = query.limit(options.limit);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error in SalesDataModel.findByStore:', error);
      throw error;
    }
  }

  // Get sales data for a specific SKU
  async findBySku(skuId, options = {}) {
    try {
      let query = this.supabase
        .from(this.tableName)
        .select(`
          *,
          stores!inner(*),
          skus!inner(*)
        `)
        .eq('sku_id', skuId);
      
      if (options.year) {
        query = query.eq('year', options.year);
      }
      
      if (options.dateRange) {
        query = query.gte('date', options.dateRange.start)
                    .lte('date', options.dateRange.end);
      }
      
      query = query.order('date', { ascending: false });
      
      if (options.limit) {
        query = query.limit(options.limit);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error in SalesDataModel.findBySku:', error);
      throw error;
    }
  }

  // Get sales data by date range
  async findByDateRange(startDate, endDate, options = {}) {
    try {
      let query = this.supabase
        .from(this.tableName)
        .select(`
          *,
          stores!inner(*),
          skus!inner(*)
        `)
        .gte('date', startDate)
        .lte('date', endDate);
      
      if (options.storeId) {
        query = query.eq('store_id', options.storeId);
      }
      
      if (options.skuId) {
        query = query.eq('sku_id', options.skuId);
      }
      
      if (options.typeOfDay) {
        query = query.eq('type_of_day', options.typeOfDay);
      }
      
      query = query.order('date', { ascending: false });
      
      if (options.limit) {
        query = query.limit(options.limit);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error in SalesDataModel.findByDateRange:', error);
      throw error;
    }
  }

  // Create new sales data record
  async create(salesData) {
    try {
      const { data, error } = await this.supabase
        .from(this.tableName)
        .insert([salesData])
        .select(`
          *,
          stores!inner(*),
          skus!inner(*)
        `)
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error in SalesDataModel.create:', error);
      throw error;
    }
  }

  // Update sales data by composite primary key
  async update(storeId, skuId, year, day, updateData) {
    try {
      const { data, error } = await this.supabase
        .from(this.tableName)
        .update(updateData)
        .eq('store_id', storeId)
        .eq('sku_id', skuId)
        .eq('year', year)
        .eq('day', day)
        .select(`
          *,
          stores!inner(*),
          skus!inner(*)
        `)
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error in SalesDataModel.update:', error);
      throw error;
    }
  }

  // Delete sales data by composite primary key
  async delete(storeId, skuId, year, day) {
    try {
      const { error } = await this.supabase
        .from(this.tableName)
        .delete()
        .eq('store_id', storeId)
        .eq('sku_id', skuId)
        .eq('year', year)
        .eq('day', day);
      
      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Error in SalesDataModel.delete:', error);
      throw error;
    }
  }

  // Batch create sales data
  async createMany(salesDataArray) {
    try {
      const { data, error } = await this.supabase
        .from(this.tableName)
        .insert(salesDataArray)
        .select();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error in SalesDataModel.createMany:', error);
      throw error;
    }
  }

  // Get sales analytics for a store
  async getStoreAnalytics(storeId, options = {}) {
    try {
      let query = this.supabase
        .from(this.tableName)
        .select('*')
        .eq('store_id', storeId);
      
      if (options.year) {
        query = query.eq('year', options.year);
      }
      
      if (options.dateRange) {
        query = query.gte('date', options.dateRange.start)
                    .lte('date', options.dateRange.end);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      // Calculate analytics
      const analytics = {
        total_initial: data.reduce((sum, item) => sum + (item.initial || 0), 0),
        total_sold: data.reduce((sum, item) => sum + (item.sold || 0), 0),
        total_returns: data.reduce((sum, item) => sum + (item.returns || 0), 0),
        total_donations: data.reduce((sum, item) => sum + (item.donations || 0), 0),
        total_recycled: data.reduce((sum, item) => sum + (item.recycled || 0), 0),
        total_final: data.reduce((sum, item) => sum + (item.final || 0), 0),
        record_count: data.length,
        date_range: {
          start: data.length > 0 ? Math.min(...data.map(item => new Date(item.date))) : null,
          end: data.length > 0 ? Math.max(...data.map(item => new Date(item.date))) : null
        }
      };
      
      return analytics;
    } catch (error) {
      console.error('Error in SalesDataModel.getStoreAnalytics:', error);
      throw error;
    }
  }

  // Get sales data by type of day
  async findByTypeOfDay(typeOfDay, options = {}) {
    try {
      let query = this.supabase
        .from(this.tableName)
        .select(`
          *,
          stores!inner(*),
          skus!inner(*)
        `)
        .eq('type_of_day', typeOfDay);
      
      if (options.year) {
        query = query.eq('year', options.year);
      }
      
      if (options.storeId) {
        query = query.eq('store_id', options.storeId);
      }
      
      query = query.order('date', { ascending: false });
      
      if (options.limit) {
        query = query.limit(options.limit);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error in SalesDataModel.findByTypeOfDay:', error);
      throw error;
    }
  }
}

export default new SalesDataModel();

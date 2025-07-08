import { supabase } from '../db/index.js';

export class StoreSkuModel {
  constructor() {
    this.tableName = 'store_skus';
    this.supabase = supabase;
  }

  // Get all store-sku relationships
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
      
      if (options.limit) {
        query = query.limit(options.limit);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error in StoreSkuModel.findAll:', error);
      throw error;
    }
  }

  // Find all SKUs for a specific store
  async findSkusByStore(storeId) {
    try {
      const { data, error } = await this.supabase
        .from(this.tableName)
        .select(`
          *,
          skus!inner(*)
        `)
        .eq('store_id', storeId);
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error in StoreSkuModel.findSkusByStore:', error);
      throw error;
    }
  }

  // Find all stores for a specific SKU
  async findStoresBySku(skuId) {
    try {
      const { data, error } = await this.supabase
        .from(this.tableName)
        .select(`
          *,
          stores!inner(*)
        `)
        .eq('sku_id', skuId);
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error in StoreSkuModel.findStoresBySku:', error);
      throw error;
    }
  }

  // Check if a store-sku relationship exists
  async exists(storeId, skuId) {
    try {
      const { data, error } = await this.supabase
        .from(this.tableName)
        .select('*')
        .eq('store_id', storeId)
        .eq('sku_id', skuId)
        .single();
      
      if (error && error.code !== 'PGRST116') throw error;
      return !!data;
    } catch (error) {
      console.error('Error in StoreSkuModel.exists:', error);
      throw error;
    }
  }

  // Create a new store-sku relationship
  async create(storeId, skuId) {
    try {
      const { data, error } = await this.supabase
        .from(this.tableName)
        .insert([{ store_id: storeId, sku_id: skuId }])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error in StoreSkuModel.create:', error);
      throw error;
    }
  }

  // Delete a store-sku relationship
  async delete(storeId, skuId) {
    try {
      const { error } = await this.supabase
        .from(this.tableName)
        .delete()
        .eq('store_id', storeId)
        .eq('sku_id', skuId);
      
      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Error in StoreSkuModel.delete:', error);
      throw error;
    }
  }

  // Batch create store-sku relationships
  async createMany(relationships) {
    try {
      const { data, error } = await this.supabase
        .from(this.tableName)
        .insert(relationships)
        .select();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error in StoreSkuModel.createMany:', error);
      throw error;
    }
  }

  // Get count of SKUs per store
  async getSkuCountByStore() {
    try {
      const { data, error } = await this.supabase
        .from(this.tableName)
        .select(`
          store_id,
          stores!inner(geo, religion)
        `);
      
      if (error) throw error;
      
      // Group by store and count SKUs
      const skuCounts = data.reduce((acc, item) => {
        const storeId = item.store_id;
        if (!acc[storeId]) {
          acc[storeId] = {
            store_id: storeId,
            store_info: item.stores,
            sku_count: 0
          };
        }
        acc[storeId].sku_count++;
        return acc;
      }, {});
      
      return Object.values(skuCounts);
    } catch (error) {
      console.error('Error in StoreSkuModel.getSkuCountByStore:', error);
      throw error;
    }
  }
}

export default new StoreSkuModel();

import BaseModel from './BaseModel.js';

export class SkuModel extends BaseModel {
  constructor() {
    // Table name remains 'skus'
    super('skus');
  }

  // Find SKU by name
  async findByName(name) {
    try {
      const { data, error } = await this.supabase
        .from(this.tableName)
        .select('*')
        .eq('name', name)
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error in SkuModel.findByName:', error);
      throw error;
    }
  }

  // Find SKUs by shelf life range
  async findByShelfLifeRange(minDays, maxDays) {
    try {
      const { data, error } = await this.supabase
        .from(this.tableName)
        .select('*')
        .gte('shelf_life_days', minDays)
        .lte('shelf_life_days', maxDays)
        .order('shelf_life_days');
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error in SkuModel.findByShelfLifeRange:', error);
      throw error;
    }
  }

  // Get SKUs with short shelf life (e.g., less than 7 days)
  async getShortShelfLifeSkus(maxDays = 7) {
    try {
      const { data, error } = await this.supabase
        .from(this.tableName)
        .select('*')
        .lte('shelf_life_days', maxDays)
        .order('shelf_life_days');
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error in SkuModel.getShortShelfLifeSkus:', error);
      throw error;
    }
  }

  // Search SKUs by name pattern
  async searchByName(searchTerm) {
    try {
      const { data, error } = await this.supabase
        .from(this.tableName)
        .select('*')
        .ilike('name', `%${searchTerm}%`)
        .order('name');
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error in SkuModel.searchByName:', error);
      throw error;
    }
  }
}

// CRUD overrides to handle string primary key and updated columns
export default new (class extends SkuModel {
  // Override findById to use sku_id and return null if not found
  async findById(skuId) {
    try {
      const { data, error } = await this.supabase
        .from(this.tableName)
        .select('*')
        .eq('sku_id', skuId)
        .single();
      if (error) {
        // No matching row returns PGRST116
        if (error.code === 'PGRST116' || error.status === 406) return null;
        console.error('Supabase error in SkuModel.findById:', error);
        throw error;
      }
      return data;
    } catch (err) {
      console.error('Error in SkuModel.findById method:', err);
      // If Supabase returns invalid JSON (e.g., syntax error), treat as not found
      if (err instanceof SyntaxError || (err.message && err.message.includes('Expected'))) {
        return null;
      }
      throw err;
    }
  }
  // Create new SKU with text primary key
  async create({ sku_id, name, shelf_life_days }) {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .insert([{ sku_id, name, shelf_life_days }])
      .select()
      .single();
    if (error) throw error;
    return data;
  }
  // Update existing SKU by sku_id
  async update(skuId, updateData) {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .update(updateData)
      .eq('sku_id', skuId)
      .select()
      .single();
    if (error) throw error;
    return data;
  }
  // Delete SKU by sku_id
  async delete(skuId) {
    const { error } = await this.supabase
      .from(this.tableName)
      .delete()
      .eq('sku_id', skuId);
    if (error) throw error;
    return true;
  }
})();

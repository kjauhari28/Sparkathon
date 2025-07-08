import BaseModel from './BaseModel.js';

export class SkuModel extends BaseModel {
  constructor() {
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
        .gte('shelf_life', minDays)
        .lte('shelf_life', maxDays)
        .order('shelf_life');
      
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
        .lte('shelf_life', maxDays)
        .order('shelf_life');
      
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

export default new SkuModel();

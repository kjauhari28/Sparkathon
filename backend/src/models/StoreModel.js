import BaseModel from './BaseModel.js';

export class StoreModel extends BaseModel {
  constructor() {
    super('stores');
  }

  // Find stores by geographical location
  async findByGeo(geo) {
    try {
      const { data, error } = await this.supabase
        .from(this.tableName)
        .select('*')
        .eq('geo', geo)
        .order('created_at');
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error in StoreModel.findByGeo:', error);
      throw error;
    }
  }

  // Find stores by religion
  async findByReligion(religion) {
    try {
      const { data, error } = await this.supabase
        .from(this.tableName)
        .select('*')
        .eq('religion', religion)
        .order('geo');
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error in StoreModel.findByReligion:', error);
      throw error;
    }
  }

  // Get unique geographical locations
  async getUniqueGeoLocations() {
    try {
      const { data, error } = await this.supabase
        .from(this.tableName)
        .select('geo')
        .order('geo');
      
      if (error) throw error;
      
      // Extract unique geo locations
      const uniqueGeos = [...new Set(data.map(item => item.geo))];
      return uniqueGeos;
    } catch (error) {
      console.error('Error in StoreModel.getUniqueGeoLocations:', error);
      throw error;
    }
  }

  // Get unique religions
  async getUniqueReligions() {
    try {
      const { data, error } = await this.supabase
        .from(this.tableName)
        .select('religion')
        .not('religion', 'is', null)
        .order('religion');
      
      if (error) throw error;
      
      // Extract unique religions
      const uniqueReligions = [...new Set(data.map(item => item.religion))];
      return uniqueReligions;
    } catch (error) {
      console.error('Error in StoreModel.getUniqueReligions:', error);
      throw error;
    }
  }

  // Search stores by geo pattern
  async searchByGeo(searchTerm) {
    try {
      const { data, error } = await this.supabase
        .from(this.tableName)
        .select('*')
        .ilike('geo', `%${searchTerm}%`)
        .order('geo');
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error in StoreModel.searchByGeo:', error);
      throw error;
    }
  }
}

// Override CRUD to handle string primary key "store_id"
export default new (class extends StoreModel {
  // Override findById to use store_id
  async findById(storeId) {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select('*')
      .eq('store_id', storeId)
      .single();
    if (error) throw error;
    return data;
  }
  // Create new store with text primary key
  async create({ store_id, geo, religion }) {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .insert([{ store_id, geo, religion }])
      .select()
      .single();
    if (error) throw error;
    return data;
  }
  // Update existing store by store_id
  async update(storeId, updateData) {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .update(updateData)
      .eq('store_id', storeId)
      .select()
      .single();
    if (error) throw error;
    return data;
  }
  // Delete store by store_id
  async delete(storeId) {
    const { error } = await this.supabase
      .from(this.tableName)
      .delete()
      .eq('store_id', storeId);
    if (error) throw error;
    return true;
  }
})();

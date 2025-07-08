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

export default new StoreModel();

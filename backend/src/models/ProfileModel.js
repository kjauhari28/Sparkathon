import BaseModel from './BaseModel.js';

export class ProfileModel extends BaseModel {
  constructor() {
    super('profiles');
  }

  async findByEmail(email) {
    try {
      const { data, error } = await this.supabase
        .from(this.tableName)
        .select('*')
        .eq('email', email)
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error in ProfileModel.findByEmail:', error);
      throw error;
    }
  }

  async findByUsername(username) {
    try {
      const { data, error } = await this.supabase
        .from(this.tableName)
        .select('*')
        .eq('username', username)
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error in ProfileModel.findByUsername:', error);
      throw error;
    }
  }

  async updateProfile(userId, profileData) {
    try {
      const { data, error } = await this.supabase
        .from(this.tableName)
        .update(profileData)
        .eq('id', userId)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error in ProfileModel.updateProfile:', error);
      throw error;
    }
  }

  async getActiveProfiles() {
    return this.findAll({
      filters: { is_active: true },
      orderBy: { column: 'created_at', ascending: false }
    });
  }
}

export default new ProfileModel();

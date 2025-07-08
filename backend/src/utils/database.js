import { supabase, supabaseAdmin } from '../db/index.js';
import { TABLES } from '../constants.js';

class DatabaseService {
  constructor() {
    this.supabase = supabase;
    this.supabaseAdmin = supabaseAdmin;
  }

  // Generic method to get all records from a table
  async getAll(table, options = {}) {
    try {
      let query = this.supabase.from(table).select('*');
      
      // Apply filters if provided
      if (options.filters) {
        Object.entries(options.filters).forEach(([key, value]) => {
          query = query.eq(key, value);
        });
      }
      
      // Apply ordering if provided
      if (options.orderBy) {
        query = query.order(options.orderBy.column, { 
          ascending: options.orderBy.ascending || false 
        });
      }
      
      // Apply pagination if provided
      if (options.limit) {
        query = query.limit(options.limit);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error(`Error getting all from ${table}:`, error);
      throw error;
    }
  }

  // Generic method to get a single record by ID
  async getById(table, id) {
    try {
      const { data, error } = await this.supabase
        .from(table)
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error(`Error getting record from ${table}:`, error);
      throw error;
    }
  }

  // Generic method to create a new record
  async create(table, data) {
    try {
      const { data: result, error } = await this.supabase
        .from(table)
        .insert([data])
        .select()
        .single();
      
      if (error) throw error;
      return result;
    } catch (error) {
      console.error(`Error creating record in ${table}:`, error);
      throw error;
    }
  }

  // Generic method to update a record
  async update(table, id, data) {
    try {
      const { data: result, error } = await this.supabase
        .from(table)
        .update(data)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return result;
    } catch (error) {
      console.error(`Error updating record in ${table}:`, error);
      throw error;
    }
  }

  // Generic method to delete a record
  async delete(table, id) {
    try {
      const { error } = await this.supabase
        .from(table)
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error(`Error deleting record from ${table}:`, error);
      throw error;
    }
  }

  // Authentication methods
  async signUp(email, password, userData = {}) {
    try {
      const { data, error } = await this.supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData
        }
      });
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error signing up:', error);
      throw error;
    }
  }

  async signIn(email, password) {
    try {
      const { data, error } = await this.supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error signing in:', error);
      throw error;
    }
  }

  async signOut() {
    try {
      const { error } = await this.supabase.auth.signOut();
      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  }

  async getCurrentUser() {
    try {
      const { data: { user }, error } = await this.supabase.auth.getUser();
      if (error) throw error;
      return user;
    } catch (error) {
      console.error('Error getting current user:', error);
      throw error;
    }
  }
}

export default new DatabaseService();

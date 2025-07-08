// Use service role client for server-side operations to bypass RLS
import { supabaseAdmin as supabase } from '../db/index.js';

export class BaseModel {
  constructor(tableName) {
    this.tableName = tableName;
    this.supabase = supabase;
  }

  // Get all records with optional filtering and pagination
  async findAll(options = {}) {
    try {
      let query = this.supabase.from(this.tableName).select('*');
      
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
      console.error(`Error in ${this.tableName}.findAll:`, error);
      throw error;
    }
  }

  // Find by ID (for single primary key tables)
  async findById(id) {
    try {
      const { data, error } = await this.supabase
        .from(this.tableName)
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error(`Error in ${this.tableName}.findById:`, error);
      throw error;
    }
  }

  // Create new record
  async create(data) {
    try {
      const { data: result, error } = await this.supabase
        .from(this.tableName)
        .insert([data])
        .select()
        .single();
      
      if (error) throw error;
      return result;
    } catch (error) {
      console.error(`Error in ${this.tableName}.create:`, error);
      throw error;
    }
  }

  // Update record by ID
  async update(id, data) {
    try {
      const { data: result, error } = await this.supabase
        .from(this.tableName)
        .update(data)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return result;
    } catch (error) {
      console.error(`Error in ${this.tableName}.update:`, error);
      throw error;
    }
  }

  // Delete record by ID
  async delete(id) {
    try {
      const { error } = await this.supabase
        .from(this.tableName)
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error(`Error in ${this.tableName}.delete:`, error);
      throw error;
    }
  }

  // Count records with optional filters
  async count(filters = {}) {
    try {
      let query = this.supabase
        .from(this.tableName)
        .select('*', { count: 'exact', head: true });
      
      Object.entries(filters).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          query = query.in(key, value);
        } else {
          query = query.eq(key, value);
        }
      });
      
      const { count, error } = await query;
      
      if (error) throw error;
      return count;
    } catch (error) {
      console.error(`Error in ${this.tableName}.count:`, error);
      throw error;
    }
  }

  // Batch insert
  async createMany(dataArray) {
    try {
      const { data, error } = await this.supabase
        .from(this.tableName)
        .insert(dataArray)
        .select();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error(`Error in ${this.tableName}.createMany:`, error);
      throw error;
    }
  }
}

export default BaseModel;

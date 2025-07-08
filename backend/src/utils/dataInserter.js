// Use public supabase client for writes (RLS is disabled by default)
import { supabase } from '../db/index.js';
// Debug: verify environment and client
console.log('🔧 [DataInserter] SUPABASE_URL:', process.env.SUPABASE_URL);
console.log('🔧 [DataInserter] SERVICE_ROLE_KEY loaded:', !!process.env.SUPABASE_SERVICE_ROLE_KEY);

class DataInserter {
  constructor() {
    this.supabase = supabase;
  }

  // Add a single SKU
  async addSku(name, shelfLife) {
    try {
      const { data, error } = await this.supabase
        .from('skus')
        .insert([{ name, shelf_life: shelfLife }])
        .select()
        .single();
      
      if (error) throw error;
      console.log('✅ SKU added:', data);
      return data;
    } catch (error) {
      console.error('❌ Error adding SKU:', error.message);
      throw error;
    }
  }

  // Add multiple SKUs
  async addSkus(skusArray) {
    try {
      const { data, error } = await this.supabase
        .from('skus')
        .insert(skusArray)
        .select();
      
      if (error) throw error;
      console.log(`✅ ${data.length} SKUs added:`, data);
      return data;
    } catch (error) {
      console.error('❌ Error adding SKUs:', error.message);
      throw error;
    }
  }

  // Add a single store
  async addStore(geo, religion = null) {
    try {
      const { data, error } = await this.supabase
        .from('stores')
        .insert([{ geo, religion }])
        .select()
        .single();
      
      if (error) throw error;
      console.log('✅ Store added:', data);
      return data;
    } catch (error) {
      console.error('❌ Error adding store:', error.message);
      throw error;
    }
  }

  // Add multiple stores
  async addStores(storesArray) {
    try {
      console.log('🔧 Inserting stores:', storesArray);
      const result = await this.supabase
        .from('stores')
        .insert(storesArray)
        .select();
      console.log('🔧 Raw supabase response:', result);
      const { data, error } = result;
      
      if (error) throw error;
      console.log(`✅ ${data.length} stores added:`, data);
      return data;
    } catch (error) {
      // Log full error object for debugging
      console.error('❌ Error adding stores:', error);
      throw error;
    }
  }

  // Link a store to a SKU
  async linkStoreSku(storeId, skuId) {
    try {
      const { data, error } = await this.supabase
        .from('store_skus')
        .insert([{ store_id: storeId, sku_id: skuId }])
        .select()
        .single();
      
      if (error) throw error;
      console.log('✅ Store-SKU link created:', data);
      return data;
    } catch (error) {
      console.error('❌ Error linking store-SKU:', error.message);
      throw error;
    }
  }

  // Add sales data
  async addSalesData(salesRecord) {
    try {
      const { data, error } = await this.supabase
        .from('sales_data')
        .insert([salesRecord])
        .select()
        .single();
      
      if (error) throw error;
      console.log('✅ Sales data added:', data);
      return data;
    } catch (error) {
      console.error('❌ Error adding sales data:', error.message);
      throw error;
    }
  }

  // Add multiple sales data records
  async addSalesDataBatch(salesDataArray) {
    try {
      const { data, error } = await this.supabase
        .from('sales_data')
        .insert(salesDataArray)
        .select();
      
      if (error) throw error;
      console.log(`✅ ${data.length} sales data records added`);
      return data;
    } catch (error) {
      console.error('❌ Error adding sales data batch:', error.message);
      throw error;
    }
  }

  // Get all data from a table
  async getAllData(tableName) {
    try {
      const { data, error } = await this.supabase
        .from(tableName)
        .select('*');
      
      if (error) throw error;
      console.log(`📊 ${tableName} data:`, data);
      return data;
    } catch (error) {
      console.error(`❌ Error fetching ${tableName}:`, error.message);
      throw error;
    }
  }

  // Sample data insertion
  async insertSampleData() {
    try {
      console.log('🚀 Starting sample data insertion...');

      // 1. Add sample SKUs
      console.log('\n📦 Adding SKUs...');
      const skus = await this.addSkus([
        { name: 'Milk 1L', shelf_life: 7 },
        { name: 'Bread Loaf', shelf_life: 3 },
        { name: 'Eggs Dozen', shelf_life: 14 },
        { name: 'Yogurt Cup', shelf_life: 10 },
        { name: 'Cheese Block', shelf_life: 30 },
        { name: 'Apple Juice', shelf_life: 12 },
        { name: 'Banana Bundle', shelf_life: 5 }
      ]);

      // 2. Add sample stores
      console.log('\n🏪 Adding stores...');
      const stores = await this.addStores([
        { geo: 'New York', religion: 'Christian' },
        { geo: 'Los Angeles', religion: 'Jewish' },
        { geo: 'Chicago', religion: 'Muslim' },
        { geo: 'Houston', religion: 'Hindu' },
        { geo: 'Phoenix', religion: 'Christian' },
        { geo: 'Philadelphia', religion: 'Buddhist' }
      ]);

      // 3. Create store-SKU relationships
      console.log('\n🔗 Creating store-SKU relationships...');
      const relationships = [];
      stores.forEach((store, storeIndex) => {
        // Each store gets 4 SKUs
        const storeSkus = skus.slice(storeIndex, storeIndex + 4);
        storeSkus.forEach(sku => {
          relationships.push({
            store_id: store.id,
            sku_id: sku.id
          });
        });
      });

      const { data: linkData, error: linkError } = await this.supabase
        .from('store_skus')
        .insert(relationships)
        .select();

      if (linkError) throw linkError;
      console.log(`✅ Created ${linkData.length} store-SKU relationships`);

      // 4. Add sample sales data
      console.log('\n📊 Adding sales data...');
      const salesData = [];
      const currentYear = new Date().getFullYear();
      
      linkData.forEach(link => {
        // Add data for first 10 days of the year
        for (let day = 1; day <= 10; day++) {
          const date = new Date(currentYear, 0, day);
          salesData.push({
            store_id: link.store_id,
            sku_id: link.sku_id,
            year: currentYear,
            day: day,
            date: date.toISOString().split('T')[0],
            type_of_day: day % 7 === 0 || day % 7 === 6 ? 'weekend' : 'weekday',
            initial: Math.floor(Math.random() * 100) + 50,
            sold: Math.floor(Math.random() * 50) + 10,
            returns: Math.floor(Math.random() * 5),
            donations: Math.floor(Math.random() * 3),
            reroutes_in: Math.floor(Math.random() * 10),
            reroutes_out: Math.floor(Math.random() * 5),
            recycled: Math.floor(Math.random() * 2),
            final: Math.floor(Math.random() * 50) + 20
          });
        }
      });

      await this.addSalesDataBatch(salesData);

      console.log('\n🎉 Sample data insertion completed successfully!');
      
      // Show summary
      console.log('\n📈 Data Summary:');
      const skuCount = await this.supabase.from('skus').select('*', { count: 'exact', head: true });
      const storeCount = await this.supabase.from('stores').select('*', { count: 'exact', head: true });
      const relationCount = await this.supabase.from('store_skus').select('*', { count: 'exact', head: true });
      const salesCount = await this.supabase.from('sales_data').select('*', { count: 'exact', head: true });
      
      console.log(`📦 SKUs: ${skuCount.count}`);
      console.log(`🏪 Stores: ${storeCount.count}`);
      console.log(`🔗 Store-SKU links: ${relationCount.count}`);
      console.log(`📊 Sales records: ${salesCount.count}`);

    } catch (error) {
      console.error('❌ Error in sample data insertion:', error);
    }
  }
}

// CLI usage
if (import.meta.url === `file://${process.argv[1]}`) {
  const inserter = new DataInserter();
  
  const command = process.argv[2];
  
  switch (command) {
    case 'sample':
      await inserter.insertSampleData();
      break;
    case 'sku':
      const skuName = process.argv[3];
      const shelfLife = parseInt(process.argv[4]) || 7;
      if (skuName) {
        await inserter.addSku(skuName, shelfLife);
      } else {
        console.log('Usage: node src/utils/dataInserter.js sku "Product Name" 7');
      }
      break;
    case 'store':
      const geo = process.argv[3];
      const religion = process.argv[4] || null;
      if (geo) {
        await inserter.addStore(geo, religion);
      } else {
        console.log('Usage: node src/utils/dataInserter.js store "Location" "Religion"');
      }
      break;
    case 'view':
      const tableName = process.argv[3];
      if (tableName) {
        await inserter.getAllData(tableName);
      } else {
        console.log('Usage: node src/utils/dataInserter.js view skus|stores|store_skus|sales_data');
      }
      break;
    default:
      console.log(`
Usage: node src/utils/dataInserter.js <command>

Commands:
  sample                                    - Insert comprehensive sample data
  sku "Product Name" <shelf_life>          - Add a single SKU
  store "Location" ["Religion"]            - Add a single store  
  view <table_name>                        - View all data from a table

Examples:
  node src/utils/dataInserter.js sample
  node src/utils/dataInserter.js sku "Organic Milk" 5
  node src/utils/dataInserter.js store "Miami" "Christian"
  node src/utils/dataInserter.js view skus
      `);
  }
}

export default DataInserter;

import { supabaseAdmin } from '../db/index.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class DatabaseMigration {
  constructor() {
    this.supabase = supabaseAdmin;
  }

  async runSchemaFile() {
    try {
      console.log('🔄 Running database schema migration...');
      
      // Read the schema file
      const schemaPath = path.join(__dirname, '../database/schema.sql');
      const schema = fs.readFileSync(schemaPath, 'utf8');
      
      // Split the schema into individual statements
      const statements = schema
        .split(';')
        .map(stmt => stmt.trim())
        .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));
      
      console.log(`📄 Found ${statements.length} SQL statements to execute`);
      
      // Execute each statement
      for (let i = 0; i < statements.length; i++) {
        const statement = statements[i] + ';';
        console.log(`⚡ Executing statement ${i + 1}/${statements.length}...`);
        
        try {
          const { error } = await this.supabase.rpc('exec_sql', { 
            sql_query: statement 
          });
          
          if (error) {
            console.error(`❌ Error in statement ${i + 1}:`, error);
            // Continue with other statements
          } else {
            console.log(`✅ Statement ${i + 1} executed successfully`);
          }
        } catch (err) {
          console.error(`❌ Error executing statement ${i + 1}:`, err.message);
          // Continue with other statements
        }
      }
      
      console.log('🎉 Database schema migration completed!');
      
    } catch (error) {
      console.error('❌ Error running schema migration:', error);
      throw error;
    }
  }

  async testConnection() {
    try {
      console.log('🔄 Testing database connection...');
      
      // Test basic connection
      const { data, error } = await this.supabase
        .from('information_schema.tables')
        .select('table_name')
        .eq('table_schema', 'public')
        .limit(1);
      
      if (error) {
        throw error;
      }
      
      console.log('✅ Database connection successful!');
      return true;
    } catch (error) {
      console.error('❌ Database connection failed:', error);
      return false;
    }
  }

  async checkTables() {
    try {
      console.log('🔄 Checking if tables exist...');
      
      const expectedTables = ['skus', 'stores', 'store_skus', 'sales_data'];
      
      for (const tableName of expectedTables) {
        const { data, error } = await this.supabase
          .from(tableName)
          .select('*', { count: 'exact', head: true });
        
        if (error) {
          console.log(`❌ Table '${tableName}' does not exist or has issues`);
        } else {
          console.log(`✅ Table '${tableName}' exists (${data?.length || 0} records)`);
        }
      }
      
    } catch (error) {
      console.error('❌ Error checking tables:', error);
    }
  }

  async seedSampleData() {
    try {
      console.log('🔄 Seeding sample data...');
      
      // Sample SKUs
      const sampleSkus = [
        { name: 'Milk 1L', shelf_life: 7 },
        { name: 'Bread Loaf', shelf_life: 3 },
        { name: 'Eggs Dozen', shelf_life: 14 },
        { name: 'Yogurt Cup', shelf_life: 10 },
        { name: 'Cheese Block', shelf_life: 30 }
      ];
      
      // Sample Stores
      const sampleStores = [
        { geo: 'New York', religion: 'Christian' },
        { geo: 'Los Angeles', religion: 'Jewish' },
        { geo: 'Chicago', religion: 'Muslim' },
        { geo: 'Houston', religion: 'Hindu' },
        { geo: 'Phoenix', religion: 'Christian' }
      ];
      
      // Insert SKUs
      console.log('📦 Inserting sample SKUs...');
      const { data: skus, error: skuError } = await this.supabase
        .from('skus')
        .insert(sampleSkus)
        .select();
      
      if (skuError) {
        console.error('❌ Error inserting SKUs:', skuError);
      } else {
        console.log(`✅ Inserted ${skus.length} SKUs`);
      }
      
      // Insert Stores
      console.log('🏪 Inserting sample stores...');
      const { data: stores, error: storeError } = await this.supabase
        .from('stores')
        .insert(sampleStores)
        .select();
      
      if (storeError) {
        console.error('❌ Error inserting stores:', storeError);
      } else {
        console.log(`✅ Inserted ${stores.length} stores`);
      }
      
      // Insert Store-SKU relationships
      if (skus && stores) {
        console.log('🔗 Creating store-SKU relationships...');
        const storeSkuRelations = [];
        
        stores.forEach(store => {
          // Each store gets 3 random SKUs
          const randomSkus = skus.sort(() => 0.5 - Math.random()).slice(0, 3);
          randomSkus.forEach(sku => {
            storeSkuRelations.push({
              store_id: store.id,
              sku_id: sku.id
            });
          });
        });
        
        const { data: relations, error: relationError } = await this.supabase
          .from('store_skus')
          .insert(storeSkuRelations)
          .select();
        
        if (relationError) {
          console.error('❌ Error inserting store-SKU relations:', relationError);
        } else {
          console.log(`✅ Inserted ${relations.length} store-SKU relationships`);
        }
        
        // Insert sample sales data
        console.log('📊 Inserting sample sales data...');
        const salesData = [];
        const currentYear = new Date().getFullYear();
        
        relations.forEach(relation => {
          // Add sales data for the last 30 days
          for (let day = 1; day <= 30; day++) {
            const date = new Date(currentYear, 0, day); // January days
            salesData.push({
              store_id: relation.store_id,
              sku_id: relation.sku_id,
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
        
        const { data: salesRecords, error: salesError } = await this.supabase
          .from('sales_data')
          .insert(salesData)
          .select();
        
        if (salesError) {
          console.error('❌ Error inserting sales data:', salesError);
        } else {
          console.log(`✅ Inserted ${salesRecords.length} sales data records`);
        }
      }
      
      console.log('🎉 Sample data seeding completed!');
      
    } catch (error) {
      console.error('❌ Error seeding sample data:', error);
    }
  }
}

// CLI usage: run with `node src/utils/migration.js [command]`
// Default command is 'migrate'
const [, , cmdArg] = process.argv;
const command = cmdArg || 'migrate';
(async () => {
  const migration = new DatabaseMigration();
  switch (command) {
    case 'migrate':
      await migration.runSchemaFile();
      break;
    case 'test':
      await migration.testConnection();
      break;
    case 'check':
      await migration.checkTables();
      break;
    case 'seed':
      await migration.seedSampleData();
      break;
    case 'setup':
      console.log('🚀 Running complete database setup...');
      if (await migration.testConnection()) {
        await migration.runSchemaFile();
        await migration.checkTables();
        await migration.seedSampleData();
        console.log('🎉 Database setup completed successfully!');
      }
      break;
    default:
      console.log(`Usage: node src/utils/migration.js <command>
Commands:
  migrate  - Run database schema migration
  test     - Test database connection
  check    - Check if tables exist
  seed     - Insert sample data
  setup    - Run complete setup (migrate + check + seed)`);
  }
})();

export default DatabaseMigration;

import { config } from 'dotenv';
config();

import DataInserter from './src/utils/dataInserter.js';

async function main() {
  console.log('🚀 Adding sample data...');
  
  const inserter = new DataInserter();
  
  try {
    // Add a few SKUs
    console.log('Adding SKUs...');
    const sku1 = await inserter.addSku('Milk 1L', 7);
    const sku2 = await inserter.addSku('Bread Loaf', 3);
    const sku3 = await inserter.addSku('Eggs Dozen', 14);
    
    // Add a few stores
    console.log('Adding stores...');
    const store1 = await inserter.addStore('New York', 'Christian');
    const store2 = await inserter.addStore('Los Angeles', 'Jewish');
    
    // Link stores and SKUs
    console.log('Creating relationships...');
    await inserter.linkStoreSku(store1.id, sku1.id);
    await inserter.linkStoreSku(store1.id, sku2.id);
    await inserter.linkStoreSku(store2.id, sku1.id);
    await inserter.linkStoreSku(store2.id, sku3.id);
    
    // Add some sales data
    console.log('Adding sales data...');
    await inserter.addSalesData({
      store_id: store1.id,
      sku_id: sku1.id,
      year: 2024,
      day: 1,
      date: '2024-01-01',
      type_of_day: 'weekday',
      initial: 100,
      sold: 45,
      returns: 2,
      donations: 1,
      reroutes_in: 5,
      reroutes_out: 3,
      recycled: 0,
      final: 54
    });
    
    console.log('✅ Sample data added successfully!');
    
    // Show what we have
    console.log('\n📊 Current data:');
    await inserter.getAllData('skus');
    await inserter.getAllData('stores');
    await inserter.getAllData('store_skus');
    await inserter.getAllData('sales_data');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

main();

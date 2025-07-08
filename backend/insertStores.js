import 'dotenv/config';
import DataInserter from './src/utils/dataInserter.js';

(async () => {
  // Array of stores to insert
  const stores = [
    { geo: 'beach', religion: 'muslim' },
    { geo: 'plains', religion: 'muslim' },
    { geo: 'plains', religion: 'hindu' },
    { geo: 'beach', religion: 'hindu' },
    { geo: 'hills', religion: 'muslim' },
    { geo: 'plains', religion: 'christian' },
    { geo: 'hills', religion: 'hindu' },
    { geo: 'beach', religion: 'christian' },
    { geo: 'hills', religion: 'christian' },
    { geo: 'beach', religion: 'muslim' }
  ];

  try {
    const inserter = new DataInserter();
    console.log('🔧 [Script] Stores payload:', stores);
    const result = await inserter.addStores(stores);
    console.log('✅ Inserted stores:', result);
  } catch (error) {
    console.error('❌ Error inserting stores:', error);
  } finally {
    process.exit();
  }
})();

// Example API calls for adding data to your database
// You can run these in Postman, curl, or any HTTP client

const API_BASE = 'http://localhost:5000/api';

// ===== ADDING SKUs =====

// 1. Add a single SKU
const addSingleSku = {
  method: 'POST',
  url: `${API_BASE}/skus`,
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    name: 'Organic Milk 1L',
    shelf_life: 7
  })
};

// 2. Add multiple SKUs (you'd need to call the endpoint multiple times)
const skusToAdd = [
  { name: 'Whole Wheat Bread', shelf_life: 5 },
  { name: 'Fresh Eggs', shelf_life: 21 },
  { name: 'Greek Yogurt', shelf_life: 14 },
  { name: 'Cheddar Cheese', shelf_life: 45 }
];

// ===== ADDING STORES =====

// 1. Add a single store
const addSingleStore = {
  method: 'POST',
  url: `${API_BASE}/stores`,
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    geo: 'San Francisco',
    religion: 'Buddhist'
  })
};

// 2. Multiple stores to add
const storesToAdd = [
  { geo: 'Boston', religion: 'Catholic' },
  { geo: 'Seattle', religion: 'Protestant' },
  { geo: 'Denver', religion: 'Jewish' },
  { geo: 'Atlanta', religion: 'Methodist' }
];

// ===== LINKING STORES TO SKUs =====

// Link a store to a SKU (you need actual IDs from your database)
const linkStoreSku = {
  method: 'POST',
  url: `${API_BASE}/store-skus`,
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    store_id: 'your-store-id-here',
    sku_id: 'your-sku-id-here'
  })
};

// Batch link multiple store-sku relationships
const batchLinkStoreSkus = {
  method: 'POST',
  url: `${API_BASE}/store-skus/batch`,
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    relationships: [
      { store_id: 'store-id-1', sku_id: 'sku-id-1' },
      { store_id: 'store-id-1', sku_id: 'sku-id-2' },
      { store_id: 'store-id-2', sku_id: 'sku-id-1' }
    ]
  })
};

// ===== ADDING SALES DATA =====

// Add a single sales data record
const addSalesData = {
  method: 'POST',
  url: `${API_BASE}/sales-data`,
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    store_id: 'your-store-id',
    sku_id: 'your-sku-id',
    year: 2025,
    day: 15,
    date: '2025-01-15',
    type_of_day: 'weekday',
    initial: 100,
    sold: 25,
    returns: 2,
    donations: 1,
    reroutes_in: 5,
    reroutes_out: 3,
    recycled: 0,
    final: 75
  })
};

// Batch add sales data
const batchAddSalesData = {
  method: 'POST',
  url: `${API_BASE}/sales-data/batch`,
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    salesDataArray: [
      {
        store_id: 'store-id-1',
        sku_id: 'sku-id-1',
        year: 2025,
        day: 16,
        date: '2025-01-16',
        type_of_day: 'weekday',
        initial: 80,
        sold: 30,
        returns: 1,
        donations: 0,
        reroutes_in: 10,
        reroutes_out: 2,
        recycled: 1,
        final: 56
      },
      {
        store_id: 'store-id-1',
        sku_id: 'sku-id-2',
        year: 2025,
        day: 16,
        date: '2025-01-16',
        type_of_day: 'weekday',
        initial: 50,
        sold: 15,
        returns: 0,
        donations: 2,
        reroutes_in: 5,
        reroutes_out: 1,
        recycled: 0,
        final: 37
      }
    ]
  })
};

// ===== CURL EXAMPLES =====

/*
# Add a SKU using curl
curl -X POST http://localhost:5000/api/skus \
  -H "Content-Type: application/json" \
  -d '{"name": "Fresh Bananas", "shelf_life": 6}'

# Add a store using curl  
curl -X POST http://localhost:5000/api/stores \
  -H "Content-Type: application/json" \
  -d '{"geo": "Miami", "religion": "Catholic"}'

# Get all SKUs
curl http://localhost:5000/api/skus

# Get all stores
curl http://localhost:5000/api/stores

# Add sales data using curl
curl -X POST http://localhost:5000/api/sales-data \
  -H "Content-Type: application/json" \
  -d '{
    "store_id": "your-store-id",
    "sku_id": "your-sku-id", 
    "year": 2025,
    "day": 17,
    "date": "2025-01-17",
    "type_of_day": "weekday",
    "initial": 120,
    "sold": 40,
    "returns": 3,
    "donations": 2,
    "reroutes_in": 8,
    "reroutes_out": 5,
    "recycled": 1,
    "final": 77
  }'
*/

// ===== JAVASCRIPT FETCH EXAMPLES =====

// Function to add data using JavaScript fetch
async function addDataExamples() {
  try {
    // Add a SKU
    const skuResponse = await fetch('http://localhost:5000/api/skus', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: 'Organic Apples',
        shelf_life: 10
      })
    });
    const skuData = await skuResponse.json();
    console.log('SKU added:', skuData);

    // Add a store
    const storeResponse = await fetch('http://localhost:5000/api/stores', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        geo: 'Portland',
        religion: 'Methodist'
      })
    });
    const storeData = await storeResponse.json();
    console.log('Store added:', storeData);

    // Link store to SKU (using actual IDs from responses above)
    if (skuData.success && storeData.success) {
      const linkResponse = await fetch('http://localhost:5000/api/store-skus', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          store_id: storeData.data.id,
          sku_id: skuData.data.id
        })
      });
      const linkData = await linkResponse.json();
      console.log('Store-SKU link created:', linkData);
    }

  } catch (error) {
    console.error('Error adding data:', error);
  }
}

// Uncomment to run:
// addDataExamples();

export {
  addSingleSku,
  addSingleStore,
  linkStoreSku,
  addSalesData,
  batchAddSalesData,
  addDataExamples
};

// Simple test script to add data via API
console.log('Testing API...');

// Test if server is running
fetch('http://localhost:5000/health')
  .then(response => response.json())
  .then(data => {
    console.log('✅ Server is running:', data);
    
    // Now try to add a SKU
    return fetch('http://localhost:5000/api/skus', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: 'Test Milk',
        shelf_life: 7
      })
    });
  })
  .then(response => response.json())
  .then(data => {
    console.log('✅ SKU added:', data);
    
    // Try to get all SKUs
    return fetch('http://localhost:5000/api/skus');
  })
  .then(response => response.json())
  .then(data => {
    console.log('📦 All SKUs:', data);
  })
  .catch(error => {
    console.error('❌ Error:', error.message);
  });

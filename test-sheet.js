const axios = require('axios');
require('dotenv').config();

const BASE_URL = process.env.API_URL || 'http://localhost:3000';

async function testEndpoint(endpoint, name) {
  try {
    console.log(`\nTesting ${name} endpoint...`);
    const response = await axios.get(`${BASE_URL}${endpoint}`);
    console.log(`✅ ${name} endpoint successful!`);
    console.log(`Status: ${response.status}`);
    console.log(`Data count: ${response.data.data.length}`);
    console.log('Sample data:', JSON.stringify(response.data.data[0], null, 2));
  } catch (error) {
    console.error(`❌ Error testing ${name} endpoint:`, error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
    }
  }
}

async function runTests() {
  console.log('Starting API tests...');
  
  // Test health endpoint
  try {
    console.log('\nTesting health endpoint...');
    const response = await axios.get(`${BASE_URL}/health`);
    console.log(`✅ Health endpoint successful! Status: ${response.status}`);
  } catch (error) {
    console.error('❌ Error testing health endpoint:', error.message);
  }

  // Test all data endpoints
  await testEndpoint('/api/get-data', 'Data');
  await testEndpoint('/api/get-email', 'Email');
  await testEndpoint('/api/get-slack-messages', 'Slack Messages');
}

runTests().catch(console.error); 
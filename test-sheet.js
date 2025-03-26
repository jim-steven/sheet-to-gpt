const axios = require('axios');
require('dotenv').config();

const RENDER_URL = process.env.RENDER_URL || 'https://sheet-to-gpt.onrender.com';
const SPREADSHEET_ID = '1m6e-HTb1W_trKMKgkkM-ItcuwJJW-Ab6lM_TKmOAee4';
const SHEET_NAME = 'email';

async function testEndpoints() {
  try {
    console.log('Testing health endpoint...');
    const healthResponse = await axios.get(`${RENDER_URL}/health`);
    console.log('Health check response:', healthResponse.data);

    console.log('\nTesting get-data endpoint...');
    const dataResponse = await axios.get(`${RENDER_URL}/api/get-data`, {
      params: {
        spreadsheetId: SPREADSHEET_ID,
        sheetName: SHEET_NAME
      }
    });
    console.log('Data response:', JSON.stringify(dataResponse.data, null, 2));

    console.log('\nTesting post-data endpoint...');
    const testData = {
      spreadsheetId: SPREADSHEET_ID,
      sheetName: SHEET_NAME,
      data: [
        {
          Email: 'test@example.com',
          Subject: 'Test Email',
          Date: new Date().toISOString(),
          Content: 'This is a test email content'
        }
      ]
    };

    const postResponse = await axios.post(`${RENDER_URL}/api/post-data`, testData);
    console.log('Post data response:', JSON.stringify(postResponse.data, null, 2));

  } catch (error) {
    console.error('Error testing endpoints:', error.response?.data || error.message);
  }
}

testEndpoints(); 
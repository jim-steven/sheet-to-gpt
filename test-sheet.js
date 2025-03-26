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
    const getDataResponse = await axios.get(`${RENDER_URL}/api/get-data`, {
      params: {
        spreadsheetId: SPREADSHEET_ID,
        sheetName: SHEET_NAME
      }
    });
    console.log('Get data response:', JSON.stringify(getDataResponse.data, null, 2));

    console.log('\nTesting post-data endpoint...');
    const testData = {
      spreadsheetId: SPREADSHEET_ID,
      sheetName: SHEET_NAME,
      data: [{
        'Email ID': 'test-' + Date.now(),
        'Subject': 'Test Email',
        'Sender Name': 'Test Sender',
        'Sender Email': 'test@example.com',
        'Date': new Date().toISOString(),
        'Email Link': 'https://example.com',
        'CC Recipients': '',
        'BCC Recipients': '',
        'Labels': 'test',
        'Status': 'saved',
        'Time Stamp': new Date().toISOString(),
        'Content': 'This is a test email content'
      }]
    };
    const postDataResponse = await axios.post(`${RENDER_URL}/api/post-data`, testData);
    console.log('Post data response:', JSON.stringify(postDataResponse.data, null, 2));

    console.log('\nTesting remove-data endpoint...');
    const removeDataResponse = await axios.post(`${RENDER_URL}/api/remove-data`, {
      spreadsheetId: SPREADSHEET_ID,
      sheetName: SHEET_NAME,
      emailId: testData.data[0]['Email ID']
    });
    console.log('Remove data response:', JSON.stringify(removeDataResponse.data, null, 2));

  } catch (error) {
    console.error('Error testing endpoints:', error.response?.data || error.message);
  }
}

testEndpoints(); 
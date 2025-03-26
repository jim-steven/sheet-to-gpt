const axios = require('axios');

const SPREADSHEET_ID = '1m6e-HTb1W_trKMKgkkM-ItcuwJJW-Ab6lM_TKmOAee4';
const SHEETS = ['email', 'slack_messages', 'Data'];
const API_URL = process.env.API_URL || 'http://localhost:3000';

async function testSheet(sheetName) {
  try {
    console.log(`\nTesting sheet: ${sheetName}`);
    const response = await axios.get(`${API_URL}/api/get-data`, {
      params: {
        spreadsheetId: SPREADSHEET_ID,
        sheetName: sheetName
      }
    });
    
    console.log(`Success! Found ${response.data.data.length} rows in sheet "${sheetName}"`);
    return true;
  } catch (error) {
    console.error(`Error accessing sheet "${sheetName}":`, error.response?.data || error.message);
    return false;
  }
}

async function testAllSheets() {
  console.log('Testing access to all sheets...');
  
  for (const sheet of SHEETS) {
    await testSheet(sheet);
  }
}

testAllSheets().catch(console.error); 
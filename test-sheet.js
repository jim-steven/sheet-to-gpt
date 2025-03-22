const fetch = require('node-fetch');
require('dotenv').config();

// Configuration
const PORT = process.env.PORT || 3000;
const BASE_URL = `http://localhost:${PORT}`;
const DEFAULT_SPREADSHEET_ID = process.env.DEFAULT_SPREADSHEET_ID;

async function testGetSheetData(spreadsheetId = DEFAULT_SPREADSHEET_ID, sheetName = 'Data') {
  try {
    console.log(`Fetching data from sheet "${sheetName}" in spreadsheet ID: ${spreadsheetId}`);
    
    // Construct the API URL
    const url = `${BASE_URL}/api/get-data?spreadsheetId=${spreadsheetId}&sheetName=${sheetName}`;
    console.log(`API URL: ${url}`);
    
    // Make the request
    const response = await fetch(url);
    const data = await response.json();
    
    // Check if there's an error
    if (data.error) {
      console.error('Error from API:', data.error);
      if (data.details) console.error('Details:', data.details);
      return;
    }
    
    // Display results
    console.log('\n--- Sheet Data ---');
    if (data.data && data.data.length > 0) {
      console.log(`Found ${data.data.length} rows of data`);
      console.log('\nColumns:');
      const columns = Object.keys(data.data[0]);
      columns.forEach(col => console.log(`- ${col}`));
      
      console.log('\nSample data (first 3 rows):');
      const sample = data.data.slice(0, 3);
      console.log(JSON.stringify(sample, null, 2));
    } else {
      console.log('No data found in the sheet');
    }
  } catch (error) {
    console.error('Error testing API:', error.message);
  }
}

// Run the test
// You can also specify a different spreadsheet ID and sheet name:
// testGetSheetData('your_spreadsheet_id', 'CustomSheet');
testGetSheetData(); 
const express = require('express');
const { google } = require('googleapis');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Basic health check endpoint
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

// Initialize service account auth
const getServiceAccountAuth = () => {
  try {
    // Path to service account credentials file
    const credentials = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON);
    
    return new google.auth.JWT(
      credentials.client_email,
      null,
      credentials.private_key,
      ['https://www.googleapis.com/auth/spreadsheets.readonly']
    );
  } catch (error) {
    console.error('Error initializing service account:', error);
    throw error;
  }
};

// Get all data from the Data sheet
app.get('/api/get-data', async (req, res) => {
  try {
    // Get spreadsheet ID from query parameter or use default from env
    const spreadsheetId = req.query.spreadsheetId || process.env.DEFAULT_SPREADSHEET_ID;
    // Get sheet name from query parameter or use default "Data"
    const sheetName = req.query.sheetName || 'Data';
    
    // Authenticate with service account
    const auth = getServiceAccountAuth();
    
    // Create sheets client
    const sheets = google.sheets({ version: 'v4', auth });
    
    // Fetch data from the sheet
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: `${sheetName}!A1:Z`,
    });
    
    const rows = response.data.values || [];
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'No data found' });
    }
    
    // Convert to JSON with headers as keys
    const headers = rows[0];
    const data = rows.slice(1).map(row => {
      const item = {};
      headers.forEach((header, index) => {
        item[header] = row[index] || '';
      });
      return item;
    });
    
    res.json({ data });
  } catch (error) {
    console.error('Error fetching sheet data:', error);
    // Ensure we only send one response with proper JSON formatting
    return res.status(500).json({ 
      error: 'Failed to retrieve sheet data', 
      details: error.message 
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Sheet-to-GPT server is running on port ${PORT}`);
  console.log(`Health check available at http://localhost:${PORT}/health`);
  console.log(`API endpoint available at http://localhost:${PORT}/api/get-data`);
});
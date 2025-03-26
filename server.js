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
      ['https://www.googleapis.com/auth/spreadsheets']
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

// Post data to Google Sheet
app.post('/api/post-data', async (req, res) => {
  try {
    const { spreadsheetId, sheetName, data } = req.body;

    if (!spreadsheetId || !sheetName || !data) {
      return res.status(400).json({
        error: 'Missing required parameters',
        details: 'spreadsheetId, sheetName, and data are required'
      });
    }

    // Authenticate with service account
    const auth = getServiceAccountAuth();
    
    // Create sheets client
    const sheets = google.sheets({ version: 'v4', auth });

    // First, get the headers from the sheet
    const headersResponse = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: `${sheetName}!A1:Z1`,
    });

    const headers = headersResponse.data.values?.[0] || [];
    
    // Convert data to array format
    const values = data.map(item => {
      return headers.map(header => item[header] || '');
    });

    // Append the data to the sheet
    const response = await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: `${sheetName}!A:Z`,
      valueInputOption: 'RAW',
      requestBody: {
        values
      }
    });

    res.json({
      message: 'Data successfully appended to sheet',
      updatedRange: response.data.updates?.updatedRange
    });
  } catch (error) {
    console.error('Error posting data to sheet:', error);
    return res.status(500).json({
      error: 'Failed to post data to sheet',
      details: error.message
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Sheet-to-GPT server is running on port ${PORT}`);
  console.log(`Health check available at http://localhost:${PORT}/health`);
  console.log(`API endpoints available at:`);
  console.log(`- GET http://localhost:${PORT}/api/get-data`);
  console.log(`- POST http://localhost:${PORT}/api/post-data`);
});
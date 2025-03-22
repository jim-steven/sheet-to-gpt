# Sheet to GPT API

A simple API to retrieve data from Google Sheets for use with AI applications.

## Local Development

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Set up environment variables in `.env` file (see `.env.example`)
4. Start the server:
   ```
   npm start
   ```

## Testing

You can test the API using the included test script:

```
node test-sheet.js
```

## API Endpoints

### GET /api/get-data

Retrieves data from a Google Sheet.

**Query Parameters:**
- `spreadsheetId` (optional): The ID of the Google Sheet to access
- `sheetName` (optional, default: "Data"): The name of the sheet tab to retrieve data from

**Example Response:**
```json
{
  "data": [
    {
      "Column1": "Value1",
      "Column2": "Value2"
    },
    {
      "Column1": "Value3",
      "Column2": "Value4"
    }
  ]
}
```

### GET /health

Health check endpoint.

**Example Response:**
```
OK
```

## Deploying to Render.com

### Option 1: Deploy from GitHub

1. Create a new account on [Render.com](https://render.com) if you don't have one
2. Connect your GitHub account to Render
3. Create a new Web Service and select your repository
4. Use the following settings:
   - Name: sheet-to-gpt (or your preferred name)
   - Environment: Node
   - Build Command: `npm install`
   - Start Command: `node server.js`
   - Plan: Free
5. Add the following environment variables:
   - `DEFAULT_SPREADSHEET_ID`: Your Google Spreadsheet ID
   - `GOOGLE_APPLICATION_CREDENTIALS_JSON`: The entire JSON content of your Google service account credentials

### Option 2: Deploy using render.yaml

1. Create a new account on [Render.com](https://render.com) if you don't have one
2. Install the Render CLI:
   ```
   npm install -g @render/cli
   ```
3. Login to Render:
   ```
   render login
   ```
4. Deploy using the `render.yaml` file:
   ```
   render deploy
   ```
5. Set the required environment variables through the Render dashboard after deployment 
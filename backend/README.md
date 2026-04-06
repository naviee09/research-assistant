# Smart Research Assistant Backend

This is the backend API for the Smart Research Assistant application, built with Node.js, Express, and MongoDB.

## API Endpoints

### Research
- `POST /api/research` - Submit a research question
- `GET /api/research/:id` - Get a specific research report
- `GET /api/research` - Get all research reports for a user

### Files
- `POST /api/files/upload` - Upload files for research
- `GET /api/files` - Get all files for a user

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics
- `GET /api/dashboard/reports` - Get report history

### Billing
- `GET /api/billing/credits` - Get user credits
- `POST /api/billing/deduct` - Deduct credits
- `POST /api/billing/add` - Add credits (for testing)

### Data
- `POST /api/data/update` - Trigger data source updates
- `GET /api/data/freshness` - Check data freshness

## Installation

1. Install dependencies:
   ```
   npm install
   ```

2. Set up environment variables in `.env`:
   ```
   NODE_ENV=development
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/smart-research-assistant
   OPENAI_API_KEY=your_openai_api_key_here
   PATHWAY_API_KEY=your_pathway_api_key_here
   FLEXPRICE_API_KEY=your_flexprice_api_key_here
   ```

3. Start the development server:
   ```
   npm run dev
   ```

## Testing

Run tests with:
```
npm test
```

## Project Structure

```
backend/
├── agents/              # AI agents for research processing
├── models/              # MongoDB models
├── routes/              # API routes
├── services/            # External service integrations
├── utils/               # Utility functions
├── __tests__/           # Test files
├── server.js            # Main server file
└── .env                 # Environment variables
```
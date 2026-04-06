# Project Deployment Instructions

## Overview
This project consists of a React frontend and Node.js/Express backend that integrates with various APIs including NewsAPI, OpenAI, and Flexprice.

## Prerequisites for New PC
1. Node.js (version 16 or higher)
2. MongoDB (running locally or accessible remotely)
3. Git (optional, for version control)

## Setup Instructions

### 1. Install Dependencies
```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..
```

### 2. Configure Environment Variables
Create `.env` files with the required API keys:

**Frontend (.env in root directory):**
```
# No specific frontend environment variables needed
```

**Backend (.env in backend directory):**
```
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/smart-research-assistant
OPENAI_API_KEY=your_openai_api_key_here
NEWS_API_KEY=your_newsapi_key_here
FLEXPRICE_API_KEY=your_flexprice_api_key_here
PATHWAY_API_KEY=your_pathway_api_key_here
```

### 3. Start the Application
```bash
# Start both frontend and backend
npm run dev
```

Or start them separately:
```bash
# Start backend (from backend directory)
cd backend
node server.js

# Start frontend (from root directory)
npm start
```

## Project Structure
- `/src` - React frontend components
- `/backend` - Node.js/Express backend API
- `/public` - Static assets
- `/build` - Production build (if available)

## API Keys Required
1. **NewsAPI Key** - For fetching real-time news data
2. **OpenAI API Key** - For generating key takeaways
3. **Flexprice API Key** - For usage-based billing
4. **Pathway API Key** - For data ingestion pipeline

## Notes
- The application will work with mock data if API keys are not provided
- MongoDB must be running for data persistence
- Default ports: Frontend 3000, Backend 5000
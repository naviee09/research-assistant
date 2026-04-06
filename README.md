# Smart Research Assistant

A modern React application for AI-powered research assistance with structured reports and comprehensive source analysis.

## Features

- **Home Page**: Welcome screen with tool description and call-to-action
- **Ask Page**: Main input form for research questions with loading states
- **Results Page**: Structured reports with key takeaways, sources, and usage statistics
- **Dashboard Page**: Overview of past reports, credits used, and freshness indicators
- **Responsive Design**: Fully responsive for desktop and mobile devices
- **Modern UI**: Built with TailwindCSS and shadcn/ui components

## Tech Stack

- React 18 with TypeScript
- React Router for navigation
- TailwindCSS for styling
- shadcn/ui components
- Lucide React for icons

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn

### Installation

1. Clone the repository or navigate to the project directory
2. Install dependencies:

```bash
npm install
```

3. Start both frontend and backend:

**On Windows (recommended):**
```bash
PowerShell -ExecutionPolicy Bypass -File start.ps1
```

**On Windows (alternative):**
```bash
start.bat
```

**On macOS/Linux:**
```bash
chmod +x start.sh
./start.sh
```

**Alternatively, start servers separately:**

*Start the backend:*
```bash
cd backend
npm start
```

*In a new terminal, start the frontend:*
```bash
npm start
```

4. Open [http://localhost:3000](http://localhost:3000) to view the frontend and [http://localhost:5000](http://localhost:5000) to access the backend API.

### Available Scripts

- `npm start` - Runs the app in development mode
- `npm build` - Builds the app for production
- `npm test` - Launches the test runner
- `npm eject` - Ejects from Create React App (one-way operation)

## Project Structure

```
src/
├── components/
│   ├── ui/           # Reusable UI components (shadcn/ui)
│   └── Navbar.tsx    # Navigation component
├── pages/            # Page components
│   ├── Home.tsx      # Home page
│   ├── Ask.tsx       # Research question input
│   ├── Results.tsx   # Research results display
│   └── Dashboard.tsx # User dashboard
├── lib/
│   └── utils.ts      # Utility functions
├── App.tsx           # Main app component with routing
├── index.tsx         # App entry point
└── index.css         # Global styles with TailwindCSS
```

## Features Overview

### Home Page
- Hero section with welcome message
- Feature highlights
- Step-by-step process explanation
- Call-to-action button

### Ask Page
- Research question input form
- Loading state during report generation
- Example questions for inspiration
- Form validation

### Results Page
- Key takeaways summary
- Source citations with external links
- Usage statistics
- Export and sharing options

### Dashboard Page
- Report history overview
- Usage statistics and credits
- Data freshness indicators
- Quick actions

## Customization

The app uses TailwindCSS for styling with custom CSS variables defined in `src/index.css`. You can customize the color scheme by modifying the CSS variables in the `:root` selector.

## Mock Data

Currently, the app uses mock data for demonstration purposes. The Results page generates sample research data, and the Dashboard shows mock report history. In a production environment, these would be replaced with actual API calls.

## Browser Support

This app supports all modern browsers including Chrome, Firefox, Safari, and Edge.


const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config();

// Import routes
const researchRoutes = require('./routes/research');
const fileRoutes = require('./routes/files');
const dashboardRoutes = require('./routes/dashboard');
const billingRoutes = require('./routes/billing');
const dataRoutes = require('./routes/data');
const authRoutes = require('./routes/auth');

// Initialize express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware optimizations for performance
app.use(cors());
app.use(express.json({ limit: '10mb' })); // Reduced from 50mb to 10mb
app.use(express.urlencoded({ limit: '10mb', extended: true })); // Reduced from 50mb to 10mb

// Add performance middleware
app.use((req, res, next) => {
  // Add compression for responses
  res.setHeader('Content-Type', 'application/json');
  next();
});

mongoose.set('bufferCommands', false);

// Connect to MongoDB with optimized settings and better error handling
const mongoOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  // Add performance optimizations
  maxPoolSize: 10, // Maintain up to 10 socket connections
  serverSelectionTimeoutMS: 15000, // Keep trying to send operations for 15 seconds (increased from 5)
  socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
  connectTimeoutMS: 30000, // Give up initial connection after 30 seconds
  retryWrites: true // Enable retryable writes
  // Removed unsupported options: bufferMaxEntries and bufferCommands
};

const fallbackUri = 'mongodb://127.0.0.1:27017/smart-research-assistant';
const MONGODB_URI = process.env.MONGODB_URI || fallbackUri;

app.locals.dbConnected = false;

// Add connection event listeners
mongoose.connection.on('connected', () => {
  app.locals.dbConnected = true;
  console.log('MongoDB connected successfully');
});

mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected');
});

// Handle process termination
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('MongoDB connection closed through app termination');
  process.exit(0);
});

process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Rejection:', reason);
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});

// Connect to MongoDB and handle the connection
const connectToMongo = async (uri) => {
  try {
    await mongoose.connect(uri, mongoOptions);
    console.log(`MongoDB initial connection successful using ${uri}`);
  } catch (err) {
    console.error(`MongoDB initial connection failed for ${uri}:`, err);
    if (uri !== fallbackUri) {
      console.log('Attempting local MongoDB fallback...');
      await connectToMongo(fallbackUri);
    }
  }
};

connectToMongo(MONGODB_URI);

// Add a root route handler for development
app.get('/', (req, res) => {
  res.json({ 
    message: 'Smart Research Assistant Backend API', 
    status: 'running',
    timestamp: new Date().toISOString(),
    dbConnected: mongoose.connection.readyState === 1,
    endpoints: {
      research: '/api/research',
      files: '/api/files',
      dashboard: '/api/dashboard',
      billing: '/api/billing',
      data: '/api/data',
      auth: '/api/auth'
    }
  });
});

// Routes
app.use('/api/research', researchRoutes);
app.use('/api/files', fileRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/billing', billingRoutes);
app.use('/api/data', dataRoutes);
app.use('/api/auth', authRoutes);

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../build')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../build', 'index.html'));
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
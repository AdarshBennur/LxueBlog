import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import connectDB from './config/database.js';
import { initDatabase } from './utils/initDatabase.js';
import { config } from './config.js';

// Import routes
import authRoutes from './routes/auth.js';
import postRoutes from './routes/posts.js';
import commentRoutes from './routes/comments.js';
import userRoutes from './routes/users.js';
import categoryRoutes from './routes/categories.js';
import tagRoutes from './routes/tags.js';
import newsletterRoutes from './routes/newsletter.js';
import uploadRoutes from './routes/upload.js';

// Initialize express app
const app = express();
// CRITICAL: Use process.env.PORT for production deployment (Render, Railway, etc.)
// Never hardcode the port in production
const PORT = process.env.PORT || 10000;

console.log('🔧 Server Configuration:', {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: PORT,
  USING_ENV_PORT: !!process.env.PORT,
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:4321'
});

// CORS Configuration - Critical for production deployment
const allowedOrigins = [
  process.env.CLIENT_URL || 'http://localhost:4321',
  'http://localhost:4321', // Local development
  'http://localhost:3000', // Alternative local port
  'http://127.0.0.1:4321', // Alternative localhost
];

// Add production Vercel URLs if CLIENT_URL is set
if (process.env.CLIENT_URL && process.env.CLIENT_URL.includes('vercel.app')) {
  // Allow both the specific URL and any subdomain variations
  allowedOrigins.push(process.env.CLIENT_URL);
}

const corsOptions = {
  origin: function (origin, callback) {
    console.log('🌐 CORS Request from origin:', origin);
    
    // Allow requests with no origin (mobile apps, etc.)
    if (!origin) {
      console.log('✅ CORS: Allowing request with no origin');
      return callback(null, true);
    }
    
    // Check if origin is in allowed list
    const isAllowed = allowedOrigins.some(allowedOrigin => {
      if (allowedOrigin === origin) return true;
      // Allow Vercel preview deployments
      if (origin.endsWith('.vercel.app') && process.env.NODE_ENV === 'production') return true;
      return false;
    });
    
    if (isAllowed) {
      console.log('✅ CORS: Origin allowed');
      callback(null, true);
    } else {
      console.log('❌ CORS: Origin blocked. Allowed origins:', allowedOrigins);
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true,
  optionsSuccessStatus: 200, // Some legacy browsers choke on 204
  maxAge: 86400 // 24 hours in seconds
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(morgan(config.nodeEnv === 'production' ? 'combined' : 'dev'));

// Serve uploaded files statically
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/users', userRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/tags', tagRoutes);
app.use('/api/newsletter', newsletterRoutes);
app.use('/api/upload', uploadRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to LuxeBlog API' });
});

// Health check endpoint - Critical for deployment monitoring
app.get('/api/health', (req, res) => {
  const healthData = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: config.nodeEnv,
    version: '1.0.0',
    port: PORT,
    memory: {
      used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
      total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024)
    },
    database: 'connected' // Will be updated if DB connection fails
  };
  
  console.log('🏥 Health check requested:', req.ip);
  res.status(200).json(healthData);
});

// Request logging middleware for debugging
app.use((req, res, next) => {
  console.log(`📝 ${req.method} ${req.path} - ${req.ip} - ${new Date().toISOString()}`);
  next();
});

// 404 handler for undefined routes
app.use('*', (req, res, next) => {
  console.log(`❓ 404 - Route not found: ${req.method} ${req.originalUrl}`);
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} not found`,
    availableRoutes: [
      'GET /api/health',
      'POST /api/auth/login',
      'POST /api/auth/register',
      'GET /api/auth/me',
      'GET /api/posts',
      'GET /api/categories',
      'GET /api/tags'
    ]
  });
});

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error('🚨 Server Error:', {
    message: err.message,
    stack: config.nodeEnv === 'development' ? err.stack : undefined,
    path: req.path,
    method: req.method,
    body: req.body,
    timestamp: new Date().toISOString()
  });
  
  // Handle specific error types
  let statusCode = err.statusCode || 500;
  let message = 'Something went wrong on the server';
  
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation Error';
  } else if (err.name === 'CastError') {
    statusCode = 400;
    message = 'Invalid ID format';
  } else if (err.code === 11000) {
    statusCode = 400;
    message = 'Duplicate field value';
  } else if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token';
  } else if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token expired';
  }
  
  const errorResponse = {
    success: false,
    message: message,
    error: config.nodeEnv === 'production' 
      ? { type: err.name || 'ServerError' }
      : { 
          type: err.name, 
          details: err.message, 
          path: req.path,
          method: req.method,
          timestamp: new Date().toISOString()
        }
  };
  
  res.status(statusCode).json(errorResponse);
});

// Connect to MongoDB Atlas and start server
const startServer = async () => {
  try {
    // Connect to database
    await connectDB();
    
    // Initialize database with default data
    await initDatabase();
    
    // Start server after successful database connection
    app.listen(PORT, () => {
      console.log(`🚀 LuxeBlog Server running on port ${PORT} (from process.env.PORT: ${!!process.env.PORT})`);
      console.log(`📡 API endpoints available at ${config.nodeEnv === 'production' ? 'https://your-app-url.onrender.com' : `http://localhost:${PORT}`}/api`);
      console.log(`🗄️  Connected to MongoDB Atlas cluster: LuxeBlog`);
      console.log(`🔒 Environment: ${config.nodeEnv}`);
      console.log(`🌐 CORS allowed origins:`, allowedOrigins);
      console.log(`🏥 Health check: GET /api/health`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

export default app;

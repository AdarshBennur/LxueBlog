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
// Directly use process.env.PORT for Render compatibility, fallback to 10000 for local development
const PORT = process.env.PORT || 10000;

// Middleware
const corsOptions = {
  origin: process.env.CLIENT_URL || 'http://localhost:4321',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
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

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'ok', 
    timestamp: Date.now(),
    environment: config.nodeEnv,
    uptime: process.uptime()
  });
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
      console.log(`🚀 LuxeBlog Server running on port ${PORT} (from process.env.PORT)`);
      console.log(`📡 API endpoints available at ${config.nodeEnv === 'production' ? 'https://your-app-url.onrender.com' : `http://localhost:${PORT}`}/api`);
      console.log(`🗄️  Connected to MongoDB Atlas cluster: LuxeBlog`);
      console.log(`🔒 Environment: ${config.nodeEnv}`);
      console.log(`🌐 CORS allowed origin: ${corsOptions.origin}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('ERROR:', err.message);
  console.error(err.stack);
  
  // Detailed error in development, sanitized in production
  const errorResponse = {
    message: 'Something went wrong on the server',
    error: config.nodeEnv === 'production' 
      ? { type: err.name || 'ServerError' }
      : { type: err.name, details: err.message, path: req.path }
  };
  
  res.status(err.statusCode || 500).json(errorResponse);
});

export default app;

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
const PORT = config.port;

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

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

// Connect to MongoDB Atlas and start server
const startServer = async () => {
  try {
    // Connect to database
    await connectDB();
    
    // Initialize database with default data
    await initDatabase();
    
    // Start server after successful database connection
    app.listen(PORT, () => {
      console.log(`🚀 LuxeBlog Server running on port ${PORT}`);
      console.log(`📡 API endpoints available at http://localhost:${PORT}/api`);
      console.log(`🗄️  Connected to MongoDB Atlas cluster: LuxeBlog`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Something went wrong on the server',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

export default app;

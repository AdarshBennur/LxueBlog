import dotenv from 'dotenv';

// Load environment variables from .env file (local development only)
dotenv.config();

// Validate required environment variables in production
const requiredEnvVars = {
  production: ['MONGODB_URI', 'JWT_SECRET', 'CLIENT_URL'],
  development: []
};

const currentEnv = process.env.NODE_ENV || 'development';
const missing = requiredEnvVars[currentEnv]?.filter(varName => !process.env[varName]) || [];

if (missing.length > 0 && currentEnv === 'production') {
  console.error('❌ Missing required environment variables for production:', missing);
  console.error('Please set these variables in your deployment platform (Render dashboard)');
  process.exit(1);
}

export const config = {
  port: process.env.PORT || 10000,
  mongodbUri: process.env.MONGODB_URI || 'mongodb+srv://adiluxe:luxe000@luxeblog.uf01fwt.mongodb.net/?retryWrites=true&w=majority&appName=LuxeBlog',
  jwtSecret: process.env.JWT_SECRET || 'luxeblog_super_secret_jwt_key_2024_secure',
  jwtExpire: process.env.JWT_EXPIRE || '30d',
  nodeEnv: currentEnv,
  clientUrl: process.env.CLIENT_URL || 'http://localhost:4321'
};

// Log configuration (hide secrets in production)
console.log('⚙️  Configuration loaded:', {
  nodeEnv: config.nodeEnv,
  port: config.port,
  clientUrl: config.clientUrl,
  jwtExpire: config.jwtExpire,
  mongodbUri: config.mongodbUri.includes('mongodb+srv') ? '[MONGODB_ATLAS_CONNECTION]' : config.mongodbUri,
  jwtSecret: config.jwtSecret.length > 10 ? '[JWT_SECRET_SET]' : '[DEFAULT_JWT_SECRET]'
});

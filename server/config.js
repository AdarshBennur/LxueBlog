import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

export const config = {
  port: process.env.PORT || 10000,
  mongodbUri: process.env.MONGODB_URI || 'mongodb+srv://adiluxe:luxe000@luxeblog.uf01fwt.mongodb.net/?retryWrites=true&w=majority&appName=LuxeBlog',
  jwtSecret: process.env.JWT_SECRET || 'luxeblog_super_secret_jwt_key_2024_secure',
  jwtExpire: process.env.JWT_EXPIRE || '30d',
  nodeEnv: process.env.NODE_ENV || 'development',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:4321'
};

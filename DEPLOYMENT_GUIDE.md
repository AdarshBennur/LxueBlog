# LuxeBlog Production Deployment Guide

## Overview
This guide provides step-by-step instructions for deploying LuxeBlog to production:
- **Frontend**: Vercel (Static Site)
- **Backend**: Render (Node.js Service)

## 🚨 Critical Issues Fixed

### 1. **Hardcoded API URLs** ❌ → ✅ **FIXED**
**Problem**: Frontend login/signup pages were hardcoded to `http://localhost:3001/api`
**Solution**: Updated to use `PUBLIC_API_URL` environment variable with correct fallback port (10000)

### 2. **Port Mismatch** ❌ → ✅ **FIXED** 
**Problem**: Frontend expected port 3001, backend used 10000
**Solution**: Standardized on port 10000 for local development, `process.env.PORT` for production

### 3. **CORS Configuration** ❌ → ✅ **FIXED**
**Problem**: CORS was basic and didn't handle Vercel deployments properly
**Solution**: Enhanced CORS with:
- Support for Vercel preview deployments (*.vercel.app)
- Detailed logging for debugging
- Proper error handling
- Multiple allowed origins for development

### 4. **Error Handling** ❌ → ✅ **FIXED**
**Problem**: Generic "An error occurred" messages hid actual issues
**Solution**: Added:
- Detailed request logging
- Specific error types (JWT, Validation, etc.)
- Better error messages in development
- Sanitized errors in production

### 5. **Environment Variables** ❌ → ✅ **FIXED**
**Problem**: Confusion between local .env and production environment variables
**Solution**: 
- Clear separation: `.env` for local only, deployment platform for production
- Environment validation in production
- Example files with documentation

## 📋 Pre-Deployment Checklist

### Backend Prerequisites
- [ ] MongoDB Atlas cluster is set up and accessible
- [ ] Database credentials are secure and working
- [ ] JWT secret is generated and secure

### Frontend Prerequisites  
- [ ] All API calls use `PUBLIC_API_URL` (not hardcoded URLs)
- [ ] Build process works locally (`npm run build`)

## 🚀 Backend Deployment (Render)

### Step 1: Create Render Service
1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure service:
   - **Name**: `luxeblog-backend`
   - **Environment**: `Node`
   - **Region**: Choose closest to your users
   - **Branch**: `main` (or your production branch)
   - **Root Directory**: `server`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

### Step 2: Set Environment Variables
In Render Dashboard → Your Service → Environment:

```bash
NODE_ENV=production
MONGODB_URI=mongodb+srv://your-username:your-password@cluster.mongodb.net/luxeblog?retryWrites=true&w=majority
JWT_SECRET=your-super-secure-jwt-secret-here-make-it-long-and-random
JWT_EXPIRE=30d
CLIENT_URL=https://your-frontend-app.vercel.app
```

⚠️ **CRITICAL**: 
- Do NOT set `PORT` - Render sets this automatically
- Replace `CLIENT_URL` with your actual Vercel URL after frontend deployment
- Use a strong, unique `JWT_SECRET` (not the default one)

### Step 3: Deploy
1. Click "Create Web Service"
2. Wait for deployment to complete
3. Note your backend URL: `https://your-service-name.onrender.com`
4. Test health endpoint: `https://your-service-name.onrender.com/api/health`

## 🌐 Frontend Deployment (Vercel)

### Step 1: Create Vercel Project
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your GitHub repository
4. Configure project:
   - **Framework Preset**: Astro
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

### Step 2: Set Environment Variables
In Vercel Dashboard → Your Project → Settings → Environment Variables:

```bash
PUBLIC_API_URL=https://your-backend-service.onrender.com/api
```

⚠️ **CRITICAL**: Replace with your actual Render backend URL

### Step 3: Deploy
1. Click "Deploy"
2. Wait for deployment to complete
3. Note your frontend URL: `https://your-project.vercel.app`
4. Update backend `CLIENT_URL` environment variable with this URL

### Step 4: Update Backend CORS
1. Go back to Render Dashboard
2. Update `CLIENT_URL` environment variable with your Vercel URL
3. Redeploy the backend service

## 🔧 Post-Deployment Configuration

### Update Backend CLIENT_URL
After frontend deployment, update the backend environment variable:
1. Render Dashboard → Your Backend Service → Environment
2. Update `CLIENT_URL` to your Vercel URL
3. Save and redeploy

### Test Everything
1. **Health Check**: `https://your-backend.onrender.com/api/health`
2. **Frontend**: Visit your Vercel URL
3. **Authentication**: Try login/signup
4. **API Calls**: Check browser console for any CORS errors

## 🐛 Troubleshooting

### Common Issues

#### "Cannot GET /api/health"
- **Cause**: Backend not deployed or crashed
- **Solution**: Check Render logs, ensure all environment variables are set

#### "CORS Error" in browser
- **Cause**: `CLIENT_URL` doesn't match your Vercel domain
- **Solution**: Update `CLIENT_URL` in Render dashboard, redeploy

#### "An error occurred. Please try again."
- **Cause**: Network error or server error
- **Solution**: Check browser console and Render logs for detailed error

#### Authentication fails silently
- **Cause**: JWT_SECRET mismatch or database connection issue
- **Solution**: Verify MongoDB URI and JWT_SECRET in Render

### Debugging Tools

#### Check Backend Logs
```bash
# Render Dashboard → Your Service → Logs
# Look for startup messages and error logs
```

#### Check Frontend Console
```javascript
// Browser Developer Tools → Console
// Look for API request errors and CORS issues
```

#### Test API Directly
```bash
# Test health endpoint
curl https://your-backend.onrender.com/api/health

# Test authentication
curl -X POST https://your-backend.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"testpass"}'
```

## 📁 File Structure After Deployment

```
LuxeBlog/
├── client/                 # Frontend (Deployed to Vercel)
│   ├── vercel.json        # Vercel configuration
│   ├── astro.config.mjs   # Enhanced Astro config
│   ├── env.example        # Environment variables example
│   └── src/
│       ├── pages/
│       │   ├── login.astro    # Fixed API URLs
│       │   └── signup.astro   # Fixed API URLs
│       └── lib/
│           └── api.ts         # Fixed port configuration
├── server/                # Backend (Deployed to Render)
│   ├── env.example       # Environment variables example
│   ├── config.js         # Enhanced configuration
│   ├── index.js          # Improved error handling & CORS
│   └── package.json      # Updated scripts
└── DEPLOYMENT_GUIDE.md   # This file
```

## 🔒 Security Notes

1. **Never commit `.env` files** - Use `.env.example` instead
2. **Use strong JWT secrets** - Generate random 64+ character strings
3. **Restrict CORS origins** - Only allow your actual frontend domain
4. **Use HTTPS only** - Both Render and Vercel provide HTTPS by default
5. **Secure MongoDB** - Use MongoDB Atlas with IP whitelisting and strong passwords

## 📝 Environment Variables Summary

### Backend (Render)
```bash
NODE_ENV=production                                    # Required
MONGODB_URI=mongodb+srv://...                         # Required  
JWT_SECRET=your-secure-secret                         # Required
CLIENT_URL=https://your-app.vercel.app                # Required
JWT_EXPIRE=30d                                        # Optional
```

### Frontend (Vercel)
```bash
PUBLIC_API_URL=https://your-backend.onrender.com/api  # Required
```

## ✅ Success Indicators

Your deployment is successful when:
- [ ] Health endpoint returns 200 OK with JSON response
- [ ] Frontend loads without console errors
- [ ] Login/signup work without "CORS" or "fetch" errors
- [ ] All API calls succeed (check Network tab)
- [ ] Authentication persists across page refreshes

## 🆘 Support

If you encounter issues:
1. Check this guide first
2. Review Render and Vercel logs
3. Test API endpoints directly with curl
4. Verify all environment variables are set correctly
5. Ensure MongoDB Atlas allows connections from 0.0.0.0/0 (or Render's IPs)

---

**Last Updated**: $(date)
**Status**: ✅ Production Ready

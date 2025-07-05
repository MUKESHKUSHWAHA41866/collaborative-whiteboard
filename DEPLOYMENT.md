# 🚀 Production Deployment Guide

## Environment Variables Configuration

### Required Environment Variables

#### Server (.env)
\`\`\`env
# MongoDB Connection (REQUIRED)
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/whiteboard?retryWrites=true&w=majority

# Server Configuration
PORT=5000
NODE_ENV=production

# Client URL (REQUIRED for CORS)
CLIENT_URL=https://your-frontend-domain.com

# Database Pool Configuration
DB_MAX_POOL_SIZE=20
DB_MIN_POOL_SIZE=5
\`\`\`

#### Client (.env)
\`\`\`env
# API Configuration
REACT_APP_API_URL=https://your-backend-domain.com
REACT_APP_SOCKET_URL=https://your-backend-domain.com
\`\`\`

## 🌐 Deployment Platforms

### Option 1: Vercel (Frontend) + Railway (Backend)

#### Deploy Backend to Railway:
1. Connect GitHub repository
2. Select server folder
3. Add environment variables:
   - \`MONGODB_URI\`
   - \`CLIENT_URL\` (your Vercel domain)
   - \`DB_MAX_POOL_SIZE=20\`
   - \`DB_MIN_POOL_SIZE=5\`

#### Deploy Frontend to Vercel:
1. Connect GitHub repository
2. Select client folder
3. Add environment variables:
   - \`REACT_APP_API_URL\` (your Railway domain)
   - \`REACT_APP_SOCKET_URL\` (your Railway domain)

### Option 2: Heroku (Full Stack)

#### Prepare for Heroku:
\`\`\`bash
# Add Procfile in root
echo "web: cd server && npm start" > Procfile

# Add engines to server/package.json
"engines": {
  "node": ">=18.0.0",
  "npm": ">=8.0.0"
}
\`\`\`

#### Deploy to Heroku:
\`\`\`bash
heroku create your-app-name
heroku config:set MONGODB_URI="your-mongodb-uri"
heroku config:set CLIENT_URL="https://your-app-name.herokuapp.com"
heroku config:set DB_MAX_POOL_SIZE=20
heroku config:set DB_MIN_POOL_SIZE=5
git push heroku main
\`\`\`

## 📊 Performance Optimization

### Database Pool Configuration

For different deployment sizes:

#### Small Scale (< 100 concurrent users)
\`\`\`env
DB_MAX_POOL_SIZE=10
DB_MIN_POOL_SIZE=2
\`\`\`

#### Medium Scale (100-500 concurrent users)
\`\`\`env
DB_MAX_POOL_SIZE=20
DB_MIN_POOL_SIZE=5
\`\`\`

#### Large Scale (500+ concurrent users)
\`\`\`env
DB_MAX_POOL_SIZE=50
DB_MIN_POOL_SIZE=10
\`\`\`

## 🔒 Security Configuration

### Production Security Headers
The server now includes enhanced CORS configuration that:
- ✅ Uses CLIENT_URL for secure origin validation
- ✅ Blocks unauthorized domains
- ✅ Supports credentials for authenticated requests
- ✅ Logs blocked CORS attempts

### MongoDB Security
- ✅ Connection pooling for optimal performance
- ✅ Automatic reconnection handling
- ✅ Graceful shutdown procedures
- ✅ Connection monitoring and health checks

## 📈 Monitoring and Health Checks

### Available Endpoints:
- \`/api/health\` - Complete system health
- \`/api/db-status\` - Database connection status
- \`/\` - Basic API information

### Health Check Response:
\`\`\`json
{
  "status": "OK",
  "database": {
    "status": "healthy",
    "readyState": 1,
    "host": "cluster0.xxxxx.mongodb.net"
  },
  "server": {
    "uptime": 3600,
    "memory": {...},
    "environment": "production"
  },
  "configuration": {
    "clientUrl": "https://your-frontend.com",
    "maxPoolSize": "20",
    "minPoolSize": "5"
  }
}
\`\`\`

## 🚀 Deployment Checklist

- [ ] MongoDB Atlas cluster created and configured
- [ ] Environment variables set correctly
- [ ] CLIENT_URL matches frontend domain
- [ ] Database pool sizes configured for expected load
- [ ] CORS origins properly configured
- [ ] Health check endpoints accessible
- [ ] Socket.IO connection working
- [ ] Real-time features tested
- [ ] Mobile responsiveness verified
- [ ] Performance monitoring set up

Your collaborative whiteboard is now production-ready with optimized database connections and proper environment configuration!
\`\`\`

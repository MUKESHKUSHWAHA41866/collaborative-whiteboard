# 🚀 Complete Setup Guide for Collaborative Whiteboard

## 📋 Prerequisites

1. **Node.js** (v14 or higher) - [Download here](https://nodejs.org/)
2. **MongoDB** - Choose one option:
   - Local MongoDB installation
   - MongoDB Atlas (cloud database) - **Recommended**
3. **Git** (optional, for cloning)

## 🗂️ Project Structure Setup

\`\`\`bash
# Create project directory
mkdir collaborative-whiteboard
cd collaborative-whiteboard

# Create the following structure:
collaborative-whiteboard/
├── client/                 # React frontend
├── server/                 # Node.js backend
├── package.json           # Root package file
└── README.md
\`\`\`

## ⚙️ Step-by-Step Installation

### 1. Install Dependencies

\`\`\`bash
# Install root dependencies
npm install

# Install client dependencies
cd client
npm install

# Install server dependencies
cd ../server
npm install

# Return to root
cd ..
\`\`\`

### 2. MongoDB Setup Options

#### Option A: MongoDB Atlas (Recommended)

1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a free account
3. Create a new cluster (free tier available)
4. Create a database user:
   - Go to Database Access
   - Add New Database User
   - Choose password authentication
   - Save username and password
5. Whitelist your IP:
   - Go to Network Access
   - Add IP Address
   - Add Current IP Address or 0.0.0.0/0 for all IPs
6. Get connection string:
   - Go to Clusters → Connect
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password

#### Option B: Local MongoDB

\`\`\`bash
# macOS with Homebrew
brew tap mongodb/brew
brew install mongodb-community

# Start MongoDB
brew services start mongodb-community

# Ubuntu/Debian
sudo apt-get install mongodb

# Windows
# Download from https://www.mongodb.com/try/download/community
\`\`\`

### 3. Environment Configuration

Create `.env` file in the `server` directory:

\`\`\`bash
cd server
touch .env
\`\`\`

Add your configuration:

\`\`\`env
# MongoDB Atlas (replace with your connection string)
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/whiteboard?retryWrites=true&w=majority

# OR Local MongoDB
# MONGODB_URI=mongodb://localhost:27017/whiteboard

# Server Configuration
PORT=5000
NODE_ENV=development

# Optional: For production deployment
# CLIENT_URL=https://your-frontend-domain.com
\`\`\`

### 4. Verify Setup

Test your MongoDB connection:

\`\`\`bash
cd server
node -e "
require('dotenv').config();
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI)
  .then(() => { console.log('✅ MongoDB connection successful!'); process.exit(0); })
  .catch(err => { console.error('❌ MongoDB connection failed:', err.message); process.exit(1); });
"
\`\`\`

## 🚀 Running the Application

### Method 1: Run Both Together (Recommended)

\`\`\`bash
# From root directory
npm run dev
\`\`\`

### Method 2: Run Separately

**Terminal 1 - Server:**
\`\`\`bash
cd server
npm run dev
\`\`\`

**Terminal 2 - Client:**
\`\`\`bash
cd client
npm start
\`\`\`

## 🌐 Access the Application

1. Open browser to: `http://localhost:3000`
2. Server API: `http://localhost:5000`
3. Health check: `http://localhost:5000/api/health`

## 🔧 Troubleshooting

### MongoDB Connection Issues

**Error: "MongoNetworkError"**
\`\`\`bash
# Check if MongoDB is running (local)
brew services list | grep mongodb

# Restart MongoDB service
brew services restart mongodb-community
\`\`\`

**Error: "Authentication failed"**
- Verify username/password in connection string
- Check database user permissions in Atlas

**Error: "Server selection timeout"**
- Check internet connection
- Verify IP whitelist in Atlas
- Check firewall settings

### Port Issues

**Error: "EADDRINUSE"**
\`\`\`bash
# Find and kill process using port
lsof -ti:3000 | xargs kill -9
lsof -ti:5000 | xargs kill -9
\`\`\`

### Module Issues

**Error: "Cannot find module"**
\`\`\`bash
# Clean install dependencies
rm -rf node_modules package-lock.json
npm install

# Do the same for client and server directories
\`\`\`

## 📱 Testing Features

### Basic Testing
1. ✅ Join/create room with code
2. ✅ Draw on canvas
3. ✅ Change colors and stroke width
4. ✅ Clear canvas
5. ✅ Undo/Redo (Ctrl+Z, Ctrl+Y)

### Collaboration Testing
1. ✅ Open multiple browser tabs
2. ✅ Join same room
3. ✅ Draw in one tab, see in others
4. ✅ Cursor tracking
5. ✅ Real-time synchronization

### Mobile Testing
1. ✅ Touch drawing
2. ✅ Responsive design
3. ✅ Touch instructions

## 🚀 Production Deployment

### Environment Variables for Production

\`\`\`env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/whiteboard
PORT=5000
NODE_ENV=production
CLIENT_URL=https://your-frontend-domain.com
\`\`\`

### Deployment Platforms

**Backend Options:**
- Railway
- Heroku
- Render
- DigitalOcean App Platform

**Frontend Options:**
- Vercel
- Netlify
- GitHub Pages

## 📞 Support

If you encounter issues:

1. Check console for error messages
2. Verify environment variables
3. Test MongoDB connection
4. Check port availability
5. Review firewall settings

## 🎉 Success Indicators

You'll know everything is working when:
- ✅ Server starts without errors
- ✅ MongoDB connection successful
- ✅ Client loads at localhost:3000
- ✅ Can create and join rooms
- ✅ Drawing works smoothly
- ✅ Real-time collaboration functions

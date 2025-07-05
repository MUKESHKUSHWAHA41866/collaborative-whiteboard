# 🏠 Local Development Setup Guide

## 📋 Prerequisites

1. **Node.js** (v14 or higher) - [Download here](https://nodejs.org/)
2. **MongoDB** (choose one option):
   - **Option A**: Local MongoDB installation
   - **Option B**: MongoDB Atlas (cloud database)

## 🚀 Quick Start

### 1. Install Dependencies
\`\`\`bash
# Install all dependencies at once
npm run install-all
\`\`\`

### 2. Setup Environment Variables

#### Create \`server/.env\`:
\`\`\`env
# For Local MongoDB
MONGODB_URI=mongodb://localhost:27017/whiteboard

# For MongoDB Atlas (if preferred)
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/whiteboard

PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:3000
DB_MAX_POOL_SIZE=10
DB_MIN_POOL_SIZE=5
\`\`\`

#### Create \`client/.env\`:
\`\`\`env
REACT_APP_API_URL=http://localhost:5000
REACT_APP_SOCKET_URL=http://localhost:5000
NODE_ENV=development
\`\`\`

### 3. Start MongoDB (if using local MongoDB)
\`\`\`bash
# macOS with Homebrew
brew services start mongodb-community

# Or start manually
mongod

# Ubuntu/Debian
sudo systemctl start mongod

# Windows
# Start MongoDB service from Services panel
\`\`\`

### 4. Run the Application
\`\`\`bash
# Start both client and server together
npm run dev

# OR run separately in different terminals:
# Terminal 1:
npm run server

# Terminal 2:
npm run client
\`\`\`

## 🌐 Access Your Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Health Check**: http://localhost:5000/api/health

## 🔍 Verify Everything is Working

### 1. Check Backend Health
Open browser to: http://localhost:5000/api/health

You should see:
\`\`\`json
{
  "status": "OK",
  "database": {
    "status": "healthy"
  },
  "configuration": {
    "clientUrl": "http://localhost:3000",
    "maxPoolSize": "10",
    "minPoolSize": "5"
  }
}
\`\`\`

### 2. Test the Whiteboard
1. Go to http://localhost:3000
2. Enter a room code (e.g., "TEST123")
3. Start drawing on the canvas
4. Open another browser tab/window
5. Join the same room
6. Draw in one tab - should appear in the other

## 🔧 Troubleshooting

### MongoDB Connection Issues

**Error: "MongoNetworkError"**
\`\`\`bash
# Check if MongoDB is running
brew services list | grep mongodb

# Start MongoDB
brew services start mongodb-community
\`\`\`

**Using MongoDB Atlas instead:**
1. Go to https://mongodb.com/atlas
2. Create free cluster
3. Get connection string
4. Update MONGODB_URI in server/.env

### Port Already in Use

**Error: "EADDRINUSE"**
\`\`\`bash
# Kill processes on ports
lsof -ti:3000 | xargs kill -9
lsof -ti:5000 | xargs kill -9
\`\`\`

### CORS Issues

**Error: "blocked by CORS"**
- Make sure CLIENT_URL in server/.env is exactly: http://localhost:3000
- Restart the server after changing .env files

## 📊 Development Console Output

When everything is working, you should see:

**Server Console:**
\`\`\`
🔄 Connecting to MongoDB...
✅ MongoDB Connected Successfully!
🚀 Server running on port 5000
🔗 CORS configured for: http://localhost:3000
📡 Socket.IO ready for connections
\`\`\`

**Client Console:**
\`\`\`
✅ Socket connected successfully
👥 Users in room: 1
\`\`\`

## 🎯 Testing Features

### Basic Features:
- ✅ Room creation/joining
- ✅ Drawing with different colors
- ✅ Stroke width adjustment
- ✅ Clear canvas
- ✅ Undo/Redo (Ctrl+Z, Ctrl+Y)

### Collaboration Features:
- ✅ Real-time drawing sync
- ✅ Cursor tracking
- ✅ User count display
- ✅ Multi-user rooms

### Mobile Features:
- ✅ Touch drawing
- ✅ Responsive design
- ✅ Touch instructions

Your local development environment is now ready! 🎉

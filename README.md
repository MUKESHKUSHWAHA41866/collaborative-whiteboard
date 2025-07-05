# Collaborative Whiteboard Application

A real-time collaborative whiteboard application built with the MERN stack (MongoDB, Express.js, React.js, Node.js) and Socket.io for live collaboration.

## Features

- **Room Management**: Join or create whiteboard rooms with simple room codes
- **Real-time Drawing**: Collaborative drawing with live synchronization
- **Cursor Tracking**: See other users' cursor positions in real-time
- **Drawing Tools**: Pencil tool with adjustable stroke width and color selection
- **User Presence**: Display active user count in each room
- **Data Persistence**: Drawing data is saved to MongoDB
- **Responsive Design**: Works on desktop and tablet devices

## 🔧 **Key Features Implemented**
- ✅ Real-time drawing synchronization
- ✅ Multi-user cursor tracking
- ✅ Room-based collaboration
- ✅ Drawing persistence
- ✅ User presence indicators
- ✅ Responsive design
- ✅ No authentication required
- ✅ **Touch support for mobile/tablet devices**
- ✅ **Undo/Redo functionality with keyboard shortcuts**
- ✅ **Drawing history management**
- ✅ **Connection status indicator**
- ✅ **Mobile-optimized interface**

## Technology Stack

- **Frontend**: React.js with styled-components
- **Backend**: Node.js with Express.js
- **Database**: MongoDB with Mongoose
- **Real-time Communication**: Socket.io
- **Styling**: Styled Components

## Project Structure

\`\`\`
collaborative-whiteboard/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── RoomJoin.js
│   │   │   ├── Whiteboard.js
│   │   │   ├── DrawingCanvas.js
│   │   │   ├── Toolbar.js
│   │   │   └── UserCursors.js
│   │   ├── App.js
│   │   ├── index.js
│   │   └── index.css
│   ├── public/
│   └── package.json
├── server/                 # Node.js backend
│   ├── models/
│   │   └── Room.js
│   ├── routes/
│   │   └── rooms.js
│   ├── socket/
│   │   └── socketHandler.js
│   ├── server.js
│   ├── .env
│   └── package.json
├── README.md
└── package.json
\`\`\`

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
   \`\`\`bash
   git clone <repository-url>
   cd collaborative-whiteboard
   \`\`\`

2. **Install dependencies for all packages**
   \`\`\`bash
   npm run install-all
   \`\`\`

3. **Set up environment variables**
   
   Create a `.env` file in the `server` directory:
   \`\`\`env
   MONGODB_URI=mongodb://localhost:27017/whiteboard
   PORT=5000
   NODE_ENV=development
   \`\`\`

4. **Start MongoDB**
   
   Make sure MongoDB is running on your system:
   \`\`\`bash
   # For local MongoDB installation
   mongod
   
   # Or use MongoDB Atlas connection string in .env
   \`\`\`

5. **Run the application**
   
   Start both client and server concurrently:
   \`\`\`bash
   npm run dev
   \`\`\`
   
   Or run them separately:
   \`\`\`bash
   # Terminal 1 - Start server
   npm run server
   
   # Terminal 2 - Start client
   npm run client
   \`\`\`

6. **Access the application**
   
   Open your browser and navigate to `http://localhost:3000`

## API Documentation

### REST Endpoints

#### POST /api/rooms/join
Join or create a whiteboard room.

**Request Body:**
\`\`\`json
{
  "roomId": "ABC123"
}
\`\`\`

**Response:**
\`\`\`json
{
  "success": true,
  "roomId": "ABC123",
  "drawingData": []
}
\`\`\`

#### GET /api/rooms/:roomId
Get room information and drawing data.

**Response:**
\`\`\`json
{
  "roomId": "ABC123",
  "createdAt": "2025-01-07T04:07:52.000Z",
  "lastActivity": "2025-01-07T04:07:52.000Z",
  "drawingData": []
}
\`\`\`

### Socket Events

#### Client to Server Events

- `join-room`: Join a whiteboard room
- `leave-room`: Leave the current room
- `cursor-move`: Send cursor position updates
- `draw-start`: Start a new drawing stroke
- `draw-move`: Continue drawing stroke
- `draw-end`: End current drawing stroke
- `clear-canvas`: Clear the entire canvas

#### Server to Client Events

- `user-count`: Receive updated user count for room
- `cursor-move`: Receive other users' cursor positions
- `user-left`: Notification when a user leaves
- `draw-start`: Receive drawing start from other users
- `draw-move`: Receive drawing data from other users
- `draw-end`: Receive drawing end from other users
- `clear-canvas`: Receive canvas clear command
- `load-drawing-data`: Receive existing drawing data when joining

## Architecture Overview

### Frontend Architecture

The React frontend is organized into reusable components:

- **App.js**: Main application component managing room state
- **RoomJoin.js**: Room code input and room creation interface
- **Whiteboard.js**: Main whiteboard container with socket management
- **DrawingCanvas.js**: HTML5 Canvas drawing implementation
- **Toolbar.js**: Drawing tools and settings
- **UserCursors.js**: Real-time cursor display for other users

### Backend Architecture

The Node.js backend provides:

- **Express Server**: REST API endpoints for room management
- **Socket.io Integration**: Real-time communication handling
- **MongoDB Integration**: Data persistence for rooms and drawings
- **Room Management**: Automatic cleanup of inactive rooms

### Data Flow

1. User joins/creates room via REST API
2. WebSocket connection established for real-time features
3. Drawing actions broadcast to all room participants
4. Drawing data persisted to MongoDB
5. New users receive existing drawing data on join

## 📱 **Mobile & Touch Support**

The application now includes comprehensive touch support:

- **Touch Drawing**: Full support for touch-based drawing on mobile and tablet devices
- **Touch Instructions**: Automatic detection of touch devices with helpful instructions
- **Responsive Design**: Optimized interface for different screen sizes
- **Touch Gestures**: Support for touch events with proper event handling
- **Mobile Toolbar**: Compact toolbar design for smaller screens

## ⏮️ **Drawing History & Undo/Redo**

Advanced drawing history management:

- **Undo/Redo Buttons**: Visual buttons in the toolbar for undo/redo actions
- **Keyboard Shortcuts**: 
  - `Ctrl+Z` (or `Cmd+Z` on Mac) for undo
  - `Ctrl+Y` or `Ctrl+Shift+Z` (or `Cmd+Y`/`Cmd+Shift+Z` on Mac) for redo
- **Real-time Sync**: Undo/redo actions are synchronized across all users
- **State Management**: Efficient canvas state management with history tracking
- **Visual Feedback**: Buttons are disabled when no undo/redo actions are available

## 🎨 **Enhanced Drawing Features**

- **Expanded Color Palette**: 6 colors including purple and yellow
- **Stroke Preview**: Live preview of stroke width and color
- **Connection Status**: Real-time connection indicator
- **Touch Instructions**: Automatic help for touch device users
- **Improved Performance**: Optimized drawing and history management

## 📱 **Mobile Usage Tips**

For the best mobile experience:

1. **Landscape Mode**: Rotate your device to landscape for more drawing space
2. **Touch Drawing**: Use your finger or stylus to draw naturally
3. **Toolbar Access**: All tools are accessible via touch-friendly buttons
4. **Zoom Support**: Use pinch gestures to zoom in/out of the canvas
5. **History Navigation**: Use the undo/redo buttons for easy correction

## 🔧 **Technical Enhancements**

### Touch Event Handling
- Proper touch event prevention to avoid scrolling
- Multi-touch detection and handling
- Touch position calculation with proper offset handling

### History Management
- Canvas state serialization using `toDataURL()`
- Efficient history storage and navigation
- Real-time synchronization of history actions
- Memory-efficient state management

### Performance Optimizations
- Throttled cursor updates for smooth performance
- Efficient canvas redrawing on history navigation
- Optimized touch event handling
- Reduced memory footprint for history storage

## Deployment Guide

### Development Deployment

The application is configured for local development with:
- Client running on `http://localhost:3000`
- Server running on `http://localhost:5000`
- MongoDB connection to local instance

### Production Deployment

For production deployment:

1. **Environment Variables**
   \`\`\`env
   MONGODB_URI=<your-mongodb-atlas-connection-string>
   PORT=5000
   NODE_ENV=production
   \`\`\`

2. **Build the client**
   \`\`\`bash
   cd client
   npm run build
   \`\`\`

3. **Deploy to platforms like:**
   - **Vercel**: For frontend deployment
   - **Heroku**: For full-stack deployment
   - **Railway**: For backend deployment
   - **MongoDB Atlas**: For database hosting

4. **Update CORS settings** in `server/server.js` for production domains

## Performance Considerations

- **Cursor Updates**: Throttled to ~60fps to prevent overwhelming the server
- **Drawing Data**: Incremental updates instead of full canvas data
- **Room Cleanup**: Automatic cleanup of rooms inactive for 24+ hours
- **Connection Management**: Proper cleanup of socket connections and room memberships

## Browser Compatibility

- Modern browsers with HTML5 Canvas support
- WebSocket support required
- Responsive design for desktop and tablet use

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

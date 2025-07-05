// API configuration based on environment
const API_CONFIG = {
  development: {
    baseURL: "http://localhost:5000",
    socketURL: "http://localhost:5000",
  },
  production: {
    baseURL: process.env.REACT_APP_API_URL || "https://your-backend-domain.com",
    socketURL: process.env.REACT_APP_SOCKET_URL || "https://your-backend-domain.com",
  },
}

const environment = process.env.NODE_ENV || "development"
const config = API_CONFIG[environment]

export const API_BASE_URL = config.baseURL
export const SOCKET_URL = config.socketURL

// API endpoints
export const ENDPOINTS = {
  health: "/api/health",
  dbStatus: "/api/db-status",
  joinRoom: "/api/rooms/join",
  getRoom: (roomId) => `/api/rooms/${roomId}`,
}

// Socket events
export const SOCKET_EVENTS = {
  // Connection events
  CONNECT: "connect",
  DISCONNECT: "disconnect",

  // Room events
  JOIN_ROOM: "join-room",
  LEAVE_ROOM: "leave-room",
  USER_COUNT: "user-count",
  USER_LEFT: "user-left",

  // Drawing events
  DRAW_START: "draw-start",
  DRAW_MOVE: "draw-move",
  DRAW_END: "draw-end",
  CLEAR_CANVAS: "clear-canvas",

  // History events
  UNDO_ACTION: "undo-action",
  REDO_ACTION: "redo-action",

  // Cursor events
  CURSOR_MOVE: "cursor-move",

  // Data events
  LOAD_DRAWING_DATA: "load-drawing-data",
}

export default config

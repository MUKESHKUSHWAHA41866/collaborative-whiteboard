const express = require("express")
const http = require("http")
const socketIo = require("socket.io")
const cors = require("cors")
const mongoose = require("mongoose")
require("dotenv").config()

// Import database configuration
const { connectDB, setupConnectionHandlers, checkDatabaseHealth } = require("./config/database")

const app = express()
const server = http.createServer(app)

// Enhanced CORS configuration using CLIENT_URL
const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, etc.)
    if (!origin) return callback(null, true)

    const allowedOrigins = [process.env.CLIENT_URL, "http://localhost:3000", "http://127.0.0.1:3000"].filter(Boolean) // Remove undefined values

    if (process.env.NODE_ENV === "development") {
      // In development, allow any localhost origin
      if (origin.includes("localhost") || origin.includes("127.0.0.1")) {
        return callback(null, true)
      }
    }

    if (allowedOrigins.includes(origin)) {
      callback(null, true)
    } else {
      console.warn(`⚠️  CORS blocked origin: ${origin}`)
      callback(new Error("Not allowed by CORS"))
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}

// Socket.IO configuration with CLIENT_URL
const io = socketIo(server, {
  cors: corsOptions,
  pingTimeout: 60000,
  pingInterval: 25000,
  transports: ["websocket", "polling"],
})

// Middleware
app.use(cors(corsOptions))
app.use(express.json({ limit: "10mb" }))
app.use(express.urlencoded({ extended: true, limit: "10mb" }))

// Request logging middleware
app.use((req, res, next) => {
  if (process.env.NODE_ENV === "development") {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`)
  }
  next()
})

// Health check endpoints
app.get("/", (req, res) => {
  res.send("socket");
  res.json({
    message: "Collaborative Whiteboard API",
    status: "OK",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
    version: "1.0.0",
  })
})

app.get("/api/health", async (req, res) => {
  const dbHealth = await checkDatabaseHealth()

  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    database: dbHealth,
    server: {
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      environment: process.env.NODE_ENV || "development",
      nodeVersion: process.version,
    },
    configuration: {
      clientUrl: process.env.CLIENT_URL || "http://localhost:3000",
      maxPoolSize: process.env.DB_MAX_POOL_SIZE || "10",
      minPoolSize: process.env.DB_MIN_POOL_SIZE || "5",
    },
  })
})

// Database connection status endpoint
app.get("/api/db-status", async (req, res) => {
  const dbHealth = await checkDatabaseHealth()
  res.json(dbHealth)
})

// Initialize database connection
const initializeApp = async () => {
  try {
    console.log("🚀 Initializing Collaborative Whiteboard Server...")
    console.log(`🌍 Environment: ${process.env.NODE_ENV || "development"}`)
    console.log(`🔗 Client URL: ${process.env.CLIENT_URL || "http://localhost:3000"}`)

    // Connect to MongoDB
    await connectDB()
    setupConnectionHandlers()

    // Import models after database connection
    const Room = require("./models/Room")

    // Import routes
    const roomRoutes = require("./routes/rooms")
    app.use("/api/rooms", roomRoutes)

    // Socket handling
    const socketHandler = require("./socket/socketHandler")
    socketHandler(io)

    const PORT = process.env.PORT || 5000

    server.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`)
      console.log(`🌍 Environment: ${process.env.NODE_ENV || "development"}`)
      console.log(`📡 Socket.IO ready for connections`)
      console.log(`🔗 CORS configured for: ${process.env.CLIENT_URL || "http://localhost:3000"}`)

      if (process.env.NODE_ENV !== "production") {
        console.log(`🔗 Local server: http://localhost:${PORT}`)
        console.log(`🔗 Health check: http://localhost:${PORT}/api/health`)
        console.log(`🔗 DB status: http://localhost:${PORT}/api/db-status`)
      }
    })

    // Enhanced room cleanup with better logging
    const cleanupInterval = setInterval(
      async () => {
        try {
          const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000)
          const result = await Room.deleteMany({ lastActivity: { $lt: oneDayAgo } })
          if (result.deletedCount > 0) {
            console.log(`🧹 Cleaned up ${result.deletedCount} old rooms (inactive > 24h)`)
          }

          // Log current room count
          const activeRooms = await Room.countDocuments()
          console.log(`📊 Active rooms: ${activeRooms}`)
        } catch (error) {
          console.error("❌ Error during room cleanup:", error.message)
        }
      },
      60 * 60 * 1000, // Every hour
    )

    // Cleanup interval on shutdown
    process.on("SIGINT", () => {
      clearInterval(cleanupInterval)
    })

    process.on("SIGTERM", () => {
      clearInterval(cleanupInterval)
    })
  } catch (error) {
    console.error("❌ Failed to initialize application:", error.message)
    process.exit(1)
  }
}

// Start the application
initializeApp()

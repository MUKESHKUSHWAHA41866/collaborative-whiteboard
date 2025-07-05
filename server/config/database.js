const mongoose = require("mongoose")

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI

    if (!mongoURI) {
      throw new Error("MONGODB_URI environment variable is not set")
    }

    // Enhanced connection options using environment variables
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      maxPoolSize: Number.parseInt(process.env.DB_MAX_POOL_SIZE) || 10,
      minPoolSize: Number.parseInt(process.env.DB_MIN_POOL_SIZE) || 5,
      maxIdleTimeMS: 30000,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      heartbeatFrequencyMS: 10000,
      retryWrites: true,
      w: "majority",
      // Additional performance optimizations
      // bufferMaxEntries: 0,
      bufferCommands: false,
      autoIndex: process.env.NODE_ENV !== "production", // Disable in production
    }

    console.log("🔄 Connecting to MongoDB...")
    console.log(`📍 URI: ${mongoURI.replace(/\/\/.*@/, "//***:***@")}`) // Hide credentials in logs
    console.log(`📊 Pool Configuration:`)
    console.log(`   - Max Pool Size: ${options.maxPoolSize}`)
    console.log(`   - Min Pool Size: ${options.minPoolSize}`)
    console.log(`   - Environment: ${process.env.NODE_ENV || "development"}`)

    const conn = await mongoose.connect(mongoURI, options)

    console.log(`✅ MongoDB Connected Successfully!`)
    console.log(`📊 Connection Details:`)
    console.log(`   - Host: ${conn.connection.host}`)
    console.log(`   - Database: ${conn.connection.name}`)
    console.log(`   - Port: ${conn.connection.port}`)
    console.log(`   - Ready State: ${conn.connection.readyState}`)

    return conn
  } catch (error) {
    console.error("❌ MongoDB Connection Failed!")
    console.error("Error:", error.message)

    // Provide helpful error messages
    if (error.message.includes("ENOTFOUND")) {
      console.log("💡 Tip: Check your internet connection and MongoDB URI")
    } else if (error.message.includes("authentication failed")) {
      console.log("💡 Tip: Check your MongoDB username and password")
    } else if (error.message.includes("ECONNREFUSED")) {
      console.log("💡 Tip: Make sure MongoDB is running locally or check your Atlas connection")
    } else if (error.message.includes("timeout")) {
      console.log("💡 Tip: Connection timeout - check your network or MongoDB server status")
    }

    process.exit(1)
  }
}

// Enhanced connection event handlers
const setupConnectionHandlers = () => {
  mongoose.connection.on("connected", () => {
    console.log("📡 Mongoose connected to MongoDB")
    console.log(`📊 Active connections: ${mongoose.connection.db?.serverConfig?.connections?.length || "N/A"}`)
  })

  mongoose.connection.on("error", (err) => {
    console.error("❌ Mongoose connection error:", err.message)
  })

  mongoose.connection.on("disconnected", () => {
    console.log("📡 Mongoose disconnected from MongoDB")
  })

  mongoose.connection.on("reconnected", () => {
    console.log("🔄 Mongoose reconnected to MongoDB")
  })

  mongoose.connection.on("close", () => {
    console.log("📡 Mongoose connection closed")
  })

  // Monitor connection pool
  mongoose.connection.on("fullsetup", () => {
    console.log("📊 MongoDB replica set fully connected")
  })

  // Handle app termination gracefully
  process.on("SIGINT", async () => {
    console.log("\n🔄 Shutting down gracefully...")
    try {
      await mongoose.connection.close()
      console.log("✅ MongoDB connection closed successfully")
    } catch (error) {
      console.error("❌ Error closing MongoDB connection:", error.message)
    }
    process.exit(0)
  })

  process.on("SIGTERM", async () => {
    console.log("\n🔄 Received SIGTERM, shutting down gracefully...")
    try {
      await mongoose.connection.close()
      console.log("✅ MongoDB connection closed successfully")
    } catch (error) {
      console.error("❌ Error closing MongoDB connection:", error.message)
    }
    process.exit(0)
  })

  process.on("SIGUSR2", async () => {
    console.log("\n🔄 Received SIGUSR2, shutting down gracefully...")
    try {
      await mongoose.connection.close()
      console.log("✅ MongoDB connection closed successfully")
    } catch (error) {
      console.error("❌ Error closing MongoDB connection:", error.message)
    }
    process.kill(process.pid, "SIGUSR2")
  })
}

// Database health check function
const checkDatabaseHealth = async () => {
  try {
    const adminDb = mongoose.connection.db.admin()
    const result = await adminDb.ping()
    return {
      status: "healthy",
      ping: result,
      readyState: mongoose.connection.readyState,
      host: mongoose.connection.host,
      name: mongoose.connection.name,
    }
  } catch (error) {
    return {
      status: "unhealthy",
      error: error.message,
      readyState: mongoose.connection.readyState,
    }
  }
}

module.exports = { connectDB, setupConnectionHandlers, checkDatabaseHealth }

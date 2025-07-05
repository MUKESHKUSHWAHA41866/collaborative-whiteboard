const validateEnvironment = () => {
  const requiredEnvVars = ["MONGODB_URI"]
  const missingVars = []

  requiredEnvVars.forEach((varName) => {
    if (!process.env[varName]) {
      missingVars.push(varName)
    }
  })

  if (missingVars.length > 0) {
    console.error("❌ Missing required environment variables:")
    missingVars.forEach((varName) => {
      console.error(`   - ${varName}`)
    })
    console.log("\n💡 Please create a .env file in the server directory with:")
    console.log("   MONGODB_URI=mongodb://localhost:27017/whiteboard")
    console.log("   PORT=5000")
    return false
  }

  // Validate MongoDB URI format
  const mongoURI = process.env.MONGODB_URI
  if (!mongoURI.startsWith("mongodb://") && !mongoURI.startsWith("mongodb+srv://")) {
    console.error("❌ Invalid MONGODB_URI format")
    console.log("💡 Should start with mongodb:// or mongodb+srv://")
    return false
  }

  return true
}

module.exports = { validateEnvironment }

const mongoose = require("mongoose")

const DrawingCommandSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ["stroke", "clear", "undo", "redo"],
  },
  data: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
})

const RoomSchema = new mongoose.Schema({
  roomId: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  lastActivity: {
    type: Date,
    default: Date.now,
  },
  drawingData: [DrawingCommandSchema],
  // Add metadata for better performance
  totalStrokes: {
    type: Number,
    default: 0,
  },
  lastClearTimestamp: {
    type: Date,
    default: null,
  },
})

// Update lastActivity on save
RoomSchema.pre("save", function (next) {
  this.lastActivity = new Date()
  next()
})

// Index for better query performance
RoomSchema.index({ roomId: 1 })
RoomSchema.index({ lastActivity: 1 })

module.exports = mongoose.model("Room", RoomSchema)

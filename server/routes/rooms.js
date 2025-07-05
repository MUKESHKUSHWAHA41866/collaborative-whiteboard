const express = require("express")
const router = express.Router()
const Room = require("../models/Room")

// Join or create a room
router.post("/join", async (req, res) => {
  try {
    const { roomId } = req.body

    if (!roomId || roomId.length < 4 || roomId.length > 8) {
      return res.status(400).json({
        error: "Room ID must be between 4 and 8 characters",
      })
    }

    let room = await Room.findOne({ roomId: roomId.toUpperCase() })

    if (!room) {
      room = new Room({ roomId: roomId.toUpperCase() })
      await room.save()
    } else {
      room.lastActivity = new Date()
      await room.save()
    }

    res.json({
      success: true,
      roomId: room.roomId,
      drawingData: room.drawingData,
    })
  } catch (error) {
    console.error("Error joining room:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})

// Get room information
router.get("/:roomId", async (req, res) => {
  try {
    const { roomId } = req.params
    const room = await Room.findOne({ roomId: roomId.toUpperCase() })

    if (!room) {
      return res.status(404).json({ error: "Room not found" })
    }

    res.json({
      roomId: room.roomId,
      createdAt: room.createdAt,
      lastActivity: room.lastActivity,
      drawingData: room.drawingData,
    })
  } catch (error) {
    console.error("Error getting room:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})

module.exports = router

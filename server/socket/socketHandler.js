const Room = require("../models/Room")

const activeRooms = new Map() // roomId -> Set of socket IDs
const userRooms = new Map() // socket ID -> roomId

module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log("User connected:", socket.id)

    socket.on("join-room", async (roomId) => {
      try {
        // Leave previous room if any
        const previousRoom = userRooms.get(socket.id)
        if (previousRoom) {
          socket.leave(previousRoom)
          const roomUsers = activeRooms.get(previousRoom)
          if (roomUsers) {
            roomUsers.delete(socket.id)
            io.to(previousRoom).emit("user-count", roomUsers.size)
            socket.to(previousRoom).emit("user-left", socket.id)
          }
        }

        // Join new room
        socket.join(roomId)
        userRooms.set(socket.id, roomId)

        if (!activeRooms.has(roomId)) {
          activeRooms.set(roomId, new Set())
        }
        activeRooms.get(roomId).add(socket.id)

        // Send user count to all users in room
        const userCount = activeRooms.get(roomId).size
        io.to(roomId).emit("user-count", userCount)

        // Load and send existing drawing data
        const room = await Room.findOne({ roomId })
        if (room && room.drawingData.length > 0) {
          socket.emit("load-drawing-data", room.drawingData)
        }

        console.log(`User ${socket.id} joined room ${roomId}. Users in room: ${userCount}`)
      } catch (error) {
        console.error("Error joining room:", error)
      }
    })

    socket.on("leave-room", (roomId) => {
      handleUserLeave(socket, roomId)
    })

    socket.on("cursor-move", ({ roomId, x, y }) => {
      socket.to(roomId).emit("cursor-move", {
        userId: socket.id,
        x,
        y,
      })
    })

    socket.on("draw-start", async ({ roomId, x, y, color, strokeWidth }) => {
      const drawingCommand = {
        type: "stroke",
        data: {
          action: "start",
          x,
          y,
          color,
          strokeWidth,
          userId: socket.id,
        },
      }

      // Broadcast to other users
      socket.to(roomId).emit("draw-start", { x, y, color, strokeWidth })

      // Save to database
      try {
        await Room.findOneAndUpdate(
          { roomId },
          {
            $push: { drawingData: drawingCommand },
            lastActivity: new Date(),
          },
        )
      } catch (error) {
        console.error("Error saving draw-start:", error)
      }
    })

    socket.on("draw-move", async ({ roomId, x, y }) => {
      const drawingCommand = {
        type: "stroke",
        data: {
          action: "move",
          x,
          y,
          userId: socket.id,
        },
      }

      // Broadcast to other users
      socket.to(roomId).emit("draw-move", { x, y })

      // Save to database
      try {
        await Room.findOneAndUpdate(
          { roomId },
          {
            $push: { drawingData: drawingCommand },
            lastActivity: new Date(),
          },
        )
      } catch (error) {
        console.error("Error saving draw-move:", error)
      }
    })

    socket.on("draw-end", async ({ roomId }) => {
      const drawingCommand = {
        type: "stroke",
        data: {
          action: "end",
          userId: socket.id,
        },
      }

      // Broadcast to other users
      socket.to(roomId).emit("draw-end")

      // Save to database
      try {
        await Room.findOneAndUpdate(
          { roomId },
          {
            $push: { drawingData: drawingCommand },
            lastActivity: new Date(),
          },
        )
      } catch (error) {
        console.error("Error saving draw-end:", error)
      }
    })

    socket.on("clear-canvas", async ({ roomId }) => {
      const drawingCommand = {
        type: "clear",
        data: {
          userId: socket.id,
          timestamp: new Date(),
        },
      }

      // Broadcast to all users including sender
      io.to(roomId).emit("clear-canvas")

      // Save to database
      try {
        await Room.findOneAndUpdate(
          { roomId },
          {
            drawingData: [drawingCommand], // Replace all drawing data with clear command
            lastActivity: new Date(),
          },
        )
      } catch (error) {
        console.error("Error saving clear-canvas:", error)
      }
    })

    // New undo/redo handlers
    socket.on("undo-action", async ({ roomId }) => {
      const undoCommand = {
        type: "undo",
        data: {
          userId: socket.id,
          timestamp: new Date(),
        },
      }

      // Broadcast to other users (not sender to avoid loops)
      socket.to(roomId).emit("undo-action")

      // Save to database
      try {
        await Room.findOneAndUpdate(
          { roomId },
          {
            $push: { drawingData: undoCommand },
            lastActivity: new Date(),
          },
        )
      } catch (error) {
        console.error("Error saving undo-action:", error)
      }
    })

    socket.on("redo-action", async ({ roomId }) => {
      const redoCommand = {
        type: "redo",
        data: {
          userId: socket.id,
          timestamp: new Date(),
        },
      }

      // Broadcast to other users (not sender to avoid loops)
      socket.to(roomId).emit("redo-action")

      // Save to database
      try {
        await Room.findOneAndUpdate(
          { roomId },
          {
            $push: { drawingData: redoCommand },
            lastActivity: new Date(),
          },
        )
      } catch (error) {
        console.error("Error saving redo-action:", error)
      }
    })

    socket.on("disconnect", () => {
      const roomId = userRooms.get(socket.id)
      if (roomId) {
        handleUserLeave(socket, roomId)
      }
      console.log("User disconnected:", socket.id)
    })
  })

  function handleUserLeave(socket, roomId) {
    const roomUsers = activeRooms.get(roomId)
    if (roomUsers) {
      roomUsers.delete(socket.id)
      socket.to(roomId).emit("user-left", socket.id)

      if (roomUsers.size === 0) {
        activeRooms.delete(roomId)
      } else {
        io.to(roomId).emit("user-count", roomUsers.size)
      }
    }
    userRooms.delete(socket.id)
    socket.leave(roomId)
  }
}

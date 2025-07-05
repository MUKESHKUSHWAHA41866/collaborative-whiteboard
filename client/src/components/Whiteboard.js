"use client"

import { useState, useEffect,useCallback } from "react"
import styled from "styled-components"
import io from "socket.io-client"
import DrawingCanvas from "./DrawingCanvas"
import Toolbar from "./Toolbar"
import UserCursors from "./UserCursors"
import TouchInstructions from "./TouchInstructions"
import { SOCKET_URL, SOCKET_EVENTS } from "../config/api"

const Container = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #fff;
`

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background-color: #f8f9fa;
  border-bottom: 1px solid #dee2e6;
  
  @media (max-width: 768px) {
    padding: 0.75rem;
    flex-wrap: wrap;
    gap: 0.5rem;
  }
`

const RoomInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  
  @media (max-width: 768px) {
    gap: 0.5rem;
    font-size: 0.9rem;
  }
`

const RoomCode = styled.span`
  font-weight: bold;
  color: #495057;
  background-color: #e9ecef;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-family: monospace;
  
  @media (max-width: 768px) {
    padding: 0.4rem 0.8rem;
    font-size: 0.8rem;
  }
`

const UserCount = styled.span`
  color: #28a745;
  font-weight: 500;
  
  @media (max-width: 768px) {
    font-size: 0.8rem;
  }
`

const LeaveButton = styled.button`
  padding: 0.5rem 1rem;
  background-color: #dc3545;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  
  &:hover {
    background-color: #c82333;
  }
  
  @media (max-width: 768px) {
    padding: 0.4rem 0.8rem;
    font-size: 0.8rem;
  }
`

const CanvasContainer = styled.div`
  flex: 1;
  position: relative;
  overflow: hidden;
`

const ConnectionStatus = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
  z-index: 100;
  background-color: ${(props) => {
    switch (props.status) {
      case "connected":
        return "#28a745"
      case "connecting":
        return "#ffc107"
      case "disconnected":
        return "#dc3545"
      default:
        return "#6c757d"
    }
  }};
  color: white;
  transition: all 0.3s ease;
  
  @media (max-width: 768px) {
    top: 5px;
    right: 5px;
    padding: 0.3rem 0.6rem;
    font-size: 0.7rem;
  }
`

const Whiteboard = ({ roomId, onLeaveRoom }) => {
  const [socket, setSocket] = useState(null)
  const [userCount, setUserCount] = useState(1)
  const [cursors, setCursors] = useState({})
  const [connectionStatus, setConnectionStatus] = useState("connecting")
  const [historyState, setHistoryState] = useState({ canUndo: false, canRedo: false })
  const [drawingSettings, setDrawingSettings] = useState({
    color: "#000000",
    strokeWidth: 2,
  })

  useEffect(() => {
    console.log(`🔌 Connecting to socket server: ${SOCKET_URL}`)
    const newSocket = io(SOCKET_URL, {
      transports: ["websocket", "polling"],
      timeout: 20000,
      forceNew: true,
    })

    setSocket(newSocket)

    // Connection event handlers
    newSocket.on(SOCKET_EVENTS.CONNECT, () => {
      console.log("✅ Socket connected successfully")
      setConnectionStatus("connected")
    })

    newSocket.on(SOCKET_EVENTS.DISCONNECT, (reason) => {
      console.log("❌ Socket disconnected:", reason)
      setConnectionStatus("disconnected")
    })

    newSocket.on("connect_error", (error) => {
      console.error("❌ Socket connection error:", error)
      setConnectionStatus("disconnected")
    })

    newSocket.on("reconnect", (attemptNumber) => {
      console.log(`🔄 Socket reconnected after ${attemptNumber} attempts`)
      setConnectionStatus("connected")
    })

    newSocket.on("reconnecting", (attemptNumber) => {
      console.log(`🔄 Socket reconnecting... attempt ${attemptNumber}`)
      setConnectionStatus("connecting")
    })

    // Join room
    newSocket.emit(SOCKET_EVENTS.JOIN_ROOM, roomId)

    // Room event handlers
    newSocket.on(SOCKET_EVENTS.USER_COUNT, (count) => {
      setUserCount(count)
      console.log(`👥 Users in room: ${count}`)
    })

    newSocket.on(SOCKET_EVENTS.CURSOR_MOVE, ({ userId, x, y }) => {
      setCursors((prev) => ({
        ...prev,
        [userId]: { x, y },
      }))
    })

    newSocket.on(SOCKET_EVENTS.USER_LEFT, (userId) => {
      setCursors((prev) => {
        const newCursors = { ...prev }
        delete newCursors[userId]
        return newCursors
      })
      console.log(`👋 User left: ${userId}`)
    })

    return () => {
      console.log("🔌 Cleaning up socket connection")
      newSocket.emit(SOCKET_EVENTS.LEAVE_ROOM, roomId)
      newSocket.disconnect()
    }
  }, [roomId])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey || e.metaKey) {
        if (e.key === "z" && !e.shiftKey) {
          e.preventDefault()
          if (window.canvasUndo) {
            window.canvasUndo()
          }
        } else if (e.key === "y" || (e.key === "z" && e.shiftKey)) {
          e.preventDefault()
          if (window.canvasRedo) {
            window.canvasRedo()
          }
        }
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [])

  const handleMouseMove = (e) => {
    if (socket && connectionStatus === "connected") {
      const rect = e.currentTarget.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      socket.emit(SOCKET_EVENTS.CURSOR_MOVE, { roomId, x, y })
    }
  }

  const handleTouchMove = (e) => {
    if (socket && connectionStatus === "connected" && e.touches.length === 1) {
      const rect = e.currentTarget.getBoundingClientRect()
      const x = e.touches[0].clientX - rect.left
      const y = e.touches[0].clientY - rect.top
      socket.emit(SOCKET_EVENTS.CURSOR_MOVE, { roomId, x, y })
    }
  }

  const handleLeave = () => {
    if (socket) {
      socket.emit(SOCKET_EVENTS.LEAVE_ROOM, roomId)
      socket.disconnect()
    }
    onLeaveRoom()
  }

  // const handleHistoryChange = (newHistoryState) => {
  //   setHistoryState(newHistoryState)
  // }

  const handleHistoryChange = useCallback((newHistoryState) => {
  setHistoryState(newHistoryState)
}, [])

  const getConnectionStatusText = () => {
    switch (connectionStatus) {
      case "connected":
        return "🟢 Connected"
      case "connecting":
        return "🟡 Connecting..."
      case "disconnected":
        return "🔴 Disconnected"
      default:
        return "⚪ Unknown"
    }
  }

  return (
    <Container>
      <Header>
        <RoomInfo>
          <span>Room:</span>
          <RoomCode>{roomId}</RoomCode>
          <UserCount>
            {userCount} user{userCount !== 1 ? "s" : ""} online
          </UserCount>
        </RoomInfo>
        <LeaveButton onClick={handleLeave}>Leave Room</LeaveButton>
      </Header>

      <Toolbar
        settings={drawingSettings}
        onSettingsChange={setDrawingSettings}
        socket={socket}
        roomId={roomId}
        historyState={historyState}
        connectionStatus={connectionStatus}
      />

      <CanvasContainer onMouseMove={handleMouseMove} onTouchMove={handleTouchMove}>
        <ConnectionStatus status={connectionStatus}>{getConnectionStatusText()}</ConnectionStatus>
        <DrawingCanvas
          socket={socket}
          roomId={roomId}
          settings={drawingSettings}
          onHistoryChange={handleHistoryChange}
          connectionStatus={connectionStatus}
        />
        <UserCursors cursors={cursors} />
      </CanvasContainer>
      <TouchInstructions />
    </Container>
  )
}

export default Whiteboard

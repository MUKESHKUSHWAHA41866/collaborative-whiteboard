"use client"

import { useState } from "react"
import styled from "styled-components"

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
`

const Card = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  text-align: center;
  min-width: 400px;
`

const Title = styled.h1`
  color: #333;
  margin-bottom: 1rem;
  font-size: 2rem;
`

const Subtitle = styled.p`
  color: #666;
  margin-bottom: 2rem;
  font-size: 1.1rem;
`

const Input = styled.input`
  width: 100%;
  padding: 12px;
  border: 2px solid #ddd;
  border-radius: 8px;
  font-size: 1.1rem;
  margin-bottom: 1rem;
  text-align: center;
  text-transform: uppercase;
  letter-spacing: 2px;
  
  &:focus {
    outline: none;
    border-color: #667eea;
  }
`

const Button = styled.button`
  width: 100%;
  padding: 12px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  cursor: pointer;
  transition: transform 0.2s;
  
  &:hover {
    transform: translateY(-2px);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`

const RoomJoin = ({ onJoinRoom }) => {
  const [roomCode, setRoomCode] = useState("")
  const [isJoining, setIsJoining] = useState(false)

  const generateRoomCode = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
    let result = ""
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return result
  }

  const handleJoinRoom = async () => {
    if (!roomCode.trim()) return

    setIsJoining(true)
    try {
      const response = await fetch("/api/rooms/join", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ roomId: roomCode.toUpperCase() }),
      })

      if (response.ok) {
        onJoinRoom(roomCode.toUpperCase())
      }
    } catch (error) {
      console.error("Error joining room:", error)
    } finally {
      setIsJoining(false)
    }
  }

  const handleCreateRoom = () => {
    const newRoomCode = generateRoomCode()
    setRoomCode(newRoomCode)
  }

  return (
    <Container>
      <Card>
        <Title>Collaborative Whiteboard</Title>
        <Subtitle>Enter a room code to join or create a new room</Subtitle>

        <Input
          type="text"
          placeholder="Enter room code"
          value={roomCode}
          onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
          maxLength={8}
          onKeyPress={(e) => e.key === "Enter" && handleJoinRoom()}
        />

        <Button onClick={handleJoinRoom} disabled={!roomCode.trim() || isJoining}>
          {isJoining ? "Joining..." : "Join Room"}
        </Button>

        <div style={{ margin: "1rem 0", color: "#999" }}>or</div>

        <Button onClick={handleCreateRoom}>Generate New Room Code</Button>
      </Card>
    </Container>
  )
}

export default RoomJoin

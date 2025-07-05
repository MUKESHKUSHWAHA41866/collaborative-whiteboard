"use client"

import { useState } from "react"
import styled from "styled-components"
import RoomJoin from "./components/RoomJoin"
import Whiteboard from "./components/Whiteboard"

const AppContainer = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  background-color: #f5f5f5;
`

function App() {
  const [currentRoom, setCurrentRoom] = useState(null)

  const handleJoinRoom = (roomId) => {
    setCurrentRoom(roomId)
  }

  const handleLeaveRoom = () => {
    setCurrentRoom(null)
  }

  return (
    <AppContainer>
      {!currentRoom ? (
        <RoomJoin onJoinRoom={handleJoinRoom} />
      ) : (
        <Whiteboard roomId={currentRoom} onLeaveRoom={handleLeaveRoom} />
      )}
    </AppContainer>
  )
}

export default App

"use client"

import { useState, useEffect } from "react"
import styled from "styled-components"

const InstructionsOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
`

const InstructionsCard = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 12px;
  max-width: 400px;
  text-align: center;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
`

const Title = styled.h2`
  color: #333;
  margin-bottom: 1rem;
`

const InstructionList = styled.ul`
  text-align: left;
  margin: 1rem 0;
  padding-left: 1.5rem;
  
  li {
    margin-bottom: 0.5rem;
    color: #555;
  }
`

const CloseButton = styled.button`
  background: #007bff;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  
  &:hover {
    background: #0056b3;
  }
`

const TouchInstructions = () => {
  const [showInstructions, setShowInstructions] = useState(false)

  useEffect(() => {
    // Show instructions on touch devices
    const isTouchDevice = "ontouchstart" in window || navigator.maxTouchPoints > 0
    const hasSeenInstructions = localStorage.getItem("whiteboard-touch-instructions")

    if (isTouchDevice && !hasSeenInstructions) {
      setShowInstructions(true)
    }
  }, [])

  const handleClose = () => {
    setShowInstructions(false)
    localStorage.setItem("whiteboard-touch-instructions", "true")
  }

  if (!showInstructions) return null

  return (
    <InstructionsOverlay>
      <InstructionsCard>
        <Title>📱 Touch Device Detected</Title>
        <p>Welcome to the collaborative whiteboard! Here are some tips for the best experience:</p>

        <InstructionList>
          <li>
            <strong>Drawing:</strong> Touch and drag to draw on the canvas
          </li>
          <li>
            <strong>Colors & Tools:</strong> Tap the toolbar buttons to change settings
          </li>
          <li>
            <strong>Undo/Redo:</strong> Use the arrow buttons in the toolbar
          </li>
          <li>
            <strong>Zoom:</strong> Use pinch gestures to zoom in/out
          </li>
          <li>
            <strong>Collaboration:</strong> See other users' cursors in real-time
          </li>
        </InstructionList>

        <p>
          <em>Tip: For the best drawing experience, use your device in landscape mode!</em>
        </p>

        <CloseButton onClick={handleClose}>Got it!</CloseButton>
      </InstructionsCard>
    </InstructionsOverlay>
  )
}

export default TouchInstructions

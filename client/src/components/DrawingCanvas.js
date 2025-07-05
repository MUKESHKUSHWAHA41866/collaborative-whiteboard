"use client"

import { useRef, useEffect, useState } from "react"
import styled from "styled-components"

const Canvas = styled.canvas`
  display: block;
  cursor: crosshair;
  background-color: white;
  touch-action: none; /* Prevent default touch behaviors */
`

const DrawingCanvas = ({ socket, roomId, settings, onHistoryChange }) => {
  const canvasRef = useRef(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [currentPath, setCurrentPath] = useState([])
  const [drawingHistory, setDrawingHistory] = useState([])
  const [historyStep, setHistoryStep] = useState(-1)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    // Set canvas size
    const resizeCanvas = () => {
      const rect = canvas.parentElement.getBoundingClientRect()
      canvas.width = rect.width
      canvas.height = rect.height

      // Redraw canvas after resize
      redrawCanvas()
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    // Save initial blank state
    saveCanvasState()

    return () => window.removeEventListener("resize", resizeCanvas)
  }, [])

  // useEffect(() => {
  //   if (onHistoryChange) {
  //     onHistoryChange({
  //       canUndo: historyStep > 0,
  //       canRedo: historyStep < drawingHistory.length - 1,
  //     })
  //   }
  // }, [historyStep, drawingHistory, onHistoryChange])


  useEffect(() => {
  if (!onHistoryChange) return;

  const canUndo = historyStep > 0;
  const canRedo = historyStep < drawingHistory.length - 1;

  onHistoryChange({ canUndo, canRedo });
}, [historyStep, drawingHistory.length]); // Removed onHistoryChange from deps


  useEffect(() => {
    if (!socket) return

    socket.on("draw-start", ({ x, y, color, strokeWidth }) => {
      const canvas = canvasRef.current
      const ctx = canvas.getContext("2d")
      ctx.beginPath()
      ctx.moveTo(x, y)
      ctx.strokeStyle = color
      ctx.lineWidth = strokeWidth
      ctx.lineCap = "round"
      ctx.lineJoin = "round"
    })

    socket.on("draw-move", ({ x, y }) => {
      const canvas = canvasRef.current
      const ctx = canvas.getContext("2d")
      ctx.lineTo(x, y)
      ctx.stroke()
    })

    socket.on("draw-end", () => {
      const canvas = canvasRef.current
      const ctx = canvas.getContext("2d")
      ctx.closePath()
      // Save state after remote drawing
      saveCanvasState()
    })

    socket.on("clear-canvas", () => {
      const canvas = canvasRef.current
      const ctx = canvas.getContext("2d")
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      // Save state after remote clear
      saveCanvasState()
    })

    socket.on("undo-action", () => {
      performUndo(false) // Don't emit to avoid loops
    })

    socket.on("redo-action", () => {
      performRedo(false) // Don't emit to avoid loops
    })

    return () => {
      socket.off("draw-start")
      socket.off("draw-move")
      socket.off("draw-end")
      socket.off("clear-canvas")
      socket.off("undo-action")
      socket.off("redo-action")
    }
  }, [socket, drawingHistory, historyStep])

  const saveCanvasState = () => {
    const canvas = canvasRef.current
    const imageData = canvas.toDataURL()

    setDrawingHistory((prev) => {
      const newHistory = prev.slice(0, historyStep + 1)
      newHistory.push(imageData)
      return newHistory
    })

    setHistoryStep((prev) => prev + 1)
  }

  const redrawCanvas = () => {
    if (historyStep >= 0 && drawingHistory[historyStep]) {
      const canvas = canvasRef.current
      const ctx = canvas.getContext("2d")
      const img = new Image()
      img.crossOrigin = "anonymous"
      img.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        ctx.drawImage(img, 0, 0)
      }
      img.src = drawingHistory[historyStep]
    }
  }

  const performUndo = (shouldEmit = true) => {
    if (historyStep > 0) {
      setHistoryStep((prev) => prev - 1)
      const canvas = canvasRef.current
      const ctx = canvas.getContext("2d")
      const img = new Image()
      img.crossOrigin = "anonymous"
      img.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        ctx.drawImage(img, 0, 0)
      }
      img.src = drawingHistory[historyStep - 1]

      if (shouldEmit && socket) {
        socket.emit("undo-action", { roomId })
      }
    }
  }

  const performRedo = (shouldEmit = true) => {
    if (historyStep < drawingHistory.length - 1) {
      setHistoryStep((prev) => prev + 1)
      const canvas = canvasRef.current
      const ctx = canvas.getContext("2d")
      const img = new Image()
      img.crossOrigin = "anonymous"
      img.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        ctx.drawImage(img, 0, 0)
      }
      img.src = drawingHistory[historyStep + 1]

      if (shouldEmit && socket) {
        socket.emit("redo-action", { roomId })
      }
    }
  }

  // Expose undo/redo functions
  useEffect(() => {
    window.canvasUndo = performUndo
    window.canvasRedo = performRedo

    return () => {
      delete window.canvasUndo
      delete window.canvasRedo
    }
  }, [historyStep, drawingHistory])

  const getEventPosition = (e) => {
    const canvas = canvasRef.current
    const rect = canvas.getBoundingClientRect()

    if (e.touches && e.touches.length > 0) {
      // Touch event
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top,
      }
    } else {
      // Mouse event
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      }
    }
  }

  const startDrawing = (e) => {
    if (!socket) return

    e.preventDefault() // Prevent scrolling on touch
    setIsDrawing(true)

    const { x, y } = getEventPosition(e)

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    ctx.beginPath()
    ctx.moveTo(x, y)
    ctx.strokeStyle = settings.color
    ctx.lineWidth = settings.strokeWidth
    ctx.lineCap = "round"
    ctx.lineJoin = "round"

    setCurrentPath([{ x, y }])

    socket.emit("draw-start", {
      roomId,
      x,
      y,
      color: settings.color,
      strokeWidth: settings.strokeWidth,
    })
  }

  const draw = (e) => {
    if (!isDrawing || !socket) return

    e.preventDefault() // Prevent scrolling on touch
    const { x, y } = getEventPosition(e)

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    ctx.lineTo(x, y)
    ctx.stroke()

    setCurrentPath((prev) => [...prev, { x, y }])

    socket.emit("draw-move", { roomId, x, y })
  }

  const stopDrawing = (e) => {
    if (!isDrawing || !socket) return

    e.preventDefault() // Prevent scrolling on touch
    setIsDrawing(false)

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    ctx.closePath()

    socket.emit("draw-end", { roomId })
    setCurrentPath([])

    // Save canvas state for undo/redo
    saveCanvasState()
  }

  return (
    <Canvas
      ref={canvasRef}
      // Mouse events
      onMouseDown={startDrawing}
      onMouseMove={draw}
      onMouseUp={stopDrawing}
      onMouseLeave={stopDrawing}
      // Touch events
      onTouchStart={startDrawing}
      onTouchMove={draw}
      onTouchEnd={stopDrawing}
      onTouchCancel={stopDrawing}
    />
  )
}

export default DrawingCanvas

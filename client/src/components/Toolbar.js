"use client"
import styled from "styled-components"

const ToolbarContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background-color: #f8f9fa;
  border-bottom: 1px solid #dee2e6;
  flex-wrap: wrap;
  
  @media (max-width: 768px) {
    gap: 0.5rem;
    padding: 0.75rem;
  }
`

const ToolGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  @media (max-width: 768px) {
    gap: 0.25rem;
  }
`

const Label = styled.label`
  font-weight: 500;
  color: #495057;
  font-size: 0.9rem;
  
  @media (max-width: 768px) {
    font-size: 0.8rem;
  }
`

const ColorButton = styled.button`
  width: 30px;
  height: 30px;
  border: 2px solid ${(props) => (props.selected ? "#007bff" : "#dee2e6")};
  border-radius: 50%;
  background-color: ${(props) => props.color};
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    transform: scale(1.1);
  }
  
  @media (max-width: 768px) {
    width: 25px;
    height: 25px;
  }
`

const Slider = styled.input`
  width: 100px;
  
  @media (max-width: 768px) {
    width: 80px;
  }
`

const ActionButton = styled.button`
  padding: 0.5rem 1rem;
  background-color: ${(props) => (props.variant === "danger" ? "#dc3545" : "#007bff")};
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  font-size: 0.9rem;
  transition: all 0.2s;
  
  &:hover:not(:disabled) {
    background-color: ${(props) => (props.variant === "danger" ? "#c82333" : "#0056b3")};
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  @media (max-width: 768px) {
    padding: 0.4rem 0.8rem;
    font-size: 0.8rem;
  }
`

const StrokePreview = styled.div`
  width: 40px;
  height: ${(props) => props.width}px;
  background-color: ${(props) => props.color};
  border-radius: ${(props) => props.width / 2}px;
  
  @media (max-width: 768px) {
    width: 30px;
  }
`

const HistoryGroup = styled(ToolGroup)`
  border-left: 1px solid #dee2e6;
  padding-left: 1rem;
  margin-left: 0.5rem;
  
  @media (max-width: 768px) {
    border-left: none;
    padding-left: 0;
    margin-left: 0;
    width: 100%;
    justify-content: center;
  }
`

const Toolbar = ({ settings, onSettingsChange, socket, roomId, historyState }) => {
  const colors = ["#000000", "#dc3545", "#007bff", "#28a745", "#ffc107", "#6f42c1"]

  const handleColorChange = (color) => {
    onSettingsChange((prev) => ({ ...prev, color }))
  }

  const handleStrokeWidthChange = (e) => {
    onSettingsChange((prev) => ({ ...prev, strokeWidth: Number.parseInt(e.target.value) }))
  }

  const handleClearCanvas = () => {
    if (socket && roomId) {
      socket.emit("clear-canvas", { roomId })
    }
  }

  const handleUndo = () => {
    if (window.canvasUndo) {
      window.canvasUndo()
    }
  }

  const handleRedo = () => {
    if (window.canvasRedo) {
      window.canvasRedo()
    }
  }

  return (
    <ToolbarContainer>
      <ToolGroup>
        <Label>Colors:</Label>
        {colors.map((color) => (
          <ColorButton
            key={color}
            color={color}
            selected={settings.color === color}
            onClick={() => handleColorChange(color)}
            title={`Select ${color} color`}
          />
        ))}
      </ToolGroup>

      <ToolGroup>
        <Label>Stroke:</Label>
        <Slider
          type="range"
          min="1"
          max="20"
          value={settings.strokeWidth}
          onChange={handleStrokeWidthChange}
          title="Adjust stroke width"
        />
        <StrokePreview width={settings.strokeWidth} color={settings.color} />
      </ToolGroup>

      <HistoryGroup>
        <ActionButton onClick={handleUndo} disabled={!historyState?.canUndo} title="Undo last action (Ctrl+Z)">
          ↶ Undo
        </ActionButton>
        <ActionButton onClick={handleRedo} disabled={!historyState?.canRedo} title="Redo last action (Ctrl+Y)">
          ↷ Redo
        </ActionButton>
      </HistoryGroup>

      <ActionButton variant="danger" onClick={handleClearCanvas} title="Clear entire canvas">
        🗑️ Clear
      </ActionButton>
    </ToolbarContainer>
  )
}

export default Toolbar

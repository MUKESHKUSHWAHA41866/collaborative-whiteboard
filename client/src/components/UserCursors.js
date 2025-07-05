import styled from "styled-components"

const CursorContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  pointer-events: none;
  z-index: 10;
`

const Cursor = styled.div`
  position: absolute;
  width: 20px;
  height: 20px;
  background-color: #007bff;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  transition: all 0.1s ease;
  border: 2px solid white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  
  &::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 8px;
    height: 8px;
    background-color: white;
    border-radius: 50%;
    transform: translate(-50%, -50%);
  }
`

const UserCursors = ({ cursors }) => {
  const colors = ["#007bff", "#28a745", "#dc3545", "#ffc107", "#6f42c1"]

  return (
    <CursorContainer>
      {Object.entries(cursors).map(([userId, position], index) => (
        <Cursor
          key={userId}
          style={{
            left: position.x,
            top: position.y,
            backgroundColor: colors[index % colors.length],
          }}
        />
      ))}
    </CursorContainer>
  )
}

export default UserCursors

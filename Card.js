import React from 'react';
import { Draggable } from 'react-beautiful-dnd';

const Card = ({ id, index }) => {
  return (
    <Draggable draggableId={id} index={index}>
      {(provided, snapshot) => (
        <div
          className={`card ${snapshot.isDragging ? 'dragging' : ''}`}
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <p>Card ID: {id}</p>
        </div>
      )}
    </Draggable>
  );
};

export default Card;

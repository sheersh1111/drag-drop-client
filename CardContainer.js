import React from 'react';
import { Droppable } from 'react-beautiful-dnd';
import Card from './Card';

const CardContainer = ({ title, cards, droppableId }) => {
  return (
    <div className="card-container">
      <h2>{title}</h2>
      <Droppable droppableId={droppableId}>
        {(provided) => (
          <div
            className="cards"
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {cards.map((card, index) => (
              <Card key={card.id} id={card.id} index={index} />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};

export default CardContainer;

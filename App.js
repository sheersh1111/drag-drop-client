import React, { useState, useEffect } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import './App.css';
import CardContainer from './CardContainer';
import axios from 'axios';

import io from 'socket.io-client';

const socket = io('http://localhost:4000');


const App = () => {
  // Load initial state from local storage, or use default if not present

  const [containers, setContainers] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // Update local storage whenever containers state changes

  
  useEffect(() => {
   const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:4000/");
        setContainers(response.data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    socket.connect();
    console.log("socket connected")
    socket.on('updateData', (data) => {
      console.log('Received updateData event:', data);
      fetchData();
    });

    return () => {
      socket.disconnect(); // Disconnect socket on component unmount
    };

  },[]);

  const onDragEnd = (result) => {
    const { source, destination } = result;
    console.log(source, destination)

    // If dropped outside the list
    if (!destination) {
      return;
    }

    // If dropped in the same container and position
    if (source.droppableId === destination.droppableId && source.index === destination.index) {
      return;
    }

    const sourceCards = [...containers[source.droppableId]];
    const destCards = source.droppableId !== destination.droppableId ? [...containers[destination.droppableId]] : sourceCards;

    // Remove the card from the source array
    const [movedCard] = sourceCards.splice(source.index, 1);

    // Insert the card into the destination array
    destCards.splice(destination.index, 0, movedCard);

    setContainers((prevContainers) => ({
      ...prevContainers,
      [source.droppableId]: sourceCards,
      [destination.droppableId]: destCards,
    }));

    axios.post('http://localhost:4000/', { 
      sd:source.droppableId,
      si:source.index,
      dd: destination?.droppableId,
      di: destination?.index
    })
    .then(response => {
      console.log('Containers updated successfully:', response.data);
      // Handle any success actions if needed
    })
    .catch(error => {
      console.error('Error updating containers:', error);
      // Handle errors appropriately
    });
  };
  
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="App">
      <DragDropContext onDragEnd={onDragEnd}>
        <CardContainer title="Container 1" cards={containers.container1} droppableId="container1" />
        <CardContainer title="Container 2" cards={containers.container2} droppableId="container2" />
      </DragDropContext>
    </div>
  );
};

export default App;

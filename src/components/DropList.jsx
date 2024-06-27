import React from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import styled from 'styled-components';

function DropList({ columns, selectedItems, setSelectedItems }) {
  const toggleSelection = (itemId) => {
    if (selectedItems.includes(itemId)) {
      setSelectedItems(selectedItems.filter((id) => id !== itemId));
    } else {
      setSelectedItems([...selectedItems, itemId]);
    }
  };

  return (
    <Wrapper>
      {Object.entries(columns).map(([colId, items]) => (
        <Droppable key={colId} droppableId={colId}>
          {(provided, snapshot) => (
            <Column
              ref={provided.innerRef}
              {...provided.droppableProps}
              isDraggingOver={snapshot.isDraggingOver}
            >
              {items.map((item, index) => (
                <Draggable key={item.id} draggableId={item.id} index={index}>
                  {(provided, snapshot) => (
                    <Item
                      onClick={() => toggleSelection(item.id)}
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      isDragging={snapshot.isDragging}
                      isSelected={selectedItems.includes(item.id)}
                      isOutsideDropArea={!snapshot.draggingOver}
                    >
                      {item.content}
                    </Item>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </Column>
          )}
        </Droppable>
      ))}
    </Wrapper>
  );
}

export default DropList;

const GRID = 8;

const Wrapper = styled.div`
  display: flex;
  gap: 10px;
  height: 100%;
  overflow-y: hidden;
  align-items: center;
  justify-content: center;
`;

const Column = styled.div`
  background: ${(props) => (props.isDraggingOver ? 'lightblue' : 'lightgrey')};
  padding: ${GRID}px;
  width: 250px;
  height: 63vh;
  overflow-y: auto;
`;

const Item = styled.div`
  user-select: none;
  padding: ${GRID * 2}px;
  margin: 0 0 ${GRID}px 0;
  background: ${(props) =>
    props.isOutsideDropArea && props.isDragging
      ? 'red'
      : props.isSelected
      ? 'blue'
      : props.isDragging
      ? 'lightgreen'
      : 'grey'};
  color: white;
  cursor: pointer;
`;

import React, { useState, useCallback } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import DropList from './components/DropList.jsx';
import styled from 'styled-components';

function App() {
  const getItems = (count, offset = 0) =>
    Array.from({ length: count }, (v, k) => k + offset).map((i) => ({
      id: `item-${i}`,
      content: `item ${i}`,
      itemNumber: i,
    }));

  const [columns, setColumns] = useState({
    column1: getItems(10),
    column2: getItems(10, 10),
    column3: getItems(10, 20),
    column4: getItems(10, 30),
  });
  const handleReset = () => {
    setColumns({
      column1: getItems(10),
      column2: getItems(10, 10),
      column3: getItems(10, 20),
      column4: getItems(10, 30),
    });
    setSelectedItems([]);
  };
  const [selectedItems, setSelectedItems] = useState([]);

  const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
  };

  const move = (source, destination, droppableSource, droppableDestination) => {
    const sourceClone = Array.from(source);
    const destClone = Array.from(destination);
    const [removed] = sourceClone.splice(droppableSource.index, 1);
    destClone.splice(droppableDestination.index, 0, removed);

    return {
      [droppableSource.droppableId]: sourceClone,
      [droppableDestination.droppableId]: destClone,
    };
  };

  const moveMultiple = (columns, destination, droppableDestination) => {
    const sourceClones = {};
    Object.keys(columns).forEach((key) => {
      sourceClones[key] = Array.from(columns[key]);
    });
    const destClone = Array.from(destination);
    const selected = [];

    Object.keys(sourceClones).forEach((key) => {
      selected.push(
        ...sourceClones[key].filter((item) => selectedItems.includes(item.id))
      );
    });

    Object.keys(sourceClones).forEach((key) => {
      selected.forEach((item) => {
        const index = sourceClones[key].indexOf(item);
        if (index > -1) {
          sourceClones[key].splice(index, 1);
        }
      });
    });

    const nonSelectedDestinationItems = destClone.filter(
      (item) => !selectedItems.includes(item.id)
    );
    nonSelectedDestinationItems.splice(
      droppableDestination.index,
      0,
      ...selected
    );

    return {
      ...sourceClones,
      [droppableDestination.droppableId]: nonSelectedDestinationItems,
    };
  };

  const onDragEnd = useCallback(
    (result) => {
      if (!result.destination) {
        return;
      }
      const { source, destination } = result;
      const sourceId = source.droppableId;
      const destId = destination.droppableId;

      const sourceItem = columns[sourceId][source.index];
      const destinationItem = columns[destId]
        ? columns[destId][destination.index]
        : null;

      if (
        destination.droppableId === source.droppableId &&
        source.index === destination.index
      )
        return;

      if (!sourceItem) {
        return;
      }

      if (sourceId === 'column1' && destId === 'column3') {
        alert('이동할 수 없습니다.');
        return;
      }

      if (
        sourceItem.itemNumber % 2 === 0 &&
        destinationItem &&
        destinationItem.itemNumber % 2 === 0
      ) {
        alert('짝수 아이템은 다른 짝수 아이템 앞으로 이동할 수 없습니다.');
        return;
      }

      if (selectedItems.length > 0) {
        const updatedColumns = moveMultiple(
          columns,
          columns[destId],
          destination
        );

        setColumns((prev) => ({
          ...prev,
          ...updatedColumns,
        }));
        setSelectedItems([]);
      } else {
        if (sourceId === destId) {
          const items = reorder(
            columns[sourceId],
            source.index,
            destination.index
          );
          setColumns((prev) => ({
            ...prev,
            [sourceId]: items,
          }));
        } else {
          const result = move(
            columns[sourceId],
            columns[destId],
            source,
            destination
          );
          setColumns((prev) => ({
            ...prev,
            [sourceId]: result[sourceId],
            [destId]: result[destId],
          }));
        }
      }
    },
    [columns, selectedItems]
  );

  return (
    <>
      <StButton onClick={handleReset}>초기화</StButton>
      <StMainWrapper>
        <DragDropContext onDragEnd={onDragEnd}>
          <DropList
            columns={columns}
            selectedItems={selectedItems}
            setSelectedItems={setSelectedItems}
          />
        </DragDropContext>
      </StMainWrapper>
    </>
  );
}

export default App;

const StMainWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-start;
  overflow-y: auto;
`;

const StButton = styled.button`
  margin-bottom: 30px;
  width: 200px;
  height: 40px;
  outline: none;
  border: none;
  transition: 0.3s;
  border-radius: 10px;
  font-weight: 800;
  cursor: pointer;
  &:hover {
    background-color: aqua;
  }
`;

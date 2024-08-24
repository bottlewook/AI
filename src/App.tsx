import React, { useState } from "react";
import { DragDropContext, DropResult, DragUpdate } from "react-beautiful-dnd";
import DroppableColumn from "./components/DroppableColumn";

interface Item {
  id: string;
  content: string;
}

interface State {
  [key: string]: Item[];
}

const reorder = (list: Item[], startIndex: number, endIndex: number): Item[] => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

const move = (
  source: Item[],
  destination: Item[],
  droppableSource: { index: number; droppableId: string },
  droppableDestination: { index: number; droppableId: string }
): State => {
  const sourceClone = Array.from(source);
  const destClone = Array.from(destination);
  const [removed] = sourceClone.splice(droppableSource.index, 1);

  destClone.splice(droppableDestination.index, 0, removed);

  const result: State = {};
  result[droppableSource.droppableId] = sourceClone;
  result[droppableDestination.droppableId] = destClone;

  return result;
};

const App: React.FC = () => {
  const [state, setState] = useState<State>({
    droppable1: Array.from({ length: 5 }, (v, k) => ({
      id: `item-${k}`,
      content: `item ${k}`,
    })),
    droppable2: Array.from({ length: 5 }, (v, k) => ({
      id: `item-${k + 5}`,
      content: `item ${k + 5}`,
    })),
    droppable3: [],
    droppable4: [],
  });
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [invalidDragId, setInvalidDragId] = useState<string | null>(null);

  const getList = (id: string) => state[id];

  const isInvalidDestination = (
    source: { droppableId: string; index: number },
    destination: { droppableId: string; index: number } | null
  ): boolean => {
    if (!destination) return false;

    if (source.droppableId === "droppable1" && destination.droppableId === "droppable3") {
      return true;
    }

    const sourceItems = getList(source.droppableId);
    const destinationItems = getList(destination.droppableId);

    if (!sourceItems || !destinationItems || destination.index >= destinationItems.length) {
      return false;
    }

    const draggedItem = sourceItems[source.index];
    const destinationItem = destinationItems[destination.index];

    const isEven = (item: Item) => parseInt(item.id.split("-")[1], 10) % 2 === 0;

    if (isEven(draggedItem) && destinationItem && isEven(destinationItem)) {
      return true;
    }

    return false;
  };

  const onDragUpdate = (update: DragUpdate) => {
    const { destination, source, draggableId } = update;

    if (!destination) {
      setInvalidDragId(null);
      return;
    }

    const isInvalid = isInvalidDestination(source, destination);
    setInvalidDragId(isInvalid ? draggableId : null);
  };

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;

    if (!destination || invalidDragId) {
      setInvalidDragId(null);
      return;
    }

    let newState = { ...state };

    if (selectedItems.length > 0) {
      const sourceList = Array.from(getList(source.droppableId));
      const destinationList = Array.from(getList(destination.droppableId));

      selectedItems.forEach((itemId) => {
        const sourceIndex = sourceList.findIndex((item) => item.id === itemId);
        const [movedItem] = sourceList.splice(sourceIndex, 1);
        destinationList.splice(destination.index, 0, movedItem);
      });

      newState = {
        ...newState,
        [source.droppableId]: sourceList,
        [destination.droppableId]: destinationList,
      };
    } else {
      const sourceItems = getList(source.droppableId);
      const destinationItems = getList(destination.droppableId);

      if (source.droppableId === destination.droppableId) {
        const items = reorder(sourceItems, source.index, destination.index);
        newState = {
          ...newState,
          [source.droppableId]: items,
        };
      } else {
        const result = move(sourceItems, destinationItems, source, destination);
        newState = {
          ...newState,
          [source.droppableId]: result[source.droppableId],
          [destination.droppableId]: result[destination.droppableId],
        };
      }
    }

    setState(newState);
    setInvalidDragId(null);
    setSelectedItems([]);
  };

  const onItemSelect = (itemId: string) => {
    if (selectedItems.includes(itemId)) {
      setSelectedItems(selectedItems.filter((id) => id !== itemId));
    } else {
      setSelectedItems([...selectedItems, itemId]);
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd} onDragUpdate={onDragUpdate}>
      <div className="flex justify-center items-center min-h-screen space-x-8 p-6">
        {Object.keys(state).map((droppableId) => (
          <DroppableColumn
            key={droppableId}
            droppableId={droppableId}
            items={state[droppableId]}
            invalidDragId={invalidDragId}
            selectedItems={selectedItems}
            onItemSelect={onItemSelect}
          />
        ))}
      </div>
    </DragDropContext>
  );
};

export default App;

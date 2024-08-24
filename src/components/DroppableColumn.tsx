import React from "react";
import { Droppable } from "react-beautiful-dnd";
import DraggableItem from "./DraggableItem";

interface DroppableColumnProps {
  droppableId: string;
  items: { id: string; content: string }[];
  invalidDragId: string | null;
  selectedItems: string[];
  onItemSelect: (id: string) => void;
}

function DroppableColumn({
  droppableId,
  items,
  invalidDragId,
  selectedItems,
  onItemSelect,
}: DroppableColumnProps) {
  const columnTitle = droppableId.replace("droppable", "Column ");
  return (
    <div className="flex flex-col items-center w-72">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">{columnTitle}</h2>
      <Droppable droppableId={droppableId}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`flex flex-col p-4 rounded-lg border-2 min-h-[400px] w-full ${snapshot.isDraggingOver ? "bg-blue-100 border-blue-300" : "bg-gray-50 border-gray-300"
              }`}
          >
            {items.map((item, index) => (
              <DraggableItem
                key={item.id}
                item={item}
                index={index}
                isSelected={selectedItems.includes(item.id)}
                isInvalid={invalidDragId === item.id}
                onItemSelect={onItemSelect}
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};

export default DroppableColumn;

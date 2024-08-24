import React from "react";
import { Draggable } from "react-beautiful-dnd";

interface DraggableItemProps {
  item: {
    id: string;
    content: string;
  };
  index: number;
  isSelected: boolean;
  isInvalid: boolean;
  onItemSelect: (id: string) => void;
}

const DraggableItem: React.FC<DraggableItemProps> = ({
  item,
  index,
  isSelected,
  isInvalid,
  onItemSelect,
}) => {
  return (
    <Draggable key={item.id} draggableId={item.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          onClick={(e) => {
            if (e.shiftKey) {
              e.preventDefault();
              onItemSelect(item.id);
            }
          }}
          className={`p-4 my-2 rounded-lg shadow-md cursor-pointer ${isInvalid
              ? "bg-red-500 text-white"
              : isSelected
                ? "bg-blue-500 text-white"
                : snapshot.isDragging
                  ? "bg-green-500 text-white"
                  : "bg-white text-gray-900 border border-gray-300"
            }`}
        >
          {item.content}
        </div>
      )}
    </Draggable>
  );
};

export default DraggableItem;

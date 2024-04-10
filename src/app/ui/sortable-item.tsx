import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { FaGripVertical } from "react-icons/fa6";

export function SortableItem(props) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: props.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    display: "flex",
  };

  return (
    <div ref={setNodeRef} style={style}>
      <div className="flex-grow">{props.children}</div>
      <div {...attributes} {...listeners} className="w-8 flex items-center justify-center">
        <div className="bg-slate-300 py-2 px-1 rounded-md">
          <FaGripVertical />
        </div>
      </div>
    </div>
  );
}

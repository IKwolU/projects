import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import React from "react";
import { KanbanColumn } from "./KanbanColumn";

export const BookingKanban = () => {
  const items = [
    { id: "1", content: "Первая плашка" },
    { id: "2", content: "Вторая плашка" },
    { id: "3", content: "Третья плашка" },
    { id: "4", content: "Четвертая плашка" },
  ];

  const columns = {
    new: {
      id: "new",
      title: "Новые",
      items: ["1", "2"],
    },
    inWork: {
      id: "inWork",
      title: "В работе",
      items: ["3", "4"],
    },
  };

  const order = ["new", "inWork"];

  const onDragEnd = () => {
    return;
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      {order.map((id) => {
        const column = columns[id];
        const tasks = items.filter((x) => column.items.includes(x.id));
        return (
          <div key={column.id}>
            <div className="">{column.title}</div>
            <Droppable droppableId={column.id} key={column.id}>
              {(provided) => (
                <div ref={provided.innerRef} {...provided.droppableProps}>
                  {tasks.map((task, index) => (
                    <Draggable
                      key={task.id}
                      draggableId={task.id}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className=""
                        >
                          {task.content}
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        );
      })}
    </DragDropContext>
  );
};

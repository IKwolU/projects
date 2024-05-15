import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import React, { useEffect, useState } from "react";
import { KanbanColumn } from "./KanbanColumn";
import { client } from "./backend";
import { ApplicationStage, Applications, Body42 } from "./api-client";
import { getApplicationStageDisplayName } from "@/lib/utils";
import { set } from "ramda";

export const BookingKanban = () => {
  const [applications, setApplications] = useState<Applications[]>([]);

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
  const getApplications = async () => {
    const data = await client.getParkApplicationsManager();
    setApplications(data.applications!);
  };

  const changeApplicationData = async (id: number, item, itemData) => {
    await client.updateApplicationManager(
      new Body42({ id: id, [item]: itemData })
    );

    setApplications(
      applications
        .filter((x) => x.id !== id)
        .concat(
          new Applications({
            ...applications.filter((x) => x.id === id),
            [item]: itemData,
          })
        )
    );
  };

  useEffect(() => {
    getApplications();
  }, []);

  const order = ["new", "inWork"];

  const onDragEnd = (result) => {
    const { source, destination, draggableId } = result;

    if (!destination) {
      return; // Item was not dropped in a droppable area
    }

    const sourceColumn = source.droppableId;
    const destinationColumn = destination.droppableId;
    changeApplicationData(draggableId, "current_stage", destinationColumn);
  };

  if (!applications) {
    return <></>;
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      {Object.keys(ApplicationStage).map((column: any) => (
        <div key={column} className="p-1 border-2 border-pale rounded-xl">
          <div className="">{getApplicationStageDisplayName(column)}</div>
          <Droppable droppableId={column} key={column}>
            {(provided) => (
              <div
                className="w-full h-full"
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                {applications
                  .filter((x) => x.current_stage === column)
                  .map((task, index) => (
                    <Draggable
                      key={task.id}
                      draggableId={String(task.id)}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="w-full h-8 border-2 border-pale rounded-xl"
                        >
                          {task.id}
                        </div>
                      )}
                    </Draggable>
                  ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </div>
      ))}
    </DragDropContext>
  );
};

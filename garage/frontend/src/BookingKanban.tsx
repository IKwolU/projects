import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import React, { useEffect, useState } from "react";
import { KanbanColumn } from "./KanbanColumn";
import { client } from "./backend";
import {
  ApplicationStage,
  Applications,
  Body42,
  Body43,
  Division2,
} from "./api-client";
import { getApplicationStageDisplayName } from "@/lib/utils";
import { set } from "ramda";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import PhoneInput from "@/components/ui/phone-input";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import Confirmation from "@/components/ui/confirmation";
import { Input } from "@/components/ui/input";
import { BookingKanbanItem } from "./BookingKanbanItem";
import { useRecoilState } from "recoil";
import { applicationsAtom } from "./atoms";

interface Division {
  id: number;
  name: string;
}
interface Details {
  isShowed: boolean;
  applicationDetails: Applications | null;
}

export const BookingKanban = () => {
  const [applications, setApplications] = useRecoilState(applicationsAtom);

  const [newApplicationPhone, setNewApplicationPhone] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showDetails, setShowDetails] = useState<Details>({
    isShowed: false,
    applicationDetails: null,
  });

  const [newApplication, setNewApplication] = useState<Body43>(
    new Body43({
      advertising_source: "Без рекламы",
      division_id: undefined,
      planned_arrival: undefined,
    })
  );

  const getApplications = async () => {
    const data = await client.getParkApplicationsManager();
    setApplications(data.applications!);
    setNewApplication(
      new Body43({
        ...newApplication,
        division_id: data.applications?.filter((x) => x.division_id)[0]
          .division_id,
      })
    );
  };

  const createNewApplication = async () => {
    const data = await client.createApplicationManager(
      new Body43({
        ...newApplication,
        phone: newApplicationPhone,
      })
    );
    setApplications([
      ...applications,
      new Applications({
        advertising_source: newApplication.advertising_source,
        division_id: newApplication.division_id,
        planned_arrival: String(newApplication.planned_arrival),
        phone: newApplicationPhone,
        id: data.id,
        updated_at: new Date().toString(),
        current_stage: ApplicationStage.InProgress,
      }),
    ]);
  };

  const changeApplicationData = async (id: number, item, itemData) => {
    setApplications([
      ...applications.filter((x) => x.id !== id),
      new Applications({
        ...applications.find((x) => x.id === id),
        [item]: itemData,
        updated_at: new Date().toString(),
      }),
    ]);
    await client.updateApplicationManager(
      new Body42({ id: id, [item]: itemData })
    );
  };

  useEffect(() => {
    getApplications();
  }, []);

  const onDragEnd = (result) => {
    const { source, destination, draggableId } = result;

    if (!destination) {
      return; // Item was not dropped in a droppable area
    }

    const sourceColumn = source.droppableId;
    const destinationColumn = destination.droppableId;
    changeApplicationData(
      Number(draggableId),
      "current_stage",
      destinationColumn
    );
  };

  if (!applications) {
    return <></>;
  }

  const sortedApplications = applications.sort(
    (a, b) => new Date(b.updated_at) - new Date(a.updated_at)
  );

  const uniqueDivisions: Division[] = applications
    .filter((application: any) => application.division)
    .reduce((uniqueDivisions: Division[], application: any) => {
      const division: any = application.division;
      if (!uniqueDivisions.some((div: Division) => div.id === division.id)) {
        uniqueDivisions.push(division);
      }
      return uniqueDivisions;
    }, [])
    .map((division: any) => ({ id: division.id, name: division.name }));

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      {showDetails.isShowed && (
        <BookingKanbanItem
          applicationDetails={showDetails.applicationDetails!}
          close={() =>
            setShowDetails({ isShowed: false, applicationDetails: null })
          }
        />
      )}
      {showModal && (
        <div
          className="fixed top-0 left-0 z-50 flex items-center justify-center w-full h-full bg-black bg-opacity-50"
          onClick={(e) => e.target === e.currentTarget && setShowModal(false)}
        >
          <div className="flex flex-col items-center p-4 space-y-2 bg-white w-80 rounded-xl">
            <div className="">
              <div className="text-center">Источник рекламы</div>
              <select
                className="p-1 m-1 border-2 border-grey rounded-xl"
                name=""
                id=""
                onChange={(e) =>
                  setNewApplication(
                    new Body43({
                      ...newApplication,
                      advertising_source: e.target.value,
                    })
                  )
                }
              >
                {["Без рекламы", "BeeBeep", "Avito"].map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>
            <Separator />
            <div className="">
              <div className="text-center">Подразделение</div>
              <select
                className="p-1 m-1 border-2 border-grey rounded-xl"
                name=""
                id=""
                onChange={(e) =>
                  setNewApplication(
                    new Body43({
                      ...newApplication,
                      division_id: Number(e.target.value),
                    })
                  )
                }
              >
                {uniqueDivisions.map((y) => (
                  <option key={y.id} value={y.id}>
                    {y.name}
                  </option>
                ))}
              </select>
            </div>
            <Separator />
            <div className="">
              <div className="text-center">Телефон водителя</div>
              <PhoneInput
                onChange={(e) => setNewApplicationPhone(e.target.value)}
              />
            </div>
            <Separator />
            <div className="">
              <div className="text-center">Планирует прийти</div>
              <Input
                type="datetime-local"
                onChange={(e) =>
                  setNewApplication(
                    new Body43({
                      ...newApplication,
                      planned_arrival: new Date(e.target.value),
                    })
                  )
                }
              />
            </div>
            <div className="flex justify-between space-x-2">
              <Button
                variant={"reject"}
                className="text-black"
                onClick={() => setShowModal(false)}
              >
                Назад
              </Button>
              {newApplicationPhone && (
                <Confirmation
                  accept={() => {
                    createNewApplication();
                    setShowModal(false);
                  }}
                  cancel={() => {}}
                  title="Создать заявку?"
                  trigger={<Button>Создать</Button>}
                  type="green"
                />
              )}
              {!newApplicationPhone && <Button disabled>Создать</Button>}
            </div>
          </div>
        </div>
      )}
      {Object.keys(ApplicationStage).map((column: any) => (
        <div
          key={column}
          className="min-h-full p-1 pb-40 bg-white border-2 min-w-48 border-pale rounded-xl "
        >
          <div className="h-16 mb-4 text-center border-b-2 border-pale">
            {getApplicationStageDisplayName(column)}
            {column === ApplicationStage.New && (
              <Button onClick={() => setShowModal(true)} className="h-8">
                Создать
              </Button>
            )}
          </div>
          <Droppable droppableId={column} key={column}>
            {(provided) => (
              <div
                className="w-full h-full space-y-1"
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                {sortedApplications
                  .filter((x) => x.current_stage === column)
                  .map((task, index) => (
                    <Draggable
                      key={task.id}
                      draggableId={String(task.id)}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          onClick={() =>
                            setShowDetails({
                              isShowed: true,
                              applicationDetails: task,
                            })
                          }
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="w-full p-1 text-sm border-2 bg-lightgrey border-pale rounded-xl"
                        >
                          {task.user && (
                            <div className="">{task.user.phone}</div>
                          )}
                          {!task.user && <div className="">Нет номера</div>}
                          <Separator />
                          <div className="">
                            Последнее изменение:{" "}
                            {format(task.updated_at!, "dd.MM.yyyy HH:mm")}
                          </div>
                          <Separator />
                          {task.division && (
                            <div className="">{task.division.name}</div>
                          )}
                          {task.division && (
                            <div className="">{task.division.city?.name}</div>
                          )}
                          {!task.division && (
                            <div className="">Нет подразделения</div>
                          )}
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

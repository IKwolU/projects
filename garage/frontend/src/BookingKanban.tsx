import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { useEffect, useState } from "react";
import { client } from "./backend";
import {
  ApplicationStage,
  Applications,
  Body42,
  Body43,
  Body47,
  Notifications,
} from "./api-client";
import { getApplicationStageDisplayName } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import PhoneInput from "@/components/ui/phone-input";

import Confirmation from "@/components/ui/confirmation";
import { Input } from "@/components/ui/input";
import { BookingKanbanItem } from "./BookingKanbanItem";
import { useRecoilState } from "recoil";
import { applicationsAtom, parkAtom } from "./atoms";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-regular-svg-icons";

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
  const [updatedCount, setUpdatedCount] = useState(0);
  const [notifications, setNotifications] = useState<Notifications[]>([]);
  const [lastUpdateTime, setLastUpdateTime] = useState(new Date());
  const [notificationResult, setNotificationResult] = useState("");
  const [park] = useRecoilState(parkAtom);
  const [idOpenAndCreateNotification, setIdOpenAndCreateNotification] =
    useState<number | null>(null);
  const [newNotification, setNewNotification] = useState({
    date: undefined as string | undefined,
    message: undefined as string | undefined,
  });

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

  const updateIntervalInSeconds = 60;

  const getApplications = async () => {
    const data = await client.getParkApplicationsManager(
      new Body42({ last_update_time: undefined })
    );
    setApplications(data.applications!);
    setNewApplication(
      new Body43({
        ...newApplication,
        division_id: data.applications?.filter((x) => x.division_id)[0]
          .division_id,
      })
    );
  };

  const getNotification = async () => {
    const data = await client.getNotificationsManager();
    setNotifications(data.notifications!);
  };

  useEffect(() => {
    getApplications();
    getNotification();
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setUpdatedCount((prevCount) => prevCount + 1);
    }, updateIntervalInSeconds * 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  useEffect(() => {
    checkApplications();
    getNotification();
  }, [updatedCount]);

  const createNotification = async (id: number) => {
    await client.createNotificationManager(
      new Body47({
        date: newNotification.date,
        message: newNotification.message,
        result: null,
        id: id,
      })
    );
    setNewNotification({ date: undefined, message: undefined });
    setIdOpenAndCreateNotification(null);
    getNotification();
  };

  const checkApplications = async () => {
    const data = await client.getParkApplicationsManager(
      new Body42({ last_update_time: lastUpdateTime })
    );

    if (data.applications!.length > 0) {
      setApplications([
        ...applications.filter(
          (x) => !data.applications!.map((a) => a.id).includes(x.id!)
        ),
        ...data.applications!,
      ]);
      lastUpdateTime.setSeconds(
        lastUpdateTime.getSeconds() + updateIntervalInSeconds
      );
      setLastUpdateTime(lastUpdateTime);
    }
  };

  const createNewApplication = async () => {
    await client.createApplicationManager(
      new Body43({
        ...newApplication,
        phone: newApplicationPhone,
      })
    );

    getApplications();
  };

  const changeApplicationData = async (
    id: number,
    item: any,
    itemData: any
  ) => {
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

  const updateNotification = async (id: number) => {
    client.updateNotificationManager(
      new Body47({ result: notificationResult, id: id })
    );
    getNotification();
  };

  const onDragEnd = (result: any) => {
    const { destination, draggableId } = result;

    if (!destination) {
      return; // Item was not dropped in a droppable area
    }

    // const sourceColumn = source.droppableId;
    const destinationColumn = destination.droppableId;
    changeApplicationData(
      Number(draggableId),
      "current_stage",
      destinationColumn
    );
    if (
      destinationColumn === ApplicationStage.Thinking ||
      destinationColumn === ApplicationStage.NoAnswer
    ) {
      setIdOpenAndCreateNotification(draggableId);
    }
  };

  if (!applications) {
    return <></>;
  }

  const sortedApplications = [...applications].sort((a, b) => {
    const left = new Date(b.updated_at) as any;
    const right = new Date(a.updated_at) as any;
    return left - right;
  });

  const uniqueDivisions: Division[] = park.divisions!.map((division: any) => ({
    id: division.id,
    name: division.name,
  }));

  return (
    <div className="flex justify-between w-full max-w-full mt-4 space-x-1 overflow-x-auto sm:mx-0 sm:w-full sm:space-x-1 sm:justify-between">
      {!!notifications!.length && (
        <div className="fixed z-[60]  bottom-2 right-2">
          <div className="space-y-1">
            {notifications!.map((x) => {
              const content = JSON.parse(x.content!);
              const application = sortedApplications.find(
                (a) => a.id === x.application_id
              );
              return (
                <div className=" p-2 border-2 translate-x-[85%] bg-lightgrey rounded-xl animate-pulse hover:animate-none transition-transform hover:translate-x-0 border-red">
                  <div className="flex items-center justify-between space-x-2">
                    <div className="">{format(content.date, "HH:mm")}</div>
                    <div className="">{application!.manager!.user?.phone}</div>
                  </div>

                  <div className="">{content.message}</div>
                  <div className="flex items-center space-x-2">
                    <Input
                      className="w-64 m-0"
                      type="text"
                      onChange={(e) => setNotificationResult(e.target.value)}
                      placeholder="Результат"
                    />
                    <FontAwesomeIcon
                      onClick={() => updateNotification(x.id!)}
                      icon={faPenToSquare}
                      className="h-6 transition-colors cursor-pointer text-pale hover:text-black active:text-yellow"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
      {idOpenAndCreateNotification && (
        <div
          className="fixed top-0 left-0 z-10 flex items-center justify-center w-full h-full bg-black bg-opacity-50 "
          onClick={(e) =>
            e.target === e.currentTarget && setIdOpenAndCreateNotification(null)
          }
        >
          <div className="p-2 space-y-2 bg-white rounded-xl">
            Создание напоминание для заявки №{idOpenAndCreateNotification}
            <div className="flex space-x-2">
              <Input
                className="m-0 w-44"
                type="datetime-local"
                value={
                  newNotification.date
                    ? newNotification.date
                    : String(new Date())
                }
                onChange={(e) =>
                  setNewNotification({
                    ...newNotification,
                    date: e.target.value,
                  })
                }
                placeholder={
                  newNotification.date &&
                  format(newNotification.date, "dd.MM.yyyy HH:mm")
                }
              />
              <Input
                className="m-0 w-96"
                type="text"
                value={newNotification.message ? newNotification.message : ""}
                onChange={(e) =>
                  setNewNotification({
                    ...newNotification,
                    message: e.target.value,
                  })
                }
                placeholder="Коментарий"
              />
            </div>
            <div className="flex space-x-2">
              <Button
                variant={"reject"}
                className="text-black"
                onClick={() => setIdOpenAndCreateNotification(null)}
              >
                Назад
              </Button>
              {newNotification.message && newNotification.date && (
                <Button
                  variant={"default"}
                  className="text-black"
                  onClick={() =>
                    createNotification(idOpenAndCreateNotification)
                  }
                >
                  Создать
                </Button>
              )}
              {!(newNotification.message && newNotification.date) && (
                <Button variant={"default"} className="text-black" disabled>
                  Создать
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
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
            className="min-h-full p-1 bg-white border-2 min-w-48 border-pale rounded-xl "
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
                  className="w-full h-full space-y-1 min-h-96"
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
                            className="relative w-full p-1 text-sm border-2 bg-lightgrey border-pale rounded-xl"
                          >
                            <div className="absolute text-sm font-semibold top-1 right-1">
                              №{task.id!}
                            </div>
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
    </div>
  );
};

import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { useEffect, useState } from "react";
import { client } from "./backend";
import {
  ApplicationStage,
  Applications,
  Body34,
  Body42,
  Body43,
  Body47,
  BookingStatus,
  Notifications,
  ParkInventoryTypes,
} from "./api-client";
import { getApplicationStageDisplayName } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BookingKanbanItem } from "./BookingKanbanItem";
import { useRecoilState } from "recoil";
import { applicationsAtom, parkAtom, parkListsAtom } from "./atoms";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-regular-svg-icons";
import { BookingKanbanCreatingTask } from "./BookingKanbanCreatingTask";
import ListSelect from "./ListSelect";

interface Details {
  isShowed: boolean;
  applicationDetails: Applications | null;
}

export const BookingKanban = () => {
  const [applications, setApplications] = useRecoilState(applicationsAtom);
  const [, setParkLists] = useRecoilState(parkListsAtom);
  const [showModal, setShowModal] = useState(false);
  const [updatedCount, setUpdatedCount] = useState(0);
  const [notifications, setNotifications] = useState<Notifications[]>([]);
  const [lastUpdateTime, setLastUpdateTime] = useState(new Date());
  const [notificationResult, setNotificationResult] = useState("");
  const [unbookReason, setUnbookReason] = useState("");
  const [commentReason, setCommentReason] = useState("");
  const [park] = useRecoilState(parkAtom);
  const [idOpenAndCreateNotification, setIdOpenAndCreateNotification] =
    useState<number | null>(null);
  const [idOpenCancel, setIdOpenCancel] = useState<number | null>(null);
  const [idOpenConfirmed, setIdOpenConfirmed] = useState<number | null>(null);
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
      division_id: park.divisions?.[0]?.id,
      planned_arrival: undefined,
    })
  );

  const updateIntervalInSeconds = 60;

  const getParkLists = async () => {
    const data = await client.getParkInventoryListsManager();
    setParkLists(data.lists!);
  };

  const getApplications = async () => {
    const data = await client.getParkApplicationsManager(
      new Body42({ last_update_time: undefined })
    );
    setApplications(data.applications!);
    setNewApplication(
      new Body43({
        ...newApplication,
        division_id: park.divisions?.[0]?.id,
      })
    );
  };

  const cancelBooking = async (vin: string) => {
    const reasonForUnbook =
      unbookReason + (commentReason ? "\nКомментарий: " + commentReason : "");

    await client.updateCarBookingStatusManager(
      new Body34({
        status: BookingStatus.UnBooked,
        vin,
        reason: reasonForUnbook,
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
    getParkLists();
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
    try {
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
      setIdOpenConfirmed(null);
      getNotification();
    } catch (error: any) {
      if (error.errors) {
        const errorMessages = Object.values(error.errors).flatMap(
          (errorArray) => errorArray
        );
        const errorMessage = errorMessages.join("\n");
        alert("An error occurred:\n" + errorMessage);
      } else {
        alert("An error occurred: " + error.message);
      }
    }
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

  const changeApplicationData = async (
    id: number,
    item: string,
    itemData: string | number | undefined
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
      new Body47({ result: notificationResult, id })
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
    if (
      destinationColumn === ApplicationStage.ReservationCanceled ||
      destinationColumn === ApplicationStage.NotRealized ||
      destinationColumn === ApplicationStage.ArrivedAtOfficeNoCar
    ) {
      setIdOpenCancel(Number(draggableId));
    }
    if (destinationColumn === ApplicationStage.ReservationConfirmed) {
      setIdOpenConfirmed(Number(draggableId));
      setNewNotification({
        ...newNotification,
        message: "Водитель прийдет в парк",
      });
    }
  };

  const handleCancelApplication = (id: number) => {
    const application = applications.find((x) => x.id === id);
    setIdOpenCancel(null);
    if (application) {
      if (application.booking_id) {
        cancelBooking(application.booking.car.car_id);
      }
      if (!application.booking_id) {
        changeApplicationData(id, "reason_for_rejection", unbookReason);
      }
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

  return (
    <div className="flex justify-between w-full mt-4 space-x-1 sm:mx-0 sm:w-full sm:space-x-1 sm:justify-between">
      {!!notifications!.length && (
        <div className="fixed z-[60]  bottom-2 right-2">
          <div className="space-y-1">
            {notifications!.map((x) => {
              const content = JSON.parse(x.content!);
              const application = sortedApplications.find(
                (a) => a.id === x.application_id
              );
              return (
                <div
                  key={x.id}
                  className=" p-2 border-2 translate-x-[85%] bg-lightgrey rounded-xl animate-pulse hover:animate-none transition-transform hover:translate-x-0 border-red"
                >
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
      {idOpenAndCreateNotification ||
        (idOpenConfirmed && (
          <div
            className="fixed top-0 left-0 z-10 flex items-center justify-center w-full h-full bg-black bg-opacity-50 "
            onClick={(e) =>
              idOpenAndCreateNotification &&
              e.target === e.currentTarget &&
              setIdOpenAndCreateNotification(null)
            }
          >
            <div className="p-2 space-y-2 bg-white rounded-xl">
              {`${
                idOpenConfirmed
                  ? "Водитель прийдет в парк по заявке №" + idOpenConfirmed
                  : "Создание напоминание для заявки  №" +
                    idOpenAndCreateNotification
              }`}
              <div className="flex my-2 space-x-2">
                <Input
                  className={`m-0  ${
                    idOpenAndCreateNotification ? "w-44" : "w-full"
                  }`}
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
                {idOpenAndCreateNotification && (
                  <Input
                    className="m-0 w-96"
                    type="text"
                    value={
                      newNotification.message ? newNotification.message : ""
                    }
                    onChange={(e) =>
                      setNewNotification({
                        ...newNotification,
                        message: e.target.value,
                      })
                    }
                    placeholder="Коментарий"
                  />
                )}
              </div>
              <div className="flex space-x-2">
                {idOpenAndCreateNotification && (
                  <Button
                    variant={"reject"}
                    className="text-black"
                    onClick={() => setIdOpenAndCreateNotification(null)}
                  >
                    Назад
                  </Button>
                )}
                {newNotification.message && newNotification.date && (
                  <Button
                    variant={"default"}
                    className="mx-auto text-black w-44"
                    onClick={() =>
                      createNotification(
                        idOpenAndCreateNotification || idOpenConfirmed
                      )
                    }
                  >
                    Создать
                  </Button>
                )}
                {!(newNotification.message && newNotification.date) && (
                  <Button
                    variant={"default"}
                    className="mx-auto text-black w-44"
                    disabled
                  >
                    Создать
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}
      {idOpenCancel && (
        <div className="fixed top-0 left-0 z-10 flex items-center justify-center w-full h-full bg-black bg-opacity-50 ">
          <div className="p-2 space-y-2 bg-white rounded-xl">
            {applications.find((x) => x.id === idOpenCancel)!.booking_id && (
              <>
                Причина отмены бронирования №{idOpenCancel}
                <div className="flex flex-col space-y-2">
                  <ListSelect
                    onChange={(value) => setUnbookReason(value)}
                    resultValue={unbookReason}
                    type={ParkInventoryTypes.BookingRejectionReason}
                  />
                  <Input
                    type="text"
                    placeholder="Коментарий"
                    onChange={(e) => setCommentReason(e.target.value)}
                  />
                </div>
              </>
            )}
            {!applications.find((x) => x.id === idOpenCancel)?.booking_id && (
              <>
                Причина отмены заявки №{idOpenCancel}
                <div className="flex space-x-2">
                  <ListSelect
                    onChange={(value) => setUnbookReason(value)}
                    resultValue={unbookReason}
                    type={ParkInventoryTypes.CarRejectionReason}
                  />
                </div>
              </>
            )}
            <div className="flex mx-auto space-x-2 w-44">
              {unbookReason && (
                <Button
                  variant={"default"}
                  className="text-black"
                  onClick={() => handleCancelApplication(idOpenCancel)}
                >
                  Сохранить
                </Button>
              )}
              {!unbookReason && (
                <Button variant={"default"} className="text-black" disabled>
                  Сохранить
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
      <div className="flex w-full p-4 space-x-1 min-w-screen">
        <DragDropContext onDragEnd={onDragEnd}>
          {showDetails.isShowed && (
            <BookingKanbanItem
              id={showDetails.applicationDetails!.id!}
              close={() =>
                setShowDetails({ isShowed: false, applicationDetails: null })
              }
            />
          )}
          {showModal && (
            <BookingKanbanCreatingTask
              accept={() => {
                setShowModal(false);
                getApplications();
              }}
              close={() => setShowModal(false)}
            />
          )}
          {Object.keys(ApplicationStage).map((column: any) => (
            <div
              key={column}
              className="min-h-full p-1 bg-white border-2 min-w-48 border-pale rounded-xl "
            >
              <div className="relative h-16 mb-4 text-center border-b-2 border-pale">
                {getApplicationStageDisplayName(column)}
                {column === ApplicationStage.New && (
                  <Button onClick={() => setShowModal(true)} className="h-8">
                    Создать
                  </Button>
                )}
                <div className="absolute top-0 right-0 px-2 py-0 text-sm rounded-lg bg-lightgrey">
                  {
                    sortedApplications.filter((x) => x.current_stage === column)
                      .length
                  }
                </div>
              </div>
              <Droppable droppableId={column} key={column}>
                {(provided) => (
                  <div
                    className="w-full h-full pt-20 -mt-20 space-y-1 min-h-96"
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
                              {task.manager_id && (
                                <div className="">
                                  Ответственный: {task.manager.user.name}
                                </div>
                              )}
                              {!task.manager_id && (
                                <div className="">Нет ответственного</div>
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
    </div>
  );
};

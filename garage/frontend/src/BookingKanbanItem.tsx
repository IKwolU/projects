import { Button } from "@/components/ui/button";
import {
  ApplicationLogType,
  ApplicationStage,
  Applications,
  Body34,
  Body42,
  Body45,
  Body46,
  Body47,
  BookingStatus,
  Logs,
  ParkInventoryTypes,
} from "./api-client";
import { useEffect, useRef, useState } from "react";
import { client } from "./backend";
import { format } from "date-fns";
import { Separator } from "@/components/ui/separator";
import {
  getApplicationFieldDisplayName,
  getApplicationLogTypeDisplayName,
  getApplicationStageDisplayName,
  getCancelationSourceDisplayName,
} from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-regular-svg-icons";
import { useRecoilState } from "recoil";
import { applicationsAtom } from "./atoms";
import Confirmation from "@/components/ui/confirmation";
import countryList from "../../backend/public/assets/json/countries.json";
import carsList from "../../backend/public/assets/json/carsValid.json";
import {
  faArrowLeft,
  faCheck,
  faCircleCheck,
  faTriangleExclamation,
} from "@fortawesome/free-solid-svg-icons";
import ListSelect from "./ListSelect";
import ArrayStringSelect from "./ArrayStringSelect";

interface Details {
  id: number;
  close: () => void;
}

export const BookingKanbanItem = ({ id, close }: Details) => {
  const [applicationLogs, setApplicationsLogs] = useState<Logs[]>();
  const [applications, setApplications] = useRecoilState(applicationsAtom);
  const [updatedCount, setUpdatedCount] = useState(0);
  const lastElement = useRef<HTMLDivElement>(null);
  const [lastUpdateTime, setLastUpdateTime] = useState(new Date());
  const applicationDetails = applications.find((x) => x.id === id)!;

  const [plannedArrival, setPlannedArrival] = useState(
    applicationDetails!.planned_arrival
  );
  const [reasonForRejection, setReasonForRejection] = useState(
    applicationDetails!.reason_for_rejection
  );
  const [driverLicense, setDiverLicense] = useState(
    applicationDetails!.driver_license
  );
  const [licenseIssuingCountry, setLicenseIssuingCountry] = useState(
    applicationDetails!.license_issuing_country
  );
  const [citizenship, setCitizenship] = useState(
    applicationDetails!.citizenship
  );
  const [chosenModel, setChosenModel] = useState(
    applicationDetails!.chosen_model
  );
  const [chosenBrand, setChosenBrand] = useState(
    applicationDetails!.chosen_brand
  );
  const [userName, setUserName] = useState(applicationDetails!.user?.name);
  const [newNotification, setNewNotification] = useState({
    date: undefined as string | undefined,
    message: undefined as string | undefined,
  });
  const [notificationResult, setNotificationResult] = useState("");
  const [idOpenAndCreateNotification, setIdOpenAndCreateNotification] =
    useState<number | null>(null);
  const [idOpenCancel, setIdOpenCancel] = useState<number | null>(null);
  const [idOpenConfirmed, setIdOpenConfirmed] = useState<number | null>(null);
  const [unbookReason, setUnbookReason] = useState("");
  const [commentReason, setCommentReason] = useState("");
  const [comment, setComment] = useState("");
  const [filterTypeLogs, setFilterTypeLogs] = useState<ApplicationLogType[]>(
    []
  );
  const [isStartedCreateNotification, setIsStartedCreateNotification] =
    useState(false);

  const updateIntervalInSeconds = 60;

  const createNotification = async () => {
    try {
      await client.createNotificationManager(
        new Body47({
          date: newNotification.date,
          message: newNotification.message,
          result: null,
          id: applicationDetails.id,
        })
      );
      setNewNotification({ date: undefined, message: undefined });
      getApplicationLogs();
      setIdOpenAndCreateNotification(null);
      setIdOpenCancel(null);
      setIdOpenConfirmed(null);
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

  const updateNotification = async (id: number) => {
    const content = JSON.parse(
      applicationLogs!.find((x) => x.id! === id)!.content
    );

    client.updateNotificationManager(
      new Body47({ result: notificationResult, id: id })
    );
    setApplicationsLogs([
      ...applicationLogs!.filter((x) => x.id !== id),
      new Logs({
        ...applicationLogs!.find((x) => x.id === id),
        content: JSON.stringify({
          date: content.date,
          message: content.message,
          result: notificationResult,
        }),
      }),
    ]);
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

  const createComment = async () => {
    await client.createApplicationCommentManager(
      new Body46({ comment: comment, id: id })
    );
    setComment("");
    getApplicationLogs();
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
    getApplicationLogs();
  };

  const getApplicationLogs = async () => {
    const data = await client.getParkApplicationsLogItemsManager(
      new Body45({
        id: applicationDetails!.id,
        last_update_time: undefined,
      })
    );
    window.scrollTo(0, 0);
    setApplicationsLogs(data.logs!);
  };

  useEffect(() => {
    getApplicationLogs();
    const intervalId = setInterval(() => {
      setUpdatedCount((prevCount) => prevCount + 1);
    }, updateIntervalInSeconds * 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  useEffect(() => {
    if (lastElement.current) {
      lastElement.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [applicationLogs]);

  useEffect(() => {
    checkApplicationLogs();
  }, [updatedCount]);

  const checkApplicationLogs = async () => {
    const data = await client.getParkApplicationsLogItemsManager(
      new Body45({
        last_update_time: lastUpdateTime,
        id: applicationDetails!.id,
      })
    );

    if (data.logs!.length > 0) {
      setApplicationsLogs([
        ...applicationLogs!.filter(
          (x) => !data.logs!.map((a) => a.id).includes(x.id!)
        ),
        ...data.logs!,
      ]);
      lastUpdateTime.setSeconds(
        lastUpdateTime.getSeconds() + updateIntervalInSeconds
      );
      setLastUpdateTime(lastUpdateTime);
    }
  };

  const handleStageChange = (value: string) => {
    const susValue = Object.keys(ApplicationStage).find(
      (x: any) => getApplicationStageDisplayName(x) === value
    );
    const destinationColumn = susValue;
    const id = applicationDetails!.id;

    changeApplicationData(applicationDetails!.id!, "current_stage", susValue);

    if (
      destinationColumn === ApplicationStage.Thinking ||
      destinationColumn === ApplicationStage.NoAnswer
    ) {
      setIdOpenAndCreateNotification(id!);
    }
    if (
      destinationColumn === ApplicationStage.ReservationCanceled ||
      destinationColumn === ApplicationStage.NotRealized ||
      destinationColumn === ApplicationStage.ArrivedAtOfficeNoCar
    ) {
      setIdOpenCancel(Number(id));
    }
    if (destinationColumn === ApplicationStage.ReservationConfirmed) {
      setIdOpenConfirmed(Number(id));
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

  const filteredApplicationLogs = applicationLogs?.filter((log: Logs) =>
    filterTypeLogs.length ? filterTypeLogs.includes(log.type! as any) : true
  );

  if (!applicationLogs) {
    return <></>;
  }

  return (
    <>
      <div className="fixed -top-8 left-0 z-[51] pt-10 w-screen h-full bg-lightgrey mt-8">
        {(idOpenAndCreateNotification || idOpenConfirmed) && (
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
                    format(new Date(newNotification.date), "dd.MM.yyyy HH:mm")
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
                    placeholder="комментарий"
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
                    onClick={() => createNotification()}
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
        )}
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
                      placeholder="комментарий"
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
        <div className="flex gap-2 p-2 max-w-[calc(100vw-20px)] m-auto">
          <div className="w-1/3 p-4 overflow-x-auto border-2 border-pale rounded-xl h-[calc(100vh-90px)] bg-white min-w-[550px]">
            <div className="flex justify-between mb-2">
              <div className="font-semibold">
                Заявка №{applicationDetails!.id}
              </div>
              <div className="">
                Статус:{" "}
                <ArrayStringSelect
                  list={Object.keys(ApplicationStage).map((x: any) =>
                    getApplicationStageDisplayName(x)
                  )}
                  onChange={(value) => handleStageChange(value)}
                  resultValue={getApplicationStageDisplayName(
                    applicationDetails!.current_stage!
                  )}
                />
              </div>
            </div>
            <div className="">
              <div className="">
                {[
                  {
                    title: "Ответственный",
                    content: applicationDetails!.division!.manager?.user!.name,
                  },
                  {
                    title: "Город",
                    content: applicationDetails!.division!.city!.name,
                  },
                  {
                    title: "Подразделение",
                    content: applicationDetails!.division!.name,
                  },
                  {
                    title: "Источник рекламы",
                    content: applicationDetails!.advertising_source,
                  },
                  {
                    title: "Телефон",
                    content: applicationDetails!.user?.phone,
                  },
                ].map(({ title, content }) => (
                  <div className="" key={title}>
                    <div className="flex justify-between">
                      <div className="">{title}</div>
                      <div className="">{content}</div>
                    </div>
                    <Separator className="my-1" />
                  </div>
                ))}
                <div className="">
                  <div className="flex items-center justify-between ">
                    <div className="">ФИО</div>
                    <div className="flex items-center gap-1">
                      <Input
                        className="m-0 w-72"
                        type="text"
                        onChange={(e) => setUserName(e.target.value)}
                        placeholder={applicationDetails!.user?.name}
                      />
                      <div className="">
                        <Confirmation
                          accept={() =>
                            applicationDetails.user?.name !== userName &&
                            changeApplicationData(
                              applicationDetails!.id!,
                              "user_name",
                              userName
                            )
                          }
                          cancel={() => {}}
                          title="Вы хотите изменить ФИО учетной записи водителя?"
                          trigger={
                            <FontAwesomeIcon
                              icon={faPenToSquare}
                              className={`h-6 transition-colors cursor-pointer   active:text-yellow ${
                                applicationDetails.user?.name === userName
                                  ? "text-grey"
                                  : "text-black"
                              }`}
                            />
                          }
                          type="green"
                        />
                      </div>
                    </div>
                  </div>
                  <Separator className="my-1" />
                </div>
                <div className="">
                  <div className="flex items-center justify-between">
                    <div className="">Планирует прийти</div>
                    <div className="relative flex items-center gap-1">
                      <Input
                        className="m-0 w-44"
                        type="datetime-local"
                        value={
                          plannedArrival
                            ? plannedArrival
                            : applicationDetails!.planned_arrival
                        }
                        onChange={(e) => setPlannedArrival(e.target.value)}
                        placeholder={
                          applicationDetails!.planned_arrival &&
                          format(
                            new Date(applicationDetails!.planned_arrival),
                            "dd.MM.yyyy HH:mm"
                          )
                        }
                      />
                      <FontAwesomeIcon
                        onClick={() =>
                          applicationDetails!.planned_arrival !==
                            plannedArrival &&
                          changeApplicationData(
                            applicationDetails!.id!,
                            "planned_arrival",
                            plannedArrival
                          )
                        }
                        icon={faPenToSquare}
                        className={`h-6 transition-colors cursor-pointer   active:text-yellow ${
                          applicationDetails!.planned_arrival === plannedArrival
                            ? "text-grey"
                            : "text-black"
                        }`}
                      />
                    </div>
                  </div>
                  <Separator className="my-1" />
                </div>
                {applicationDetails!.booking &&
                  [
                    {
                      title: "Марка/Модель",
                      content:
                        applicationDetails!.booking!.car?.brand +
                        " " +
                        applicationDetails!.booking!.car?.model,
                    },
                    {
                      title: "Гос номер",
                      content: applicationDetails!.booking.car!.license_plate,
                    },
                    {
                      title: "Условия аренды",
                      content: `${
                        applicationDetails!.booking.schema?.working_days
                      }/${
                        applicationDetails!.booking.schema?.non_working_days
                      } ${applicationDetails!.booking.schema?.daily_amount}`,
                    },
                    {
                      title: "Кто отменил бронь",
                      content: getCancelationSourceDisplayName(
                        applicationDetails!.booking.cancellation_source
                      ),
                    },
                    {
                      title: "Причина отмены брони",
                      content: applicationDetails!.booking.cancellation_reason,
                    },
                  ].map(({ title, content }) => (
                    <div className="" key={title}>
                      <div className="flex justify-between">
                        <div className="">{title}</div>
                        <div className="">{content}</div>
                      </div>
                      <Separator className="my-1" />
                    </div>
                  ))}

                <div className="">
                  <div className="flex items-center justify-between">
                    <div className="">Номер водительского удостоверения</div>
                    <div className="relative flex items-center gap-1">
                      <Input
                        className="m-0 w-72 "
                        type="text"
                        onChange={(e) => setDiverLicense(e.target.value)}
                        placeholder={applicationDetails!.driver_license}
                      />
                      <FontAwesomeIcon
                        onClick={() =>
                          applicationDetails!.driver_license !==
                            driverLicense &&
                          changeApplicationData(
                            applicationDetails!.id!,
                            "driver_license",
                            driverLicense
                          )
                        }
                        icon={faPenToSquare}
                        className={`h-6 transition-colors cursor-pointer   active:text-yellow ${
                          applicationDetails!.driver_license === driverLicense
                            ? "text-grey"
                            : "text-black"
                        }`}
                      />
                    </div>
                  </div>
                  <Separator className="my-1" />
                </div>
              </div>{" "}
              {!applicationDetails!.booking && (
                <>
                  <div className="flex items-center justify-between">
                    <div className="">Марка/модель</div>

                    <div className="relative flex items-center space-x-1">
                      <div className="w-44">
                        <ArrayStringSelect
                          list={carsList.map((x) => x.name)}
                          onChange={(value) => {
                            setChosenBrand(value);
                            setChosenModel(undefined);
                          }}
                          resultValue={chosenBrand}
                        />
                      </div>
                      <div className="w-44">
                        <ArrayStringSelect
                          list={
                            carsList.find((x) => x.name === chosenBrand)
                              ?.models || [""]
                          }
                          onChange={(value) => setChosenModel(value)}
                          resultValue={chosenModel}
                        />
                      </div>
                      <FontAwesomeIcon
                        onClick={() => {
                          applicationDetails!.chosen_brand !== chosenBrand &&
                            changeApplicationData(
                              applicationDetails!.id!,
                              "chosen_brand",
                              chosenBrand
                            );
                          applicationDetails!.chosen_model !== chosenModel &&
                            changeApplicationData(
                              applicationDetails!.id!,
                              "chosen_model",
                              chosenModel
                            );
                        }}
                        icon={faPenToSquare}
                        className={`h-6 transition-colors cursor-pointer  active:text-yellow ${
                          applicationDetails!.chosen_brand === chosenBrand &&
                          applicationDetails!.chosen_model === chosenModel
                            ? "text-grey"
                            : "text-black"
                        }`}
                      />
                    </div>
                  </div>
                  <Separator className="my-1" />
                </>
              )}
              <div className="flex items-center justify-between">
                <div className="">Страна выдачи прав</div>
                <div className="flex items-center space-x-1">
                  <div className="w-80">
                    <ArrayStringSelect
                      list={countryList}
                      resultValue={licenseIssuingCountry}
                      onChange={(value) => setLicenseIssuingCountry(value)}
                    />
                  </div>
                  <FontAwesomeIcon
                    onClick={() =>
                      applicationDetails!.license_issuing_country !==
                        licenseIssuingCountry &&
                      changeApplicationData(
                        applicationDetails!.id!,
                        "license_issuing_country",
                        licenseIssuingCountry
                      )
                    }
                    icon={faPenToSquare}
                    className={`h-6 transition-colors cursor-pointer   active:text-yellow ${
                      applicationDetails!.license_issuing_country ===
                      licenseIssuingCountry
                        ? "text-pale"
                        : "text-black"
                    }`}
                  />
                </div>
              </div>
              <Separator className="my-1" />{" "}
              <div className="flex items-center justify-between">
                <div className="">Гражданство</div>
                <div className="flex items-center space-x-1">
                  <div className="w-80">
                    <ArrayStringSelect
                      list={countryList}
                      resultValue={citizenship}
                      onChange={(value) => setCitizenship(value)}
                    />
                  </div>
                  <FontAwesomeIcon
                    onClick={() =>
                      applicationDetails!.citizenship !== citizenship &&
                      changeApplicationData(
                        applicationDetails!.id!,
                        "citizenship",
                        citizenship
                      )
                    }
                    icon={faPenToSquare}
                    className={`h-6 transition-colors cursor-pointer   active:text-yellow ${
                      applicationDetails!.citizenship === citizenship
                        ? "text-pale"
                        : "text-black"
                    }`}
                  />
                </div>
              </div>
              <Separator className="my-1" />
              <div className="flex items-center justify-between">
                <div className="">Причина отказа от авто</div>
                <div className="flex items-center space-x-1">
                  <div className="w-80">
                    <ListSelect
                      resultValue={reasonForRejection}
                      onChange={(value) => setReasonForRejection(value)}
                      type={ParkInventoryTypes.CarRejectionReason}
                    />
                  </div>
                  <FontAwesomeIcon
                    onClick={() =>
                      applicationDetails!.reason_for_rejection !==
                        reasonForRejection &&
                      changeApplicationData(
                        applicationDetails!.id!,
                        "reason_for_rejection",
                        reasonForRejection
                      )
                    }
                    icon={faPenToSquare}
                    className={`h-6 transition-colors cursor-pointer   active:text-yellow ${
                      applicationDetails!.reason_for_rejection ===
                      reasonForRejection
                        ? "text-pale"
                        : "text-black"
                    }`}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col justify-between w-2/3 pt-2 bg-white border-2 border-pale rounded-xl">
            <div className="text-xl text-center ">
              История изменений
              <div className="flex p-2 space-x-1">
                {Object.keys(ApplicationLogType).map((item: any) => {
                  const selectedItem = filterTypeLogs.includes(item);

                  return (
                    <div
                      onClick={() =>
                        selectedItem
                          ? setFilterTypeLogs([
                              ...filterTypeLogs.filter((x) => x !== item),
                            ])
                          : setFilterTypeLogs([...filterTypeLogs, item])
                      }
                      className="flex items-center justify-between p-1 space-x-1 text-xs border-2 cursor-pointer border-pale rounded-xl"
                      key={item}
                    >
                      <div className="text-nowrap">
                        {getApplicationLogTypeDisplayName(item)}
                      </div>
                      <div
                        className={`${
                          selectedItem ? "bg-yellow" : "border border-gray"
                        } w-4 h-4  p-1 flex items-center justify-center rounded`}
                      >
                        {selectedItem && (
                          <FontAwesomeIcon
                            icon={faCheck}
                            className="cursor-pointer"
                          />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="overflow-x-auto h-[calc(100vh-300px)] p-4 ">
              {filteredApplicationLogs?.map((log, i) => {
                const content = JSON.parse(log.content);
                return (
                  <div
                    className=""
                    key={log.id}
                    ref={
                      filteredApplicationLogs?.length === i + 1
                        ? lastElement
                        : null
                    }
                  >
                    {log.type !== ApplicationLogType.Notification && (
                      <div className="flex items-center space-x-2 text-sm">
                        <div className="flex items-center space-x-2">
                          <div className="w-24 text-xs text-nowrap">
                            {format(
                              new Date(log.created_at!),
                              "dd.MM.yyyy HH:mm"
                            )}
                          </div>
                          {log.type !== ApplicationLogType.Create && (
                            <div className="">
                              {log.manager
                                ? log.manager.user!.name
                                : "Нет ответственного,"}
                            </div>
                          )}
                        </div>
                        {log.type === ApplicationLogType.Stage && (
                          <div className="inline space-x-2">
                            Изменен этап с{" "}
                            <span className="font-semibold">
                              {getApplicationStageDisplayName(
                                content.old_stage!
                              )}
                            </span>{" "}
                            на{" "}
                            <span className="font-semibold">
                              {getApplicationStageDisplayName(
                                content.new_stage!
                              )}
                            </span>
                          </div>
                        )}
                        {log.type === ApplicationLogType.Content && (
                          <div className="inline space-x-2">
                            <span className="text-sm">Изменено поле</span>
                            <span className="font-semibold">
                              {getApplicationFieldDisplayName(content.column)}
                            </span>
                            <span>значение</span>
                            <span className="font-semibold">
                              {content.old_content}
                            </span>
                            <span>изменено на</span>
                            <span className="font-semibold">
                              {content.new_content}
                            </span>
                          </div>
                        )}
                        {log.type === ApplicationLogType.Create && (
                          <div className="flex gap-2 flex-nowrap">
                            <div>{content.creator}</div>
                            {content.creator === "Менеджер"
                              ? log.manager!.user!.name
                              : applicationDetails!.user?.phone}
                            <div>создал заявку</div>
                          </div>
                        )}
                        {log.type === ApplicationLogType.Comment && (
                          <div className="flex items-center gap-2 flex-nowrap">
                            <div className="font-semibold">Комментарий:</div>{" "}
                            <div className="">{content.comment}</div>
                          </div>
                        )}
                      </div>
                    )}
                    {log.type === ApplicationLogType.Notification && (
                      <div
                        className={` relative border-2 flex space-x-4  items-center  ${
                          content.result ? "border-green-500" : "border-red"
                        } rounded`}
                      >
                        <div className="absolute top-0 right-0 p-1 text-xs ">
                          {format(
                            new Date(log.updated_at!),
                            "dd.MM.yyyy HH:mm"
                          )}
                        </div>
                        <div
                          className={`border-r-2 p-2 flex flex-col w-32 justify-center items-center ${
                            content.result ? "border-green-500" : "border-red"
                          }`}
                        >
                          {content.result && (
                            <FontAwesomeIcon
                              icon={faCircleCheck}
                              className="h-10 text-green-500"
                            />
                          )}
                          {!content.result && (
                            <FontAwesomeIcon
                              icon={faTriangleExclamation}
                              className="h-10 text-red"
                            />
                          )}
                          <div className="text-sm">
                            {format(new Date(content.date), "dd.MM.yyyy HH:mm")}
                          </div>
                        </div>
                        <div className="">
                          <div
                            className={`${content.result && "line-through"}`}
                          >
                            {content.message}
                          </div>
                          {content.result && (
                            <div className="">{content.result}</div>
                          )}
                          {!content.result && (
                            <div className="flex items-center space-x-2">
                              <Input
                                className="w-64 m-0"
                                type="text"
                                onChange={(e) =>
                                  setNotificationResult(e.target.value)
                                }
                                placeholder="Результат"
                              />
                              <FontAwesomeIcon
                                onClick={() => updateNotification(log.id!)}
                                icon={faPenToSquare}
                                className="h-6 transition-colors cursor-pointer text-pale hover:text-black active:text-yellow"
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                    <Separator className="my-1 bg-pale" />
                  </div>
                );
              })}
            </div>
            <Button
              variant={"default"}
              className="m-2 text-base w-fit"
              onClick={() => setIsStartedCreateNotification(true)}
            >
              Создать напоминание
            </Button>
            <div className="flex items-center gap-2 p-2 border-t border-pale">
              <Input
                onKeyDown={(e) => e.key === "Enter" && createComment()}
                onChange={(e) => setComment(e.target.value)}
                type="text"
                value={comment}
                placeholder="Введите комментарий"
                className="m-0"
              />
              <FontAwesomeIcon
                onClick={() => createComment()}
                icon={faPenToSquare}
                className={`h-6 transition-colors cursor-pointer   active:text-yellow ${
                  applicationDetails!.citizenship === citizenship
                    ? "text-pale"
                    : "text-black"
                }`}
              />
            </div>
          </div>
        </div>
        {isStartedCreateNotification && (
          <div
            className="fixed top-0 left-0 z-10 flex items-center justify-center w-full h-full p-2 mx-auto bg-black bg-opacity-50"
            onClick={(e) =>
              e.target === e.currentTarget &&
              setIsStartedCreateNotification(false)
            }
          >
            <div className="flex flex-col items-center gap-2 justify-between p-2  bg-white border-2 border-pale rounded-xl max-w-[1208px]">
              <div className="flex items-center w-full space-x-2">
                <span className="text-nowrap">Создать напоминание:</span>
                <Input
                  className="w-full m-0"
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
                    format(new Date(newNotification.date), "dd.MM.yyyy HH:mm")
                  }
                />
              </div>
              <Input
                className="w-full m-0"
                type="text"
                value={newNotification.message ? newNotification.message : ""}
                onChange={(e) =>
                  setNewNotification({
                    ...newNotification,
                    message: e.target.value,
                  })
                }
                placeholder="комментарий"
              />
              <div className="flex w-full space-x-2">
                <Button
                  onClick={() => setIsStartedCreateNotification(false)}
                  variant={"reject"}
                  className="w-1/2 text-black"
                >
                  Отмена
                </Button>
                {newNotification.date && newNotification.message && (
                  <Button
                    className="w-1/2"
                    onClick={() => {
                      createNotification();
                      setIsStartedCreateNotification(false);
                    }}
                    variant={"manager"}
                  >
                    Создать
                  </Button>
                )}
                {(!newNotification.date || !newNotification.message) && (
                  <Button className="w-1/2" disabled variant={"manager"}>
                    Создать
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}

        <FontAwesomeIcon
          onClick={close}
          icon={faArrowLeft}
          className="fixed top-0 transition-colors cursor-pointer text-pale h-14 left-2 hover:text-black"
        />
      </div>
    </>
  );
};

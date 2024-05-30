import { Button } from "@/components/ui/button";
import {
  ApplicationLogType,
  Applications,
  Body42,
  Body45,
  Body47,
  Body49,
  Logs,
  ParkInventoryTypes,
} from "./api-client";
import { useEffect, useRef, useState } from "react";
import { client } from "./backend";
import { format } from "date-fns";
import { Separator } from "@/components/ui/separator";
import {
  getApplicationFieldDisplayName,
  getApplicationStageDisplayName,
} from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-regular-svg-icons";
import { useRecoilState } from "recoil";
import { applicationsAtom, parkListsAtom } from "./atoms";
import Confirmation from "@/components/ui/confirmation";
import carsList from "../../backend/public/assets/json/carsValid.json";
import {
  faCircleCheck,
  faTriangleExclamation,
} from "@fortawesome/free-solid-svg-icons";

interface Details {
  id: number;
  close: () => void;
}

export const BookingKanbanItem = ({ id, close }: Details) => {
  const [applicationLogs, setApplicationsLogs] = useState<Logs[]>();
  const [applications, setApplications] = useRecoilState(applicationsAtom);
  const [parkLists, setParkLists] = useRecoilState(parkListsAtom);
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

  const [newListItem, setNewListItem] = useState<{
    type: ParkInventoryTypes | undefined;
    content: string | undefined;
  }>({ type: undefined, content: undefined });

  const updateIntervalInSeconds = 60;

  const getParkLists = async () => {
    const data = await client.getParkInventoryListsManager();
    setParkLists(data.lists!);
  };

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

  const createParkListItem = async () => {
    await client.createParkInventoryListItemManager(
      new Body49({ content: newListItem.content, type: newListItem.type })
    );
    getParkLists();
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
    getApplicationLogs();
  };

  const getApplicationLogs = async () => {
    const data = await client.getParkApplicationsLogItemsManager(
      new Body45({
        id: applicationDetails!.id,
        last_update_time: undefined,
      })
    );
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

  const handleAddReasonForRejection = () => {
    console.log(1);
  };

  if (!applicationLogs) {
    return <></>;
  }

  return (
    <>
      <div className="fixed -top-20 left-0 z-[51] pt-20 w-full h-full bg-lightgrey mt-8">
        <div className="flex gap-2 p-2 max-w-[1208px] m-auto">
          <div className="w-1/2 p-4 overflow-x-auto border-2 border-pale rounded-xl h-[800px] bg-white">
            <div className="flex justify-between mb-2">
              <div className="font-semibold">
                Заявка №{applicationDetails!.id}
              </div>
              <div className="">
                Статус:{" "}
                <span className="font-semibold">
                  {getApplicationStageDisplayName(
                    applicationDetails!.current_stage!
                  )}
                </span>
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
                {/* <div className="">
                  <div className="flex justify-between">
                    <div className="">Гражданство</div>
                    <div className="">{applicationDetails!.user?.name}</div>
                  </div>
                  <Separator />
                </div>
                <div className="">
                  <div className="flex justify-between">
                    <div className="">Страна выдачи ВУ</div>
                    <div className="">{applicationDetails!.user?.name}</div>
                  </div>
                  <Separator />
                </div> */}
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
                            applicationDetails!.planned_arrival,
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
                      content: applicationDetails!.booking.cancellation_source,
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
                <div className="flex items-center justify-between">
                  <div className="">Марка/модель</div>
                  <div className="relative flex items-center space-x-1">
                    <select
                      className="h-10 p-1 m-0 border-2 w-44 border-grey rounded-xl"
                      name=""
                      id=""
                      defaultValue={chosenBrand}
                      onChange={(e) => setChosenBrand(e.target.value)}
                    >
                      <option value={""}>Марка</option>
                      {carsList.map((y) => (
                        <option key={y.name} value={y.name}>
                          {y.name}
                        </option>
                      ))}
                    </select>
                    <select
                      className="h-10 p-1 m-0 border-2 w-44 border-grey rounded-xl"
                      name=""
                      id=""
                      onChange={(e) => setChosenModel(e.target.value)}
                      defaultValue={chosenModel}
                    >
                      <option value={""}>Модель</option>
                      {chosenBrand &&
                        chosenBrand !== "Модель" &&
                        carsList!
                          .find(({ name }) => name === chosenBrand!)
                          ?.models.map((y: string) => (
                            <option key={y} value={y}>
                              {y}
                            </option>
                          ))}
                    </select>
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
                {[
                  {
                    text: "Номер водительского удостоверения",
                    onChange: (value: string) => setDiverLicense(value),
                    name: "driver_license",
                    state: driverLicense,
                  },
                  {
                    text: "Страна выдачи прав",
                    onChange: (value: string) =>
                      setLicenseIssuingCountry(value),
                    name: "license_issuing_country",
                    state: licenseIssuingCountry,
                  },
                ].map(({ text, onChange, name, state }) => (
                  <div className="" key={name}>
                    <div className="flex items-center justify-between">
                      <div className="">{text}</div>
                      <div className="relative flex items-center gap-1">
                        <Input
                          className="m-0 w-72 "
                          type="text"
                          onChange={(e) => onChange(e.target.value)}
                          placeholder={applicationDetails![name]}
                        />
                        <FontAwesomeIcon
                          onClick={() =>
                            applicationDetails![name] !== state &&
                            changeApplicationData(
                              applicationDetails!.id!,
                              name,
                              state
                            )
                          }
                          icon={faPenToSquare}
                          className={`h-6 transition-colors cursor-pointer   active:text-yellow ${
                            applicationDetails![name] === state
                              ? "text-grey"
                              : "text-black"
                          }`}
                        />
                      </div>
                    </div>
                    <Separator className="my-1" />
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between">
                <div className="">Причина отказа от авто</div>
                <div className="relative flex items-center space-x-1 group">
                  {/* <div className="absolute right-0 flex items-center p-2 m-0 space-x-2 transition-opacity opacity-0 bg-lightgrey rounded-xl -bottom-14 -z-10 group-hover:opacity-100 group-hover:z-0">
                     <Input
                      className="m-0 w-96"
                      placeholder="Новый элемент списка"
                      onChange={(e) =>
                        setNewListItem({
                          content: e.target.value,
                          type: ParkInventoryTypes.CarRejectionReason,
                        })
                      }
                    /> 
                    <FontAwesomeIcon
                      onClick={() =>
                        newListItem.type ===
                          ParkInventoryTypes.CarRejectionReason &&
                        newListItem.content &&
                        createParkListItem()
                      }
                      icon={faPenToSquare}
                      className={`h-6 transition-colors cursor-pointer active:text-yellow ${
                        newListItem.type ===
                          ParkInventoryTypes.CarRejectionReason &&
                        newListItem.content
                          ? "text-black"
                          : "text-grey"
                      }`}
                    />
                  </div> */}

                  <select
                    className="w-full h-10 p-1 m-0 border-2 border-grey rounded-xl "
                    name=""
                    id=""
                    defaultValue={reasonForRejection}
                    onChange={(e) => setReasonForRejection(e.target.value)}
                  >
                    <option value={""}>Не указано</option>
                    {parkLists
                      .filter(
                        (list) =>
                          list.type === ParkInventoryTypes.CarRejectionReason
                      )
                      .map((y) => (
                        <option key={y.id} value={y.content}>
                          {y.content}
                        </option>
                      ))}
                  </select>

                  <FontAwesomeIcon
                    onClick={() => {
                      applicationDetails!.reason_for_rejection !==
                        reasonForRejection &&
                        changeApplicationData(
                          applicationDetails!.id!,
                          "reason_for_rejection",
                          reasonForRejection
                        );
                    }}
                    icon={faPenToSquare}
                    className={`h-6 transition-colors cursor-pointer   active:text-yellow ${
                      applicationDetails!.reason_for_rejection ===
                      reasonForRejection
                        ? "text-grey"
                        : "text-black"
                    }`}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col justify-between w-1/2 pt-2 bg-white border-2 border-pale rounded-xl">
            <div className="text-xl text-center ">История изменений</div>
            <div className="overflow-x-auto h-[700px] p-4">
              {applicationLogs!.map((log, i) => {
                const content = JSON.parse(log.content);
                return (
                  <div
                    className=""
                    key={log.id}
                    ref={applicationLogs.length === i + 1 ? lastElement : null}
                  >
                    {log.type !== ApplicationLogType.Notification && (
                      <div className="flex items-center space-x-2 text-sm">
                        <div className="">
                          <div className="text-nowrap ">
                            {format(log.created_at!, "dd.MM.yyyy HH:mm")}
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
                            изменен этап с{" "}
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
                            <span>Изменено поле</span>
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
                      </div>
                    )}
                    {log.type === ApplicationLogType.Notification && (
                      <div
                        className={` relative border-2 flex space-x-4  items-center  ${
                          content.result ? "border-green-500" : "border-red"
                        } rounded`}
                      >
                        <div className="absolute top-0 right-0 p-1 text-xs ">
                          {format(log.updated_at!, "dd.MM.yyyy HH:mm")}
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
                            {format(content.date, "dd.MM.yyyy HH:mm")}
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
                    <Separator />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <div className="max-w-[1208px]  mx-auto p-2  ">
          <div className="flex items-center justify-between p-2 space-x-2 bg-white border-2 border-pale rounded-xl">
            {" "}
            <span>Создать напоминание:</span>{" "}
            <Input
              className="m-0 w-44"
              type="datetime-local"
              value={
                newNotification.date ? newNotification.date : String(new Date())
              }
              onChange={(e) =>
                setNewNotification({ ...newNotification, date: e.target.value })
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
            {newNotification.date && newNotification.message && (
              <Button onClick={createNotification} variant={"manager"}>
                Создать
              </Button>
            )}
            {(!newNotification.date || !newNotification.message) && (
              <Button disabled variant={"manager"}>
                Создать
              </Button>
            )}
          </div>
        </div>
        <Button
          onClick={close}
          variant={"reject"}
          className="fixed w-24 text-black top-10 left-2"
        >
          Назад
        </Button>
      </div>
    </>
  );
};

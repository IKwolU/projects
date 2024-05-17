import { Button } from "@/components/ui/button";
import {
  ApplicationLogType,
  Applications,
  Body42,
  Body44,
  Logs,
} from "./api-client";
import { useEffect, useRef, useState } from "react";
import { client } from "./backend";
import { format } from "date-fns";
import { Separator } from "@/components/ui/separator";
import { getApplicationStageDisplayName } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-regular-svg-icons";

interface Details {
  applicationDetails: Applications;
  close: () => void;
}

export const BookingKanbanItem = ({ applicationDetails, close }: Details) => {
  const [applicationLogs, setApplicationsLogs] = useState<Logs[]>();
  const lastElement = useRef<HTMLDivElement>(null);
  const [plannedArrival, setPlannedArrival] = useState(
    applicationDetails!.planned_arrival
  );
  const [reasonForRejection, setReasonForRejection] = useState(
    applicationDetails!.reason_for_rejection
  );
  const [userName, setUserName] = useState(applicationDetails!.user?.name);

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
    const getApplicationLogs = async () => {
      const data = await client.getParkApplicationsLogItemsManager(
        new Body44({ id: applicationDetails!.id })
      );
      setApplicationsLogs(data.logs!);
    };

    getApplicationLogs();
  }, []);

  useEffect(() => {
    if (lastElement.current) {
      lastElement.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [applicationLogs]);

  if (!applicationLogs) {
    return <></>;
  }

  return (
    <>
      <div className="fixed top-0 left-0 z-[51] w-full h-full bg-lightgrey">
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
                  <div className="relative flex items-center justify-between ">
                    <div className="">ФИО</div>
                    <div className="flex items-center gap-1">
                      <Input
                        className="m-0 w-72"
                        type="text"
                        onChange={(e) => setUserName(e.target.value)}
                        placeholder={applicationDetails!.user?.name}
                      />
                      <FontAwesomeIcon
                        icon={faPenToSquare}
                        className="h-6 transition-colors cursor-pointer text-pale hover:text-black active:text-yellow"
                      />
                      <div
                        className={`absolute text-3xl -right-4 -top-1 w-4 h-4 text-yellow transition-opacity ${
                          applicationDetails.user?.name === userName
                            ? "opacity-0"
                            : "opacity-100"
                        }`}
                      >
                        !
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
                        value={applicationDetails!.planned_arrival}
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
                          changeApplicationData(
                            applicationDetails!.id!,
                            "planned_arrival",
                            plannedArrival
                          )
                        }
                        icon={faPenToSquare}
                        className="h-6 transition-colors cursor-pointer text-pale hover:text-black active:text-yellow"
                      />
                      <div
                        className={`absolute text-3xl -right-4 -top-1 w-4 h-4 text-yellow transition-opacity ${
                          applicationDetails!.planned_arrival === plannedArrival
                            ? "opacity-0"
                            : "opacity-100"
                        }`}
                      >
                        !
                      </div>
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
                      } ${
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
                <div className="">
                  <div className="flex items-center justify-between">
                    <div className="">Причина отказа от авто</div>
                    <div className="relative flex items-center gap-1">
                      <Input
                        className="m-0 w-72 "
                        type="text"
                        onChange={(e) => setReasonForRejection(e.target.value)}
                        placeholder={applicationDetails!.reason_for_rejection}
                      />
                      <FontAwesomeIcon
                        onClick={() =>
                          changeApplicationData(
                            applicationDetails!.id!,
                            "reason_for_rejection",
                            reasonForRejection
                          )
                        }
                        icon={faPenToSquare}
                        className="h-6 transition-colors cursor-pointer text-pale hover:text-black active:text-yellow"
                      />
                      <div
                        className={`absolute text-3xl -right-4 -top-1 w-4 h-4 text-yellow transition-opacity ${
                          applicationDetails!.reason_for_rejection ===
                          reasonForRejection
                            ? "opacity-0"
                            : "opacity-100"
                        }`}
                      >
                        !
                      </div>
                    </div>
                  </div>

                  <Separator className="my-1" />
                </div>
              </div>
            </div>
          </div>
          <div className="w-1/2 p-4 overflow-x-auto border-2 border-pale rounded-xl h-[800px] bg-white">
            <div className="text-xl text-center">История изменений</div>
            {applicationLogs!.map((log, i) => {
              const content = JSON.parse(log.content);
              return (
                <div
                  className=""
                  key={log.id}
                  ref={applicationLogs.length === i + 1 ? lastElement : null}
                >
                  {log.type !== ApplicationLogType.Notification && (
                    <div className="flex space-x-2 text-sm">
                      <div className="">
                        {format(log.created_at!, "dd.MM.yyyy HH:mm")}
                      </div>
                      {log.type !== ApplicationLogType.Create && (
                        <div className="">
                          {log.manager
                            ? log.manager.user!.name + ","
                            : "Нет ответственного,"}
                        </div>
                      )}
                      {log.type === ApplicationLogType.Stage && (
                        <div className="inline space-x-2">
                          изменен этап с{" "}
                          <span className="font-semibold">
                            {getApplicationStageDisplayName(content.old_stage!)}
                          </span>{" "}
                          на{" "}
                          <span className="font-semibold">
                            {getApplicationStageDisplayName(content.new_stage!)}
                          </span>
                        </div>
                      )}
                      {log.type === ApplicationLogType.Content && (
                        <div className="inline space-x-2">
                          изменено поле{" "}
                          <span className="font-semibold">
                            {content.column}
                          </span>
                          значение
                          <span className="font-semibold">
                            {content.old_content}
                          </span>
                          изменено на
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
                  <Separator />
                </div>
              );
            })}
          </div>
        </div>

        <Button onClick={close} className="">
          Назад
        </Button>
      </div>
    </>
  );
};

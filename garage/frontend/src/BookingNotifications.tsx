import { Notifications2 } from "./api-client";
import { useEffect, useState } from "react";
import { client } from "./backend";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { BookingKanbanItem } from "./BookingKanbanItem";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import ArrayStringSelect from "./ArrayStringSelect";

interface Details {
  isShowed: boolean;
  applicationId: number | undefined;
}

export const BookingNotifications = () => {
  const [notifications, setNotifications] = useState<
    Notifications2[] | undefined
  >();
  const [showDetails, setShowDetails] = useState<Details>({
    isShowed: false,
    applicationId: undefined,
  });
  const [notificationDates, setNotificationDates] = useState({
    start: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
    end: undefined as undefined | string,
  });
  const [selectedNotificationsState, setSelectedNotificationsState] =
    useState("все");

  const getNotifications = async () => {
    const data = await client.getAllNotificationsManager();
    setNotifications(data.notifications!);
  };

  useEffect(() => {
    getNotifications();
  }, []);

  const formattedNotification = notifications
    ?.filter((x) => {
      const content = JSON.parse(x.content!);

      const start = notificationDates.start
        ? content.date > notificationDates.start
        : true;

      const end = notificationDates.end
        ? content.date < notificationDates.end
        : true;

      const status =
        selectedNotificationsState === "все"
          ? true
          : selectedNotificationsState === "завершенные"
          ? !!content.result
          : !content.result;

      return start && end && status;
    })
    .sort((a, b) => {
      const dateA = new Date(JSON.parse(a.content!).date);
      const dateB = new Date(JSON.parse(b.content!).date);
      return (dateB as any) - (dateA as any);
    });

  if (!notifications) {
    return <></>;
  }

  return (
    <>
      <div className=" max-w-[1206px] w-full p-6 ">
        <div className="flex items-center w-full px-2 py-1 mb-1 space-x-2 bg-white border-2 border-pale rounded-xl">
          <div className="">Дата напоминания: c</div>
          <Input
            type={"datetime-local"}
            className="m-0 w-44"
            value={notificationDates.start}
            onChange={(e) =>
              setNotificationDates({
                ...notificationDates,
                start: e.target.value,
              })
            }
          />
          <div className="">по</div>
          <Input
            type={"datetime-local"}
            className="m-0 w-44"
            value={notificationDates.end}
            onChange={(e) =>
              setNotificationDates({
                ...notificationDates,
                end: e.target.value,
              })
            }
          />
          <div className="">и показать</div>
          <div className="w-44 ">
            <ArrayStringSelect
              onChange={(value) => setSelectedNotificationsState(value)}
              resultValue={selectedNotificationsState}
              list={["все", "завершенные", "не завершенные"]}
            />
          </div>
        </div>
        <div className="grid w-full grid-cols-3 gap-2 p-2 mx-auto bg-white border-2 border-pale rounded-xl">
          {formattedNotification!.map((x) => {
            const content = JSON.parse(x.content!);

            return (
              <div
                className={`w-full p-2 relative border-2 flex flex-col justify-between ${
                  content.result ? "border-green-600" : "border-red"
                } bg-lightgrey rounded-xl `}
                key={x.id}
              >
                <div className="absolute text-xs top-1 right-1">
                  Заявка №{x.application_id}
                </div>
                <div className="">
                  {[
                    {
                      title: "Менеджер",
                      content: x.manager?.user!.name,
                    },
                    {
                      title: "Телефон",
                      content: x.application!.user!.phone,
                    },
                    {
                      title: "Дата события",
                      content: format(
                        new Date(content.date),
                        "dd.MM.yyyy HH:mm"
                      ),
                    },
                    {
                      title: "Дата создания",
                      content: format(
                        new Date(x.created_at!),
                        "dd.MM.yyyy HH:mm"
                      ),
                    },
                    {
                      title: "Дата выполнения",
                      content:
                        content.result &&
                        format(new Date(x.updated_at!), "dd.MM.yyyy HH:mm"),
                    },
                    {
                      title: "Комментарий",
                      content: content.message,
                    },
                    {
                      title: "Результат",
                      content: content.result,
                    },
                  ].map((y) => (
                    <div className="" key={y.title}>
                      {y.content && (
                        <>
                          <div className="flex space-x-2">
                            <div className="">{y.title}:</div>
                            <div className="">{y.content}</div>
                          </div>
                          <Separator className="my-1" />
                        </>
                      )}
                    </div>
                  ))}
                </div>
                <Button
                  onClick={() =>
                    setShowDetails({
                      applicationId: x.application_id,
                      isShowed: true,
                    })
                  }
                >
                  Открыть заявку
                </Button>
              </div>
            );
          })}
          {showDetails.isShowed && (
            <BookingKanbanItem
              id={showDetails.applicationId!}
              close={() =>
                setShowDetails({
                  isShowed: false,
                  applicationId: undefined,
                })
              }
            />
          )}
        </div>
      </div>
    </>
  );
};

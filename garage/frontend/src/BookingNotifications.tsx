import { Notifications2 } from "./api-client";
import { useEffect, useState } from "react";
import { client } from "./backend";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";

export const BookingNotifications = () => {
  const [notifications, setNotifications] = useState<
    Notifications2[] | undefined
  >();

  const getNotifications = async () => {
    const data = await client.getAllNotificationsManager();
    setNotifications(data.notifications!);
  };

  useEffect(() => {
    getNotifications();
  }, []);

  if (!notifications) {
    return <></>;
  }

  return (
    <>
      <div className="flex items-center justify-center max-w-[1206px] w-full p-6 ">
        <div className="grid grid-cols-4 gap-2 p-2 mx-auto bg-white border-2 border-pale rounded-xl">
          {notifications!.map((x) => {
            const content = JSON.parse(x.content!);
            return (
              <div
                className="w-full p-2 border-2 border-pale bg-lightgrey rounded-xl "
                key={x.id}
              >
                {[
                  {
                    title: "Дата события",
                    content: format(new Date(content.date), "dd.MM.yyyy HH:mm"),
                  },
                  {
                    title: "Дата создания",
                    content: format(
                      new Date(x.created_at!),
                      "dd.MM.yyyy HH:mm"
                    ),
                  },
                  {
                    title: "Инфо",
                    content: content.message,
                  },
                  {
                    title: "Результат",
                    content: content.result,
                  },
                ].map((y) => (
                  <div className="flex space-x-2">
                    <div className="">{y.title}:</div>
                    <div className="">{y.content}</div>
                  </div>
                ))}
                <Button>Открыть заявку</Button>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

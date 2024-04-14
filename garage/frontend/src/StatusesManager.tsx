import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { UserType, Statuses, CarStatus, Body36 } from "./api-client";
import { userAtom } from "./atoms";
import { client } from "./backend";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

export const StatusesManager = () => {
  const [user] = useRecoilState(userAtom);
  const [statuses, setStatuses] = useState<Statuses[]>([]);

  useEffect(() => {
    if (user.user_type === UserType.Manager) {
      getStatuses();
    }
  }, []);

  const getStatuses = async () => {
    try {
      const data = await client.getParkStatusesManager();
      if (data.statuses) {
        setStatuses(data.statuses);
      }
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

  const changeStatusValue = async (value: CarStatus, id: number) => {
    try {
      await client.changeParkStatusManager(
        new Body36({ id: id, status_name: value })
      );
      setStatuses([
        ...statuses!.filter((x) => x.id !== id),
        new Statuses({
          ...statuses!.find((x) => x.id === id),
          status_name: value,
        }),
      ]);
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

  const getStatusesClient = async () => {
    try {
      await client.pushStatusesFromParkClientManager();
      getStatuses();
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

  const sortedStatuses = [...statuses!].sort((a, b) => {
    if (a.custom_status_name! > b.custom_status_name!) return 1;
    if (a.custom_status_name! < b.custom_status_name!) return -1;
    return 0;
  });

  return (
    <>
      <div className="flex flex-col justify-center h-full max-w-xl mx-auto mt-4">
        <Button
          className="my-4"
          variant={"manager"}
          onAsyncClick={getStatusesClient}
        >
          Загрузить статусы сервера
        </Button>
        {sortedStatuses?.map((x) => (
          <div>
            <div className="flex justify-between gap-2">
              <div className="">{x.custom_status_name}</div>
              <select
                name=""
                id=""
                onChange={(e) =>
                  changeStatusValue(e.target.value as CarStatus, x.id as number)
                }
              >
                {[
                  { status: "Скрыто", value: CarStatus.Hidden },
                  { status: "Бронь", value: CarStatus.Booked },
                  { status: "Аренда", value: CarStatus.Rented },
                  { status: "Доступно", value: CarStatus.AvailableForBooking },
                ].map((y) => (
                  <option selected={x.status_name === y.value} value={y.value}>
                    {y.status}
                  </option>
                ))}
              </select>
            </div>
            <Separator className="my-2" />
          </div>
        ))}
      </div>
    </>
  );
};

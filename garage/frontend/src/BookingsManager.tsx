import { useEffect, useState } from "react";
import { Body33, BookingStatus, Bookings } from "./api-client";
import { client } from "./backend";
import { useTimer } from "react-timer-hook";
import { getFormattedTimerValue } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import Confirmation from "@/components/ui/confirmation";

export const BookingsManager = () => {
  const [bookings, setBookings] = useState<Bookings[]>();
  const [selected, setSelected] = useState<Bookings>();

  const getBookings = async () => {
    const data = await client.getParkBookingsManager();
    setBookings(data.bookings!);
  };
  useEffect(() => {
    getBookings();
  }, []);

  const { days, minutes, hours, seconds, restart } = useTimer({
    expiryTimestamp: new Date(),
    autoStart: false,
    onExpire: () => {
      getBookings();
    },
  });

  useEffect(() => {
    if (selected) {
      restart(new Date(selected.end_date!));
    }
  }, [selected]);

  const changeBookingStatus = async (status: BookingStatus) => {
    await client.updateCarBookingStatusManager(
      new Body33({ status: status, vin: selected!.car!.vin })
    );
    getBookings();
  };

  if (!bookings) {
    return <></>;
  }

  return (
    <>
      <div className="flex justify-end h-full mt-4">
        <div className="flex justify-between w-full space-x-4 sm:mx-0 sm:w-full sm:space-x-8 sm:max-w-[800px] sm:justify-between lg:max-w-[1208px]">
          {bookings.length === 0 && <div className="">Бронирований нет</div>}
          {bookings.length > 0 && (
            <>
              <div className="w-1/3 p-4 space-y-2 bg-white rounded-xl">
                {bookings!.map((booking) => (
                  <div key={booking.id} className="">
                    <div
                      onClick={() => setSelected(booking)}
                      className={`${
                        selected?.id === booking.id ? "text-yellow" : ""
                      }`}
                    >
                      Бронирование №{booking.id}
                    </div>
                    <Separator />
                  </div>
                ))}
              </div>
              {!!selected && (
                <div className="w-2/3 p-4 space-y-2 bg-white rounded-xl">
                  <div className="flex space-x-2">
                    <div className="w-1/2">
                      <p>
                        Авто: {selected.car!.brand} {selected.car!.model}{" "}
                        {selected.car!.year_produced}
                      </p>
                      <p>Г/н: {selected.car!.license_plate}</p>
                      <p>VIN: {selected.car!.vin}</p>
                      <p>Город: {selected.car!.division!.city!.name}</p>
                      <p>Подразделение: {selected.car!.division!.name}</p>
                      <p>
                        Схема аренды: {selected.schema!.working_days}/
                        {selected.schema!.non_working_days}{" "}
                        {selected.schema!.daily_amount}
                      </p>
                      <p>
                        До конца бронирования осталось{" "}
                        <span>
                          {getFormattedTimerValue(
                            days,
                            hours,
                            minutes,
                            seconds
                          )}
                        </span>
                      </p>
                      <p>Телефон водителя: {selected.driver!.user!.phone}</p>
                    </div>
                    <div className="w-1/2 space-y-2">
                      <Confirmation
                        accept={() =>
                          changeBookingStatus(BookingStatus.UnBooked)
                        }
                        cancel={() => {}}
                        title={`Отменить бронирование №${selected.id}  ${
                          selected.car!.brand
                        } ${selected.car!.model}?`}
                        trigger={
                          <Button variant={"manager"}>Отмена брони</Button>
                        }
                        type="red"
                      />

                      {/* <Button variant={"manager"}>Продление брони</Button>
                      <Button variant={"manager"}>Смена авто</Button> */}
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};
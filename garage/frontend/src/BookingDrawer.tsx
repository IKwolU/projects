import { Body17, BookingStatus, Bookings, DayOfWeek, User } from "./api-client";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import { useRecoilState } from "recoil";
import { userAtom } from "./atoms";
import { Badge } from "@/components/ui/badge";
import { CSSTransition } from "react-transition-group";
import {
  CheckWorkingHours,
  formatRoubles,
  formatWorkingTime,
  getDayOfWeekDisplayName,
  getFuelTypeDisplayName,
  getTransmissionDisplayName,
} from "@/lib/utils";
import { useEffect, useRef, useState } from "react";
import { client } from "./backend";
import { Button } from "@/components/ui/button";
import Confirmation from "@/components/ui/confirmation";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faLocationDot } from "@fortawesome/free-solid-svg-icons";

export const BookingDrawer = () => {
  const [user, setUser] = useRecoilState(userAtom);
  const [isPhoneClicked, setIsPhoneClicked] = useState(false);
  const [userCoordinates, setUserCoordinates] = useState({
    latitude: null,
    longitude: null,
  });
  const nodeRef = useRef(null);
  const [isOpenedTimeOverBookings, setIsOpenedTimeOverBookings] =
    useState(false);
  const [isOpenedCancelBookings, setIsCancelBookings] = useState(false);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position: any) => {
        setUserCoordinates({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      });
    }
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!user) {
    return <></>;
  }
  const activeBooking = user!.bookings!.find(
    (x) => x.status === BookingStatus.Booked
  );
  let isWorkingHours = false;
  if (activeBooking) {
    isWorkingHours = CheckWorkingHours(
      activeBooking!.car!.division!.working_hours!
    );
  }

  const bookings = user!.bookings!;

  if (!bookings.length) {
    return <>У вас пока нет бронирований</>;
  }

  const divisionPhone = activeBooking?.car?.division!.phone;

  const cancelBooking = async () => {
    await client.cancelBooking(
      new Body17({
        id: activeBooking!.id,
      })
    );
    setUser(
      new User({
        ...user,
        bookings: [
          ...user.bookings!.filter((x) => x !== activeBooking),
          new Bookings({
            ...activeBooking,
            status: BookingStatus.UnBooked,
            end_date: new Date().toISOString(),
          }),
        ],
      })
    );
  };

  const sortedActiveBookings = [...bookings]
    .filter((x) =>
      [BookingStatus.RentStart, BookingStatus.Booked].includes(x!.status!)
    )
    .sort((a, b) => {
      if (a.end_date! > b.end_date!) return -1;
      if (a.end_date! < b.end_date!) return 1;
      return 0;
    });

  const sortedTimeOverBookings = [...bookings]
    .filter((x) => [BookingStatus.BookingTimeOver].includes(x!.status!))
    .sort((a, b) => {
      if (a.end_date! > b.end_date!) return -1;
      if (a.end_date! < b.end_date!) return 1;
      return 0;
    });

  const sortedCancelBookings = [...bookings]
    .filter((x) => [BookingStatus.UnBooked].includes(x!.status!))
    .sort((a, b) => {
      if (a.end_date! > b.end_date!) return -1;
      if (a.end_date! < b.end_date!) return 1;
      return 0;
    });

  return (
    <>
      {sortedActiveBookings.map((booking) => (
        <div
          className="overflow-y-auto h-[%] bg-white py-2 px-2 my-2 rounded-xl"
          key={`booking${booking.id}`}
        >
          {[
            { status: BookingStatus.Booked, text: "Текущая бронь" },
            { status: BookingStatus.RentStart, text: "Текущая аренда" },
          ].map(({ status, text }) => {
            return (
              booking.status === status && (
                <p key={status} className="mb-2 text-xl font-semibold">
                  {text}
                </p>
              )
            );
          })}

          <div className="flex space-x-3 md:space-x-5">
            <img
              className="object-cover w-1/3 h-auto rounded-xl"
              src={booking.car!.images![0]}
              alt=""
            />
            <div className=" md:space-y-1 md:w-full">
              <p className="text-base">{`${booking.car?.brand} ${booking.car?.model}`}</p>
              <Separator />
              <p className="text-base">{`Парк: ${booking.car?.division?.park?.park_name}`}</p>
              <Separator />
              <p className="text-base">
                Адрес:{" "}
                <a
                  href={
                    window.innerWidth < 800
                      ? `yandexnavi://map_search?text=${booking.car?.division?.address}`
                      : `https://yandex.ru/maps/?rtext=${userCoordinates.latitude},${userCoordinates.longitude}~${booking.car?.division?.address}`
                  }
                  className="text-base text-blue-400 underline active:text-yellow"
                  target="_blank"
                >
                  {`${booking.car?.division?.address}`}
                  {/* <FontAwesomeIcon
                    icon={faLocationDot}
                    className="px-1 cursor-pointer text-yellow"
                  /> */}
                </a>
              </p>
              <Separator />
              <p className="text-base">{`Тел.: ${booking.car?.division?.phone}`}</p>

              <div className="hidden md:block">
                {booking.status! !== BookingStatus.RentStart && (
                  <>
                    <Separator className="mt-1" />
                    <div className="flex items-center">
                      <p className="w-1/2 font-semibold md:font-normal md:text-base md:w-fit md:pr-2">
                        Дата окончания бронирования:
                      </p>
                      {format(booking.end_date!, "dd.MM.yyyy HH:mm")}
                    </div>
                  </>
                )}
              </div>

              <div className="min-h-fit md:min-w-[250px] lg:min-w-[350px] md:block hidden">
                {!isWorkingHours &&
                  Object.keys(DayOfWeek)
                    .filter(
                      (x) => x === DayOfWeek.Monday || x === DayOfWeek.Saturday
                    )
                    .map((x) => {
                      const { working_hours } = booking.car!.division!;
                      const currentDay = working_hours!.find(
                        ({ day }) => day === x
                      )!;
                      return (
                        <div className="flex flex-col items-start" key={x}>
                          <div className="text-base capitalize">
                            {x === DayOfWeek.Monday && "Понедельник-Пятница"}
                            {x === DayOfWeek.Saturday && "Суббота-Воскресенье"}
                          </div>
                          {currentDay && (
                            <>
                              {formatWorkingTime(
                                currentDay.start!.hours!,
                                currentDay.start!.minutes!
                              )}{" "}
                              -{" "}
                              {formatWorkingTime(
                                currentDay.end!.hours!,
                                currentDay.end!.minutes!
                              )}
                            </>
                          )}
                          {!currentDay && "Выходной"}
                        </div>
                      );
                    })}
                {isWorkingHours &&
                  Object.keys(DayOfWeek).map((x) => {
                    const { working_hours } = booking.car!.division!;
                    const currentDay = working_hours!.find(
                      ({ day }) => day === x
                    )!;
                    return (
                      <div className="flex items-center" key={x}>
                        <div className="text-sm capitalize w-28">
                          {getDayOfWeekDisplayName(x as any)}
                        </div>
                        {currentDay && (
                          <>
                            {formatWorkingTime(
                              currentDay.start!.hours!,
                              currentDay.start!.minutes!
                            )}{" "}
                            -{" "}
                            {formatWorkingTime(
                              currentDay.end!.hours!,
                              currentDay.end!.minutes!
                            )}
                          </>
                        )}
                        {!currentDay && <>Выходной</>}
                      </div>
                    );
                  })}
              </div>
              {booking.status === BookingStatus.Booked && (
                <div className="flex-wrap hidden w-1/2 md:flex">
                  {booking
                    .rent_term!.schemas!.slice(0, 3)
                    .map((currentSchema, i) => (
                      <Badge
                        key={`${currentSchema.working_days}/${currentSchema.non_working_days}${i}`}
                        className="flex-col items-start justify-start flex-grow w-1/2 h-full px-2 text-lg font-bold max-w-1/2 text-wrap"
                        variant="schema"
                      >
                        {`${formatRoubles(currentSchema.daily_amount!)}`}
                        <div className="text-xs font-medium text-black">{`${currentSchema.working_days} раб. /${currentSchema.non_working_days} вых.`}</div>
                      </Badge>
                    ))}
                </div>
              )}
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-start gap-1 my-3 md:items-start md:flex-nowrap">
            <div className="min-h-fit md:min-w-[250px] lg:min-w-[350px] md:hidden">
              {!isWorkingHours &&
                Object.keys(DayOfWeek)
                  .filter(
                    (x) => x === DayOfWeek.Monday || x === DayOfWeek.Saturday
                  )
                  .map((x) => {
                    const { working_hours } = booking.car!.division!;
                    const currentDay = working_hours!.find(
                      ({ day }) => day === x
                    )!;
                    return (
                      <div className="flex flex-col items-start" key={x}>
                        <div className="text-base capitalize">
                          {x === DayOfWeek.Monday && "Понедельник-Пятница"}
                          {x === DayOfWeek.Saturday && "Суббота-Воскресенье"}
                        </div>
                        {currentDay && (
                          <>
                            {formatWorkingTime(
                              currentDay.start!.hours!,
                              currentDay.start!.minutes!
                            )}{" "}
                            -{" "}
                            {formatWorkingTime(
                              currentDay.end!.hours!,
                              currentDay.end!.minutes!
                            )}
                          </>
                        )}
                        {!currentDay && "Выходной"}
                      </div>
                    );
                  })}
              {isWorkingHours &&
                Object.keys(DayOfWeek).map((x) => {
                  const { working_hours } = booking.car!.division!;
                  const currentDay = working_hours!.find(
                    ({ day }) => day === x
                  )!;
                  return (
                    <div className="flex items-center" key={x}>
                      <div className="text-sm capitalize w-28">
                        {getDayOfWeekDisplayName(x as any)}
                      </div>
                      {currentDay && (
                        <>
                          {formatWorkingTime(
                            currentDay.start!.hours!,
                            currentDay.start!.minutes!
                          )}{" "}
                          -{" "}
                          {formatWorkingTime(
                            currentDay.end!.hours!,
                            currentDay.end!.minutes!
                          )}
                        </>
                      )}
                      {!currentDay && <>Выходной</>}
                    </div>
                  );
                })}
            </div>
            <Separator className="mb-1 md:hidden" />
            <div className="flex flex-wrap items-center justify-start gap-1 md:items-start">
              <Badge variant="card" className="px-0 py-0 bg-grey ">
                <span className="flex items-center h-full px-2 bg-white rounded-xl">
                  Депозит{" "}
                  {formatRoubles(booking.rent_term!.deposit_amount_total!)}
                </span>
                <span className="flex items-center h-full px-2 ">
                  {formatRoubles(booking.rent_term!.deposit_amount_daily!)}
                  /день
                </span>
              </Badge>
              <Badge variant="card">
                Комиссия {booking.car!.division!.park!.commission}
              </Badge>
              <Badge variant="card">
                {getFuelTypeDisplayName(booking.car!.fuel_type)}
              </Badge>
              <Badge variant="card">
                {getTransmissionDisplayName(booking.car!.transmission_type)}
              </Badge>

              {booking.car!.division!.park!.self_employed && (
                <Badge variant="card">Для самозанятых</Badge>
              )}
              {!!booking.rent_term!.is_buyout_possible && (
                <Badge variant="card">Выкуп автомобиля</Badge>
              )}
            </div>
          </div>
          <div className="flex flex-wrap gap-1 pb-2 mt-1 mb-1 md:hidden">
            {booking.rent_term!.schemas!.slice(0, 3).map((currentSchema, i) => (
              <Badge
                key={`${currentSchema.working_days}/${currentSchema.non_working_days}${i}`}
                className="flex-col items-start justify-start flex-grow h-full px-2 text-lg font-bold text-wrap max-w-[352px]"
                variant="schema"
              >
                {`${formatRoubles(currentSchema.daily_amount!)}`}
                <div className="text-xs font-medium text-black">{`${currentSchema.working_days} раб. /${currentSchema.non_working_days} вых.`}</div>
              </Badge>
            ))}
          </div>
          <div className={"md:hidden"}>
            {booking.status !== BookingStatus.RentStart && (
              <>
                <Separator className="mt-1" />
                <div className="flex items-center">
                  <p className="w-1/2 font-semibold md:font-normal md:text-base md:w-fit md:pr-2">
                    Дата окончания бронирования:
                  </p>
                  {format(booking.end_date!, "dd.MM.yyyy HH:mm")}
                </div>
              </>
            )}
          </div>
          {booking.status === BookingStatus.Booked && (
            <div className="flex w-full mb-2 space-x-1 max-w-[600px] mt-3  mx-auto">
              <div className="w-1/2">
                <Confirmation
                  title="Отмена бронирования. Хотите продолжить?"
                  type="red"
                  accept={cancelBooking}
                  cancel={() => {}}
                  trigger={
                    <Button
                      variant="reject"
                      className="text-black bg-white border-2 border-grey"
                    >
                      Отменить
                    </Button>
                  }
                />
              </div>
              <Button
                className="w-1/2 font-normal"
                onClick={() => {
                  setIsPhoneClicked(true);
                }}
              >
                {isPhoneClicked ? (
                  <div
                    onClick={() =>
                      (window.location.href = `tel:${divisionPhone}`)
                    }
                  >
                    {divisionPhone}
                  </div>
                ) : (
                  <span>Позвонить в парк</span>
                )}
              </Button>
            </div>
          )}
        </div>
      ))}

      {sortedTimeOverBookings.length > 0 && (
        <CSSTransition
          nodeRef={nodeRef}
          timeout={500}
          classNames="height"
          unmountOnExit
          in={isOpenedTimeOverBookings}
        >
          <div
            className="px-2 py-2 my-2 overflow-y-auto bg-white rounded-xl"
            ref={nodeRef}
          >
            <div
              className="mb-2 text-xl font-semibold"
              onClick={() =>
                setIsOpenedTimeOverBookings(!isOpenedTimeOverBookings)
              }
            >
              Истекшая бронь: {sortedTimeOverBookings.length}
            </div>
            {isOpenedTimeOverBookings && (
              <div className="">
                {sortedTimeOverBookings.map((booking) => (
                  <div className="" key={`booking${booking.id}`}>
                    <div className="flex space-x-3 md:space-x-5">
                      <img
                        className="object-cover w-1/3 h-auto rounded-xl"
                        src={booking.car!.images![0]}
                        alt=""
                      />
                      <div className=" md:space-y-1 md:w-full">
                        <p className="text-base">{`${booking.car?.brand} ${booking.car?.model}`}</p>
                        <Separator />
                        <p className="text-base">{`Парк: ${booking.car?.division?.park?.park_name}`}</p>
                        <Separator />
                        <p className="text-base">
                          Адрес:{" "}
                          <a
                            href={
                              window.innerWidth < 800
                                ? `yandexnavi://map_search?text=${booking.car?.division?.address}`
                                : `https://yandex.ru/maps/?rtext=${userCoordinates.latitude},${userCoordinates.longitude}~${booking.car?.division?.address}`
                            }
                            className="text-base text-blue-400 underline active:text-yellow"
                            target="_blank"
                          >
                            {`${booking.car?.division?.address}`}
                            {/* <FontAwesomeIcon
                    icon={faLocationDot}
                    className="px-1 cursor-pointer text-yellow"
                  /> */}
                          </a>
                        </p>
                        <Separator />
                        <p className="text-base">{`Тел.: ${booking.car?.division?.phone}`}</p>
                      </div>
                    </div>
                    <Separator className="my-2" />
                  </div>
                ))}
              </div>
            )}
          </div>
        </CSSTransition>
      )}

      {sortedCancelBookings.length > 0 && (
        <div className="overflow-y-auto h-[%] bg-white py-2 px-2 my-2 rounded-xl">
          <div
            className="mb-2 text-xl font-semibold"
            onClick={() => setIsCancelBookings(!isOpenedCancelBookings)}
          >
            Отмененная бронь: {sortedCancelBookings.length}
          </div>
          {isOpenedCancelBookings && (
            <div className="">
              {sortedCancelBookings.map((booking) => (
                <div className="mb-2" key={`booking${booking.id}`}>
                  <div className="flex space-x-3 md:space-x-5">
                    <img
                      className="object-cover w-1/3 h-auto rounded-xl"
                      src={booking.car!.images![0]}
                      alt=""
                    />
                    <div className=" md:space-y-1 md:w-full">
                      <p className="text-base">{`${booking.car?.brand} ${booking.car?.model}`}</p>
                      <Separator />
                      <p className="text-base">{`Парк: ${booking.car?.division?.park?.park_name}`}</p>
                      <Separator />
                      <p className="text-base">
                        Адрес:{" "}
                        <a
                          href={
                            window.innerWidth < 800
                              ? `yandexnavi://map_search?text=${booking.car?.division?.address}`
                              : `https://yandex.ru/maps/?rtext=${userCoordinates.latitude},${userCoordinates.longitude}~${booking.car?.division?.address}`
                          }
                          className="text-base text-blue-400 underline active:text-yellow"
                          target="_blank"
                        >
                          {`${booking.car?.division?.address}`}
                        </a>
                      </p>
                      <Separator />
                      <p className="text-base">{`Тел.: ${booking.car?.division?.phone}`}</p>
                    </div>
                  </div>
                  <Separator className="my-2" />
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
};

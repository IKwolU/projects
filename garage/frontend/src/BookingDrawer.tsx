import {
  Body17,
  BookingStatus,
  Bookings2,
  DayOfWeek,
  User,
} from "./api-client";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import { useRecoilState } from "recoil";
import { userAtom } from "./atoms";
import { Badge } from "@/components/ui/badge";
import { CSSTransition } from "react-transition-group";
import {
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
import ym from "react-yandex-metrika";
import { toLower } from "ramda";

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
  const activeBooking = user!.bookings?.find(
    (x) => x.status === BookingStatus.Booked
  );

  const bookings = user!.bookings!;

  if (!bookings?.length) {
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
          new Bookings2({
            ...activeBooking,
            status: BookingStatus.UnBooked,
            end_date: new Date().toISOString(),
          }),
        ],
      })
    );
    ym("reachGoal", "tobook_tc_cancel", 96683881);
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

  const nonWorkingDays: string[] = [];

  const navigationLink = (address: string) => {
    const link =
      window.innerWidth < 800
        ? `yandexnavi://map_search?text=${address}`
        : `https://yandex.ru/maps/?rtext=${userCoordinates.latitude},${userCoordinates.longitude}~${address}`;
    return link;
  };

  return (
    <>
      {sortedActiveBookings.map((booking) => (
        <>
          <div
            className="overflow-y-auto h-[%] bg-white py-2 px-2 my-2 rounded-xl lg:hidden"
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
                <p className="text-base">{`${booking.car?.brand} ${booking.car?.model} ${booking.car?.year_produced}`}</p>
                <Separator />
                <p className="text-base">{`Парк: ${booking.car?.division?.park?.park_name}`}</p>
                <Separator />
                <p className="text-base">
                  Адрес:{" "}
                  <a
                    href={navigationLink(booking.car!.division!.address!)}
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
                {/* <Separator />
                <p className="text-base">{`Тел.: ${booking.car?.division?.phone}`}</p> */}

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
                  {Object.values(DayOfWeek).map((day) => {
                    const dayOfWeek = getDayOfWeekDisplayName(day);
                    const workingHoursTime =
                      booking.car!.division!.working_hours!.filter(
                        (x) => x.day === day
                      );

                    if (!workingHoursTime.length) {
                      nonWorkingDays.push(dayOfWeek);
                    }
                    return (
                      <div key={day} className="max-w-48">
                        {!!workingHoursTime.length && (
                          <div className="flex w-full">
                            <div className="w-20 text-base font-semibold">
                              {dayOfWeek}
                            </div>
                            <div className="">
                              {formatWorkingTime(
                                workingHoursTime[0]!.start!.hours!,
                                workingHoursTime[0]!.start!.minutes!
                              )}{" "}
                              -{" "}
                              {formatWorkingTime(
                                workingHoursTime[0]!.end!.hours!,
                                workingHoursTime[0]!.end!.minutes!
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                  {!!nonWorkingDays.length && (
                    <div className="flex max-w-44">
                      <div className="flex w-20 space-x-2">
                        {nonWorkingDays.map((y, i) => (
                          <div className="text-base text-pale" key={y}>
                            {i === 0 ? y : toLower(y)}
                            {i !== nonWorkingDays.length - 1 && ", "}
                          </div>
                        ))}
                      </div>
                      <div className="text-pale">Выходной</div>
                    </div>
                  )}
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
                {Object.values(DayOfWeek).map((day) => {
                  const dayOfWeek = getDayOfWeekDisplayName(day);
                  const workingHoursTime =
                    booking.car!.division!.working_hours!.filter(
                      (x) => x.day === day
                    );
                  return (
                    <div key={day} className="max-w-48">
                      {!!workingHoursTime.length && (
                        <div className="flex w-full">
                          <div className="w-20 text-base font-semibold">
                            {dayOfWeek}
                          </div>
                          <div className="">
                            {formatWorkingTime(
                              workingHoursTime[0]!.start!.hours!,
                              workingHoursTime[0]!.start!.minutes!
                            )}{" "}
                            -{" "}
                            {formatWorkingTime(
                              workingHoursTime[0]!.end!.hours!,
                              workingHoursTime[0]!.end!.minutes!
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
                {!!nonWorkingDays.length && (
                  <div className="flex max-w-44">
                    <div className="flex w-20 space-x-2">
                      {nonWorkingDays.map((y, i) => (
                        <div className="text-base text-pale" key={y}>
                          {i === 0 ? y : toLower(y)}
                          {i !== nonWorkingDays.length - 1 && ", "}
                        </div>
                      ))}
                    </div>
                    <div className="text-pale">Выходной</div>
                  </div>
                )}
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
              {booking
                .rent_term!.schemas!.slice(0, 3)
                .map((currentSchema, i) => (
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
          <div className="hidden space-x-6 lg:flex">
            <div className="w-1/2 p-4 bg-white rounded-xl">
              {[
                { status: BookingStatus.Booked, text: "Текущая бронь" },
                { status: BookingStatus.RentStart, text: "Текущая аренда" },
              ].map(({ status, text }) => {
                return (
                  booking.status === status && (
                    <h3 key={status} className="mb-2 text-xl text-center">
                      {text}
                    </h3>
                  )
                );
              })}
              <div className="h-[364px] flex items-center justify-center">
                <img
                  className="object-contain h-auto rounded-xl"
                  src={booking.car!.images![0]}
                  alt=""
                />
              </div>

              <div className="flex flex-col items-center justify-between pt-4">
                <div className="pl-1 my-2 text-lg text-center md:text-xl md:mb-0">
                  <h1>
                    {`${booking.car!.brand} ${booking.car!.model}`}{" "}
                    {booking.car!.year_produced}
                  </h1>
                </div>

                <div className="w-1/2 mx-auto">
                  {booking.status === BookingStatus.Booked && (
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
                  )}
                </div>
              </div>
            </div>
            <div className="w-1/2 space-y-2">
              <div className="px-4 py-2 pb-4 bg-white rounded-xl">
                <h4 className="mt-3 font-semibold">Детали бронирования</h4>
                {booking.status === BookingStatus.RentStart && (
                  <div className="items-center ">
                    <p className="pt-1 leading-4">
                      {format(booking.end_date!, "dd.MM.yyyy HH:mm")}
                    </p>
                    <p className="pr-2 text-sm w-fit text-pale">
                      Дата окончания бронирования
                    </p>
                  </div>
                )}
                {[
                  {
                    text: "Парк",
                    content: booking.car!.division!.park!.park_name,
                    type: "park",
                  },
                  {
                    text: "Адрес",
                    content: "",
                    type: "address",
                  },
                  // { text: "Телефон", content: divisionPhone, type: "phone" },
                  {
                    text: "Депозит",
                    content: formatRoubles(
                      booking.rent_term!.deposit_amount_total!
                    ),
                    type: "deposit",
                  },
                  {
                    text: "Сумма бронирования",
                    content: formatRoubles(
                      booking.rent_term!.schemas![0]!.daily_amount!
                    ),
                    type: "price",
                  },
                  {
                    text: "Дата окончания бронирования",
                    content: format(booking.end_date!, "dd.MM.yyyy HH:mm"),
                    type: "time",
                  },
                ].map((x) => (
                  <div key={x.type}>
                    {!(
                      booking.status === BookingStatus.RentStart &&
                      x.type === "time"
                    ) && (
                      <>
                        <Separator className="my-[18px]" />
                        <div className="flex justify-between">
                          <p>{x.text}</p>
                          {x.type !== "address" && <p>{x.content}</p>}
                          {x.type === "address" && (
                            <a
                              href={navigationLink(
                                booking.car!.division!.address!
                              )}
                              className="text-base text-blue-400 underline active:text-yellow"
                              target="_blank"
                            >
                              {booking.car!.division!.address}
                            </a>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
              <div className="px-4 py-2 pb-6 space-y-6 bg-white rounded-xl">
                <h4 className="font-semibold">
                  Благодарим за бронирование автомобиля!
                </h4>
                <p>
                  Нажмите здесь, чтобы узнать маршрут до пункта проката, или
                  нажмите на кнопку для звонка, если хотите связаться с нами.
                </p>
                <div className="flex items-center justify-between space-x-2">
                  <Button variant="reject" className="w-1/2 font-normal">
                    <a
                      href={navigationLink(booking.car!.division!.address!)}
                      className="w-full text-base text-black"
                      target="_blank"
                    >
                      Узнать маршрут
                    </a>
                  </Button>

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
              </div>
            </div>
          </div>
        </>
      ))}

      {sortedTimeOverBookings.length > 0 && (
        <CSSTransition
          nodeRef={nodeRef}
          timeout={300}
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
                        className="object-cover w-1/3 h-24 sm:h-44 rounded-xl"
                        src={booking.car!.images![0]}
                        alt=""
                      />
                      <div className=" md:space-y-1 md:w-full">
                        <p className="text-base">{`${booking.car?.brand} ${booking.car?.model} ${booking.car?.year_produced}`}</p>
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
                        {/* <Separator />
                        <p className="text-base">{`Тел.: ${booking.car?.division?.phone}`}</p> */}
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
            className="mb-2 text-xl font-semibold cursor-pointer"
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
                      className="object-cover w-1/3 h-24 sm:h-44 rounded-xl"
                      src={booking.car!.images![0]}
                      alt=""
                    />
                    <div className=" md:space-y-1 md:w-full">
                      <p className="text-base">{`${booking.car?.brand} ${booking.car?.model} ${booking.car?.year_produced}`}</p>
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
                      {/* <Separator />
                      <p className="text-base">{`Тел.: ${booking.car?.division?.phone}`}</p> */}
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

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Body16,
  Body17,
  BookingStatus,
  User,
  Schema,
  Cars3,
  Bookings2,
  DayOfWeek,
} from "./api-client";
import { Separator } from "@/components/ui/separator";
import {
  formatRoubles,
  formatWorkingTime,
  getDayOfWeekDisplayName,
  getFuelTypeDisplayName,
  getTransmissionDisplayName,
} from "@/lib/utils";
import { userAtom } from "./atoms";
import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { client } from "./backend";
import Confirmation from "@/components/ui/confirmation";
import SliderImages from "@/components/ui/slider-images";
import { useEffect, useState } from "react";
import BookingAlert from "./booking-alert";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock, faCompass } from "@fortawesome/free-regular-svg-icons";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import ym from "react-yandex-metrika";
import { toLower } from "ramda";

export const CarDetails = ({ car }: { car: Cars3 }) => {
  const [user, setUser] = useRecoilState(userAtom);
  const [isBooked, setIsBooked] = useState(false);
  const [userCoordinates, setUserCoordinates] = useState({
    latitude: null,
    longitude: null,
  });

  const [selectedSchema, setSelectedSchema] = useState(
    car.rent_term!.schemas![0]!.id
  );
  const navigate = useNavigate();

  const activeBooking = user?.bookings?.find(
    (x) => x.status === BookingStatus.Booked
  );

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

  // временно удаляем проверку на верификацию!!!
  const book = async (variant_id: number | null = null) => {
    if (!user) {
      sessionStorage.setItem("car_brand", car.brand!);
      sessionStorage.setItem("car_model", car.model!);
      sessionStorage.setItem("car_park", car.park_name!);
      return navigate("login/driver", {
        state: {
          bookingAttempt: true,
        },
      });
    }

    if (activeBooking) {
      await client.cancelBooking(
        new Body17({
          id: activeBooking!.id,
        })
      );
    }
    // if (user.user_status === UserStatus.Verified) {
    const bookingData = await client.book(
      new Body16({
        id: variant_id ? variant_id : car.id,
        schema_id: selectedSchema,
      })
    );

    const potentialExistingBooking = activeBooking
      ? [
          new Bookings2({
            ...activeBooking,
            status: BookingStatus.UnBooked,
            end_date: new Date().toISOString(),
          }),
        ]
      : [];

    setUser(
      new User({
        ...user,
        bookings: [
          ...user.bookings!.filter((x) => x !== activeBooking),
          ...potentialExistingBooking,
          new Bookings2(bookingData.booking),
        ],
      })
    );
    ym("reachGoal", "tobook_tc", 96683881);
    setIsBooked(true);
    // } else {
    //   navigate("account");
    // }
  };
  const { schemas } = car.rent_term!;

  const navigationLink = (address: string) => {
    const link =
      window.innerWidth < 800
        ? `yandexnavi://map_search?text=${address}`
        : `https://yandex.ru/maps/?rtext=${userCoordinates.latitude},${userCoordinates.longitude}~${address}`;
    return link;
  };

  const handleTariffChange = (value: string) => {
    setSelectedSchema(Number(value));
    ym("reachGoal", "select_tarif", 96683881);
  };

  const nonWorkingDays: string[] = [];

  return (
    <>
      {isBooked && <BookingAlert />}
      <div className="py-6 ">
        <div className="mb-10">
          <div className="justify-between  flex max-w-[1208px] inset-0 mx-auto 2xl:pl-0  xl lg:space-x-8 flex-col lg:flex-row relative space-y-4 lg:space-y-0">
            <div
              className={`${
                car.images!.length > 1
                  ? "mt-72 sm:mt-[460px]"
                  : "mt-60 sm:mt-[340px]"
              } space-y-2  lg:mt-0 lg:w-1/3 sm:mt-[460px]`}
            >
              <div className="px-4 py-6 bg-white shadow-xl rounded-xl">
                <h3 className="hidden text-center lg:block">
                  {car.brand} {car.model} {car.year_produced}
                </h3>
                {[
                  {
                    text: "Марка",
                    content: car.brand,
                  },
                  {
                    text: "Модель",
                    content: car.model,
                  },
                  { text: "Пробег", content: `${car.mileage} км` },
                  {
                    text: "Год",
                    content: car.year_produced,
                  },
                  {
                    text: "Депозит всего",
                    content: Number(car.rent_term!.deposit_amount_total!)
                      ? formatRoubles(car.rent_term!.deposit_amount_total!)
                      : "нет",
                  },
                  {
                    text: "Депозит в день",
                    content: Number(car.rent_term!.deposit_amount_daily!)
                      ? formatRoubles(car.rent_term!.deposit_amount_daily!)
                      : "нет",
                  },
                  {
                    text: "Комиссия парка",
                    content: `${car.commission} %`,
                  },
                  {
                    text: "Коробка передач",
                    content: getTransmissionDisplayName(car.transmission_type),
                  },
                  {
                    text: "Тип топлива",
                    content: getFuelTypeDisplayName(car.fuel_type),
                  },
                ].map((x, i) => (
                  <div key={i}>
                    {!!i && <Separator className="my-3" />}
                    <div className="flex lg:justify-between">
                      <p className="w-4/5 text-base">{x.text}</p>
                      <p>{x.content}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="fixed bottom-0 left-0 w-full px-2 bg-white shadow-xl lg:py-4 lg:rounded-xl lg:relative">
                <h3 className="hidden lg:block">
                  Выберите стоимость и схему дней
                </h3>
                <div className="">
                  <div className="flex flex-wrap gap-1 lg:pb-1">
                    <div className="inset-x-0 flex justify-center w-full px-0 py-2 mx-auto space-x-2 bg-white lg:space-y-2 lg:flex-col lg:space-x-0">
                      <Select
                        onValueChange={(value) => handleTariffChange(value)}
                        defaultValue={`${schemas![0].id}`}
                      >
                        <SelectTrigger className="w-1/2 h-auto pt-0 pb-1 text-xl text-left border-none lg:w-full lg:pt-1 lg:pl-3 bg-grey rounded-xl">
                          <SelectValue placeholder="Схема аренды" />
                        </SelectTrigger>
                        <SelectContent className="w-full h-auto p-1 pb-0 text-left border-none bg-grey rounded-xl">
                          {schemas!.map((currentSchema: Schema, i: number) => (
                            <SelectItem
                              className="mb-1 border rounded-xl border-zinc-300 "
                              key={`${currentSchema.working_days}/${currentSchema.non_working_days}${i}`}
                              value={`${currentSchema.id}`}
                            >
                              {`${formatRoubles(currentSchema.daily_amount!)}`}
                              <div className="text-xs font-medium text-black ">{`${currentSchema.working_days} раб. / ${currentSchema.non_working_days} вых.`}</div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      {!activeBooking && (
                        <div className="relative w-1/2 lg:w-full">
                          <Confirmation
                            title={`Забронировать ${car.brand} ${car.model}?`}
                            type="green"
                            accept={book}
                            cancel={() => {}}
                            trigger={
                              <Button className="">Забронировать</Button>
                            }
                          />
                        </div>
                      )}
                      {!!activeBooking && (
                        <div className="relative w-1/2 lg:w-full">
                          <Confirmation
                            title={`У вас есть активная бронь:
                        ${activeBooking.car?.brand}
                        ${activeBooking.car?.model}`}
                            text={`Отменить и забронировать ${car.brand} ${car.model}`}
                            type="green"
                            accept={book}
                            cancel={() => {}}
                            trigger={
                              <Button className="">Забронировать</Button>
                            }
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              className={` ${
                car.images!.length > 1 ? "lg:space-y-32 pb-20" : "lg:space-y-2"
              } lg:w-2/3 `}
            >
              <div className="absolute top-0 z-10 w-full shadow-xl lg:relative h-92">
                <SliderImages
                  type="click"
                  openIsAffordable={true}
                  images={car.images!}
                  classImages="h-92"
                  classPaginationImages=""
                />
              </div>
              <div className="px-2 py-4 bg-white shadow-xl rounded-xl">
                <div className="flex flex-col">
                  <div className="flex flex-col justify-between lg:items-center lg:flex-row">
                    <div className="mb-2 text-lg font-semibold ">
                      {" "}
                      Парк {car.park_name}
                    </div>
                    {car.cars_count! > 1 && (
                      <Separator className="mb-2 lg:hidden" />
                    )}
                    {car.cars_count! > 1 && (
                      <div className="flex justify-end lg:p-2 lg:border-2 lg:border-grey w-fit rounded-xl">
                        {`Доступно авто: ${car.cars_count}`}
                      </div>
                    )}
                  </div>
                  <Separator className="my-2" />
                  <div className="grid grid-cols-1 lg:grid-cols-2">
                    <div className="font-semibold">
                      <FontAwesomeIcon
                        icon={faCompass}
                        className="mr-2 text-zinc-400"
                      />
                      Адрес
                      <a
                        href={navigationLink(car.division!.address!)}
                        className="flex items-center gap-2 mb-2 space-x-2 text-base underline lg:mb-0 lg:mt-2 lg:text-zinc-400 active:text-yellow"
                        target="_blank"
                      >
                        {car.division!.address!}
                      </a>
                    </div>
                    {/* <Separator className="mt-4 mb-2" /> */}
                    <div className="mb-2 text-base">
                      <div className="mb-2 text-base font-semibold">
                        <FontAwesomeIcon
                          icon={faClock}
                          className="mr-2 text-zinc-400"
                        />
                        График работы:{" "}
                      </div>
                      {Object.values(DayOfWeek).map((day) => {
                        const dayOfWeek = getDayOfWeekDisplayName(day);
                        const workingHoursTime = car.working_hours!.filter(
                          (x) => x.day === day
                        );
                        return (
                          <div key={day} className="max-w-48">
                            {!!workingHoursTime.length && (
                              <div className="flex w-full">
                                <div className="w-20 text-sm font-semibold lg:text-base">
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
                              <div
                                className="text-sm lg:text-base text-pale"
                                key={y}
                              >
                                {i === 0 ? y : toLower(y)}
                                {i !== nonWorkingDays.length - 1 && ", "}
                              </div>
                            ))}
                          </div>
                          <div className="text-sm text-pale lg:text-base">
                            Выходной
                          </div>
                        </div>
                      )}
                      {/* <Separator className="my-2" />
                            <div className="">
                              <p className="mb-2 text-base">Телефон:</p>
                              <p>{car.division!.phone}</p>
                            </div> */}
                    </div>
                  </div>
                  <Separator className="my-2" />
                  <Collapsible>
                    <CollapsibleTrigger className="flex justify-between w-full mb-2 focus:outline-none md:text-lg">
                      <div className="text-base"> О парке</div>
                      <FontAwesomeIcon icon={faChevronDown} />
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <div className="mb-2 text-sm text-gray-700 whitespace-pre-line md:text-base">
                        {car.about}
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

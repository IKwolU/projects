import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  Bookings,
  User,
  Variants,
  Schema,
  Cars3,
} from "./api-client";
import { Separator } from "@/components/ui/separator";
import {
  formatRoubles,
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

export const CarDetails = ({ car }: { car: Cars3 }) => {
  const [user, setUser] = useRecoilState(userAtom);
  const [isBooked, setIsBooked] = useState(false);
  const [userCoordinates, setUserCoordinates] = useState({
    latitude: null,
    longitude: null,
  });
  const [showVariants, setShowVariants] = useState(false);

  const [selectedSchema, setSelectedSchema] = useState(
    car.rent_term!.schemas![0]!.id
  );
  const navigate = useNavigate();

  const activeBooking = user?.bookings!.find(
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
          new Bookings({
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
          new Bookings(bookingData.booking),
        ],
      })
    );
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

  return (
    <>
      {isBooked && <BookingAlert />}
      <div className="pb-10 lg:hidden">
        {car.variants!.map((x: Variants, i: number) => (
          <div key={i} className="mb-2">
            <div
              className={`flex flex-col justify-center p-2  overflow-y-auto bg-white rounded-xl ${
                car.variants!.length === 1 && "pb-16"
              }`}
            >
              <SliderImages
                type="click"
                openIsAffordable={true}
                images={x.images!}
                classImages="md:h-92"
                classPaginationImages=""
              />

              <div className="space-y-2">
                <h1 className="my-4 text-center ">{`${car.brand} ${car.model} ${car.year_produced}`}</h1>
                <p className="flex justify-center pr-4 space-x-6 text-base md:text-lg font-regular text-gray">
                  {/* <span>VIN: {x.vin?.slice(-4)}</span> */}
                  <span>Пробег: {car.mileage} км</span>
                </p>
                <div className="flex flex-col md:flex-row md:flex-wrap">
                  <div className="md:w-1/2 md:space-y-2 ">
                    <Separator className="my-1" />
                    <p className="flex justify-between pr-4 text-base md:text-lg font-regular text-gray">
                      <span>Парк: {car.park_name}</span>
                    </p>
                    <Separator className="my-1" />
                    <p className="text-base md:text-lg font-regular text-gray">
                      Адрес: {car.division?.address}
                    </p>
                    <Separator className="my-1" />
                    <p className="text-base md:text-lg font-regular text-gray">
                      Телефон: {car.division?.phone}
                    </p>
                    <Separator className="my-1" />
                  </div>
                  <div className="min-h-fit md:w-1/2 md:pl-8">
                    {car.working_hours!.map((x, i) => {
                      return (
                        <div
                          className="flex flex-col items-start md:text-lg"
                          key={`hours_${i}`}
                        >
                          <div className="text-base capitalize md:text-lg">
                            {x}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <Collapsible>
                  <CollapsibleTrigger className="mb-2 focus:outline-none md:text-lg">
                    О парке ▼
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="mb-2 text-sm text-gray-700 md:text-base">
                      {car.about}
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              </div>
              <Separator />
              <div className="flex flex-wrap gap-2 mt-2 mb-2 md:mb-4">
                <div>
                  <Badge variant="card" className="px-0 py-0 bg-grey ">
                    <span className="flex items-center h-full px-2 bg-white rounded-xl md:text-lg">
                      Депозит{" "}
                      {formatRoubles(car.rent_term!.deposit_amount_total!)}
                    </span>
                    <span className="flex items-center h-full px-2 md:text-lg">
                      {formatRoubles(car.rent_term!.deposit_amount_daily!)}
                      /день
                    </span>
                  </Badge>
                </div>
                <div className="">
                  <Badge variant="card" className="md:text-lg">
                    Комиссия {car.commission} %
                  </Badge>{" "}
                </div>

                <div className="">
                  {" "}
                  <Badge variant="card" className="md:text-lg">
                    {getTransmissionDisplayName(car.transmission_type)}
                  </Badge>{" "}
                </div>
                <div className="">
                  <Badge variant="card" className=" md:text-lg">
                    {getFuelTypeDisplayName(car.fuel_type)}
                  </Badge>
                </div>
                <div className="">
                  {!!car.rent_term?.is_buyout_possible && (
                    <Badge variant="card" className="md:text-lg">
                      Выкуп автомобиля
                    </Badge>
                  )}
                </div>
              </div>
              <div className="flex flex-wrap gap-1 pb-1">
                {schemas!
                  .slice(0, 3)
                  .map((currentSchema: Schema, i: number) => (
                    <Badge
                      key={`${currentSchema.working_days}/${currentSchema.non_working_days}${i}`}
                      className="flex-col items-start justify-start flex-grow h-full px-2 text-lg font-semibold md:text-lg text-wrap"
                      variant="schema"
                    >
                      {`${formatRoubles(currentSchema.daily_amount!)}`}
                      <div className="text-xs font-medium text-black md:text-lg">{`${currentSchema.working_days} раб. / ${currentSchema.non_working_days} вых.`}</div>
                    </Badge>
                  ))}
              </div>
              <div
                className={
                  car.variants!.length === 1
                    ? `fixed bottom-14 left-0 flex justify-center w-full px-4 space-x-2 z-[52]`
                    : ""
                }
              >
                <div className="flex justify-center h-16 w-full max-w-[800px] px-0 py-2 space-x-2 bg-white  inset-x-0 mx-auto sm:px-40">
                  <Select
                    onValueChange={(value) => setSelectedSchema(Number(value))}
                    defaultValue={`${schemas![0].id}`}
                  >
                    <SelectTrigger className="w-1/2 h-auto pb-1 pl-3 text-left border-none bg-grey rounded-xl md:px-5 ">
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
                    <div className="w-1/2 sm:max-w-[250px] relative">
                      <Confirmation
                        title={`Забронировать ${car.brand} ${car.model}?`}
                        type="green"
                        accept={book}
                        cancel={() => {}}
                        trigger={<Button className="">Забронировать</Button>}
                      />
                    </div>
                  )}
                  {!!activeBooking && (
                    <div className="w-1/2 sm:max-w-[250px] relative">
                      <Confirmation
                        title={`У вас есть активная бронь: 
                        ${activeBooking.car?.brand}
                        ${activeBooking.car?.model}`}
                        text={`Отменить и забронировать ${car.brand} ${car.model}
                   `}
                        type="green"
                        accept={book}
                        cancel={() => {}}
                        trigger={<Button className="">Забронировать</Button>}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="py-6">
        {car.variants!.map((variant, index) => (
          <div key={index} className="mb-10">
            {(!index || showVariants) && (
              <div className="justify-between hidden lg:flex max-w-[1104px] inset-0 mx-auto 2xl:pl-0 pl-44 xl space-x-8 ">
                <div className="w-1/3 space-y-2">
                  <div className="px-4 py-6 bg-white shadow-xl rounded-xl">
                    <h3 className="text-center">
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
                      { text: "Пробег", content: `${variant.mileage} км` },
                      {
                        text: "Год",
                        content: car.year_produced,
                      },
                      {
                        text: "Комиссия парка",
                        content: `${car.commission} %`,
                      },
                      {
                        text: "Коробка передач",
                        content: getTransmissionDisplayName(
                          car.transmission_type
                        ),
                      },
                      {
                        text: "Тип топлива",
                        content: getFuelTypeDisplayName(car.fuel_type),
                      },
                      {
                        text: "Название парка",
                        content: car.park_name,
                      },
                    ].map((x, i) => (
                      <div key={i}>
                        {!!i && <Separator className="my-3" />}
                        <div className="flex justify-between">
                          <p className="text-base">{x.text}</p>
                          <p>{x.content}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="px-2 py-4 bg-white shadow-xl rounded-xl">
                    <h3>Выберите стоимость и схему дней</h3>
                    <div className="">
                      <div className="flex flex-wrap gap-1 pb-1">
                        <div className="inset-x-0 flex flex-col justify-center w-full px-0 py-2 mx-auto space-y-2 bg-white">
                          <Select
                            onValueChange={(value) =>
                              setSelectedSchema(Number(value))
                            }
                            defaultValue={`${schemas![0].id}`}
                          >
                            <SelectTrigger className="w-full h-auto pb-1 pl-3 text-xl text-left border-none bg-grey rounded-xl">
                              <SelectValue placeholder="Схема аренды" />
                            </SelectTrigger>
                            <SelectContent className="w-full h-auto p-1 pb-0 text-left border-none bg-grey rounded-xl">
                              {schemas!.map(
                                (currentSchema: Schema, i: number) => (
                                  <SelectItem
                                    className="mb-1 border rounded-xl border-zinc-300 "
                                    key={`${currentSchema.working_days}/${currentSchema.non_working_days}${i}`}
                                    value={`${currentSchema.id}`}
                                  >
                                    {`${formatRoubles(
                                      currentSchema.daily_amount!
                                    )}`}
                                    <div className="text-xs font-medium text-black ">{`${currentSchema.working_days} раб. / ${currentSchema.non_working_days} вых.`}</div>
                                  </SelectItem>
                                )
                              )}
                            </SelectContent>
                          </Select>

                          {!activeBooking && (
                            <div className="relative ">
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
                            <div className="relative">
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
                <div className="w-2/3 space-y-2 ">
                  <div className="shadow-xl">
                    <SliderImages
                      type="click"
                      openIsAffordable={true}
                      images={variant.images!}
                      classImages="h-92"
                      classPaginationImages=""
                    />
                  </div>
                  <div className="px-2 py-4 bg-white shadow-xl rounded-xl">
                    <div className="flex">
                      <div className="w-2/3">
                        <p className="mb-4">Адрес парка</p>
                        <a
                          href={navigationLink(car.division!.address!)}
                          className="flex items-center gap-2 m-0 space-x-2 text-base text-blue-400 underline active:text-yellow"
                          target="_blank"
                        >
                          <FontAwesomeIcon
                            icon={faCompass}
                            className="text-black"
                          />
                          {car.division!.address!}
                        </a>
                      </div>
                      <div className="text-end">
                        <p className="mb-4">График работы</p>

                        {car.working_hours?.map((x, i) => (
                          <div key={`hour_${i}`}>
                            <p className="flex items-center justify-end gap-2">
                              {!i && <FontAwesomeIcon icon={faClock} />}
                              {x}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                    <Separator className="my-3" />
                    <div className="">
                      <p className="mb-4">Телефон</p>
                      <p>{car.division!.phone}</p>
                    </div>
                    <Separator className="my-3" />
                    <Collapsible>
                      <CollapsibleTrigger className="flex justify-between w-full mb-2 focus:outline-none md:text-lg">
                        <p>О парке</p>
                        <FontAwesomeIcon icon={faChevronDown} />
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <div className="mb-2 text-sm text-gray-700 md:text-base">
                          {car.about}
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                    {car.variants!.length > 1 && !index && (
                      <div className="">
                        <Separator className="my-3" />
                        <div className="flex justify-end">
                          <Button
                            onClick={() => setShowVariants(!showVariants)}
                            className="w-64"
                          >
                            {!showVariants &&
                              `Смотреть похожие: ${car.variants!.length - 1}`}
                            {showVariants && "Скрыть похожие"}
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
};

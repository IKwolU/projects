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
  Cars2,
  DayOfWeek,
  User,
  Variants,
} from "./api-client";
import { Separator } from "@/components/ui/separator";
import {
  CheckWorkingHours,
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
import CustomModal from "@/components/ui/custom-modal";
import { useState } from "react";

export const ModalCard = ({ car }: { car: Cars2 }) => {
  const [user, setUser] = useRecoilState(userAtom);
  const [selectedSchema, setSelectedSchema] = useState(
    car.rent_term!.schemas![0]!.id
  );
  const navigate = useNavigate();

  const activeBooking = user?.bookings!.find(
    (x) => x.status === BookingStatus.Booked
  );

  const carVariants = car.variants!;

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
    return navigate("bookings");
    // } else {
    //   navigate("account");
    // }
  };
  const { schemas } = car.rent_term!;
  let isWorkingHours = false;
  if (activeBooking) {
    isWorkingHours = CheckWorkingHours(
      activeBooking!.car!.division!.working_hours!
    );
  }

  return (
    <div className="pb-10">
      {car.variants!.map((x: Variants, i: number) => (
        <div key={i} className="mb-2">
          <div className="flex flex-col justify-center p-2 overflow-y-auto bg-white rounded-xl ">
            <SliderImages
              openIsAffordable={true}
              images={x.images!}
              classImages="md:h-92"
              classPaginationImages=""
            />
            {/* <div className="relative w-full h-52">
          <div className="flex space-x-4 overflow-scroll overflow-x-auto scrollbar-hide">
            {car.images!.map((x, i) => {
              return (
                <div
                  className={`min-w-[100%] h-52 pr-1 transition-transform ${
                    i === activeImageIndex ? "" : ""
                  }`}
                >
                  <img
                    className="object-cover w-full h-full rounded-xl"
                    src={x}
                    alt=""
                  />
                </div>
              );
            })}
          </div> */}
            {/* <div className="absolute bottom-0 flex px-1 py-1">
            {car.images!.map((x, i) => {
              return (
                <div
                  key={`modal_image_${i}`}
                  className={`w-full flex items-center bg-white rounded-xl transition-all h-14 ${
                    i === activeImageIndex
                      ? "shadow border-2 border-yellow"
                      : " scale-90"
                  }`}
                >
                  <img
                    className="object-cover w-full h-full rounded-xl"
                    src={x}
                    onClick={() => setActiveImageIndex(i)}
                    alt=""
                  />
                </div>
              );
            })}
          </div> */}
            {/* </div> */}
            <div className="space-y-2">
              <h1 className="my-4 text-center ">{`${car.brand} ${car.model} ${car.year_produced}`}</h1>

              <div className="flex flex-col md:flex-row md:flex-wrap">
                <div className="md:w-1/2 md:space-y-2">
                  <p className="flex justify-between pr-4 text-base md:text-lg font-regular text-gray">
                    <span>Парк: {car.park_name}</span>
                    <span>VIN: {x.vin}</span>
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
                <div className="min-h-fit md:w-1/2 ">
                  {!isWorkingHours &&
                    Object.keys(DayOfWeek)
                      .filter(
                        (x) =>
                          x === DayOfWeek.Monday || x === DayOfWeek.Saturday
                      )
                      .map((x) => {
                        const { working_hours } = car;
                        const currentDay = working_hours!.find(
                          ({ day }) => day === x
                        )!;
                        return (
                          <div className="flex flex-col items-start" key={x}>
                            <div className="text-base capitalize">
                              {x === DayOfWeek.Monday && "Понедельник-Пятница"}
                              {x === DayOfWeek.Saturday &&
                                "Суббота-Воскресенье"}
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
                      const { working_hours } = car;
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
              </div>
              <Collapsible>
                <CollapsibleTrigger className="mb-2 focus:outline-none md:text-lg">
                  О парке ▼
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="mb-2 text-sm text-gray-700 md:text-lg">
                    {car.about}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </div>
            <Separator />
            <div className="flex flex-wrap gap-2 mt-2 mb-2">
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
                {/* {!!car.self_employed && (
                <Badge variant="card">Для самозанятых</Badge>
              )} */}
                {!!car.rent_term?.is_buyout_possible && (
                  <Badge variant="card" className="md:text-lg">
                    Выкуп автомобиля
                  </Badge>
                )}
              </div>
            </div>
            <div className="flex flex-wrap gap-1 pb-1">
              {schemas!.slice(0, 3).map((currentSchema, i) => (
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
            <div className="flex justify-center h-16 w-full max-w-[800px] px-0 py-2 space-x-2 bg-white border-t border-pale inset-x-0 mx-auto sm:px-40">
              <Select
                onValueChange={(value) => setSelectedSchema(Number(value))}
                defaultValue={`${schemas![0].id}`}
              >
                <SelectTrigger className="w-1/2 h-auto pb-1 border-none pl-3text-left bg-grey rounded-xl md:px-5 ">
                  <SelectValue placeholder="Схема аренды" />
                </SelectTrigger>
                <SelectContent className="w-full h-auto p-1 pb-0 text-left border-none bg-grey rounded-xl">
                  {schemas!.map((currentSchema, i) => (
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
              {/* {carVariants.length > 1 && (
                  <CustomModal
                    trigger={
                      <div className="">
                        <Button className="sm:max-w-[250px] md:text-lg">
                          Выбрать
                        </Button>
                      </div>
                    }
                    cancel={() => {}}
                    content={
                      <div className="p-1 text-gray-700 w-100 rounded-xl">
                        <h3 className="mb-4 text-center md:text-xl">
                          Варианты доступных {car.brand} {car.model}:
                        </h3>

                        <div className="flex flex-row flex-wrap justify-center gap-4">
                          {carVariants.map(({ id, images }, i) => (
                            <div
                              className="max-w-[352px]"
                              key={`modal_card${id}${i}`}
                            >
                              <SliderImages
                                openIsAffordable={true}
                                classImages="h-64 sm:h-64"
                                classPaginationImages=" sm:justify-between sm:w-full"
                                images={images!}
                              />
                              {!!activeBooking && (
                                <div className="w-full my-2">
                                  <Confirmation
                                    title={
                                      <div className="text-center">
                                        <div>
                                          У вас есть активная бронь:{" "}
                                          {activeBooking.car?.brand}{" "}
                                          {activeBooking.car?.model}
                                        </div>
                                        <div>
                                          Отменить и забронировать {car.brand}{" "}
                                          {car.model}?
                                        </div>
                                      </div>
                                    }
                                    type="green"
                                    accept={() => book(id)}
                                    cancel={() => {}}
                                    trigger={
                                      <Button className="">
                                        Забронировать
                                      </Button>
                                    }
                                  />
                                </div>
                              )}
                              {!activeBooking && (
                                <div className="w-full my-2">
                                  <Confirmation
                                    title={`Забронировать ${car.brand} ${car.model}?`}
                                    type="green"
                                    accept={() => book(id)}
                                    cancel={() => {}}
                                    trigger={
                                      <Button className="">
                                        Забронировать
                                      </Button>
                                    }
                                  />
                                </div>
                              )}
                              <Separator className="my-4" />
                            </div>
                          ))}
                        </div>
                      </div>
                    }
                  />
                )} */}
              {!activeBooking && (
                <div className="w-1/2 sm:max-w-[250px]">
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
                <div className="w-1/2 sm:max-w-[250px]">
                  <Confirmation
                    title={
                      <div className="text-center ">
                        <div>
                          У вас есть активная бронь: {activeBooking.car?.brand}{" "}
                          {activeBooking.car?.model}
                        </div>
                        <div>
                          Отменить и забронировать {car.brand} {car.model}?
                        </div>
                      </div>
                    }
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
      ))}
    </div>
  );
};

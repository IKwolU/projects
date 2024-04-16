import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Cars3, Schemas3 } from "./api-client";
import {
  formatRoubles,
  getFuelTypeDisplayName,
  getTransmissionDisplayName,
} from "@/lib/utils";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogClose,
} from "@/components/ui/dialog";
import { CarDetails } from "./CarDetails";
import SliderImages from "@/components/ui/slider-images";
import ChevoronLeft from "./assets/chevron-left.png";
import ym from "react-yandex-metrika";
import { Separator } from "@/components/ui/separator";

export const Card = ({ car }: { car: Cars3 }) => {
  const currentSchemas: Schemas3[] = car.rent_term!.schemas!.sort(
    (a: any, b: any) => a.daily_amount! - b.daily_amount!
  );

  return (
    <Dialog>
      <DialogTrigger
        asChild
        onClick={() => ym("reachGoal", "click_card", 96683881)}
      >
        <div className="relative max-w-[376px]  lg:max-w-[386px] p-1 pb-2 mx-auto mb-2 text-gray-700 bg-white shadow-md w-100 rounded-2xl lg:mx-0 flex flex-col w-full">
          <div>
            <div className="absolute z-50 px-3 py-1 m-1 font-medium bg-white shadow rounded-2xl text-gray ">
              Парк &laquo;{car.park_name}&raquo;
            </div>
            {car.cars_count! > 1 && (
              <div className="absolute left-1 z-10 m-1 flex items-center  px-4 py-1 font-medium text-center bg-white shadow rounded-full text-gray top-[170px]">
                {car.cars_count} авто в наличии
              </div>
            )}
            <div className="flex space-x-1 overflow-x-auto scrollbar-hide rounded-xl md:hidden h-52">
              {car.images?.map((x: string, i: number) => (
                <img
                  alt=""
                  key={`${x}${i}`}
                  className={`object-cover rounded-sm h-52 ${
                    car.images && car.images.length > 1 ? "w-10/12" : "w-full"
                  }`}
                  src={x}
                />
              ))}
            </div>
            <div className="hidden md:block">
              <SliderImages
                type="hover"
                openIsAffordable={false}
                classImages="h-52 sm:h-52 max-h-52"
                classPaginationImages=" sm:justify-between sm:w-full"
                images={car.images!}
              />
            </div>
          </div>
          <div className="flex flex-col justify-between flex-grow px-1">
            <div className="">
              <div className="mt-2 mb-1 text-lg md:text-xl">
                <h1 className="m-0">
                  {`${car.brand} ${car.model}`}{" "}
                  <span className="font-normal">{car.year_produced}</span>
                </h1>
                <div className="flex space-x-4">
                  <div className="text-sm w-fit text-zinc-400">
                    {getTransmissionDisplayName(car.transmission_type)}
                  </div>
                  <div className="text-sm w-fit text-zinc-400">
                    {getFuelTypeDisplayName(car.fuel_type)}
                  </div>
                </div>
              </div>
              <Separator className="my-2" />
              {/* <div className="flex items-center justify-center mb-4 -mt-4 space-x-2">
                <p className="text-base">Пробег</p>
                <p>{car!.mileage}</p>
              </div> */}
              <div className="flex flex-wrap gap-4">
                {currentSchemas?.slice(0, 3).map((currentSchema, i) => (
                  <div
                    key={`${currentSchema.working_days}/${currentSchema.non_working_days}${i}`}
                    className=""
                  >
                    {`${formatRoubles(currentSchema.daily_amount!)}`}
                    <div className="text-xs font-medium text-zinc-400">{`${currentSchema.working_days} раб. / ${currentSchema.non_working_days} вых.`}</div>
                  </div>
                ))}
              </div>
              <Separator className="my-2" />
              {Number(car.rent_term!.deposit_amount_total) !== 0 && (
                <>
                  {" "}
                  <div className="flex flex-col justify-start gap-1">
                    <span className="flex items-center h-full bg-white rounded-xl">
                      <span className="flex items-center gap-2">
                        <span className="text-sm text-zinc-400">Депозит</span>
                        <span className="w-1 h-1 rounded-full bg-zinc-400"></span>
                        <span className="">
                          {formatRoubles(car.rent_term!.deposit_amount_total!)}{" "}
                          по{" "}
                          {formatRoubles(car.rent_term!.deposit_amount_daily!)}{" "}
                          в день
                        </span>
                      </span>
                    </span>
                  </div>
                  <Separator className="my-2" />
                </>
              )}
              <div className="flex flex-wrap justify-start gap-2 mb-0">
                <div className="flex flex-col items-start w-full gap-2 sm:items-center sm:flex-row">
                  <span className="flex items-center gap-2 mr-1 ">
                    <span className="text-sm text-zinc-400">
                      Комиссия парка
                    </span>
                    <span className="w-1 h-1 rounded-full bg-zinc-400"></span>{" "}
                    <span className="">{car.commission} %</span>
                  </span>
                  <Separator className="my-0 sm:hidden" />
                  <span className="flex items-center gap-2 mr-1 ">
                    <span className="text-sm text-zinc-400">
                      Возможен выкуп
                    </span>
                    <span className="w-1 h-1 rounded-full bg-zinc-400"></span>{" "}
                    <span className="">
                      {car.rent_term!.is_buyout_possible ? "да" : "нет"}
                    </span>
                  </span>
                </div>

                <div>
                  {/* {!!car.self_employed && (
                <Badge variant="card">Для самозанятых</Badge>
              )} */}
                  {!!car.rent_term!.is_buyout_possible && (
                    <Badge variant="card" className="text-zinc-400">
                      Выкуп автомобиля
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            <div className="flex gap-2 mt-1 text-center">
              <Button variant={"card"} className="w-full sm:max-w-[376px]">
                Подробнее
              </Button>
              <Button
                variant={"cardDefault"}
                className="w-full sm:max-w-[376px]"
              >
                Забронировать
              </Button>
            </div>
          </div>
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px] h-full bg-lightgrey p-2 pt-8 lg:max-w-full">
        {/* <DialogHeader>
        <DialogTitle></DialogTitle> */}
        {/* <DialogDescription>DialogDescription</DialogDescription> */}
        {/* </DialogHeader> */}
        <CarDetails car={car} />
        {/* <DialogFooter>
        <DialogClose asChild>
          <Button>Выбрать</Button>
        </DialogClose>
      </DialogFooter> */}
        <DialogClose asChild className="">
          <div>
            <div className="fixed bottom-0 left-0 z-50 flex justify-center w-full px-2 space-x-2 lg:hidden">
              <div className="flex w-full p-2 mx-auto space-x-2 bg-white rounded-b-xl md:max-w-[800px] max-w-[512px]">
                <Button
                  variant="outline"
                  full
                  className="sm:max-w-[250px] mx-auto"
                >
                  Назад
                </Button>
              </div>
            </div>
            <div className="fixed top-0 left-0 justify-center hidden h-full m-0 cursor-pointer lg:flex">
              <div className="flex justify-center max-w-[1208px] mx-auto ">
                <div className="relative w-32 h-full bg-white">
                  <div className="absolute flex items-center justify-center w-20 h-20 p-1 bg-white rounded-full -right-10 top-40">
                    <div className="flex items-center justify-center w-16 h-16 border-2 rounded-full border-gray">
                      <img className="h-10 -ml-1" src={ChevoronLeft} alt="" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
};

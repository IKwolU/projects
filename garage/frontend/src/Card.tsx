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
        <div className="relative max-w-[376px] p-1 pb-2 mx-auto mb-2 text-gray-700 bg-white shadow-md w-100 rounded-xl lg:mx-0">
          <div>
            <div className="absolute z-50 px-3 py-1 m-1 font-medium bg-white shadow rounded-2xl text-gray">
              Парк: &laquo;{car.park_name}&raquo;
            </div>
            {car.variants!.length > 1 && (
              <div className="absolute z-50 h-10 px-4 py-2 font-medium text-center bg-white rounded-full rounded-t-lg right-1 text-gray">
                +{car.variants!.length}
              </div>
            )}
            <div className="flex space-x-1 overflow-x-auto scrollbar-hide rounded-xl md:hidden">
              {car.images?.map((x: string, i: number) => (
                <img
                  alt=""
                  key={`${x}${i}`}
                  className={`object-cover  rounded-sm h-52 ${
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
                classImages="h-64 sm:h-64"
                classPaginationImages=" sm:justify-between sm:w-full"
                images={car.images!}
              />
            </div>
          </div>
          <div className="px-1">
            <div className="pl-1 my-2 text-lg text-center md:text-xl md:mb-4">
              <h1 className="">
                {`${car.brand} ${car.model}`} {car.year_produced}
              </h1>
            </div>
            <div className="flex items-center justify-center mb-4 -mt-4 space-x-2">
              <p className="text-base">Пробег</p>
              <p>{car!.variants![0].mileage}</p>
            </div>

            <div className="flex flex-wrap justify-start gap-2 mb-2">
              {Number(car.rent_term!.deposit_amount_total) !== 0 && (
                <div className="flex flex-col justify-start gap-1">
                  <div>
                    <Badge variant="card" className="px-0 py-0 bg-grey ">
                      <span className="flex items-center h-full px-2 bg-white rounded-xl">
                        <span className="text-zinc-400">Депозит</span>
                        <span className="ml-1">
                          {formatRoubles(car.rent_term!.deposit_amount_total!)}
                        </span>
                      </span>
                      <span className="flex items-center h-full px-2 ">
                        {formatRoubles(car.rent_term!.deposit_amount_daily!)}
                        /день
                      </span>
                    </Badge>
                  </div>
                </div>
              )}
              <div className="">
                <Badge variant="card">
                  <span className="mr-1 text-zinc-400">Комиссия</span>{" "}
                  {car.commission} %
                </Badge>{" "}
              </div>
              <Badge variant="card" className="w-fit text-zinc-400">
                {getTransmissionDisplayName(car.transmission_type)}
              </Badge>
              <Badge variant="card" className=" w-fit text-zinc-400">
                {getFuelTypeDisplayName(car.fuel_type)}
              </Badge>

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
            <div className="flex flex-wrap gap-1">
              {currentSchemas?.slice(0, 3).map((currentSchema, i) => (
                <Badge
                  key={`${currentSchema.working_days}/${currentSchema.non_working_days}${i}`}
                  className=""
                  variant="schema"
                >
                  {`${formatRoubles(currentSchema.daily_amount!)}`}
                  <div className="text-xs font-medium text-zinc-400">{`${currentSchema.working_days} раб. / ${currentSchema.non_working_days} вых.`}</div>
                </Badge>
              ))}
            </div>
            <div className="mt-4 text-center">
              <Button className="w-full sm:max-w-[376px]">Подробнее</Button>
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
                      <img className="h-10 -ml-1" src={ChevoronLeft} />
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

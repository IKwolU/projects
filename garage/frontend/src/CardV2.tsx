import { Button } from "@/components/ui/button";
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
// import ChevoronLeft from "./assets/chevron-left.png";
import ym from "react-yandex-metrika";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import { CarCreateApplication } from "./CarCreateApplication";
import { LoginAndBook } from "./LoginAndBook";
import { faChevronDown, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@radix-ui/react-collapsible";

export const CardV2 = ({
  car,
  isLargeScreen,
  open,
}: {
  car: Cars3;
  isLargeScreen: boolean;
  open: () => void;
}) => {
  const currentSchemas: Schemas3[] = car.rent_term!.schemas!.sort(
    (a: any, b: any) => a.daily_amount! - b.daily_amount!
  );
  const [isBookOpen, setIsBookOpen] = useState(false);

  return (
    <>
      {isBookOpen && (
        <div
          className="fixed left-0 top-0 w-screen h-screen z-[55] flex items-center justify-center bg-black bg-opacity-50"
          onClick={(e) => e.target === e.currentTarget && setIsBookOpen(false)}
        >
          <div className="max-w-[300px]">
            <LoginAndBook
              car={car}
              close={() => setIsBookOpen(false)}
              isModal={true}
            />
          </div>
        </div>
      )}
      <Dialog modal={!isLargeScreen} onOpenChange={open}>
        <DialogTrigger
          asChild
          onClick={() => ym("reachGoal", "click_card", 96683881)}
        >
          <div>
            <div className="flex">
              <div className="flex">
                <img src={car!.images![0]} className={`w-1/3 rounded-2xl`} />
                <div className="flex flex-col w-2/3 px-2">
                  <div className="flex justify-between">
                    <h4>Парк {car.park_name}</h4>
                    {car.cars_count! > 1 && <h2>{car.cars_count} авто</h2>}
                  </div>

                  <div className="mb-1 text-lg md:text-xl">
                    <h4 className="m-0">
                      {`${car.brand} ${car.model}`}{" "}
                      <span className="font-normal">{car.year_produced}</span>
                    </h4>
                    <div className="flex space-x-4">
                      <div className="text-sm w-fit text-zinc-400">
                        {getTransmissionDisplayName(car.transmission_type)}
                      </div>
                      <div className="flex items-center">
                        <div className="w-1 h-1 rounded-full bg-zinc-400"></div>
                      </div>
                      <div className="text-sm w-fit text-zinc-400">
                        {getFuelTypeDisplayName(car.fuel_type)}
                      </div>
                    </div>
                  </div>
                </div>
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
            <div className="flex flex-col justify-between flex-grow mt-2">
              <div className="flex gap-2 mt-1 text-center">
                <Button variant={"card"} className="w-full sm:max-w-[376px]">
                  Подробнее
                </Button>
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsBookOpen(true);
                  }}
                  variant={"cardDefault"}
                  className="w-full sm:max-w-[376px]"
                >
                  Забронировать
                </Button>
              </div>
            </div>
            <Separator className="my-5" />
          </div>
        </DialogTrigger>
        <DialogContent
          goBackContent={
            isLargeScreen ? (
              <h1 className="my-0 font-normal text-center">Назад</h1>
            ) : (
              <h1 className="my-0 text-center">{`${car.brand} ${car.model} ${car.year_produced}`}</h1>
            )
          }
          className="sm:max-w-[800px] h-full bg-lightgrey p-2 pt-12 lg:max-w-full"
        >
          <CarDetails car={car} />
          <DialogClose asChild className=""></DialogClose>
        </DialogContent>
      </Dialog>
    </>
  );
};

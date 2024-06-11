import { Button } from "@/components/ui/button";
import { Cars3, Schemas3 } from "./api-client";
import MoscMetro from "./assets/Moscow_Metro.svg";
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
import ym from "react-yandex-metrika";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import { LoginAndBook } from "./LoginAndBook";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@radix-ui/react-collapsible";

export const CardV2 = ({ car, open }: { car: Cars3; open: () => void }) => {
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
      <Dialog onOpenChange={open} modal={false}>
        <DialogTrigger
          asChild
          onClick={() => ym("reachGoal", "click_card", 96683881)}
        >
          <div>
            <div className="flex">
              <div className="flex w-full">
                <img
                  src={car!.images![0]}
                  className={`w-1/3 rounded-2xl max-h-20 object-cover`}
                  alt=""
                />
                <div className="relative flex flex-col w-2/3 px-2">
                  <div className="flex justify-between">
                    <h4>Парк {car.park_name}</h4>
                    {car.cars_count! > 1 && (
                      <h2 className="absolute right-0 px-3 py-[2px] mb-0 font-medium text-center rounded-full shadow -top-2 bg-grey bg-opacity-80">
                        {car.cars_count} авто
                      </h2>
                    )}
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
                    {car.variants![0].metro && (
                      <Collapsible
                        className="p-0 m-0"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <CollapsibleTrigger className="relative flex items-center gap-1 p-0 mb-0 text-sm text-left">
                          {car.variants![0].color_metro!.map((x) => (
                            <span
                              style={{ backgroundColor: x }}
                              key={x}
                              className="w-[5px] h-[5px] rounded-full"
                            ></span>
                          ))}
                          <span
                            style={{ color: `${car.variants![0].color_metro}` }}
                          >
                            {car.variants![0].metro}
                          </span>
                          {car.variants!.length > 1 && (
                            <FontAwesomeIcon
                              icon={faChevronDown}
                              className="absolute top-0 -right-5"
                            />
                          )}
                        </CollapsibleTrigger>
                        <CollapsibleContent className="text-sm ">
                          {car.variants!.map((variant, i) => (
                            <div key={i}>
                              {!!i && variant.metro && (
                                <div
                                  className="flex items-center gap-1 p-0 mb-0 text-sm text-left"
                                  key={variant.metro}
                                >
                                  {car.variants![0].color_metro!.map((x) => (
                                    <span
                                      style={{ backgroundColor: x }}
                                      key={x}
                                      className="w-[5px] h-[5px] rounded-full"
                                    ></span>
                                  ))}
                                  <span>{variant.metro}</span>
                                </div>
                              )}
                            </div>
                          ))}
                        </CollapsibleContent>
                      </Collapsible>
                    )}
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
            <div className="inset-x-0 flex justify-start w-full mx-auto mt-1 space-x-2">
              <div className="flex flex-wrap gap-4">
                {currentSchemas?.map((currentSchema, i) => (
                  <div
                    key={`${currentSchema.working_days}/${currentSchema.non_working_days}${i}`}
                    className=""
                  >
                    {`${formatRoubles(currentSchema.daily_amount!)}`}
                    <div className="text-xs font-medium text-zinc-400">{`${currentSchema.working_days} раб. / ${currentSchema.non_working_days} вых.`}</div>
                  </div>
                ))}
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
          isModalOnLg={false}
          goBackContent={
            <>
              <h1 className="hidden my-0 font-normal text-center lg:block">
                Назад
              </h1>

              <h1 className="my-0 text-center lg:hidden">{`${car.brand} ${car.model} ${car.year_produced}`}</h1>
            </>
          }
          className="sm:max-w-[800px] h-full bg-lightgrey p-2 pt-12 lg:max-w-full"
        >
          <div className="fixed top-0 left-0 flex flex-col items-center justify-center w-full h-full bg-lightgrey -z-10 lg:top-[110px]"></div>
          <div className="px-2">
            <CarDetails car={car} />
          </div>
          <DialogClose asChild className=""></DialogClose>
        </DialogContent>
      </Dialog>
    </>
  );
};

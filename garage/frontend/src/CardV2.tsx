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
import ym from "react-yandex-metrika";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import { LoginAndBook } from "./LoginAndBook";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export const CardV2 = ({ car, open }: { car: Cars3; open: () => void }) => {
  const currentSchemas: Schemas3[] = car.rent_term!.schemas!.sort(
    (a: any, b: any) => a.daily_amount! - b.daily_amount!
  );
  const [isBookOpen, setIsBookOpen] = useState(false);
  const [openedStationsId, setOpenedStationsId] = useState<number>(-1);

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
              <div className="relative w-full">
                <div className="relative w-full">
                  <div className="absolute z-50 px-2 py-0 mx-[7px] my-1 text-[13px] font-medium text-black bg-white shadow bg-opacity-90 rounded-2xl ">
                    Парк &laquo;{car.park_name}&raquo;
                  </div>
                  <img
                    src={car!.images![0]}
                    className={`w-full rounded-[8px]   h-[calc((100vw-68px)/2)] object-cover`}
                    alt=""
                  />
                  {/* {car.cars_count! > 1 && (
                    <h2 className="absolute px-2 py-0 mb-0 font-medium text-center text-black bg-white rounded-full shadow left-1 bottom-1 ">
                      {car.cars_count} авто
                    </h2>
                  )} */}
                </div>

                <div className="relative flex flex-col w-full px-0 pt-2">
                  <div className="w-full mb-1 text-lg md:text-xl">
                    <h4 className="m-0 text-2xl">
                      {`${car.brand} ${car.model}`}
                    </h4>
                    <div className="flex space-x-2">
                      <span className="text-sm w-fit text-zinc-400">
                        {car.year_produced}
                      </span>
                      <div className="flex items-center">
                        <div className="w-[3px] h-[3px] rounded-full bg-zinc-400"></div>
                      </div>
                      <div className="text-sm w-fit text-zinc-400">
                        {getTransmissionDisplayName(car.transmission_type)}
                      </div>
                      <div className="flex items-center">
                        <div className="w-[3px] h-[3px] rounded-full bg-zinc-400"></div>
                      </div>
                      <div className="text-sm w-fit text-zinc-400">
                        {getFuelTypeDisplayName(car.fuel_type)}
                      </div>
                    </div>
                    {car.variants![0].metro && (
                      <div
                        className="flex p-0 m-0 space-x-2"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex items-center gap-1 text-sm">
                          {car.variants![0].color_metro!.map((x) => (
                            <div
                              style={{ backgroundColor: x }}
                              key={x}
                              className="w-[5px] h-[5px] rounded-full"
                            ></div>
                          ))}
                          <span>{car.variants![0].metro}</span>
                        </div>
                        <div className="relative text-sm underline text-nowrap">
                          {car.variants!.length > 1 && (
                            <div onClick={() => setOpenedStationsId(car.id!)}>
                              + еще {car.variants!.length - 1} станций{" "}
                            </div>
                          )}
                          {openedStationsId === car.id && (
                            <div className="">
                              <div
                                className="fixed top-0 left-0 z-[51] w-full h-full "
                                onClick={() => {
                                  setOpenedStationsId(-1);
                                }}
                              ></div>
                              <div className="absolute right-0 z-[51] w-40 p-2 bg-white shadow-xl top-5 rounded-xl">
                                {car.variants!.map((variant, i) => (
                                  <div key={i}>
                                    {!!i && variant.metro && (
                                      <div
                                        className="flex items-center gap-1 p-0 mb-0 text-sm text-left"
                                        key={variant.metro}
                                      >
                                        {variant.color_metro!.map((x) => (
                                          <span
                                            style={{ backgroundColor: x }}
                                            key={x}
                                            className="w-[5px] h-[5px] rounded-full"
                                          ></span>
                                        ))}
                                        <span>{variant.metro}</span>
                                      </div>
                                    )}
                                    <FontAwesomeIcon
                                      className="absolute ml-1 text-gray top-2 right-2"
                                      icon={faXmark}
                                      onClick={() => {
                                        setOpenedStationsId(-1);
                                      }}
                                    />
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="inset-x-0 flex justify-start w-full mx-auto mt-1 space-x-2">
              <div className="flex flex-wrap gap-4">
                {currentSchemas?.map((currentSchema, i) => (
                  <div
                    key={`${currentSchema.working_days}/${currentSchema.non_working_days}${i}`}
                    className=""
                  >
                    <div className="text-2xl font-semibold ">{`${formatRoubles(
                      currentSchema.daily_amount!
                    )}`}</div>
                    <div className="-mt-1 text-xs font-medium text-zinc-400">{`${currentSchema.working_days} раб. / ${currentSchema.non_working_days} вых.`}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex flex-col justify-between flex-grow mt-0">
              <div className="flex gap-[6px] mt-1 text-center">
                <Button
                  variant={"card"}
                  className=" sm:max-w-[376px] w-2/5  h-[33px] rounded-[8px] text-sm font-semibold"
                >
                  Подробнее
                </Button>
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsBookOpen(true);
                  }}
                  variant={"cardDefault"}
                  className="w-3/5 sm:max-w-[376px] h-[33px] rounded-[8px] text-sm font-semibold"
                >
                  Забронировать
                </Button>
              </div>
            </div>
            <Separator className="my-[15px]" />
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

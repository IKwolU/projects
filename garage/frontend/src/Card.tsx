import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Cars2 } from "./api-client";
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
import { ModalCard } from "./ModalCard";
import SliderImages from "@/components/ui/slider-images";

export const Card = ({ car }: { car: Cars2 }) => {
  const currentSchemas = car.rent_term!.schemas!.sort(
    (a, b) => a.daily_amount! - b.daily_amount!
  );

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="relative max-w-[352px] p-1 pb-2 mx-auto mb-2 text-gray-700 bg-white shadow-md w-100 rounded-xl lg:mx-0">
          <div>
            <div className="absolute z-50 p-2 font-medium rounded-tl-lg rounded-br-lg shadow text-gray bg-yellow">
              {car.park_name}
            </div>
            {car.variants!.length > 1 && (
              <div className="absolute z-50 p-2 font-medium rounded-tr-lg rounded-bl-lg shadow right-1 text-gray bg-yellow">
                +{car.variants!.length - 1}
              </div>
            )}
            <div className="flex space-x-1 overflow-x-auto scrollbar-hide rounded-xl md:hidden">
              {car.images?.map((x, i) => (
                <img
                  alt=""
                  key={`${x}${i}`}
                  className="object-cover w-10/12 rounded-sm h-52"
                  src={x}
                />
              ))}
            </div>
            <div className="hidden md:block">
              <SliderImages
                openIsAffordable={false}
                classImages="h-64 sm:h-64"
                classPaginationImages=" sm:justify-between sm:w-full"
                images={car.images!}
              />
            </div>
          </div>
          <div className="px-1">
            <h1 className="my-2 text-center">{`${car.brand} ${car.model} ${car.year_produced}`}</h1>
            <div className="flex flex-wrap justify-start gap-2 mb-2">
              <div className="flex flex-col justify-start gap-1">
                <div>
                  <Badge variant="card" className="px-0 py-0 bg-grey ">
                    <span className="flex items-center h-full px-2 bg-white rounded-xl">
                      Депозит{" "}
                      {formatRoubles(car.rent_term!.deposit_amount_total!)}
                    </span>
                    <span className="flex items-center h-full px-2 ">
                      {formatRoubles(car.rent_term!.deposit_amount_daily!)}
                      /день
                    </span>
                  </Badge>
                </div>
              </div>
              <div className="">
                <Badge variant="card">Комиссия {car.commission} %</Badge>{" "}
              </div>
              <Badge variant="card" className="w-fit">
                {getTransmissionDisplayName(car.transmission_type)}
              </Badge>
              <Badge variant="card" className=" w-fit">
                {getFuelTypeDisplayName(car.fuel_type)}
              </Badge>

              <div>
                {/* {!!car.self_employed && (
                <Badge variant="card">Для самозанятых</Badge>
              )} */}
                {!!car.rent_term?.is_buyout_possible && (
                  <Badge variant="card">Выкуп автомобиля</Badge>
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
                  <div className="text-xs font-medium text-black">{`${currentSchema.working_days} раб. / ${currentSchema.non_working_days} вых.`}</div>
                </Badge>
              ))}
            </div>
            <div className="mt-4 text-center">
              <Button className="w-full sm:max-w-[376px]">Подробнее</Button>
            </div>
          </div>
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px] h-full bg-lightgrey p-2 pt-8">
        {/* <DialogHeader>
        <DialogTitle></DialogTitle> */}
        {/* <DialogDescription>DialogDescription</DialogDescription> */}
        {/* </DialogHeader> */}
        <ModalCard car={car} />
        {/* <DialogFooter>
        <DialogClose asChild>
          <Button>Выбрать</Button>
        </DialogClose>
      </DialogFooter> */}
        <DialogClose asChild>
          <div className="fixed bottom-0 left-0 flex justify-center w-full px-2 space-x-2">
            <div className="inset-0 flex w-full p-2 mx-auto space-x-2 bg-white rounded-b-xl max-w-[800px] ">
              <Button className="sm:max-w-[250px] mx-auto">Назад</Button>
            </div>
          </div>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
};

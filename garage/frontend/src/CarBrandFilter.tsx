import { useState } from "react";
import {
  Brands,
  CarClass,
  FuelType,
  IBrands,
  Schemas2,
  TransmissionType,
} from "./api-client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import BackArrow from "./assets/BackArrow.svg";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";

type CarFilter = {
  brands: string[];
  models: string[];
  parksName: string[];
  carClass: CarClass[];
  commission: number | null;
  fuelType: FuelType | null;
  transmissionType: TransmissionType | null;
  selfEmployed: boolean;
  buyoutPossible: boolean | undefined;
  schema: Schemas2 | null;
  sorting: "asc" | "desc";
  carVin: string | null;
  onMap: boolean;
  notStackList: string[] | undefined;
  metros: string[];
};

export const CarBrandFilter = ({
  filters,
  result,
  brands,
  trigger,
}: {
  filters: CarFilter;
  result: (filters: CarFilter) => void;
  brands: IBrands;
  trigger: JSX.Element;
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  const brandsArray = Object.values(brands);

  const filteredBrands = brandsArray.filter(
    (brand: Brands) =>
      brand.name && brand.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[1208px]" ishiddenclose>
        <div className="absolute left-0 w-full h-0 top-3">
          <div className="mx-auto text-lg font-bold text-center w-fit">
            Модели
          </div>
        </div>

        <div className="flex space-x-2 flex-nowrap">
          <input
            className="w-full px-2 py-[5px] border border-pale rounded-[7px] focus-visible:outline-none"
            type="text"
            placeholder="Введите модель"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="grid items-start content-start justify-start h-full grid-cols-1 py-4 pb-32 pr-1 overflow-y-auto sm:pr-0 sm:grid-cols-3 ">
          {/* <div
            className="w-full p-1 text-base font-semibold text-black cursor-pointer "
            onClick={() => {
              result({
                ...filters,
                brands: [],
                models: [],
              });
              setSearchTerm("");
            }}
          >
            Все модели
          </div> */}
          {filteredBrands.map((x: IBrands) => {
            const title = x.name!;
            const isActive = filters.brands.some((b) => b === title);
            return (
              <span
                className={`cursor-pointer text-base font-semibold text-black md:pr-12 ${
                  isActive ? "" : ""
                }`}
                key={title}
              >
                <span className={`p-1 font-bold text-lg justify-between flex`}>
                  {title}
                </span>
                {x.models!.map((model) => {
                  const isActiveModel = filters.models.some((b) => b === model);
                  const isActiveBrand = filters.brands.some(
                    (b) => b === x.name
                  );
                  return (
                    <span
                      className={`cursor-pointer text-base py-1 text-black  ${
                        isActiveModel ? "" : ""
                      }`}
                      key={model}
                      onClick={() =>
                        result({
                          ...filters,
                          models: isActiveModel
                            ? filters.models.filter((b) => b !== model)
                            : [...filters.models, model],
                          brands: isActiveBrand
                            ? [...filters.brands]
                            : [...filters.brands, x.name!],
                        })
                      }
                    >
                      <span
                        className={`w-full font-normal text-gray px-1 pb-1 flex gap-x-40 justify-between items-center`}
                      >
                        {model}
                        <div
                          className={`${
                            isActiveModel ? "bg-yellow" : "border border-gray"
                          } w-6 h-6  p-1 flex items-center justify-center rounded-lg`}
                        >
                          {isActiveModel && (
                            <FontAwesomeIcon
                              icon={faCheck}
                              className="cursor-pointer"
                            />
                          )}
                        </div>
                      </span>
                    </span>
                  );
                })}
                <Separator className="mt-1 bg-pale" />
              </span>
            );
          })}
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <div className="">
              <div className="fixed top-0 left-0 flex justify-center w-12">
                <div className="max-w-[800px] w-full flex justify-center px-4 py-3 space-x-2">
                  <img src={BackArrow} alt="" className="h-5 text-gray" />
                </div>
              </div>
              <div className="fixed bottom-0 left-0 flex justify-center w-full">
                <div className="max-w-[800px] w-full flex justify-center bg-white shadow-[-0px_-5px_15px_1px] shadow-pale px-4 py-4 space-x-2">
                  <div className="sm:max-w-[250px] w-full ">
                    <Button className="text-lg font-semibold h-[46px]">
                      Выбрать
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

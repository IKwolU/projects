import { useState } from "react";
import {
  Brands,
  CarClass,
  FuelType,
  IBrands,
  Schemas,
  Schemas2,
  TransmissionType,
} from "./api-client";
import {
  getFuelTypeDisplayName,
  getTransmissionDisplayName,
} from "@/lib/utils";

import { Badge } from "@/components/ui/badge";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faCheck,
  faChevronRight,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
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
};

enum ActiveFilter {
  FuelType = 1,
  TransmissionType = 2,
  RentTerm = 3,
  Sorting = 4,
  Buyout = 5,
}

const staticSchemas = [
  new Schemas({ working_days: 7, non_working_days: 0 }),
  new Schemas({ working_days: 6, non_working_days: 1 }),
  new Schemas({ working_days: 14, non_working_days: 1 }),
];

export const MobileFilters = ({
  filters,
  clean,
  result,
  close,
  count,
  brands,
}: {
  filters: CarFilter;
  clean: () => void;
  result: (filters: CarFilter) => void;
  close: () => void;
  count: number;
  brands: IBrands;
}) => {
  const [activeFilter, setActiveFilter] = useState<ActiveFilter | null>(null);
  const [parksName, setParksName] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchParkTerm, setSearchParkTerm] = useState("");
  const [overflow, setOverflow] = useState(false);

  const brandsArray = Object.values(brands);

  const filteredBrands = brandsArray.filter(
    (brand: Brands) =>
      brand.name && brand.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredParks = parksName.filter(
    (name: string) =>
      name && name.toLowerCase().includes(searchParkTerm.toLowerCase())
  );

  return (
    <>
      <div
        className={`${
          overflow && "pt-10"
        } fixed top-0 left-0 w-screen h-full bg-white z-[52] px-2 overflow-y-auto pb-16`}
      >
        <div className=" w-full max-w-[352px] mx-auto  i grid grid-cols-3 font-normal items-center h-10 text-nowrap  whitespace-nowrap rounded-xl text-base font-regular  transition-colors focus:outline-none ">
          <FontAwesomeIcon
            className="h-5 ml-1 text-gray"
            icon={faXmark}
            onClick={() => close()}
          />
          <div className="text-xl font-semibold text-center">Фильтры</div>
          <div className="text-end text-gray" onClick={() => clean()}>
            Сбросить
          </div>
        </div>
        <Separator className="my-2" />
        <div className="my-2 space-x-2 overflow-scroll overflow-x-auto sm:flex scrollbar-hide">
          <h3>Тип аренды</h3>
          {[undefined, false, true].map((buyoutPossible, i) => (
            <Badge
              key={`Buyout${i}`}
              className={`${
                filters.buyoutPossible === buyoutPossible
                  ? "bg-white shadow border border-pale"
                  : ""
              } cursor-pointer`}
              onClick={() => {
                result({
                  ...filters,
                  buyoutPossible:
                    filters.buyoutPossible === buyoutPossible
                      ? undefined
                      : buyoutPossible,
                });
              }}
            >
              {buyoutPossible === undefined && "Любой"}
              {buyoutPossible && "Выкуп"}
              {buyoutPossible === false && "Аренда"}
            </Badge>
          ))}
          <Separator className="my-2" />
          <h3>Цена</h3>
          <div className="space-y-2">
            {["asc", "desc"].map((sorting, i) => (
              <Badge
                key={`sorting ${i}`}
                className={` ${
                  filters.sorting === sorting
                    ? "bg-white shadow border border-pale"
                    : ""
                } cursor-pointer w-60`}
                onClick={() =>
                  result({
                    ...filters,
                    sorting:
                      filters.sorting === sorting
                        ? "asc"
                        : (sorting as CarFilter["sorting"]),
                  })
                }
              >
                {sorting === "asc" && "Сначала самые дешевые"}
                {sorting === "desc" && "Сначала самые дорогие"}
              </Badge>
            ))}
          </div>
          <Separator className="my-2" />
          <h3>График аренды</h3>
          {[null, ...staticSchemas].map((schema, i) => (
            <Badge
              key={`schema ${i}`}
              className={`${
                filters.schema === schema
                  ? "bg-white shadow border border-pale"
                  : ""
              } cursor-pointer`}
              onClick={() => {
                return result({
                  ...filters,
                  schema: filters.schema === schema ? null : schema,
                });
              }}
            >
              {schema
                ? `${schema?.working_days}/${schema?.non_working_days}`
                : "Любой"}
            </Badge>
          ))}
          <Separator className="my-2" />

          <Dialog>
            <DialogTrigger asChild>
              <div className="">
                <div className="flex items-center justify-between">
                  <h3>Модели</h3>
                  <FontAwesomeIcon icon={faChevronRight} className="h-6 px-2" />
                </div>
                <div className="flex w-full space-x-1 overflow-hidden">
                  {!!filters.brands.length &&
                    filters.brands.map((brand, i) => {
                      const modelsInBrand = brands.filter(
                        (x: any) => x.name === brand
                      ).models;
                      return (
                        <div
                          className="flex items-center px-1 space-x-1 text-sm rounded-xl text-nowrap flex-nowrap"
                          key={brand + i}
                        >
                          {filters.models.map((model) => {
                            return (
                              <div
                                className="flex items-center px-1 space-x-2 text-sm bg-pale rounded-xl text-nowrap flex-nowrap"
                                key={model}
                              >
                                {brand} {model}
                                <FontAwesomeIcon
                                  className="ml-1 text-gray"
                                  icon={faXmark}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    result({
                                      ...filters,
                                      models: [
                                        ...filters.models.filter(
                                          (x) => x !== model
                                        ),
                                      ],
                                      brands: [
                                        ...filters.brands.filter(
                                          (x) => x !== brand
                                        ),
                                      ],
                                    });
                                  }}
                                />
                              </div>
                            );
                          })}
                        </div>
                      );
                    })}
                </div>
              </div>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[1208px]">
              <div className="flex space-x-2 flex-nowrap">
                <input
                  className="w-full px-2 py-2 border border-gray rounded-xl focus-visible:outline-none"
                  type="text"
                  placeholder="Введите модель"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="grid items-start content-start justify-start h-full grid-cols-1 py-4 pb-16 pr-1 overflow-y-auto sm:pr-0 sm:grid-cols-3 ">
                <div
                  className="w-full p-1 text-xl font-semibold text-black cursor-pointer "
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
                </div>
                {filteredBrands.map((x: IBrands) => {
                  const title = x.name!;
                  const isActive = filters.brands.some((b) => b === title);
                  return (
                    <span
                      className={`cursor-pointer text-xl font-semibold text-black md:pr-12 ${
                        isActive ? "" : ""
                      }`}
                      key={title}
                    >
                      <span
                        // onClick={() =>
                        //   setFilters({
                        //     ...filters,
                        //     brands: isActive
                        //       ? filters.brands.filter((b) => b !== title)
                        //       : [...filters.brands, title],
                        //   })
                        // }
                        className={`p-1 font-semibold justify-between flex ${
                          isActive ? "" : ""
                        }`}
                      >
                        {title}
                        {/* {isActive && (
                                <FontAwesomeIcon
                                  icon={faCheck}
                                  className="cursor-pointer"
                                />
                              )} */}
                      </span>{" "}
                      {x.models!.map((model) => {
                        const isActiveModel = filters.models.some(
                          (b) => b === model
                        );
                        const isActiveBrand = filters.brands.some(
                          (b) => b === x.name
                        );
                        return (
                          <span
                            className={`cursor-pointer text-xl py-1 text-black  ${
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
                              className={`w-full font-normal text-gray px-1 flex gap-x-40 justify-between items-center ${
                                isActiveModel ? "" : ""
                              }`}
                            >
                              {model}
                              <div
                                className={`${
                                  isActiveModel
                                    ? "bg-yellow"
                                    : "border border-gray"
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
                        <FontAwesomeIcon
                          icon={faArrowLeft}
                          className="h-5 text-gray"
                        />
                      </div>
                    </div>
                    <div className="fixed bottom-0 left-0 flex justify-center w-full">
                      <div className="max-w-[800px] w-full flex justify-center bg-white border-t  border-pale px-4 py-4 space-x-2">
                        <div className="sm:max-w-[250px] w-full">
                          <Button>Выбрать</Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Separator className="my-2" />
          <h3>Расположение</h3>

          <Separator className="my-2" />
          <h3>Автопарк</h3>

          <Separator className="my-2" />
          <h3>Тип топлива</h3>
          <div className="flex flex-wrap gap-2">
            {[
              null,
              FuelType.Gasoline,
              FuelType.Electric,
              FuelType.Methane,
              FuelType.Propane,
            ].map((fuelType, i) => (
              <Badge
                key={`fuelType ${i}`}
                className={`${
                  filters.fuelType === fuelType
                    ? "bg-white shadow border border-pale"
                    : ""
                } cursor-pointer`}
                onClick={() => {
                  return result({
                    ...filters,
                    fuelType: filters.fuelType === fuelType ? null : fuelType,
                  });
                }}
              >
                {fuelType ? getFuelTypeDisplayName(fuelType) : "Любой"}
              </Badge>
            ))}
          </div>
          <Separator className="my-2" />
          <h3>Трансмиссия</h3>
          <div className="flex flex-wrap gap-2">
            {[null, TransmissionType.Automatic, TransmissionType.Mechanics].map(
              (transmissionType, i) => (
                <Badge
                  key={`transmissionType ${i}`}
                  className={`${
                    filters.transmissionType === transmissionType
                      ? "bg-white shadow border border-pale"
                      : ""
                  } cursor-pointer`}
                  onClick={() => {
                    return result({
                      ...filters,
                      transmissionType:
                        filters.transmissionType === transmissionType
                          ? null
                          : transmissionType,
                    });
                  }}
                >
                  {transmissionType
                    ? getTransmissionDisplayName(transmissionType)
                    : "Любая"}
                </Badge>
              )
            )}
          </div>
        </div>
      </div>
      <div className="fixed z-[52] left-0 bottom-0 px-4 py-4 w-full flex items-center justify-center  bg-white border-t  border-pale">
        <Button className="w-full " variant="default" onClick={() => close()}>
          Смотреть {count} объявления
        </Button>
      </div>
    </>
  );
};

import { useState } from "react";
import {
  CarClass,
  FuelType,
  IBrands,
  Metros,
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
import { faCheck, faXmark } from "@fortawesome/free-solid-svg-icons";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CarBrandFilter } from "./CarBrandFilter";
import Shewron from "./assets/shewron.svg";
import Xclose from "./assets/Xclose.svg";

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
  parksName,
  metros,
}: {
  filters: CarFilter;
  clean: () => void;
  result: (filters: CarFilter) => void;
  close: () => void;
  count: number;
  brands: IBrands;
  parksName: string[];
  metros: Metros[];
}) => {
  const [searchParkTerm, setSearchParkTerm] = useState("");
  const [searchMetroTerm, setsSearchMetroTerm] = useState("");
  const [overflow] = useState(false);

  const filteredMetros = metros.filter(
    (metro) =>
      metro.station &&
      metro.station.toLowerCase().includes(searchMetroTerm.toLowerCase())
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
        } fixed top-0 left-0 w-screen h-full bg-white z-[52] px-2 overflow-y-auto pb-20 `}
      >
        <div className=" w-full max-w-[352px] mx-auto  i grid grid-cols-3 font-normal items-center h-10 text-nowrap  whitespace-nowrap rounded-xl text-base font-regular  transition-colors focus:outline-none ">
          <img
            src={Xclose}
            alt=""
            className="h-[11px] text-gray"
            onClick={() => close()}
          />
          <div className="text-base font-semibold text-center">Фильтры</div>
          <div
            className="text-end text-gray text-[11px]"
            onClick={() => clean()}
          >
            Сбросить
          </div>
        </div>
        <Separator className="my-2 bg-pale" />
        <div className="my-2 space-x-2 overflow-scroll overflow-x-auto sm:flex scrollbar-hide">
          <h3 className="text-sm">Тип аренды</h3>
          <div className="flex gap-[6px]">
            {" "}
            {[undefined, false, true].map((buyoutPossible, i) => (
              <Badge
                key={`Buyout${i}`}
                className={`${
                  filters.buyoutPossible === buyoutPossible
                    ? "bg-white shadow border p-[7px] w-[74px] flex justify-center rounded-[8px] h-[27px] border-pale text-sm"
                    : "p-[7px] w-[74px] flex justify-center rounded-[8px] h-[27px] border-pale text-sm"
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
          </div>
          <Separator className="my-2 bg-pale" />
          <h3 className="text-sm">Цена</h3>
          <div className="space-y-2">
            {["asc", "desc"].map((sorting, i) => (
              <Badge
                key={`sorting ${i}`}
                className={` ${
                  filters.sorting === sorting
                    ? "bg-white shadow border p-[7px] w-[74px] flex justify-center rounded-[8px] h-[27px] border-pale text-sm"
                    : "p-[7px] w-[74px] flex justify-center rounded-[8px] h-[27px] border-pale text-sm"
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
          <Separator className="my-2 bg-pale" />
          <h3 className="text-sm">График аренды</h3>
          <div className="flex gap-[6px]">
            {[null, ...staticSchemas].map((schema, i) => (
              <Badge
                key={`schema ${i}`}
                className={`${
                  filters.schema === schema
                    ? "bg-white shadow border p-[7px] w-[74px] flex justify-center rounded-[8px] h-[27px] border-pale text-sm"
                    : "p-[7px] w-[74px] flex justify-center rounded-[8px] h-[27px] border-pale text-sm"
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
          </div>
          <Separator className="my-2 bg-pale" />
          <CarBrandFilter
            trigger={
              <div className="">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm">Модели</h3>
                  <img src={Shewron} alt="" className="h-[15px] px-2" />
                </div>
                <div className="flex w-full space-x-1 overflow-hidden">
                  {!!filters.brands.length &&
                    filters.brands.map((brand, i) => {
                      const isLastModelInBrand =
                        brands
                          .find((x: any) => x.name === brand)
                          ?.models.filter((x: string) =>
                            filters.models.includes(x)
                          ).length < 2;

                      return (
                        <div
                          className="flex items-center px-1 space-x-1 text-sm rounded-xl text-nowrap flex-nowrap"
                          key={brand + i}
                        >
                          {filters.models.map((model) => (
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
                                    brands: isLastModelInBrand
                                      ? [
                                          ...filters.brands.filter(
                                            (x) => x !== brand
                                          ),
                                        ]
                                      : [...filters.brands],
                                  });
                                }}
                              />
                            </div>
                          ))}
                        </div>
                      );
                    })}
                </div>
              </div>
            }
            brands={brands}
            filters={filters}
            result={(filters) => result(filters)}
          />
          <Separator className="my-2 bg-pale" />

          <Dialog>
            <DialogTrigger asChild>
              <div className="">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm">Расположение</h3>
                  <img src={Shewron} alt="" className="h-[15px] px-2" />
                </div>
                <div className="flex w-full space-x-1 overflow-hidden">
                  {!!filters.metros.length &&
                    filters.metros.map((metro) => (
                      <div
                        className="flex items-center px-1 space-x-2 text-sm bg-pale rounded-xl text-nowrap flex-nowrap"
                        key={metro}
                      >
                        {metro}
                        <FontAwesomeIcon
                          className="ml-1 text-gray"
                          icon={faXmark}
                          onClick={(e) => {
                            e.stopPropagation();
                            result({
                              ...filters,
                              metros: [
                                ...filters.metros.filter((x) => x !== metro),
                              ],
                            });
                          }}
                        />
                      </div>
                    ))}
                </div>
              </div>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[1208px]" ishiddenclose>
              <div className="absolute left-0 w-full h-0 top-3">
                <div className="mx-auto text-base font-semibold text-center w-fit">
                  Расположение - станции метро
                </div>
              </div>
              <div className="flex space-x-2 flex-nowrap">
                <input
                  className="w-full px-2 py-2 border border-gray rounded-xl focus-visible:outline-none"
                  type="text"
                  placeholder="Введите станцию"
                  value={searchMetroTerm}
                  onChange={(e) => setsSearchMetroTerm(e.target.value)}
                />
              </div>
              <div className="flex flex-wrap items-start content-start justify-start h-full py-4 pb-16 overflow-y-auto">
                {/* <div
                  className="flex justify-between w-full p-1 text-base text-black cursor-pointer"
                  onClick={() => {
                    result({
                      ...filters,
                      metros: [],
                    });
                    setSearchParkTerm("");
                  }}
                >
                  Все станции
                  <div
                    className={`${
                      !filters.metros.length
                        ? "bg-yellow"
                        : "border border-gray"
                    } w-6 h-6  p-1 flex items-center justify-center rounded-lg`}
                  >
                    {!filters.metros.length && (
                      <FontAwesomeIcon
                        icon={faCheck}
                        className="cursor-pointer"
                      />
                    )}
                  </div>
                </div>
                <Separator className="mt-1 bg-pale" /> */}
                {!!filteredMetros.length &&
                  filteredMetros.map((x) => {
                    const title = x!.station!;
                    const isActive = filters.metros.some((b) => b === title);
                    return (
                      <span
                        className={`cursor-pointer text-base w-full py-1 text-black `}
                        key={title}
                        onClick={() =>
                          result({
                            ...filters,
                            metros: isActive
                              ? filters.metros.filter((b) => b != title)
                              : [...filters.metros, title],
                          })
                        }
                      >
                        <span
                          className={`w-full p-1 rounded-xl flex justify-between ${
                            isActive ? "" : ""
                          }`}
                        >
                          <div className="flex items-center gap-1">
                            {x.colors!.map((color) => (
                              <div
                                style={{ backgroundColor: color }}
                                key={color}
                                className="w-[5px] h-[5px] rounded-full"
                              ></div>
                            ))}
                            <div>{title}</div>
                          </div>
                          <div
                            className={`${
                              isActive ? "bg-yellow" : "border border-gray"
                            } w-6 h-6  p-1 flex items-center justify-center rounded-lg`}
                          >
                            {isActive && (
                              <FontAwesomeIcon
                                icon={faCheck}
                                className="cursor-pointer"
                              />
                            )}
                          </div>
                        </span>
                        <Separator className="mt-1 bg-pale" />
                      </span>
                    );
                  })}
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <div className="">
                    <div className="absolute top-0 left-0 flex justify-center w-12">
                      <div className="max-w-[800px] w-full flex justify-center px-4 py-4 space-x-2">
                        <img
                          src={Xclose}
                          alt=""
                          className="h-[11px] text-gray"
                        />
                      </div>
                    </div>
                    <div className="fixed bottom-0 left-0 flex justify-center w-full">
                      <div className="max-w-[800px] w-full flex justify-center bg-white shadow-[-10px_-5px_20px_10px] shadow-white px-4 py-4 space-x-2">
                        <div className="sm:max-w-[250px] w-full">
                          <Button className="h-[42px] text-[13px] font-semibold ">
                            Применить
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Separator className="my-2 bg-pale" />
          <Dialog>
            <DialogTrigger asChild>
              <div className="">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm">Автопарк</h3>
                  <img src={Shewron} alt="" className="h-[15px] px-2" />
                </div>
                <div className="flex w-full space-x-1 overflow-hidden">
                  {!!filters.parksName.length &&
                    filters.parksName.map((park) => (
                      <div
                        className="flex items-center px-1 space-x-2 text-sm bg-pale rounded-xl text-nowrap flex-nowrap"
                        key={park}
                      >
                        {park}
                        <FontAwesomeIcon
                          className="ml-1 text-gray"
                          icon={faXmark}
                          onClick={(e) => {
                            e.stopPropagation();
                            result({
                              ...filters,
                              parksName: [
                                ...filters.parksName.filter((x) => x !== park),
                              ],
                            });
                          }}
                        />
                      </div>
                    ))}
                </div>
              </div>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[1208px]" ishiddenclose>
              <div className="absolute left-0 w-full h-0 top-2">
                <div className="mx-auto text-base font-semibold text-center w-fit">
                  Автопарки
                </div>
              </div>
              <div className="">
                <input
                  className="w-full px-2 py-2 border border-gray rounded-xl focus-visible:outline-none"
                  type="text"
                  placeholder="Поиск автопарка"
                  value={searchParkTerm}
                  onChange={(e) => setSearchParkTerm(e.target.value)}
                />
              </div>
              <div className="flex flex-wrap items-start content-start justify-start h-full py-4 pb-16 overflow-y-auto">
                <div
                  className="flex justify-between w-full p-1 text-base text-black cursor-pointer"
                  onClick={() => {
                    result({
                      ...filters,
                      parksName: [],
                    });
                    setSearchParkTerm("");
                  }}
                >
                  Все автопарки
                  <div
                    className={`${
                      !filters.parksName.length
                        ? "bg-yellow"
                        : "border border-gray"
                    } w-6 h-6  p-1 flex items-center justify-center rounded-lg`}
                  >
                    {!filters.parksName.length && (
                      <FontAwesomeIcon
                        icon={faCheck}
                        className="cursor-pointer"
                      />
                    )}
                  </div>
                </div>
                <Separator className="mt-1 bg-pale" />
                {filteredParks
                  .filter((x) => x)
                  .map((x) => {
                    const title = x!;
                    const isActive = filters.parksName.some((b) => b === title);
                    return (
                      <span
                        className={`cursor-pointer text-base w-full py-1 text-black `}
                        key={title}
                        onClick={() =>
                          result({
                            ...filters,
                            parksName: isActive
                              ? filters.parksName.filter((b) => b != title)
                              : [...filters.parksName, title],
                          })
                        }
                      >
                        <span
                          className={`w-full p-1 rounded-xl flex justify-between ${
                            isActive ? "" : ""
                          }`}
                        >
                          {title}
                          <div
                            className={`${
                              isActive ? "bg-yellow" : "border border-gray"
                            } w-6 h-6  p-1 flex items-center justify-center rounded-lg`}
                          >
                            {isActive && (
                              <FontAwesomeIcon
                                icon={faCheck}
                                className="cursor-pointer"
                              />
                            )}
                          </div>
                        </span>
                        <Separator className="mt-1 bg-pale" />
                      </span>
                    );
                  })}
              </div>

              <DialogFooter>
                <DialogClose asChild>
                  <div className="">
                    <div className="absolute top-0 left-0 flex justify-center w-12">
                      <div className="max-w-[800px] w-full flex justify-center px-4 py-4 space-x-2">
                        <img
                          src={Xclose}
                          alt=""
                          className="h-[11px] text-gray"
                        />
                      </div>
                    </div>
                    <div className="fixed bottom-0 left-0 flex justify-center w-full">
                      <div className="max-w-[800px] w-full flex justify-center bg-white shadow-[-10px_-5px_20px_10px] shadow-white px-4 py-4 space-x-2">
                        <div className="sm:max-w-[250px] w-full">
                          <Button className="h-[42px] text-[13px] font-semibold">
                            Применить
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Separator className="my-2 bg-pale" />
          <h3 className="text-sm">Тип топлива</h3>
          <div className="flex flex-wrap gap-[6px]">
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
                    ? "bg-white shadow border p-[7px] w-[74px] flex justify-center rounded-[8px] h-[27px] border-pale text-sm"
                    : "p-[7px] w-[74px] flex justify-center rounded-[8px] h-[27px] border-pale text-sm"
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
          <Separator className="my-2 bg-pale" />
          <h3 className="text-sm">Трансмиссия</h3>
          <div className="flex flex-wrap gap-[6px]">
            {[null, TransmissionType.Automatic, TransmissionType.Mechanics].map(
              (transmissionType, i) => (
                <Badge
                  key={`transmissionType ${i}`}
                  className={`${
                    filters.transmissionType === transmissionType
                      ? "bg-white shadow border p-[7px] w-[74px] flex justify-center rounded-[8px] h-[27px] border-pale text-sm"
                      : "p-[7px] w-[74px] flex justify-center rounded-[8px] h-[27px] border-pale text-sm"
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
      <div className="fixed z-[52] left-0 bottom-0 px-4 py-4 w-full flex items-center justify-center  bg-white shadow-[-10px_-5px_20px_10px] shadow-white">
        <Button
          className="w-full h-[42px] text-[13px] font-semibold"
          variant="default"
          onClick={() => close()}
        >
          Смотреть {count} объявления
        </Button>
      </div>
    </>
  );
};

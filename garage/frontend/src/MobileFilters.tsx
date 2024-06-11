import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
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
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  getFuelTypeDisplayName,
  getTransmissionDisplayName,
} from "@/lib/utils";

import { Badge } from "@/components/ui/badge";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRightArrowLeft,
  faCheck,
  faChevronDown,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import {
  faMap,
  faRectangleList,
  faTrashCan,
} from "@fortawesome/free-regular-svg-icons";
import { Separator } from "@/components/ui/separator";
const DEFAULT_COMMISSION_PERCENTAGE = 0;

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
}: {
  filters: CarFilter;
  clean: () => void;
  result: (filters: CarFilter) => void;
}) => {
  const [activeFilter, setActiveFilter] = useState<ActiveFilter | null>(null);
  const [brands, setBrands] = useState<IBrands>({ name: "", models: [] });
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
      <div className={`${overflow && "pt-10"}`}>
        <div className="my-2 space-x-1 overflow-scroll overflow-x-auto sm:flex scrollbar-hide">
          <h3>Тип аренды</h3>
          {[false, true, undefined].map((buyoutPossible, i) => (
            <Badge
              key={`Buyout${i}`}
              className={`${
                filters.buyoutPossible === buyoutPossible ? "bg-white" : ""
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
              {buyoutPossible && "Выкуп"}
              {buyoutPossible === false && "Аренда"}
              {buyoutPossible === undefined && "Любой тип аренды"}
            </Badge>
          ))}
          <h3>Цена</h3>
          {["asc", "desc"].map((sorting, i) => (
            <Badge
              key={`sorting ${i}`}
              className={` ${
                filters.sorting === sorting ? "bg-white" : ""
              } cursor-pointer`}
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
          <h3>График аренды</h3>
          {[null, ...staticSchemas].map((schema, i) => (
            <Badge
              key={`schema ${i}`}
              className={`${
                filters.schema === schema ? "bg-white" : ""
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
                : "Любой график аренды"}
            </Badge>
          ))}
          <h3>Модели</h3>

          <h3>Расположение</h3>

          <h3>Автопарк</h3>

          <h3>Тип топлива</h3>
          {[TransmissionType.Automatic, TransmissionType.Mechanics, null].map(
            (transmissionType, i) => (
              <Badge
                key={`transmissionType ${i}`}
                className={`${
                  filters.transmissionType === transmissionType
                    ? "bg-white"
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
                {getTransmissionDisplayName(transmissionType)}
              </Badge>
            )
          )}
          <h3>Трансмиссия</h3>
          {[
            FuelType.Gasoline,
            FuelType.Electric,
            FuelType.Methane,
            FuelType.Propane,
            null,
          ].map((fuelType, i) => (
            <Badge
              key={`fuelType ${i}`}
              className={`${
                filters.fuelType === fuelType ? "bg-white" : ""
              } cursor-pointer`}
              onClick={() => {
                return result({
                  ...filters,
                  fuelType: filters.fuelType === fuelType ? null : fuelType,
                });
              }}
            >
              {getFuelTypeDisplayName(fuelType)}
            </Badge>
          ))}
          <div className=" w-full max-w-[352px] mx-auto justify-between  fixed top-0 right-0 inline-flex font-normal items-center h-10 text-nowrap md:px-2 y whitespace-nowrap rounded-xl px-2.5 py-0.5 text-base font-regular  transition-colors focus:outline-none ">
            <FontAwesomeIcon
              className="ml-1 text-gray"
              icon={faXmark}
              onClick={(e) => {}}
            />
            <div className="">Фильтры</div>
            <div className="text-gray">Сбросить</div>
          </div>
        </div>
      </div>
    </>
  );
};

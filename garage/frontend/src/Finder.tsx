import { Button } from "@/components/ui/button";
import econom from "./assets/car_icons/econom.png";
import comfort from "./assets/car_icons/comfort.png";
import comfortPlus from "./assets/car_icons/comfort-plus.png";
import business from "./assets/car_icons/business.png";
import { useEffect, useState } from "react";

import {
  Body15,
  CarClass,
  Cars2,
  FuelType,
  Schemas,
  Schemas2,
  TransmissionType,
} from "./api-client";
// import { Slider } from "@/components/ui/slider";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card } from "./Card";
import { client } from "./backend";
import {
  getFuelTypeDisplayName,
  getTransmissionDisplayName,
} from "@/lib/utils";

import { useRecoilValue } from "recoil";
import { cityAtom } from "./atoms";
import { Badge } from "@/components/ui/badge";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRightArrowLeft,
  faTrashCan,
} from "@fortawesome/free-solid-svg-icons";
import { Separator } from "@/components/ui/separator";
const DEFAULT_COMMISSION_PERCENTAGE = 0;

type CarFilter = {
  brands: string[];
  carClass: CarClass[];
  commission: number | null;
  fuelType: FuelType | null;
  transmissionType: TransmissionType | null;
  selfEmployed: boolean;
  buyoutPossible: boolean;
  schema: Schemas2 | null;
  sorting: "asc" | "desc";
  car_vin: string | null;
};

enum ActiveFilter {
  FuelType = 1,
  TransmissionType = 2,
  RentTerm = 3,
  Sorting = 4,
}

const staticSchemas = [
  new Schemas({ working_days: 7, non_working_days: 0 }),
  new Schemas({ working_days: 6, non_working_days: 1 }),
  new Schemas({ working_days: 14, non_working_days: 1 }),
];

export const Finder = () => {
  const [filters, setFilters] = useState<CarFilter>({
    carClass: [],
    commission: DEFAULT_COMMISSION_PERCENTAGE,
    fuelType: null,
    brands: [],
    transmissionType: null,
    selfEmployed: false,
    buyoutPossible: false,
    sorting: "asc",
    schema: null,
    car_vin: null,
  });

  const [cars, setCars] = useState<Cars2[]>([]);
  const [activeFilter, setActiveFilter] = useState<ActiveFilter | null>(null);
  const [brands, setBrands] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const city = useRecoilValue(cityAtom);

  useEffect(() => {
    const getBrandList = async () => {
      const data = await client.getBrandList();

      setBrands(data.brands!);
    };

    getBrandList();
  }, []);

  useEffect(() => {
    const getCars = async () => {
      const data = await client.searchCars(
        new Body15({
          brand: filters.brands,
          city,
          fuel_type: filters.fuelType || undefined,
          transmission_type: filters.transmissionType || undefined,
          car_class: filters.carClass,
          limit: 50,
          offset: 0,
          sorting: filters.sorting,
          commission:
            filters.commission !== null ? filters.commission : undefined,
          self_employed: filters.selfEmployed,
          is_buyout_possible: filters.buyoutPossible,
          schemas: filters.schema || undefined,
          car_vin: filters.car_vin || undefined,
        })
      );

      setCars(data.cars!);
    };

    getCars();
  }, [filters, city]);

  // const debouncedCommission = useDebouncedCallback((value) => {
  //   setFilters({ ...filters, commission: value });
  // }, 300);

  const filtersClean = () => {
    setFilters({
      carClass: [],
      commission: DEFAULT_COMMISSION_PERCENTAGE,
      fuelType: null,
      brands: [],
      transmissionType: null,
      selfEmployed: false,
      buyoutPossible: false,
      sorting: "asc",
      schema: null,
      car_vin: null,
    });
  };

  const filteredBrands = brands.filter((brand) =>
    brand.toLowerCase().includes(searchTerm.toLowerCase())
  );
  useEffect(
    () =>
      setFilters({
        ...filters,
        car_vin: searchTerm,
      }),
    [searchTerm]
  );

  return (
    <>
      {/* <div onClick={() => navigate("login/driver")} className="fixed top-5 right-5">Войти</div> */}
      <div className="">
        <div className="flex justify-between mx-auto my-2 h-fit sm:justify-start">
          {[
            [CarClass.Economy, econom, "Эконом"],
            [CarClass.Comfort, comfort, "Комфорт"],
            [CarClass.ComfortPlus, comfortPlus, "Комфорт+"],
            [CarClass.Business, business, "Бизнес"],
          ].map((x) => {
            const [carClass, img, title] = x;
            const isActive = filters.carClass.includes(carClass as CarClass);

            return (
              <div
                key={carClass}
                className={`cursor-pointer w-20 flex flex-col items-center bg-white rounded-xl transition-all h-fit pb-2 ${
                  isActive ? "shadow border-2 border-yellow" : " scale-90"
                }`}
              >
                <img
                  alt=""
                  className="w-12 rounded-xl"
                  onClick={() =>
                    setFilters({
                      ...filters,
                      carClass: isActive
                        ? filters.carClass.filter((c) => c != carClass)
                        : [...filters.carClass, carClass as CarClass],
                    })
                  }
                  src={img}
                />
                <span className="text-xs font-bold text-gray">{title}</span>
              </div>
            );
          })}
        </div>
        <div className="flex my-2 space-x-1 overflow-scroll overflow-x-auto scrollbar-hide">
          {[
            {
              title: (
                <FontAwesomeIcon
                  icon={faArrowRightArrowLeft}
                  className="px-1 rotate-90 cursor-pointer"
                />
              ),
              filter: ActiveFilter.Sorting,
              isEngaged: filters.sorting === "desc",
            },
            {
              title: filters.schema
                ? `${filters.schema?.working_days}/${filters.schema?.non_working_days}`
                : "Любой график аренды",
              filter: ActiveFilter.RentTerm,
              isEngaged: filters.schema !== null,
            },
            { isEngaged: !!filters.brands.length },

            {
              title: getTransmissionDisplayName(filters.transmissionType),
              filter: ActiveFilter.TransmissionType,
              isEngaged: filters.transmissionType !== null,
            },
            {
              title: getFuelTypeDisplayName(filters.fuelType),
              filter: ActiveFilter.FuelType,
              isEngaged: filters.fuelType !== null,
            },
          ].map(({ filter, title, isEngaged }, i) => (
            <div className="relative" key={`filters ${i}`}>
              {isEngaged && (
                <div className="absolute top-0 right-0 w-1.5 h-1.5 rounded-full  bg-red"></div>
              )}
              {!!filter && (
                <div className="cursor-pointer">
                  <Badge
                    className={`${activeFilter === filter ? "bg-white" : ""} `}
                    onClick={() =>
                      setActiveFilter(activeFilter === filter ? null : filter)
                    }
                  >
                    {title}
                  </Badge>
                </div>
              )}

              {!filter && (
                <Dialog>
                  <DialogTrigger asChild>
                    <span className="bg-grey cursor-pointer text-nowrap whitespace-nowrap rounded-xl px-2.5 py-0.5 h-10 flex items-center">
                      {filters.brands.length > 3 &&
                        `${filters.brands.slice(0, 3).join(", ")} и еще ${
                          filters.brands.length - 3
                        }`}
                      {!!filters.brands.length &&
                        filters.brands.length <= 3 &&
                        `${filters.brands.join(", ")}`}
                      {!filters.brands.length && "Все марки"}
                    </span>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[800px]">
                    <DialogHeader>
                      <DialogTitle>Марка автомобиля</DialogTitle>
                    </DialogHeader>
                    <div className="">
                      <input
                        className="w-full px-2 py-2 border-2 border-yellow rounded-xl focus-visible:outline-none"
                        type="text"
                        placeholder="Поиск"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    <div className="flex flex-wrap items-start content-start justify-start h-full py-4 overflow-y-scroll ">
                      {filteredBrands.map((x: string) => {
                        const title = x;
                        const isActive = filters.brands.some(
                          (b) => b === title
                        );

                        return (
                          <span
                            className={`cursor-pointer text-xl font-bold w-full py-2 ${
                              isActive ? "text-black" : "text-zinc-500"
                            }`}
                            key={title}
                            onClick={() =>
                              setFilters({
                                ...filters,
                                brands: isActive
                                  ? filters.brands.filter((b) => b != title)
                                  : [...filters.brands, title],
                              })
                            }
                          >
                            {title} <Separator className="mt-1" />
                          </span>
                        );
                      })}
                    </div>

                    <DialogFooter>
                      <DialogClose asChild>
                        <div className="fixed bottom-0 left-0 flex justify-center w-full">
                          <div className="max-w-[800px] w-full flex justify-center bg-white border-t  border-pale px-4 py-4 space-x-2">
                            <div className="sm:max-w-[250px] w-full">
                              <Button>Выбрать</Button>
                            </div>
                          </div>
                        </div>
                      </DialogClose>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              )}
            </div>
          ))}
          {/* <Dialog>
            <DialogTrigger asChild>
              <div className="bg-grey text-nowrap rounded-xl px-2.5 py-0.5 h-10 flex items-center relative">
                {(filters.buyoutPossible ||
                  !!filters.commission ||
                  filters.selfEmployed) && (
                  <div className="absolute top-0 right-0 w-1.5 h-1.5 rounded-full  bg-red"></div>
                )}
                Еще
              </div>
            </DialogTrigger>
            <DialogContent>
              <Checkbox
                title="Для самозанятых"
                isChecked={filters.selfEmployed}
                onCheckedChange={(e: boolean) =>
                  setFilters({ ...filters, selfEmployed: e })
                }
              />
              <Separator className="mb-4" />
              <Checkbox
                isChecked={filters.buyoutPossible}
                onCheckedChange={(e: boolean) =>
                  setFilters({ ...filters, buyoutPossible: e })
                }
                title="Выкуп автомобиля"
              />
              <Separator className="mb-4" />
              <p className="mb-4 text-xl font-semibold">Комиссия</p>
              {[null, 1, 2, 3, 4, 5, 10].map((x, i) => (
                <Checkbox
                  key={`comission${i}`}
                  regular
                  isChecked={filters.commission === x}
                  onCheckedChange={() =>
                    setFilters({ ...filters, commission: x })
                  }
                  title={x ? `${x}%` : "Нет"}
                />
              ))}
              <DialogFooter>
                <DialogClose asChild>
                  <div className="fixed bottom-0 left-0 flex justify-center w-full px-4 py-4 space-x-2 bg-white border-t border-pale">
                    <Button>Выбрать</Button>
                  </div>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog> */}
          <div className="cursor-pointer inline-flex items-center h-10 text-nowrap active:bg-white whitespace-nowrap rounded-xl px-2.5 py-0.5 text-base font-regular text-black transition-colors focus:outline-none bg-grey">
            <FontAwesomeIcon
              onClick={filtersClean}
              icon={faTrashCan}
              className="px-1"
            />
          </div>
        </div>
        <div className="flex my-2 mb-4 space-x-1 overflow-scroll overflow-x-auto scrollbar-hide">
          {activeFilter === ActiveFilter.Sorting &&
            ["asc", "desc"].map((sorting, i) => (
              <Badge
                key={`sorting ${i}`}
                className={`${
                  filters.sorting === sorting ? "bg-white" : ""
                } cursor-pointer`}
                onClick={() =>
                  setFilters({
                    ...filters,
                    sorting: sorting as CarFilter["sorting"],
                  })
                }
              >
                {sorting === "asc" && "Сначала самые дешевые"}
                {sorting === "desc" && "Сначала самые дорогие"}
              </Badge>
            ))}
          {activeFilter === ActiveFilter.RentTerm &&
            [null, ...staticSchemas].map((schema, i) => (
              <Badge
                key={`schema ${i}`}
                className={`${
                  filters.schema === schema ? "bg-white" : ""
                } cursor-pointer`}
                onClick={() => {
                  return setFilters({
                    ...filters,
                    schema,
                  });
                }}
              >
                {schema
                  ? `${schema?.working_days}/${schema?.non_working_days}`
                  : "Любой график аренды"}
              </Badge>
            ))}
          {activeFilter === ActiveFilter.TransmissionType &&
            [TransmissionType.Automatic, TransmissionType.Mechanics, null].map(
              (transmissionType, i) => (
                <Badge
                  key={`transmissionType ${i}`}
                  className={`${
                    filters.transmissionType === transmissionType
                      ? "bg-white"
                      : ""
                  } cursor-pointer`}
                  onClick={() => {
                    return setFilters({
                      ...filters,
                      transmissionType,
                    });
                  }}
                >
                  {getTransmissionDisplayName(transmissionType)}
                </Badge>
              )
            )}
          {activeFilter === ActiveFilter.FuelType &&
            [FuelType.Gasoline, FuelType.Gas, null].map((fuelType, i) => (
              <Badge
                key={`fuelType ${i}`}
                className={`${
                  filters.fuelType === fuelType ? "bg-white" : ""
                } cursor-pointer`}
                onClick={() => {
                  return setFilters({
                    ...filters,
                    fuelType,
                  });
                }}
              >
                {getFuelTypeDisplayName(fuelType)}
              </Badge>
            ))}
        </div>
        {/* <div className="pb-8 my-4 mb-4 space-y-2 border-b border-gray/20">
          <Label>Комиссия парка не выше {filters.commission}%</Label>
          <Slider
            onValueChange={(e) => debouncedCommission(e[0])}
            defaultValue={[DEFAULT_COMMISSION_PERCENTAGE]}
            max={10}
            step={0.1}
          />
        </div> */}
        {/* <Button variant="outline">Сбросить фильтры</Button> */}
        <div className="flex flex-wrap gap-2 md:justify-start ">
          {cars.map((car) => {
            return <Card key={car.id} car={car} />;
          })}
        </div>
      </div>
    </>
  );
};

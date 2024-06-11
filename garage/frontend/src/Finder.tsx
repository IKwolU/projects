import { Button } from "@/components/ui/button";
import econom from "./assets/car_icons/econom.png";
import comfort from "./assets/car_icons/comfort.png";
import comfortPlus from "./assets/car_icons/comfort-plus.png";
import allClasses from "./assets/car_icons/all-cars.png";
import filtersIcon from "./assets/filters_icon.svg";
import business from "./assets/car_icons/business.png";
import { useEffect, useRef, useState } from "react";
import OnMap from "@/components/ui/on-map";
import { useLocation } from "react-router-dom";
import {
  Avito_ids,
  Body15,
  Brands,
  CarClass,
  Cars3,
  FuelType,
  IBrands,
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
  faArrowLeft,
  faArrowRightArrowLeft,
  faCheck,
  faChevronDown,
  faListUl,
  faMagnifyingGlass,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import {
  faMap,
  faRectangleList,
  faTrashCan,
} from "@fortawesome/free-regular-svg-icons";
import { Separator } from "@/components/ui/separator";
import { CardV2 } from "./CardV2";
import { MobileFilters } from "./MobileFilters";
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

export const Finder = () => {
  const [filters, setFilters] = useState<CarFilter>({
    carClass: [],
    commission: DEFAULT_COMMISSION_PERCENTAGE,
    fuelType: null,
    brands: [],
    models: [],
    parksName: [],
    transmissionType: null,
    selfEmployed: false,
    buyoutPossible: undefined,
    sorting: "asc",
    schema: null,
    carVin: null,
    onMap: false,
    notStackList: undefined,
  });

  const [cars, setCars] = useState<Cars3[]>([]);
  const [activeFilter, setActiveFilter] = useState<ActiveFilter | null>(null);
  const [brands, setBrands] = useState<IBrands>({ name: "", models: [] });
  const [parksName, setParksName] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchTermStart, setSearchTermStart] = useState("");
  const [searchParkTerm, setSearchParkTerm] = useState("");
  const [overflow, setOverflow] = useState(false);
  const [isFiltersOpened, setIsFiltersOpened] = useState(false);
  const [scrollToElement, setScrollToElement] = useState<HTMLElement | null>(
    null
  );

  const location = useLocation();
  const [avitoIds, setAvitoIds] = useState<Avito_ids[]>([]);
  const randomTest = useRef(Math.floor(Math.random() * 2));

  const city = useRecoilValue(cityAtom);

  useEffect(() => {
    const getFinderFilterData = async () => {
      const data = await client.getFinderFilterData();
      setBrands(data.brands!);
      setParksName(data.parks!);
      setAvitoIds(data.avito_ids!);
    };

    getFinderFilterData();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const parkName = params.get("park_name");

    if (parkName !== null) {
      const avitoIdParkName = avitoIds?.find(
        (x) => x.avito_id === String(parkName)
      )?.park;

      if (avitoIdParkName) {
        setFilters({
          ...filters,
          parksName: [avitoIdParkName],
        });
      }
    }

    const brand = sessionStorage.getItem("car_brand");
    const model = sessionStorage.getItem("car_model");
    const carPark = sessionStorage.getItem("car_park");
    if (brand && model && carPark) {
      setFilters({
        ...filters,
        brands: [brand],
        models: [model],
        parksName: [carPark],
      });
    }
  }, [avitoIds]);

  useEffect(() => {
    const getCars = async () => {
      const data = await client.searchCars(
        new Body15({
          brand: filters.brands,
          model: filters.models,
          park_name: filters.parksName,
          city,
          fuel_type: filters.fuelType || undefined,
          transmission_type: filters.transmissionType || undefined,
          car_class: filters.carClass,
          limit: 1000,
          offset: 0,
          sorting: filters.sorting,
          commission:
            filters.commission !== null ? filters.commission : undefined,
          self_employed: filters.selfEmployed,
          is_buyout_possible: filters.buyoutPossible,
          schemas: filters.schema || undefined,
          car_vin: filters.carVin || undefined,
          not_stack_list: ["division_id"],
        })
      );

      setCars(data.cars!);
      if (filters.brands.length > 0) {
        sessionStorage.clear();
      }
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
      models: [],
      parksName: [],
      transmissionType: null,
      selfEmployed: false,
      buyoutPossible: undefined,
      sorting: "asc",
      schema: null,
      carVin: null,
      onMap: false,
      notStackList: undefined,
    });
  };

  const brandsArray = Object.values(brands);

  const filteredBrands = brandsArray.filter(
    (brand: Brands) =>
      brand.name && brand.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSearch = () => {
    setSearchTerm(searchTermStart);
  };

  const filteredParks = parksName.filter(
    (name: string) =>
      name && name.toLowerCase().includes(searchParkTerm.toLowerCase())
  );

  useEffect(
    () =>
      setFilters({
        ...filters,
        carVin: searchParkTerm,
      }),
    [searchParkTerm]
  );

  useEffect(() => {
    if (filters.carClass.length === Object.keys(CarClass).length) {
      setFilters({
        ...filters,
        carClass: [],
      });
    }
  }, [filters]);

  useEffect(() => {
    if (scrollToElement) {
      scrollToElement.scrollIntoView();
    }
  }, [scrollToElement]);

  const handleOpenModal = (id: string) => {
    setOverflow(!overflow);
    if (overflow) {
      setScrollToElement(document.getElementById(id));
    }
  };

  return (
    <>
      {isFiltersOpened && (
        <MobileFilters
          filters={filters}
          clean={() => filtersClean()}
          result={(result) => setFilters(result)}
        />
      )}
      {!filters.onMap && (
        <div className="fixed w-full h-0 z-[51] max-w-[352px] mx-auto bottom-14 flex justify-start sm:hidden">
          <Button
            onClick={() => {
              setFilters({
                ...filters,
                onMap: !filters.onMap,
              });
            }}
            className="w-24 h-10 pl-2 bg-white shadow-md shadow-gray"
          >
            <div className="flex items-center justify-start w-full mx-auto space-x-0 text-sm font-semibold">
              <FontAwesomeIcon icon={faMap} className="h-4 mr-2" />
              <span>Карта</span>
            </div>
          </Button>
        </div>
      )}
      <div className="absolute w-full h-0 max-w-[352px] mx-auto top-12  flex justify-end sm:hidden">
        <Dialog>
          <DialogTrigger asChild>
            <div
              className={`absolute right-0 flex items-center justify-between w-2/3 p-2 space-x-1 top-5 h-7 ${
                filters.brands.length ? "" : "bg-grey"
              }  rounded-xl`}
            >
              <FontAwesomeIcon
                icon={faMagnifyingGlass}
                className={`h-3 text-gray ${
                  filters.brands.length ? "hidden" : ""
                }`}
              />
              <div className="flex w-full space-x-1 overflow-hidden">
                {!!filters.brands.length &&
                  filters.brands.map((brand) => (
                    <div
                      className="flex items-center px-1 space-x-1 text-sm rounded-xl text-nowrap flex-nowrap"
                      key={brand}
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
                              setFilters({
                                ...filters,
                                models: [
                                  ...filters.models.filter((x) => x !== model),
                                ],
                                brands: [
                                  ...filters.brands.filter((x) => x !== brand),
                                ],
                              });
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  ))}
                {!filters.brands.length && (
                  <div className="px-2 text-gray">Введите модель</div>
                )}
              </div>
              <img
                src={filtersIcon}
                alt=""
                onClick={(e) => {
                  e.stopPropagation();
                  setIsFiltersOpened(true);
                }}
              />
            </div>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[1208px]">
            <div className="flex space-x-2 flex-nowrap">
              <input
                className="w-full px-2 py-2 border border-gray rounded-xl focus-visible:outline-none"
                type="text"
                placeholder="Введите модель"
                value={searchTermStart}
                onChange={(e) => setSearchTermStart(e.target.value)}
              />
              <FontAwesomeIcon
                onClick={() => handleSearch()}
                icon={faMagnifyingGlass}
                className="h-3 p-4 text-gray bg-pale rounded-xl"
              />
            </div>
            <div className="grid items-start content-start justify-start h-full grid-cols-1 py-4 pb-16 pr-1 overflow-y-auto sm:pr-0 sm:grid-cols-3 ">
              <div
                className="w-full p-1 text-xl font-semibold text-black cursor-pointer "
                onClick={() => {
                  setFilters({
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
                      return (
                        <span
                          className={`cursor-pointer text-xl py-1 text-black  ${
                            isActiveModel ? "" : ""
                          }`}
                          key={model}
                          onClick={() =>
                            setFilters({
                              ...filters,
                              models: isActiveModel
                                ? filters.models.filter((b) => b != model)
                                : [...filters.models, model],
                              brands: isActiveModel
                                ? filters.brands.filter((b) => b != x.name)!
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
      </div>
      {/* <div onClick={() => navigate("login/driver")} className="fixed top-5 right-5">Войти</div> */}
      <div className={`${overflow && "pt-10"}`}>
        <div className="flex my-2 space-x-1">
          <div
            onClick={() =>
              setFilters({
                ...filters,
                carClass: [],
              })
            }
            className={`cursor-pointer w-24 flex flex-col items-center bg-grey rounded-xl ${
              // isActive ? "shadow border-2 border-gray" : ""
              filters.carClass.length === 0 ? "bg-white shadow" : "bg-grey"
            }`}
          >
            <img
              alt=""
              className="w-12 rounded-xl"
              style={{ margin: "-4px" }}
              src={allClasses}
            />
            <span
              className="pb-2 text-[10px] sm:text-base text-black"
              style={{ margin: "-8px" }}
            >
              Все тарифы
            </span>
          </div>
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
                onClick={() =>
                  setFilters({
                    ...filters,
                    carClass: isActive
                      ? filters.carClass.filter((c) => c != carClass)
                      : [...filters.carClass, carClass as CarClass],
                  })
                }
                key={carClass}
                className={`cursor-pointer w-24 flex flex-col items-center bg-grey rounded-xl ${
                  // isActive ? "shadow border-2 border-gray" : ""
                  isActive ? "bg-white shadow" : "bg-grey"
                }`}
              >
                <img
                  alt=""
                  className="w-12 rounded-xl"
                  style={{ margin: "-4px" }}
                  src={img}
                />
                <span
                  className="pb-2 text-black text-[10px] sm:text-base"
                  style={{ margin: "-8px" }}
                >
                  {title}
                </span>
              </div>
            );
          })}
        </div>
        <div className="hidden my-2 space-x-1 overflow-scroll overflow-x-auto sm:flex scrollbar-hide">
          <div className="relative bg-grey cursor-pointer text-nowrap whitespace-nowrap rounded-xl px-2.5 py-0.5 h-10 flex items-center md:px-2">
            <span
              className=""
              onClick={() => {
                setFilters({
                  ...filters,
                  onMap: !filters.onMap,
                });
              }}
            >
              {!filters.onMap && (
                <>
                  <FontAwesomeIcon icon={faMap} className="mr-2" />
                  <span>На карте</span>
                </>
              )}
              {filters.onMap && (
                <>
                  <FontAwesomeIcon icon={faRectangleList} className="mr-2" />
                  <span>Списком</span>
                </>
              )}
            </span>
          </div>
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
              title:
                filters.buyoutPossible !== undefined
                  ? filters.buyoutPossible
                    ? "Выкуп"
                    : "Аренда"
                  : "Тип аренды",
              filter: ActiveFilter.Buyout,
              isEngaged: filters.buyoutPossible !== undefined,
            },
            {
              title: filters.schema
                ? `${filters.schema?.working_days}/${filters.schema?.non_working_days}`
                : "График аренды",
              filter: ActiveFilter.RentTerm,
              isEngaged: filters.schema !== null,
            },
            { isEngaged: !!filters.brands!.length },

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
                <div className="cursor-pointer ">
                  <Badge
                    className={`${
                      activeFilter === filter ? "bg-white" : ""
                    } md:px-2`}
                    onClick={() =>
                      setActiveFilter(activeFilter === filter ? null : filter)
                    }
                  >
                    {title}{" "}
                    {filter !== ActiveFilter.Sorting && (
                      <FontAwesomeIcon
                        icon={faChevronDown}
                        className={`ml-2 transition-transform ${
                          activeFilter === filter && "rotate-180"
                        }`}
                      />
                    )}
                  </Badge>
                </div>
              )}

              {!filter && (
                <Dialog>
                  <DialogTrigger asChild>
                    <span className="bg-grey cursor-pointer text-nowrap whitespace-nowrap rounded-xl px-2.5 py-0.5 h-10 flex items-center md:px-2">
                      {filters.brands.length > 1 && (
                        <>
                          {filters.brands.slice(0, 1).join(", ")} и еще{" "}
                          {filters.brands.length - 1}
                          <FontAwesomeIcon
                            icon={faChevronDown}
                            className="ml-2"
                          />
                        </>
                      )}
                      {!!filters.brands.length &&
                        filters.brands.length === 1 && (
                          <>
                            {filters.brands.join(", ")}
                            <FontAwesomeIcon
                              icon={faChevronDown}
                              className="ml-2"
                            />
                          </>
                        )}
                      {!filters.brands.length && (
                        <>
                          Модели{" "}
                          <FontAwesomeIcon
                            icon={faChevronDown}
                            className="ml-2"
                          />
                        </>
                      )}
                    </span>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[1208px]">
                    <div className="">
                      <input
                        className="w-full px-2 py-2 border-2 border-yellow rounded-xl focus-visible:outline-none"
                        type="text"
                        placeholder="Поиск модели"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    <div className="grid items-start content-start justify-start h-full py-4 pb-16 overflow-y-auto grid-ciols-1 sm:grid-cols-3 ">
                      <div
                        className="w-full p-1 text-xl font-semibold text-black cursor-pointer "
                        onClick={() => {
                          setFilters({
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
                        const isActive = filters.brands.some(
                          (b) => b === title
                        );
                        return (
                          <span
                            className={`cursor-pointer text-xl font-semibold text-black md:pr-12 ${
                              isActive ? "" : ""
                            }`}
                            key={title}
                          >
                            <span
                              onClick={() =>
                                setFilters({
                                  ...filters,
                                  brands: isActive
                                    ? filters.brands.filter((b) => b !== title)
                                    : [...filters.brands, title],
                                })
                              }
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
                              return (
                                <span
                                  className={`cursor-pointer text-xl py-1 text-black  ${
                                    isActiveModel ? "" : ""
                                  }`}
                                  key={model}
                                  onClick={() =>
                                    setFilters({
                                      ...filters,
                                      models: isActiveModel
                                        ? filters.models.filter(
                                            (b) => b != model
                                          )
                                        : [...filters.models, model],
                                    })
                                  }
                                >
                                  <span
                                    className={`w-full font-normal text-base p-1 flex gap-x-40 justify-between items-center ${
                                      isActiveModel ? "bg-pale" : ""
                                    }`}
                                  >
                                    {model}
                                    {isActiveModel && (
                                      <FontAwesomeIcon
                                        icon={faCheck}
                                        className="cursor-pointer"
                                      />
                                    )}
                                  </span>
                                </span>
                              );
                            })}
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
          <Dialog>
            <DialogTrigger asChild>
              <span className="relative bg-grey cursor-pointer text-nowrap whitespace-nowrap rounded-xl px-2.5 py-0.5 h-10 flex items-center md:px-2">
                {filters.parksName.length > 1 && (
                  <>
                    {filters.parksName.slice(0, 1).join(", ")} и еще{" "}
                    {filters.parksName.length - 1}
                    <FontAwesomeIcon icon={faChevronDown} className="ml-2" />
                  </>
                )}

                {!!filters.parksName.length && (
                  <div className="absolute top-0 right-0 w-1.5 h-1.5 rounded-full  bg-red"></div>
                )}
                {!!filters.parksName.length &&
                  filters.parksName.length === 1 && (
                    <>
                      {filters.parksName.join(", ")}
                      <FontAwesomeIcon icon={faChevronDown} className="ml-2" />
                    </>
                  )}
                {!filters.parksName.length && (
                  <>
                    Автопарк
                    <FontAwesomeIcon icon={faChevronDown} className="ml-2" />
                  </>
                )}
              </span>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[800px]">
              <DialogHeader>
                <DialogTitle></DialogTitle>
              </DialogHeader>
              <div className="">
                <input
                  className="w-full px-2 py-2 border-2 border-yellow rounded-xl focus-visible:outline-none"
                  type="text"
                  placeholder="Поиск автопарка"
                  value={searchParkTerm}
                  onChange={(e) => setSearchParkTerm(e.target.value)}
                />
              </div>
              <div className="flex flex-wrap items-start content-start justify-start h-full py-4 pb-16 overflow-y-auto">
                <div
                  className="w-full p-1 text-xl text-black cursor-pointer"
                  onClick={() => {
                    setFilters({
                      ...filters,
                      parksName: [],
                    });
                    setSearchParkTerm("");
                  }}
                >
                  Все автопарки
                </div>
                <Separator className="mt-1" />
                {filteredParks
                  .filter((x) => x)
                  .map((x) => {
                    const title = x!;
                    const isActive = filters.parksName.some((b) => b === title);
                    return (
                      <span
                        className={`cursor-pointer text-xl w-full py-1 text-black `}
                        key={title}
                        onClick={() =>
                          setFilters({
                            ...filters,
                            parksName: isActive
                              ? filters.parksName.filter((b) => b != title)
                              : [...filters.parksName, title],
                          })
                        }
                      >
                        <span
                          className={`w-full p-1 rounded-xl flex justify-start ${
                            isActive ? "" : "ml-[49.5px]"
                          }`}
                        >
                          {" "}
                          {isActive && (
                            <FontAwesomeIcon
                              icon={faCheck}
                              className="px-1 mr-6 cursor-pointer"
                            />
                          )}
                          {title}
                        </span>{" "}
                        <Separator className="mt-1" />
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
          <div className="cursor-pointer inline-flex font-normal items-center h-10 text-nowrap md:px-2 y whitespace-nowrap rounded-xl px-2.5 py-0.5 text-base font-regular  transition-colors focus:outline-none bg-grey active:bg-white">
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
                className={` ${
                  filters.sorting === sorting ? "bg-white" : ""
                } cursor-pointer`}
                onClick={() =>
                  setFilters({
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
                    schema: filters.schema === schema ? null : schema,
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
          {activeFilter === ActiveFilter.Buyout &&
            [false, true, undefined].map((buyoutPossible, i) => (
              <Badge
                key={`Buyout${i}`}
                className={`${
                  filters.buyoutPossible === buyoutPossible ? "bg-white" : ""
                } cursor-pointer`}
                onClick={() => {
                  setFilters({
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
          {activeFilter === ActiveFilter.FuelType &&
            [
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
                  return setFilters({
                    ...filters,
                    fuelType: filters.fuelType === fuelType ? null : fuelType,
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
        <div
          className="h-full mb-4"
          onClick={() => {
            !filters.onMap &&
              setFilters({
                ...filters,
                onMap: true,
              });
          }}
          onTouchStart={() => {
            !filters.onMap &&
              setFilters({
                ...filters,
                onMap: true,
              });
          }}
        >
          <OnMap
            filters={filters}
            close={() =>
              setFilters({
                ...filters,
                onMap: false,
              })
            }
          />
        </div>
        {!filters.onMap && (
          <div
            className={`grid content-center grid-cols-1 ${
              overflow ? "overflow-y-hidden h-[500px]" : ""
            } md:gap-4 md:grid-cols-2 lg:grid-cols-3`}
          >
            {cars.map((car) => (
              <div className="" id={String(car.id)} key={car.id}>
                {!randomTest.current && (
                  <div className="sm:hidden">
                    <CardV2
                      car={car}
                      open={() => handleOpenModal(String(car.id))}
                    />
                  </div>
                )}

                <div className={`${!randomTest.current && "sm:block hidden"}`}>
                  <Card
                    open={() => handleOpenModal(String(car.id))}
                    car={car}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

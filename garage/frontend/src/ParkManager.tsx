import { useState, useEffect } from "react";
import { useRecoilState } from "recoil";
import {
  UserType,
  IPark2,
  Divisions2,
  Tariffs,
  IRent_terms,
  Body,
  Cars,
  Body3,
  Body5,
  Body6,
  Division3,
  IDivisions2,
  DayOfWeek,
  IBody5,
  CarClass,
  IRent_term,
  IBody3,
} from "./api-client";
import { cityAtom, userAtom } from "./atoms";
import { client } from "./backend";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { DialogFooter } from "@/components/ui/dialog";
import PhoneInput from "@/components/ui/phone-input";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogClose,
} from "@/components/ui/dialog";
import { Link, Navigate, Route, Routes } from "react-router-dom";
import Confirmation from "@/components/ui/confirmation";
import { CityPicker } from "./CityPicker";
import { getCarClassDisplayName, getDayOfWeekDisplayName } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type VariantItem = { name: string; id: number | null };
type MainMenuItem = {
  name: string;
  path: string;
};

export const ParkManager = () => {
  const [user] = useRecoilState(userAtom);
  const [city] = useRecoilState(cityAtom);
  const [park, setPark] = useState<IPark2 | undefined>();
  const [parkInfo, setParkInfo] = useState<IPark2 | undefined>();
  const [newDivisionPhone, setNewDivisionPhone] = useState("");
  const [newDivision, setNewDivision] = useState<IBody3>({
    city: city,
    coords: "",
    address: "",
    metro: "",
    name: "",
    phone: "",
    timezone_difference: 3,
    working_hours: [],
  });
  const [newTariff, setNewTariff] = useState<IBody5>({
    class: 0,
    city: "",
    has_caused_accident: false,
    experience: 0,
    max_fine_count: 999,
    abandoned_car: false,
    min_scoring: 0,
    is_north_caucasus: false,
    criminal_ids: [],
    alcohol: false,
  });
  const [newRentTerm, setNewRentTerm] = useState({
    deposit_amount_daily: 0,
    deposit_amount_total: 0,
    is_buyout_possible: false,
    name: "",
    minimum_period_days: 0,
    schemas: [{ id: 0, daily_amount: 0, non_working_days: 0, working_days: 0 }],
  });
  const [isKeyShowed, setIsKeyShowed] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState<VariantItem>({
    name: "park",
    id: null,
  });

  useEffect(() => {
    if (user.user_type === UserType.Manager) {
      const getPark = async () => {
        const parkData: IPark2 = await client.getParkManager();
        setPark(parkData.park);
        setParkInfo({
          ...parkData.park,
          commission: parkData.park?.commission || 0,
          about: parkData.park?.about || "",
          url: parkData.park?.url || "",
          self_employed_discount: parkData.park?.self_employed_discount || 0,
        });
      };

      getPark();
    }
  }, []);

  const createDivision = async ({ ...newDivision }: IBody3) => {
    const newDivisionData = await client.createParkDivision(
      new Body3({
        ...newDivision,
      })
    );
    setPark({
      ...park,

      divisions: [
        ...divisions,
        {
          ...newDivision,
          id: newDivisionData.id,
        },
      ],
    });
  };

  const createTariff = async ({ ...newTariff }: IBody5) => {
    const newTariffData = await client.createTariff(
      new Body5({
        ...newTariff,
      })
    );
    setPark({
      ...park,

      tariffs: [
        ...tariffs,

        {
          ...newTariff,
          id: newTariffData.id,
        },
      ],
    });
  };

  const upsertRentTerm = async ({ ...newRentTerm }: IRent_term) => {
    const newTariffData = await client.createOrUpdateRentTerm(
      new Body6({ ...newRentTerm })
    );

    setPark({
      ...park,
      rent_terms: [
        ...rentTerms.filter((rent_term) =>
          newRentTerm.rent_term_id
            ? rent_term.id !== newRentTerm.rent_term_id
            : rent_term
        ),
        {
          ...newRentTerm,
          id: newTariffData.id,
        },
      ],
    });
  };

  const updateParkInfo = async () => {
    {
      await client.updateParkInfo(
        new Body({
          ...parkInfo![0],
          self_employed_discount: 0,
        })
      );

      setPark({ ...park, ...parkInfo![0] });
    }
  };

  if (user.user_type !== UserType.Manager) {
    return <></>;
  }
  if (!park || !parkInfo) {
    return <></>;
  }

  const handleInputNewDivisionChange = (e: any, param: any) => {
    setNewDivision({
      ...newDivision,
      [param]: e.target.value,
    });
  };

  const handleInputNewTariffChange = (e: any, param: any) => {
    setNewTariff({
      ...newTariff,
      [param]: e.target.value,
    });
  };

  const handleInputNewRentTermChange = (e: any, param: any) => {
    setNewRentTerm({
      ...newRentTerm,
      [param]: e.target.value,
    });
  };

  const handleInputNewRentTermSchemaChange = (e: any, param: any, id: any) => {
    const currentSchema = newRentTerm.schemas!.find(
      (schema) => schema.id === id
    );
    setNewRentTerm({
      ...newRentTerm,
      schemas: [
        ...newRentTerm.schemas!.filter((schema) => schema.id !== id),
        { ...currentSchema!, [param]: e.target.value },
      ],
    });
  };

  const divisions = park!.divisions! as Divisions2[];
  const tariffs = park!.tariffs as Tariffs[];
  const rentTerms = park!.rent_terms as IRent_terms[];

  const selectedDivision =
    selectedVariant.name === "division"
      ? (divisions.find(
          (division) => division.id === selectedVariant.id
        ) as Divisions2)
      : null;

  const selectedRentTerm =
    selectedVariant.name === "rent_term"
      ? (rentTerms.find(
          (rentTerm) => rentTerm.id === selectedVariant.id
        ) as IRent_terms)
      : null;

  const selectedTariff =
    selectedVariant.name === "tariff"
      ? (tariffs.find((tariff) => tariff.id === selectedVariant.id) as Tariffs)
      : null;

  const Info = () => {
    return (
      <div className="">
        <h3>Инфо парка {park.park_name}</h3>
        <div className="">
          <div className="flex items-center justify-between space-x-2">
            <div className="">Инфо парка</div>

            <Button
              className="w-1/3"
              onClick={() => setIsKeyShowed(!isKeyShowed)}
            >
              {isKeyShowed ? "Скрыть ключ" : "Показать ключ"}
            </Button>
          </div>
          <Separator />
          {isKeyShowed && (
            <>
              <div className="flex items-center justify-between space-x-2">
                <div className="">
                  <div className="">X-API-key:</div>
                </div>

                <div className="">{park.api_key}</div>
              </div>
              <Separator />
            </>
          )}
          <div className="">
            <h4>Описание парка:</h4>
            <p>{park.about ? park.about : "Описания еще нет"}</p>
            <Input
              onChange={(e) =>
                setParkInfo([{ ...parkInfo[0], about: e.target.value }])
              }
              type="textarea"
              placeholder="Введите новое значение"
            ></Input>
          </div>
          <div className="">
            <h4>Комиссия парка:</h4>
            <p>{park.commission ? park.commission : "Комиссии еще нет"}</p>
            <Input
              onChange={(e) =>
                setParkInfo([{ ...parkInfo[0], commission: e.target.value }])
              }
              type="number"
              placeholder="Введите новое значение"
            ></Input>
          </div>
          <div className="">
            <h4>URL парка для API:</h4>
            <p>{park.url ? park.url : "URL еще нет"}</p>
            <Input
              onChange={(e) =>
                setParkInfo([{ ...parkInfo[0], url: e.target.value }])
              }
              type="text"
              placeholder="Введите новое значение"
            ></Input>
          </div>
          <div className="">
            <h4>Время брони парка в часах:</h4>
            <p>{park.booking_window}</p>
            <Input
              onChange={(e) =>
                setParkInfo([
                  { ...parkInfo[0], booking_window: e.target.value },
                ])
              }
              type="number"
              placeholder="Введите новое значение"
            ></Input>
          </div>
          {/* <div className="">
              <h4>Скидка самозанятым:</h4>
              <p>{park.self_employed_discount ? "Да" : "Нет"}</p>
              <Input
                onChange={(e) =>
                  (parkInfo.self_employed_discount = Number(
                    e.target.value
                  ))
                }
                type="number"
                placeholder="Введите новое значение"
              />
            </div> */}
          <Button onClick={updateParkInfo}>Применить изменения</Button>
        </div>
      </div>
    );
  };

  const Divisions = () => {
    return (
      <>
        <div className="">Подразделения</div>

        <div className="flex space-x-1">
          <div className="w-1/2 p-2 my-8 space-y-4 bg-white rounded-xl">
            <div className="flex items-center justify-between space-x-2">
              {divisions.length === 0 && (
                <div className="">
                  <div className="">Подразделений еще нет</div>
                </div>
              )}
              {divisions.map((x, i) => (
                <div className="" key={`division_${i}`}>
                  <div className="">{x.address}</div>
                </div>
              ))}
            </div>
            {selectedVariant.name !== "newDivision" && (
              <Button
                className="w-64 text-lg"
                onClick={() =>
                  setSelectedVariant({ name: "newDivision", id: 0 })
                }
              >
                Создать
              </Button>
            )}
          </div>
          {selectedVariant.name === "newDivision" && (
            <div className="w-1/2 p-2 my-8 space-y-4 bg-white rounded-xl">
              <h3 className="my-4">Создание подразделения</h3>
              <div className="">
                <h4>Город подразделения:</h4>
                <div className="p-2 cursor-pointer bg-grey rounded-xl w-fit">
                  <CityPicker />
                </div>
              </div>
              {[
                {
                  title: "Координаты подразделения",
                  type: "text",
                  placeholder: "00.000, 00.000",
                  param: "coords",
                  value: "",
                },
                {
                  title: "Адрес подразделения",
                  type: "text",
                  placeholder: "г. Москва, ул. ...",
                  param: "address",
                  value: newDivision.address || "",
                },
                {
                  title: "Ближайшее метро, если есть",
                  type: "text",
                  placeholder: "Введите значение",
                  param: "metro",
                  value: newDivision.metro || "",
                },
                {
                  title: "Название подразделения",
                  type: "text",
                  placeholder: "Введите значение",
                  param: "name",
                  value: newDivision.name || "",
                },
                {
                  title: "Часовой пояс",
                  type: "number",
                  placeholder: "Введите значение",
                  param: "timezone_difference",
                  value: newDivision.timezone_difference || 3,
                },
              ].map((input, index) => (
                <div key={`input_${index}`} className="">
                  <h4>{input.title}:</h4>
                  <Input
                    onChange={(e) =>
                      handleInputNewDivisionChange(e, input.param)
                    }
                    type={input.type}
                    placeholder={input.placeholder}
                  ></Input>
                </div>
              ))}
              <div className="">
                <h4>Телефон подразделения:</h4>
                <PhoneInput
                  onChange={(e) => setNewDivisionPhone(e.target.value)}
                />
              </div>
              <div className="">
                <h4>Время работы:</h4>
                <div className="flex flex-wrap">
                  {Object.keys(DayOfWeek).map((x) => {
                    return (
                      <div className="flex flex-col items-start w-1/2" key={x}>
                        <div className="w-80">
                          <p className="capitalize">
                            {getDayOfWeekDisplayName(x as any)}:
                          </p>
                          <div className="flex items-center space-x-2">
                            <p>Начало:</p>
                            <Input
                              className="w-10 p-0 m-0 text-center"
                              onChange={(e) =>
                                setNewDivision((prevDivision) => ({
                                  ...prevDivision,
                                  working_hours:
                                    prevDivision.working_hours!.map((item) => {
                                      if (item.day === x) {
                                        return {
                                          ...item,
                                          start: {
                                            ...item.start,
                                            hours: e.target.value,
                                          },
                                        };
                                      }
                                      return item;
                                    }),
                                }))
                              }
                              type="number"
                              placeholder="ч"
                            ></Input>
                            <p>:</p>
                            <Input
                              className="w-10 p-0 m-0 text-center"
                              onChange={(e) =>
                                setNewDivision((prevDivision) => ({
                                  ...prevDivision,
                                  working_hours:
                                    prevDivision!.working_hours!.map((item) => {
                                      if (item.day === x) {
                                        return {
                                          ...item,
                                          start: {
                                            ...item.start,
                                            minutes: e.target.value,
                                          },
                                        };
                                      }
                                      return item;
                                    }),
                                }))
                              }
                              type="number"
                              placeholder="м"
                            ></Input>
                          </div>
                          <div className="flex items-center space-x-2 space-y-1">
                            <p>Конец:</p>
                            <Input
                              className="w-10 p-0 m-0 text-center"
                              onChange={(e) =>
                                setNewDivision((prevDivision) => ({
                                  ...prevDivision,
                                  working_hours:
                                    prevDivision!.working_hours!.map((item) => {
                                      if (item.day === x) {
                                        return {
                                          ...item,
                                          end: {
                                            ...item.end,
                                            hours: e.target.value,
                                          },
                                        };
                                      }
                                      return item;
                                    }),
                                }))
                              }
                              type="number"
                              placeholder="ч"
                            ></Input>
                            <p>:</p>
                            <Input
                              className="w-10 p-0 m-0 text-center"
                              onChange={(e) =>
                                setNewDivision((prevDivision) => ({
                                  ...prevDivision,
                                  working_hours:
                                    prevDivision!.working_hours!.map((item) => {
                                      if (item.day === x) {
                                        return {
                                          ...item,
                                          end: {
                                            ...item.end,
                                            minutes: e.target.value,
                                          },
                                        };
                                      }
                                      return item;
                                    }),
                                }))
                              }
                              type="number"
                              placeholder="м"
                            ></Input>
                          </div>
                        </div>
                        <Separator className="my-2" />
                      </div>
                    );
                  })}
                </div>
              </div>
              <Confirmation
                accept={() => createDivision}
                cancel={() => {}}
                trigger={<Button className="w-60">Применить</Button>}
                title={"Создать подразделение?"}
                type="green"
              />
            </div>
          )}
          {selectedDivision && (
            <div className="w-1/2 p-2 my-8 space-y-4 bg-white rounded-xl">
              <h3 className="my-4">
                Изменение подразделения {selectedDivision.name}
              </h3>
              {[
                {
                  title: "Координаты подразделения",
                  type: "text",
                  placeholder: "00.000, 00.000",
                  param: "coords",
                  value: "",
                },
                {
                  title: "Адрес подразделения",
                  type: "text",
                  placeholder: "г. Москва, ул. ...",
                  param: "address",
                  value: newDivision.address || "",
                },
                {
                  title: "Ближайшее метро, если есть",
                  type: "text",
                  placeholder: "Введите значение",
                  param: "metro",
                  value: newDivision.metro || "",
                },
                {
                  title: "Название подразделения",
                  type: "text",
                  placeholder: "Введите значение",
                  param: "name",
                  value: newDivision.name || "",
                },
                {
                  title: "Часовой пояс",
                  type: "number",
                  placeholder: "Введите значение",
                  param: "timezone_difference",
                  value: newDivision.timezone_difference || 3,
                },
              ].map((input, index) => (
                <div key={`input_${index}`} className="">
                  <h4>{input.title}:</h4>
                  <Input
                    onChange={(e) =>
                      handleInputNewDivisionChange(e, input.param)
                    }
                    type={input.type}
                    placeholder={input.placeholder}
                  ></Input>
                </div>
              ))}
              <div className="">
                <h4>Телефон подразделения:</h4>
                <PhoneInput
                  onChange={(e) => setNewDivisionPhone(e.target.value)}
                />
              </div>
              <div className="">
                <h4>Время работы:</h4>
                <div className="flex flex-wrap">
                  {Object.keys(DayOfWeek).map((x) => {
                    return (
                      <div className="flex flex-col items-start w-1/2" key={x}>
                        <div className="w-80">
                          <p className="capitalize">
                            {getDayOfWeekDisplayName(x as any)}:
                          </p>
                          <div className="flex items-center space-x-2">
                            <p>Начало:</p>
                            <Input
                              className="w-10 p-0 m-0 text-center"
                              onChange={(e) =>
                                setNewDivision((prevDivision) => ({
                                  ...prevDivision,
                                  working_hours:
                                    prevDivision.working_hours!.map((item) => {
                                      if (item.day === x) {
                                        return {
                                          ...item,
                                          start: {
                                            ...item.start,
                                            hours: e.target.value,
                                          },
                                        };
                                      }
                                      return item;
                                    }),
                                }))
                              }
                              type="number"
                              placeholder="ч"
                            ></Input>
                            <p>:</p>
                            <Input
                              className="w-10 p-0 m-0 text-center"
                              onChange={(e) =>
                                setNewDivision((prevDivision) => ({
                                  ...prevDivision,
                                  working_hours:
                                    prevDivision!.working_hours!.map((item) => {
                                      if (item.day === x) {
                                        return {
                                          ...item,
                                          start: {
                                            ...item.start,
                                            minutes: e.target.value,
                                          },
                                        };
                                      }
                                      return item;
                                    }),
                                }))
                              }
                              type="number"
                              placeholder="м"
                            ></Input>
                          </div>
                          <div className="flex items-center space-x-2 space-y-1">
                            <p>Конец:</p>
                            <Input
                              className="w-10 p-0 m-0 text-center"
                              onChange={(e) =>
                                setNewDivision((prevDivision) => ({
                                  ...prevDivision,
                                  working_hours:
                                    prevDivision!.working_hours!.map((item) => {
                                      if (item.day === x) {
                                        return {
                                          ...item,
                                          end: {
                                            ...item.end,
                                            hours: e.target.value,
                                          },
                                        };
                                      }
                                      return item;
                                    }),
                                }))
                              }
                              type="number"
                              placeholder="ч"
                            ></Input>
                            <p>:</p>
                            <Input
                              className="w-10 p-0 m-0 text-center"
                              onChange={(e) =>
                                setNewDivision((prevDivision) => ({
                                  ...prevDivision,
                                  working_hours:
                                    prevDivision!.working_hours!.map((item) => {
                                      if (item.day === x) {
                                        return {
                                          ...item,
                                          end: {
                                            ...item.end,
                                            minutes: e.target.value,
                                          },
                                        };
                                      }
                                      return item;
                                    }),
                                }))
                              }
                              type="number"
                              placeholder="м"
                            ></Input>
                          </div>
                        </div>
                        <Separator className="my-2" />
                      </div>
                    );
                  })}
                </div>
              </div>
              {/* <Confirmation
                accept={() => createDivision}
                cancel={() => {}}
                trigger={<Button className="w-60">Применить</Button>}
                title={"Обновить подразделение?"}
                type="green"
              /> */}
            </div>
          )}
        </div>
      </>
    );
  };

  const Tariffs = () => {
    return (
      <>
        <div className="">Тарифы (требования к водителям)</div>

        <div className="flex space-x-1">
          <div className="w-1/2 p-2 my-8 space-y-4 bg-white rounded-xl">
            <div className="flex items-center justify-between space-x-2">
              {tariffs.length === 0 && (
                <div className="">
                  <div className="">Требований к водителям еще нет</div>
                </div>
              )}
              {tariffs.map((x, i) => (
                <div className="" key={`tariff_${i}`}>
                  <div className="">
                    {x.city} - {x.class}
                  </div>
                </div>
              ))}
            </div>
            {selectedVariant.name !== "newTariff" && (
              <Button
                className="w-64 text-lg"
                onClick={() => setSelectedVariant({ name: "newTariff", id: 0 })}
              >
                Создать
              </Button>
            )}
          </div>
          {selectedVariant.name === "newTariff" && (
            <div className="w-1/2 p-2 my-8 space-y-4 bg-white rounded-xl">
              <h3 className="my-4">Создание тарифа</h3>
              <div className="">
                <h4>Город тарифа:</h4>
                <div className="p-2 cursor-pointer bg-grey rounded-xl w-fit">
                  <CityPicker />
                </div>
              </div>
              <div className="">
                <Select
                  onValueChange={(value) =>
                    setNewTariff({ ...newTariff, class: Number(value) })
                  }
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Класс" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.keys(CarClass).map((x) => (
                      <SelectItem value={x}>
                        {getCarClassDisplayName(x as CarClass)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {[
                {
                  title: "ДТП по вине водителя",
                  type: "checkbox",
                  placeholder: "г. Москва, ул. ...",
                  param: "has_caused_accident",
                  value: newTariff.has_caused_accident || false,
                },
                {
                  title: "Максимально количество штртафов",
                  type: "number",
                  placeholder: "Введите значение",
                  param: "max_fine_count",
                  value: newTariff.max_fine_count || 0,
                },
                {
                  title: "Бросал автомобиль",
                  type: "checkbox",
                  placeholder: "Введите значение",
                  param: "abandoned_car",
                  value: newTariff.abandoned_car || false,
                },
                {
                  title: "Минимальный скоринг",
                  type: "number",
                  placeholder: "Введите значение",
                  param: "min_scoring",
                  value: newDivision.min_scoring || 3,
                },
                {
                  title: "Северный кавказ",
                  type: "checkbox",
                  placeholder: "Введите значение",
                  param: "is_north_caucasus",
                  value: newTariff.is_north_caucasus || false,
                },
                {
                  title: "Запрещенные статьи",
                  type: "text",
                  placeholder: "Введите значение",
                  param: "criminal_ids",
                  value: newTariff.criminal_ids || "",
                },
                {
                  title: "Алкоголь/иное",
                  type: "checkbox",
                  placeholder: "Введите значение",
                  param: "alcohol",
                  value: newTariff.alcohol || false,
                },
              ].map((input, index) => (
                <div
                  key={`input_${index}`}
                  className={`${
                    input.type === "checkbox" &&
                    "flex flex-row-reverse justify-end items-center gap-4"
                  }`}
                >
                  <h4>{input.title}:</h4>
                  <Input
                    className={`${
                      input.type === "checkbox" && "flex w-6 m-0 "
                    }`}
                    onChange={(e) => handleInputNewTariffChange(e, input.param)}
                    type={input.type}
                    placeholder={input.placeholder}
                  ></Input>
                </div>
              ))}

              <Confirmation
                accept={() => createTariff}
                cancel={() => {}}
                trigger={<Button className="w-60">Применить</Button>}
                title={"Создать подразделение?"}
                type="green"
              />
            </div>
          )}
        </div>
      </>
    );
  };

  const RentTerms = () => {
    const AddSchema = () => {
      const newSchema = {
        id: newRentTerm.schemas[-1].id + 1,
        daily_amount: 0,
        non_working_days: 0,
        working_days: 0,
      };
      if (newRentTerm.schemas.length < 10) {
        setNewRentTerm({
          ...newRentTerm,
          schemas: [...newRentTerm.schemas!, newSchema],
        });
      }
    };

    return (
      <>
        <div className="">Условия аренды</div>

        <div className="flex space-x-1">
          <div className="w-1/2 p-2 my-8 space-y-4 bg-white rounded-xl">
            <div className="flex items-center justify-between space-x-2">
              {rentTerms.length === 0 && (
                <div className="">
                  <div className="">Условий аренды еще нет</div>{" "}
                </div>
              )}
              {rentTerms.map((x, i) => (
                <div className="" key={`rentTerm_${i}`}>
                  <div className="">{x.name}</div>{" "}
                </div>
              ))}
            </div>
            {selectedVariant.name !== "newRentTerm" && (
              <Button
                className="w-64 text-lg"
                onClick={() =>
                  setSelectedVariant({ name: "newRentTerm", id: 0 })
                }
              >
                Создать
              </Button>
            )}
          </div>
          {selectedVariant.name === "newRentTerm" && (
            <div className="w-1/2 p-2 my-8 space-y-4 bg-white rounded-xl">
              <h3 className="my-4">Создание условий аренды</h3>
              {[
                {
                  title: "Ежедневный депозит",
                  type: "nubmer",
                  placeholder: "Введите значение",
                  param: "deposit_amount_daily",
                  value: newRentTerm.deposit_amount_daily || 0,
                },
                {
                  title: "Всего депозит",
                  type: "number",
                  placeholder: "Введите значение",
                  param: "deposit_amount_total",
                  value: newRentTerm.deposit_amount_total || 0,
                },
                {
                  title: "Возможность выкупа",
                  type: "checkbox",
                  placeholder: "Введите значение",
                  param: "is_buyout_possible",
                  value: newRentTerm.is_buyout_possible || false,
                },
                {
                  title: "Минимальный срок аренды в днях",
                  type: "number",
                  placeholder: "Введите значение",
                  param: "minimum_period_days",
                  value: newRentTerm.minimum_period_days || 0,
                },
                {
                  title: "Название",
                  type: "text",
                  placeholder: "Введите значение",
                  param: "name",
                  value: newRentTerm.name || "",
                },
              ].map((input, index) => (
                <div
                  key={`input_${index}`}
                  className={`${
                    input.type === "checkbox" &&
                    "flex flex-row-reverse justify-end items-center gap-4"
                  }`}
                >
                  <h4>{input.title}:</h4>
                  <Input
                    className={`${
                      input.type === "checkbox" && "flex w-6 m-0 "
                    }`}
                    onChange={(e) =>
                      handleInputNewRentTermChange(e, input.param)
                    }
                    type={input.type}
                    placeholder={input.placeholder}
                  ></Input>
                </div>
              ))}
              <div className="flex items-center justify-between space-x-2">
                <h4>Схемы аренды:</h4>
                {newRentTerm.schemas.length < 10 && (
                  <Button className="w-1/2" onClick={AddSchema}>
                    Добавить схему аренды
                  </Button>
                )}
              </div>
              <div className="">
                {newRentTerm?.schemas!.map((schema, i) => (
                  <div
                    key={`schema_${i}`}
                    className="p-4 my-1 border border-grey rounded-xl"
                  >
                    {[
                      {
                        title: "Стоимость ежедневно",
                        type: "number",
                        placeholder: "Введите значение",
                        param: "daily_amount",
                        value: schema.daily_amount || 0,
                      },
                      {
                        title: "Рабочих дней",
                        type: "number",
                        placeholder: "Введите значение",
                        param: "non_working_days",
                        value: schema.non_working_days || 0,
                      },
                      {
                        title: "Не рабочих дней",
                        type: "number",
                        placeholder: "Введите значение",
                        param: "working_days",
                        value: schema.working_days || 0,
                      },
                    ].map((input, index) => (
                      <div
                        key={`input_${index}`}
                        className="flex items-center justify-between"
                      >
                        <h4>{input.title}:</h4>
                        <Input
                          className={"w-3/5 m-1"}
                          onChange={(e) =>
                            handleInputNewRentTermSchemaChange(
                              e,
                              input.param,
                              schema.id
                            )
                          }
                          type={input.type}
                          placeholder={input.placeholder}
                        ></Input>
                      </div>
                    ))}
                  </div>
                ))}
              </div>

              <Confirmation
                accept={() => upsertRentTerm}
                cancel={() => {}}
                trigger={<Button className="w-60">Применить</Button>}
                title={"Создать подразделение?"}
                type="green"
              />
            </div>
          )}
        </div>
      </>
    );
  };

  const Cars = () => {
    return (
      <>
        <div className="">Авто</div>

        <div className="flex space-x-1">
          <div className="w-1/2 p-2 my-8 space-y-4 bg-white rounded-xl">
            <div className="flex items-center justify-between space-x-2">
              {divisions.length === 0 && <div className="">Авто в еще нет</div>}
              {divisions.map((x, i) => (
                <div className="" key={`division_${i}`}>
                  {x.cars?.length === 0 && (
                    <div className="">
                      Авто в подразделении {x.name} еще нет
                    </div>
                  )}
                  {x.map((car: Cars) => (
                    <div key={`car_${car.id}`} className="">
                      {car.license_plate} {car.brand} {car.model}
                    </div>
                  ))}
                </div>
              ))}
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="w-1/3">Создать</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[800px]">
                  <div className="">
                    <h3 className="my-4">Создание парка</h3>
                    <p className="my-4">
                      Чтобы создать новы парк - введите его название и номер
                      телефона менеджера. Менеджер парка может получить API-ключ
                      после авторизации по номеру телефона.{" "}
                    </p>

                    {/* <Confirmation
                    accept={createPark}
                    cancel={() => {}}
                    trigger={<Button className="w-60">Применить</Button>}
                    title={"Создать парк?"}
                    type="green"
                  />  */}
                  </div>

                  <DialogFooter>
                    <DialogClose asChild>
                      <div className="fixed bottom-0 left-0 flex justify-center w-full">
                        <div className="max-w-[800px] w-full flex justify-center bg-white border-t  border-pale px-4 py-4 space-x-2">
                          <div className="sm:max-w-[250px] w-full">
                            <Button>Назад</Button>
                          </div>
                        </div>
                      </div>
                    </DialogClose>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
          <div className="w-1/2 p-2 my-8 space-y-4 bg-white rounded-xl">
            {selectedVariant.name === "rent_term" && (
              <div className="">
                Инфо требований к водителям {selectedRentTerm?.name}
              </div>
            )}
            {selectedVariant.name === "tariff" && (
              <div className="">Инфо тарифа {selectedTariff?.name}</div>
            )}
          </div>
        </div>
      </>
    );
  };

  return (
    <>
      <div className="flex justify-end h-full mt-4">
        <div className="flex justify-between w-full space-x-4 cursor-pointer sm:mx-0 sm:w-full sm:space-x-8 sm:max-w-[800px] sm:justify-between lg:max-w-[1104px]">
          <div className="flex items-center text-sm font-black tracking-widest sm:text-xl">
            BeeBeep
          </div>
          <div className="flex justify-end space-x-8 ">
            {[
              { name: "Инфо", path: "/info" },
              { name: "Подразделения", path: "/divisions" },
              { name: "Условия аренды", path: "/rent_terms" },
              { name: "Тарифы", path: "/tariffs" },
              { name: "Автомобили", path: "/cars" },
            ].map(({ name, path }: MainMenuItem, i) => (
              <div key={`menu_${i}`} className="">
                <Link
                  className="flex items-center text-xl font-semibold hover:text-yellow"
                  to={path}
                >
                  {name}
                </Link>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-end space-x-4 text-xl font-semibold">
            {park.park_name}
          </div>
        </div>
      </div>

      <Routes>
        <Route path="/*" element={<Navigate to="/info" replace={true} />} />
        <Route path={`/info`} element={<Info />} />
        <Route path={`/divisions`} element={<Divisions />} />
        <Route path={`/rent_terms`} element={<RentTerms />} />
        <Route path={`/tariffs`} element={<Tariffs />} />
        <Route path={`/cars`} element={<Cars />} />
      </Routes>
    </>
  );
};

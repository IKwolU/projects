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
  Schemas,
  IDivisions2,
  DayOfWeek,
} from "./api-client";
import { cityAtom, userAtom } from "./atoms";
import { client } from "./backend";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { DialogFooter } from "@/components/ui/dialog";
import InputMask from "react-input-mask";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogClose,
} from "@/components/ui/dialog";
import { Link, Navigate, Route, Routes } from "react-router-dom";
import Confirmation from "@/components/ui/confirmation";
import { CityPicker } from "./CityPicker";
import { getDayOfWeekDisplayName } from "@/lib/utils";

type VariantItem = { name: string; id: number | null };
type MainMenuItem = {
  name: string;
  path: string;
};

function PhoneInput(props: any) {
  return (
    <InputMask
      className="w-full h-12 p-4 px-3 py-2 mt-1 mb-4 text-lg bg-white border rounded-md md:mt-2 border-slate-200 ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950 dark:ring-offset-slate-950 dark:placeholder:text-slate-400 dark:focus-visible:ring-slate-300"
      mask="+7 (999) 999-99-99"
      value={props.value}
      onChange={props.onChange}
      type={"tel"}
      placeholder={"+7 (999) 123-45-67"}
    ></InputMask>
  );
}

export const ParkManager = () => {
  const [user] = useRecoilState(userAtom);
  const [city] = useRecoilState(cityAtom);
  const [park, setPark] = useState<IPark2 | undefined>();
  const [parkInfo, setParkInfo] = useState<IPark2 | undefined>();
  const [newDivisionPhone, setNewDivisionPhone] = useState("");
  const [newDivision, setNewDivision] = useState<IDivisions2>({
    city: city,
    coords: "",
    address: "",
    metro: "",
    name: "",
    phone: "",
    timezone_difference: 3,
    working_hours: [],
  });
  const [isKeyShowed, setIsKeyShowed] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState<VariantItem>({
    name: "park",
    id: null,
  });

  useEffect(() => {
    if (user.user_type === UserType.Manager) {
      const getPark = async () => {
        try {
          const parkData = await client.getPark();
          setPark(parkData.park![0]);
          setParkInfo([
            {
              ...parkData.park![0],
              commission: parkData.park![0]?.commission || 0,
              about: parkData.park![0]?.about || "",
              url: parkData.park![0]?.url || "",
              self_imployeds_discount:
                parkData.park![0]?.self_imployeds_discount || 0,
            },
          ]);
          localStorage.setItem("X-API-key", parkData.park![0]!.api_key!);
        } catch (error) {}
      };

      getPark();
    }
  }, []);

  const createDivision = async ({ ...newDivision }: Division3) => {
    try {
      const newDivisionData = await client.createParkDivision(
        new Body3({
          ...newDivision,
        })
      );
      setPark({
        ...park![0],

        divisions: [
          ...divisions,

          {
            ...newDivision,
            id: newDivisionData.id,
          },
        ],
      });
    } catch (error) {}
  };

  const createTariff = async (
    abandoned_car: boolean,
    alcohol: boolean,
    city: string,
    carClass: number,
    criminal_ids: string[],
    experience: number,
    has_caused_accident: boolean,
    is_north_caucasus: boolean,
    max_fine_count: number,
    min_scoring: number
  ) => {
    try {
      const newTariffData = await client.createTariff(
        new Body5({
          abandoned_car,
          alcohol,
          city,
          class: carClass,
          criminal_ids,
          experience,
          has_caused_accident,
          is_north_caucasus,
          max_fine_count,
          min_scoring,
        })
      );
      setPark({
        ...park![0],

        tariffs: [
          ...tariffs,

          {
            abandoned_car,
            alcohol,
            city,
            class: carClass,
            criminal_ids,
            experience,
            has_caused_accident,
            is_north_caucasus,
            max_fine_count,
            min_scoring,
            id: newTariffData.id,
          },
        ],
      });
    } catch (error) {}
  };

  const upsertRentTerm = async (
    deposit_amount_daily: number,
    deposit_amount_total: number,
    is_buyout_possible: boolean,
    minimum_period_days: number,
    name: string,
    rent_term_id: number | undefined,
    schemas: Schemas[]
  ) => {
    try {
      const newTariffData = await client.createOrUpdateRentTerm(
        new Body6({
          deposit_amount_daily,
          deposit_amount_total,
          is_buyout_possible,
          minimum_period_days,
          name,
          rent_term_id,
          schemas,
        })
      );

      setPark({
        ...park![0],

        rent_terms: [
          ...rentTerms.filter((rent_term) =>
            rent_term_id ? rent_term.id !== rent_term_id : rent_term
          ),

          {
            deposit_amount_daily,
            deposit_amount_total,
            is_buyout_possible,
            minimum_period_days,
            name,
            rent_term_id,
            schemas,
            id: newTariffData.id,
          },
        ],
      });
    } catch (error) {}
  };

  const updateParkInfo = async () => {
    {
      try {
        await client.updateParkInfo(
          new Body({
            ...parkInfo![0],
            self_imployeds_discount: 0,
          })
        );

        setPark({ ...park![0], ...parkInfo![0] });
      } catch (error) {}
    }
  };

  if (user.user_type !== UserType.Manager) {
    return <></>;
  }
  if (!park || !parkInfo) {
    return <></>;
  }

  const handlePhoneInput = ({ target: { value } }: any) =>
    setNewDivisionPhone(value);

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
            <p>{park.period_for_book}</p>
            <Input
              onChange={(e) =>
                setParkInfo([
                  { ...parkInfo[0], period_for_book: e.target.value },
                ])
              }
              type="number"
              placeholder="Введите новое значение"
            ></Input>
          </div>
          {/* <div className="">
              <h4>Скидка самозанятым:</h4>
              <p>{park.self_imployeds_discount ? "Да" : "Нет"}</p>
              <Input
                onChange={(e) =>
                  (parkInfo.self_imployeds_discount = Number(
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
              <div className="">
                <h4>Координаты подразделения:</h4>
                <Input
                  onChange={(e) =>
                    setNewDivision([{ ...newDivision, coords: e.target.value }])
                  }
                  type="text"
                  placeholder="00.000, 00.000"
                ></Input>
              </div>
              <div className="">
                <h4>Адрес парка:</h4>
                <Input
                  onChange={(e) =>
                    setNewDivision([
                      { ...newDivision, address: e.target.value },
                    ])
                  }
                  type="text"
                  placeholder="г. Москва, ул. ..."
                ></Input>
              </div>
              <div className="">
                <h4>Ближайшее метро, если есть:</h4>
                <Input
                  onChange={(e) =>
                    setNewDivision([{ ...newDivision, metro: e.target.value }])
                  }
                  type="text"
                  placeholder="Введите значение"
                ></Input>
              </div>
              <div className="">
                <h4>Название подразделения:</h4>
                <Input
                  onChange={(e) =>
                    setNewDivision([{ ...newDivision, name: e.target.value }])
                  }
                  type="text"
                  placeholder="Введите значение"
                ></Input>
              </div>
              <div className="">
                <h4>Телефон подразделения:</h4>
                <PhoneInput
                  className="w-full h-12 p-4 px-3 py-2 mt-1 text-lg bg-white border rounded-md md:mt-2 border-slate-200 ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950 dark:ring-offset-slate-950 dark:placeholder:text-slate-400 dark:focus-visible:ring-slate-300"
                  value={newDivisionPhone}
                  onChange={handlePhoneInput}
                  placeholder={"+7 (999) 123-45-67"}
                  required
                ></PhoneInput>
              </div>
              <div className="">
                <h4>Часовой пояс:</h4>
                <Input
                  onChange={(e) =>
                    setNewDivision([
                      { ...newDivision, timezone_difference: e.target.value },
                    ])
                  }
                  value={3}
                  type="number"
                  placeholder="Введите значение"
                ></Input>
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
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="w-1/3">Создать</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[800px]">
                  <div className="">
                    <h3 className="my-4">Создание тарифа</h3>
                    <p className="my-4">
                      Чтобы создать новы парк - введите его название и номер
                      телефона менеджера. Менеджер парка может получить API-ключ
                      после авторизации по номеру телефона.{" "}
                    </p>

                    <Confirmation
                      accept={() => createTariff}
                      cancel={() => {}}
                      trigger={<Button className="w-60">Применить</Button>}
                      title={"Создать тариф?"}
                      type="green"
                    />
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
        </div>
      </>
    );
  };

  const RentTerms = () => {
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
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="w-1/3">Создать</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[800px]">
                  <div className="">
                    <h3 className="my-4">Создание условия аренды</h3>
                    <p className="my-4">
                      Чтобы создать новы парк - введите его название и номер
                      телефона менеджера. Менеджер парка может получить API-ключ
                      после авторизации по номеру телефона.{" "}
                    </p>

                    <Confirmation
                      accept={() => upsertRentTerm}
                      cancel={() => {}}
                      trigger={<Button className="w-60">Применить</Button>}
                      title={"создать условие аренды?"}
                      type="green"
                    />
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
            МОЙ ГАРАЖ
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

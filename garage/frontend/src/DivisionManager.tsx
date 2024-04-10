import { useState } from "react";
import { useRecoilState } from "recoil";
import {
  Divisions2,
  Body3,
  DayOfWeek,
  IBody3,
  Working_hours2,
  End2,
  Start2,
} from "./api-client";
import { cityAtom, parkAtom } from "./atoms";
import { client } from "./backend";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import PhoneInput from "@/components/ui/phone-input";

import Confirmation from "@/components/ui/confirmation";
import { CityPicker } from "./CityPicker";
import { getDayOfWeekDisplayName } from "@/lib/utils";

export const DivisionManager = () => {
  const [city] = useRecoilState(cityAtom);
  const [park, setPark] = useRecoilState(parkAtom);
  const [newDivisionPhone, setNewDivisionPhone] = useState("");
  const [selectedId, setSelectedId] = useState(0);
  const [workingHours, setWorkingHours] = useState<Working_hours2[]>([
    new Working_hours2({
      day: DayOfWeek.Monday,
      start: new Start2({ hours: 0, minutes: 0 }),
      end: new End2({ hours: 0, minutes: 0 }),
    }),
  ]);
  const [newDivision, setNewDivision] = useState<IBody3>({
    city: city,
    coords: "",
    address: "",
    metro: undefined,
    name: "",
    phone: "",
    timezone_difference: 3,
    working_hours: workingHours,
  });

  const divisions = park!.divisions!;

  const createDivision = async () => {
    const newDivisionData = await client.createParkDivisionManager(
      new Body3({
        city: newDivision.city,
        address: newDivision.address,
        coords: newDivision.coords,
        metro: newDivision.metro,
        name: newDivision.name,
        phone: newDivisionPhone,
        timezone_difference: newDivision.timezone_difference,
        working_hours: workingHours,
      })
    );
    setPark({
      ...park,
      divisions: [
        ...divisions,
        new Divisions2({
          ...newDivision,
          id: newDivisionData.id,
          phone: newDivisionPhone,
        }),
      ],
    });
  };

  const handleInputNewDivisionChange = (
    value: string,
    param: keyof Divisions2
  ) => {
    setNewDivision({
      ...newDivision,
      [param]: value,
    });
  };

  const selected = divisions.find(
    (division) => division.id === selectedId
  ) as Divisions2;

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
          {!selectedId && (
            <Button className="w-64 text-lg" onClick={() => setSelectedId(0)}>
              Создать
            </Button>
          )}
        </div>
        {selectedId === 0 && (
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
              // {
              //   title: "Ближайшее метро, если есть",
              //   type: "text",
              //   placeholder: "Введите значение",
              //   param: "metro",
              //   value: newDivision.metro || "",
              // },
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
                    handleInputNewDivisionChange(e.target.value, input.param)
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
                  const value = DayOfWeek[x as keyof typeof DayOfWeek];
                  let item = workingHours.find(
                    (workingHour) => workingHour.day === value
                  );
                  if (!item) {
                    item = new Working_hours2({
                      day: value,
                      end: new Start2({
                        minutes: 0,
                        hours: 0,
                      }),
                    });
                    setWorkingHours([...workingHours, item]);
                  }

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
                            onChange={(e) => {
                              return setWorkingHours([
                                ...workingHours!.filter(
                                  (workingHour) => workingHour.day !== value
                                ),
                                new Working_hours2({
                                  ...item!,
                                  end: new Start2({
                                    minutes: item?.end?.minutes || 0,
                                    hours: Number(e.target.value),
                                  }),
                                }),
                              ]);
                            }}
                            value={item!.start!.hours}
                            type="number"
                            placeholder="ч"
                          ></Input>
                          <p>:</p>
                          <Input
                            className="w-10 p-0 m-0 text-center"
                            onChange={(e) => {
                              const item = workingHours!.find(
                                (workingHour) => workingHour.day === value
                              );
                              return setWorkingHours([
                                ...workingHours!.filter(
                                  (workingHour) => workingHour.day !== value
                                ),
                                new Working_hours2({
                                  ...item!,
                                  end: new Start2({
                                    minutes: Number(e.target.value),
                                    hours: item!.end?.hours || 0,
                                  }),
                                }),
                              ]);
                            }}
                            type="number"
                            placeholder="м"
                          ></Input>
                        </div>
                        <div className="flex items-center space-x-2 space-y-1">
                          <p>Конец:</p>
                          <Input
                            className="w-10 p-0 m-0 text-center"
                            onChange={(e) => {
                              const item = workingHours!.find(
                                (workingHour) => workingHour.day === value
                              );
                              return setWorkingHours([
                                ...workingHours!.filter(
                                  (workingHour) => workingHour.day !== value
                                ),
                                new Working_hours2({
                                  ...item!,
                                  end: new End2({
                                    minutes: item!.end?.minutes || 0,
                                    hours: Number(e.target.value),
                                  }),
                                }),
                              ]);
                            }}
                            type="number"
                            placeholder="ч"
                          ></Input>
                          <p>:</p>
                          <Input
                            className="w-10 p-0 m-0 text-center"
                            onChange={(e) => {
                              const item = workingHours!.find(
                                (workingHour) => workingHour.day === value
                              );
                              return setWorkingHours([
                                ...workingHours!.filter(
                                  (workingHour) => workingHour.day !== value
                                ),
                                new Working_hours2({
                                  ...item!,
                                  end: new End2({
                                    minutes: Number(e.target.value),
                                    hours: item?.end?.minutes || 0,
                                  }),
                                }),
                              ]);
                            }}
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
              accept={() => createDivision()}
              cancel={() => {}}
              trigger={<Button className="w-60">Применить</Button>}
              title={"Создать подразделение?"}
              type="green"
            />
          </div>
        )}
        {selected && (
          <div className="w-1/2 p-2 my-8 space-y-4 bg-white rounded-xl">
            <h3 className="my-4">Изменение подразделения {selected.name}</h3>
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
                    handleInputNewDivisionChange(e.target.value, input.param)
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
                {Object.keys(DayOfWeek).map((x: string) => {
                  const value = DayOfWeek[x as keyof typeof DayOfWeek];
                  return (
                    <div className="flex flex-col items-start w-1/2" key={x}>
                      <div className="w-80">
                        <p className="capitalize">
                          {getDayOfWeekDisplayName(value)}:
                        </p>
                        <div className="flex items-center space-x-2">
                          <p>Начало:</p>
                          <Input
                            className="w-10 p-0 m-0 text-center"
                            onChange={(e) => {
                              const item = workingHours!.find(
                                (workingHour) => workingHour.day === value
                              );
                              return setWorkingHours([
                                ...workingHours!.filter(
                                  (workingHour) => workingHour.day !== value
                                ),
                                new Working_hours2({
                                  ...item!,
                                  end: new Start2({
                                    minutes: item?.end?.minutes || 0,
                                    hours: Number(e.target.value),
                                  }),
                                }),
                              ]);
                            }}
                            type="number"
                            placeholder="ч"
                          ></Input>
                          <p>:</p>
                          <Input
                            className="w-10 p-0 m-0 text-center"
                            onChange={(e) => {
                              const item = workingHours!.find(
                                (workingHour) => workingHour.day === value
                              );
                              return setWorkingHours([
                                ...workingHours!.filter(
                                  (workingHour) => workingHour.day !== value
                                ),
                                new Working_hours2({
                                  ...item!,
                                  end: new Start2({
                                    minutes: Number(e.target.value),
                                    hours: item!.end?.hours || 0,
                                  }),
                                }),
                              ]);
                            }}
                            type="number"
                            placeholder="м"
                          ></Input>
                        </div>
                        <div className="flex items-center space-x-2 space-y-1">
                          <p>Конец:</p>
                          <Input
                            className="w-10 p-0 m-0 text-center"
                            onChange={(e) => {
                              const item = workingHours!.find(
                                (workingHour) => workingHour.day === value
                              );
                              return setWorkingHours([
                                ...workingHours!.filter(
                                  (workingHour) => workingHour.day !== value
                                ),
                                new Working_hours2({
                                  ...item!,
                                  end: new End2({
                                    minutes: item!.end?.minutes || 0,
                                    hours: Number(e.target.value),
                                  }),
                                }),
                              ]);
                            }}
                            type="number"
                            placeholder="ч"
                          ></Input>
                          <p>:</p>
                          <Input
                            className="w-10 p-0 m-0 text-center"
                            onChange={(e) => {
                              const item = workingHours!.find(
                                (workingHour) => workingHour.day === value
                              );
                              return setWorkingHours([
                                ...workingHours!.filter(
                                  (workingHour) => workingHour.day !== value
                                ),
                                new Working_hours2({
                                  ...item!,
                                  end: new End2({
                                    minutes: Number(e.target.value),
                                    hours: item?.end?.minutes || 0,
                                  }),
                                }),
                              ]);
                            }}
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
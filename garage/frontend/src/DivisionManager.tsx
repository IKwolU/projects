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
  Body30,
  Metro_lines,
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
import ArrayStringSelect from "./ArrayStringSelect";

export const DivisionManager = () => {
  const [city] = useRecoilState(cityAtom);
  const [park, setPark] = useRecoilState(parkAtom);
  const [newDivisionPhone, setNewDivisionPhone] = useState("");
  const [selectedId, setSelectedId] = useState(0);
  const [workingHours, setWorkingHours] = useState<Working_hours2[]>([]);
  const [nonWorkingDay, setNonWorkingDay] = useState([""]);
  const [newDivision, setNewDivision] = useState<IBody3>({
    city: city,
    coords: "",
    address: "",
    metro: undefined,
    name: "",
    phone: "",
    timezone_difference: undefined,
    working_hours: workingHours,
  });

  const divisions = park!.divisions!;

  const createDivision = async () => {
    try {
      const newDivisionData = await client.createParkDivisionManager(
        new Body3({
          city: newDivision.city,
          address: newDivision.address,
          coords: newDivision.coords,
          metro: newDivision.metro,
          name: newDivision.name,
          phone: newDivisionPhone,
          timezone_difference: newDivision.timezone_difference,
          working_hours: workingHours.filter(
            (item) => !nonWorkingDay.includes(item!.day!)
          ),
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
    } catch (error: any) {
      if (error.errors) {
        const errorMessages = Object.values(error.errors).flatMap(
          (errorArray) => errorArray
        );
        const errorMessage = errorMessages.join("\n");
        alert("An error occurred:\n" + errorMessage);
      } else {
        alert("An error occurred: " + error.message);
      }
    }
  };
  const updateDivision = async () => {
    try {
      await client.updateParkDivisionManager(
        new Body30({
          id: selected.id,
          city: newDivision.city || undefined,
          address: newDivision.address || undefined,
          coords: newDivision.coords || undefined,
          metro: newDivision.metro || undefined,
          name: selected.name,
          phone: newDivisionPhone || undefined,
          timezone_difference: newDivision.timezone_difference || undefined,
          working_hours: workingHours.filter(
            (item) => !nonWorkingDay.includes(item!.day!) && !!item!.day!
          ),
        })
      );
      setPark({
        ...park,
        divisions: [
          ...divisions.filter((x) => x.id !== selected.id),
          new Divisions2({
            ...selected,
            city: newDivision.city || selected.city,
            address: newDivision.address || selected.address,
            coords: newDivision.coords || selected.coords,
            metro: newDivision.metro || selected.metro,
            name: selected.name,
            phone: newDivisionPhone || selected.phone,
            timezone_difference:
              newDivision.timezone_difference || selected.timezone_difference,
          }),
        ],
      });
    } catch (error: any) {
      if (error.errors) {
        const errorMessages = Object.values(error.errors).flatMap(
          (errorArray) => errorArray
        );
        const errorMessage = errorMessages.join("\n");
        alert("An error occurred:\n" + errorMessage);
      } else {
        alert("An error occurred: " + error.message);
      }
    }
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

  const handleSelected = (id: number) => {
    setSelectedId(id);
    setNewDivision({
      city: city,
      coords: "",
      address: "",
      metro: undefined,
      name: "",
      phone: "",
      timezone_difference: undefined,
      working_hours: workingHours,
    });
  };

  const selected = divisions.find(
    (division) => division.id === selectedId
  ) as Divisions2;

  const metro = park.metro_lines?.find(
    (x: Metro_lines) => x.city == city
  ).stations;

  return (
    <>
      <div className="">Подразделения</div>

      <div className="flex space-x-1">
        <div className="w-1/2 p-2 my-8 space-y-4 bg-white rounded-xl">
          <div className="flex flex-col items-center justify-start space-x-2">
            {divisions.length === 0 && (
              <div className="">
                <div className="">Подразделений еще нет</div>
              </div>
            )}
            {divisions.map((x, i) => (
              <div className="" key={`division_${i}`}>
                <div className="" onClick={() => handleSelected(x!.id!)}>
                  {x.name}
                </div>
                <Separator />
              </div>
            ))}
          </div>
          <Button className="w-64 text-lg" onClick={() => handleSelected(0)}>
            Создать
          </Button>
        </div>

        <div className="w-1/2 p-2 my-8 space-y-4 bg-white rounded-xl">
          {selectedId === 0 && <h3 className="my-4">Создание подразделения</h3>}
          {selectedId !== 0 && (
            <h3 className="my-4">Изменение подразделения</h3>
          )}
          <div className="">
            <h4>Город подразделения : {selected?.city}</h4>
            <div className="flex items-center gap-2">
              Новое значение:
              <div className="p-2 cursor-pointer bg-grey rounded-xl w-fit">
                <CityPicker />
              </div>
            </div>
          </div>
          {[
            {
              title: `Координаты подразделения ${selected?.coords || ""}`,
              type: "text",
              placeholder: "00.000, 00.000",
              param: "coords",
              value: selected?.coords,
            },
            {
              title: `Адрес подразделения ${selected?.address || ""}`,
              type: "text",
              placeholder: "г. Москва, ул. ...",
              param: "address",
              value: selected?.address || "",
            },
            {
              title: `Название подразделения ${selected?.name || ""}`,
              type: "text",
              placeholder: "Введите значение",
              param: "name",
              value: selected?.name || "",
            },
            {
              title: `Часовой пояс ${selected?.timezone_difference || ""}`,
              type: "number",
              placeholder: "Введите значение",
              param: "timezone_difference",
              value: selected?.timezone_difference || undefined,
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
          {!!metro.length && (
            <div className="">
              <h4>Ближайшее метро: {selected?.metro}</h4>

              <ArrayStringSelect
                list={metro}
                onChange={(value) =>
                  handleInputNewDivisionChange(value, "metro")
                }
                resultValue={
                  newDivision.metro || selected?.metro || "Не выбрано"
                }
              />
            </div>
          )}
          <div className="">
            <h4>Телефон подразделения : {selected?.phone || ""}</h4>
            <PhoneInput onChange={(e) => setNewDivisionPhone(e.target.value)} />
          </div>
          <div className="">
            <h4>Время работы:</h4>
            <div className="flex flex-wrap">
              {Object.keys(DayOfWeek).map((x) => {
                const day = DayOfWeek[x as keyof typeof DayOfWeek];
                let item =
                  selectedId === 0
                    ? workingHours.find(
                        (workingHour) => workingHour.day === day
                      )
                    : selected!.working_hours!.find(
                        (workingHour) => workingHour.day === day
                      );
                if (!item && selectedId === 0) {
                  item = new Working_hours2({
                    day: day,
                    start: new Start2({
                      minutes: 0,
                      hours: 10,
                    }),
                    end: new End2({
                      minutes: 0,
                      hours: 22,
                    }),
                  });
                  setWorkingHours([...workingHours, item as Working_hours2]);
                }

                return (
                  <div className="flex flex-col items-start w-1/2" key={x}>
                    <div className="w-80">
                      <p className="capitalize">
                        {getDayOfWeekDisplayName(x as any)}:
                      </p>
                      {!nonWorkingDay.includes(day) && (
                        <div className="">
                          <div className="flex items-center space-x-2">
                            <p>Начало:</p>
                            <Input
                              className="w-10 p-0 m-0 text-center"
                              onChange={(e) => {
                                const updatedWorkingHours = workingHours.map(
                                  (workingHour) => {
                                    if (workingHour.day === day) {
                                      return new Working_hours2({
                                        ...workingHour,
                                        start: new Start2({
                                          minutes:
                                            workingHour.start?.minutes || 0,
                                          hours: Number(e.target.value),
                                        }),
                                      });
                                    }
                                    return workingHour;
                                  }
                                );
                                setWorkingHours(updatedWorkingHours);
                              }}
                              type="number"
                              placeholder={String(item?.start!.hours) ?? "ч"}
                            ></Input>
                            <p>:</p>
                            <Input
                              className="w-10 p-0 m-0 text-center"
                              onChange={(e) => {
                                const updatedWorkingHours = workingHours.map(
                                  (workingHour) => {
                                    if (workingHour.day === day) {
                                      return new Working_hours2({
                                        ...workingHour,
                                        start: new Start2({
                                          minutes: Number(e.target.value),
                                          hours: workingHour.start?.hours || 0,
                                        }),
                                      });
                                    }
                                    return workingHour;
                                  }
                                );
                                setWorkingHours(updatedWorkingHours);
                              }}
                              type="number"
                              placeholder={String(item?.start!.minutes) ?? "м"}
                            ></Input>
                          </div>
                          <div className="flex items-center space-x-2 space-y-1">
                            <p>Конец:</p>
                            <Input
                              className="w-10 p-0 m-0 text-center"
                              onChange={(e) => {
                                const updatedWorkingHours = workingHours.map(
                                  (workingHour) => {
                                    if (workingHour.day === day) {
                                      return new Working_hours2({
                                        ...workingHour,
                                        end: new End2({
                                          minutes: workingHour.end?.hours || 0,
                                          hours: Number(e.target.value),
                                        }),
                                      });
                                    }
                                    return workingHour;
                                  }
                                );
                                setWorkingHours(updatedWorkingHours);
                              }}
                              type="number"
                              placeholder={String(item?.end!.hours) ?? "ч"}
                            ></Input>
                            <p>:</p>
                            <Input
                              className="w-10 p-0 m-0 text-center"
                              onChange={(e) => {
                                const updatedWorkingHours = workingHours.map(
                                  (workingHour) => {
                                    if (workingHour.day === day) {
                                      return new Working_hours2({
                                        ...workingHour,
                                        end: new End2({
                                          minutes: Number(e.target.value),
                                          hours: workingHour.end?.hours || 0,
                                        }),
                                      });
                                    }
                                    return workingHour;
                                  }
                                );
                                setWorkingHours(updatedWorkingHours);
                              }}
                              type="number"
                              placeholder={String(item?.end!.minutes) ?? "м"}
                            ></Input>
                          </div>
                        </div>
                      )}
                      <div className="flex items-center space-x-2">
                        <p className="w-fit">Выходной</p>
                        <Input
                          className="w-4 m-0"
                          type="checkbox"
                          onChange={(e) =>
                            e.target.checked
                              ? setNonWorkingDay([
                                  ...nonWorkingDay.filter(
                                    (value) => value !== day
                                  ),
                                  day,
                                ])
                              : setNonWorkingDay([
                                  ...nonWorkingDay.filter(
                                    (value) => value !== day
                                  ),
                                ])
                          }
                        />
                      </div>
                    </div>
                    <Separator className="my-2" />
                  </div>
                );
              })}
            </div>
          </div>
          {selectedId === 0 && (
            <Confirmation
              accept={() => createDivision()}
              cancel={() => {}}
              trigger={<Button className="w-60">Применить</Button>}
              title={"Создать подразделение?"}
              type="green"
            />
          )}
          {selectedId !== 0 && (
            <Confirmation
              accept={() => updateDivision()}
              cancel={() => {}}
              trigger={<Button className="w-60">Применить</Button>}
              title={"Изменить подразделение?"}
              type="green"
            />
          )}
        </div>
      </div>
    </>
  );
};

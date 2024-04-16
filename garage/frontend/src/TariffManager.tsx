import { useState } from "react";
import { useRecoilState } from "recoil";
import { CarClass, Tariffs, IPark2, Body33 } from "./api-client";
import { cityAtom, parkAtom } from "./atoms";
import { client } from "./backend";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import Confirmation from "@/components/ui/confirmation";
import { CityPicker } from "./CityPicker";
import { getCarClassDisplayName } from "@/lib/utils";

export const TariffManager = () => {
  const [city] = useRecoilState(cityAtom);
  const [park, setPark] = useRecoilState(parkAtom);
  // const [selectedId, setSelectedId] = useState(0);

  const [newTariff, setNewTariff] = useState({
    class: CarClass.Economy,
    city: city,
    has_caused_accident: false,
    experience: 0,
    max_fine_count: 999,
    abandoned_car: false,
    min_scoring: 0,
    is_north_caucasus: false,
    criminal_ids: [],
    alcohol: false,
  });

  const getPark = async () => {
    const parkData: IPark2 = await client.getParkManager();
    setPark(parkData.park);
  };

  const createTariff = async () => {
    let criminal_ids = newTariff.criminal_ids as any;
    criminal_ids =
      criminal_ids.lenth > 0
        ? criminal_ids.split(",").map((x: any) => Number(x))
        : [];
    try {
      await client.createTariffManager(
        new Body33({
          ...newTariff!,
          criminal_ids: criminal_ids as any,
        })
      );
      getPark();
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
    // setPark({
    //   ...park,

    //   tariffs: [
    //     ...tariffs!,
    //     new Tariffs({
    //       ...newTariff,
    //       id: newTariffData.id,
    //     }),
    //   ],
    // });
  };

  const handleInputNewTariffChange = (
    value: string | boolean,
    param: keyof Tariffs
  ) => {
    setNewTariff({
      ...newTariff,
      [param]: value,
    });
  };

  const tariffs = park!.tariffs;

  // const selected = tariffs!.find((tariff) => tariff.id === selectedId);

  if (!tariffs) {
    return <></>;
  }

  return (
    <>
      <div className="">Тарифы (требования к водителям)</div>

      <div className="flex space-x-1">
        <div className="flex-col w-1/2 p-2 my-8 space-y-4 bg-white rounded-xl">
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
          <Button className="w-64 text-lg">
            {/* <Button className="w-64 text-lg" onClick={() => setSelectedId(0)}> */}
            Создать
          </Button>
        </div>
        <div className="w-1/2 p-2 my-8 space-y-4 bg-white rounded-xl">
          <h3 className="my-4">Создание тарифа</h3>
          <div className="">
            <h4>Город тарифа:</h4>
            <div className="p-2 cursor-pointer bg-grey rounded-xl w-fit">
              <CityPicker />
            </div>
          </div>
          <div className="w-full">
            <select
              name=""
              className="px-6 py-2 bg-grey rounded-xl"
              id=""
              onChange={(e) =>
                setNewTariff({
                  ...newTariff,
                  class: e.target.value as CarClass,
                })
              }
            >
              {Object.keys(CarClass).map((x) => (
                <option value={x} key={x}>
                  {getCarClassDisplayName(x as CarClass)}
                </option>
              ))}
            </select>
            {/* <Select
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
            </Select> */}
          </div>
          {[
            {
              title: "ДТП по вине водителя",
              type: "checkbox",
              placeholder: "г. Москва, ул. ...",
              param: "has_caused_accident",
              value: false,
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
              value: false,
            },
            {
              title: "Минимальный скоринг",
              type: "number",
              placeholder: "Введите значение",
              param: "min_scoring",
              value: newTariff.min_scoring || 3,
            },
            {
              title: "Северный кавказ",
              type: "checkbox",
              placeholder: "Введите значение",
              param: "is_north_caucasus",
              value: false,
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
                className={`${input.type === "checkbox" && "flex w-6 m-0 "}`}
                onChange={(e) =>
                  input.type === "checkbox"
                    ? handleInputNewTariffChange(e.target.checked, input.param)
                    : handleInputNewTariffChange(e.target.value, input.param)
                }
                type={input.type}
                placeholder={input.placeholder}
              ></Input>
            </div>
          ))}

          <Confirmation
            accept={() => createTariff()}
            cancel={() => {}}
            trigger={<Button className="w-60">Применить</Button>}
            title={"Создать тариф?"}
            type="green"
          />
        </div>
      </div>
    </>
  );
};

import { useRecoilState } from "recoil";
import { parkAtom } from "./atoms";

import { Separator } from "@/components/ui/separator";
import { Body25, Body36, Body37, CarStatus, Cars2, Cars4 } from "./api-client";
import { useState } from "react";
import SliderImages from "@/components/ui/slider-images";
import { faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { client } from "./backend";
import Confirmation from "@/components/ui/confirmation";

export const CarsManager = () => {
  const [park, setPark] = useRecoilState(parkAtom);
  const [selected, setSelected] = useState<Cars4>();
  const [ids, setIds] = useState<number[]>([]);
  const [divisionId, setDivisionId] = useState<number | undefined>(
    park.divisions![0]?.id || undefined
  );
  const [tariffId, setTariffId] = useState<number | undefined>(
    park.tariffs![0]?.id || undefined
  );
  const [rentTermId, setRentTermId] = useState<number | undefined>(
    park.rent_terms![0]?.id || undefined
  );
  const [assignedType, setAssignedType] = useState<string | undefined>();

  const sortedCars = [...park.cars!].sort((a, b) => {
    if (a.brand === b.brand) {
      if (a.model! > b.model!) return 1;
      if (a.model! < b.model!) return -1;
      return 0;
    } else {
      if (a.brand! > b.brand!) return 1;
      if (a.brand! < b.brand!) return -1;
    }
    return 0;
  });

  const addDivisionToCars = async () => {
    await client.assignCarsToDivisionManager(
      new Body36({ division_id: divisionId, car_ids: ids })
    );
    window.location.href = "/cars";
  };

  const addTariffToCars = async () => {
    await client.assignCarsToTariffManager(
      new Body37({ tariff_id: tariffId, car_ids: ids })
    );
    window.location.href = "/cars";
  };

  const addRentTermToCars = async () => {
    await client.assignCarsToRentTermManager(
      new Body25({ rent_term_id: rentTermId, car_ids: ids })
    );
    window.location.href = "/cars";
  };

  const handleCheckboxes = (state: boolean, id: number) => {
    if (state) {
      setIds([...ids.filter((x) => x !== id), id]);
    }
    if (!state) {
      setIds([...ids.filter((x) => x !== id)]);
    }
  };

  return (
    <>
      <div className="">Авто</div>
      <div className="flex space-x-8">
        <div className="">
          <FontAwesomeIcon
            icon={faTriangleExclamation}
            className="text-yellow"
          />{" "}
          - авто скрыто
        </div>
        <div className="">
          <FontAwesomeIcon icon={faTriangleExclamation} className="text-red" />{" "}
          - не вся информация об авто заполнена
        </div>
        <div className="flex flex-wrap w-1/2 gap-2">
          {[
            { type: "division", text: "Привязать подразделение" },
            { type: "tariff", text: "Привязать тариф" },
            { type: "rent_term", text: "Привязать условия аренды" },
            { type: "ptotos", text: "Загрузить фото" },
          ].map((x) => (
            <Button
              key={x.type}
              variant={"manager"}
              onClick={() => setAssignedType(x.type)}
            >
              {x.text}
            </Button>
          ))}
        </div>
      </div>

      {assignedType === "division" && (
        <div className="w-1/3 p-2 my-8 space-y-4 bg-white rounded-xl">
          Подразделение:
          <select
            name=""
            id=""
            onChange={(e) => setDivisionId(Number(e.target.value))}
          >
            {park.divisions?.map((y) => (
              <option key={y.id} value={y.id}>
                {y.city} {y.name}
              </option>
            ))}
          </select>
          <Confirmation
            accept={addDivisionToCars}
            cancel={() => {}}
            title="Привязапь подразделение"
            trigger={<Button variant={"manager"}>Привязать</Button>}
            type="green"
          />
        </div>
      )}

      {assignedType === "tariff" && (
        <div className="w-1/3 p-2 my-8 space-y-4 bg-white rounded-xl">
          Тариф:
          <select
            name=""
            id=""
            onChange={(e) => setTariffId(Number(e.target.value))}
          >
            {park.tariffs?.map((y) => (
              <option key={y.id} value={y.id}>
                {y.city} {y.class}
              </option>
            ))}
          </select>
          <Confirmation
            accept={addTariffToCars}
            cancel={() => {}}
            title="Привязапь тариф"
            trigger={<Button variant={"manager"}>Привязать</Button>}
            type="green"
          />
        </div>
      )}

      {assignedType === "rent_term" && (
        <div className="w-1/3 p-2 my-8 space-y-4 bg-white rounded-xl">
          Тариф:
          <select
            name=""
            id=""
            onChange={(e) => setRentTermId(Number(e.target.value))}
          >
            {park.rent_terms?.map((y) => (
              <option key={y.id} value={y.id}>
                {y.name}
              </option>
            ))}
          </select>
          <Confirmation
            accept={addRentTermToCars}
            cancel={() => {}}
            title="Привязапь условия"
            trigger={<Button variant={"manager"}>Привязать</Button>}
            type="green"
          />
        </div>
      )}

      <div className="flex space-x-1">
        <div className="w-1/3 p-2 my-8 space-y-4 bg-white rounded-xl">
          <div className="flex flex-col items-center justify-between gap-1">
            {sortedCars!.map((car) => {
              const infoIsFull = Object.values(car).some(
                (value) => value === null
              );
              const hidden = car.status === CarStatus.Hidden;

              return (
                <div key={car.id} className="w-full">
                  <div className="">
                    <div className="flex justify-between px-2">
                      <div className="flex items-center gap-1">
                        {hidden && (
                          <FontAwesomeIcon
                            icon={faTriangleExclamation}
                            className="text-yellow"
                          />
                        )}
                        {infoIsFull && (
                          <FontAwesomeIcon
                            icon={faTriangleExclamation}
                            className="text-red"
                          />
                        )}
                        <div
                          className={`${
                            selected?.id === car.id ? "text-yellow" : ""
                          }`}
                          onClick={() => setSelected(car!)}
                        >
                          {car.brand} {car.model} {car.license_plate}
                        </div>
                      </div>
                      <Input
                        className="flex w-6 m-0"
                        type="checkbox"
                        onChange={(e) =>
                          handleCheckboxes(e.target.checked, car.id)
                        }
                      ></Input>
                    </div>
                  </div>
                  <Separator className="my-1" />
                </div>
              );
            })}
          </div>
        </div>

        {selected && (
          <div className="w-2/3 p-2 my-8 space-y-4 bg-white rounded-xl">
            <h3>VIN: {selected.vin}</h3>
            <p>Г/н: {selected.license_plate}</p>
            <p>Марка: {selected.brand}</p>
            <p>Модель: {selected.model}</p>
            <p>
              Подразделение:{" "}
              {park.divisions!.find((x) => x.id === selected.division_id!)
                ?.name || "еще нет"}
            </p>
            {!selected.images && <p>Фото: еще нет</p>}
            {selected.images && (
              <SliderImages
                classImages=""
                type="click"
                classPaginationImages=""
                images={selected.images}
                openIsAffordable={false}
              />
            )}
            <p>
              Условия аренды:{" "}
              {park.rent_terms!.find((x) => x.id === selected.rent_term_id!)
                ?.name || "еще нет"}
            </p>
            <p>
              Тариф:{" "}
              {park.tariffs!.find((x) => x.id === selected.tariff_id!)?.class ||
                "еще нет"}
            </p>
          </div>
        )}
      </div>
    </>
  );
};

import { useState, useEffect } from "react";
import { useRecoilState } from "recoil";
import {
  UserType,
  IPark2,
  Divisions2,
  Tariffs,
  IRent_terms,
  Body3,
  Working_hours,
  Body5,
  Body6,
  Schemas,
  Body,
  Park2,
} from "./api-client";
import { userAtom } from "./atoms";
import { client } from "./backend";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";

type VariantItem = { name: string; id: number | null };

export const ParkManager = () => {
  const [user] = useRecoilState(userAtom);
  const [park, setPark] = useState<IPark2 | undefined>();
  const [parkInfo, setParkInfo] = useState<IPark2 | undefined>();
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

  const createDivision = async (
    address: string,
    city: string,
    coords: string,
    metro: string,
    name: string,
    phone: string,
    timezone_difference: number,
    working_hours: Working_hours[]
  ) => {
    try {
      const newDivisionData = await client.createParkDivision(
        new Body3({
          address,
          city,
          coords,
          metro,
          name,
          phone,
          timezone_difference,
          working_hours,
        })
      );
      setPark({
        ...park![0],

        divisions: [
          ...divisions,

          {
            address,
            city,
            coords,
            metro,
            name,
            phone,
            timezone_difference,
            working_hours,
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

  const apcertRentTerm = async (
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

        setPark({ ...park![0], ...parkInfo });
      } catch (error) {}
    }
  };
  if (user.user_type !== UserType.Manager) {
    return <></>;
  }
  if (!park || !parkInfo) {
    return <></>;
  }

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

  return (
    <>
      <div className="flex justify-end h-full mt-4">
        <div className="flex justify-between w-full space-x-4 cursor-pointer sm:mx-0 sm:w-full sm:space-x-8 sm:max-w-[800px] sm:justify-between lg:max-w-[1104px]">
          <div className="flex items-center text-sm font-black tracking-widest sm:text-xl">
            МОЙ ГАРАЖ
          </div>
          <div className="flex items-center justify-end space-x-4 text-xl font-semibold">
            {park.park_name}
          </div>
        </div>
      </div>
      <div className="flex space-x-1">
        <div className="w-1/2 p-2 my-8 space-y-4 bg-white rounded-xl">
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
            ))}{" "}
            <Button className="w-1/3">Создать</Button>
          </div>
          <Separator />
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
            <Button className="w-1/3">Создать</Button>
          </div>
          <Separator />
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
            <Button className="w-1/3">Создать</Button>
          </div>
        </div>
        <div className="w-1/2 p-2 my-8 space-y-4 bg-white rounded-xl">
          {selectedVariant.name === "park" && (
            <div className="">
              <h3>Инфо парка {park.park_name}</h3>
              <div className="">
                <div className="">
                  <h4>Описание парка:</h4>
                  <p>{park.about ? park.about : "Описания еще нет"}</p>
                  <Input
                    onChange={(e) => (parkInfo.about = e.target.value)}
                    type="textarea"
                    placeholder="Введите новое значение"
                  ></Input>
                </div>
                <div className="">
                  <h4>Комиссия парка:</h4>
                  <p>
                    {park.commission ? park.commission : "Комиссии еще нет"}
                  </p>
                  <Input
                    onChange={(e) =>
                      (parkInfo!.commission = Number(e.target.value))
                    }
                    type="number"
                    placeholder="Введите новое значение"
                  ></Input>
                </div>
                <div className="">
                  <h4>URL парка для API:</h4>
                  <p>{park.url ? park.url : "URL еще нет"}</p>
                  <Input
                    onChange={(e) => (parkInfo.url = e.target.value)}
                    type="text"
                    placeholder="Введите новое значение"
                  ></Input>
                </div>
                <div className="">
                  <h4>Время брони парка в часах:</h4>
                  <p>{park.period_for_book}</p>
                  <Input
                    onChange={(e) =>
                      (parkInfo.period_for_book = Number(e.target.value))
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
          )}
          {selectedVariant.name === "division" && (
            <div className="">Инфо подразделения {selectedDivision?.name}</div>
          )}
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

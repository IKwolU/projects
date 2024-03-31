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
} from "./api-client";
import { userAtom } from "./atoms";
import { client } from "./backend";
import { Button } from "@/components/ui/button";

export const ParkManager = () => {
  const [user] = useRecoilState(userAtom);
  const [park, setPark] = useState<IPark2 | undefined>();

  useEffect(() => {
    if (user.user_type === UserType.Manager) {
      const getPark = async () => {
        try {
          const parkData = await client.getPark();
          setPark(parkData.park![0]);
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
      setPark([
        ...park![0],
        [
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
      ]);
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
      setPark([
        ...park![0],
        [
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
      ]);
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

      setPark([
        ...park![0],
        [
          ...tariffs.filter((tariff) =>
            rent_term_id ? tariff.id !== rent_term_id : tariff
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
      ]);
    } catch (error) {}
  };

  if (user.user_type !== UserType.Manager) {
    return <></>;
  }
  if (!park) {
    return <></>;
  }

  const divisions = park!.divisions! as Divisions2[];
  const tariffs = park!.tariffs as Tariffs[];
  const rentTerms = park!.rent_terms as IRent_terms[];

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
      <div className="w-1/2 p-2 my-8 space-y-4 bg-white rounded-xl">
        <div className="flex space-x-2">
          <div className="">
            <div className="">Инфо парка</div>
          </div>

          <Button>Показать API-ключ</Button>
        </div>
        <div className="flex space-x-2">
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
          <Button>Создать</Button>
        </div>
        <div className="flex space-x-2">
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
          <Button>Создать</Button>
        </div>
        <div className="flex space-x-2">
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
          <Button className="">Создать</Button>
        </div>
      </div>
    </>
  );
};

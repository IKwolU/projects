import { useState, useEffect } from "react";
import { useRecoilState } from "recoil";
import { UserType, IPark2, Body, IBody5, IBody3 } from "./api-client";
import { cityAtom, parkAtom, userAtom } from "./atoms";
import { client } from "./backend";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Link, Navigate, Route, Routes } from "react-router-dom";
import { DivisionManager } from "./DivisionManager";
import { RentTermManager } from "./RentTermManager";

type VariantItem = { name: string; id: number | null };
type MainMenuItem = {
  name: string;
  path: string;
};

export const ParkManager = () => {
  const [user] = useRecoilState(userAtom);
  const [park, setPark] = useRecoilState(parkAtom);
  const [parkInfo, setParkInfo] = useState<IPark2 | undefined>();
  const [isKeyShowed, setIsKeyShowed] = useState(false);

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
        <Route path={`/divisions`} element={<DivisionManager />} />
        <Route path={`/rent_terms`} element={<RentTermManager />} />
        {/* <Route path={`/tariffs`} element={<Tariffs />} />
        <Route path={`/cars`} element={<Cars />} />  */}
      </Routes>
    </>
  );
};

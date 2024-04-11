import { useEffect } from "react";
import { useRecoilState } from "recoil";
import { UserType, IPark2 } from "./api-client";
import { parkAtom, userAtom } from "./atoms";
import { client } from "./backend";
import { Link, Navigate, Route, Routes } from "react-router-dom";
import { DivisionManager } from "./DivisionManager";
import { RentTermManager } from "./RentTermManager";
import { TariffManager } from "./TariffManager";
import { CarsManager } from "./CarsManager";
import { Info } from "./InfoManager";

type MainMenuItem = {
  name: string;
  path: string;
};

export const ParkManager = () => {
  const [user] = useRecoilState(userAtom);
  const [park, setPark] = useRecoilState(parkAtom);

  useEffect(() => {
    if (user.user_type === UserType.Manager && !park) {
      const getPark = async () => {
        const parkData: IPark2 = await client.getParkManager();
        setPark(parkData.park);
      };

      getPark();
    }
  }, []);

  if (user.user_type !== UserType.Manager) {
    return <></>;
  }
  if (!park) {
    return <></>;
  }

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
        <Route path={`/tariffs`} element={<TariffManager />} />
        <Route path={`/cars`} element={<CarsManager />} />
      </Routes>
    </>
  );
};

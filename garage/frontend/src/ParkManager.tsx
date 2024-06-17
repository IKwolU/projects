import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import {
  UserType,
  IPark2,
  Parks3,
  UserRole,
  Body51,
  Body42,
} from "./api-client";
import { applicationsAtom, parkAtom, parkListsAtom, userAtom } from "./atoms";
import { client } from "./backend";
import { NavLink, Navigate, Route, Routes } from "react-router-dom";
import { DivisionManager } from "./DivisionManager";
import { RentTermManager } from "./RentTermManager";
import { TariffManager } from "./TariffManager";
import { CarsManager } from "./CarsManager";
import { InfoManager } from "./InfoManager";
import { BookingManager } from "./BookingsManager";
import { StatusesManager } from "./StatusesManager";
import Confirmation from "@/components/ui/confirmation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { BookingKanban } from "./BookingKanban";
import ArrayStringSelect from "./ArrayStringSelect";
import { BookingNotifications } from "./BookingNotifications";

type MainMenuItem = {
  name: string;
  path: string;
};

export const ParkManager = () => {
  const [user] = useRecoilState(userAtom);
  const [park, setPark] = useRecoilState(parkAtom);
  const [, setApplications] = useRecoilState(applicationsAtom);
  const [, setParkLists] = useRecoilState(parkListsAtom);

  const [parksInitData, setParksInitData] = useState<Parks3[] | undefined>();

  const LogoutHandler = () => {
    client.logout();
    localStorage.clear();
    window.location.href = "/";
  };

  const getParkLists = async () => {
    const data = await client.getParkInventoryListsManager();
    setParkLists(data.lists!);
  };

  const getPark = async () => {
    const parkData: IPark2 = await client.getParkManager();
    setPark(parkData.park);

    if (user.user_role === UserRole.Admin) {
      const getParksInitData = async () => {
        const data = await client.getParksInitDataSuperManager();
        setParksInitData(data.parks);
      };
      getParksInitData();
    }
  };

  const getApplications = async () => {
    const data = await client.getParkApplicationsManager(
      new Body42({ last_update_time: undefined })
    );
    setApplications(data.applications!);
  };

  useEffect(() => {
    if (user.user_type === UserType.Manager && !park) {
      getPark();
      getApplications();
      getParkLists();
    }
  }, []);

  const selectPark = async (value: string) => {
    await client.selectParkForSuperManager(
      new Body51({
        id: parksInitData?.find((x) => x.park_name === value)!.id,
      })
    );
    getPark();
    window.location.href = "/";
  };

  if (user.user_type !== UserType.Manager) {
    return <></>;
  }
  if (!park) {
    return <></>;
  }

  return (
    <>
      <div className="flex justify-end h-full mt-4">
        {parksInitData && (
          <div className="absolute z-10 top-2 right-2">
            <div className="w-44">
              <ArrayStringSelect
                list={parksInitData.map((x) => x.park_name!)}
                onChange={(value) => selectPark(value)}
                resultValue={park.park_name!}
              />
            </div>{" "}
          </div>
        )}

        <div className="flex justify-between w-full space-x-4 cursor-pointer sm:mx-0 sm:w-full sm:space-x-8 sm:max-w-[800px] sm:justify-between lg:max-w-[1208px]">
          <div className="flex flex-col items-center text-sm font-black tracking-widest sm:text-xl max-w-10">
            BeeBeep
            <div className="">{park.park_name}</div>
          </div>

          <div className="flex justify-end m-0 space-x-6">
            {[
              { name: "Инфо", path: "/info" },
              { name: "Подразделения", path: "/divisions" },
              { name: "Условия аренды", path: "/rent_terms" },
              { name: "Тарифы", path: "/tariffs" },
              { name: "Автомобили", path: "/cars" },
              { name: "Статусы", path: "/statuses" },
              { name: "Бронь", path: "/bookings" },
              { name: "Заявки", path: "/kanban" },
              { name: "Напоминания", path: "/notifications" },
            ].map(({ name, path }: MainMenuItem, i) => (
              <div key={`menu_${i}`} className="flex ">
                <NavLink
                  className={({ isActive }) =>
                    isActive
                      ? "text-black transition-colors flex items-center"
                      : "text-gray transition-colors flex items-center"
                  }
                  to={path}
                >
                  <span className="text-lg font-semibold transition-colors hover:text-yellow">
                    {name}
                  </span>
                </NavLink>
              </div>
            ))}
          </div>
          <div className="flex items-center text-black cursor-pointer">
            <Confirmation
              accept={LogoutHandler}
              cancel={() => {}}
              title="Выйти из аккаунта?"
              trigger={
                <div className="flex items-center p-2 cursor-pointer hover:bg-grey hover:rounded-md">
                  <FontAwesomeIcon
                    icon={faArrowRightFromBracket}
                    className="h-4 mr-2 transition-all duration-300 rounded-md sm:h-5"
                  />
                  <span>Выйти</span>
                </div>
              }
              type="red"
            />
          </div>
        </div>
      </div>

      <Routes>
        <Route path="/*" element={<Navigate to="/info" replace={true} />} />
        <Route path={`/info`} element={<InfoManager />} />
        <Route path={`/divisions`} element={<DivisionManager />} />
        <Route path={`/rent_terms`} element={<RentTermManager />} />
        <Route path={`/tariffs`} element={<TariffManager />} />
        <Route path={`/cars`} element={<CarsManager />} />
        <Route path={`/statuses`} element={<StatusesManager />} />
        <Route path={`/bookings`} element={<BookingManager />} />
        <Route path={`/kanban`} element={<BookingKanban />} />
        <Route path={`/notifications`} element={<BookingNotifications />} />
      </Routes>
    </>
  );
};

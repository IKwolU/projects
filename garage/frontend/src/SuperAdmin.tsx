import { useRecoilState } from "recoil";
import { userAtom } from "./atoms";
import { Parks, UserType, Users } from "./api-client";
import { useEffect, useState } from "react";
import { client } from "./backend";
import { Link, Route, Routes, useLocation } from "react-router-dom";
import { Park } from "./Park";

export const SuperAdmin = () => {
  const [user] = useRecoilState(userAtom);
  const [parks, setParks] = useState<Parks[] | undefined>();
  const [users, setUsers] = useState<Users[] | undefined>();
  const [selectedVariant, setSelectedVariant] = useState<"parks" | "users">(
    "parks"
  );
  useEffect(() => {
    if (user.user_type === UserType.Admin) {
      const getParks = async () => {
        try {
          const parksData = await client.getParks();
          setParks(parksData.parks);
        } catch (error) {}
      };
      const getUsers = async () => {
        try {
          const usersData = await client.getUsers();
          setUsers(usersData.users);
        } catch (error) {}
      };
      getParks();
      getUsers();
    }
  }, []);
  if (user.user_type !== UserType.Admin) {
    return <></>;
  }
  if (!parks || !users) {
    return <></>;
  }

  return (
    <>
      {window.location.pathname === "/" && (
        <div className="flex justify-end h-full mt-4">
          <div className="fixed left-0 w-1/4 h-full bg-white top-16">
            <ul className="flex flex-col items-center justify-center py-6 space-y-2">
              <li
                className="cursor-pointer"
                onClick={() => setSelectedVariant("parks")}
              >
                Парки
              </li>
              <li
                className="cursor-pointer"
                onClick={() => setSelectedVariant("users")}
              >
                Пользователи
              </li>
            </ul>
          </div>
          {selectedVariant === "parks" && (
            <div className="w-3/4 h-full py-6 space-y-2">
              {parks.map((x, i) => (
                <div
                  key={`park_${i}`}
                  className="flex flex-col items-start justify-start "
                >
                  <Link
                    className="flex items-center hover:text-yellow"
                    to={`/${x.park_name || `Park_${i}`}`}
                  >
                    {x.park_name || `Park_${i}`}
                  </Link>
                </div>
              ))}
            </div>
          )}
          {selectedVariant === "users" && (
            <div className="w-3/4 h-full py-6 space-y-2">
              {users.map((x, i) => (
                <div
                  key={`user_${i}`}
                  className="flex flex-col items-start justify-start "
                >
                  <Link
                    className="flex items-center hover:text-yellow"
                    to={x.phone!}
                  >
                    {x.phone}
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      <Routes>
        {parks.map((x, i) => (
          <Route
            key={`park_link_${i}`}
            path={`/${x.park_name || `Park_${i}`}`}
            element={<Park park={x} />}
          />
        ))}
      </Routes>
    </>
  );
};

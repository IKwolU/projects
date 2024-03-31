import { Link } from "lucide-react";
import { useState, useEffect } from "react";
import { useRecoilState } from "recoil";
import { UserType, Park } from "./api-client";
import { userAtom } from "./atoms";
import { client } from "./backend";

type MainMenuItem = {
  name: string;
  path: string;
};

export const ParkManager = () => {
  const [user] = useRecoilState(userAtom);
  const [park, setPark] = useState<Park[] | undefined>();
  useEffect(() => {
    if (user.user_type === UserType.Manager) {
      const getPark = async () => {
        try {
          const parkData = await client.getPark();
          setPark(parkData.park);
        } catch (error) {}
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
            МОЙ ГАРАЖ
          </div>
          <div className="flex justify-end space-x-4 ">
            {[
              { name: "Парки", path: "parks" },
              { name: "Пользователи", path: "users" },
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
        </div>
      </div>
    </>
  );
};

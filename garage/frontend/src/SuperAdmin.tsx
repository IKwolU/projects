import { useRecoilState, useSetRecoilState } from "recoil";
import { userAtom } from "./atoms";
import { Parks, UserType } from "./api-client";
import { useEffect, useState } from "react";
import { client } from "./backend";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export const SuperAdmin = () => {
  const [user, setUser] = useRecoilState(userAtom);
  const [parks, setParks] = useState<Parks[] | undefined>();
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

      getParks();
    }
  }, []);

  if (user.user_type !== UserType.Admin) {
    return <></>;
  }
  if (!parks) {
    return <></>;
  }
  return (
    <>
      <div className="flex justify-end h-full mt-4">
        <div className="fixed left-0 w-1/4 h-full bg-white top-16">
          <ul>
            <li onClick={() => setSelectedVariant("parks")}>Парки</li>
            <li onClick={() => setSelectedVariant("users")}>Пользователи</li>
          </ul>
        </div>
        {selectedVariant === "parks" && (
          <div className="w-3/4 h-full">
            {parks.map((x, i) => (
              <div key={i} className="">
                {x.park_name}
              </div>
            ))}
          </div>
        )}
        {selectedVariant === "users" && (
          <div className="w-3/4 h-full">
            {parks.map((x, i) => (
              <div key={i} className="">
                {x.park_name}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

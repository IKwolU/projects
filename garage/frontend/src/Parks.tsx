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
            <li>Парки</li>
            <li>Пользователи</li>
          </ul>
        </div>
        <div className="w-3/4 h-full">
          {parks.map((x, i) => (
            <div key={i} className="">
              {x.park_name}
            </div>
          ))}
          {/* <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Главная</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Главная</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Подразделения</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb> */}
        </div>
      </div>
    </>
  );
};

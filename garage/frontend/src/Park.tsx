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

export const Park = ({ park }: { park: Parks }) => {
  const [user, setUser] = useRecoilState(userAtom);

  if (user.user_type !== UserType.Admin) {
    return <></>;
  }
  if (!park) {
    return <></>;
  }
  return (
    <>
      <div className="flex justify-end h-full mt-4">
        <div className="fixed left-0 w-1/4 h-full bg-white top-16">
          {/* <ul>
            <li>Парки</li>
            <li>Пользователи</li>
          </ul> */}
        </div>
        <div className="w-3/4 h-full">
          {/* {park.map((x, i) => (
            <div key={i} className="">
              {x.park_name}
            </div>
          ))} */}
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/admin">Главная</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{park.park_name}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>
    </>
  );
};

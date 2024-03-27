import { useRecoilState } from "recoil";
import { userAtom } from "./atoms";
import { Parks, UserType } from "./api-client";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useState } from "react";

export const Park = ({ park }: { park: Parks }) => {
  const [user] = useRecoilState(userAtom);
  const [selectedVariant, setSelectedVariant] = useState<
    "park" | "divisions" | "managers" | "tariffs" | "rent_terms"
  >("park");

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
          <ul>
            <li>Данные парка</li>
            <li>Подразделения</li>
            <li>Менеджеры</li>
            <li>Тарифы</li>
            <li>Условия аренды</li>
          </ul>
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
                <BreadcrumbLink href="/">Главная</BreadcrumbLink>
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

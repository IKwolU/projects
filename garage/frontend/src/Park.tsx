import { useRecoilState } from "recoil";
import { userAtom } from "./atoms";
import { UserType } from "./api-client";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useParams } from "react-router-dom";

export const Park = () => {
  const [user] = useRecoilState(userAtom);
  const { parkId } = useParams();

  if (user.user_type !== UserType.Admin) {
    return <></>;
  }

  return (
    <>
      <div className="flex justify-end h-full mt-4">
        <div className="fixed left-0 w-1/4 h-full bg-white top-16">
          <ul>
            <li>{parkId}</li>
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
                <BreadcrumbPage>парк</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>
    </>
  );
};

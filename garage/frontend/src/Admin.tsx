import { useRecoilState } from "recoil";
import { userAtom } from "./atoms";
import { Body15, Parks, UserType, Users } from "./api-client";
import { useEffect, useState } from "react";
import { client } from "./backend";
import { Link, Navigate, Route, Routes } from "react-router-dom";
import { Park } from "./Park";
import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogClose,
} from "@/components/ui/dialog";
import InputMask from "react-input-mask";
import { DialogFooter } from "@/components/ui/dialog";
import Confirmation from "@/components/ui/confirmation";
import { Input } from "@/components/ui/input";

type MainMenuItem = {
  name: string;
  path: string;
};

const PhoneInput = (props: any) => {
  return (
    <InputMask
      className={`w-full h-12 p-4 px-3 py-2 mt-1 mb-4 text-lg bg-white border rounded-md md:mt-2 border-slate-200 ring-offset-white 
      file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2
       focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950
        dark:ring-offset-slate-950 dark:placeholder:text-slate-400 dark:focus-visible:ring-slate-300`}
      mask="+7 (999) 999-99-99"
      value={props.value}
      onChange={props.onChange}
      type={"tel"}
      placeholder={"+7 (999) 123-45-67"}
    ></InputMask>
  );
};

export const Admin = () => {
  const [user] = useRecoilState(userAtom);
  const [parks, setParks] = useState<Parks[] | undefined>();
  const [users, setUsers] = useState<Users[] | undefined>();
  const [newParkPhone, setNewParkPhone] = useState("");
  const [newParkName, setNewParkName] = useState("");
  const [selectedVariant] = useState<"parks" | "users">("parks");

  useEffect(() => {
    if (user.user_type === UserType.Admin) {
      const getParks = async () => {
        const parksData = await client.getParks();
        setParks(parksData.parks);
      };
      const getUsers = async () => {
        const usersData = await client.getUsers();
        setUsers(usersData.users);
      };
      getParks();
      getUsers();
    }
  }, []);

  const createPark = async () => {
    const newPark: Parks = await client.createPark(
      new Body15({
        name: newParkName,
        manager_phone: newParkPhone,
      })
    );

    setParks([...parks!, newPark]);
  };

  if (user.user_type !== UserType.Admin) {
    return <></>;
  }
  if (!parks || !users) {
    return <></>;
  }

  return (
    <>
      <Routes>
        <Route
          path="/"
          element={<Navigate to="/parks" replace={true} />}
        ></Route>
      </Routes>
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
      <Routes>
        <Route
          path="/parks"
          element={
            <div className="w-3/4 h-full py-6 space-y-2">
              <p className="text-base">Парки:</p>
              {parks.map((x, i) => (
                <div
                  key={`park_${i}`}
                  className="flex flex-col items-start justify-start "
                >
                  <Link
                    className="flex items-center hover:text-yellow"
                    to={`/parks/${x.id}`}
                  >
                    {x.park_name}
                  </Link>
                </div>
              ))}
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="w-64 text-lg">Создать парк</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[800px]">
                  <div className="">
                    <h3 className="my-4">Создание парка</h3>
                    <p className="my-4">
                      Чтобы создать новы парк - введите его название и номер
                      телефона менеджера. Менеджер парка может получить API-ключ
                      после авторизации по номеру телефона.{" "}
                    </p>
                    <Input
                      className="w-full h-12 p-4 px-3 py-2 mt-1 text-lg bg-white border rounded-md md:mt-2 border-slate-200 ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950 dark:ring-offset-slate-950 dark:placeholder:text-slate-400 dark:focus-visible:ring-slate-300"
                      type="text"
                      placeholder="Название парка"
                      required
                      onChange={(e) => setNewParkName(e.target.value)}
                    ></Input>
                    <PhoneInput
                      className="w-full h-12 p-4 px-3 py-2 mt-1 text-lg bg-white border rounded-md md:mt-2 border-slate-200 ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950 dark:ring-offset-slate-950 dark:placeholder:text-slate-400 dark:focus-visible:ring-slate-300"
                      value={newParkPhone}
                      onChange={(e) => setNewParkPhone(e.target.value)}
                      placeholder={"+7 (999) 123-45-67"}
                      required
                    ></PhoneInput>
                    <Confirmation
                      accept={createPark}
                      cancel={() => {}}
                      trigger={<Button className="w-60">Применить</Button>}
                      title={"Создать парк?"}
                      type="green"
                    />
                  </div>

                  <DialogFooter>
                    <DialogClose asChild>
                      <div className="fixed bottom-0 left-0 flex justify-center w-full">
                        <div className="max-w-[800px] w-full flex justify-center bg-white border-t  border-pale px-4 py-4 space-x-2">
                          <div className="sm:max-w-[250px] w-full">
                            <Button>Назад</Button>
                          </div>
                        </div>
                      </div>
                    </DialogClose>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          }
        ></Route>

        <Route path={`/parks/:parkId`} element={<Park />} />
      </Routes>
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
    </>
  );
};

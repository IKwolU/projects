import { useState, useEffect } from "react";
import { useRecoilState } from "recoil";
import { UserType, IPark2, Body } from "./api-client";
import { parkAtom, userAtom } from "./atoms";
import { client } from "./backend";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";

export const InfoManager = () => {
  const [user] = useRecoilState(userAtom);
  const [park, setPark] = useRecoilState(parkAtom);
  const [parkInfo, setParkInfo] = useState<IPark2 | undefined>();
  const [parkKey, setParkKey] = useState<string>();
  const [isKeyShowed, setIsKeyShowed] = useState(false);

  useEffect(() => {
    if (user.user_type === UserType.Manager) {
      const getPark = async () => {
        const parkData: IPark2 = await client.getParkManager();
        setPark(parkData.park);
        setParkInfo({
          ...parkData.park,
          commission: parkData.park?.commission || 0,
          about: parkData.park?.about || "",
          url: parkData.park?.url || "",
          self_employed_discount: parkData.park?.self_employed_discount || 0,
          avito_id: parkData.park?.avito_id || "",
          telegram_id: parkData.park?.telegram_id || "",
        });
      };

      getPark();
    }
  }, []);

  const updateParkInfo = async () => {
    {
      await client.updateParkInfoManager(
        new Body({
          ...parkInfo![0],
          self_employed_discount: 0,
        })
      );

      setPark({ ...park, ...parkInfo![0] });
    }
  };

  const getParkKey = async () => {
    const data = await client.getParkKeyManager();
    setParkKey(data.aPI_key);
  };

  const handleKeyShow = () => {
    if (isKeyShowed && !parkKey) {
      getParkKey();
    }
    setIsKeyShowed(!isKeyShowed);
  };

  if (!parkInfo) {
    return <></>;
  }

  return (
    <div className="">
      <h3 className="">Инфо парка {park.park_name}</h3>
      <div className="">
        <div className="flex items-center justify-between space-x-2">
          <div className=""></div>

          <Button className="w-1/3" onClick={handleKeyShow}>
            {isKeyShowed ? "Скрыть ключ" : "Показать ключ"}
          </Button>
        </div>
        <Separator className="my-4" />
        {isKeyShowed && (
          <>
            <div className="flex items-center justify-between space-x-2">
              <div className="">
                <div className="">X-API-key:</div>
              </div>

              <div className="">{parkKey}</div>
            </div>
            <Separator />
          </>
        )}
        <div className="my-4">
          <h4>Описание парка:</h4>
          <div className="flex space-x-2">
            <p className="w-1/2 p-2 whitespace-pre-line bg-white border-2 border-pale rounded-xl">
              {park.about ? park.about : "Описания еще нет"}
            </p>
            <textarea
              className="flex w-1/2 p-1 border-2 resize-y rounded-xl border-pale"
              style={{ whiteSpace: "pre-line" }}
              onChange={(e) =>
                setParkInfo([{ ...parkInfo[0], about: e.target.value }])
              }
              placeholder="Введите новое значение"
            ></textarea>
          </div>
        </div>
        <Separator />
        <div className="flex justify-between my-4 space-x-12 ">
          <div className="">
            <h4>Комиссия парка:</h4>
            <div className="flex items-center space-x-2">
              <p className="p-2 bg-white border-2 border-pale rounded-xl">
                {park.commission ? park.commission + "%" : "Комиссии еще нет"}
              </p>
              <Input
                className="w-48 m-0 border-2 border-pale rounded-xl"
                onChange={(e) =>
                  setParkInfo([{ ...parkInfo[0], commission: e.target.value }])
                }
                type="number"
                placeholder="Введите новое значение"
              ></Input>
            </div>
          </div>
          <div className="">
            <div className="">
              <h4>Время брони парка в часах:</h4>
              <div className="flex items-center space-x-2">
                <p className="p-2 bg-white border-2 border-pale rounded-xl max-w-1/2">
                  {park.booking_window} часа
                </p>
                <Input
                  className="w-48 m-0 border-2 border-pale rounded-xl"
                  onChange={(e) =>
                    setParkInfo([
                      { ...parkInfo[0], booking_window: e.target.value },
                    ])
                  }
                  type="number"
                  placeholder="Введите новое значение"
                ></Input>
              </div>
            </div>
          </div>
          <div className="">
            <h4>Id Avito:</h4>
            <div className="flex items-center space-x-2">
              <p className="p-2 bg-white border-2 border-pale rounded-xl max-w-1/2">
                {park.avito_id ? park.avito_id : "Не указано"}
              </p>
              <Input
                className="w-48 m-0 border-2 border-pale rounded-xl"
                onChange={(e) =>
                  setParkInfo([{ ...parkInfo[0], avito_id: e.target.value }])
                }
                type="number"
                placeholder="Введите новое значение"
              ></Input>
            </div>
          </div>
          <div className="">
            <h4>Id telegram:</h4>
            <div className="flex items-center space-x-2">
              <p className="p-2 bg-white border-2 border-pale rounded-xl max-w-1/2">
                {park.telegram ? park.telegram : "Не указано"}
              </p>
              <Input
                className="w-48 m-0 border-2 border-pale rounded-xl"
                onChange={(e) =>
                  setParkInfo([{ ...parkInfo[0], telegram: e.target.value }])
                }
                type="number"
                placeholder="Введите новое значение"
              ></Input>
            </div>
          </div>
        </div>
        <Separator />
        <div className="my-4">
          <h4>URL парка для API:</h4>
          <div className="flex items-center space-x-2">
            <p className="p-2 bg-white border-2 border-pale rounded-xl max-w-1/2">
              {park.url ? park.url : "URL еще нет"}
            </p>
            <Input
              className="m-0 border-2 border-pale rounded-xl min-w-1/2"
              onChange={(e) =>
                setParkInfo([{ ...parkInfo[0], url: e.target.value }])
              }
              type="text"
              placeholder="Введите новое значение"
            ></Input>
          </div>
        </div>
        <Separator />

        {/* <div className="">
          <h4>Скидка самозанятым:</h4>
          <p>{park.self_employed_discount ? "Да" : "Нет"}</p>
          <Input
            onChange={(e) =>
              (parkInfo.self_employed_discount = Number(
                e.target.value
              ))
            }
            type="number"
            placeholder="Введите новое значение"
          />
        </div> */}
        <div className="flex mt-4">
          <Button
            onClick={updateParkInfo}
            variant={"default"}
            className="w-48 mx-auto"
          >
            Применить изменения
          </Button>
        </div>
      </div>
    </div>
  );
};

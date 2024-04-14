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
      <h3>Инфо парка {park.park_name}</h3>
      <div className="">
        <div className="flex items-center justify-between space-x-2">
          <div className="">Инфо парка</div>

          <Button className="w-1/3" onClick={handleKeyShow}>
            {isKeyShowed ? "Скрыть ключ" : "Показать ключ"}
          </Button>
        </div>
        <Separator />
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
        <div className="">
          <h4>Описание парка:</h4>
          <p className="whitespace-pre-line">
            {park.about ? park.about : "Описания еще нет"}
          </p>
          <textarea
            className="flex w-full resize-y"
            style={{ whiteSpace: "pre-line" }}
            onChange={(e) =>
              setParkInfo([{ ...parkInfo[0], about: e.target.value }])
            }
            placeholder="Введите новое значение"
          ></textarea>
        </div>
        <div className="">
          <h4>Комиссия парка:</h4>
          <p>{park.commission ? park.commission : "Комиссии еще нет"}</p>
          <Input
            onChange={(e) =>
              setParkInfo([{ ...parkInfo[0], commission: e.target.value }])
            }
            type="number"
            placeholder="Введите новое значение"
          ></Input>
        </div>
        <div className="">
          <h4>URL парка для API:</h4>
          <p>{park.url ? park.url : "URL еще нет"}</p>
          <Input
            onChange={(e) =>
              setParkInfo([{ ...parkInfo[0], url: e.target.value }])
            }
            type="text"
            placeholder="Введите новое значение"
          ></Input>
        </div>
        <div className="">
          <h4>Время брони парка в часах:</h4>
          <p>{park.booking_window}</p>
          <Input
            onChange={(e) =>
              setParkInfo([{ ...parkInfo[0], booking_window: e.target.value }])
            }
            type="number"
            placeholder="Введите новое значение"
          ></Input>
        </div>
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
        <Button onClick={updateParkInfo}>Применить изменения</Button>
      </div>
    </div>
  );
};

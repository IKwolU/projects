import { Body23, Cars3 } from "./api-client";
import { useState } from "react";
import PhoneInput from "@/components/ui/phone-input";
import { Button } from "@/components/ui/button";
import { client } from "./backend";
import { useRecoilState } from "recoil";
import { userAtom } from "./atoms";

export const CarCreateApplication = ({
  car,
  close,
  isModal = true,
}: {
  car: Cars3 | undefined;
  close: () => void;
  isModal?: boolean;
}) => {
  const [user] = useRecoilState(userAtom);
  const [phone, setPhone] = useState<string | undefined>(user && user.phone);
  const [isBooked, setIsBooked] = useState(false);

  const createApplication = async () => {
    await client.createApplicationDriver(
      new Body23({ car_id: car!.id, phone: phone })
    );
    setIsBooked(true);
  };

  const isPhoneFull = !phone?.includes("_") && phone;

  return (
    <>
      {isBooked && (
        <div className="p-4 text-center bg-white rounded-xl">
          <div>Спасибо за заявку!</div>
          <div className="mb-2">
            В ближайшее время с Вами свяжется наш Менеджер
          </div>
          <Button
            onClick={() => {
              setIsBooked(false);
              close();
            }}
          >
            Ок
          </Button>
        </div>
      )}
      {!isBooked && (
        <div className="p-4 bg-white rounded-xl ">
          <div className="mb-2 text-center">
            Оставьте свой номер телефона Менеджер свяжется с Вами в ближайшее
            время!
          </div>
          {!user && (
            <div className="">
              <PhoneInput onChange={(e) => setPhone(e.target.value)} />
            </div>
          )}
          {user && <div className="mb-2 text-xl text-center">{phone}</div>}
          <div className="flex space-x-2">
            {isModal && (
              <Button
                variant={"reject"}
                onClick={() => close()}
                className="text-black"
              >
                Отмена
              </Button>
            )}
            {!isPhoneFull && <Button disabled>Отправить</Button>}
            {isPhoneFull && (
              <Button onClick={() => createApplication()}>Отправить</Button>
            )}
          </div>
        </div>
      )}
    </>
  );
};

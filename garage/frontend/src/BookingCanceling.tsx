import { useState } from "react";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Bookings2 } from "./api-client";

export const BookingCanceling = ({
  close,
  success,
  booking,
}: {
  close: () => void;
  success: (value: string) => void;
  booking: Bookings2;
}) => {
  const [reason, setReason] = useState<string | null>(null);
  const [subReason, setSubReason] = useState<string | null>(null);

  const checkEnable = () => {
    if (!reason) {
      return true;
    }
    if (reason !== "Другое") {
      return false;
    }
    if (!subReason) {
      return true;
    }
    return false;
  };

  const handleChangeReason = (value: string) => {
    setReason(value);
    setSubReason(null);
  };

  const reasonList = [
    "Изменились планы",
    "Не понравилась модель машины",
    "Не устроили условия аренды",
    "Со мной не связались",
    "Другое",
  ];

  return (
    <div
      className="fixed top-0 left-0 z-[50] flex items-center justify-center w-full h-full bg-black bg-opacity-50"
      onClick={(e) => {
        if (e.currentTarget === e.target) {
          close();
        }
      }}
    >
      {booking && (
        <div className="relative w-full max-w-lg px-8 py-4 mx-2 bg-white rounded-xl">
          <FontAwesomeIcon
            className="absolute w-6 h-6 cursor-pointer top-5 right-8"
            icon={faXmark}
            onClick={() => close()}
          />
          <h3 className="mb-4 text-center">Отмена бронирования</h3>
          <p className="mb-4 text-center">
            Для отмены бронирования{" "}
            <span className="font-semibold">
              {booking.car!.brand} {booking.car!.model}{" "}
              {booking.car!.year_produced}
            </span>{" "}
            выберите причину
          </p>
          <RadioGroup
            defaultValue=""
            onValueChange={(value) => handleChangeReason(value)}
          >
            {reasonList.map((x, i) => (
              <div key={x} className="">
                <div className="flex items-center justify-between w-full">
                  <Label
                    htmlFor={`${i}`}
                    className="w-full py-2 text-base cursor-pointer"
                  >
                    {x}
                  </Label>
                  <div className="flex items-center px-1">
                    {" "}
                    <RadioGroupItem
                      value={x}
                      id={`${i}`}
                      className="w-5 h-5 border border-yellow"
                    />
                  </div>
                </div>
                {i !== reasonList.length - 1 && <Separator className="" />}
              </div>
            ))}
          </RadioGroup>
          {reason === "Другое" && (
            <Input
              type="text"
              onChange={(e) => setSubReason(e.target.value)}
              value={subReason ?? ""}
              placeholder="Введите причину отмены"
            />
          )}

          <div className="flex space-x-2">
            <Button
              disabled={checkEnable()}
              onClick={() =>
                success(reason + (subReason ? ": " + subReason : ""))
              }
              variant="reject"
              className="w-1/2 text-black"
            >
              Подтвердить
            </Button>
            <Button onClick={() => close()} className="w-1/2">
              Назад
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
